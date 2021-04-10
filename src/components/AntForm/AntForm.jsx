import React from 'react'
import { Form, Button } from 'antd';

const { Item } = Form;

const AntForm = props => {
  const [form] = Form.useForm();

  const onReset = () => {
    form.resetFields();
  };

  const { layout, tailLayout, id, onFinish, onFinishFailed, onCancel, initialValues } = props;

  return (
    <Form
      {...layout}
      form={form}
      id={id}
      onFinish={(values) => {
        onFinish(values);
        onReset();
      }}
      onFinishFailed={(error) => {
        onFinishFailed(error);
        onReset();
      }}
      initialValues={initialValues}
    >
      {props.children}
      <Item {...tailLayout}>
        <Button
          type='primary'
          htmlType='submit'
          style={{ marginRight: '10px' }}
        >Submit</Button>
        <Button
          htmlType="button"
          onClick={onReset}
        >
          Reset
        </Button>
        <Button
          type='link'
          htmlType="button"
          onClick={() => { 
            onCancel(); 
            onReset(); 
          }}
        >Cancel</Button>
      </Item>
    </Form>
  )
}

export default AntForm
