import React from 'react';
import { Drawer } from 'antd';
import { func, bool, array, object, string, number } from 'prop-types';
import Form from './form';

const defaultLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 12 },
};

const result = ({
  onSubmit,
  visible,
  onCancel,
  fields,
  initialValues,
  title,
  layout = defaultLayout,
  width = 500,
}) => (
  <Drawer
    destroyOnClose
    title={title}
    visible={visible}
    footer={null}
    onClose={onCancel}
    width={width}
  >
    <Form
      onSubmit={onSubmit}
      initialValues={initialValues}
      fields={fields}
      layout={layout}
    />
  </Drawer>
);

result.propTypes = {
  onSubmit: func.isRequired,
  visible: bool.isRequired,
  onCancel: func.isRequired,
  fields: array.isRequired,
  initialValues: object,
  title: string.isRequired,
  layout: object,
  width: number,
};

result.displayName = __filename;

export default result;
