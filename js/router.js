(function () {
  const DEFAULT_ROUTE = 'home';
  const ROUTES = ['home', 'map', 'board', 'chat', 'mypage'];

  function normalizeRoute(hash) {
    const route = String(hash || '').replace(/^#/, '');
    return ROUTES.includes(route) ? route : DEFAULT_ROUTE;
  }

  function getCurrentRoute() {
    return normalizeRoute(window.location.hash);
  }

  function ensureRoute() {
    if (!window.location.hash || !ROUTES.includes(window.location.hash.slice(1))) {
      window.location.replace(`#${DEFAULT_ROUTE}`);
      return DEFAULT_ROUTE;
    }

    return getCurrentRoute();
  }

  window.BapFriendRouter = {
    DEFAULT_ROUTE,
    ROUTES,
    ensureRoute,
    getCurrentRoute,
  };
})();
