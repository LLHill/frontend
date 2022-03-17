import React, { Component } from 'react';
import { Switch, Route } from "react-router-dom";
import SideDrawer from '../../components/Navigation/SideDrawer/SideDrawer';

import { Layout, Typography } from 'antd';
import {
  DesktopOutlined,
  ReadOutlined,
  CameraOutlined
} from '@ant-design/icons';

import TakePicture from '../../pages/webcam/TakePicture/TakePicture';

const { Content, Footer } = Layout;
const { Title } = Typography;

export default class WebcamLayout extends Component {
  render() {
    return (
      <Layout style={{ minHeight: '100vh' }}>
        <SideDrawer
          elements={[
            { key: 1, text: 'Take Picture', to: '/webcam', icon: <CameraOutlined /> }
          ]}
        />
        <Layout className="site-layout">
          <Content style={{ margin: '0 16px' }}>
            {/* <Switch>
              <Route path={`/takepicture`} render={() => <TakePicture {...this.props} />} />
              <Route component={() => <Title>404 Not Found</Title>} />
            </Switch> */}
             <TakePicture {...this.props} />
          </Content>
          <Footer style={{ textAlign: 'center' }}>Presence ©2021 Created by HCMIU</Footer>
        </Layout>
      </Layout>
    )
  }
}
