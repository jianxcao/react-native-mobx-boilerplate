// src/stores/counter-store.tsx
import { observable, action, computed } from 'mobx';

import Module from '../utils/module';

class Home extends Module {
  constructor() {
    super();
  }
  @observable
  home = {
    title: 'coco',
  };

  @action
  changeLogin(isLogin = false) {
    this.dispatch('login/changeLogin', isLogin, { root: true });
  }
}

export default Home;
