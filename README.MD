# 项目说明

## store 说明

- store 必须继承 src/store/utils/module
- store 如果需要互相调用请在 src/store/index 中注册

> 如

```javascript
const modules = {
  login: new Login(),
  home: new Home(),
};
```

- 通过`src/store/index` 中的 `useStores` 和 `connectStore` 去链接组件

> 如

```javascript
// 这样会将login的store作为props注入到home组件中，mobx的observer已经自动注入无需关心
// 会在props上有dispatch方法，为root节点的dispatch方法
@connectStore({
  login: 'login',
})
class Home {
	componentDidMount() {
		//以下三种方法都是调用login的store的changeLogin的action
		// 根组件的disptch
		this.dispatch('login/changeLogin', false);
		//当前store的dispatch，同上
		this.props.login.dispatch('changeLogin', false);
		// 直接调用action,同上
		this.props.login.changeLogin(false)
	}
	render() {
		return <Text>{{this.props.login.isLogin}}</Text>
	}
}

// 这样会注入一个props叫store，store指向 login，mobx的observer已经自动注入无需关心
// 会在props上有dispatch方法，为root节点的dispatch方法
@connectStore('login')
class Home1 {
	componentDidMount() {
		// 根组件的disptch
		this.dispatch('login/changeLogin', false);
	}
	render() {
		return <Text>{{this.props.store.isLogin}}</Text>
	}
}

// 函数式组件可以用useStores获取 各个store，但是需要自己用observer包裹下
function Home() {
  const { login } = useStores({ login: 'login' });
  // login.dispatch('login/changeLogin') 修改login状态
  return <Text>{ login.isLogin }</Text>
}
export default observer(Home);
```

### store 中 module 的说明

> store 继承 module 后，会形成层级关系，并在 store 上会有 `dispatch`, `registerModule` `removeModule` `replaceMdule` 方法。

> store 中有 module 属性（可读属性）,所有子模块都在 module 属性中，通过层级挂接

> 当前 sotre 的 dispatch 方法可以调用子组件的 action 如: `login.disaptch('counter/add')`是指调用 login 下的 counter 的 add action

> 如果想从根组件调用可以是`login.dispatch('login/counter/add', {root: true})`，表示从跟组件查询

### 为啥要有层级？？

> 通过层级关系可以快速的在 store 中相互调用，方便操作数据，如果没有数据相互调用的需求，可以直接在组件中自己操作 store，不必注入全局

### 有啥限制？

> 由于 store 的子模块是在 new 的时候才进行注入，所以在 new 的时候，即在构造器中，如果需要相互调用 store 需要小心，得保证对应的子模块已经注入，才能调用
