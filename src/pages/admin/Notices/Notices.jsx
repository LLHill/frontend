import React, { Component } from 'react'
import NavBreadcrumb from '../../../components/Navigation/NavBreadcrumb/NavBreadcrumb'

export default class Notices extends Component {
  render() {
    return (
      <div>
        <NavBreadcrumb 
          elements={[
            { key: 1, text: 'Admin', to: '/' },
            { key: 2, text: 'Notices' },
          ]}
        />
      </div>
    )
  }
}
