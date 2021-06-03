import React, { Component } from 'react'
import { Form, Input, Button } from 'antd'
import { LockOutlined } from '@ant-design/icons'

const { Item } = Form;
export default class ChangePassword extends Component {
  onChangePassword = (values) => {

  }
  render() {
    return (
      <div>
        <Form
          name="changepassword"
          onFinish={(values) => this.onChangePassword(values)}
          onFinishFailed={null}
        >
          <Item
            label="Old Password"
            name="oldPassword"
            rules={[{ required: true, message: 'Please input your old password!' }]}
          >
            <Input.Password prefix={<LockOutlined />} />
          </Item>
          <Item
            label="New Password"
            name="newPassword"
            rules={[{ required: true, message: 'Please input your new password!' }]}
            hasFeedback
          >
            <Input.Password prefix={<LockOutlined />} />
          </Item>
          <Item
            label="Confirm Password"
            name="confirmPassword"
            dependencies={['newPassword']}
            rules={[
              {
                required: true,
                message: 'Please confirm your new password!'
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('newPassword') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('The two passwords that you entered do not match!'));
                },
              })
            ]}
            hasFeedback
          >
            <Input.Password prefix={<LockOutlined />} />
          </Item>
          <Item>
            <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
              Change Password
            </Button>
          </Item>
        </Form>
      </div>
    )
  }
}
