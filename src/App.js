import React, { Component } from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";

import 'antd/dist/antd.css'; // or 'antd/dist/antd.less'

import AdminLayout from './layouts/AdminLayout/AdminLayout';
import LecturerLayout from './layouts/LecturerLayout/LecturerLayout';
import LoginLayout from './layouts/LoginLayout/LoginLayout';

import axios from './axios-instance';

export default class App extends Component {
  state = {
    isAuth: false,
    token: null,
    userId: null,
    isAdmin: false,
    error: null
  };

  componentDidMount() {
    const token = localStorage.getItem('token');
    const expiryDate = localStorage.getItem('expiryDate');
    const isAdmin = localStorage.getItem('isAdmin');

    if (!token || !expiryDate || !isAdmin)
      return;
    if (new Date(expiryDate) <= new Date()) {
      this.logoutHandler();
      return;
    }
    const userId = localStorage.getItem('userId');
    const remainingMilliseconds = new Date(expiryDate).getTime() - new Date().getTime();
    this.setState({ isAuth: true, token, userId, isAdmin });
    this.setAutoLogout(remainingMilliseconds);
  }

  loginHandler = (values) => {
    const { isAdminLogin, email, password } = values;
    console.log(values);
    let path = '/login';
    if (isAdminLogin)
      path = '/admin/login';

    axios.post(path, { email, password })
      .then(res => {
        if (res.status === 422)
          throw new Error('Validation failed.');
        if (res.status !== 200 && res.status !== 201) {
          console.log('Error!');
          throw new Error('Could not authenticate!');
        }
        return res.data;
      })
      .then(resData => {
        console.log(resData);
        this.setState({
          isAuth: true,
          token: resData.token,
          userId: resData.userId,
          isAdmin: isAdminLogin
        });
        localStorage.setItem('token', resData.token);
        localStorage.setItem('isAdmin', isAdminLogin);
        localStorage.setItem('userId', resData.userId);
        const remainingMilliseconds = 60 * 60 * 1000; // 1hour
        const expiryDate = new Date(
          new Date().getTime() + remainingMilliseconds
        );
        localStorage.setItem('expiryDate', expiryDate.toISOString());
        this.setAutoLogout(remainingMilliseconds);
      })
      .catch(err => console.log(err));
  };

  logoutHandler = () => {
    this.setState({ isAuth: false, token: null, userId: null, isAdmin: false });
    localStorage.removeItem('token');
    localStorage.removeItem('expiryDate');
    localStorage.removeItem('userId');
    localStorage.removeItem('isAdmin');
  };

  setAutoLogout = milliseconds => {
    setTimeout(() => this.logoutHandler(), milliseconds);
  };

  render() {
    const { isAuth, token, userId, isAdmin } = this.state;

    let routes = (
      <Switch>
        <Route exact path='/'
          render={props => (
            <LoginLayout
              onLogin={this.loginHandler}
            />
          )}
        />
        <Redirect to='/' />
      </Switch>
    );

    if (isAuth)
      routes = (
        <Switch>
          {
            isAdmin ?
              <Route path='/'
                render={props => (
                  <AdminLayout
                    token={token}
                    userId={userId}
                    onLogout={this.logoutHandler}
                  />
                )}
              /> :
              <Route path='/'
                render={props => (
                  <LecturerLayout
                    token={token}
                    userId={userId}
                    onLogout={this.logoutHandler}
                  />
                )}
              />
          }
        </Switch>
      );
    return (
      <Router>
        <Switch>
          {routes}
        </Switch>
      </Router>
    );
  }
}
