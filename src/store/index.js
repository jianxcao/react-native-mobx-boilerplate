import React, { useEffect, useRef } from 'react';
import hoistStatics from 'hoist-non-react-statics';
import { observer } from 'mobx-react';
import Module from './utils/module';
import Login from './login';
import Home from './home';
import { spy } from 'mobx';
const modules = {
  login: new Login(),
  home: new Home(),
};

class Store extends Module {
  constructor() {
    super();
    Object.keys(modules).forEach(name => {
      this.registerModule(name, modules[name]);
    });
  }
}
const store = new Store();
window.store = store;

// autorun(() => {
//   console.log('root change', Object.keys(store.module));
// });

// autorun(() => {
//   const types = 'login';
//   const res = findModule(store, types);
//   console.log(res);
// });
spy(event => {
  if (event.type === 'action') {
    console.log('event', event);
    console.log(`${event.name} with args: ${event.arguments}`);
  }
});

export default store;

export const storesContext = React.createContext({ store });

/**
 * hooks获取store
 * 如 function Texx() {
 *  const { store } = useStores();
 * }
 */
export const useStores = types => {
  const res = React.useContext(storesContext);
  return findModule(res.store, types);
};

export const Proiver = function(props) {
  return (
    <storesContext.Provider value={{ store }}>
      {props.children}
    </storesContext.Provider>
  );
};

function findModule(store, types) {
  const res = {};
  if (isPlainObject(types)) {
    const keys = Object.keys(types);
    keys.forEach(key => {
      const one = store.findModule(types[key]);
      if (one) {
        res[key] = one;
      }
    });
  } else {
    const result = store.findModule(types);
    res.store = result;
  }
  return res;
}

/**
 * 取出一个store，根据路径
 * @param {Compoents} target
 * @param {String} types
 * @param {Object} opt
 */
export function connectStore(types, { forwardRef } = { forwardRef: true }) {
  return function connect(App) {
    const displayName = `Connect(${App.displayName ||
      App.name ||
      'Component'})`;
    App = observer(App);
    const Components = observer(props => {
      let stores = useStores(types);
      return (
        <App {...props} {...stores} dispatch={store.dispatch.bind(store)} />
      );
    });
    Components.displayName = displayName;
    if (forwardRef) {
      const forwarded = React.forwardRef(function forwardConnectRef(
        props,
        ref,
      ) {
        return <Components {...props} forwardedRef={ref} />;
      });

      forwarded.displayName = `forward${displayName}`;
      forwarded.WrappedComponent = Components;
      return hoistStatics(forwarded, Components);
    }
    return hoistStatics(Components, App);
  };
}

/** Checks to see if a value is an object */
export function isObject(value) {
  // null is object, hence the extra check
  return value !== null && typeof value === 'object';
}

/** Checks to see if a value is an object and only an object */
export function isPlainObject(value) {
  /* eslint no-proto:0 */
  return isObject(value) && value.__proto__ === Object.prototype;
}
