import React, { Component } from 'react'
import NavBreadcrumb from '../../../components/Navigation/NavBreadcrumb/NavBreadcrumb'

export default class Subjects extends Component {
  render() {
    return (
      <div>
        <NavBreadcrumb 
          elements={[
            { key: 1, text: 'Admin', to: '/' },
            { key: 2, text: 'Subjects' },
          ]}
        />
      </div>
    )
  }
}
