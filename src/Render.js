function createViewTree(nodes) {
    return document.createElement('div');
}

function diffVirtualDOM(prevVirtualDom, nextVirtualDom) {
    return []; // difference set
}

function patch(differenceSet) {
    // walk the difference set and update
}

function createVirtualDOM(abstractSyntaxNode, state) {
    // create virtual dom
    return {

    };
}

export {
    Render,
    createVirtualDOM,
    createViewTree,
    diffVirtualDOM,
    patch
};
