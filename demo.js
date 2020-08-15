const _typeof = 1;
const id = Symbol('id');
class Foo {
  constructor() {
    this.baz = (...args) => {
      this.log(...arg)
    };
  }
  async bar() {}
  log() {}
  [id]() {
    console.log(typeof id);
  }
}

const foo = new Foo();
const Bar = () => {}
const bar = new Bar()
console.log(foo instanceof Foo);
