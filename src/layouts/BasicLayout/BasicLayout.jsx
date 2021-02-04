import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Layout } from 'antd';
import SideDrawer from '../../components/Navigation/SideDrawer/SideDrawer';
import NavBreadcrumb from '../../components/Navigation/NavBreadcrumb/NavBreadcrumb';

const { Header, Content, Footer } = Layout;

export default class BasicLayout extends Component {
  static propTypes = {
    prop: PropTypes
  };


  render() {

    return (
      <Layout style={{ minHeight: '100vh' }}>
        <SideDrawer />
        <Layout className="site-layout">
          <Header className="site-layout-background" style={{ padding: 0 }} />
          <Content style={{ margin: '0 16px' }}>
            <NavBreadcrumb
              elements={[
                { key: 1, text: 'Admin', to: '/admin' },
                { key: 2, text: 'Dashboard' },
              ]}
            />
            <div className="site-layout-background" style={{ padding: 24, minHeight: 360 }}>
              Bill is a cat.
              {this.props.children}
            </div>
          </Content>
          <Footer style={{ textAlign: 'center' }}>Presence ©2021 Created by HCMIU</Footer>
        </Layout>
      </Layout>
    )
  }
}
