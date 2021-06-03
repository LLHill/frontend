import React from 'react';
import { Form, Button, Modal } from 'antd';

const AntForm = props => {
  const [form] = Form.useForm();

  const {
    visible, title, loading,
    layout, id, initialValues,
    onFinish, onFinishFailed, onCancel
  } = props;

  return (
    <Modal
      visible={visible}
      title={title}
      onOk={() => {
        form.validateFields()
          .then(values => onFinish(values))
          .then(res => form.resetFields())
          .catch(info => onFinishFailed(info));
      }}
      onCancel={() => {
        onCancel();
        form.resetFields();
      }}
      footer={[
        <Button
          key='submit'
          type='primary'
          loading={loading}
          onClick={async () => {
            await form.validateFields()
              .then(values => onFinish(values))
              .catch(info => onFinishFailed(info));
            form.resetFields();
          }}
        >
          Submit
        </Button>,
        <Button
          key='reset'
          type='default'
          onClick={() => form.resetFields()}
        >
          Reset
        </Button>,
        <Button
          key='cancel'
          type='default'
          onClick={() => {
            onCancel();
            form.resetFields();
          }}
        >
          Cancel
        </Button>
      ]}
    >
      <Form
        {...layout}
        form={form}
        id={id}
        initialValues={initialValues}
        colon={false}
      >
        {props.children}
      </Form>
    </Modal >
  );
};

export default AntForm;
