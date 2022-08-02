import React from 'react';
import { Image } from 'antd';
import { map } from 'lodash/fp';

const { PreviewGroup } = Image;

// @ts-ignore
const mapWithIndex = map.convert({ cap: false });

export interface ImagesProps {
  images: string[]
  width?: number
  space?: number
  imageClassName?: string
  className?: string
}

const result = ({ images, space = 20, width, imageClassName, className }: ImagesProps) => (
  <div className={className} style={{ marginRight: -space }}>
    <PreviewGroup>
      {mapWithIndex((image: string, index: number) => (
        <Image
          key={`${image}${index}`}
          wrapperClassName={imageClassName}
          wrapperStyle={{ marginRight: space }}
          width={width}
          src={image}
        />
      ))(images)}
    </PreviewGroup>
  </div>
);

result.displayName = __filename;

export default result;
