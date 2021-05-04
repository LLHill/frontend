import React, { Component, Fragment } from 'react'
import moment from 'moment'
import openSocket from 'socket.io-client'
import { Row, Col, Skeleton, Card, Avatar, Typography, Space, Spin, Table, Tag, Switch, Modal, Form, Checkbox, Input, AutoComplete, Button } from 'antd'
import { EditOutlined, EllipsisOutlined, SettingOutlined, CloseOutlined, CheckOutlined } from '@ant-design/icons'
import { Bar } from '@ant-design/charts';

import NavBreadcrumb from '../../../components/Navigation/NavBreadcrumb/NavBreadcrumb'
import axios from '../../../axios-instance'
import { convertToWeekday } from '../../../util/weekday'
import serverUrl from '../../../util/serverUrl'
import AntForm from '../../../components/AntForm/AntForm'

const { Meta } = Card;
const { Text } = Typography;
const { Column } = Table;
const { Item } = Form;

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};
export default class Dashboard extends Component {
  state = {
    loading: false,
    submitLoading: -1,
    checkingStudentId: '',
    isManuallyCheckingAttendance: false,
    showNoteModal: false,
    newAttendanceLoading: false,
    currentCourse: null,
    courseStudents: [],
    showSettingsModal: false,
    settings: {
      isManual: false,
      manualNote: ''
    }
  }

