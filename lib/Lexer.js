const {INIT, OPEN_TAG, OPEN_COMMENT, COMMENT, CLOSE_TAG, END_TAG, TAGNAME, TAG, EXPR, TEXT, ATTR, EQUAL, VALUE, EOF} = require('./StateTypes');
const {isSlash, isSpace, isOpenTag, isExclamationMark, isDash, isCloseTag, isEqual, isQuote, isTagClosed, returnUnLegalEndError, returnUnclosedExprError} = require('./helper');
const {isOpenExpr, isCloseExpr, getExpressionBounds} = require('./Expression');


function Lexer(source) {
    let states = [];
    let pos = 0;
    let tokens = [];
    let temp = [];
    let letter;
    let length = source.length
    const {open: EXPR_OPEN_BOUNDS, close: EXPR_CLOSE_BOUNDS} = getExpressionBounds();

    function createToken(tokenType, temp) {
        const content = temp.join('');
        return {
            type: tokenType,
            content
        };
    }

    function consumeSpaces(pos) {
      while (isSpace(source[pos])) {
          pos++;
      }
      return {
        pos
      };
    }

    function consumeCloseTag(pos) {
      let letter = source[pos];
      let next = source[pos + 1];
      if (isSlash(letter) && isCloseTag(next)) {
          return {
            pos: pos + 2,
            isSelfClose: true
          };
      } else if (isCloseTag(letter)) {
          return {
            pos: pos + 1,
            isSelfClose: false
          };
      }
    }

    function consumeValue(pos) {
        let letter = source[pos];
        let temp = [];
        if (isQuote(letter)) {
            temp.push(letter);
            pos++;
            while (pos < length) {
              letter = source[pos];

              if (
                  isQuote(letter) && letter === temp[0] && source[pos - 1] !== '\\'
              ) {
                  temp.push(letter);
                  return {
                      pos: pos + 1,
                      token: createToken(VALUE, temp)
                  };
              } else if (isSpace(letter)) {
                  if (isQuote(temp[0])) {
                      temp.push(letter);
                      pos++;
                  } else {
                    return {
                      pos: pos + 1,
                      token: createToken(VALUE, temp)
                    };
                  }
              } else if (
                  consumeCloseTag(pos)
              ) {

                if (temp.length > 0) {
                  return {
                    pos: pos,
                    token: createToken(VALUE, temp)
                  }
                } else {
                  return null;
                }
              } else {
                temp.push(letter);
                pos++;
              }
            }
        } else {
            while (pos < length) {
              letter = source[pos];
              let closeTagResult;
                if (isSpace(letter)) {
                  pos++;
                  return {
                    pos: pos,
                    token: createToken(VALUE, temp)
                  };
                } else if (closeTagResult = consumeCloseTag(pos)) {
                  if (temp.length > 0) {
                    const token = createToken(VALUE, temp);
                    return {
                      pos: pos,
                      token: closeTagResult.isSelfClose ? setTokenSelfClose(token): token
                    };
                  } else
                    return;

                } else {
                  temp.push(letter);
                  pos++;
                }
            }
        }
    }

    function consumeAttrs(pos) {
        let letter = source[pos];
        let temp = [];
        const group = [];
        while (pos < length) {
          letter = source[pos];
          if (isEqual(letter)) {
              if (temp.length > 0) {
                  group.push(createToken(ATTR, temp));
                  temp.length = 0;
              }
              pos ++;
              pos = consumeSpaces(pos).pos;

              const {pos: posNext, token} = (consumeValue(pos) || consumeExpression(pos)) || {};

              if (token) {
                group.push(token);
                pos = posNext;
              }

          } else if (
            (isSlash(letter) && isCloseTag(source[pos + 1]))
            || isCloseTag(letter)
          ) {
              if (temp.length > 0) {
                  group.push(createToken(ATTR, temp));
                  temp.length = 0;
              }
              return {
                pos: pos,
                token: group
              }
          } else if (isSpace(letter)) {
              if (temp.length > 0) {
                  group.push(createToken(ATTR, temp));
                  temp.length = 0;
              }
              pos++;
          } else {
              temp.push(letter);
              pos++;
          }
        }
    }

    function consumeTag(pos) {
      let letter = source[pos];
      let temp = [];
      let group = [];

      if (isOpenTag(letter)
        && !isSlash(source[pos + 1])
        && !isSpace(source[pos + 1])
        && !isOpenTag(source[pos + 1])
        && !isCloseTag(source[pos + 1])
      ) {
          ++pos;
          while (pos < length) {
            letter = source[pos];
            const {pos: posCloseTag, isSelfClose} = consumeCloseTag(pos) || {};

            if (posCloseTag) {
                if (group.length === 0) {
                  group = [
                    createToken(TAGNAME, temp)
                  ]
                }

                if (isSelfClose) {
                  group[0] = setTokenSelfClose(group[0]);
                }

                return {
                  pos: posCloseTag,
                  token: group
                };
            }

            if (isSpace(letter)) {
                ++pos;
                if (!isSpace(source[pos + 1])) {
                    group = [
                      createToken(TAGNAME, temp)
                    ];

                    let {token: attrs, pos: posAttrs} = consumeAttrs(pos) || {};

                    if (attrs) {
                      group = [
                        ...group, ...attrs
                      ];
                      pos = posAttrs;
                    }

                    pos = consumeSpaces(pos).pos;
                }
            } else {
                temp.push(letter);
                ++pos;
            }
          }
      }
    }

    function consumeEndTag(pos) {
      let letter = source[pos];
      let temp = [];

      if (
        isOpenTag(letter) && isSlash(source[pos + 1]) &&
        (
          !isSpace(source[pos + 2]) &&
          !isOpenTag(source[pos + 2])
        )
      ) {
        pos += 2;

        while (pos < length) {
          letter = source[pos];
          if (isSpace(letter)) {}
          else if (isCloseTag(letter)) {
              const token = createToken(END_TAG, temp);
              return {
                pos: pos + 1,
                token: token
              };
          } else {
              temp.push(letter);
              pos ++;
          }
        }
      }
    }

    function consumeComment(pos) {
      let letter = source[pos];
      let temp = [];

      if (isOpenTag(letter)
          && isExclamationMark(source[++pos])
          && isDash(source[++pos])
          && isDash(source[++pos])) {
            ++pos;
            while (pos < length) {
              letter = source[pos];
              if (isDash(letter) && isDash(source[pos + 1]) && isCloseTag(source[pos + 2])) {
                  return {
                    pos: pos + 3,
                    token: createToken(COMMENT, temp)
                  };
              } else {
                temp.push(letter);
                pos ++;
              }
            }

            return {
              pos,
              token: createToken(COMMENT, temp)
            };
      }
    }

    function consumeText(pos) {
        let letter = source[pos];
        let temp = [];

        temp.push(letter);
        pos++;
        while (pos < length) {
          letter = source[pos];
            if (isOpenTag(letter) || isOpenExpr(letter, source[pos + 1])) {
                return {
                  pos: pos,
                  token: createToken(TEXT, temp)
                };
            } else {
                temp.push(letter);
                pos++;
            }
        }

        return {
          pos,
          token: createToken(TEXT, temp)
        };
    }

    function consumeExpression(pos) {
        let letter = source[pos];
        let temp = [];
        if (isOpenExpr(letter, source[pos + 1])) {
            pos += EXPR_OPEN_BOUNDS.length;
            while (pos < length) {
              letter = source[pos];
              if (
                  isOpenExpr(letter, source[pos + 1])
              ) {
                  return false;
              } else if (
                  isCloseExpr(letter, source[pos + 1])
              ) {
                  pos += EXPR_CLOSE_BOUNDS.length;
                  return {
                    pos: pos,
                    token: createToken(EXPR, temp)
                  };
              } else {
                  temp.push(letter);
                  pos++;
              }
            }
        }
    }

    function getPosition(pos) {
        const sourceFragment = source.substr(0, pos);
        const matchLines = sourceFragment.match(/\n/g);
        const matchColumns = sourceFragment.match(/[^\n]*$/g);
        const line = (matchLines && matchLines.length) + 1;
        const column = (matchColumns && matchColumns[0].length);
        return {
            line, column
        };
    }


    function setTokenSelfClose(token) {
        return Object.assign(token, {
          isSelfClose: true
        });
    }


    function mergeTextTokens() {
        let index = 0;
        return tokens.reduce((list, token) => {
            const prevToken = list[index - 1];

            if ((token.type === TEXT) && prevToken && (prevToken.type === TEXT)) {
                prevToken.content += token.content;
            } else {
                list.push(token);
                index++;
            }
            return list;
        }, []);
    }

    /* eslint-disable */
    while (pos < length) {
      letter = source[pos];
    /* eslint-enable */
        const {
          pos: posNext, token
        } = consumeEndTag(pos) || consumeComment(pos) || consumeTag(pos) || consumeExpression(pos) || consumeText(pos) || {};

        if (Array.isArray(token)) {
          pos = posNext;
          tokens = [
            ...tokens, ...token
          ];
        } else if (typeof token === 'object') {
          pos = posNext;
          tokens.push(token);
        } else {
          console.log(source.substr(pos))
          console.warn('no avaliable token');
          return;
        }
    }

    tokens = mergeTextTokens();

    tokens = [...tokens, {
        type: EOF
    }];

    refs = isTagClosed(tokens);
    if (refs.message) {
        throw refs.message;
    }

    return tokens;
}

exports.Lexer = Lexer;
