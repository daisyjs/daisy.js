import lexer from '../src/core/parser/lexer';
const JSONStringify = str => JSON.stringify(str);

const StringifyLexer = (str, isFormat = 0) => {
    const tokens = lexer(str);
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


test('#tag - unend - 0', () => {
    expect(() => StringifyLexer('<div>')).toThrowError(/TAG/);
});

test('#tag - unend - 1', () => {
    expect(() => StringifyLexer('<div >')).toThrowError(/TAG/);
});

test('#tag - unend - 2', () => {
    expect(() => StringifyLexer('<div id>')).toThrowError(/TAG/);
});


test('#tag - unend - 3', () => {
    expect(() => StringifyLexer('<div id=>')).toThrowError(/TAG/);
});

test('#tag - unend - 4', () => {
    expect(() => StringifyLexer('<div id=1>')).toThrowError(/TAG/);
});

test('#tag - normal', () => {
    expect(StringifyLexer('<div></div>')).toBe(JSONStringify([{
        'type': 'TAGNAME',
        'content': 'div'
    }, {
        'type': 'CLOSE_TAG',
        'content': ''
    }, {
        'type': 'END_TAG',
        'content': 'div'
    }, {
        'type': 'EOF'
    }]));
});

test('#tag - attr', () => {
    expect(StringifyLexer('<div id></div>')).toBe(JSONStringify([{
        'type': 'TAGNAME',
        'content': 'div'
    }, {
        'type': 'ATTR',
        'content': 'id'
    }, {
        'type': 'CLOSE_TAG',
        'content': ''
    }, {
        'type': 'END_TAG',
        'content': 'div'
    }, {
        'type': 'EOF'
    }]));
});

test('#tag - attr - 1', () => {
    expect(StringifyLexer('<div id=></div>')).toBe(JSONStringify([{
        'type': 'TAGNAME',
        'content': 'div'
    }, {
        'type': 'ATTR',
        'content': 'id'
    },  {
        'type': 'CLOSE_TAG',
        'content': ''
    }, {
        'type': 'END_TAG',
        'content': 'div'
    }, {
        'type': 'EOF'
    }]));
});

test('#tag - attr - value', () => {
    expect(StringifyLexer('<div id=1></div>')).toBe(JSONStringify([{
        'type': 'TAGNAME',
        'content': 'div'
    }, {
        'type': 'ATTR',
        'content': 'id'
    }, {
        'type': 'VALUE',
        'content': '1'
    }, {
        'type': 'CLOSE_TAG',
        'content': ''
    }, {
        'type': 'END_TAG',
        'content': 'div'
    }, {
        'type': 'EOF'
    }]));
});

test('#tag - attr - value - quote', () => {
    expect(StringifyLexer('<div id="xxxx"></div>')).toBe(JSONStringify([{
        'type': 'TAGNAME',
        'content': 'div'
    }, {
        'type': 'ATTR',
        'content': 'id'
    }, {
        'type': 'VALUE',
        'content': 'xxxx'
    }, {
        'type': 'CLOSE_TAG',
        'content': ''
    }, {
        'type': 'END_TAG',
        'content': 'div'
    }, {
        'type': 'EOF'
    }]));
});

test('#tag - attr - value - multi', () => {
    const result = JSONStringify([{
        'type': 'TAGNAME',
        'content': 'div'
    }, {
        'type': 'ATTR',
        'content': 'id'
    }, {
        'type': 'VALUE',
        'content': '1'
    }, {
        'type': 'ATTR',
        'content': 'class'
    }, {
        'type': 'VALUE',
        'content': '2'
    }, {
        'type': 'CLOSE_TAG',
        'content': ''
    }, {
        'type': 'END_TAG',
        'content': 'div'
    }, {
        'type': 'EOF'
    }])
    expect(StringifyLexer('<div id=1 class=2></div>')).toBe(result);
    expect(StringifyLexer('<div id= 1 class= 2></div>')).toBe(result);
});
test('#tag - attr - value - multi', () => {
    const result = JSONStringify([{
        'type': 'TAGNAME',
        'content': 'div'
    }, {
        'type': 'ATTR',
        'content': 'id'
    }, {
        'type': 'VALUE',
        'content': 'a 1'
    }, {
        'type': 'ATTR',
        'content': 'class'
    }, {
        'type': 'VALUE',
        'content': '2'
    }, {
        'type': 'CLOSE_TAG',
        'content': ''
    }, {
        'type': 'END_TAG',
        'content': 'div'
    }, {
        'type': 'EOF'
    }])
    expect(StringifyLexer('<div id="a 1" class= 2></div>')).toBe(result);
});



test('#expr - 0', () => {
    const result = JSONStringify([{
        'type': 'EXPR',
        'content': 'aaa'
    }, {
        'type': 'EOF'
    }])
    expect(StringifyLexer('{{aaa}}')).toBe(result);
});

test('#tag - text - expr - 0', () => {
    const result = JSONStringify([{
        'type': 'TAGNAME',
        'content': 'div'
    },{
        'type': 'CLOSE_TAG',
        'content': ''
    }, {
        'type': 'TEXT',
        'content': 'a'
    }, {
        'type': 'EXPR',
        'content': 'aaa'
    },  {
        'type': 'END_TAG',
        'content': 'div'
    }, {
        'type': 'EOF'
    }])
    expect(StringifyLexer('<div>a{{aaa}}</div>')).toBe(result);
});

test('#text - tag - expr - 0', () => {
    const result = [{"type":"TEXT","content":"<"},{"type":"TAGNAME","content":"div"},{"type":"CLOSE_TAG","content":""},{"type":"TEXT","content":"a"},{"type":"EXPR","content":"aaa"},{"type":"END_TAG","content":"div"},{"type":"EOF"}];
    expect(StringifyLexer('<<div>a{{aaa}}</div>')).toBe(JSONStringify(result));
});

test('#tag - unmatched', () => {
    expect(() => StringifyLexer('<d<iv>{{aaa}}</div>')).toThrowError(/TAG/);
});

test('#tag - unmatched - 1', () => {
    expect(() => StringifyLexer(`< d
    
                <iv>{{aaa}}</div>`)).toThrowError(/TAG/);
});

test('#$if', () => {
    expect(StringifyLexer('<block $if={a=1}></block>')).toBe(JSONStringify([{
        'type': 'TAGNAME',
        'content': 'block'
    }, {
        'type': 'ATTR',
        'content': '$if'
    }, {
        'type': 'VALUE',
        'content': '{a=1}'
    }, {
        'type': 'CLOSE_TAG',
        'content': ''
    }, {
        'type': 'END_TAG',
        'content': 'block'
    }, {
        'type': 'EOF'
    }]));
});

test('#expr - 1', () => {
    expect(StringifyLexer('<div>{{{aaa}}</div>')).toBe(JSONStringify(
    [{
        'type': 'TAGNAME',
        'content': 'div'
    }, {
        'type': 'CLOSE_TAG',
        'content': ''
    }, {
        'type': 'EXPR',
        'content': '{aaa'
    }, {
        'type': 'END_TAG',
        'content': 'div'
    }, {
        'type': 'EOF'
    }]));
});



test('case - 22', function() {
    expect(StringifyLexer('<div class="{ a: 1, b: []""></div>')).toBe(JSONStringify([{
        'type': 'TAGNAME',
        'content': 'div'
    }, {
        'type': 'ATTR',
        'content': 'class'
    }, {
        'type': 'VALUE',
        'content': '{ a: 1, b: []'
    }, {
        'type': 'ATTR',
        'content': '"'
    }, {
        'type': 'CLOSE_TAG',
        'content': ''
    }, {
        'type': 'END_TAG',
        'content': 'div'
    }, {
        'type': 'EOF'
    }]));
});

test('case - 23', function() {
    expect(StringifyLexer('<div class="{{{\'a\' : 1}}"></</div>')).toBe(JSONStringify([{
        'type': 'TAGNAME',
        'content': 'div'
    }, {
        'type': 'ATTR',
        'content': 'class'
    }, {
        'type': 'VALUE',
        'content': '{{{\'a\' : 1}}'
    }, {
        'type': 'CLOSE_TAG',
        'content': ''
    }, {
        'type': 'TEXT',
        'content': '</'
    },  {
        'type': 'END_TAG',
        'content': 'div'
    }, {
        'type': 'EOF'
    }]));
});

test('case - 24', function() {
    expect(StringifyLexer('<div class="{{{\'a\' : 1}}"> {{dsa> 1}}<a /> </div>')).toBe(JSONStringify([{
        'type': 'TAGNAME',
        'content': 'div'
    }, {
        'type': 'ATTR',
        'content': 'class'
    }, {
        'type': 'VALUE',
        'content': '{{{\'a\' : 1}}'
    }, {
        'type': 'CLOSE_TAG',
        'content': ''
    }, {
        'type': 'TEXT',
        'content': ' '
    },  {
        'type': 'EXPR',
        'content': 'dsa> 1'
    }, {
        'type': 'TAGNAME',
        'content': 'a',
        'isSelfClose': true
    }, {
        'type': 'CLOSE_TAG',
        'content': ''
    },{
        'type': 'TEXT',
        'content': ' '
    },   {
        'type': 'END_TAG',
        'content': 'div'
    }, {
        'type': 'EOF'
    }]));
});

test('case - 25', function() {
    expect(StringifyLexer('<div class="{{{\'a\' : 1}}"> {{dsa> 1}}< a /> </div>')).toBe(JSONStringify([{
        'type': 'TAGNAME',
        'content': 'div'
    }, {
        'type': 'ATTR',
        'content': 'class'
    }, {
        'type': 'VALUE',
        'content': '{{{\'a\' : 1}}'
    }, {
        'type': 'CLOSE_TAG',
        'content': ''
    }, {
        'type': 'TEXT',
        'content': ' '
    }, {
        'type': 'EXPR',
        'content': 'dsa> 1'
    }, {
        'type': 'TEXT',
        'content': '< a /> '
    },  {
        'type': 'END_TAG',
        'content': 'div'
    }, {
        'type': 'EOF'
    }]));
});

test('case - 26', function() {
    expect(StringifyLexer('<div class="\\d"> {{dsa> 1}}<br> </div>')).toBe(JSONStringify(
        [{
            'type': 'TAGNAME',
            'content': 'div'
        }, {
            'type': 'ATTR',
            'content': 'class'
        }, {
            'type': 'VALUE',
            'content': '\\d'
        }, {
            'type': 'CLOSE_TAG',
            'content': ''
        }, {
            'type': 'TEXT',
            'content': ' '
        }, {
            'type': 'EXPR',
            'content': 'dsa> 1'
        }, {
            'type': 'TAGNAME',
            'content': 'br'
        }, {
            'type': 'CLOSE_TAG',
            'content': ''
        }, {
            'type': 'TEXT',
            'content': ' '
        },  {
            'type': 'END_TAG',
            'content': 'div'
        }, {
            'type': 'EOF'
        }]
    ));
});

test('case - 27', function() {
    expect(StringifyLexer('<!-- a')).toBe(JSONStringify([{
        type: 'COMMENT',
        content: ' a'
    }, {
        type: 'EOF'
    }]));
});


test('case - 28', function() {
    expect(StringifyLexer('{ a')).toBe(JSONStringify([{
        type: 'TEXT',
        content: '{ a',
    }, {
        type: 'EOF'
    }]));
});

test('case - 29', function() {
    expect(StringifyLexer('<!-- a { a <a')).toBe(JSONStringify([{
        type: 'COMMENT',
        content: ' a { a <a'
    }, {
        type: 'EOF'
    }]));
});

test('case - 30', function() {
    try {
        StringifyLexer('{{ aaa');
    } catch (e) {
        expect(e.toString().includes('expression')).toBe(true);
    }

});

test('case - 31', function() {
    expect(StringifyLexer('<!-- <!-- a')).toBe(JSONStringify([{
        'type': 'COMMENT',
        'content': ' <!-- a'
    }, {
        'type': 'EOF'
    }]));
});

test('case - 32', function() {
    expect(StringifyLexer('aaa')).toBe(JSONStringify([{
        'type': 'TEXT',
        'content': 'aaa'
    }, {
        'type': 'EOF'
    }]));
});

test('case - 33', function() {
    try {
        StringifyLexer('<aaa <!-- a ');
    } catch (e) {
        expect(e.toString().includes('ATTR')).toBe(true);
    }

});

test('case - 34', function() {
    expect(StringifyLexer('</ a')).toBe(JSONStringify([{
        'type': 'TEXT',
        'content': '</ a'
    }, {
        'type': 'EOF'
    }]));
});


test('case - 35', function() {
    expect(StringifyLexer('1 < a >')).toBe(JSONStringify([{
        'type': 'TEXT',
        'content': '1 < a >'
    }, {
        'type': 'EOF'
    }]));
});

test('case - 36', function() {
    expect(StringifyLexer('1 < a')).toBe(JSONStringify([{
        'type': 'TEXT',
        'content': '1 < a'
    }, {
        'type': 'EOF'
    }]));
});

test('case - 37', function() {
    expect(StringifyLexer('<block :if={{a > 5}}>M</block>')).toBe(JSONStringify([{
        "type": "TAGNAME",
        "content": "block"
    }, {
        "type": "ATTR",
        "content": ":if"
    }, {
        "type": "EXPR",
        "content": "a > 5"
    }, {
        'type': 'CLOSE_TAG',
        'content': ''
    }, {
        "type": "TEXT",
        "content": "M"
    },  {
        "type": "END_TAG",
        "content": "block"
    }, {
        "type": "EOF"
    }]));
});