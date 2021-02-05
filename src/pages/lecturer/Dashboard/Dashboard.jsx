import React, { Component } from 'react'

export default class Dashboard extends Component {
  render() {
    return (
      <div>
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
        </ul>
      </div>
    )
  }
}
