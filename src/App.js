import React, { Component } from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";

import 'antd/dist/antd.css'; // or 'antd/dist/antd.less'

import AdminLayout from './layouts/AdminLayout/AdminLayout';
export default class App extends Component {

  render() {
    return (
      <Router>
        <Switch>
          <Route path="/" exact component={AdminLayout} />
          <Route path="/admin" component={AdminLayout} />
          <Redirect to="/admin" />
        </Switch>
      </Router>
    );
  }
}
