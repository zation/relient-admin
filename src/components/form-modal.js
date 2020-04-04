import React from 'react';
import { Modal } from 'antd';
import { func, bool, array, object, string } from 'prop-types';
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
}) => (
  <Modal
    destroyOnClose
    title={title}
    visible={visible}
    footer={null}
    onCancel={onCancel}
  >
    <Form
      onSubmit={onSubmit}
      initialValues={initialValues}
      fields={fields}
      layout={layout}
    />
  </Modal>
);

result.propTypes = {
  onSubmit: func.isRequired,
  visible: bool.isRequired,
  onCancel: func.isRequired,
  fields: array.isRequired,
  initialValues: object,
  title: string.isRequired,
  layout: object,
};

result.displayName = __filename;

export default result;
