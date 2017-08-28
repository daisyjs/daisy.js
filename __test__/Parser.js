const {Parser} = require('../lib/Parser');
const jsonStringify = (str) => JSON.stringify(str, null, 2);
console.log(Parser('<div></div>'));

console.log(Parser('<img/>'));

console.log(Parser('<img>'));

console.log(jsonStringify(Parser('<div><img a=1>2</div>')));

console.log(jsonStringify(Parser('<div a=2></div>')));

console.log(jsonStringify(Parser('<div>1</div>')));

console.log(jsonStringify(Parser('<block d:if={a}>1</block>')));

console.log(jsonStringify(Parser('<div d:for={list} d:item="item" d:itemIndex="i"></div>')));

console.log(jsonStringify(Parser('<div d:for={list} d:for-item="item" d:for-index="i" class="a"></div>')));

console.log(jsonStringify(Parser(`
<div>
    <block d:if={a}>1</block>
    <block d:elif={a}>1</block>
    <block d:else></block>
</div>
`)));

console.log(jsonStringify(Parser(`
    <div>
        <block d:if={a}>
        1
        </block>
        <block d:elif={b}>
        1
        </block>
        <block d:elif={c}>
        1
        </block>
        <block d:else>
        </block>
    </div>
`)));

console.log(
    jsonStringify(
        Parser(`
            <div>
                <block d:for="{list}" d:for-item="item" d:for-index="index">
                    {item.type}
                </block>
            </div>
        `)
    )
);

console.log(
    jsonStringify(
        Parser(`
            <Test/>
        `)
    )
);

console.log(
    jsonStringify(
        Parser(`
            <!-- a

            aaa
        `)
    )
);

console.log(
    jsonStringify(
        Parser(`
            { a
        `)
    )
);

console.log(
    jsonStringify(
        Parser(`
            <a <!-- a -->></a>`)
    )
);

console.log(
    jsonStringify(
        Parser(`
            <a></a>
        `)
    )
);