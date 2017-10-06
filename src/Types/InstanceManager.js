const ALL_INSTANCES = Symbol('allInstances');
// eslint-disable-next-line
export const getAllInstances = (Daisy) => Daisy[ALL_INSTANCES];

export const initInstances = (Daisy) => {
    Daisy[ALL_INSTANCES] = new Map();
};

export function setCache(context, cacheName) {
    if (!context[ALL_INSTANCES].get(context)) {
        context[ALL_INSTANCES].set(context, {});
    }
    const instantce = context[ALL_INSTANCES].get(context);
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