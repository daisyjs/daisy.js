function Expression (source = '') {
    source = source
        .replace(/^{/g, '')
        .replace(/}$/g, '');

    return source;
}

exports.Expression = Expression;