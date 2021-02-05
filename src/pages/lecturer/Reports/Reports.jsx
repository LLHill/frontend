import React, { Component } from 'react'
import NavBreadcrumb from '../../../components/Navigation/NavBreadcrumb/NavBreadcrumb'

export default class Reports extends Component {
  render() {
    return (
      <div>
        <NavBreadcrumb 
          elements={[
            { key: 1, text: 'Lecturer', to: '/' },
            { key: 2, text: 'Reports' },
          ]}
        />
        <h2>May put this in courses page</h2>
        <ul>
          <li>Daily reports</li>
          <li>Ban warning</li>
          <li>Early praises</li>
          <li>Table of reports: </li>
          <li>
            <ul>
              <li>Course name</li>
              <li>Up to week num</li>
              <li>Download excel</li>
            </ul>
          </li>
          <li>Filters for course name</li>
        </ul>
      </div>
    )
  }
}
