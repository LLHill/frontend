import React from 'react';
import { Route, Switch } from 'react-router-dom';
import classes from './App.css';

import Layout from './hoc/Layout/Layout';
import AuxWithClass from './hoc/Auxiliary/AuxWithClass/AuxWithClass';
import Course from './containers/Course/Course';
import Home from './containers/Home/Home';
import Report from './containers/Report/Report';

function App() {
  return (
    <Layout>
      <Switch>
        <Route exact path='/' component={Home} />
        <Route path='/course' component={Course} />
        <Route path='/report' component={Report} />
        <Route render={() => <h1>404 Not Found!!!</h1>} />
      </Switch>
    </Layout>
  );
}

export default AuxWithClass(App, classes.App);
