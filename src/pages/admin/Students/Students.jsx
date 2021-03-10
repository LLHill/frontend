import Title from 'antd/lib/typography/Title'
import React, { Component, Fragment } from 'react'
// import { Link } from 'react-router-dom'
import openSocket from 'socket.io-client'
import { Table, Space, Button, Form, Input, Select, Modal } from 'antd'
import Highlighter from 'react-highlight-words'
import { SearchOutlined } from '@ant-design/icons'

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
    loading: false,
    isUpdating: false,
    updatingStudent: {},
    searchText: '',
    searchedColumn: ''
  }

  componentDidMount() {
    this.setState({ loading: true });
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
        RFIDs: resData.RFIDs,
        loading: false
      }))
      .catch(err => {
        this.props.onError(err);
        this.setState({ loading: false });
      });
    const socket = openSocket(serverUrl);
    socket.on('new-rfid', data => {
      console.log(data);
      if (data.action === 'update')
        this.setState({ currentRFID: data.rfidTag })
      console.log(this.state.currentRFID)
    });
  }

  toggleCreate = () => this.setState({
    showForm: !this.state.showForm,
    isUpdating: false,
    updatingStudent: {}
  })

  toggleUpdate = (studentId) => {
    axios.get(`/admin/student/${studentId}`, {
      headers: {
        'Authorization': `Bearer ${this.props.token}`
      }
    })
      .then(res => {
        console.log(res.data);
        return res.data.student;
      })
      .then(student => this.setState({
        showForm: !this.state.showForm,
        isUpdating: !this.state.isUpdating,
        updatingStudent: student
      }))
      .catch(err => this.props.onError(err));
  }

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

  updateStudentRFIDHandler = (values) => {
    console.log(values)
    console.log(this.state)
    axios.put(`/admin/student-rfid/${this.state.updatingStudent._id}`, { rfidTag: values.rfidTag }, {
      headers: {
        'Authorization': `Bearer ${this.props.token}`
      }
    })
      .then(res => {
        console.log(res)
        if (res.status === 200) {

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

  getColumnSearchProps = dataIndex => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={node => {
            this.searchInput = node;
          }}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ width: 188, marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button onClick={() => this.handleReset(clearFilters)} size="small" style={{ width: 90 }}>
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({ closeDropdown: false });
              this.setState({
                searchText: selectedKeys[0],
                searchedColumn: dataIndex,
              });
            }}
          >
            Filter
          </Button>
        </Space>
      </div>
    ),
    filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
    onFilter: (value, record) =>
      record[dataIndex]
        ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase())
        : '',
    onFilterDropdownVisibleChange: visible => {
      if (visible) {
        setTimeout(() => this.searchInput.select(), 100);
      }
    },
    render: text =>
      this.state.searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[this.state.searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      ),
  });

  handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    this.setState({
      searchText: selectedKeys[0],
      searchedColumn: dataIndex,
    });
  };

  handleReset = clearFilters => {
    clearFilters();
    this.setState({ searchText: '' });
  };

  render() {
    const { students, showForm, loading, RFIDs, isUpdating, updatingStudent } = this.state;

    const columns = [
      {
        title: 'Student ID',
        dataIndex: 'id',
        key: 'id',
        ...this.getColumnSearchProps('id')
      },
      {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        ...this.getColumnSearchProps('name')
      },
      {
        title: 'RFID Tag',
        dataIndex: 'rfidTag',
        key: 'rfidTag',
        ...this.getColumnSearchProps('rfidTag')
      },
      {
        title: 'Action',
        key: 'action',
        render: (text, record) => (
          <Space size='middle'>
            {/* <Button type='primary'><Link to={`/courses?studentId=${record._id}`}>View courses</Link></Button> */}
            <Button onClick={() => this.toggleUpdate(record._id)}>Update RFID</Button>
            <Button onClick={() => this.deleteStudentHandler(record._id)} danger type='link'>Delete</Button>
          </Space>
        )
      }
    ];

    const createFormItems = (
      <Fragment>
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
      </Fragment>
    );

    const updateFormItems = (
      <Fragment>
        <Item
          label='Student Name'
          name='name'
        >
          <Input disabled />
        </Item>
        <Item
          label='Student RFID Tag'
          name='rfidTag'
          rules={[{
            required: true,
            message: 'Please select the tag number :D'
          }]}
          initialValue={updatingStudent.rfidTag}
        >
          <Select
            showSearch
            placeholder='Select a tag number'
            optionFilterProp='children'
            // defaultValue={updatingStudent.rfidTag}
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
      </Fragment>
    )

    const form = (
      <Modal
        title={isUpdating ? 'Update Student RFID' : 'Create New Student'}
        visible={showForm}
        loading={loading}
        onCancel={this.toggleCreate}
        footer={[]}
      >
        <AntForm
          layout={{ ...layout }}
          tailLayout={{ ...tailLayout }}
          id={'studentForm'}
          onFinish={isUpdating ? this.updateStudentRFIDHandler : this.createStudentHandler}
          onFinishFailed={null}
          onCancel={this.toggleCreate}
          initialValues={isUpdating ? updatingStudent : null}
        >
          {
            isUpdating ?
              updateFormItems :
              createFormItems
          }
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
          <Button type='primary' onClick={this.toggleCreate}>Add new student</Button>
        </div>
        <Table
          dataSource={students}
          columns={columns}
          rowKey='_id'
          loading={loading}
          pagination={{
            total: students.length,
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
            defaultPageSize: 7,
            defaultCurrent: 1
          }}
        />
        {form}
      </Fragment>
    )
  };
};
