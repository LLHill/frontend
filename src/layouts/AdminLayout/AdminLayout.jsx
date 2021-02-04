import React, { Component } from 'react';
import { Switch, Route } from "react-router-dom";
import PropTypes from 'prop-types';

import { Layout, Avatar, Badge, Typography } from 'antd';
import SideDrawer from '../../components/Navigation/SideDrawer/SideDrawer';
import NavBreadcrumb from '../../components/Navigation/NavBreadcrumb/NavBreadcrumb';

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
        <SideDrawer />
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
            <NavBreadcrumb
              elements={[
                // { key: 1, text: 'Admin', to: '/admin' },
                { key: 2, text: 'Dashboard' },
              ]}
            />
            <Switch>
              <Route path={`${path}`} exact component={null} />
              <Route path={`${path}/classes`} exact component={null} />
              <Route path={`${path}/sessions/:classId`} exact component={null} />
              <Route path={`${path}/students`} exact component={null} />
              <Route path={`${path}/reports`} exact component={() => <h2>Currently under development D:</h2>} />
            </Switch>
          </Content>
          <Footer style={{ textAlign: 'center' }}>Presence ©2021 Created by HCMIU</Footer>
        </Layout>
      </Layout>
    )
  }
}
