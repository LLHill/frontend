import React, { Component } from 'react'
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types'

import logo from '../../../assets/images/hcmiulogo.png'
import { Layout, Menu, Image, Typography, Switch } from 'antd';
import { PoweroffOutlined, BulbOutlined, KeyOutlined } from '@ant-design/icons';

const { Sider } = Layout;
const { Title } = Typography;

export default class SideDrawer extends Component {
  static propTypes = {
    elements: PropTypes.arrayOf(
      PropTypes.shape({
        key: PropTypes.number,
        text: PropTypes.string.isRequired,
        to: PropTypes.string,
        icon: PropTypes.object
      }).isRequired
    ).isRequired
  };

  state = {
    collapsed: true,
    theme: 'dark'
  };

  changeTheme = value => {
    this.setState({
      theme: value ? 'dark' : 'light',
    });
  };

  onCollapse = collapsed => {
    console.log(collapsed);
    this.setState({ collapsed });
  };

  render() {
    const { collapsed, theme } = this.state;
    const { elements, onLogout } = this.props;

    return (
      <Sider theme={theme} collapsible collapsed={collapsed} onCollapse={this.onCollapse}>
        {
          collapsed ?
            <Image preview={false} src={logo} alt='logo' width={40} style={{ marginTop: '10px', marginLeft: '20px' }} /> :
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly', padding: '0.5rem' }}>
              <Image preview={false} src={logo} alt='logo' width={40} />
              <Title level={2} style={{ color: theme === 'dark' ? 'white' : '#1167b1' }}>Presence</Title>
            </div>
        }
        <Menu theme={theme} defaultSelectedKeys={['1']} mode="inline">
          {
            elements.map(e => (
              <Menu.Item key={e.key} icon={e.icon}>
                <Link to={e.to}>{e.text}</Link>
              </Menu.Item>
            ))
          }
          <Menu.Divider style={{ backgroundColor: theme === 'dark' ? '#04142c' : '#fcfcfc' }} />
          <Menu.Item key={'darkmode'} icon={<BulbOutlined />}>
            Dark Mode
            <Switch
              checked={this.state.theme === 'dark'}
              onChange={this.changeTheme}
              style={{ marginLeft: '1rem' }}
            />
          </Menu.Item>
          <Menu.Item key={'changepass'} icon={<KeyOutlined />}>
            <Link to={'/password'}>Change Password</Link>
          </Menu.Item>
          <Menu.Item key={'logout'} icon={<PoweroffOutlined />} danger onClick={onLogout}>
            Logout
          </Menu.Item>
        </Menu>
      </Sider>
    )
  };
}
