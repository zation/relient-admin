/* eslint-disable jsx-a11y/no-static-element-interactions,jsx-a11y/click-events-have-key-events */
import React, { useContext, useState } from 'react';
import { array, number, shape, string, func, bool } from 'prop-types';
import { map, prop } from 'lodash/fp';
import { className } from 'react-images/lib/utils';
import QRCode from 'react-qr-code';
import { DomainContext } from '../contexts';
import Carousel, { Modal, ModalGateway, Div, Img } from '../libs/react-images';

const mapWithIndex = map.convert({ cap: false });

export const View = (props) => {
  const { data, formatters, getStyles, index, isFullscreen, isModal } = props;
  const { cdnDomain } = useContext(DomainContext);

  return (
    <Div
      css={getStyles('view', props)}
      className={className('view', { isFullscreen, isModal })}
    >
      {data.qrCode ? (
        <Div className="relient-admin-images-qr-code-container">
          <QRCode value={data.qrCode} />
        </Div>
      ) : (
        <Img
          alt={formatters.getAltText({ data, index })}
          src={`${cdnDomain}${encodeURI(prop('url')(data) || prop('file.url')(data) || prop('response.url')(data))}`}
          className={className('view-image', { isFullscreen, isModal })}
          css={{
            height: 'auto',
            maxHeight: '100vh',
            maxWidth: '100vw',
            userSelect: 'none',
          }}
        />
      )}
    </Div>
  );
};

View.propTypes = {
  data: shape({ qrCode: string }),
  formatters: shape({ getAltText: func }),
  getStyles: func,
  index: number,
  isFullscreen: bool,
  isModal: bool,
};

const result = ({
  images,
  thumbSize = 40,
  thumbGap = 10,
  width,
}) => {
  const { cdnDomain } = useContext(DomainContext);
  const [currentIndex, setCurrentIndex] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <>
      <div style={thumbGap ? { marginBottom: `-${thumbGap}px` } : undefined} className="relient-admin-images-root">
        {mapWithIndex(({ file, qrCode }, index) => (
          <div
            key={index}
            onClick={() => {
              setModalVisible(true);
              setCurrentIndex(index);
            }}
            className="relient-admin-images-image-container"
            style={{ margin: `0 ${thumbGap}px ${thumbGap}px 0` }}
          >
            {file ? (
              <img
                src={`${cdnDomain}${encodeURI(file.url)}`}
                alt={file.name}
                style={width ? { width } : { height: thumbSize, width: thumbSize }}
              />
            ) : (
              qrCode && (<QRCode value={qrCode} size={thumbSize} />)
            )}
          </div>
        ))(images)}
      </div>
      <ModalGateway>
        {modalVisible && (
          <Modal onClose={() => setModalVisible(false)}>
            <Carousel
              components={{ View }}
              currentIndex={currentIndex}
              views={images}
            />
          </Modal>
        )}
      </ModalGateway>
    </>
  );
};

result.propTypes = {
  images: array,
  thumbSize: number,
  thumbGap: number,
  width: number,
};

result.displayName = __filename;

export default result;
