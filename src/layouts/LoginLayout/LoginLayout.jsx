import React, { Component, Fragment } from 'react'
import { Form, Input, Button, Checkbox, Image, Typography } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'

import './LoginLayout.css'
import logo from '../../assets/images/hcmiulogo.png'

const { Title } = Typography;

// const layout = {
//   labelCol: { span: 8 },
//   wrapperCol: { span: 16 },
// };
// const tailLayout = {
//   wrapperCol: { offset: 8, span: 16 },
// };

export default class LoginLayout extends Component {
  onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  render() {
    const { onLogin } = this.props;

    return (
      <Fragment>
        <div className='area' style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <ul className="circles">
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
          </ul>
          <div style={{ display: 'flex', justifyContent: 'center', padding: '10px' }}>
            <Image src={logo} width={50} preview={false} />
            <Title level={1} style={{ marginLeft: '10px', color: 'whitesmoke' }} >Presence</Title>
          </div>
          <div>
            <Form
              name="basic"
              initialValues={{ remember: true }}
              onFinish={(values) => onLogin(values)}
              onFinishFailed={this.onFinishFailed}
            >
              <Form.Item
                name="email"
                rules={[{ required: true, message: 'Please input your email!' }]}
              >
                <Input placeholder={'Enter your email'} prefix={<UserOutlined />} />
              </Form.Item>
              <Form.Item
                name="password"
                rules={[{ required: true, message: 'Please input your password!' }]}
              >
                <Input.Password placeholder={'Enter your password'} prefix={<LockOutlined />} />
              </Form.Item>
              <Form.Item name="isAdminLogin" valuePropName="checked" initialValue={false}>
                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Checkbox name="isAdminLogin" style={{ color: 'whitesmoke' }}>Admin login</Checkbox>
                  <Button type='link' onClick={() => { }} >
                    Forgot your password D:
                  </Button>
                </div>
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
                  Login
                </Button>
              </Form.Item>
            </Form>
          </div>
        </div>


      </Fragment>
    )
  }
}
