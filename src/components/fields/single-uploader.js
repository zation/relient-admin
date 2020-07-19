import React, { useContext } from 'react';
import { object, string, bool, func, node } from 'prop-types';
import { Form, Upload, Message } from 'antd';
import cookie from 'js-cookie';
import { map, prop } from 'lodash/fp';
import { PlusOutlined } from '@ant-design/icons';
import AUTHORIZATION from '../../constants/authorization';
import useFieldInfo from '../../hooks/use-field-info';
import { DomainContext } from '../../contexts';
import defaultFieldLayout from '../../constants/default-field-layout';

const { Item } = Form;
const { Dragger } = Upload;

const result = ({
  input: { onChange, value },
  meta: { touched, error, submitError },
  layout: { wrapperCol, labelCol } = defaultFieldLayout,
  label,
  placeholder,
  placeholderClassName,
  className,
  style,
  required,
  disabled,
  accept,
  onUploaded,
  tips,
  action,
  fileType,
  extra,
}) => {
  const { cdnDomain } = useContext(DomainContext);
  const { validateStatus, help } = useFieldInfo({ touched, error, tips, submitError });

  return (
    <Item
      labelCol={labelCol}
      wrapperCol={wrapperCol}
      label={label}
      hasFeedback
      validateStatus={validateStatus}
      help={help}
      required={required}
      className={className}
    >
      <div
        style={{
          height: 120,
          width: 120,
          backgroundImage: value ? `url('${cdnDomain}${encodeURI(value.url)}')` : undefined,
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
            action={action || `${global.location.origin}/api/resource`}
            onChange={({ file: { response, status } }) => {
              if (status === 'done') {
                if (onUploaded) {
                  onUploaded(response);
                }
                onChange(response);
              } else if (status === 'error') {
                const { errors } = response;
                Message.error(map(prop('message'))(errors));
              }
            }}
            data={{ fileType }}
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
                <div className={placeholderClassName}>{placeholder}</div>
              </div>
            )}
            {extra}
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
  placeholderClassName: string,
  className: string,
  fileType: string,
  extra: node,
};

result.displayName = __filename;

export default result;
