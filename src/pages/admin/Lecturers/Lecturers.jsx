import Title from 'antd/lib/typography/Title'
import React, { Component, Fragment } from 'react'
import { Table, Space, Button } from 'antd'
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

export default class Lecturers extends Component {
  componentDidMount() {
    axios.get('/admin/lecturers')
      .then(res => console.log(res.data))
      .catch(err => console.log(err));
  }

  deleteLecturer = (lecturerId) => {
    console.log('Deleting lecturer: ' + lecturerId)
  };

  render() {
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
            { key: 1, text: 'Admin', to: '/admin' },
            { key: 2, text: 'Lecturers' },
          ]}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Title level={3}>Lecturer List</Title>
          <Button type='primary'>Add new lecturer</Button>
        </div>
        <Table dataSource={dataSource} columns={columns} />
      </Fragment>
    )
  };
};
