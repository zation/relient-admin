/* eslint-disable react/jsx-props-no-spreading */
import React, { useCallback, createElement } from 'react';
import { string, node, func, bool } from 'prop-types';
import { propEq, omit } from 'lodash/fp';
import { useDispatch } from 'react-redux';
import { push, goBack } from 'relient/actions/history';
import { getFeatureBy } from '../features';
import useI18N from '../hooks/use-i18n';

const isLeftClickEvent = propEq('button')(0);

const isModifiedEvent = ({
  metaKey,
  altKey,
  ctrlKey,
  shiftKey,
}) => !!(metaKey || altKey || ctrlKey || shiftKey);

const getHref = ({ to, feature }) => {
  if (feature) {
    return getFeatureBy('link')(feature);
  }
  return to;
};

const result = ({ to, back = false, children, feature, showIcon, onClick, target, ...props }) => {
  const dispatch = useDispatch();
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
    dispatch(push(to || feature));
  }, [to, feature, back, target, onClick]);
  const i18n = useI18N();

  const icon = getFeatureBy('icon')(feature);
  return (
    <a
      href={getHref({
        to,
        feature,
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
};

result.displayName = __filename;

export default result;
