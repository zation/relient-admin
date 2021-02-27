import React, { ReactNode, useContext, useMemo, useState } from 'react';
import { Form, Upload, message } from 'antd';
import cookie from 'js-cookie';
import { map, prop, reject, findIndex } from 'lodash/fp';
import { object, string, bool, func, node } from 'prop-types';
import { PlusOutlined } from '@ant-design/icons';
import Carousel, { Modal, ModalGateway, ViewType } from 'react-images';
import type { FieldInputProps, FieldMetaState } from 'react-final-form';
import type { ColProps } from 'antd/es/grid/col';
import type { UploadFile, UploadFileStatus } from 'antd/es/upload/interface';
import { View } from '../images';
import { DomainContext } from '../../contexts';
import useFieldInfo from '../../hooks/use-field-info';
import AUTHORIZATION from '../../constants/authorization';
import defaultFieldLayout from '../../constants/default-field-layout';

const { Item } = Form;

export interface MultipleUploaderProps {
  input: FieldInputProps<UploadFile[] | undefined>
  meta: FieldMetaState<UploadFile[] | undefined>
  layout?: { wrapperCol: ColProps, labelCol: ColProps }
  label?: ReactNode
  required?: boolean
  disabled?: boolean
  extra?: ReactNode
  placeholder?: string
  style?: { [key: string]: string | number | null | undefined }
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
  fileType,
  label,
  placeholder,
  style,
  required,
  onUploaded,
  extra,
  disabled,
  accept,
  action,
  placeholderClassName,
  className,
}: MultipleUploaderProps) => {
  const { cdnDomain } = useContext(DomainContext);
  const { validateStatus, help } = useFieldInfo({ touched, error, submitError });
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [modalVisible, setModalVisible] = useState(false);
  const defaultFileList = useMemo(() => map(({ url, name, size, type }: UploadFile) => ({
    uid: url || '',
    url: `${cdnDomain}${url}`,
    status: 'done' as UploadFileStatus,
    size,
    name,
    type,
  }))(value), [value]);
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
      extra={extra}
      className={className}
    >
      <div
        className="clearfix"
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
  extra: node,
  action: string,
  fileType: string,
  placeholderClassName: string,
  className: string,
};

result.displayName = __filename;

export default result;
