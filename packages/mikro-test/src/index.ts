import path from 'path';
import {render} from '@marko/testing-library'
import type * as Testing from "@marko/testing-library";
import {Template} from '@marko/testing-library/dist/shared';
import {browser} from './browser';

type InputObject = Record<string, any>;
type RenderContext = Testing.RenderResult & {};
type StepFunction = (context: RenderContext) => Promise<void> | void;

type Step = InputObject | StepFunction;

const loaders = {
  node: require,
  web: browser.require,
} as const;

// Defaults to a noop to fit testing environments that don't use global testing functions
let constructTest: Function = (n, t) => t();

function calldir() {
  const { stackTraceLimit, prepareStackTrace } = Error;
  try {
    const err = {} as any;
    Error.stackTraceLimit = 2;
    Error.prepareStackTrace = (_, stack) => stack;
    Error.captureStackTrace(err, calldir);
    return path.dirname(err.stack[1].getFileName());
  } finally {
    Error.stackTraceLimit = stackTraceLimit;
    Error.prepareStackTrace = prepareStackTrace;
  }
}

class Fixture extends Function {
  steps: Step[];

  templatePath: string;

  targets: string[] = ['node']; // todo: Make this configurable

  constructor(templatePath: string, steps?: Step[]) {
    super();
    this.steps = steps ?? [];
    this.templatePath = templatePath;
    // Allows this class to be called as a function
    return new Proxy(this, {
      apply: (target) => target.run()
    })
  }

  step(step: Step) {
    if(step) {
      this.steps.push(step);
    }
    return this;
  }

  loadTemplate(target) {
    try {
      const template = loaders[target](this.templatePath) as Template;
      return render(template);
    } catch(err) {
      console.error(err);
      throw err;
    }
  }

  async snapshot(target: string, step: number) {
    // todo: if in update mode, replace snapshot
    // otherwise compare existing snapshot to current snapshot
  }

  rerender(context: RenderContext, input?: InputObject) {
    return context.rerender(input);
  }

  async run() {
    for(const target of this.targets) {
      const context = await this.loadTemplate(target);
      constructTest(`${target} ${this.templatePath}`, async () => {
        for(const step of this.steps) {
          if(typeof step === 'function') {
            await step(context);
            this.rerender(context);
          } else {
            this.rerender(context, step);
          }
          // TODO: replace with actual number of step
          this.snapshot(target, 0);
        }
      });
    }
  }
}

export function fixture(templatePath: string, steps: Step | Step[] = []) {
  if(!Array.isArray(steps)) {
    steps = [steps];
  }
  const absPath = path.join(calldir(), templatePath);
  return new Fixture(absPath, steps as Step[]);
}

export function setTestFunction(testFunction: Function) {
  constructTest = testFunction;
}
