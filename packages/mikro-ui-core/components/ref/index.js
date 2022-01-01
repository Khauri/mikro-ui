const VOID = Symbol('VOID');

export class Ref extends Function {
  constructor(getter, onChange) {
    super();
    this.current = getter();
    this.onChange = onChange;
    return new Proxy(this, {
      apply: (target, thisArg, argArry) => this.value(argArry[0]),
    })
  }

  value(v = VOID) {
    if(v === VOID) {
      return this.current;
    }
    this.current = v;
    this.onChange(v);
  }
}
