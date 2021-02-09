import React, { Component } from 'react';
import { Switch, Route } from "react-router-dom";

import { Layout, Typography } from 'antd';
import {
  DesktopOutlined,
  NotificationOutlined,
  BookOutlined,
  ReadOutlined,
  UserOutlined,
  TeamOutlined
} from '@ant-design/icons';

import SideDrawer from '../../components/Navigation/SideDrawer/SideDrawer';
import Dashboard from '../../pages/admin/Dashboard/Dashboard';
import Courses from '../../pages/admin/Courses/Courses';
import Subjects from '../../pages/admin/Subjects/Subjects';
import Students from '../../pages/admin/Students/Students';
import Notices from '../../pages/admin/Notices/Notices';
import Lecturers from '../../pages/admin/Lecturers/Lecturers';

const { Content, Footer } = Layout;
const { Title } = Typography;
export default class AdminLayout extends Component {
  render() {
    return (
      <Layout style={{ minHeight: '100vh' }}>
        <SideDrawer
          elements={[
            { key: 1, text: 'Dashboard', to: `/`, icon: <DesktopOutlined /> },
            { key: 2, text: 'Lecturers', to: `/lecturers`, icon: <UserOutlined /> },
            { key: 3, text: 'Subjects', to: `/subjects`, icon: <BookOutlined /> },
            { key: 4, text: 'Courses', to: `/courses`, icon: <ReadOutlined /> },
            { key: 5, text: 'Students', to: `/students`, icon: <TeamOutlined /> },
            { key: 6, text: 'Notices', to: `/notices`, icon: <NotificationOutlined /> },
          ]}
          onLogout={this.props.onLogout}
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
              <Route path={`/notices`} component={Notices} />
              <Route path={`/courses`} component={Courses} />
              <Route path={`/students`} component={Students} />
              <Route path={`/subjects`} component={Subjects} />
              <Route path={`/lecturers`} component={Lecturers} />
              <Route component={() => <Title>404 Not Found</Title>} />
            </Switch>
          </Content>
          <Footer style={{ textAlign: 'center' }}>Presence ©2021 Created by HCMIU</Footer>
        </Layout>
      </Layout>
    )
  }
}
