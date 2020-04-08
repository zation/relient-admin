import React, { useContext } from 'react';
import { Form, Upload, Message } from 'antd';
import cookie from 'js-cookie';
import { map, prop, concat, reject, eq } from 'lodash/fp';
import { object, string, bool, func } from 'prop-types';
import { PlusOutlined } from '@ant-design/icons';
import { DomainContext } from '../../contexts';
import useFieldInfo from '../../hooks/use-field-info';
import AUTHORIZATION from '../../constants/authorization';

const { Item } = Form;

const result = ({
  input: { onChange, value },
  meta: { touched, error },
  layout: { wrapperCol, labelCol } = {},
  label,
  placeholder,
  style,
  required,
  onUploaded,
  tips,
  disabled,
  accept,
  action,
}) => {
  const { cdnDomain } = useContext(DomainContext);
  const { validateStatus, help } = useFieldInfo({ touched, error, tips });

  return (
    <Item
      labelCol={labelCol}
      wrapperCol={wrapperCol}
      label={label}
      hasFeedback
      validateStatus={validateStatus}
      help={help}
      required={required}
    >
      <div
        className="clearfix"
        style={style}
      >
        <Upload
          action={action || `${global.location.origin}/api`}
          listType="picture-card"
          defaultFileList={map((url) => ({
            uid: url,
            url: `${cdnDomain}${url}`,
            status: 'done',
          }))(value)}
          onChange={({ file: { response, status } }) => {
            if (status === 'done') {
              if (onUploaded) {
                onUploaded(response.url);
              }
              onChange(value ? concat(value)(response.url) : [response.url]);
            } else if (status === 'error') {
              const { errors } = response;
              Message.error(map(prop('message'))(errors));
            }
          }}
          onRemove={({ uid, response }) => onChange(reject(eq(uid || response.url))(value))}
          accept={accept}
          headers={{ 'x-auth-token': cookie.get(AUTHORIZATION) }}
          name="file"
        >
          {disabled
            ? null
            : (
              <div>
                <PlusOutlined />
                <div>{placeholder}</div>
              </div>
            )}
        </Upload>
      </div>
    </Item>
  );
};

result.propTypes = {
  input: object.isRequired,
  meta: object.isRequired,
  layout: object,
  label: string,
  placeholder: string,
  style: object,
  required: bool,
  disabled: bool,
  accept: string,
  onUploaded: func,
  tips: string,
  action: string,
};

result.displayName = __filename;

export default result;