  componentDidMount() {
    this.setState({ loading: true });
    // get initial current class data
    axios.get('/lecturer/current-course', {
      headers: {
        'Authorization': `Bearer ${this.props.token}`
      }
    })
      .then(res => res.data)
      .then(data => {
        if (data.currentCourse) {
          // Add today to graph if not existed
          const { attendanceGroupByDate } = data.currentCourse;
          const today = moment().format("DD/MM/YYYY");
          if (!attendanceGroupByDate.find(countDate => countDate.date === today)) {
            attendanceGroupByDate.push({ count: 0, date: today });
          }
          // setstate
          this.setState({
            currentCourse: {
              ...data.currentCourse,
              attendanceGroupByDate,
              attendanceCount: data.currentCourse.currentAttendance.length
            },
            courseStudents: data.currentCourse.regStudents.map(student => {
              const check = data.currentCourse.currentAttendance.find(a => a.studentId === student._id)
              return {
                ...student,
                checkin: check === undefined ? 'Has not checked' : moment(check.createdAt).format('HH:mm')
              };
            })
          });
        }
      })
      .then(() => this.setState({ loading: false }))
      .catch(error => {
        this.setState({ loading: false });
        this.props.onError(error);
      });

    // set update current class data realtime
    const socket = openSocket(serverUrl);
    socket.on('attendance', data => {
      if (data.action === 'processing' && data.courseId === (this.state.currentCourse._id || ''))
        this.setState({ newAttendanceLoading: true });
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
          newAttendanceLoading: false
        });
      }
      if ((data.action === 'update' || data.action === 'no-action') && data.courseId === this.state.currentCourse._id)
        this.setState({ newAttendanceLoading: false });
    });

    // set state of settings based on localStorage
    const isManual = localStorage.getItem('isManual');
    const manualNote = localStorage.getItem('manualNote');
    const manualSettingsExpiryDate = localStorage.getItem('manualSettingsExpiryDate');
    if (new Date(manualSettingsExpiryDate) <= new Date()) {
      this.removeManualSettingsHandler();
      return;
    }

    this.setState({
      settings: {
        isManual: isManual === 'true' ? true : false,
        manualNote: manualNote
      }
    });
    const remainingMilliseconds = new Date(manualSettingsExpiryDate).getTime() - new Date().getTime();
    this.setAutoRemoveManualSettings(remainingMilliseconds);
  }

  onCancelConfirm = () => {
    this.setState({
      submitLoading: -1,
      checkingStudentId: '',
      showNoteModal: false
    });
  }

  onToggleCheckAttendance = (studentId, isManuallyCheckingAttendance, index) => {
    this.setState({
      submitLoading: index,
      checkingStudentId: studentId,
      isManuallyCheckingAttendance,
      showNoteModal: true
    });
  }

  onCheckingAttendance = (values, studentId = null, index = null) => {
    const { isManuallyCheckingAttendance, checkingStudentId, settings } = this.state;
    const { _id } = this.state.currentCourse;
    const { note } = values;

    this.setState({ showNoteModal: false });
    if (index) this.setState({ submitLoading: index });

    if (settings.isManual || isManuallyCheckingAttendance)
      axios.post('/lecturer/attendance', {
        studentId: studentId || checkingStudentId,
        courseId: _id,
        note: [note]
      }, {
        headers: {
          'Authorization': `Bearer ${this.props.token}`
        }
      })
        .then(res => {
          console.log(res.data);
          let currentAttendanceDate = this.state.currentCourse.attendanceGroupByDate.pop();
          currentAttendanceDate.count++;
          const changedIndex = this.state.courseStudents.findIndex(s => s._id === res.data.attendance.studentId)
          this.setState({
            currentCourse: {
              ...this.state.currentCourse,
              recentAttendee: res.data.studentName,
              currentAttendance: [...this.state.currentCourse.currentAttendance, res.data.attendance],
              attendanceCount: this.state.currentCourse.attendanceCount + 1,
              attendanceGroupByDate: [
                ...this.state.currentCourse.attendanceGroupByDate,
                currentAttendanceDate
              ]
            },
            courseStudents: this.state.courseStudents.map((student, index) =>
              index === changedIndex ? {
                ...student,
                checkin: moment(res.data.attendance.createdAt).format('HH:mm')
              } :
                student
            ),
            submitLoading: -1
          });
        })
        .catch(err => {
          this.setState({ submitLoading: -1 });
          this.props.onError(err);
        });
    else
      axios.delete('/lecturer/attendance', {
        studentId: checkingStudentId,
        courseId: _id,
        note
      }, {
        headers: {
          'Authorization': `Bearer ${this.props.token}`
        }
      })
        .then(res => { })
        .catch(err => this.props.onError(err));
  }

  onToggleShowSettings = () => this.setState({
    showSettingsModal: !this.state.showSettingsModal
  })

  onSettingsChanged = (values) => {
    console.log(values);
    const { isManual, manualNote } = values;
    localStorage.setItem('isManual', isManual);
    localStorage.setItem('manualNote', manualNote);
    const expiryDate = new Date(
      new Date().getTime() + (60 * 60 * 168000) // a week time
    );
    localStorage.setItem('manualSettingsExpiryDate', expiryDate.toISOString());
    this.setAutoRemoveManualSettings(expiryDate);
    this.setState({
      settings: {
        isManual,
        manualNote
      },
      showSettingsModal: false
    });
  }

  removeManualSettingsHandler = () => {
    this.setState({
      settings: {
        isManual: false,
        manualNote: null
      }
    });
    localStorage.removeItem('isManual');
    localStorage.removeItem('manualNote');
    localStorage.removeItem('manualSettingsExpiryDate');
  }

  setAutoRemoveManualSettings = (milliseconds) => {
    setTimeout(() => this.removeManualSettingsHandler(), milliseconds);
  }

  render() {
    const {
      loading, newAttendanceLoading, submitLoading,
      isManuallyCheckingAttendance, showNoteModal,
      showSettingsModal, settings,
      currentCourse, courseStudents
    } = this.state
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
              newAttendanceLoading ? <Spin /> :
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
              ? (newAttendanceLoading ? <Spin /> : currentCourse.recentAttendee)
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
          <SettingOutlined key="setting" onClick={this.onToggleShowSettings} />,
          <EditOutlined key="edit" />,
          <EllipsisOutlined key="ellipsis" />,
        ]}
      >
        <Skeleton loading={loading} avatar active>
          {currentCourseCardMeta}
        </Skeleton>
      </Card>
    )

    const settingsForm = (
      <AntForm
        visible={showSettingsModal}
        title={'Class Settings'}
        layout={{ ...layout }}
        id={'settingsForm'}
        initialValues={settings}
        onFinish={this.onSettingsChanged}
        onFinishFailed={null}
        onCancel={this.onToggleShowSettings}
      >
        <Item
          {...tailLayout}
          name={'isManual'}
          valuePropName='checked'
        >
          <Checkbox>Manual Check</Checkbox>
        </Item>
        <Item
          label='Reason for Manual'
          name='manualNote'
        >
          <Input />
        </Item>
      </AntForm>
    )

    const checkForm = (
      <Modal
        title={isManuallyCheckingAttendance ? 'Confirm Adding Attendance' : 'Confirm Removing Attendance'}
        visible={showNoteModal}
        onCancel={this.onCancelConfirm}
        footer={[]}
      >
        <Form
          {...layout}
          id={'checkingForm'}
          onFinish={this.onCheckingAttendance}
          onFinishFailed={null}
        >
          <Item
            label='Note'
            name='note'
            rules={[{
              required: true,
              message: 'Please input the reason!'
            }]}
          >
            <AutoComplete
              options={isManuallyCheckingAttendance ? [
                { value: 'Forgot card' },
                { value: 'Lost card' },
                { value: 'Sick leave' }
              ] : [
                { value: 'Mistake' },
                { value: 'Cheating' },
                { value: 'Missing most class time' }
              ]}
              placeholder='Input the reason'
              filterOption={(inputValue, option) =>
                option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
              }
            />
          </Item>
          <Item {...tailLayout}>
            <Button
              type='primary'
              htmlType='submit'
            >Submit</Button>
            <Button
              type='link'
              onClick={this.onCancelConfirm}
            >Cancel</Button>
          </Item>
        </Form>
      </Modal>
    )

    const table = (
      <Table
        dataSource={courseStudents}
        rowKey='_id'
        loading={loading}
        pagination={!settings.isManual && {
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
            const color = record.checkin.length < 6 ? 'green' : 'volcano';
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
        <Column
          title='Action'
          key='action'
          render={(text, record, index) => (
            <Space size='middle'>
              <Switch
                checkedChildren={<CheckOutlined />}
                unCheckedChildren={<CloseOutlined />}
                checked={record.checkin !== 'Has not checked'}
                loading={submitLoading === index}
                onChange={(checked) => settings.isManual
                  ? this.onCheckingAttendance({ note: settings.manualNote }, record._id, index)
                  : this.onToggleCheckAttendance(record._id, checked, index)
                }
              />
            </Space>
          )}
        />
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
        {settingsForm}
        {checkForm}
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
