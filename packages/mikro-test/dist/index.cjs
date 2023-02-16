var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var src_exports = {};
__export(src_exports, {
  fixture: () => fixture,
  setTestFunction: () => setTestFunction
});
module.exports = __toCommonJS(src_exports);
var import_path2 = __toESM(require("path"));
var import_testing_library = require("@marko/testing-library");

// src/browser.ts
var import_jsdom = require("jsdom");
var import_jsdom_context_require = __toESM(require("jsdom-context-require"));
var import_register = __toESM(require("@marko/compiler/register"));
(0, import_register.default)({ meta: true, optimize: false });
var browser = (0, import_jsdom_context_require.default)({
  dir: __dirname,
  extensions: (0, import_register.default)({
    extensions: { ...require.extensions },
    optimize: false,
    output: "dom"
  }),
  virtualConsole: new import_jsdom.VirtualConsole().sendTo(console, {
    omitJSDOMErrors: true
  })
});

// src/snapshot.ts
var import_fs = __toESM(require("fs"));
var import_path = __toESM(require("path"));
var import_assert = __toESM(require("assert"));
var import_fixture_snapshots = require("@marko/fixture-snapshots");
var relatedErrors = [];
var UPDATE = process.env.UPDATE_MIKRO_SNAPSHOTS || process.argv.includes("--update-snapshots");
async function trySnapshot(dir, file, runner) {
  const parsed = import_path.default.parse(file);
  const snapshotDir = import_path.default.join(dir, "__snapshots__", parsed.dir);
  let title = parsed.name;
  let existingFiles;
  const utils = {
    title(newTitle) {
      ensureNoErrors();
      title = `${parsed.name}.${newTitle}`;
    },
    async snapshot(ext, rawData) {
      ensureNoErrors();
      const expectedFile = import_path.default.join(snapshotDir, `${title}.expected.${ext}`);
      const actualFile = import_path.default.join(snapshotDir, `${title}.actual.${ext}`);
      const data = format(rawData);
      const expected = await import_fs.default.promises.readFile(expectedFile, "utf-8").catch(noop);
      if (UPDATE || !expected) {
        await import_fs.default.promises.writeFile(expectedFile, data, "utf-8");
      } else {
        try {
          import_assert.default.strictEqual(data, expected);
        } catch (err) {
          await import_fs.default.promises.writeFile(actualFile, data, "utf-8");
          err.message = import_path.default.relative(process.cwd(), actualFile);
          err.snapshot = true;
          throw err;
        }
      }
    }
  };
  await import_fs.default.promises.mkdir(snapshotDir, { recursive: true });
  try {
    await runner(utils);
  } catch (err) {
    if (err.snapshot)
      throw err;
    if (UPDATE) {
      await Promise.all(
        (await (existingFiles || (existingFiles = import_fs.default.promises.readdir(snapshotDir)))).filter((file2) => file2.includes(`${title}.expected.`)).map((file2) => import_fs.default.promises.unlink(import_path.default.join(snapshotDir, file2)))
      );
    } else {
      const expectedError = await import_fs.default.promises.stat(import_path.default.join(snapshotDir, `${title}.error.expected.txt`)).catch(noop);
      if (!(expectedError && expectedError.isFile())) {
        throw err;
      }
    }
    title += ".error";
    await utils.snapshot("txt", err);
  }
}
function ensureNoErrors() {
  if (relatedErrors.length) {
    const err = relatedErrors.length > 1 ? new Error(relatedErrors.map((err2) => err2.stack).join("\n")) : relatedErrors[0];
    relatedErrors.length = 0;
    throw err;
  }
}
function format(data) {
  if (data) {
    if ("nodeType" in data) {
      return (0, import_fixture_snapshots.defaultSerializer)((0, import_fixture_snapshots.defaultNormalizer)(data));
    }
    if (data.stack) {
      return data.message.replace(/\x1B[[(?);]{0,2}(;?\d)*./g, "");
    }
  }
  return JSON.stringify(data);
}
function noop() {
}

// src/index.ts
var loaders = {
  node: require,
  web: browser.require
};
function getDefaultTestFunction() {
  if (typeof it !== "undefined") {
    return it;
  }
  if (typeof test !== "undefined") {
    return test;
  }
  console.warn("No test function found in environment. Use setTestFunction to set a test function.");
  return (n, t) => t();
}
var constructTest = getDefaultTestFunction();
function calldir() {
  const { stackTraceLimit, prepareStackTrace } = Error;
  try {
    const err = {};
    Error.stackTraceLimit = 2;
    Error.prepareStackTrace = (_, stack) => stack;
    Error.captureStackTrace(err, calldir);
    return import_path2.default.dirname(err.stack[1].getFileName());
  } finally {
    Error.stackTraceLimit = stackTraceLimit;
    Error.prepareStackTrace = prepareStackTrace;
  }
}
var Fixture = class extends Function {
  constructor(templatePath, { steps, dir }) {
    super();
    this.targets = ["node", "web"];
    this.steps = steps ?? [];
    this.templatePath = templatePath;
    this.dir = dir;
    return new Proxy(this, {
      apply: (target) => target.run()
    });
  }
  step(step) {
    if (step) {
      this.steps.push(step);
    }
    return this;
  }
  loadTemplate(target) {
    try {
      const template = loaders[target](this.templatePath);
      return (0, import_testing_library.render)(template);
    } catch (err) {
      console.error(err);
      throw err;
    }
  }
  rerender(context, input) {
    return context.rerender(input);
  }
  getTitle() {
    const filename = import_path2.default.parse(this.templatePath).name;
    return filename.trim().replace(/[^a-z0-9]/gi, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
  }
  async run() {
    for (const target of this.targets) {
      constructTest(`${target} ${this.templatePath}`, async () => {
        await trySnapshot(
          this.dir,
          import_path2.default.join(this.getTitle(), target),
          async ({ title, snapshot }) => {
            title("compile");
            const context = await this.loadTemplate(target);
            title("render");
            await snapshot("html", context.container);
            for (let i = 0; i < this.steps.length; i++) {
              const step = this.steps[i];
              if (typeof step === "function") {
                title(`step ${i}`);
                await step(context);
                this.rerender(context);
              } else {
                this.rerender(context, step);
              }
              await snapshot("html", context.container);
            }
          }
        );
      });
    }
  }
};
function fixture(templatePath, steps = []) {
  if (!Array.isArray(steps)) {
    steps = [steps];
  }
  const absPath = import_path2.default.join(calldir(), templatePath);
  return new Fixture(absPath, { steps, dir: calldir() });
}
function setTestFunction(testFunction) {
  constructTest = testFunction;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  fixture,
  setTestFunction
});
