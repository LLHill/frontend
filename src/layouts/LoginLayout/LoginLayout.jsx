import React, { Component, Fragment } from 'react'
import { Form, Input, Button, Checkbox, Row, Col } from 'antd';

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};
const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};

export default class LoginLayout extends Component {
  onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  render() {
    const { onLogin } = this.props;

    return (
      <Fragment>
        <Row style={{ height: '5rem' }}>
          <Col></Col>
        </Row>
        <Row>
          <Col span={7}></Col>
          <Col span={10}>
            <Form
              {...layout}
              name="basic"
              initialValues={{ remember: true }}
              onFinish={(values) => onLogin(values)}
              onFinishFailed={this.onFinishFailed}
            >
              <Form.Item
                label="Email"
                name="email"
                rules={[{ required: true, message: 'Please input your email!' }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="Password"
                name="password"
                rules={[{ required: true, message: 'Please input your password!' }]}
              >
                <Input.Password />
              </Form.Item>

              <Form.Item {...tailLayout} name="isAdminLogin" valuePropName="checked" initialValue={true}>
                <Checkbox>Login as admin</Checkbox>
              </Form.Item>
              <Form.Item {...tailLayout}>
                <Button type="primary" htmlType="submit">
                  Submit
                </Button>
              </Form.Item>
            </Form>
          </Col>
          <Col span={7}></Col>
        </Row>
      </Fragment>
    )
  }
}
