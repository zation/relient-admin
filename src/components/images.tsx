import React from 'react';
import { Image } from 'antd';
import { map } from 'lodash/fp';

const { PreviewGroup } = Image;

export interface ImagesProps {
  images: string[]
  width?: number
  space?: number
  imageClassName?: string
  className?: string
}

export default ({ images, space = 20, width, imageClassName, className }: ImagesProps) => (
  <div className={className} style={{ marginRight: -space }}>
    <PreviewGroup>
      {map((image: string) => (
        <Image
          key={image}
          wrapperClassName={imageClassName}
          wrapperStyle={{ marginRight: space }}
          width={width}
          src={image}
        />
      ))(images)}
    </PreviewGroup>
  </div>
);
