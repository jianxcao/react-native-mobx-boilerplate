// src/stores/counter-store.tsx
import { observable, action, computed } from 'mobx';
import Module from '../utils/module';

class Counter extends Module {
  @observable
  count = 0;

  @action
  increment() {
    this.count++;
  }

  @action
  decrement() {
    this.count--;
  }

  @computed
  get doubleCount() {
    return this.count * 2;
  }
}

export default class Login extends Module {
  constructor() {
    super();
    this.registerModule('counter', new Counter());
  }
  @observable
  isLogin = false;

  @action
  changeLogin(isLogin = false) {
    this.isLogin = isLogin;
  }
}

window.Login = Login;
