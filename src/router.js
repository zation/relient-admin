import UniversalRouter from 'universal-router';
import { isFunction, isArray } from 'lodash/fp';
import { setFeature } from './actions/feature';

export default ({ routes, auth }) => new UniversalRouter(routes, {
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
    const authResult = auth({ requireAuth, state });
    if (authResult) {
      return authResult;
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
      return { ...context.route, ...result };
    }
    return context.next();
  },
});
