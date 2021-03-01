import Title from 'antd/lib/typography/Title'
import React, { Component, Fragment } from 'react'
import { Table, Space, Button, Form, Input, Modal } from 'antd'
import NavBreadcrumb from '../../../components/Navigation/NavBreadcrumb/NavBreadcrumb'

import axios from '../../../axios-instance'

const { Column } = Table;

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};

export default class Rooms extends Component {
  state = {
    rooms: [],
    showForm: false,
    confirmLoading: false,
  }

  componentDidMount() {
    axios.get('/admin/rooms', {
      headers: {
        'Authorization': `Bearer ${this.props.token}`
      }
    })
      .then(res => res.data)
      .then(resData => {
        console.log(resData)
        return resData
      })
      .then(resData => this.setRooms(resData.rooms))
      .catch(err => this.props.onError(err));
  }

  toggleForm = () => this.setState({ showForm: !this.state.showForm })

  setRooms = (roomData) => {
    this.setState({ rooms: roomData });
  }

  createRoomHandler = (values) => {
    console.log(values)
    axios.post('/admin/room', values, {
      headers: {
        'Authorization': `Bearer ${this.props.token}`
      }
    })
      .then(res => {
        console.log(res)
        if (res.status === 201)
          this.setState({ showForm: false, rooms: [...this.state.rooms, values] });
      })
      .catch(err => this.props.onError(err));
  }

  deleteRoomHandler = (roomId) => {
    console.log(roomId)
    axios.delete('/admin/room/' + roomId, {
      headers: {
        'Authorization': `Bearer ${this.props.token}`
      }
    })
      .then(res => {
        console.log(res)
        if (res.status === 200)
          this.setRooms(this.state.rooms.filter(room => room._id !== roomId));
      })
      .catch(err => this.props.onError(err));
  }

  render() {
    const { rooms, showForm, confirmLoading } = this.state;

    const table = (
      <Table dataSource={rooms} rowKey='_id'>
        <Column
          title='Room Code'
          dataIndex='code'
          key='code'
        />
        <Column
          title='Reader IP Address'
          dataIndex='readerIp'
          key='readerIp'
        />
        <Column
          title='Action'
          key='action'
          render={(text, record) => (
            <Space size='middle'>
              {/* <Button type='primary'><Link to={`/courses?roomId=${record._id}`}>View courses</Link></Button> */}
              <Button onClick={() => this.deleteRoomHandler(record._id)} danger type='link'>Delete</Button>
            </Space>
          )}
        />
      </Table>
    );

    const form = (
      <Modal
        title={'Create New Room'}
        visible={showForm}
        confirmLoading={confirmLoading}
        onCancel={this.toggleForm}
        footer={[]}
      >
        <Form
          {...layout}
          id={'roomForm'}
          onFinish={this.createRoomHandler}
          onFinishFailed={null}
        >
          <Form.Item
            label='Room Code'
            name='code'
            rules={[{
              required: true,
              min: 5,
              max: 7,
              message: 'Please input the code of room!'
            }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label='Reader IP Address'
            name='readerIp'
            rules={[{
              required: true,
              min: 9,
              message: 'Please input the ip address of reader!'
            }]}
          >
            <Input />
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
            { key: 2, text: 'Rooms' },
          ]}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Title level={3}>Room List</Title>
          <Button type='primary' onClick={this.toggleForm}>Add new room</Button>
        </div>
        {table}
        {form}
      </Fragment>
    )
  };
};
