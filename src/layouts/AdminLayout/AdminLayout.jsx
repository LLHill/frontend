import React, { Component } from 'react';
import { Switch, Route } from "react-router-dom";
import PropTypes from 'prop-types';

import { Layout, Avatar, Badge, Typography } from 'antd';
import {
  DesktopOutlined,
  NotificationOutlined,
  BookOutlined,
  ReadOutlined,
  TeamOutlined
} from '@ant-design/icons';

import SideDrawer from '../../components/Navigation/SideDrawer/SideDrawer';
import Dashboard from '../../pages/admin/Dashboard/Dashboard';
import Courses from '../../pages/admin/Courses/Courses';
import Subjects from '../../pages/admin/Subjects/Subjects';
import Students from '../../pages/admin/Students/Students';
import Notices from '../../pages/admin/Notices/Notices';

const { Header, Content, Footer } = Layout;
const { Title } = Typography;

export default class AdminLayout extends Component {
  static propTypes = {
    prop: PropTypes
  };

  render() {
    const { path } = this.props.match

    return (
      <Layout style={{ minHeight: '100vh' }}>
        <SideDrawer
          elements={[
            { key: 1, text: 'Dashboard', to: `${path}`, icon: <DesktopOutlined /> },
            { key: 2, text: 'Notices', to: `${path}/notices`, icon: <NotificationOutlined /> },
            { key: 3, text: 'Subjects', to: `${path}/subjects`, icon: <BookOutlined /> },
            { key: 4, text: 'Courses', to: `${path}/courses`, icon: <ReadOutlined /> },
            { key: 5, text: 'Students', to: `${path}/students`, icon: <TeamOutlined /> },
          ]}
        />
        <Layout className="site-layout">
          <Header className="site-layout-background" style={{ padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }} >
            <Title style={{ margin: '0 1.5rem', color: '#FFFFFF' }}>Presence</Title>
            <Badge count={5} style={{ margin: '0 1.5rem' }}>
              <Avatar
                size={{ xs: 10, sm: 14, md: 18, lg: 30, xl: 34, xxl: 36 }}
                style={{ color: '#f56a00', backgroundColor: '#fde3cf', margin: '0 1.5rem' }}
              >C</Avatar>
            </Badge>
          </Header>
          <Content style={{ margin: '0 16px' }}>
            <Switch>
              <Route path={`${path}`} exact component={Dashboard} />
              <Route path={`${path}/notices`} component={Notices} />
              <Route path={`${path}/courses`} component={Courses} />
              <Route path={`${path}/students`} component={Students} />
              <Route path={`${path}/subjects`} component={Subjects} />
            </Switch>
          </Content>
          <Footer style={{ textAlign: 'center' }}>Presence ©2021 Created by HCMIU</Footer>
        </Layout>
      </Layout>
    )
  }
}
