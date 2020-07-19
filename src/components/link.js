/* eslint-disable react/jsx-props-no-spreading */
import React, { useCallback, createElement, useContext } from 'react';
import { string, node, func, bool } from 'prop-types';
import { propEq, omit } from 'lodash/fp';
import { useDispatch } from 'react-redux';
import { push, goBack } from 'relient/actions/history';
import { getWithBaseUrl } from 'relient/url';
import { BaseUrlContext } from '../contexts';
import { getFeatureBy } from '../features';
import useI18N from '../hooks/use-i18n';

const isLeftClickEvent = propEq('button')(0);

const isModifiedEvent = ({
  metaKey,
  altKey,
  ctrlKey,
  shiftKey,
}) => !!(metaKey || altKey || ctrlKey || shiftKey);

const getHref = ({ to, feature, baseUrl }) => {
  if (feature) {
    return getWithBaseUrl(getFeatureBy('link')(feature), baseUrl);
  }
  return getWithBaseUrl(to, baseUrl);
};

const result = ({
  to,
  back = false,
  children,
  feature,
  showIcon,
  onClick,
  target,
  ...props
}) => {
  const dispatch = useDispatch();
  const baseUrl = useContext(BaseUrlContext);
  const handleClick = useCallback((event) => {
    if (back) {
      event.preventDefault();
      dispatch(goBack());
    }
    if (onClick && onClick(event) === false) {
      event.preventDefault();
      return;
    }
    if (isModifiedEvent(event) || !isLeftClickEvent(event)) {
      return;
    }

    if (event.defaultPrevented === true || target === '_blank') {
      return;
    }

    event.preventDefault();
    dispatch(push(to ? getWithBaseUrl(to, baseUrl) : feature));
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
