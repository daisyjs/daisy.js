const inherit = Symbol('inherit');
// eslint-disable-next-line
export const allInherits = (Daisy) => Daisy[inherit];

export const inheritable = (Daisy) => {
    Daisy[inherit] = new Map();
};

export function setInheritCache(context, cacheName) {
    if (!context[inherit].get(context)) {
        context[inherit].set(context, {});
    }
    const instantce = context[inherit].get(context);
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