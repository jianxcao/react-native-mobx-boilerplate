import { extendObservable, observable, set, action, runInAction } from 'mobx';

/**
 * 注入loading的状态，替代 @action，这个方法会自动注入loading的state，
 * 方便可以知道loading的状态，可以将action写成异步的，注意异步aciton需遵循mobx异步action的规则
 * @param {*} target 目标
 * @param {*} name 属性名称
 * @param {*} descriptor 描述对象
 */
export function loadingAction(target, name, descriptor) {
  let value = descriptor.value;

  if (!value || typeof value !== 'function') {
    return descriptor;
  }
  if (!value.isMobxAction) {
    value = action(value);
  }
  if (!target.loading) {
    target.loading = observable({});
    target.modelLoading = observable.box(true);
  }
  return {
    writable: true,
    configurable: true,
    enumerable: false,
    value: action(async function loadingRes(...arg) {
      set(this.loading, { [name]: true });
      this.modelLoading.set(true);
      try {
        const res = await value.apply(this, arg);
        return res;
      } catch (error) {
        console.error(error);
      } finally {
        runInAction(() => {
          set(this.loading, { [name]: false });
          this.modelLoading.set(false);
        });
      }
    }),
  };
}
