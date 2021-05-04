import React, { Component, Fragment } from 'react'
import moment from 'moment'
import openSocket from 'socket.io-client'
import { Row, Col, Skeleton, Card, Avatar, Typography, Space, Spin, Table, Tag } from 'antd'
import { EditOutlined, EllipsisOutlined, SettingOutlined } from '@ant-design/icons'
import { Bar } from '@ant-design/charts';

import NavBreadcrumb from '../../../components/Navigation/NavBreadcrumb/NavBreadcrumb'
import axios from '../../../axios-instance'
import { convertToWeekday } from '../../../util/weekday'
import serverUrl from '../../../util/serverUrl'

const { Meta } = Card;
const { Text } = Typography;
const { Column } = Table;

export default class Dashboard extends Component {
  state = {
    loading: false,
    avtLoading: false,
    currentCourse: null,
    courseStudents: []
  }

  componentDidMount() {
    this.setState({ loading: true });
    axios.get('/lecturer/current-course', {
      headers: {
        'Authorization': `Bearer ${this.props.token}`
      }
    })
      .then(res => {
        console.log(res.data)
        return res.data;
      })
      .then(data => {
        if (data.currentCourse) {
          // Add today to graph if not existed
          const { attendanceGroupByDate } = data.currentCourse;
          const today = moment().format("DD/MM/YYYY");
          if (!attendanceGroupByDate.find(countDate => countDate.date === today))
            attendanceGroupByDate.push({ count: 0, date: today });

          this.setState({
            loading: false,
            currentCourse: {
              ...data.currentCourse,
              attendanceGroupByDate,
              attendanceCount: data.currentCourse.currentAttendance.length
            },
            courseStudents: data.currentCourse.regStudents.map(student => {
              const check = data.currentCourse.currentAttendance.find(a => a.studentId === student._id)
              return {
                ...student,
                checkin: check ? moment(check.createdAt).format('HH:mm') : 'Has not checked'
              };
            })
          });
        } else {
          this.setState({ loading: false });
        }
      })
      .catch(error => this.props.onError(error));

    const socket = openSocket(serverUrl);
    socket.on('attendance', data => {
      console.log(this.state);
      if (data.action === 'processing' && data.courseId === (this.state.currentCourse._id || ''))
        this.setState({ avtLoading: true });
      if (data.action === 'create' && data.courseId === (this.state.currentCourse._id || '')) {
        let currentAttendanceDate = this.state.currentCourse.attendanceGroupByDate.pop();
        currentAttendanceDate.count++;
        const changedIndex = this.state.courseStudents.findIndex(s => s._id === data.attendance.studentId)
        this.setState({
          currentCourse: {
            ...this.state.currentCourse,
            currentAttendance: [...this.state.currentCourse.currentAttendance, data.attendance],
            attendanceCount: this.state.currentCourse.attendanceCount + 1,
            recentAttendee: data.studentName,
            attendanceGroupByDate: [
              ...this.state.currentCourse.attendanceGroupByDate,
              currentAttendanceDate
            ]
          },
          courseStudents: this.state.courseStudents.map((student, index) =>
            index === changedIndex ? {
              ...student,
              checkin: moment(data.attendance.createdAt).format('HH:mm')
            } :
              student
          ),
          avtLoading: false
        });
      }
      if ((data.action === 'update' || data.action === 'no-action') && data.courseId === this.state.currentCourse._id)
        this.setState({ avtLoading: false });
    });
  }

  render() {
    const { loading, avtLoading, currentCourse, courseStudents } = this.state
    let currentCourseChart = null
    let currentCourseCardMeta = (
      <Meta
        avatar={
          <Avatar
            size={50}
            style={{ color: '#f56a00', backgroundColor: '#fde3cf', fontSize: '30px' }}
          >
            100
          </Avatar>
        }
        title="No course now :D Enjoy!"
      />
    )
    if (currentCourse) {
      currentCourseCardMeta = (
        <Fragment>
          <Meta
            avatar={
              avtLoading ? <Spin /> :
                <Avatar
                  size={40}
                  style={{ color: '#f56a00', backgroundColor: '#fde3cf', fontSize: '28px' }}
                >
                  {currentCourse.attendanceCount}
                </Avatar>
            }
            title={currentCourse.subjectName}
          />
          <Space direction="vertical">
            <Text>Room: {currentCourse.roomCode}</Text>
            <Text>Time: {convertToWeekday(currentCourse.weekday)} ({currentCourse.startPeriod} - {currentCourse.endPeriod})</Text>
            <Text>Recent Attendee: {currentCourse.recentAttendee !== ''
              ? (avtLoading ? <Spin /> : currentCourse.recentAttendee)
              : 'No one yet :D'
            }</Text>
          </Space>
        </Fragment>
      )

      const chartConfig = {
        data: currentCourse.attendanceGroupByDate,
        xField: 'count',
        yField: 'date',
        style: {
          maxWidth: 800,
          height: 300
        },
        label: {
          style: {
            fill: '#aaa',
          },
        },
      };
      currentCourseChart = (
        <Bar
          {...chartConfig}
        />
      )
    }

    const currentCourseCard = (
      <Card
        style={{
          maxWidth: 400,
          marginTop: 16,
          marginRight: 20
        }}
        actions={[
          <SettingOutlined key="setting" />,
          <EditOutlined key="edit" />,
          <EllipsisOutlined key="ellipsis" />,
        ]}
      >
        <Skeleton loading={loading} avatar active>
          {currentCourseCardMeta}
        </Skeleton>
      </Card>
    )

    const table = (
      <Table
        dataSource={courseStudents}
        rowKey='_id'
        loading={loading}
        pagination={{
          total: courseStudents.length,
          showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} students`,
          defaultPageSize: 5,
          defaultCurrent: 1
        }}
      >
        <Column
          title='Student ID'
          key='id'
          dataIndex='id'
          defaultSortOrder={'descend'}
          sorter={{
            compare: (a, b) => a.id.localeCompare(b.id),
            multiple: 1
          }}
        />
        <Column
          title='Student Name'
          key='name'
          dataIndex='name'
        />
        <Column
          title='Checkin'
          key='checkin'
          render={(text, record) => {
            const color = record.checkin.length > 6 ? 'green' : 'volcano';
            return (
              <Tag color={color}>
                {record.checkin}
              </Tag>
            )
          }}
          defaultSortOrder={'descend'}
          sorter={{
            compare: (a, b) => a.checkin.localeCompare(b.checkin),
            multiple: 2
          }} />
      </Table>
    )

    return (
      <div>
        <NavBreadcrumb
          elements={[
            { key: 1, text: 'Lecturer', to: '/' },
            { key: 2, text: 'Dashboard' },
          ]}
        />
        <Row>
          <Col flex={2}>
            {currentCourseCard}
          </Col>
          <Col flex={3}>
            {currentCourseChart}
          </Col>
        </Row>
        <Row>
          <Col>
          </Col>
        </Row>
        <div style={{ marginTop: '20px' }}>
          {table}
        </div>
        {/* <Divider>Note:</Divider>
        <p>The lecturer's dashboard contains:</p>
        <ul>
          <li>Attendance heartbeats of courses in a slide</li>
          <li>Upcoming course</li>
          <li>or current course (with number of present students)</li>
          <li>Warning of upcoming banned final</li>
          <li>Leave/off requests</li>
          <li>Available reports (quick download excel files)</li>
          <li>On demand helps</li>
          <li>Annoucements</li>
          <li>Bug reporting</li>
        </ul> */}
      </div>
    )
  }
}
