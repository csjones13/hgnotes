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

    let page = {}, nav = true, footer = true;
    switch(sComponent) {
        default:
            page.key = 'home';
            page.name = 'Home';
            page.component = 'home';
            nav = false, footer = false; // No navbar or footer on home page
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

    if(nav) {
        JSLoader('navbar', { element: document.getElementById('nav')}).then((c) => {
            if(c && typeof c === 'object') {
                console.log(`Rendering navbar component`);
                c.render;
            } else {
                console.error(`Navbar component not found or does not have a render method.`);
            }
        });     
    }

    if(footer) {
        JSLoader('footer', { element: document.getElementById('footer')}).then((c) => {
            if(c && typeof c === 'object') {
                console.log(`Rendering footer component`);
                c.render;
            } else {
                console.error(`Footer component not found or does not have a render method.`);
            }
        });     
    }

    JSLoader(page.component, { element: d, }).then((c) => {
        if(c && typeof c === 'object') {
            console.log(`Rendering component: ${page.name}`);
            c.render;
        } else {
            console.error(`Component ${page.component} not found or does not have a render method.`);
        }   
    });
}