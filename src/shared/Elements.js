import Element from './Element';


function append(elements, element) {
    if (
        element instanceof Element || typeof element === 'string'
    ) {
        elements.push(element);
    } else if (element instanceof Array) {
        element.forEach(
            item => elements.push(item)
        );
    }
    return this;
}

function create() {
    const elements = new Array();

    elements.isElements = true;
    elements.append = (element) => append(elements, element);
    
    return elements;
}
function isInstance(elements) {
    return elements && elements.isElements;
}

export default {
    create, isInstance
};