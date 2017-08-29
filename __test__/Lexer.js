const {
    Lexer
} = require('../lib/Lexer');
const JSONStringify = str => JSON.stringify(str);

const StringifyLexer = (str, isFormat = 0) => {
    const tokens = Lexer(str);
    return JSONStringify(tokens.map(({
        type,
        content,
        isSelfClose
    }) => ({
        type,
        content,
        isSelfClose
    })), null, isFormat ? 4 : null);
};
const {
    expect
} = require('chai');

// describe('Lexer', function () {
//     it('case - 0', function () {
//         expect(StringifyLexer('<div>')).to.be.equal(JSON.stringify([{
//             'type': 'TAGNAME',
//             'content': 'div'
//         }, {
//             'type': 'EOF'
//         }]));
//     });


//     it('case - 1', function () {
//         expect(StringifyLexer('<div >')).to.be.equal(JSONStringify([{
//             'type': 'TAGNAME',
//             'content': 'div'
//         }, {
//             'type': 'EOF'
//         }]));
//     });



//     it('case - 2', function () {
//         expect(StringifyLexer('<div id>')).to.be.equal(JSONStringify([{
//             'type': 'TAGNAME',
//             'content': 'div'
//         }, {
//             'type': 'ATTR',
//             'content': 'id'
//         }, {
//             'type': 'EOF'
//         }]));
//     });



//     it('case - 3', function () {
//         expect(StringifyLexer('<div id=>')).to.be.equal(JSONStringify([{
//             'type': 'TAGNAME',
//             'content': 'div'
//         }, {
//             'type': 'ATTR',
//             'content': 'id'
//         }, {
//             'type': 'EOF'
//         }]));
//     });



//     it('case - 4', function () {
//         expect(StringifyLexer('<div id=1>')).to.be.equal(JSONStringify([{
//             'type': 'TAGNAME',
//             'content': 'div'
//         }, {
//             'type': 'ATTR',
//             'content': 'id'
//         }, {
//             'type': 'VALUE',
//             'content': '1'
//         }, {
//             'type': 'EOF'
//         }]));
//     });



//     it('case - 5', function () {
//         expect(StringifyLexer('<div></div>')).to.be.equal(JSONStringify([{
//             'type': 'TAGNAME',
//             'content': 'div'
//         }, {
//             'type': 'END_TAG',
//             'content': 'div'
//         }, {
//             'type': 'EOF'
//         }]));
//     });



//     it('case - 6', function () {
//         expect(StringifyLexer('<div id></div>')).to.be.equal(JSONStringify([{
//             'type': 'TAGNAME',
//             'content': 'div'
//         }, {
//             'type': 'ATTR',
//             'content': 'id'
//         }, {
//             'type': 'END_TAG',
//             'content': 'div'
//         }, {
//             'type': 'EOF'
//         }]));
//     });



//     it('case - 7', function () {
//         expect(StringifyLexer('<div id=></div>')).to.be.equal(JSONStringify([{
//             'type': 'TAGNAME',
//             'content': 'div'
//         }, {
//             'type': 'ATTR',
//             'content': 'id'
//         }, {
//             'type': 'END_TAG',
//             'content': 'div'
//         }, {
//             'type': 'EOF'
//         }]));
//     });


//     it('case - 8', function () {
//         expect(StringifyLexer('<div id=1></div>')).to.be.equal(JSONStringify([{
//             'type': 'TAGNAME',
//             'content': 'div'
//         }, {
//             'type': 'ATTR',
//             'content': 'id'
//         }, {
//             'type': 'VALUE',
//             'content': '1'
//         }, {
//             'type': 'END_TAG',
//             'content': 'div'
//         }, {
//             'type': 'EOF'
//         }]));
//     });



//     it('case - 9', function () {
//         expect(StringifyLexer('<div id="xxxx"></div>')).to.be.equal(JSONStringify([{
//             'type': 'TAGNAME',
//             'content': 'div'
//         }, {
//             'type': 'ATTR',
//             'content': 'id'
//         }, {
//             'type': 'VALUE',
//             'content': '"xxxx"'
//         }, {
//             'type': 'END_TAG',
//             'content': 'div'
//         }, {
//             'type': 'EOF'
//         }]));
//     });



//     it('case - 10', function () {
//         expect(StringifyLexer('<div id=xxxx></div>')).to.be.equal(JSONStringify([{
//             'type': 'TAGNAME',
//             'content': 'div'
//         }, {
//             'type': 'ATTR',
//             'content': 'id'
//         }, {
//             'type': 'VALUE',
//             'content': 'xxxx'
//         }, {
//             'type': 'END_TAG',
//             'content': 'div'
//         }, {
//             'type': 'EOF'
//         }]));
//     });



