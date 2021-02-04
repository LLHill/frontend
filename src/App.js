import React, { Component } from 'react';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import 'antd/dist/antd.css'; // or 'antd/dist/antd.less'

import BasicLayout from './layouts/BasicLayout/BasicLayout';
export default class App extends Component {

  render() {
    return (
      <Router>
        <BasicLayout />
        <Switch>
          <Route path="" exact component={null} />
        </Switch>
      </Router>
    );
  }
}
