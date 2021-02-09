import React, { Component } from 'react';
import { Switch, Route } from "react-router-dom";

import { Layout, Typography } from 'antd';
import {
  DesktopOutlined,
  ReadOutlined,
  PieChartOutlined,
  KeyOutlined
} from '@ant-design/icons';

import SideDrawer from '../../components/Navigation/SideDrawer/SideDrawer';
import Dashboard from '../../pages/lecturer/Dashboard/Dashboard';
import Courses from '../../pages/lecturer/Courses/Courses';
import Reports from '../../pages/lecturer/Reports/Reports';

const { Content, Footer } = Layout;
const { Title } = Typography;

export default class LecturerLayout extends Component {
  render() {
    return (
      <Layout style={{ minHeight: '100vh' }}>
        <SideDrawer
          elements={[
            { key: 1, text: 'Dashboard', to: '/', icon: <DesktopOutlined /> },
            { key: 2, text: 'Courses', to: '/courses', icon: <ReadOutlined /> },
            { key: 3, text: 'Reports', to: '/reports', icon: <PieChartOutlined /> },
            { key: 4, text: 'Admin (for dev)', to: '/admin', icon: <KeyOutlined /> },
          ]}
        />
        <Layout className="site-layout">
          {/* <Header className="site-layout-background" style={{ padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }} >
            <Badge count={5} style={{ margin: '0 1.5rem' }}>
              <Avatar
                size={{ xs: 10, sm: 14, md: 18, lg: 30, xl: 34, xxl: 36 }}
                style={{ color: '#f56a00', backgroundColor: '#fde3cf', margin: '0 1.5rem' }}
              >C</Avatar>
            </Badge>
          </Header> */}
          <Content style={{ margin: '0 16px' }}>
            <Switch>
              <Route path={`/`} exact component={Dashboard} />
              <Route path={`/courses`} exact component={Courses} />
              <Route path={`/reports`} exact component={Reports} />
              <Route component={()=><Title>404 Not Found</Title>} />
            </Switch>
          </Content>
          <Footer style={{ textAlign: 'center' }}>Presence ©2021 Created by HCMIU</Footer>
        </Layout>
      </Layout>
    )
  }
}
