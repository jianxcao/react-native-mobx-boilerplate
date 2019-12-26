import {
  observable,
  computed,
  set,
  get,
  remove,
  has,
  action,
  decorate,
} from 'mobx';
const moduleSymbol = Symbol('moduleSymbol');
const parentSymbol = Symbol('parentSymbol');

export default class Module {
  constructor() {
    this[moduleSymbol] = observable({});
  }
  get module() {
    return this[moduleSymbol];
  }
  get root() {
    let p = this;
    while (p.parent) {
      p = p.parent;
    }
    return p || null;
  }
  get parent() {
    return this[parentSymbol] || null;
  }
  get isRoot() {
    return this.parent === null;
  }
  /**
   * 查找一个模块，
   * @param {*} type 模块名称 用/区分模块层级
   * @param {*} isRoot
   */
  findModule(types, isRoot = false) {
    if (!types) {
      return this;
    }
    let store = this;
    if (isRoot) {
      store = store.root;
    }
    if (typeof types === 'string') {
      types = types.split('/');
      for (let i = 0; i < types.length; i++) {
        const module = store.module;
        if (module[types[i]]) {
          store = module[types[i]];
        } else {
          return null;
        }
      }
      return store;
    }
    return null;
  }
  // 注册子模块
  registerModule(name, module) {
    if (!module instanceof Module) {
      throw new Error('store must extends Module class');
    }
    if (has(this[moduleSymbol], name)) {
      return this;
    }
    if (module) {
      set(this[moduleSymbol], { [name]: module });
      module[parentSymbol] = this;
    }
  }

  // 移除子模块
  removeModule(name) {
    if (this[moduleSymbol][name]) {
      remove(this[moduleSymbol], name);
    }
  }
  // 替换子模块
  replaceMdule(name, module) {
    if (!module instanceof Module) {
      throw new Error('store must extends Module class');
    }
    if (module) {
      set(this[moduleSymbol], { [name]: module });
      module[parentSymbol] = this;
    }
    return this;
  }
  // 触发action
  dispatch(type, payload, { root } = { root: false }) {
    let m = this;
    if (root) {
      m = this.root;
    }
    let types = type.split('/');
    const name = types.slice(-1);
    types = types.slice(0, types.length - 1);
    let method;
    // 调用子模块的action
    if (types.length > 0) {
      for (let i = 0; i < types.length; i++) {
        const t = types[i];
        if (m.module[t]) {
          m = m.module[t];
        } else {
          return console.error(`没有找到${type}的action`);
        }
      }
      method = m[name];
    } else {
      method = this[name];
    }
    if (!method || !method.isMobxAction) {
      return console.error(`没有找到${type}的action`);
    }
    return method.call(m, payload);
  }
}
decorate(Module, {
  [moduleSymbol]: observable,
  module: computed,
  registerModule: action,
  removeModule: action,
  replaceMdule: action,
});
