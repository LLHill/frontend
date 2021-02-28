import React, { Component } from 'react';
import { Switch, Route } from "react-router-dom";

import { Layout, Typography } from 'antd';
import {
  DesktopOutlined,
  ReadOutlined,
  PieChartOutlined
} from '@ant-design/icons';

import SideDrawer from '../../components/Navigation/SideDrawer/SideDrawer';
import Dashboard from '../../pages/lecturer/Dashboard/Dashboard';
import Courses from '../../pages/lecturer/Courses/Courses';
import Reports from '../../pages/lecturer/Reports/Reports';

const { Content, Footer } = Layout;
const { Title } = Typography;

export default class LecturerLayout extends Component {
  render() {
    const { token, onError } = this.props;

    return (
      <Layout style={{ minHeight: '100vh' }}>
        <SideDrawer
          elements={[
            { key: 1, text: 'Dashboard', to: '/', icon: <DesktopOutlined /> },
            { key: 2, text: 'Courses', to: '/courses', icon: <ReadOutlined /> },
            { key: 3, text: 'Reports', to: '/reports', icon: <PieChartOutlined /> }
          ]}
          dividerHeight='55vh'
        />
        <Layout className="site-layout">
          <Content style={{ margin: '0 16px' }}>
            <Switch>
              <Route path={`/`} exact render={() => <Dashboard token={token} onError={onError} />} />
              <Route path={`/courses`} render={() => <Courses token={token} onError={onError} />} />
              <Route path={`/reports`} render={() => <Reports token={token} onError={onError} />} />
              <Route component={() => <Title>404 Not Found</Title>} />
            </Switch>
          </Content>
          <Footer style={{ textAlign: 'center' }}>Presence ©2021 Created by HCMIU</Footer>
        </Layout>
      </Layout>
    )
  }
}
