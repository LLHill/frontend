import Title from 'antd/lib/typography/Title'
import React, { Component, Fragment } from 'react'
// import { Link } from 'react-router-dom'
import { Table, Space, Button, Form, Input, InputNumber, Select, Modal } from 'antd'
import NavBreadcrumb from '../../../components/Navigation/NavBreadcrumb/NavBreadcrumb'

import axios from '../../../axios-instance'
import { range } from '../../../util/array-functions'

const { Column } = Table;
const { Item } = Form;
const { Option } = Select;

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};

export default class Courses extends Component {
  state = {
    courses: [],
    subjects: [],
    lecturers: [],
    showForm: false,
    confirmLoading: false,
    isUpdating: false,
    updatingCourse: {}
  }

  componentDidMount() {
    axios.get('/admin/courses')
      .then(res => this.setState({
        courses: res.data.courses,
        subjects: res.data.subjects,
        lecturers: res.data.lecturers
      }))
      .then(res => console.log(this.state))
      .catch(err => this.props.onError(err));
  }

  toggleCreate = () => this.setState({ 
    showForm: !this.state.showForm,
    isUpdating: false
  })

  toggleUpdate = (courseId) => this.setState(prevState => ({
    showForm: !this.state.showForm,
    isUpdating: true,
    updatingCourseId: prevState.subjects.find(subject => subject._id === courseId)
  }))

  createCourseHandler = (values) => {
    const { subjectId, lecturerId, classType, room, weekday, startPeriod, periodNum } = values;
    const start = parseInt(startPeriod)
    const end = parseInt(startPeriod) + parseInt(periodNum) - 1 
    const periods = range(start, end);
    axios.post('/admin/course', {
      subjectId, lecturerId, classType, room, weekday, periods
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
            courses: [...this.state.courses, res.data.course]
          });
        }
      })
      .catch(err => this.props.onError(err));
  }

  deleteCourseHandler = (courseId) => {
    console.log(courseId)
    axios.delete('/admin/course/' + courseId)
      .then(res => {
        console.log(res)
        if (res.status === 200)
          this.setState({ courses: this.state.courses.filter(course => course._id !== courseId) });
      })
      .catch(err => this.props.onError(err));
  }

  render() {
    const { courses, subjects, lecturers, showForm, confirmLoading, isUpdating, updatingCourse } = this.state;

    const table = (
      <Table dataSource={courses} rowKey='_id'>
        <Column
          title='Subject ID'
          key='subjectId'
          dataIndex='subjectId.id'
        />
        <Column
          title='Subject Name'
          key='subjectName'
          dataIndex='subjectId.name'
        />
        <Column
          title='Lecturer Name'
          key='lecturerName'
          dataIndex='lecturerId.name'
        />
        <Column
          title='Class Type'
          key='classType'
          dataIndex='classType'
        />
        <Column
          title='Room'
          key='room'
          dataIndex='room'
        />
        <Column
          title='Weekday'
          key='weekday'
          dataIndex='weekday'
        />
        <Column
          title='Periods'
          key='periods'
          render={(text, record) => (
            <p>{record.periods[0] + '-' + record.periods[-1]}</p>
          )}
        />
        <Column
          title='Action'
          key='action'
          render={(text, record) => (
            <Space size='middle'>
              <Button onClick={() => this.toggleUpdate(record._id)} type='default'>Update</Button>
              <Button onClick={() => this.deleteCourseHandler(record._id)} danger type='link'>Delete</Button>
            </Space>
          )}
        />
      </Table>
    );

    const form = (
      <Modal
        title={isUpdating ? 'Update Course' : 'Create New Course'}
        visible={showForm}
        confirmLoading={confirmLoading}
        onCancel={this.toggleCreate}
        footer={[]}
      >
        <Form
          {...layout}
          id={'courseForm'}
          onFinish={this.createCourseHandler}
          onFinishFailed={null}
          initialValues={isUpdating && updatingCourse}
        >
          <Item
            label='Subject'
            name='subjectId'
            rules={[{
              required: true,
              message: 'Please select the subject at hand :D'
            }]}
          >
            <Select
              showSearch
              placeholder='Select a subject'
              optionFilterProp='children'
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              {
                subjects.map((subject, index) => (
                  <Option key={index} value={subject._id}>
                    {`${subject.id} - ${subject.name}`}
                  </Option>
                ))
              }
            </Select>
          </Item>
          <Item
            label='Lecturer'
            name='lecturerId'
            rules={[{
              required: true,
              message: 'Please select the responsible lecturer :D'
            }]}
          >
            <Select
              showSearch
              placeholder='Select the responsible lecturer'
              optionFilterProp='children'
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              {
                lecturers.map(lecturer => (
                  <Option value={lecturer._id}>
                    {`${lecturer.name}`}
                  </Option>
                ))
              }
            </Select>
          </Item>
          <Item
            label='Class Type'
            name='classType'
            rules={[{
              required: true,
              message: 'Please select the corresponding type of class :D'
            }]}
          >
            <Select placeholder='Select the class type'>
              <Option value={0}>Theory</Option>
              <Option value={1}>Laboratory</Option>
            </Select>
          </Item>
          <Item
            label='Room'
            name='room'
            rules={[{
              required: true,
              message: 'Please input the room code :D'
            }]}
          >
            <Input />
          </Item>
          <Item
            label='Weekday'
            name='weekday'
            rules={[{
              required: true,
              message: 'Please select the weekday :D'
            }]}
          >
            <Select placeholder='Select the weekday'>
              <Option value={0}>Monday</Option>
              <Option value={1}>Tuesday</Option>
              <Option value={2}>Wednesday</Option>
              <Option value={3}>Thursday</Option>
              <Option value={4}>Friday</Option>
              <Option value={5}>Saturday</Option>
            </Select>
          </Item>
          <Item
            label='Starting period'
            name='startPeriod'
            rules={[{
              required: true,
              message: 'Please input the starting period :D'
            }, {
              type: 'number',
              message: 'Please input the starting period in number :D'
            }]}
          >
            <InputNumber value={1} min={1} max={15} />
          </Item>
          <Item
            label='Period number'
            name='periodNum'
            rules={[{
              required: true,
              message: 'Please input the number of periods :D'
            }, {
              type: 'number',
              message: 'Please input the number of periods :D'
            }]}
          >
            <InputNumber value={2} min={2} max={5} />
          </Item>
          <Item {...tailLayout}>
            <Button
              type='primary'
              htmlType='submit'
            >Submit</Button>
            {/* <Button
                htmlType='reset'
              >Reset</Button> */}
            <Button
              type='link'
              onClick={this.toggleCreate}
            >Cancel</Button>
          </Item>
        </Form>
      </Modal>
    );

    return (
      <Fragment>
        <NavBreadcrumb
          elements={[
            { key: 1, text: 'Admin', to: '/' },
            { key: 2, text: 'Courses' },
          ]}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Title level={3}>Course List</Title>
          <Button type='primary' onClick={this.toggleCreate}>Add new course</Button>
        </div>
        {table}
        {form}
      </Fragment>
    )
  };
};
