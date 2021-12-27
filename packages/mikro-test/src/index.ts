import path from 'path';
import {render} from '@marko/testing-library'
import type * as Testing from "@marko/testing-library";
import {Template} from '@marko/testing-library/dist/shared';
import {browser} from './browser';
import {trySnapshot, trackError} from './snapshot';

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

  dir: string;

  constructor(templatePath: string, {steps, dir}) {
    super();
    this.steps = steps ?? [];
    this.templatePath = templatePath;
    this.dir = dir;
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

  rerender(context: RenderContext, input?: InputObject) {
    return context.rerender(input);
  }

  getTitle() {
    return this.templatePath.trim().replace(/[^a-z0-9]/gi, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
  }

  async run() {
    for(const target of this.targets) {
      constructTest(`${target} ${this.templatePath}`, async () => {
        await trySnapshot(
          this.dir,
          path.join(target, this.getTitle()),
          async ({title, snapshot}) => {
            title("compile");
            const context = await this.loadTemplate(target);
            title("render");
            await snapshot("html", context.container);
            for(let i = 0; i < this.steps.length; i++) {
              const step = this.steps[i];
              if(typeof step === 'function') {
                title(`step ${i}`);
                await step(context);
                this.rerender(context);
              } else {
                this.rerender(context, step);
              }
              await snapshot("html", context.container);
            }
          }
        )
      });
    }
  }
}

export function fixture(templatePath: string, steps: Step | Step[] = []) {
  if(!Array.isArray(steps)) {
    steps = [steps];
  }
  const absPath = path.join(calldir(), templatePath);
  return new Fixture(absPath, {steps, dir: calldir()});
}

export function setTestFunction(testFunction: Function) {
  constructTest = testFunction;
}
