import React, { useContext, useMemo, useState } from 'react';
import { Upload, message } from 'antd';
import cookie from 'js-cookie';
import { map, prop, reject, findIndex } from 'lodash/fp';
import { object, string, bool, func, array } from 'prop-types';
import { PlusOutlined } from '@ant-design/icons';
import Carousel, { Modal, ModalGateway, ViewType } from 'react-images';
import type { UploadFile, UploadFileStatus } from 'antd/es/upload/interface';
// @ts-ignore
import { View } from '../images';
import { DomainContext } from '../../contexts';
import AUTHORIZATION from '../../constants/authorization';
import { Style } from '../../interface';

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
}: MultipleUploaderProps) => {
  const { cdnDomain } = useContext(DomainContext);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [modalVisible, setModalVisible] = useState(false);
  const defaultFileList = useMemo(() => map(({ url, ...others }: UploadFile) => ({
    url: `${cdnDomain}${url}`,
    status: 'done' as UploadFileStatus,
    ...others,
    uid: url || '',
  }))(value), [value]);
  const authorization = cookie.get(AUTHORIZATION);

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
        onPreview={({ uid }) => {
          setCurrentIndex(
            findIndex((file: UploadFile) => file.url === uid || file.uid === uid)(value),
          );
          setModalVisible(true);
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
      <ModalGateway>
        {modalVisible && (
          <Modal onClose={() => setModalVisible(false)}>
            <Carousel
              components={{ View }}
              currentIndex={currentIndex}
              views={value as any as ViewType[]}
            />
          </Modal>
        )}
      </ModalGateway>
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
