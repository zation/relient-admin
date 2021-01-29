import UniversalRouter, { Routes, Route, RouteContext } from 'universal-router';
import { isFunction, isArray, has } from 'lodash/fp';
import { getEntity } from 'relient/selectors';
import { getWithBaseUrl } from 'relient/url';
import type { ElementType } from 'react';
import { setFeature } from './actions/feature';
import type { Feature } from './features';

interface Params {
  routes: Routes
  auth: (params: { requireAuth?: boolean, state: object }) => { redirect?: string }
  baseUrl?: string
}

interface ExtendedRoute extends Route {
  load?: () => Promise<{
    default: (context: RouteContext) => Promise<ExtendedRoute | Routes>
  }>
  onEnter?: (context: RouteContext, params: any) => void
  feature?: Feature
  requireAuth?: boolean
  component?: ElementType
  redirect: string
}

export default ({ routes, auth, baseUrl = '', ...options }: Params) => new UniversalRouter(routes, {
  ...options,
  baseUrl: baseUrl === '/' ? '' : baseUrl,
  async resolveRoute(context) {
    const {
      route,
      store: { dispatch, getState },
      params,
    } = context;
    const {
      load,
      action,
      onEnter,
      feature,
      requireAuth,
      component,
      redirect,
    } = route as ExtendedRoute;

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
      if (has('component')(result)) {
        return result;
      }
      if (isArray(result)) {
        route.children = result;
      }
    }
    if (isFunction(action)) {
      const result = await action(context, params);
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
