import React, { useContext, useState } from 'react';
import { Form, Upload, Message } from 'antd';
import cookie from 'js-cookie';
import { map, prop, reject, findIndex } from 'lodash/fp';
import { object, string, bool, func, node } from 'prop-types';
import { PlusOutlined } from '@ant-design/icons';
import Carousel, { Modal, ModalGateway } from 'react-images';
import { View } from '../images';
import { DomainContext } from '../../contexts';
import useFieldInfo from '../../hooks/use-field-info';
import AUTHORIZATION from '../../constants/authorization';
import defaultFieldLayout from '../../constants/default-field-layout';

const { Item } = Form;

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
}) => {
  const { cdnDomain } = useContext(DomainContext);
  const { validateStatus, help } = useFieldInfo({ touched, error, submitError });
  const [currentIndex, setCurrentIndex] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

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
    >
      <div
        className="clearfix"
        style={style}
      >
        <Upload
          action={action || `${global.location.origin}/api/resource`}
          listType="picture-card"
          data={{ fileType }}
          defaultFileList={map(({ url }) => ({
            uid: url,
            url: `${cdnDomain}${url}`,
            status: 'done',
          }))(value)}
          onChange={({ file: { uid, response, status } }) => {
            if (status === 'done') {
              if (onUploaded) {
                onUploaded(response.url);
              }
              const newFile = { ...response, uid };
              onChange(value ? [...value, newFile] : [newFile]);
            } else if (status === 'error') {
              const { errors } = response;
              Message.error(map(prop('message'))(errors));
            }
          }}
          onPreview={({ uid }) => {
            setCurrentIndex(findIndex((file) => file.url === uid || file.uid === uid)(value));
            setModalVisible(true);
          }}
          onRemove={({ uid }) => onChange(
            reject((file) => file.url === uid || file.uid === uid)(value),
          )}
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
        <ModalGateway>
          {modalVisible && (
            <Modal onClose={() => setModalVisible(false)}>
              <Carousel
                components={{ View }}
                currentIndex={currentIndex}
                views={value}
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
};

result.displayName = __filename;

export default result;
