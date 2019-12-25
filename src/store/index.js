import Login from './login';
import Module from './utils/module';

const modules = {
  login: new Login(),
};

class Store extends Module {
  constructor() {
    super();
    Object.keys(modules).forEach(name => {
      this.registerModule(name, modules[name]);
    });
  }
}

export default new Store();
