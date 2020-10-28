import React, { Component } from 'react'

import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler'

import axios from '../../axios-orders'

class Home extends Component {
    render() {
        return (
            <div>
                <h3>Home Page</h3>
                <p>This page includes: </p>
                <ul>
                    <li>Current week</li>
                    <li>Current class attendance heartbeat (graph)</li>
                    <li>List of critical students</li>
                    <li>Table of upcoming classes</li>
                </ul>
            </div>
        )
    }
}

export default withErrorHandler(Home, axios)
