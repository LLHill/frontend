import React, { Fragment } from 'react'
import { Modal } from 'antd'

export const ErrorHandler = (props) => {
  const { onHandle, error } = props;
  error && console.log(error);
  return (
    <Fragment>
      <Modal
        title={'An Error Occurred D:'}
        onOk={onHandle}
        onCancel={onHandle}
        visible={error ? true : false}
      >
        <p>Message: {error && error.message}</p>
        <p>{error && error.data && 'Data:' + error.data.map(err => JSON.stringify(err))}</p>
      </Modal>
    </Fragment>
  )
}
