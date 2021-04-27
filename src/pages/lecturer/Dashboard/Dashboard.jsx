import React, { Component, Fragment } from 'react'
import openSocket from 'socket.io-client'
import { Row, Col, Skeleton, Card, Avatar, Typography, Space, Spin } from 'antd'
import { EditOutlined, EllipsisOutlined, SettingOutlined } from '@ant-design/icons'
import { Bar } from '@ant-design/charts';

import NavBreadcrumb from '../../../components/Navigation/NavBreadcrumb/NavBreadcrumb'
import axios from '../../../axios-instance'
import { convertToWeekday } from '../../../util/weekday'
import serverUrl from '../../../util/serverUrl'

const { Meta } = Card;
const { Text } = Typography;

export default class Dashboard extends Component {
  state = {
    loading: false,
    avtLoading: false,
    currentCourse: null
  }

  componentDidMount() {
    this.setState({ loading: true })
    axios.get('/lecturer/current-course', {
      headers: {
        'Authorization': `Bearer ${this.props.token}`
      }
    })
      .then(res => {
        // console.log(res.data)
        return res.data;
      })
      .then(data => this.setState({
        loading: false,
        currentCourse: data.currentCourse && data.currentCourse
      }))
      .catch(error => this.props.onError(error));

    const socket = openSocket(serverUrl);
    socket.on('attendance', data => {
      console.log(data);
      if (data.action === 'processing' && data.courseId === this.state.currentCourse._id)
        this.setState({ avtLoading: true });
      if (data.action === 'create' && data.courseId === this.state.currentCourse._id) {
        let currentAttendanceDate = this.state.currentCourse.attendanceGroupByDate.pop();
        currentAttendanceDate.count++;
        this.setState({
          currentCourse: {
            ...this.state.currentCourse,
            attendanceCount: this.state.currentCourse.attendanceCount + 1,
            recentAttendee: data.studentName,
            attendanceGroupByDate: [
              ...this.state.currentCourse.attendanceGroupByDate,
              currentAttendanceDate
            ]
          },
          avtLoading: false
        });
      }
      if ((data.action === 'update' || data.action === 'no-action') && data.courseId === this.state.currentCourse._id)
        this.setState({ avtLoading: false });
    });
  }

  render() {
    const { loading, avtLoading, currentCourse } = this.state
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
