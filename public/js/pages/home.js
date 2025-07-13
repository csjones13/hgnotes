window.__CLASSES__.home =  class {
    constructor({element = '', settings = {}, data = '', url = ''} = {element: '', settings: {}, data: '', url: ''}) {
        this.name = 'home';
        this.element = element;
        this.settings = settings;
        this.data = data;
        this.url = url;
        this.id = makeid(); // Generate a unique ID for this component
        this.dependencies = []; // Array to hold dependencies for this component
        this.controller = new AbortController(); // Create a new AbortController for this component        
        window.__COMPONENTS__[this.id] = this; // Register this component in the global components object
    }
    
    set setData(val) {
        this.data = val;
    }

    getClassName() {
        return this.name;
    }
    
    get className() {
        return this.getClassName();
    }

    get destroy() {
        this.controller.abort();
        document.getElementById(this.id).remove();
        this.container = null;
        delete window.__COMPONENTS__[this.id];
    }

    get render() {
        let that = this;

        if(!that.dependencies || that.dependencies.length == 0) { that.dependencies = []; } 
        if(that.settings && that.settings.skipDependencies) { that.dependencies = []; }

        JSLoader('loadDependencies', { dependencies: that.dependencies } )
            .then(() =>  {
                CSSLoader(that.className)
                    .then(() => {
                        that.init(that);
                    });
            });
    }

    createHtml(that) {
        let html = '';

        html = ` <div id="${that.id}" class="home-page">
                <!-- Hero/Masthead Section -->
                <section class="hero-section position-relative overflow-hidden">
                    <div class="container py-5">
                        <div class="row justify-content-center text-center">
                            <div class="col-12">
                                <!-- Centered Hero Icon/Logo -->
                                <div class="hero-icon-container mb-4">
                                    <img src="/images/hg144.png" alt="Hippogriff" class="hero-icon rounded-3 shadow-lg">
                                </div>
                                
                                <!-- Hero Content -->
                                <div class="hero-content">
                                    <h1 class="display-2 fw-bold mb-4 text-shadow hero-title">
                                        <span class="text-accent">Hippogriff Notes</span>
                                    </h1>
                                    <p class="lead mb-4 fs-4 hero-subtitle">
                                        Experience the next generation of note-taking with our offline first platform independent app
                                    </p>
                                    <div class="hero-buttons d-flex flex-wrap gap-3 mb-4 justify-content-center">
                                        <button class="btn btn-primary btn-lg px-4 py-3 fw-semibold" data-tag="get-started">
                                            <i class="fas fa-rocket me-2"></i>Get Started
                                        </button>
                                        <button class="btn btn-outline-dark btn-lg px-4 py-3 fw-semibold" data-tag="learn-more">
                                            <i class="fas fa-play-circle me-2"></i>Learn More
                                        </button>
                                    </div>
                                    <div class="hero-features d-flex flex-wrap gap-4 justify-content-center">
                                        <div class="feature-item d-flex align-items-center">
                                            <i class="fas fa-check-circle text-success me-2"></i>
                                            <span>Fast & Reliable</span>
                                        </div>
                                        <div class="feature-item d-flex align-items-center">
                                            <i class="fas fa-check-circle text-success me-2"></i>
                                            <span>Secure by Design</span>
                                        </div>
                                        <div class="feature-item d-flex align-items-center">
                                            <i class="fas fa-check-circle text-success me-2"></i>
                                            <span>Easy to Use</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>`;

        return html;
    }

    init(that) {      
        // PROCESS MODAL/OVERLAY IF NEEDED HERE

        //PROCESS DATA IF NEEDED HERE

        let html = '';
        html = that.createHtml(that);
        // Render the component HTML
        that.element.innerHTML = html;

        // ADD SECRET BUTTONS HERE

        // Initiate Event Listeners tied to rendered HTML
        that.initiateFunctions(that);
    }

    initiateFunctions(that) {
        // one event listener for the entire component
        that.element.addEventListener('click', (e) => {
            // get the target element and its classes and data attributes
            let target = e.target;
            let classes = Array.from(target.classList)
            let dataset = Object.fromEntries(Object.entries(e.target.dataset));
            
            // Check if the target has a specific class and data attribute this is the specific functions to handle for actions
            if(classes.includes('btn') && dataset.tag) {
                switch(dataset.tag) {
                    case 'testbtn':
                        CPost('/api/test', {
                            body: JSON.stringify({ message: 'Button clicked!' }),
                        });
                    break;
                    case 'get-started':
                        // Add your get started logic here
                        console.log('Get Started clicked');
                        // You could navigate to a signup page or show a modal
                    break;
                    case 'learn-more':
                        // Add your learn more logic here
                        console.log('Learn More clicked');
                        // You could navigate to an about page or show more information
                    break;
                }
            }
        });
    }
}