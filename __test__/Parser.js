const {Parser} = require('../lib/Parser');
const FormatJSON = (str) => JSON.stringify(str, null, 2);

// console.log(
//     FormatJSON(
//         Parser('<div></div>')
//     )
// );

// console.log(
//     FormatJSON(
//         Parser('<img/>')
//     )
// );

// console.log(
//     FormatJSON(
//         Parser('<img>')
//     )
// );

// console.log(
//     FormatJSON(
//         Parser('<img></img>')
//     )
// );

// console.log(
//     FormatJSON(
//         Parser('<div><img a=1>2</div>')
//     )
// );

// console.log(
//     FormatJSON(
//         Parser('<div a=2></div>')
//     )
// );

// console.log(
//     FormatJSON(
//         Parser('<div>1</div>')
//     )
// );

// console.log(
//     FormatJSON(
//         Parser('<block d:if={a}>1</block>')
//     )
// );

// console.log(
//     FormatJSON(
//         Parser('<div d:for={list} d:item="item" d:itemIndex="i"></div>')
//     )
// );

// console.log(
//     FormatJSON(
//         Parser('<div d:for={list} d:for-item="item" d:for-index="i" class="a"></div>')
//     )
// );

console.log(
    FormatJSON(
        Parser(`
<div>
    <block d:if={a}>1</block>
    <block d:elif={b}>
        <block d:if={c}>1</block>
        <block d:elif={d}>1</block>
    </block>
    <block d:else></block>
</div>
`)));

// console.log(FormatJSON(Parser(`
//     <div>
//         <block d:if={a}>
//         1
//         </block>
//         <block d:elif={b}>
//         1
//         </block>
//         <block d:elif={c}>
//         1
//         </block>
//         <block d:else>
//         </block>
//     </div>
// `)));

// console.log(
//     FormatJSON(
//         Parser(`
//             <div>
//                 <block d:for="{list}" d:for-item="item" d:for-index="index">
//                     {item.type}
//                 </block>
//             </div>
//         `)
//     )
// );

// console.log(
//     FormatJSON(
//         Parser(`
//             <Test/>122121
//         `)
//     )
// );

// console.log(
//     FormatJSON(
//         Parser(`
//             <!-- a

//             aaa
//         `)
//     )
// );

// console.log(
//     FormatJSON(
//         Parser(`{ a`)
//     )
// );

// console.log(
//     FormatJSON(
//         Parser(`<a <!-- a -->></a>`)
//     )
// );

// console.log(
//     FormatJSON(
//         Parser(`<a></a>`)
//     )
// );

// console.log(
//     FormatJSON(
//         Parser('<div class=1// />')
//     )
// );