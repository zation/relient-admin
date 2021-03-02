import React, { ReactNode, useContext } from 'react';
import { object, string, bool, func, node } from 'prop-types';
import { Form, Upload, message } from 'antd';
import cookie from 'js-cookie';
import { map, prop } from 'lodash/fp';
import { PlusOutlined } from '@ant-design/icons';
import { UploadFile } from 'antd/es/upload/interface';
import type { FieldInputProps, FieldMetaState } from 'react-final-form';
import type { ColProps } from 'antd/es/grid/col';
import AUTHORIZATION from '../../constants/authorization';
import useFieldInfo from '../../hooks/use-field-info';
import { DomainContext } from '../../contexts';
import defaultFieldLayout from '../../constants/default-field-layout';
import { Style } from '../interface';

const { Item } = Form;
const { Dragger } = Upload;

export interface SingleUploaderProps {
  input: FieldInputProps<UploadFile | undefined>
  meta: FieldMetaState<UploadFile | undefined>
  layout?: { wrapperCol: ColProps, labelCol: ColProps }
  label?: ReactNode
  required?: boolean
  disabled?: boolean
  extra?: ReactNode
  placeholder?: string
  style?: Style
  onUploaded?: (url: string) => void
  fileType?: string
  accept?: string
  action?: string
  placeholderClassName?: string
  className?: string
}

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
  action,
  fileType,
  extra,
}: SingleUploaderProps) => {
  const { cdnDomain } = useContext(DomainContext);
  const { validateStatus, help } = useFieldInfo({ touched, error, submitError });
  const authorization = cookie.get(AUTHORIZATION);

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
      extra={extra}
    >
      <div
        style={{
          height: 120,
          width: 120,
          backgroundImage: value && value.url ? `url('${cdnDomain}${encodeURI(value.url)}')` : undefined,
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
                message.error(map(prop('message'))(errors));
              }
            }}
            data={{ fileType }}
            showUploadList={false}
            accept={accept}
            headers={authorization ? { 'x-auth-token': authorization } : undefined}
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
  action: string,
  placeholderClassName: string,
  className: string,
  fileType: string,
  extra: node,
};

result.displayName = __filename;

export default result;
