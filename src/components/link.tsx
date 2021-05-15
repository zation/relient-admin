/* eslint-disable react/jsx-props-no-spreading */
import React, { useCallback, createElement, useContext, AnchorHTMLAttributes, MouseEvent } from 'react';
import { string, node, func, bool, ReactNodeLike } from 'prop-types';
import { propEq, omit } from 'lodash/fp';
import { useDispatch } from 'react-redux';
import { push, goBack } from 'relient/actions/history';
import { getWithBaseUrl } from 'relient/url';
import { useI18N } from 'relient/i18n';
import { getFeatureBy } from 'relient/features';
import { BaseUrlContext } from '../contexts';

const isLeftClickEvent = propEq('button')(0);

const isModifiedEvent = ({
  metaKey,
  altKey,
  ctrlKey,
  shiftKey,
}: MouseEvent<HTMLAnchorElement>) => (metaKey || altKey || ctrlKey || shiftKey);

const getHref = ({ to, featureKey, baseUrl }: { to?: string, featureKey?: string, baseUrl?: string }) => {
  if (featureKey) {
    return getWithBaseUrl(getFeatureBy('link')(featureKey), baseUrl);
  }
  if (to) {
    return getWithBaseUrl(to, baseUrl);
  }
  return undefined;
};

export interface LinkProps extends AnchorHTMLAttributes<HTMLAnchorElement>{
  to?: string
  back?: boolean
  children?: ReactNodeLike
  featureKey?: string
  showIcon?: boolean
}

const result = ({
  to,
  back = false,
  children,
  featureKey,
  showIcon,
  onClick,
  target,
  ...props
}: LinkProps) => {
  const dispatch = useDispatch();
  const baseUrl = useContext(BaseUrlContext);
  const handleClick = useCallback((event: MouseEvent<HTMLAnchorElement>) => {
    if (back) {
      event.preventDefault();
      dispatch(goBack());
    }
    if (onClick) {
      onClick(event);
      return;
    }
    if (isModifiedEvent(event) || !isLeftClickEvent(event)) {
      return;
    }

    if (event.defaultPrevented || target === '_blank') {
      return;
    }

    event.preventDefault();
    const finalTo = to ? getWithBaseUrl(to, baseUrl) : featureKey;
    if (finalTo) {
      dispatch(push(finalTo));
    }
  }, [to, featureKey, back, target, onClick, baseUrl]);
  const i18n = useI18N();

  const icon = getFeatureBy('icon')(featureKey);
  return (
    <a
      href={getHref({
        to,
        featureKey,
        baseUrl,
      })}
      {...omit(['push', 'back', 'goBack'])(props)}
      onClick={handleClick}
    >
      {children}
      {!children && icon && showIcon && createElement(icon)}
      {!children && <span>{i18n(getFeatureBy('text')(featureKey))}</span>}
    </a>
  );
};

result.propTypes = {
  to: string,
  featureKey: string,
  children: node,
  onClick: func,
  back: bool,
  target: string,
  showIcon: bool,
  baseUrl: string,
};

result.displayName = __filename;

export default result;
