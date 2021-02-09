import Title from 'antd/lib/typography/Title'
import React, { Component, Fragment } from 'react'
import { Table, Space, Button, Form, Input, Modal } from 'antd'
import NavBreadcrumb from '../../../components/Navigation/NavBreadcrumb/NavBreadcrumb'

import axios from '../../../axios-instance'

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
    showForm: false,
    confirmLoading: false,
  }

  componentDidMount() {
    axios.get('/admin/lecturers')
      .then(res => res.data)
      .then(resData => {
        console.log(resData)
        return resData
      })
      .then(resData => this.setLecturers(resData.lecturers))
      .catch(err => console.log(err));
  }

  toggleForm = () => this.setState({ showForm: !this.state.showForm })

  setLecturers = (lecturerData) => {
    const lecturers = lecturerData.map(lec => {
      return {
        ...lec,
        courseNo: lec.courseIds.length
      }
    });
    this.setState({ lecturers });
  }

  createLecturerHandler = (values) => {
    console.log(values)
    axios.post('/admin/create-lecturer', values)
      .then(res => {
        console.log(res)
        if (res.status === 201) {
          this.setState({ showForm: false });
          this.setLecturers([...this.state.lecturers, res.data.lecturer]);
        }
      })
      .catch(err => console.log(err));
  }

  updatePasswordHandler = (lecturerId) => {
    const newPassword = Math.random().toString(36).slice(-8);
    console.log(newPassword)
    //axios
  }

  deleteLecturerHandler = (lecturerId) => {
    console.log(lecturerId)
    axios.delete()
    axios.delete('/admin/lecturer/' + lecturerId)
      .then(res => {
        console.log(res)
        if (res.status === 200)
          this.setLecturers(this.state.lecturers.filter(lec => lec._id !== lecturerId));
      })
      .catch(err => console.log(err));
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
            <Button onClick={() => this.updatePasswordHandler(record._id)}>Update Password</Button>
            <Button onClick={() => this.deleteLecturerHandler(record._id)} danger type='link'>Delete</Button>
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
        <Table dataSource={lecturers} columns={columns} rowKey='_id' />
        <Modal
          title={'Create New Lecturer'}
          visible={showForm}
          confirmLoading={confirmLoading}
          onCancel={this.toggleForm}
          footer={[]}
        >
          <Form
            {...layout}
            id={'lecturerForm'}
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
