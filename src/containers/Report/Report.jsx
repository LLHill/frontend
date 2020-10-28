import React, { Component } from 'react'

import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler'

import axios from '../../axios-orders'

class Report extends Component {
    render() {
        return (
            <div>
                <h3>Report Page</h3>
                <p>This page includes: </p>
                <ul>
                    <li>Data visualization</li>
                    <li>Button to export reports</li>
                    <li>List of critical students</li>
                    <li>Table of upcoming classes</li>
                </ul>
            </div>
        )
    }
}

export default withErrorHandler(Report, axios)
