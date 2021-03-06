import Title from 'antd/lib/typography/Title'
import React, { Component, Fragment } from 'react'
// import { Link } from 'react-router-dom'
import openSocket from 'socket.io-client'
import { Table, Space, Button, Form, Input, Select, Modal } from 'antd'
import NavBreadcrumb from '../../../components/Navigation/NavBreadcrumb/NavBreadcrumb'
import AntForm from '../../../components/AntForm/AntForm'

import axios from '../../../axios-instance'
import serverUrl from '../../../util/serverUrl'

const { Item } = Form;
const { Option } = Select;

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
    RFIDs: [],
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
        currentRFID: resData.newRFID && resData.newRFID.rfidTag,
        RFIDs: resData.RFIDs
      }))
      .catch(err => this.props.onError(err));
    const socket = openSocket(serverUrl);
    socket.on('new-rfid', data => {
      console.log(data);
      if (data.action === 'update')
        this.setState({ currentRFID: data.rfidTag })
      console.log(this.state.currentRFID)
    });
  }

  toggleForm = () => this.setState({ showForm: !this.state.showForm })

  setStudents = (studentData) => this.setState({ students: studentData })

  createStudentHandler = (values) => {
    console.log(values)
    axios.post('/admin/student', {
      ...values,
      // rfidTag: this.state.currentRFID
    }, {
      headers: {
        'Authorization': `Bearer ${this.props.token}`
      }
    })
      .then(res => {
        console.log(res)
        if (res.status === 201) {
          this.setState({
            showForm: false,
            RFIDs: this.state.RFIDs.filter(rfid => rfid.rfidTag !== values.rfidTag)
          });
          this.setStudents([...this.state.students, res.data.student]);
        }
      })
      .catch(err => this.props.onError(err));
  }

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
    const { students, showForm, confirmLoading, /*currentRFID*/ RFIDs } = this.state;

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
            {/* <Button type='primary'><Link to={`/courses?studentId=${record._id}`}>View courses</Link></Button> */}
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
        <AntForm
          layout={{ ...layout }}
          tailLayout={{...tailLayout}}
          id={'studentForm'}
          onFinish={this.createStudentHandler}
          onFinishFailed={null}
          onCancel={this.toggleForm}
        >
          <Item
            label='Full name'
            name='name'
            rules={[{
              required: true,
              min: 5,
              message: 'Please input the full name of student!'
            }]}
          >
            <Input />
          </Item>
          <Item
            label="Student ID"
            name="id"
            rules={[{
              required: true,
              min: 11,
              max: 11,
              message: 'Please input a valid student ID!',
            }]}
          >
            <Input />
          </Item>
          {/* <Form.Item
            label="Student RFID Tag"
            name="rfidTag"
            initialValue={currentRFID}
          >
            <p
              style={{
                padding: '5px',
                border: '1px lightgray solid',
                backgroundColor: 'ghostwhite'
              }}
            >{currentRFID ? currentRFID : "Not yet scanned"}</p>
          </Form.Item> */}
          <Item
            label='Student RFID Tag'
            name='rfidTag'
            rules={[{
              required: true,
              message: 'Please select the tag number :D'
            }]}
          >
            <Select
              showSearch
              placeholder='Select a tag number'
              optionFilterProp='children'
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              {
                RFIDs.map((rfid, index) => (
                  <Option key={index} value={rfid.rfidTag}>
                    {`${rfid.id} - ${rfid.rfidTag}`}
                  </Option>
                ))
              }
            </Select>
          </Item>
        </AntForm>
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
