window.__FUNCTIONS__.router = (params = {}) => {
    console.log('Router function called with params:', params);
    let d = document.getElementById('root');
    if (!d) {
        console.error('Root element not found');
        return '';
    }

    // Clear all components from the page
    let c = Object.keys(window.__COMPONENTS__);
    for(let i = 0; i < c.length; i++) {
        if(window.__COMPONENTS__[c[i]]) {
            window.__COMPONENTS__[c[i]].destroy;
        }
    }

    // get the current path normalized to lowercase
    let path = window.location.pathname.toLowerCase();

    // Parse the path to determine the component to load
    let componentName = path.split('/').pop() || 'home'; // Default to '
    let componentArray = path.split('/');

    console.log('Current path:', path, 'Component to load:', componentName, 'Component Array:', componentArray);

    let sComponent = componentArray[1] || 'home'; // Default to 'home' if no component is specified

    let page = {};
    switch(sComponent) {
        default:
            page.key = 'home';
            page.name = 'Home';
            page.component = 'home';
        break;
        case 'about':
            page.key = 'about';
            page.name = 'About';
            page.component = 'about';
        break;
        case 'forms':
            page.key = 'forms';
            page.name = 'Forms';
            page.component = 'forms';
        break;
    }

    document.title = `${window.__APP_TITLE__} | ${page.name}`;
    JSLoader(page.component, { element: d, }).then((c) => {
        if(c && typeof c === 'object') {
            console.log(`Rendering component: ${page.name}`);
            c.render;
        } else {
            console.error(`Component ${page.component} not found or does not have a render method.`);
        }   
    });
}