import UniversalRouter from 'universal-router';
import { isFunction, isArray } from 'lodash/fp';
import { getEntity } from 'relient/selectors';
import { getWithBaseUrl } from 'relient/url';
import { setFeature } from './actions/feature';

export default ({ routes, auth, baseUrl = '', ...options }) => new UniversalRouter(routes, {
  ...options,
  baseUrl: baseUrl === '/' ? '' : baseUrl,
  async resolveRoute(context) {
    const {
      route,
      route: {
        load,
        action,
        onEnter,
        feature,
        requireAuth,
        component,
        redirect,
      },
      store: { dispatch, getState },
      params,
    } = context;

    const state = getState();

    if (onEnter) {
      await onEnter(context, params);
    }
    if (feature) {
      dispatch(setFeature(feature));
    }

    if (auth) {
      const authResult = auth({ requireAuth, state });
      if (authResult) {
        return authResult;
      }
    } else if (requireAuth && !getEntity('auth.isLogin')(state)) {
      return { redirect: getWithBaseUrl('/auth/login', baseUrl) };
    }

    if (redirect || redirect === '') {
      return { ...route, redirect: getWithBaseUrl(redirect, baseUrl) };
    }
    if (component) {
      return route;
    }
    if (isFunction(load)) {
      const module = await load();
      const result = await module.default(context);
      if (result.component) {
        return result;
      }
      if (isArray(result)) {
        route.children = result;
      }
    }
    if (isFunction(action)) {
      const result = await action(context);
      if (result.feature) {
        dispatch(setFeature(result.feature));
      }
      if (result.redirect || result.redirect === '') {
        result.redirect = getWithBaseUrl(result.redirect, baseUrl);
      }
      return { ...context.route, ...result };
    }
    return context.next();
  },
});
