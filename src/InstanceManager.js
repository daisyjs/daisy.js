const ALL_INSTANCES = Symbol('allInstances');
// eslint-disable-next-line
export const getAllInstances = (Daisy) => Daisy[ALL_INSTANCES];

export const initInstances = (Daisy) => {
    Daisy[ALL_INSTANCES] = new Map();
};

export function extendsInstanceInheritCache(context, cacheName) {
    if (!context[ALL_INSTANCES].get(context)) {
        context[ALL_INSTANCES].set(context, {});
    }
    const instantce = context[ALL_INSTANCES].get(context);
    if (!instantce[cacheName]) {
        instantce[cacheName] = [];
    }
    const cache = instantce[cacheName];

    return (property, value) => {
        if (!value) {
            Object.keys(property).forEach((item) => {
                cache.push({
                    property: item,
                    value: property[item] 
                });
            });
            return;
        }

        cache.push({
            property, value
        });
    };
}