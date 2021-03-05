import React, { Component } from 'react';
import { Switch, Route } from "react-router-dom";

import { Layout, Typography } from 'antd';
import {
  DesktopOutlined,
  UpSquareOutlined,
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
import Rooms from '../../pages/admin/Rooms/Rooms';
import Lecturers from '../../pages/admin/Lecturers/Lecturers';

const { Content, Footer } = Layout;
const { Title } = Typography;
export default class AdminLayout extends Component {
  render() {
    const { token, onError } = this.props;
    return (
      <Layout style={{ minHeight: '100vh' }}>
        <SideDrawer
          elements={[
            { key: 1, text: 'Dashboard', to: `/`, icon: <DesktopOutlined /> },
            { key: 2, text: 'Lecturers', to: `/lecturers`, icon: <UserOutlined /> },
            { key: 3, text: 'Subjects', to: `/subjects`, icon: <BookOutlined /> },
            { key: 4, text: 'Courses', to: `/courses`, icon: <ReadOutlined /> },
            { key: 5, text: 'Students', to: `/students`, icon: <TeamOutlined /> },
            { key: 6, text: 'Room', to: `/rooms`, icon: <UpSquareOutlined /> },
          ]}
          onLogout={this.props.onLogout}
          dividerHeight='30vh'
        />
        <Layout className="site-layout">
          <Content style={{ margin: '0 16px' }}>
            <Switch>
              <Route path={`/`} exact render={() => <Dashboard token={token} onError={onError} />} />
              <Route path={`/rooms`} render={() => <Rooms token={token} onError={onError} />} />
              <Route path={`/courses`} render={() => <Courses token={token} onError={onError} />} />
              <Route path={`/students`} render={() => <Students token={token} onError={onError} />} />
              <Route path={`/subjects`} render={() => <Subjects token={token} onError={onError} />} />
              <Route path={`/lecturers`} render={() => <Lecturers token={token} onError={onError} />} />
              <Route component={() => <Title>404 Not Found</Title>} />
            </Switch>
          </Content>
          <Footer style={{ textAlign: 'center' }}>Presence ©2021 Created by HCMIU</Footer>
        </Layout>
      </Layout>
    )
  }
}
