import React from 'react';
import { Button, StyleSheet, View, Text } from 'react-native';
import { connectStore } from '@/store';
import { autorun, toJS, observable, action } from 'mobx';
@connectStore({
  login: 'login',
  counter: 'login/counter',
})
class Login extends React.Component {
  static navigationOptions = {
    title: 'Please sign in',
  };
  @observable test = 1;
  componentDidMount() {
    this.loginDisposer = autorun(() => {
      if (this.props.login.isLogin) {
        this.props.navigation.navigate('Home');
      }
    });
    if (this.props.login.isLogin) {
      this.props.navigation.navigate('Home');
    }
  }
  componentWillUnmount() {
    if (this.loginDisposer) {
      this.loginDisposer();
    }
  }

  render() {
    const { counter, login } = this.props;
    return (
      <View style={styles.container}>
        <Text>test:{this.test}</Text>
        <Text>count:{counter.count}</Text>
        <Text>obj:{JSON.stringify(toJS(login.obj))}</Text>
        <Text>loading status:{JSON.stringify(toJS(login.loading))}</Text>
        <Button title='Sign in!' onPress={this.handleSignIn} />
        <Button title='change' onPress={this.changeObj} />
      </View>
    );
  }

  handleSignIn = async () => {
    this.props.dispatch('login/changeLogin', true);
    this.props.navigation.navigate('Home');
  };
  changeObj = () => {
    this.props.dispatch('login/changeObj', { b: 1 });
    // this.test = 2;
    // this.props.login.obj = { b: 1 };
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Login;
