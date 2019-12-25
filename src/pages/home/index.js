import React from 'react';
import { View, Text, Button } from 'react-native';
import { connectStore } from '@/store';
import NaviBar from 'react-native-pure-navigation-bar';
import { autorun } from 'mobx';
@connectStore({
  login: 'login',
  counter: 'login/counter',
  home: 'home',
})
class HomeScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };
  componentDidMount() {
    autorun(() => {
      if (!this.props.login.isLogin) {
        this.props.navigation.navigate('Login');
      }
    });
  }
  render() {
    return (
      <>
        <NaviBar title='Home' leftElement={null} />
        <View
          style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text>Home Screen</Text>
          <Button title='logout' onPress={this.handleLogout} />
        </View>
      </>
    );
  }
  handleLogout = () => {
    this.props.dispatch('login/changeLogin', false);
    // test for counter increment
    this.props.dispatch('login/counter/increment');
  };
}

export default HomeScreen;
