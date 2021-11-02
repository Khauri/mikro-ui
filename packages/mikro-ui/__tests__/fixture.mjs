// Adapted from https://github.com/marko-js/tags-api-preview/blob/main/src/__tests__/fixture.ts

import * as path from 'path';
import {createRequire} from 'module';

const require = createRequire(import.meta.url);

const targets = {
  node: require,
};

// No clue why this is necessary
function calldir() {
  const {stackTraceLimit, prepareStackTrace} = Error;
  try {
    const err = {};
    Error.stackTraceLimit = 2;
    Error.prepareStackTrace = (_, stack) => stack;
    Error.captureStackTrace(err, calldir);
    return path.dirname(err.stack[1].getFileName());
  } finally {
    Error.stackTraceLimit = stackTraceLimit;
    Error.prepareStackTrace = prepareStackTrace;
  }
}

export default (
  file,
  stepsOrInput,
) => {
  const dir = calldir();
  let [input, ...steps] = Array.isArray(stepsOrInput)
    ? stepsOrInput
    : [stepsOrInput];

  if (typeof input === "function") {
    steps = [input, ...steps];
    input = undefined;
  }

  input ||= {};
  file = path.resolve(dir, file);

  return () => {
    for (const target in targets) {
      const load = targets[target];
      describe(target, function () {
        const helpers = load("@marko/testing-library");
        test(target, async() => {
          // const fireEvent = load("./fire-event").default;
          const title = expect.getState().currentTestName.replace(new RegExp(`${target} ${target}$`), '');
          const template = await import(file);
          const renderResult = await template.render();
          console.log(renderResult);
        })

        // await trySnapshot(
        //   dir,
        //   path.join(title, target),
        //   async ({ title, snapshot }) => {
        //     title("compile");

        //     const template = load(file);

        //     title("render");

        //     const fixtureHelpers = {
        //       expect: chai.expect,
        //       ...helpers,
        //       fireEvent,
        //       ...(await helpers.render(template, input)),
        //     } as FixtureHelpers;

        //     await snapshot("html", fixtureHelpers.container);

        //     if (target !== "node") {
        //       for (let i = 0; i < steps.length; i++) {
        //         const step = steps[i];
        //         title(`step-${i}`);
        //         if (typeof step === "function") {
        //           await step(fixtureHelpers);
        //         } else {
        //           await fixtureHelpers.rerender(step);
        //         }

        //         await snapshot("html", fixtureHelpers.container);
        //       }
        //     }
        //   }
        // );
      });
    }
  };
};