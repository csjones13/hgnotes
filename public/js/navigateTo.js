window.__FUNCTIONS__.navigateTo = (params = {}) => {
    !params.url && params.link ? params.url = params.link : window.location.pathname;
    history.pushState(null, null, params.url);
    JSLoader('router');
}
