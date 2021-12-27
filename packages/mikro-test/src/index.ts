import fs from 'fs';
import type * as Testing from "@marko/testing-library";

type InputObject = Record<string, any>;
type StepFunctionContext = Testing.RenderResult & {};
type StepFunction = (context: StepFunctionContext) => Promise<void> | void;

type Step = InputObject | StepFunction;

class Fixture extends Function {
  steps: Step[];

  templatePath: string;

  targets: string[] = ['node', 'web']; // todo: Make this configurable

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

  async loadTemplate() {
    // todo: load template
  }

  async updateInput() {
    // todo: update input
  }

  async snapshot(target: string, step: number) {
    // todo: if in update mode, replace snapshot
    // otherwise compare existing snapshot to current snapshot
  }

  async rerender() {
    // todo: rerender and wait for rerender to complete
  }

  async run() {
    this.loadTemplate();
    for(const target of this.targets) {
      for(const step of this.steps) {
        if(typeof step === 'function') {
          // todo: replace with actual context
          await step({} as StepFunctionContext);
        } else {
          await this.updateInput();
        }
        await this.rerender();
        // TODO: replace with actual number of step
        this.snapshot(target, 0);
      }
    }
  }
}

export function fixture(templatePath: string, steps: Step | Step[] = []) {
  if(!Array.isArray(steps)) {
    steps = [steps];
  }
  return new Fixture(templatePath, steps as Step[]);
}
