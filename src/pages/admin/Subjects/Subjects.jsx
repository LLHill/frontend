import React, { Component } from 'react'
import NavBreadcrumb from '../../../components/Navigation/NavBreadcrumb/NavBreadcrumb'

export default class Subjects extends Component {
  render() {
    return (
      <div>
        <NavBreadcrumb 
          elements={[
            { key: 1, text: 'Admin', to: '/admin' },
            { key: 2, text: 'Subjects' },
          ]}
        />
      </div>
    )
  }
}
