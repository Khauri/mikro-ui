var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __markAsModule = (target) => __defProp(target, "__esModule", { value: true });
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __reExport = (target, module2, copyDefault, desc) => {
  if (module2 && typeof module2 === "object" || typeof module2 === "function") {
    for (let key of __getOwnPropNames(module2))
      if (!__hasOwnProp.call(target, key) && (copyDefault || key !== "default"))
        __defProp(target, key, { get: () => module2[key], enumerable: !(desc = __getOwnPropDesc(module2, key)) || desc.enumerable });
  }
  return target;
};
var __toCommonJS = /* @__PURE__ */ ((cache) => {
  return (module2, temp) => {
    return cache && cache.get(module2) || (temp = __reExport(__markAsModule({}), module2, 1), cache && cache.set(module2, temp), temp);
  };
})(typeof WeakMap !== "undefined" ? /* @__PURE__ */ new WeakMap() : 0);

// src/index.ts
var src_exports = {};
__export(src_exports, {
  fixture: () => fixture
});
var Fixture = class extends Function {
  constructor(templatePath, steps) {
    super();
    this.targets = ["node", "web"];
    this.steps = steps ?? [];
    this.templatePath = templatePath;
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
  async loadTemplate() {
  }
  async updateInput() {
  }
  async snapshot(target, step) {
  }
  async rerender() {
  }
  async run() {
    this.loadTemplate();
    for (const target of this.targets) {
      for (const step of this.steps) {
        if (typeof step === "function") {
          await step({});
        } else {
          await this.updateInput();
        }
        await this.rerender();
        this.snapshot(target, 0);
      }
    }
  }
};
function fixture(templatePath, steps = []) {
  if (!Array.isArray(steps)) {
    steps = [steps];
  }
  return new Fixture(templatePath, steps);
}
module.exports = __toCommonJS(src_exports);
