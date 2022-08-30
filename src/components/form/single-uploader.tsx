import React, { useContext } from 'react';
import { object, string, bool, func } from 'prop-types';
import { Upload, message } from 'antd';
import cookie from 'js-cookie';
import { map, prop } from 'lodash/fp';
import { PlusOutlined } from '@ant-design/icons';
import { UploadFile } from 'antd/es/upload/interface';
import { DomainContext } from '../../contexts';
import { Style } from '../../interface';

const { Dragger } = Upload;

export interface SingleUploaderProps {
  value?: UploadFile
  onChange: (value: UploadFile) => void
  disabled?: boolean
  placeholder?: string
  style?: Style
  onUploaded?: (url: string) => void
  fileType?: string
  accept?: string
  action?: string
  placeholderClassName?: string
  authorizationCookie?: string
  className?: string
}

function RelientSingleUploader({
  onChange,
  value,
  placeholder,
  placeholderClassName,
  style,
  disabled,
  accept,
  onUploaded,
  action,
  fileType,
  authorizationCookie = 'AUTHORIZATION',
  className,
}: SingleUploaderProps) {
  const { cdnDomain } = useContext(DomainContext);
  const authorization = cookie.get(authorizationCookie);

  return (
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
      className={className}
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
  );
}

RelientSingleUploader.propTypes = {
  value: object,
  onChange: func,
  placeholder: string,
  style: object,
  disabled: bool,
  accept: string,
  onUploaded: func,
  action: string,
  placeholderClassName: string,
  className: string,
  fileType: string,
};

export default RelientSingleUploader;