//     it('case - 11', function () {
//         expect(StringifyLexer('<div id=1 class=2></div>')).to.be.equal(JSONStringify([{
//             'type': 'TAGNAME',
//             'content': 'div'
//         }, {
//             'type': 'ATTR',
//             'content': 'id'
//         }, {
//             'type': 'VALUE',
//             'content': '1'
//         }, {
//             'type': 'ATTR',
//             'content': 'class'
//         }, {
//             'type': 'VALUE',
//             'content': '2'
//         }, {
//             'type': 'END_TAG',
//             'content': 'div'
//         }, {
//             'type': 'EOF'
//         }]));
//     });



//     it('case - 12', function () {
//         expect(StringifyLexer('<div id= 1 class= 2></div>')).to.be.equal(JSONStringify([{
//             'type': 'TAGNAME',
//             'content': 'div'
//         }, {
//             'type': 'ATTR',
//             'content': 'id'
//         }, {
//             'type': 'VALUE',
//             'content': '1'
//         }, {
//             'type': 'ATTR',
//             'content': 'class'
//         }, {
//             'type': 'VALUE',
//             'content': '2'
//         }, {
//             'type': 'END_TAG',
//             'content': 'div'
//         }, {
//             'type': 'EOF'
//         }]));
//     });



//     it('case - 13', function () {
//         expect(StringifyLexer('<div id="a 1" class= 2></div>')).to.be.equal(JSONStringify([{
//             'type': 'TAGNAME',
//             'content': 'div'
//         }, {
//             'type': 'ATTR',
//             'content': 'id'
//         }, {
//             'type': 'VALUE',
//             'content': '"a 1"'
//         }, {
//             'type': 'ATTR',
//             'content': 'class'
//         }, {
//             'type': 'VALUE',
//             'content': '2'
//         }, {
//             'type': 'END_TAG',
//             'content': 'div'
//         }, {
//             'type': 'EOF'
//         }]));
//     });



//     it('case - 14', function () {
//         expect(StringifyLexer('{{aaa}}')).to.be.equal(JSONStringify([{
//             'type': 'EXPR',
//             'content': 'aaa'
//         }, {
//             'type': 'EOF'
//         }]));
//     });



//     it('case - 15', function () {
//         expect(StringifyLexer('<div>a{{aaa}}</div>')).to.be.equal(JSONStringify([{
//             'type': 'TAGNAME',
//             'content': 'div'
//         }, {
//             'type': 'TEXT',
//             'content': 'a'
//         }, {
//             'type': 'EXPR',
//             'content': 'aaa'
//         }, {
//             'type': 'END_TAG',
//             'content': 'div'
//         }, {
//             'type': 'EOF'
//         }]));
//     });



//     it('case - 16', function () {
//         expect(StringifyLexer('<<div>a{{aaa}}</div>')).to.be.equal(JSONStringify([{
//             'type': 'TAGNAME',
//             'content': '<div'
//         }, {
//             'type': 'TEXT',
//             'content': 'a'
//         }, {
//             'type': 'EXPR',
//             'content': 'aaa'
//         }, {
//             'type': 'END_TAG',
//             'content': 'div'
//         }, {
//             'type': 'EOF'
//         }]));
//     });



//     it('case - 17', function () {
//         expect(StringifyLexer('<<div>>{{{aaa}</div>')).to.be.equal(JSONStringify([{
//             'type': 'TAGNAME',
//             'content': '<div'
//         }, {
//             'type': 'TEXT',
//             'content': '>{{{aaa}</div>'
//         }, {
//             'type': 'EOF'
//         }]));
//     });



//     it('case - 18', function () {
//         expect(StringifyLexer('<d<iv>{{aaa}}</div>')).to.be.equal(JSONStringify([{
//             'type': 'TAGNAME',
//             'content': 'd<iv'
//         }, {
//             'type': 'EXPR',
//             'content': 'aaa'
//         }, {
//             'type': 'END_TAG',
//             'content': 'div'
//         }, {
//             'type': 'EOF'
//         }]));
//     });



//     it('case - 19', function () {
//         expect(StringifyLexer(`< d

// <iv>{{aaa}}</div>`)).to.be.equal(JSONStringify([{
//             'type': 'TEXT',
//             'content': '< d\n\n'
//         }, {
//             'type': 'TAGNAME',
//             'content': 'iv'
//         }, {
//             'type': 'EXPR',
//             'content': 'aaa'
//         }, {
//             'type': 'END_TAG',
//             'content': 'div'
//         }, {
//             'type': 'EOF'
//         }]));
//     });

//     it('case - 20', function () {
//         expect(StringifyLexer('<block $if={a=1}></block>')).to.be.equal(JSONStringify([{
//             'type': 'TAGNAME',
//             'content': 'block'
//         }, {
//             'type': 'ATTR',
//             'content': '$if'
//         }, {
//             'type': 'VALUE',
//             'content': '{a=1}'
//         }, {
//             'type': 'END_TAG',
//             'content': 'block'
//         }, {
//             'type': 'EOF'
//         }]));
//     });


