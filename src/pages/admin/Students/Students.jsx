import Title from 'antd/lib/typography/Title'
import React, { Component, Fragment } from 'react'
import { Link } from 'react-router-dom'
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

export default class Students extends Component {
  state = {
    students: [],
    currentRFID: null,
    showForm: false,
    confirmLoading: false,
  }

  componentDidMount() {
    // axios.get('/admin/students', {
    //   headers: {
    //     'Authorization': `Bearer ${this.props.token}`
    //   }
    // })
    //   .then(res => res.data)
    //   .then(resData => {
    //     console.log(resData)
    //     return resData
    //   })
    //   .then(resData => this.setState({ students: resData.students }))
    //   .catch(err => this.props.onError(err));
  }

  toggleForm = () => {
    this.state.showForm ?
      this.setState({ showForm: false }) :
      axios.get('/admin/new-rfid', {
        headers: {
          'Authorization': `Bearer ${this.props.token}`
        }
      })
        .then(res => this.setState({
          showForm: !this.state.showForm,
          currentRFID: res.data.rfidTag
        }))
        .catch(err => this.props.onError(err));
  }

  setStudents = (studentData) => {
    this.setState({ students: studentData });
  }

  createstudentHandler = (values) => {
    console.log(values)
    axios.post('/admin/student', values, {
      headers: {
        'Authorization': `Bearer ${this.props.token}`
      }
    })
      .then(res => {
        console.log(res)
        if (res.status === 201) {
          this.setState({ showForm: false });
          this.setstudents([...this.state.students, res.data.student]);
        }
      })
      .catch(err => this.props.onError(err));
  }

  // updatePasswordHandler = (studentId) => {
  //   const newPassword = Math.random().toString(36).slice(-8);
  //   console.log(newPassword)
  //   axios.put('/admin/student-password', {
  //     studentId: studentId,
  //     newPassword: newPassword
  //   }, {
  //     headers: {
  //       'Authorization': `Bearer ${this.props.token}`
  //     }
  //   })
  //     .then(res => {
  //       console.log(res);
  //     })
  //     .catch(err => this.props.onError(err));
  // }

  deleteStudentHandler = (studentId) => {
    console.log(studentId)
    axios.delete('/admin/student/' + studentId, {
      headers: {
        'Authorization': `Bearer ${this.props.token}`
      }
    })
      .then(res => {
        console.log(res)
        if (res.status === 200)
          this.setStudents(this.state.students.filter(student => student._id !== studentId));
      })
      .catch(err => this.props.onError(err));
  }

  render() {
    const { students, showForm, confirmLoading } = this.state;

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
            <Button type='primary'><Link to={`/courses?studentId=${record._id}`}>View courses</Link></Button>
            <Button onClick={() => this.updatePasswordHandler(record._id)}>Update Password</Button>
            <Button onClick={() => this.deleteStudentHandler(record._id)} danger type='link'>Delete</Button>
          </Space>
        )
      }
    ];

    const form = (
      <Modal
        title={'Create New Student'}
        visible={showForm}
        confirmLoading={confirmLoading}
        onCancel={this.toggleForm}
        footer={[]}
      >
        <Form
          {...layout}
          id={'studentForm'}
          onFinish={this.createstudentHandler}
          onFinishFailed={null}
        >
          <Form.Item
            label='Full name'
            name='name'
            rules={[{
              required: true,
              message: 'Please input the full name of student!'
            }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Student ID"
            name="id"
            rules={[{
              required: true,
              message: 'Please input a valid id!'
            }]}
          >
            <Input />
          </Form.Item>
          {/* <Form.Item
            label="Password"
            name="password"
            rules={[{
              required: true,
              message: 'Please input random password!'
            }]}
          >
            <Input.Password />
          </Form.Item> */}
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
            { key: 2, text: 'Students' },
          ]}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Title level={3}>student List</Title>
          <Button type='primary' onClick={this.toggleForm}>Add new student</Button>
        </div>
        <Table dataSource={students} columns={columns} rowKey='_id' />
        {form}
      </Fragment>
    )
  };
};
