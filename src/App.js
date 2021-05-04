import React, { Component, Fragment } from 'react';
import { Switch, Route, Redirect, withRouter } from "react-router-dom";

import 'antd/dist/antd.css'; // or 'antd/dist/antd.less'

import AdminLayout from './layouts/AdminLayout/AdminLayout';
import LecturerLayout from './layouts/LecturerLayout/LecturerLayout';
import LoginLayout from './layouts/LoginLayout/LoginLayout';
import ChangePassword from './layouts/ChangePassword/ChangePassword';

import axios from './axios-instance';
import { ErrorHandler } from './components/ErrorHandler/ErrorHandler';

class App extends Component {
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
    const isAdminString = localStorage.getItem('isAdmin');

    if (!token || !expiryDate || !isAdminString)
      return;
    if (new Date(expiryDate) <= new Date()) {
      this.logoutHandler();
      return;
    }

    const isAdmin = isAdminString === 'false' ? false : true;
    const userId = localStorage.getItem('userId');
    const remainingMilliseconds = new Date(expiryDate).getTime() - new Date().getTime();
    this.setState({ isAuth: true, token, userId, isAdmin });
    this.setAutoLogout(remainingMilliseconds);
  }

  loginHandler = (values) => {
    const { isAdminLogin, email, password } = values;
    console.log(values);
    let path = '/lecturer/login';
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
        this.setState({
          isAuth: true,
          token: resData.token,
          userId: resData.token,
          isAdmin: isAdminLogin
        });
        localStorage.setItem('token', resData.token);
        localStorage.setItem('isAdmin', isAdminLogin);
        localStorage.setItem('userId', resData.userId);
        const expiryDate = new Date(
          new Date().getTime() + resData.expireTime
        );
        localStorage.setItem('expiryDate', expiryDate.toISOString());
        this.setAutoLogout(resData.expireTime);
      })
      .catch(err => {
        console.log(err);
        this.setState({
          isAuth: false,
          error: err
        });
      });
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

  setError = (error) => {
    this.setState({ error });
    console.log(error);
  }

  errorHandler = () => {
    this.setState({ error: null });
  }

  render() {
    const { isAuth, token, userId, isAdmin, error } = this.state;

    let routes = (
      <Switch>
        <Route exact path='/'
          render={props => (
            <LoginLayout
              onLogin={this.loginHandler}
              onError={this.setError}
            />
          )}
        />
        <Redirect to='/' />
      </Switch>
    );

    if (isAuth)
      routes = (
        isAdmin ?
          <Switch>
            <Route
              path='/password'
              render={() => (
                <ChangePassword />
              )}
            />
            <Route path='/'
              render={() => (
                <AdminLayout
                  token={token}
                  userId={userId}
                  onLogout={this.logoutHandler}
                  onError={this.setError}
                />
              )}
            />
          </Switch>
          :
          <Switch>
            <Route
              path='/password'
              render={() => (
                <ChangePassword />
              )}
            />
            <Route path='/'
              render={() => (
                <LecturerLayout
                  token={token}
                  userId={userId}
                  onLogout={this.logoutHandler}
                  onError={this.setError}
                />
              )}
            />
          </Switch>
      );
    return (
      <Fragment>
        <ErrorHandler error={error} onHandle={this.errorHandler} />
        <Switch>
          {routes}
        </Switch>
      </Fragment>
    );
  }
};

export default withRouter(App);

/*
  TODO:
  Add loading to table
 */