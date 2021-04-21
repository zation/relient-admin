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

const getHref = ({ to, feature, baseUrl }: { to?: string, feature?: string, baseUrl?: string }) => {
  if (feature) {
    return getWithBaseUrl(getFeatureBy('link')(feature), baseUrl);
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
  feature?: string
  showIcon?: boolean
}

const result = ({
  to,
  back = false,
  children,
  feature,
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
    const finalTo = to ? getWithBaseUrl(to, baseUrl) : feature;
    if (finalTo) {
      dispatch(push(finalTo));
    }
  }, [to, feature, back, target, onClick, baseUrl]);
  const i18n = useI18N();

  const icon = getFeatureBy('icon')(feature);
  return (
    <a
      href={getHref({
        to,
        feature,
        baseUrl,
      })}
      {...omit(['push', 'back', 'goBack'])(props)}
      onClick={handleClick}
    >
      {children}
      {!children && icon && showIcon && createElement(icon)}
      {!children && <span>{i18n(getFeatureBy('text')(feature))}</span>}
    </a>
  );
};

result.propTypes = {
  to: string,
  feature: string,
  children: node,
  onClick: func,
  back: bool,
  target: string,
  showIcon: bool,
  baseUrl: string,
};

result.displayName = __filename;

export default result;
