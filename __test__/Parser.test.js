const {Parser, Lexer} = require('../dist/daisy');

const FormatJSON = (str) => JSON.stringify(str, null, 2);

console.log(
    FormatJSON(
        Parser('<div></div>')
    )
);

console.log(
    FormatJSON(
        Parser('<img/>')
    )
);

console.log(
    FormatJSON(
        Parser('<img>')
    )
);

console.log(
    FormatJSON(
        Parser('<img></img>')
    )
);

console.log(
    FormatJSON(
        Parser('<div><img a=1>2</div>')
    )
);

console.log(
    FormatJSON(
        Parser('<div a=2></div>')
    )
);

console.log(
    FormatJSON(
        Parser('<div>1</div>')
    )
);

console.log(
    FormatJSON(
        Parser('<block :if={a}>1</block>')
    )
);

console.log(
    FormatJSON(
        Parser('<div :for={list} :item="item" :itemIndex="i"></div>')
    )
);

console.log(
    FormatJSON(
        Parser('<div :for={list} :for-item="item" :for-index="i" class="a"></div>')
    )
);

console.log(
    FormatJSON(
        Parser(`
<div>
    <block :if={a}>1</block>
    <block :elif={b}>
        <block :if={c}>1</block>
        <block :elif={d}>1</block>
    </block>
    <block :else></block>
</div>
`)));

console.log(FormatJSON(Parser(`<div>
    <block :if={{a}>1</block>
    <block :elif={{b}}>1</block>
    <block :elif={{c}}>1</block>
    <block :else></block>
</div>`)));


console.log(
    FormatJSON(
        Parser(`
            <div>
                <block :for="{{list}}" :for-item="item" :for-index="index">
                    <div @onClick={{this.onClick()}}>
                        {{item.name}}
                    </div>·
                </block>
            </div>
        `)
    )
);

console.log(
    FormatJSON(
        Parser(`
            <Test/>122121
        `)
    )
);

console.log(
    FormatJSON(
        Parser(`
            <!-- a

            aaa
        `)
    )
);

console.log(
    FormatJSON(
        Parser('{ a')
    )
);

console.log(
    FormatJSON(
        Parser('<a <!-- a -->></a>')
    )
);

console.log(
    FormatJSON(
        Parser('<a></a>')
    )
);

console.log(
    FormatJSON(
        Parser('<div class=1// />')
    )
);

console.log(
    FormatJSON(
        Parser('<div @onClick={{this.onClick()}} />')
    )
);

console.log(
    FormatJSON(
        Parser('{ {div')
    )
);

try {
    FormatJSON(
        Parser('<div a=')
    );
} catch(e) {
    console.log(e);
}

console.log(FormatJSON(
    Parser(`
        <div @onClick={{fn(1, 2, 3)}}></div>
    `)
));
