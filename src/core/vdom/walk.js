import Element from '../../shared/Element';

export default function walkVDOM(lastT = [], nextT = [], fn, index = -1) {
    function hasChild(element) {
        return (Element.isInstance(element) && element.children.length > 0);
    }

    lastT.forEach((last, i) => {
        const next = nextT[i];
        fn(last, next, ++index);

        if (hasChild(last)) {
            const nextChildren = hasChild(next) ? next.children : [];
            index = walkVDOM(last.children, nextChildren, fn, index);
        }
    });

    if (nextT.length > lastT.length) {
        nextT.slice(lastT.length).forEach(
            (next) =>
                fn(void 0, next, index)
        );
    }

    return index;
}
