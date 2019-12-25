import { actions } from 'mobx-react';
const moduleSymbol = Symbol('symbol');
const parentSymbol = Symbol('parentSymbol');
export default class Module {
  constructor(params) {
    this[moduleSymbol] = {};
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
  // 注册子模块
  registerModule(name, module) {
    if (this[moduleSymbol][name]) {
      return this;
    }
    if (module) {
      this[moduleSymbol][name] = module;
      module[parentSymbol] = this;
    }
  }
  // 移除子模块
  removeModule(name) {
    if (this[moduleSymbol][name]) {
      delete this[moduleSymbol][name];
    }
  }
  // 替换子模块
  replaceMdule(name, module) {
    if (module) {
      this[moduleSymbol][name] = module;
      module[parentSymbol] = this;
    }
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
