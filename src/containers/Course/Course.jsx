import React, { Component } from 'react'

import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler'

import axios from '../../axios-orders'

class Course extends Component {
    render() {
        return (
            <div>
                <h3>Course Page</h3>
                <p>This page includes: </p>
                <ul>
                    <li>Breadcrumb</li>
                    <li>Name of page: Course List</li>
                    <li>Button to add new course</li>
                    <li>Table of available courses, with columns:</li>
                    <ul>
                        <li>Course code</li>
                        <li>Course name</li>
                        <li>Room</li>
                        <li>Class time (tiết học)</li>
                        <li>Weekday</li>
                        <li># of registered students</li>
                        <li>Action buttons: View, Edit, Archive</li>
                    </ul>
                </ul>
            </div>
        )
    }
}

export default withErrorHandler(Course, axios)
