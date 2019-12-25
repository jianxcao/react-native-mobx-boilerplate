import React from 'react';
import hoistStatics from 'hoist-non-react-statics';
import { observer } from 'mobx-react';
import Module from './utils/module';
import Login from './login';
import Home from './home';
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

export const storesContext = React.createContext({ store });

/**
 * hooks获取store
 * 如 function Texx() {
 *  const { store } = useStores();
 * }
 */
export const useStores = types => {
  const store = React.useContext(storesContext);
  const stores = {};
  if (isPlainObject(types)) {
    const keys = Object.keys(types);
    keys.forEach(key => {
      const one = findStoreHelper(types[key], store);
      if (one) {
        stores[key] = one;
      }
    });
  } else {
    const result = findStoreHelper(types, store);
    stores.store = result;
  }
  return stores;
};

export function Proiver(props) {
  return (
    <storesContext.Provider value={store}>
      {props.children}
    </storesContext.Provider>
  );
}
/**
 * 取出一个store，根据路径
 * @param {Compoents} target
 * @param {String} types
 * @param {Object} opt
 */
export function connectStore(types, { forwardRef } = { forwardRef: true }) {
  return function connect(App) {
    App = observer(App);
    const Components = props => {
      return (
        <storesContext.Consumer>
          {value => {
            const stores = {};
            if (isPlainObject(types)) {
              const keys = Object.keys(types);
              keys.forEach(key => {
                const one = findStoreHelper(types[key], value);
                if (one) {
                  stores[key] = one;
                }
              });
            } else {
              const result = findStoreHelper(types, value);
              stores.store = result;
            }
            return (
              <App
                {...props}
                {...stores}
                dispatch={store.dispatch.bind(store)}
              />
            );
          }}
        </storesContext.Consumer>
      );
    };
    const displayName = `Connect(${App.displayName ||
      App.name ||
      'Component'})`;
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

function findStoreHelper(types, store) {
  if (!types) {
    return store;
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

export default store;

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
