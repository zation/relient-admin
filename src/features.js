import { flow, map, last, prop, join } from 'lodash/fp';

let features = [];
let baseUrl = '';

export const setFeatures = (newFeatures, newBaseUrl = baseUrl) => {
  features = newFeatures;
  baseUrl = newBaseUrl;
};

export const getSelectedFeatures = (key, items = features, previous = []) => {
  for (let index = 0; index < items.length; index += 1) {
    const feature = items[index];
    if (feature.key === key) {
      return [...previous, feature];
    }
    if (feature.items) {
      const result = getSelectedFeatures(key, feature.items, [...previous,
        feature]);
      if (result) {
        return result;
      }
    }
  }
  return null;
};

export const getFeatureBy = (attribute) => (key) => {
  const selectedFeatures = getSelectedFeatures(key);
  if (attribute === 'link') {
    return `${baseUrl}/${flow(map(prop('link')), join('/'))(selectedFeatures)}`;
  }
  return flow(last, prop(attribute))(selectedFeatures);
};
