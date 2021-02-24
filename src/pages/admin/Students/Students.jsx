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
    currentRFID: '',
    showForm: false,
    confirmLoading: false,
  }

  componentDidMount() {
    axios.get('/admin/students', {
      headers: {
        'Authorization': `Bearer ${this.props.token}`
      }
    })
      .then(res => res.data)
      .then(resData => {
        console.log(resData)
        return resData
      })
      .then(resData => this.setState({
        students: resData.students,
        currentRFID: resData.newRFID && resData.newRFID.rfidTag
      }))
      .catch(err => this.props.onError(err));
  }

  toggleForm = () => {
    // this.state.showForm ?
    //   this.setState({ showForm: false }) :
    //   axios.get('/admin/new-rfid', {
    //     headers: {
    //       'Authorization': `Bearer ${this.props.token}`
    //     }
    //   })
    //     .then(res => this.setState({
    //       showForm: !this.state.showForm,
    //       currentRFID: res.data.rfidTag
    //     }))
    //     .catch(err => this.props.onError(err));
    this.setState({ showForm: !this.state.showForm })
  }

  setStudents = (studentData) => {
    this.setState({ students: studentData });
  }

  createStudentHandler = (values) => {
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
          this.setStudents([...this.state.students, res.data.student]);
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
        title: 'Student ID',
        dataIndex: 'id',
        key: 'id'
      },
      {
        title: 'Name',
        dataIndex: 'name',
        key: 'name'
      },
      {
        title: 'RFID Tag',
        dataIndex: 'rfidTag',
        key: 'rfidTag'
      },
      {
        title: 'Action',
        key: 'action',
        render: (text, record) => (
          <Space size='middle'>
            <Button type='primary'><Link to={`/courses?studentId=${record._id}`}>View courses</Link></Button>
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
          onFinish={this.createStudentHandler}
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
          <Form.Item
            label="Student RFID Tag"
            name="rfidTag"

            initialValue={this.state.currentRFID}
          >
            <Input readOnly style={{ backgroundColor: 'ghostwhite' }} />
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
          <Title level={3}>Student List</Title>
          <Button type='primary' onClick={this.toggleForm}>Add new student</Button>
        </div>
        <Table dataSource={students} columns={columns} rowKey='_id' />
        {form}
      </Fragment>
    )
  };
};
