// src/stores/counter-store.tsx
import {
  observable,
  action,
  computed,
  extendObservable,
  runInAction,
} from 'mobx';
import Module from '../utils/module';
import { loadingAction } from '../utils/helper';

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
    extendObservable(
      this,
      {
        obj: {},
      },
      {},
    );
  }
  @observable
  isLogin = false;
  sleep(time = 0) {
    return new Promise(res => {
      setTimeout(() => {
        res();
      }, time || 0);
    });
  }
  @action
  changeLogin(isLogin = false) {
    this.isLogin = isLogin;
  }
  // 异步aciton当这个方法调用钱设置loading.changeObj = false,调用后为true
  @loadingAction
  async changeObj(obj) {
    // 注意此处应该遵循mobx的action规则，调用异步后必须从新调用action方法，或者runInAction
    await this.sleep(3000);
    runInAction(() => {
      this.obj = obj;
    });
  }
}

window.Login = Login;
