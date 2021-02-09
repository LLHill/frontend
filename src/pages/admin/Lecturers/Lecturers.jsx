import Title from 'antd/lib/typography/Title'
import React, { Component, Fragment } from 'react'
import { Table, Space, Button, Form, Input, Modal } from 'antd'
import NavBreadcrumb from '../../../components/Navigation/NavBreadcrumb/NavBreadcrumb'

import axios from '../../../axios-instance'

const dataSource = [
  {
    _id: 1,
    name: 'Hùng Gấu Dễ Thương',
    email: 'test@lecturer.com',
    courseNo: 4
  }
];

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};

export default class Lecturers extends Component {
  state = {
    lecturers: [],
    showForm: true,
    confirmLoading: false,
  }

  componentDidMount() {
    axios.get('/admin/lecturers')
      .then(res => res.data)
      .then(resData => this.setState({ lecturers: resData.lecturers }))
      .catch(err => console.log(err));
  }

  toggleForm = () => this.setState({ showForm: !this.state.showForm })

  createLecturerHandler = (values) => {
    console.log(values)
    axios.post('/admin/create-lecturer', values)
      .then(res => console.log(res));
  }

  deleteLecturer = (lecturerId) => {
    console.log('Deleting lecturer: ' + lecturerId)
  }

  render() {
    const { lecturers, showForm, confirmLoading } = this.state;

    const columns = [
      {
        title: 'Name',
        dataIndex: 'name',
        key: 'name'
      },
      {
        title: 'Email',
        dataIndex: 'email',
        key: 'email'
      },
      {
        title: 'Course number',
        dataIndex: 'courseNo',
        key: 'courseNo'
      },
      {
        title: 'Action',
        key: 'action',
        render: (text, record) => (
          <Space size='middle'>
            <Button onClick={() => this.deleteLecturer(record._id)} type='link'>Delete</Button>
          </Space>
        )
      }
    ];

    return (
      <Fragment>
        <NavBreadcrumb
          elements={[
            { key: 1, text: 'Admin', to: '/' },
            { key: 2, text: 'Lecturers' },
          ]}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Title level={3}>Lecturer List</Title>
          <Button type='primary' onClick={this.toggleForm}>Add new lecturer</Button>
        </div>
        <Table dataSource={[...lecturers, ...dataSource]} columns={columns} />
        <Modal
          title={'Create New Lecturer'}
          visible={showForm}
          confirmLoading={confirmLoading}
          footer={[]}
        >
          <Form
            {...layout}
            onFinish={this.createLecturerHandler}
            onFinishFailed={null}
          >
            <Form.Item
              label='Full name'
              name='name'
              rules={[{
                required: true,
                message: 'Please input the full name of lecturer!'
              }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Email"
              name="email"
              rules={[{
                required: true,
                message: 'Please input a valid email!'
              }, {
                type: 'email',
                message: 'Please input a valid email!'
              }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Password"
              name="password"
              rules={[{
                required: true,
                message: 'Please input random password!'
              }]}
            >
              <Input.Password />
            </Form.Item>
            <Form.Item {...tailLayout}>
              <Button
                type='primary'
                htmlType='submit'
              >Submit</Button>
              {/* <Button
                htmlType='reset'
              >Reset</Button> */}
              <Button 
                type='link'
                onClick={this.toggleForm}
              >Cancel</Button>
            </Form.Item>
          </Form>
        </Modal>
      </Fragment>
    )
  };
};
