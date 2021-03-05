import Title from 'antd/lib/typography/Title'
import React, { Component } from 'react'
import NavBreadcrumb from '../../../components/Navigation/NavBreadcrumb/NavBreadcrumb'

export default class Dashboard extends Component {
  render() {
    return (
      <div>
        <NavBreadcrumb
          elements={[
            { key: 1, text: 'Admin', to: '/' },
            { key: 2, text: 'Dashboard' },
          ]}
        />
        <Title level={3}>Under development D:</Title>
      </div>
    )
  }
}
