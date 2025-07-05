window.__CLASSES__.home =  class home {
    constructor({element = '', settings = {}, data = '', url = ''} = {element: '', settings: {}, data: '', url: ''}) {
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

    get destroy() {
        this.controller.abort();
        this.element.remove();
        this.container = null;
        delete window.__COMPONENTS__[this.id];
    }

    get render() {
        let that = this;

        if(!that.dependencies || that.dependencies.length == 0) { that.dependencies = []; } 
        if(that.settings && that.settings.skipDependencies) { that.dependencies = []; }

        JSLoader('loadDependencies', { dependencies: that.dependencies } )
            .then(() =>  {
                that.init(that);
            });
    }

    init(that) {      
        // PROCESS MODAL/OVERLAY IF NEEDED HERE

        //PROCESS DATA IF NEEDED HERE

        // Render the component HTML
        that.element.innerHTML += `
            <div id="${that.id}" class="home-page">
                <!-- Hero/Masthead Section -->
                <section class="hero-section position-relative overflow-hidden">
                    <div class="container py-5">
                        <div class="row justify-content-center text-center">
                            <div class="col-12">
                                <!-- Centered Hero Icon/Logo -->
                                <div class="hero-icon-container mb-4">
                                    <img src="/images/hg144.jpg" alt="Hippogriff" class="hero-icon rounded-3 shadow-lg">
                                </div>
                                
                                <!-- Hero Content -->
                                <div class="hero-content">
                                    <h1 class="display-2 fw-bold mb-4 text-shadow hero-title">
                                        Welcome to <span class="text-accent">Hippogriff</span>
                                    </h1>
                                    <p class="lead mb-4 fs-4 hero-subtitle">
                                        Experience the power of modern web development with our cutting-edge platform. 
                                        Build faster, scale better, and deliver exceptional user experiences.
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
                    
                    <!-- Decorative Elements -->
                    <div class="hero-decoration position-absolute top-0 end-0 opacity-10">
                        <div class="decoration-circle"></div>
                    </div>
                    <div class="hero-decoration position-absolute bottom-0 start-0 opacity-10">
                        <div class="decoration-triangle"></div>
                    </div>
                </section>

                <!-- Quick Navigation Section -->
                <section class="quick-nav-section bg-light py-4">
                    <div class="container">
                        <div class="row justify-content-center">
                            <div class="col-auto">
                                <div class="nav-links d-flex flex-wrap justify-content-center gap-3">
                                    <a href="/about" class="btn btn-outline-secondary">
                                        <i class="fas fa-info-circle me-2"></i>About Us
                                    </a>
                                    <a href="/forms" class="btn btn-outline-secondary">
                                        <i class="fas fa-edit me-2"></i>Forms
                                    </a>
                                    <button class="btn btn-outline-primary" data-tag="testbtn">
                                        <i class="fas fa-flask me-2"></i>Test API
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>

            <style>
                .hero-section {
                    background: linear-gradient(135deg, var(--bs-light) 0%, var(--bs-success) 100%);
                    min-height: 100vh;
                    position: relative;
                    display: flex;
                    align-items: center;
                    color: var(--bs-dark);
                }

                .hero-icon-container {
                    animation: fadeInDown 1s ease-out;
                }

                .hero-icon {
                    width: 120px;
                    height: 120px;
                    object-fit: cover;
                    border: 4px solid var(--bs-primary);
                    transition: all 0.3s ease;
                    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
                }

                .hero-icon:hover {
                    transform: scale(1.1) rotate(5deg);
                    border-color: var(--bs-warning);
                    box-shadow: 0 12px 35px rgba(0, 0, 0, 0.25);
                }

                .hero-title {
                    color: var(--bs-dark);
                    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
                }

                .text-accent {
                    color: var(--bs-primary) !important;
                }

                .hero-subtitle {
                    color: var(--bs-gray-700);
                    max-width: 600px;
                    margin: 0 auto;
                }

                .hero-content {
                    animation: fadeInUp 1s ease-out 0.3s both;
                }

                .hero-buttons .btn {
                    transition: all 0.3s ease;
                    border-radius: 50px;
                    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
                    border-width: 2px;
                }

                .hero-buttons .btn:hover {
                    transform: translateY(-3px);
                    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
                }

                .btn-primary {
                    background-color: var(--bs-primary);
                    border-color: var(--bs-primary);
                    color: white;
                }

                .btn-primary:hover {
                    background-color: var(--bs-warning);
                    border-color: var(--bs-warning);
                    color: var(--bs-dark);
                }

                .btn-outline-dark {
                    color: var(--bs-dark);
                    border-color: var(--bs-dark);
                }

                .btn-outline-dark:hover {
                    background-color: var(--bs-dark);
                    border-color: var(--bs-dark);
                    color: white;
                }

                .feature-item {
                    animation: fadeIn 1s ease-out 0.8s both;
                    color: var(--bs-gray-700);
                    font-weight: 500;
                }

                .decoration-circle {
                    width: 300px;
                    height: 300px;
                    border-radius: 50%;
                    background: rgba(242, 140, 56, 0.1);
                    animation: float 6s ease-in-out infinite;
                }

                .decoration-triangle {
                    width: 0;
                    height: 0;
                    border-left: 150px solid transparent;
                    border-right: 150px solid transparent;
                    border-bottom: 200px solid rgba(139, 69, 19, 0.05);
                    animation: float 8s ease-in-out infinite reverse;
                }

                .quick-nav-section {
                    border-top: 3px solid var(--bs-primary);
                    background-color: white !important;
                }

                .nav-links .btn {
                    border-radius: 25px;
                    transition: all 0.3s ease;
                    border-width: 2px;
                }

                .nav-links .btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 6px 15px rgba(0, 0, 0, 0.15);
                }

                @keyframes fadeInDown {
                    from {
                        opacity: 0;
                        transform: translateY(-30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @keyframes fadeIn {
                    from {
                        opacity: 0;
                    }
                    to {
                        opacity: 1;
                    }
                }

                @keyframes float {
                    0%, 100% {
                        transform: translateY(0px);
                    }
                    50% {
                        transform: translateY(-20px);
                    }
                }

                @media (max-width: 768px) {
                    .hero-section {
                        min-height: 80vh;
                        padding: 1rem 0;
                    }
                    
                    .container {
                        padding-left: 1rem;
                        padding-right: 1rem;
                    }
                    
                    .hero-icon {
                        width: 100px;
                        height: 100px;
                        border-width: 3px;
                    }
                    
                    .display-2 {
                        font-size: 2.5rem;
                        line-height: 1.2;
                    }
                    
                    .hero-subtitle {
                        font-size: 1.1rem;
                        padding: 0 1rem;
                    }
                    
                    .hero-buttons {
                        flex-direction: column;
                        align-items: center;
                        gap: 1rem !important;
                    }
                    
                    .hero-buttons .btn {
                        width: 250px;
                        font-size: 1rem;
                    }
                    
                    .hero-features {
                        flex-direction: column;
                        align-items: center;
                        gap: 1rem !important;
                        margin-top: 2rem;
                    }
                    
                    .feature-item {
                        justify-content: center;
                        text-align: center;
                        width: 100%;
                        max-width: 200px;
                    }
                    
                    .nav-links {
                        flex-direction: column;
                        align-items: center;
                        gap: 1rem !important;
                    }
                    
                    .nav-links .btn {
                        width: 200px;
                        font-size: 0.9rem;
                    }
                    
                    .decoration-circle {
                        width: 200px;
                        height: 200px;
                    }
                    
                    .decoration-triangle {
                        border-left: 100px solid transparent;
                        border-right: 100px solid transparent;
                        border-bottom: 130px solid rgba(139, 69, 19, 0.05);
                    }
                }

                @media (max-width: 576px) {
                    .hero-section {
                        min-height: 70vh;
                        padding: 0.5rem 0;
                    }
                    
                    .container {
                        padding-left: 0.75rem;
                        padding-right: 0.75rem;
                    }
                    
                    .hero-icon {
                        width: 80px;
                        height: 80px;
                        border-width: 2px;
                    }
                    
                    .hero-icon-container {
                        margin-bottom: 1.5rem !important;
                    }
                    
                    .display-2 {
                        font-size: 2rem;
                        line-height: 1.1;
                        margin-bottom: 1rem !important;
                    }
                    
                    .hero-subtitle {
                        font-size: 1rem;
                        line-height: 1.4;
                        padding: 0 0.5rem;
                        margin-bottom: 1.5rem !important;
                    }
                    
                    .hero-buttons {
                        margin-bottom: 1.5rem !important;
                    }
                    
                    .hero-buttons .btn {
                        width: 220px;
                        font-size: 0.9rem;
                        padding: 0.75rem 1.5rem !important;
                    }
                    
                    .feature-item {
                        font-size: 0.9rem;
                        max-width: 180px;
                    }
                    
                    .feature-item i {
                        font-size: 1rem;
                    }
                    
                    .quick-nav-section {
                        padding: 1rem 0 !important;
                    }
                    
                    .nav-links .btn {
                        width: 180px;
                        font-size: 0.85rem;
                        padding: 0.5rem 1rem !important;
                    }
                    
                    .decoration-circle {
                        width: 150px;
                        height: 150px;
                    }
                    
                    .decoration-triangle {
                        border-left: 75px solid transparent;
                        border-right: 75px solid transparent;
                        border-bottom: 100px solid rgba(139, 69, 19, 0.05);
                    }
                }

                @media (max-width: 480px) {
                    .hero-section {
                        min-height: 65vh;
                    }
                    
                    .hero-icon {
                        width: 70px;
                        height: 70px;
                    }
                    
                    .display-2 {
                        font-size: 1.75rem;
                    }
                    
                    .hero-subtitle {
                        font-size: 0.95rem;
                    }
                    
                    .hero-buttons .btn {
                        width: 200px;
                        font-size: 0.85rem;
                    }
                    
                    .feature-item {
                        font-size: 0.85rem;
                        max-width: 160px;
                    }
                    
                    .nav-links .btn {
                        width: 160px;
                        font-size: 0.8rem;
                    }
                }

                @media (max-width: 360px) {
                    .hero-icon {
                        width: 60px;
                        height: 60px;
                    }
                    
                    .display-2 {
                        font-size: 1.5rem;
                    }
                    
                    .hero-subtitle {
                        font-size: 0.9rem;
                        line-height: 1.3;
                    }
                    
                    .hero-buttons .btn {
                        width: 180px;
                        font-size: 0.8rem;
                    }
                    
                    .feature-item {
                        font-size: 0.8rem;
                        max-width: 140px;
                    }
                    
                    .nav-links .btn {
                        width: 140px;
                        font-size: 0.75rem;
                    }
                }
            </style>
        `;

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