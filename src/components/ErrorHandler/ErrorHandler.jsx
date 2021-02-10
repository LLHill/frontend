import React, { Fragment } from 'react'
import { Modal } from 'antd'

export const ErrorHandler = (props) => {
  const { onHandle, error } = props;
  return (
    <Fragment>
      <Modal
        title={'An Error Occurred D:'}
        onOk={onHandle}
        onCancel={onHandle}
        visible={error ? true : false}
      >
        <p>{error && error.message}</p>
      </Modal>
    </Fragment>
  )
}
