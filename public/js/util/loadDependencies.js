window.__FUNCTIONS__.loadDependencies = (params = {}) => {
    let d = params.dependencies || [];
    
    let p = new Promise(function(resolve, reject) {
        let promises = [];
        for(let i = 0; i < d.length; i++) {
            promises.push(JSLoader(d[i]));
        }

        Promise.all(promises).then(function(values) {
            resolve(true);
        });
    });

    return p;
}