import parser from '../src/core/parser/parser';
const FormatJSON = (str) => JSON.stringify(str, null, 2);

test('#parser - 1', () => {
    expect(FormatJSON(parser(`<div></div>`))).toBe(FormatJSON({
        "type": "Program",
        "body": [
            {
                "type": "Element",
                "name": "div",
                "attributes": [],
                "directives": {},
                "children": []
            }
        ]
    }));
});
test('#parser - 2', () => {
    expect(FormatJSON(parser(`<img/>`))).toBe(FormatJSON({
        "type": "Program",
        "body": [
            {
                "type": "Element",
                "name": "img",
                "attributes": [],
                "directives": {},
                "children": []
            }
        ]
    }));
});
test('#parser - 3', () => {
    expect(FormatJSON(parser(`<img>`))).toBe(FormatJSON({
        "type": "Program",
        "body": [
            {
                "type": "Element",
                "name": "img",
                "attributes": [],
                "directives": {},
                "children": []
            }
        ]
    }));
});
test('#parser - 4', () => {
    expect(FormatJSON(parser(`<img></img>`))).toBe(FormatJSON({
        "type": "Program",
        "body": [
            {
                "type": "Element",
                "name": "img",
                "attributes": [],
                "directives": {},
                "children": []
            }
        ]
    }));
});
test('#parser - 5', () => {
    expect(FormatJSON(parser(`<div><img a=1>2</div>`))).toBe(FormatJSON({
        "type": "Program",
        "body": [
            {
                "type": "Element",
                "name": "div",
                "attributes": [],
                "directives": {},
                "children": [
                    {
                        "type": "Element",
                        "name": "img",
                        "attributes": [
                            {
                                "type": "Attribute",
                                "name": "a",
                                "value": "1"
                            }
                        ],
                        "directives": {},
                        "children": []
                    },
                    {
                        "type": "Text",
                        "value": "2"
                    }
                ]
            }
        ]
    }));
});
test('#parser - 6', () => {
    expect(FormatJSON(parser(`<div a=2></div>`))).toBe(FormatJSON({
        "type": "Program",
        "body": [
            {
                "type": "Element",
                "name": "div",
                "attributes": [
                    {
                        "type": "Attribute",
                        "name": "a",
                        "value": "2"
                    }
                ],
                "directives": {},
                "children": []
            }
        ]
    }));
});
test('#parser - 7', () => {
    expect(FormatJSON(parser(`<div>1</div>`))).toBe(FormatJSON({
        "type": "Program",
        "body": [
            {
                "type": "Element",
                "name": "div",
                "attributes": [],
                "directives": {},
                "children": [
                    {
                        "type": "Text",
                        "value": "1"
                    }
                ]
            }
        ]
    }));
});
test('#parser - 8', () => {
    expect(FormatJSON(parser(`<block :if={a}>1</block>`))).toBe(FormatJSON({
        "type": "Program",
        "body": [
            {
                "type": "If",
                "test": "{a}",
                "consequent": {
                    "type": "Element",
                    "name": "block",
                    "attributes": [],
                    "directives": {},
                    "children": [
                        {
                            "type": "Text",
                            "value": "1"
                        }
                    ]
                }
            }
        ]
    }));
});
test('#parser - 9', () => {
    expect(FormatJSON(parser(`<div :for={list} :item="item" :itemIndex="i"></div>`))).toBe(FormatJSON({
        "type": "Program",
        "body": [
            {
                "type": "For",
                "test": "{list}",
                "init": {
                    "item": {
                        "type": "Expression",
                        "value": {
                            "type": "Identifier",
                            "name": "item"
                        }
                    },
                    "index": {
                        "type": "Expression",
                        "value": {
                            "type": "Identifier",
                            "name": "index"
                        }
                    }
                },
                "body": {
                    "type": "Element",
                    "name": "div",
                    "attributes": [],
                    "directives": {},
                    "children": []
                }
            }
        ]
    }));
});
test('#parser - 10', () => {
    expect(FormatJSON(parser(`<div :for={list} :for-item="item" :for-index="i" class="a"></div>`))).toBe(FormatJSON({
        "type": "Program",
        "body": [
            {
                "type": "For",
                "test": "{list}",
                "init": {
                    "item": "item",
                    "index": "i"
                },
                "body": {
                    "type": "Element",
                    "name": "div",
                    "attributes": [
                        {
                            "type": "Attribute",
                            "name": "class",
                            "value": "a"
                        }
                    ],
                    "directives": {},
                    "children": []
                }
            }
        ]
    }));
});
test('#parser - 11', () => {
    expect(FormatJSON(parser(`
<div>
    <block :if={a}>1</block>
    <block :elif={b}>
        <block :if={c}>1</block>
        <block :elif={d}>1</block>
    </block>
    <block :else></block>
</div>
`))).toBe(FormatJSON({
            "type": "Program",
            "body": [
                {
                    "type": "Text",
                    "value": "\n"
                },
                {
                    "type": "Element",
                    "name": "div",
                    "attributes": [],
                    "directives": {},
                    "children": [
                        {
                            "type": "Text",
                            "value": "\n    "
                        },
                        {
                            "type": "If",
                            "test": "{a}",
                            "alternate": {
                                "type": "If",
                                "test": "{b}",
                                "alternate": {
                                    "type": "Element",
                                    "name": "block",
                                    "attributes": [],
                                    "directives": {},
                                    "children": []
                                },
                                "consequent": {
                                    "type": "Element",
                                    "name": "block",
                                    "attributes": [],
                                    "directives": {},
                                    "children": [
                                        {
                                            "type": "Text",
                                            "value": "\n        "
                                        },
                                        {
                                            "type": "If",
                                            "test": "{c}",
                                            "alternate": {
                                                "type": "If",
                                                "test": "{d}",
                                                "consequent": {
                                                    "type": "Element",
                                                    "name": "block",
                                                    "attributes": [],
                                                    "directives": {},
                                                    "children": [
                                                        {
                                                            "type": "Text",
                                                            "value": "1"
                                                        }
                                                    ]
                                                }
                                            },
                                            "consequent": {
                                                "type": "Element",
                                                "name": "block",
                                                "attributes": [],
                                                "directives": {},
                                                "children": [
                                                    {
                                                        "type": "Text",
                                                        "value": "1"
                                                    }
                                                ]
                                            }
                                        },
                                        {
                                            "type": "Text",
                                            "value": "\n    "
                                        }
                                    ]
                                }
                            },
                            "consequent": {
                                "type": "Element",
                                "name": "block",
                                "attributes": [],
                                "directives": {},
                                "children": [
                                    {
                                        "type": "Text",
                                        "value": "1"
                                    }
                                ]
                            }
                        },
                        {
                            "type": "Text",
                            "value": "\n"
                        }
                    ]
                },
                {
                    "type": "Text",
                    "value": "\n"
                }
            ]
        }));
});
test('#parser - 12', () => {
    expect(FormatJSON(parser(`<div>
<block :if={{a}>1</block>
<block :elif={{b}}>1</block>
<block :elif={{c}}>1</block>
<block :else></block>
</div>`))).toBe(FormatJSON({
            "type": "Program",
            "body": [
                {
                    "type": "Element",
                    "name": "div",
                    "attributes": [],
                    "directives": {},
                    "children": [
                        {
                            "type": "Text",
                            "value": "\n"
                        },
                        {
                            "type": "If",
                            "test": "{{a}",
                            "alternate": {
                                "type": "If",
                                "test": {
                                    "type": "Expression",
                                    "value": {
                                        "type": "Identifier",
                                        "name": "b"
                                    }
                                },
                                "alternate": {
                                    "type": "If",
                                    "test": {
                                        "type": "Expression",
                                        "value": {
                                            "type": "Identifier",
                                            "name": "c"
                                        }
                                    },
                                    "alternate": {
                                        "type": "Element",
                                        "name": "block",
                                        "attributes": [],
                                        "directives": {},
                                        "children": []
                                    },
                                    "consequent": {
                                        "type": "Element",
                                        "name": "block",
                                        "attributes": [],
                                        "directives": {},
                                        "children": [
                                            {
                                                "type": "Text",
                                                "value": "1"
                                            }
                                        ]
                                    }
                                },
                                "consequent": {
                                    "type": "Element",
                                    "name": "block",
                                    "attributes": [],
                                    "directives": {},
                                    "children": [
                                        {
                                            "type": "Text",
                                            "value": "1"
                                        }
                                    ]
                                }
                            },
                            "consequent": {
                                "type": "Element",
                                "name": "block",
                                "attributes": [],
                                "directives": {},
                                "children": [
                                    {
                                        "type": "Text",
                                        "value": "1"
                                    }
                                ]
                            }
                        },
                        {
                            "type": "Text",
                            "value": "\n"
                        }
                    ]
                }
            ]
        }));
});
test('#parser - 13', () => {
    expect(FormatJSON(parser(`
<div>
    <block :for="{{list}}" :for-item="item" :for-index="index">
        <div @onClick={{this.onClick()}}>
            {{item.name}}
        </div>·
    </block>
</div>
`))).toBe(FormatJSON({
            "type": "Program",
            "body": [
                {
                    "type": "Text",
                    "value": "\n"
                },
                {
                    "type": "Element",
                    "name": "div",
                    "attributes": [],
                    "directives": {},
                    "children": [
                        {
                            "type": "Text",
                            "value": "\n    "
                        },
                        {
                            "type": "For",
                            "test": {
                                "type": "Expression",
                                "value": {
                                    "type": "Identifier",
                                    "name": "list"
                                }
                            },
                            "init": {
                                "item": "item",
                                "index": "index"
                            },
                            "body": {
                                "type": "Element",
                                "name": "block",
                                "attributes": [],
                                "directives": {},
                                "children": [
                                    {
                                        "type": "Text",
                                        "value": "\n        "
                                    },
                                    {
                                        "type": "Element",
                                        "name": "div",
                                        "attributes": [],
                                        "directives": {
                                            "onClick": {
                                                "type": "Expression",
                                                "value": {
                                                    "type": "CallExpression",
                                                    "arguments": [],
                                                    "callee": {
                                                        "type": "MemberExpression",
                                                        "computed": false,
                                                        "object": {
                                                            "type": "ThisExpression"
                                                        },
                                                        "property": {
                                                            "type": "Identifier",
                                                            "name": "onClick"
                                                        }
                                                    }
                                                }
                                            }
                                        },
                                        "children": [
                                            {
                                                "type": "Text",
                                                "value": "\n            "
                                            },
                                            {
                                                "type": "Expression",
                                                "value": {
                                                    "type": "MemberExpression",
                                                    "computed": false,
                                                    "object": {
                                                        "type": "Identifier",
                                                        "name": "item"
                                                    },
                                                    "property": {
                                                        "type": "Identifier",
                                                        "name": "name"
                                                    }
                                                }
                                            },
                                            {
                                                "type": "Text",
                                                "value": "\n        "
                                            }
                                        ]
                                    },
                                    {
                                        "type": "Text",
                                        "value": "·\n    "
                                    }
                                ]
                            }
                        },
                        {
                            "type": "Text",
                            "value": "\n"
                        }
                    ]
                },
                {
                    "type": "Text",
                    "value": "\n"
                }
            ]
        }));
});
test('#parser - 14', () => {
    expect(FormatJSON(parser(`
<Test/>122121
`))).toBe(FormatJSON({
            "type": "Program",
            "body": [
                {
                    "type": "Text",
                    "value": "\n"
                },
                {
                    "type": "Element",
                    "name": "Test",
                    "attributes": [],
                    "directives": {},
                    "children": []
                },
                {
                    "type": "Text",
                    "value": "122121\n"
                }
            ]
        }));
});
test('#parser - 15', () => {
    expect(FormatJSON(parser(`
<!-- a

aaa
`))).toBe(FormatJSON({
            "type": "Program",
            "body": [
                {
                    "type": "Text",
                    "value": "\n"
                },
                {
                    "type": "Comment",
                    "value": " a\n\naaa\n"
                }
            ]
        }));
});
test('#parser - 16', () => {
    expect(FormatJSON(parser(`{ a`))).toBe(FormatJSON({
        "type": "Program",
        "body": [
            {
                "type": "Text",
                "value": "{ a"
            }
        ]
    }));
});
test('#parser - 17', () => {
    expect(FormatJSON(parser(`<a <!-- a -->></a>`))).toBe(FormatJSON({
        "type": "Program",
        "body": [
            {
                "type": "Element",
                "name": "a",
                "attributes": [
                    {
                        "type": "Attribute",
                        "name": "<!--",
                        "value": {
                            "type": "Expression",
                            "value": {
                                "type": "Compound",
                                "body": []
                            }
                        }
                    },
                    {
                        "type": "Attribute",
                        "name": "a",
                        "value": {
                            "type": "Expression",
                            "value": {
                                "type": "Compound",
                                "body": []
                            }
                        }
                    },
                    {
                        "type": "Attribute",
                        "name": "--",
                        "value": {
                            "type": "Expression",
                            "value": {
                                "type": "Compound",
                                "body": []
                            }
                        }
                    }
                ],
                "directives": {},
                "children": [
                    {
                        "type": "Text",
                        "value": ">"
                    }
                ]
            }
        ]
    }));
});
test('#parser - 18', () => {
    expect(FormatJSON(parser(`<a></a>`))).toBe(FormatJSON({
        "type": "Program",
        "body": [
            {
                "type": "Element",
                "name": "a",
                "attributes": [],
                "directives": {},
                "children": []
            }
        ]
    }));
});
test('#parser - 19', () => {
    expect(FormatJSON(parser(`<div class=1// />`))).toBe(FormatJSON({
        "type": "Program",
        "body": [
            {
                "type": "Element",
                "name": "div",
                "attributes": [
                    {
                        "type": "Attribute",
                        "name": "class",
                        "value": "1//"
                    }
                ],
                "directives": {},
                "children": []
            }
        ]
    }));
});
test('#parser - 20', () => {
    expect(FormatJSON(parser(`<div @onClick={{fn(1, 2, 3)}}></div>`))).toBe(FormatJSON({
        "type": "Program",
        "body": [
            {
                "type": "Element",
                "name": "div",
                "attributes": [],
                "directives": {
                    "onClick": {
                        "type": "Expression",
                        "value": {
                            "type": "CallExpression",
                            "arguments": [
                                {
                                    "type": "Literal",
                                    "value": 1,
                                    "raw": "1"
                                },
                                {
                                    "type": "Literal",
                                    "value": 2,
                                    "raw": "2"
                                },
                                {
                                    "type": "Literal",
                                    "value": 3,
                                    "raw": "3"
                                }
                            ],
                            "callee": {
                                "type": "Identifier",
                                "name": "fn"
                            }
                        }
                    }
                },
                "children": []
            }
        ]
    }
    ));
});
test('#parser - 21', () => {
    expect(FormatJSON(parser(`{ {div`))).toBe(FormatJSON({
        "type": "Program",
        "body": [
            {
                "type": "Text",
                "value": "{ {div"
            }
        ]
    }));
});

test('#parser - 22', () => {
    expect(FormatJSON(parser(`<div a=`))).toBe(FormatJSON({
        "type": "Program",
        "body": [
            {
                "type": "Text",
                "value": "<div a="
            }
        ]
    }))
});
test('#parser - 22', () => {
    expect(FormatJSON(parser(`<div @onClick={{fn(1, 2, 3)}}></div>`))).toBe(FormatJSON({
        "type": "Program",
        "body": [
            {
                "type": "Element",
                "name": "div",
                "attributes": [],
                "directives": {
                    "onClick": {
                        "type": "Expression",
                        "value": {
                            "type": "CallExpression",
                            "arguments": [
                                {
                                    "type": "Literal",
                                    "value": 1,
                                    "raw": "1"
                                },
                                {
                                    "type": "Literal",
                                    "value": 2,
                                    "raw": "2"
                                },
                                {
                                    "type": "Literal",
                                    "value": 3,
                                    "raw": "3"
                                }
                            ],
                            "callee": {
                                "type": "Identifier",
                                "name": "fn"
                            }
                        }
                    }
                },
                "children": []
            }
        ]
    }))
});