import React, { Component } from 'react'
import { Table, Space, Button } from 'antd'

import NavBreadcrumb from '../../../components/Navigation/NavBreadcrumb/NavBreadcrumb'
import axios from '../../../axios-instance'
import { convertToWeekday } from '../../../util/weekday'

const { Column } = Table;

export default class Courses extends Component {
  state = {
    courses: [],
    subjects: [],
    students: []
  }

  componentDidMount() {
    axios.get('/lecturer/courses', {
      headers: {
        'Authorization': `Bearer ${this.props.token}`
      }
    })
      .then(res => {
        console.log(res.data)
        const { courses, subjects, students } = res.data
        this.setState({
          courses,
          subjects,
          students
        })
      })
      .catch(err => this.props.onError(err));
  }

  getSubject = (subjectId) => this.state.subjects.find(subject => subject._id === subjectId);

  getStudent = (studentId) => this.state.students.find(student => student._id === studentId);

  render() {
    const { courses, subjects, students } = this.state;

    const table = (
      <Table dataSource={courses} rowKey='_id'>
        <Column
          title='Subject ID'
          key='subjectId'
          render={(text, record) => (
            this.getSubject(record.subjectId).id
          )}
        />
        <Column
          title='Subject Name'
          key='subjectName'
          render={(text, record) => (
            this.getSubject(record.subjectId).name
          )}
        />
        <Column
          title='Class Type'
          key='classType'
          render={(text, record) => (
            record.classType === "0" ? "Theory" : "Laboratory"
          )}
        />
        <Column
          title='Room'
          key='room'
          dataIndex='room'
        />
        <Column
          title='Weekday'
          key='weekday'
          render={(text, record) => convertToWeekday(record.weekday)}
        />
        <Column
          title='Periods'
          key='periods'
          render={(text, record) => (
            record.periods[0] + '-' + record.periods[record.periods.length - 1]
          )}
        />
        <Column 
          title='Student Number'
          key='studentNum'
          render={(text, record) => (
            record.regStudentIds.length
          )}
        />
        <Column
          title='Action'
          key='action'
          render={(text, record) => (
            <Space size='middle'>
              <Button onClick={() => this.toggleUpdate(record._id)} type='default'>Update</Button>
            </Space>
          )}
        />
      </Table>
    );
    return (
      <div>
        <NavBreadcrumb
          elements={[
            { key: 1, text: 'Lecturer', to: '/' },
            { key: 2, text: 'Courses' },
          ]}
        />
        {table}
        <ul>
          <li>Table for courses</li>
          <li>
            <ul>
              <li>Subject ID</li>
              <li>Subject name</li>
              <li>Subject type</li>
              <li>Course classroom</li>
              <li>Course periods</li>
              <li># of students</li>
              <li>act View course details</li>
              <li>act Edit policy</li>
              <li>act Download excel reports</li>
            </ul>
          </li>
          <li>Filters for type, periods</li>
          <li>Search for course name</li>
        </ul>
      </div>
    )
  }
}
