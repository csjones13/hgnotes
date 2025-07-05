window.__CLASSES__.CLASSNAME =  class CLASSNAME {
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
        that.element.innerHTML += `<div id="${that.id}" class="test">
                                                        <h1>Test Component</h1>
                                                        <button class="btn btn-primary" data-tag="testbtn">Click Me</button>
                                                        <p><a href="/about">Go to About</a></p>
                                                        <p><a href="/forms">Go to Forms</a></p>
                                                    </div>`;

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
            if(classes.includes('btn') && dataset.tag && dataset.tag === 'testbtn') {
                
            }
        });
    }
}