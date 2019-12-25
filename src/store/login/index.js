// src/stores/counter-store.tsx
import { observable, action, computed } from 'mobx';
import Module from '../utils/module';

export default class Login extends Module {
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
