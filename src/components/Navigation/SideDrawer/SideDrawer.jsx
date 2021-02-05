import React, { Component } from 'react'
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types'

import { Layout, Menu } from 'antd';

const { Sider } = Layout;
// const { SubMenu } = Menu;

export default class SideDrawer extends Component {
  static propTypes = {
    elements: PropTypes.arrayOf(
      PropTypes.shape({
        key: PropTypes.number,
        text: PropTypes.string.isRequired,
        to: PropTypes.string,
        icon: PropTypes.symbol
      }).isRequired
    ).isRequired
  };

  state = {
    collapsed: false,
  };

  onCollapse = collapsed => {
    console.log(collapsed);
    this.setState({ collapsed });
  };

  render() {
    const { collapsed } = this.state;
    const { elements } = this.props;
    return (
      <Sider collapsible collapsed={collapsed} onCollapse={this.onCollapse}>
        <div className="logo" />
        <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
          {
            elements.map(e => {
              return (
                <Menu.Item key={e.key} icon={e.icon}>
                  <Link to={e.to}>{e.text}</Link>
                </Menu.Item>
              );
            })
          }
          {/* <SubMenu key="sub1" icon={<UserOutlined />} title="User">
            <Menu.Item key="3">Tom</Menu.Item>
            <Menu.Item key="4">Bill</Menu.Item>
            <Menu.Item key="5"><Link>Ben</Link></Menu.Item>
          </SubMenu> */}
        </Menu>
      </Sider>
    )
  }
}
