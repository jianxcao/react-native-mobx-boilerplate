import React from 'react';
import { Button, StyleSheet, View, Text } from 'react-native';
import AsyncStorage from '@/common/ls';
import { connectStore } from '@/store';
import { autorun } from 'mobx';
@connectStore({
  login: 'login',
  counter: 'login/counter',
})
class Login extends React.Component {
  static navigationOptions = {
    title: 'Please sign in',
  };

  componentDidMount() {
    autorun(() => {
      if (this.props.login.isLogin) {
        this.props.navigation.navigate('Home');
      }
    });
    if (this.props.login.isLogin) {
      this.props.navigation.navigate('Home');
    }
  }

  render() {
    const { counter } = this.props;
    return (
      <View style={styles.container}>
        <Text>{counter.count}</Text>
        <Button title='Sign in!' onPress={this._signInAsync} />
      </View>
    );
  }

  _signInAsync = async () => {
    this.props.dispatch('login/changeLogin', true);
    this.props.navigation.navigate('Home');
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
