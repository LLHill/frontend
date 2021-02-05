import React, { Component } from 'react'

export default class Courses extends Component {
  render() {
    return (
      <div>
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
