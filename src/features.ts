import { flow, map, last, prop, join } from 'lodash/fp';
import { Component } from 'react';

export interface Feature {
  key: string
  link: string
  text: string
  icon?: Component
  items?: [Feature]
}

let features: Feature[] = [];

export const setFeatures = (newFeatures: Feature[]) => {
  features = newFeatures;
};

export const getSelectedFeatures = (
  key?: string,
  items = features,
  previous: Feature[] = [],
): Feature[] | null => {
  for (let index = 0; index < items.length; index += 1) {
    const feature = items[index];
    if (feature.key === key) {
      return [...previous, feature];
    }
    if (feature.items) {
      const result = getSelectedFeatures(key, feature.items, [...previous, feature]);
      if (result) {
        return result;
      }
    }
  }
  return null;
};

export const getFeatureBy = (attribute: keyof Feature) => (key?: string) => {
  const selectedFeatures = getSelectedFeatures(key);
  if (attribute === 'link') {
    return flow(map(prop('link')), join('/'))(selectedFeatures);
  }
  return flow(last, prop(attribute))(selectedFeatures);
};
