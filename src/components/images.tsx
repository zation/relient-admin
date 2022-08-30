/* eslint-disable react/no-array-index-key */
import React from 'react';
import { Image } from 'antd';

const { PreviewGroup } = Image;

export interface ImagesProps {
  images: string[]
  width?: number
  space?: number
  imageClassName?: string
  className?: string
}

function RelientImages({ images, space = 20, width, imageClassName, className }: ImagesProps) {
  return (
    <div className={className} style={{ marginRight: -space }}>
      <PreviewGroup>
        {images.map((image, index) => (
          <Image
            key={`${image}${index}`}
            wrapperClassName={imageClassName}
            wrapperStyle={{ marginRight: space }}
            width={width}
            src={image}
          />
        ))}
      </PreviewGroup>
    </div>
  );
}

export default RelientImages;
