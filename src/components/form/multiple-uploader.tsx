import React, {
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import {
  Upload,
  message,
  Modal,
} from 'antd';
import cookie from 'js-cookie';
import {
  map,
  prop,
  reject,
  startsWith,
} from 'lodash/fp';
import {
  object,
  string,
  bool,
  func,
  array,
} from 'prop-types';
import { PlusOutlined } from '@ant-design/icons';
import type {
  UploadFile,
  UploadFileStatus,
} from 'antd/es/upload/interface';
import { DomainContext } from '../../contexts';
import { Style } from '../../interface';

interface Preview {
  visible: boolean
  title?: string
  image?: string
}

const getBase64 = (file: Blob):Promise<string | undefined> => new Promise((onResolve, onReject) => {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => onResolve(reader.result?.toString());
  reader.onerror = (error) => onReject(error);
});

export interface MultipleUploaderProps {
  value?: UploadFile[]
  onChange: (value: UploadFile[]) => void
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

const result = ({
  onChange,
  value,
  fileType,
  placeholder,
  style,
  onUploaded,
  disabled,
  accept,
  action,
  placeholderClassName,
  className,
  authorizationCookie = 'AUTHORIZATION',
}: MultipleUploaderProps) => {
  const { cdnDomain } = useContext(DomainContext);
  const [preview, setPreview] = useState<Preview>({ visible: false });
  const defaultFileList = useMemo(() => map(({ url, ...others }: UploadFile) => ({
    url: !url || startsWith('http://')(url) || startsWith('https://')(url) ? url : `${cdnDomain}${url}`,
    status: 'done' as UploadFileStatus,
    ...others,
    uid: others.uid || url || others.fileName || '',
  }))(value), [value]);
  const authorization = cookie.get(authorizationCookie);
  const onPreviewCancel = useCallback(() => setPreview({ visible: false }), []);

  return (
    <div
      className={`${className} clearfix`}
      style={style}
    >
      <Upload
        action={action || `${global.location.origin}/api/resource`}
        listType="picture-card"
        data={{ fileType }}
        defaultFileList={defaultFileList}
        onChange={({ file: { uid, response, status } }) => {
          if (status === 'done') {
            if (onUploaded) {
              onUploaded(response.url);
            }
            const newFile = { ...response, uid };
            onChange(value ? [...value, newFile] : [newFile]);
          } else if (status === 'error') {
            const { errors } = response;
            message.error(map(prop('message'))(errors));
          }
        }}
        onPreview={async (file) => {
          setPreview({
            visible: true,
            title: file.name || file.url,
            image: file.url || (await getBase64(file.originFileObj)),
          });
        }}
        onRemove={({ uid }) => onChange(
          reject((file: UploadFile) => file.url === uid || file.uid === uid)(value),
        )}
        accept={accept}
        headers={authorization ? { 'x-auth-token': authorization } : undefined}
        name="file"
      >
        {disabled
          ? null
          : (
            <div>
              <PlusOutlined />
              <div className={placeholderClassName}>{placeholder}</div>
            </div>
          )}
      </Upload>
      <Modal
        visible={preview.visible}
        title={preview.title}
        footer={null}
        onCancel={onPreviewCancel}
      >
        <img alt="example" style={{ width: '100%' }} src={preview.image} />
      </Modal>
    </div>
  );
};

result.propTypes = {
  value: array,
  onChange: func,
  placeholder: string,
  style: object,
  disabled: bool,
  accept: string,
  onUploaded: func,
  action: string,
  fileType: string,
  placeholderClassName: string,
  className: string,
};

result.displayName = __filename;

export default result;
