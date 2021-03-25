import Title from 'antd/lib/typography/Title'
import React, { Component, Fragment } from 'react'
import { Link } from 'react-router-dom'
import { Table, Space, Button, Form, Input, Modal, Typography } from 'antd'

import NavBreadcrumb from '../../../components/Navigation/NavBreadcrumb/NavBreadcrumb'
import axios from '../../../axios-instance'

const { Text } = Typography

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
    showResult: false,
    resultMessage: ''
  }

  componentDidMount() {
    axios.get('/admin/lecturers', {
      headers: {
        'Authorization': `Bearer ${this.props.token}`
      }
    })
      .then(res => res.data)
      .then(resData => {
        console.log(resData)
        return resData
      })
      .then(resData => this.setLecturers(resData.lecturers))
      .catch(err => this.props.onError(err));
  }

  toggleForm = () => this.setState({ showForm: !this.state.showForm })

  toggleResult = () => this.setState({ showResult: !this.state.showResult, resultMessage: '' })

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
    axios.post('/admin/lecturer', values, {
      headers: {
        'Authorization': `Bearer ${this.props.token}`
      }
    })
      .then(res => {
        console.log(res)
        if (res.status === 201) {
          this.setState({ showForm: false });
          this.setLecturers([...this.state.lecturers, res.data.lecturer]);
        }
      })
      .catch(err => this.props.onError(err));
  }

  updatePasswordHandler = (lecturerId) => {
    const newPassword = Math.random().toString(36).slice(-8);
    console.log(newPassword)
    axios.put('/admin/lecturer-password', {
      lecturerId: lecturerId,
      newPassword: newPassword
    }, {
      headers: {
        'Authorization': `Bearer ${this.props.token}`
      }
    })
      .then(res => this.setState({
        showResult: true,
        resultMessage: res.data.message
      }))
      .catch(err => this.props.onError(err));
  }

  deleteLecturerHandler = (lecturerId) => {
    console.log(lecturerId)
    axios.delete('/admin/lecturer/' + lecturerId, {
      headers: {
        'Authorization': `Bearer ${this.props.token}`
      }
    })
      .then(res => {
        console.log(res)
        if (res.status === 200)
          this.setLecturers(this.state.lecturers.filter(lec => lec._id !== lecturerId));
      })
      .catch(err => this.props.onError(err));
  }

  render() {
    const { lecturers, showForm, confirmLoading, showResult, resultMessage } = this.state;

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
            <Button type='primary'><Link to={`/courses?lecturerId=${record._id}`}>View courses</Link></Button>
            <Button onClick={() => this.updatePasswordHandler(record._id)}>Update Password</Button>
            <Button onClick={() => this.deleteLecturerHandler(record._id)} danger type='link'>Delete</Button>
          </Space>
        )
      }
    ];

    const result = (
      <Modal 
        title={'Operation\'s result'}
        visible={showResult}
        onOk={this.toggleResult}
        onCancel={this.toggleResult}
      >
        <Text>{resultMessage}</Text>
      </Modal>
    )

    const form = (
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
    );

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
        {form}
        {result}
      </Fragment>
    )
  };
};
