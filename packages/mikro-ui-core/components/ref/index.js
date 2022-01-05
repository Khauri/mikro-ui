const VOID = Symbol("VOID");

export class Ref extends Function {
  constructor(value, onChange) {
    super();
    if (typeof value !== "function") {
      throw new TypeError("ref value must be a function");
    }
    this.current = value();
    this.onChange = onChange;
    return new Proxy(this, {
      apply: (target, thisArg, argArry) => this.value(argArry[0])
    });
  }

  clone() {
    return new Ref(() => this.current, this.onChange);
  }

  forceUpdate() {
    this.onChange(this.current, this.clone());
  }

  value(v = VOID) {
    if (v === VOID) {
      return this.current;
    }
    this.current = v;
    this.onChange(v, this.clone());
  }
}
