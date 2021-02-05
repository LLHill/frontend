import React, { Component } from 'react';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import 'antd/dist/antd.css'; // or 'antd/dist/antd.less'

import AdminLayout from './layouts/AdminLayout/AdminLayout';
import LecturerLayout from './layouts/LecturerLayout/LecturerLayout';
export default class App extends Component {

  render() {
    return (
      <Router>
        <Switch>
          <Route path="/admin" component={AdminLayout} />
          <Route path="/" component={LecturerLayout} />
        </Switch>
      </Router>
    );
  }
}
