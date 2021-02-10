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

export default class Subjects extends Component {
  state = {
    subjects: [],
    showForm: false,
    confirmLoading: false,
  }

  componentDidMount() {
    axios.get('/admin/subjects')
      .then(res => res.data)
      .then(resData => {
        console.log(resData)
        return resData
      })
      .then(resData => this.setSubjects(resData.subjects))
      .catch(err => console.log(err));
  }

  toggleForm = () => this.setState({ showForm: !this.state.showForm })

  setSubjects = (subjectData) => {
    const subjects = subjectData.map(lec => {
      return {
        ...lec,
        courseNo: lec.courseIds.length
      }
    });
    this.setState({ subjects });
  }

  createSubjectHandler = (values) => {
    console.log(values)
    axios.post('/admin/subject', values)
      .then(res => {
        console.log(res)
        if (res.status === 201) {
          this.setState({ showForm: false });
          this.setsubjects([...this.state.subjects, res.data.subject]);
        }
      })
      .catch(err => console.log(err));
  }

  deleteSubjectHandler = (subjectId) => {
    console.log(subjectId)
    axios.delete()
    axios.delete('/admin/subject/' + subjectId)
      .then(res => {
        console.log(res)
        if (res.status === 200)
          this.setSubjects(this.state.subjects.filter(lec => lec._id !== subjectId));
      })
      .catch(err => console.log(err));
  }

  render() {
    const { subjects, showForm, confirmLoading } = this.state;

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
            <Button type='primary'><Link to={`/courses?subjectId=${record._id}`}>View courses</Link></Button>
            <Button onClick={() => this.updatePasswordHandler(record._id)}>Update Password</Button>
            <Button onClick={() => this.deleteSubjectHandler(record._id)} danger type='link'>Delete</Button>
          </Space>
        )
      }
    ];

    return (
      <Fragment>
        <NavBreadcrumb
          elements={[
            { key: 1, text: 'Admin', to: '/' },
            { key: 2, text: 'Subjects' },
          ]}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Title level={3}>Subject List</Title>
          <Button type='primary' onClick={this.toggleForm}>Add new subject</Button>
        </div>
        <Table dataSource={subjects} columns={columns} rowKey='_id' />
        <Modal
          title={'Create New Subject'}
          visible={showForm}
          confirmLoading={confirmLoading}
          onCancel={this.toggleForm}
          footer={[]}
        >
          <Form
            {...layout}
            id={'subjectForm'}
            onFinish={this.createSubjectHandler}
            onFinishFailed={null}
          >
            <Form.Item
              label='Name'
              name='name'
              rules={[{
                required: true,
                message: 'Please input the full name of subject!'
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