//     it('case - 21', function () {
//         expect(StringifyLexer('<div>{{{aaa}}</div>')).to.be.equal(JSONStringify([{
//             'type': 'TAGNAME',
//             'content': 'div'
//         }, {
//             'type': 'EXPR',
//             'content': '{aaa'
//         }, {
//             'type': 'END_TAG',
//             'content': 'div'
//         }, {
//             'type': 'EOF'
//         }]));
//     });

//     it('case - 22', function () {
//         expect(StringifyLexer('<div class="{ a: 1, b: []""></div>')).to.be.equal(JSONStringify([{
//             'type': 'TAGNAME',
//             'content': 'div'
//         }, {
//             'type': 'ATTR',
//             'content': 'class'
//         }, {
//             'type': 'VALUE',
//             'content': '"{ a: 1, b: []"'
//         }, {
//             'type': 'ATTR',
//             'content': '"'
//         }, {
//             'type': 'END_TAG',
//             'content': 'div'
//         }, {
//             'type': 'EOF'
//         }]));
//     });

//     it('case - 23', function () {
//         expect(StringifyLexer('<div class="{{{\'a\' : 1}}"></</div>')).to.be.equal(JSONStringify([{
//             'type': 'TAGNAME',
//             'content': 'div'
//         }, {
//             'type': 'ATTR',
//             'content': 'class'
//         }, {
//             'type': 'VALUE',
//             'content': '"{{{\'a\' : 1}}"'
//         }, {
//             'type': 'TEXT',
//             'content': '</'
//         }, {
//             'type': 'END_TAG',
//             'content': 'div'
//         }, {
//             'type': 'EOF'
//         }]));
//     });

//     it('case - 24', function () {
//         expect(StringifyLexer('<div class="{{{\'a\' : 1}}"> {{dsa> 1}}<a /> </div>')).to.be.equal(JSONStringify([{
//             'type': 'TAGNAME',
//             'content': 'div'
//         }, {
//             'type': 'ATTR',
//             'content': 'class'
//         }, {
//             'type': 'VALUE',
//             'content': '"{{{\'a\' : 1}}"'
//         }, {
//             'type': 'TEXT',
//             'content': ' '
//         }, {
//             'type': 'EXPR',
//             'content': 'dsa> 1'
//         }, {
//             'type': 'TAGNAME',
//             'content': 'a',
//             'isSelfClose': true
//         }, {
//             'type': 'TEXT',
//             'content': ' '
//         }, {
//             'type': 'END_TAG',
//             'content': 'div'
//         }, {
//             'type': 'EOF'
//         }]));
//     });

//     it('case - 25', function () {
//         expect(StringifyLexer('<div class="{{{\'a\' : 1}}"> {{dsa> 1}}< a /> </div>')).to.be.equal(JSONStringify([{
//             'type': 'TAGNAME',
//             'content': 'div'
//         }, {
//             'type': 'ATTR',
//             'content': 'class'
//         }, {
//             'type': 'VALUE',
//             'content': '"{{{\'a\' : 1}}"'
//         }, {
//             'type': 'TEXT',
//             'content': ' '
//         }, {
//             'type': 'EXPR',
//             'content': 'dsa> 1'
//         }, {
//             'type': 'TEXT',
//             'content': '< a /> '
//         }, {
//             'type': 'END_TAG',
//             'content': 'div'
//         }, {
//             'type': 'EOF'
//         }]));
//     });

//     it('case - 26', function () {
//         expect(StringifyLexer('<div class="\\d"> {{dsa> 1}}<br> </div>')).to.be.equal(JSONStringify(
//             [{
//                 'type': 'TAGNAME',
//                 'content': 'div'
//             }, {
//                 'type': 'ATTR',
//                 'content': 'class'
//             }, {
//                 'type': 'VALUE',
//                 'content': '"\\d"'
//             }, {
//                 'type': 'TEXT',
//                 'content': ' '
//             }, {
//                 'type': 'EXPR',
//                 'content': 'dsa> 1'
//             }, {
//                 'type': 'TAGNAME',
//                 'content': 'br'
//             }, {
//                 'type': 'TEXT',
//                 'content': ' '
//             }, {
//                 'type': 'END_TAG',
//                 'content': 'div'
//             }, {
//                 'type': 'EOF'
//             }]
//         ));
//     });
// });


console.log(Lexer('<!-- a'));

console.log(Lexer('{ a'));

console.log(Lexer('<!-- a { a <a'));

console.log(Lexer('{{ aaa'));

console.log(Lexer('<!-- a'));

console.log(Lexer('aaa'));

console.log(Lexer('<aaa <!-- a '));

console.log(Lexer('</ a'));


console.log(Lexer('<a'));
