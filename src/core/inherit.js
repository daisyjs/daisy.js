const inherit = Symbol('inherit');
export const allInherits = (Component) => Component[inherit];

export function setInheritCache(cacheName) {
    return (Component) => {
        if (!Component[inherit]) {
            Component[inherit] = new Map();
        }
        if (!Component[inherit].get(Component)) {
            Component[inherit].set(Component, {});
        }
        const instantce = Component[inherit].get(Component);
        if (!instantce[cacheName]) {
            instantce[cacheName] = [];
        }
        const cache = instantce[cacheName];
    
        return (name, value) => {
            if (!value) {
                Object.keys(name).forEach((item) => {
                    cache.push({
                        name: item,
                        value: name[item] 
                    });
                });
                return;
            }
    
            cache.push({
                name, value
            });
        };
    }
}