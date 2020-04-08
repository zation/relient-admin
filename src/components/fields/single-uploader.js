import React, { useContext } from 'react';
import { object, string, bool, func } from 'prop-types';
import { Form, Upload, Message } from 'antd';
import cookie from 'js-cookie';
import { map, prop } from 'lodash/fp';
import { PlusOutlined } from '@ant-design/icons';
import AUTHORIZATION from '../../constants/authorization';
import useFieldInfo from '../../hooks/use-field-info';
import { DomainContext } from '../../contexts';

const { Item } = Form;
const { Dragger } = Upload;

const result = ({
  input: { onChange, value },
  meta: { touched, error },
  layout: { wrapperCol, labelCol } = {},
  label,
  placeholder,
  style,
  required,
  disabled,
  accept,
  onUploaded,
  tips,
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
      className="relient-admin-single-uploader"
    >
      <div
        style={{
          height: 120,
          width: 120,
          backgroundImage: `url(${cdnDomain}${value})`,
          backgroundSize: 'contain',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          borderRadius: 6,
          ...style,
        }}
      >
        {!disabled
        && (
          <Dragger
            action={action || `${global.location.origin}/api`}
            onChange={({ file: { response, status } }) => {
              if (status === 'done') {
                if (onUploaded) {
                  onUploaded(response.url);
                }
                onChange(response.url);
              } else if (status === 'error') {
                const { errors } = response;
                Message.error(map(prop('message'))(errors));
              }
            }}
            showUploadList={false}
            accept={accept}
            headers={{ 'x-auth-token': cookie.get(AUTHORIZATION) }}
            name="file"
            style={{ background: 'none' }}
          >
            {!value
            && (
              <div>
                <PlusOutlined />
                <div>{placeholder}</div>
              </div>
            )}
          </Dragger>
        )}
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
