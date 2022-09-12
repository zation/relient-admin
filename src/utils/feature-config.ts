import type {
  ReactNode,
} from 'react';
import {
  flow,
  join,
  map,
  omit,
  prop,
} from 'lodash/fp';

export interface FeatureConfig<Key> {
  key: Key
  path: string
  name: string
  icon?: ReactNode
  children?: FeatureConfig<Key>[]
}

export interface FlatFeature<T> extends Omit<FeatureConfig<T>, 'children'> {
  fullPath?: string
  keysWithParent: T[]
}

export type FlatFeatures<T extends string> = Record<T, FlatFeature<T>>;

export const getFlatFeatures = <T extends string>(
  configs: FeatureConfig<T>[],
): Record<FeatureConfig<T>['key'], FlatFeature<T>> => {
  let result: any = {};
  const getResult = (
    children: FeatureConfig<T>[],
    parents: FeatureConfig<T>[],
  ) => {
    for (let index = 0; index < children.length; index += 1) {
      const config = children[index];
      const configsWithParents = [...parents, config];
      result[config.key] = {
        ...omit<FeatureConfig<T>, 'children'>('children')(config),
        fullPath: flow(
          map<FeatureConfig<T>, string>(prop<FeatureConfig<T>, 'path'>('path')),
          join('/'),
        )(configsWithParents),
        keysWithParent: map(prop('key'))(configsWithParents),
      };
      if (config.children) {
        result = { ...result, ...getResult(config.children, configsWithParents) };
      }
    }
    return result;
  };
  return getResult(configs, []);
};

export interface Route {
  path: string
  name: string
  icon: ReactNode
  routes?: Route[]
}

export const getRoutes = <T>(configs: FeatureConfig<T>[]): Route[] => {
  const getResult = (
    children: FeatureConfig<T>[],
  ): Route[] => {
    const result = [];
    for (let index = 0; index < children.length; index += 1) {
      const config = children[index];
      result.push({
        key: config.key,
        path: config.path,
        name: config.name,
        icon: config.icon,
        routes: config.children && getResult(config.children),
      });
    }
    return result;
  };
  return getResult(configs);
};
