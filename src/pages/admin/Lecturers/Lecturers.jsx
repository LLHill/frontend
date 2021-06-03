import Title from 'antd/lib/typography/Title'
import React, { Component, Fragment } from 'react'
// import { Link } from 'react-router-dom'
import { Table, Space, Button, Form, Input, Modal, Popconfirm, message } from 'antd'

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
    loading: false,
    showPopconfirm: -1,
    confirmLoading: false
  }

  componentDidMount() {
    this.setState({ loading: true });
    axios.get('/admin/lecturers', {
      headers: {
        'Authorization': `Bearer ${this.props.token}`
      }
    })
      .then(res => res.data)
      .then(resData => {
        this.setLecturers(resData.lecturers);
        this.setState({ loading: false });
      })
      .catch(err => this.props.onError(err));
  }

  toggleForm = () => this.setState({ showForm: !this.state.showForm, showPopconfirm: -1 })

  toggleShowPopconfirm = (index = -1) => this.setState({ showPopconfirm: index })

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
    this.setState({ confirmLoading: true });
    axios.post('/admin/lecturer', values, {
      headers: {
        'Authorization': `Bearer ${this.props.token}`
      }
    })
      .then(res => {
        if (res.status === 201) {
          this.setState({ showForm: false, confirmLoading: false });
          this.setLecturers([...this.state.lecturers, res.data.lecturer]);
          message.success(res.data.message || 'Create new lecturer :D');
        }
      })
      .catch(err => this.props.onError(err));
  }

  updatePasswordHandler = (lecturerId) => {
    const newPassword = Math.random().toString(36).slice(-8);
    console.log(newPassword);
    axios.put('/admin/lecturer-password', {
      lecturerId: lecturerId,
      newPassword: "123456"
    }, {
      headers: {
        'Authorization': `Bearer ${this.props.token}`
      }
    })
      .then(res => message.success(res.data.message || 'Lecturer\'s Password Changed :D'))
      .catch(err => this.props.onError(err));
  }

  deleteLecturerHandler = (lecturerId) => {
    this.setState({ confirmLoading: true });
    axios.delete('/admin/lecturer/' + lecturerId, {
      headers: {
        'Authorization': `Bearer ${this.props.token}`
      }
    })
      .then(res => {
        console.log(res)
        if (res.status === 200) {
          this.setLecturers(this.state.lecturers.filter(lec => lec._id !== lecturerId));
          this.setState({ confirmLoading: false, showPopconfirm: -1 });
          message.success(res.data.message || 'Lecturer Deleted :D');
        }
      })
      .catch(err => this.props.onError(err));
  }

  render() {
    const { lecturers, showForm, loading, showPopconfirm, confirmLoading } = this.state;

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
        render: (text, record, index) => (
          <Space size='middle'>
            {/* <Button type='primary'><Link to={`/courses?lecturerId=${record._id}`}>View courses</Link></Button> */}
            <Button onClick={() => this.updatePasswordHandler(record._id)}>Update Password</Button>
            <Popconfirm
              title='Are you sure?'
              visible={showPopconfirm === index}
              onConfirm={() => this.deleteLecturerHandler(record._id)}
              okButtonProps={{ loading: confirmLoading }}
              onCancel={this.toggleShowPopconfirm}
            >
              <Button onClick={() => this.toggleShowPopconfirm(index)} danger type='link'>Delete</Button>
            </Popconfirm>
          </Space>
        )
      }
    ];

    const form = (
      <Modal
        title={'Create New Lecturer'}
        confirmLoading={confirmLoading}
        visible={showForm}
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
        <Table dataSource={lecturers} columns={columns} rowKey='_id' loading={loading} />
        {form}
      </Fragment>
    )
  };
};
