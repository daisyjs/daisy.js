(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(factory());
}(this, (function () { 'use strict';

var asyncGenerator = function () {
  function AwaitValue(value) {
    this.value = value;
  }

  function AsyncGenerator(gen) {
    var front, back;

    function send(key, arg) {
      return new Promise(function (resolve, reject) {
        var request = {
          key: key,
          arg: arg,
          resolve: resolve,
          reject: reject,
          next: null
        };

        if (back) {
          back = back.next = request;
        } else {
          front = back = request;
          resume(key, arg);
        }
      });
    }

    function resume(key, arg) {
      try {
        var result = gen[key](arg);
        var value = result.value;

        if (value instanceof AwaitValue) {
          Promise.resolve(value.value).then(function (arg) {
            resume("next", arg);
          }, function (arg) {
            resume("throw", arg);
          });
        } else {
          settle(result.done ? "return" : "normal", result.value);
        }
      } catch (err) {
        settle("throw", err);
      }
    }

    function settle(type, value) {
      switch (type) {
        case "return":
          front.resolve({
            value: value,
            done: true
          });
          break;

        case "throw":
          front.reject(value);
          break;

        default:
          front.resolve({
            value: value,
            done: false
          });
          break;
      }

      front = front.next;

      if (front) {
        resume(front.key, front.arg);
      } else {
        back = null;
      }
    }

    this._invoke = send;

    if (typeof gen.return !== "function") {
      this.return = undefined;
    }
  }

  if (typeof Symbol === "function" && Symbol.asyncIterator) {
    AsyncGenerator.prototype[Symbol.asyncIterator] = function () {
      return this;
    };
  }

  AsyncGenerator.prototype.next = function (arg) {
    return this._invoke("next", arg);
  };

  AsyncGenerator.prototype.throw = function (arg) {
    return this._invoke("throw", arg);
  };

  AsyncGenerator.prototype.return = function (arg) {
    return this._invoke("return", arg);
  };

  return {
    wrap: function (fn) {
      return function () {
        return new AsyncGenerator(fn.apply(this, arguments));
      };
    },
    await: function (value) {
      return new AwaitValue(value);
    }
  };
}();





var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();





var defineProperty = function (obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
};



var inherits = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
};











var possibleConstructorReturn = function (self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && (typeof call === "object" || typeof call === "function") ? call : self;
};



















var toConsumableArray = function (arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

    return arr2;
  } else {
    return Array.from(arr);
  }
};

// eslint-disable-next-line
var Header = function (_Daisy$Component) {
    inherits(Header, _Daisy$Component);

    function Header() {
        classCallCheck(this, Header);
        return possibleConstructorReturn(this, (Header.__proto__ || Object.getPrototypeOf(Header)).apply(this, arguments));
    }

    createClass(Header, [{
        key: "render",
        value: function render() {
            return "<header class=\"header\">\n            <h1>{{todos}}</h1>\n            <template :include={{this.body}}></template>\n        </header>";
        }
    }]);
    return Header;
}(Daisy.Component);

// eslint-disable-next-line
var TodoItem = function (_Daisy$Component) {
    inherits(TodoItem, _Daisy$Component);

    function TodoItem() {
        classCallCheck(this, TodoItem);
        return possibleConstructorReturn(this, (TodoItem.__proto__ || Object.getPrototypeOf(TodoItem)).apply(this, arguments));
    }

    createClass(TodoItem, [{
        key: 'state',
        value: function state(_state) {
            return Object.assign(_state, {
                checkedClass: 'checked',
                uncheckedClass: 'unchecked'
            });
        }
    }, {
        key: 'render',
        value: function render() {
            return '\n            <li class="todo {{!!status ? \'completed\': \'\'}}">\n                <div class="view"\n                    @onClick={{this.emit(\'click\', name)}}\n                >\n                    <input type="checkbox" \n                        class="toggle" \n                        checked={{!!status}} \n                    >\n                    <label\n                        class={{status ? checkedClass : uncheckedClass}}\n                    >{{name}}</label> <button class="destroy" @onClick={{this.onDestory($event)}}></button>    \n                </div>\n                <input type="text" class="edit">\n            </li>';
        }
    }, {
        key: 'onDestory',
        value: function onDestory(event) {
            this.emit('destroy');
            event.stopPropagation();
        }

        // eslint-disable-next-line

    }, {
        key: 'parsed',
        value: function parsed(ast) {}
    }]);
    return TodoItem;
}(Daisy.Component);

// eslint-disable-next-line
var Footer = function (_Daisy$Component) {
    inherits(Footer, _Daisy$Component);

    function Footer() {
        classCallCheck(this, Footer);
        return possibleConstructorReturn(this, (Footer.__proto__ || Object.getPrototypeOf(Footer)).apply(this, arguments));
    }

    createClass(Footer, [{
        key: 'render',
        value: function render() {
            return '\n        <footer class="footer">\n            <span class="todo-count"><strong>{{size}}</strong> items left</span>\n            <ul class="filters">\n                <li :for={{statusList}}>\n                    <a href="#/all" class="{{item.type === status? \'selected\': \'\'}}" @onClick={{this.onFilterClick(item.type)}}>{{item.name}}</a>\n                </li>\n            </ul>\n            <button class="clear-completed" @onClick={{this.emit(\'clear\')}}>Clear completed</button>\n        </footer>';
        }
    }, {
        key: 'onFilterClick',
        value: function onFilterClick(type) {
            this.emit('change', type);
        }
    }]);
    return Footer;
}(Daisy.Component);

// eslint-disable-next-line
var Info = function (_Daisy$Component) {
				inherits(Info, _Daisy$Component);

				function Info() {
								classCallCheck(this, Info);
								return possibleConstructorReturn(this, (Info.__proto__ || Object.getPrototypeOf(Info)).apply(this, arguments));
				}

				createClass(Info, [{
								key: "render",
								value: function render() {
												return "<footer class=\"info\">\n\t\t\t<p>Double-click to edit a todo</p>\n\t\t\t<p>Written by <a href=\"http://evanyou.me\">Evan You</a></p>\n\t\t\t<p>Part of <a href=\"http://todomvc.com\">TodoMVC</a></p>\n\t\t</footer>";
								}
				}]);
				return Info;
}(Daisy.Component);

// eslint-disable-next-line
var Main = function (_Daisy$Component) {
    inherits(Main, _Daisy$Component);

    function Main() {
        classCallCheck(this, Main);
        return possibleConstructorReturn(this, (Main.__proto__ || Object.getPrototypeOf(Main)).apply(this, arguments));
    }

    createClass(Main, [{
        key: "render",
        value: function render() {
            return "<section class=\"main\"><input type=\"checkbox\" class=\"toggle-all\"> \n            <ul class=\"todo-list\">\n                <template :include={{this.body}}/>\n            </ul>\n        </section>";
        }
    }]);
    return Main;
}(Daisy.Component);

var filter = function filter(status, s) {
  return s === 2 ? true : status === s;
};

var list = function list(_list, s) {
  return _list.filter(function (item) {
    return item.status === s;
  });
};

var size = function size(li, s) {
  return list(li, s).length;
};

var _dec;
var _dec2;
var _dec3;
var _dec4;
var _dec5;
var _class;

var ALL = 2;
var ACTIVE = 0;
var COMPLETED = 1;

// eslint-disable-next-line
var _Daisy$annotations = Daisy.annotations;
var component = _Daisy$annotations.component;
var method = _Daisy$annotations.method;
var directive = _Daisy$annotations.directive;
var event = _Daisy$annotations.event;
var computed = _Daisy$annotations.computed;


// eslint-disable-next-line
var Component = (_dec = component({ Todo: TodoItem, Header: Header, Footer: Footer, Info: Info, Main: Main }), _dec2 = method({ filter: filter, size: size, list: list }), _dec3 = directive(), _dec4 = event(), _dec5 = computed({
    todos: function todos() {
        return 'todos';
    }
}), _dec(_class = _dec2(_class = _dec3(_class = _dec4(_class = _dec5(_class = function (_Daisy$Component) {
    inherits(Component, _Daisy$Component);

    function Component() {
        classCallCheck(this, Component);
        return possibleConstructorReturn(this, (Component.__proto__ || Object.getPrototypeOf(Component)).apply(this, arguments));
    }

    createClass(Component, [{
        key: 'state',
        value: function state() {
            var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

            var lastState = {};
            if (localStorage.getItem('todoState')) {
                lastState = JSON.parse(localStorage.getItem('todoState'));
            }
            return Object.assign({
                history: [],
                status: 2,
                todoList: [],
                activeStatus: ACTIVE,
                statusList: [{
                    name: 'All',
                    type: ALL
                }, {
                    name: 'Active',
                    type: ACTIVE
                }, {
                    name: 'completed',
                    type: COMPLETED
                }]
            }, props, lastState);
        }
    }, {
        key: 'render',
        value: function render() {
            return '<section class="todoapp">\n            <Header\n                title={{todos}}\n            >\n                <input\n                    autofocus="autofocus"\n                    autocomplete="off"\n                    placeholder="What needs to be done?"\n                    class="new-todo"\n                    @onKeydown={{this.onKeyDown($event)}}\n                    @ref="input"\n                >\n            </Header>\n            <Main>\n                <Todo\n                    :for={{todoList}}\n                    :if={{filter(item.status, status)}}\n                    name={{item.name}}\n                    status={{item.status}}\n                    todo={{item}}\n                    @onClick={{this.onTodoClick(item, $event)}}\n                    @onDestroy={{this.onDestroy(index)}}\n                ></Todo>\n            </Main>\n            <Footer\n                :if={{todoList.length > 0}}\n                size={{size(todoList, activeStatus)}}\n                status={{status}}\n                statusList={{statusList}}\n                @onChange={{this.onStatusChange($event)}}\n                @onClear={{this.onClear()}}\n            ></Footer>\n        </section>';
        }
    }, {
        key: 'onKeyDown',
        value: function onKeyDown(_ref) {
            var keyCode = _ref.keyCode;

            if (keyCode === 13) {
                var value = this.refs.input.value;
                this.add(value);
                this.refs.input.value = '';
            }
        }
    }, {
        key: 'onTodoClick',
        value: function onTodoClick(todo) {
            var todoList = this.getState().todoList;
            var index = todoList.indexOf(todo);

            this.setState(defineProperty({}, 'todoList.' + index + '.status', Number(!todo.status)));
        }
    }, {
        key: 'onDestroy',
        value: function onDestroy(index) {
            var todoList = this.getState().todoList;
            this.setState({
                todoList: [].concat(toConsumableArray(todoList.slice(0, index)), toConsumableArray(todoList.slice(index + 1)))
            });
        }
    }, {
        key: 'add',
        value: function add(value) {
            var todoList = this.getState().todoList;
            this.setState(defineProperty({}, 'todoList.' + todoList.length, {
                name: value,
                status: 0
            }));
        }
    }, {
        key: 'onStatusChange',
        value: function onStatusChange(status) {
            this.setState({
                status: status
            });
        }
    }, {
        key: 'onClear',
        value: function onClear() {
            var todoList = this.getState().todoList.filter(function (item) {
                return !item.status;
            });
            this.setState({
                todoList: todoList
            });
        }

        // eslint-disable-next-line

    }, {
        key: 'parsed',
        value: function parsed() {}

        // eslint-disable-next-line

    }, {
        key: 'ready',
        value: function ready() {}

        // eslint-disable-next-line

    }, {
        key: 'mounted',
        value: function mounted(dom) {}

        // eslint-disable-next-line

    }, {
        key: 'patched',
        value: function patched(dom) {
            localStorage.setItem('todoState', JSON.stringify(this.getState()));
        }
    }, {
        key: 'onReset',
        value: function onReset() {
            this.setState({
                todoList: this.state.todoList
            });
        }
    }]);
    return Component;
}(Daisy.Component)) || _class) || _class) || _class) || _class) || _class);

new Component({
    state: {}
}).mount(document.querySelector('#app'));

})));
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidG9kb212Yy5qcyIsInNvdXJjZXMiOlsiLi4vc3JjL2NvbXBvbmVudHMvSGVhZGVyLmpzIiwiLi4vc3JjL2NvbXBvbmVudHMvVG9kby5qcyIsIi4uL3NyYy9jb21wb25lbnRzL0Zvb3Rlci5qcyIsIi4uL3NyYy9jb21wb25lbnRzL0luZm8uanMiLCIuLi9zcmMvY29tcG9uZW50cy9NYWluLmpzIiwiLi4vc3JjL21ldGhvZHMvZmlsdGVyLmpzIiwiLi4vc3JjL21ldGhvZHMvbGlzdC5qcyIsIi4uL3NyYy9tZXRob2RzL3NpemUuanMiLCIuLi9zcmMvY29tcG9uZW50cy9JbmRleC5qcyIsIi4uL3NyYy90b2RvbXZjLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZVxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgSGVhZGVyIGV4dGVuZHMgRGFpc3kuQ29tcG9uZW50IHtcbiAgICByZW5kZXIoKSB7XG4gICAgICAgIHJldHVybiBgPGhlYWRlciBjbGFzcz1cImhlYWRlclwiPlxuICAgICAgICAgICAgPGgxPnt7dG9kb3N9fTwvaDE+XG4gICAgICAgICAgICA8dGVtcGxhdGUgOmluY2x1ZGU9e3t0aGlzLmJvZHl9fT48L3RlbXBsYXRlPlxuICAgICAgICA8L2hlYWRlcj5gO1xuICAgIH1cbn0iLCIvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmVcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFRvZG9JdGVtIGV4dGVuZHMgRGFpc3kuQ29tcG9uZW50IHtcbiAgICBzdGF0ZShzdGF0ZSkge1xuICAgICAgICByZXR1cm4gT2JqZWN0LmFzc2lnbihzdGF0ZSwge1xuICAgICAgICAgICAgY2hlY2tlZENsYXNzOiAnY2hlY2tlZCcsXG4gICAgICAgICAgICB1bmNoZWNrZWRDbGFzczogJ3VuY2hlY2tlZCcsXG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHJlbmRlcigpIHtcbiAgICAgICAgcmV0dXJuIGBcbiAgICAgICAgICAgIDxsaSBjbGFzcz1cInRvZG8ge3shIXN0YXR1cyA/ICdjb21wbGV0ZWQnOiAnJ319XCI+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInZpZXdcIlxuICAgICAgICAgICAgICAgICAgICBAb25DbGljaz17e3RoaXMuZW1pdCgnY2xpY2snLCBuYW1lKX19XG4gICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cImNoZWNrYm94XCIgXG4gICAgICAgICAgICAgICAgICAgICAgICBjbGFzcz1cInRvZ2dsZVwiIFxuICAgICAgICAgICAgICAgICAgICAgICAgY2hlY2tlZD17eyEhc3RhdHVzfX0gXG4gICAgICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgICAgPGxhYmVsXG4gICAgICAgICAgICAgICAgICAgICAgICBjbGFzcz17e3N0YXR1cyA/IGNoZWNrZWRDbGFzcyA6IHVuY2hlY2tlZENsYXNzfX1cbiAgICAgICAgICAgICAgICAgICAgPnt7bmFtZX19PC9sYWJlbD4gPGJ1dHRvbiBjbGFzcz1cImRlc3Ryb3lcIiBAb25DbGljaz17e3RoaXMub25EZXN0b3J5KCRldmVudCl9fT48L2J1dHRvbj4gICAgXG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJ0ZXh0XCIgY2xhc3M9XCJlZGl0XCI+XG4gICAgICAgICAgICA8L2xpPmA7XG4gICAgfVxuXG4gICAgb25EZXN0b3J5KGV2ZW50KSB7XG4gICAgICAgIHRoaXMuZW1pdCgnZGVzdHJveScpO1xuICAgICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICB9XG5cbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmVcbiAgICBwYXJzZWQoYXN0KSB7XG4gICAgfVxufVxuIiwiLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBGb290ZXIgZXh0ZW5kcyBEYWlzeS5Db21wb25lbnR7XG4gICAgcmVuZGVyKCkge1xuICAgICAgICByZXR1cm4gYFxuICAgICAgICA8Zm9vdGVyIGNsYXNzPVwiZm9vdGVyXCI+XG4gICAgICAgICAgICA8c3BhbiBjbGFzcz1cInRvZG8tY291bnRcIj48c3Ryb25nPnt7c2l6ZX19PC9zdHJvbmc+IGl0ZW1zIGxlZnQ8L3NwYW4+XG4gICAgICAgICAgICA8dWwgY2xhc3M9XCJmaWx0ZXJzXCI+XG4gICAgICAgICAgICAgICAgPGxpIDpmb3I9e3tzdGF0dXNMaXN0fX0+XG4gICAgICAgICAgICAgICAgICAgIDxhIGhyZWY9XCIjL2FsbFwiIGNsYXNzPVwie3tpdGVtLnR5cGUgPT09IHN0YXR1cz8gJ3NlbGVjdGVkJzogJyd9fVwiIEBvbkNsaWNrPXt7dGhpcy5vbkZpbHRlckNsaWNrKGl0ZW0udHlwZSl9fT57e2l0ZW0ubmFtZX19PC9hPlxuICAgICAgICAgICAgICAgIDwvbGk+XG4gICAgICAgICAgICA8L3VsPlxuICAgICAgICAgICAgPGJ1dHRvbiBjbGFzcz1cImNsZWFyLWNvbXBsZXRlZFwiIEBvbkNsaWNrPXt7dGhpcy5lbWl0KCdjbGVhcicpfX0+Q2xlYXIgY29tcGxldGVkPC9idXR0b24+XG4gICAgICAgIDwvZm9vdGVyPmA7XG4gICAgfVxuXG4gICAgb25GaWx0ZXJDbGljayh0eXBlKSB7XG4gICAgICAgIHRoaXMuZW1pdCgnY2hhbmdlJywgdHlwZSk7XG4gICAgfVxufSIsIi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZVxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgSW5mbyBleHRlbmRzIERhaXN5LkNvbXBvbmVudCB7XG4gICAgcmVuZGVyKCkge1xuICAgICAgICByZXR1cm4gYDxmb290ZXIgY2xhc3M9XCJpbmZvXCI+XG5cdFx0XHQ8cD5Eb3VibGUtY2xpY2sgdG8gZWRpdCBhIHRvZG88L3A+XG5cdFx0XHQ8cD5Xcml0dGVuIGJ5IDxhIGhyZWY9XCJodHRwOi8vZXZhbnlvdS5tZVwiPkV2YW4gWW91PC9hPjwvcD5cblx0XHRcdDxwPlBhcnQgb2YgPGEgaHJlZj1cImh0dHA6Ly90b2RvbXZjLmNvbVwiPlRvZG9NVkM8L2E+PC9wPlxuXHRcdDwvZm9vdGVyPmA7XG4gICAgfVxufSIsIi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZVxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTWFpbiBleHRlbmRzIERhaXN5LkNvbXBvbmVudCB7XG4gICAgcmVuZGVyKCkge1xuICAgICAgICByZXR1cm4gYDxzZWN0aW9uIGNsYXNzPVwibWFpblwiPjxpbnB1dCB0eXBlPVwiY2hlY2tib3hcIiBjbGFzcz1cInRvZ2dsZS1hbGxcIj4gXG4gICAgICAgICAgICA8dWwgY2xhc3M9XCJ0b2RvLWxpc3RcIj5cbiAgICAgICAgICAgICAgICA8dGVtcGxhdGUgOmluY2x1ZGU9e3t0aGlzLmJvZHl9fS8+XG4gICAgICAgICAgICA8L3VsPlxuICAgICAgICA8L3NlY3Rpb24+YDtcbiAgICB9XG59IiwiY29uc3QgZmlsdGVyID0gKHN0YXR1cywgcykgPT4gKHMgPT09IDIgPyB0cnVlIDogKHN0YXR1cyA9PT0gcykpO1xuZXhwb3J0IGRlZmF1bHQgZmlsdGVyOyIsImltcG9ydCBmaWx0ZXIgZnJvbSAnLi9maWx0ZXInO1xuXG5jb25zdCBsaXN0ID0gKGxpc3QsIHMpID0+IGxpc3QuZmlsdGVyKGl0ZW0gPT4gaXRlbS5zdGF0dXMgPT09IHMpO1xuXG5leHBvcnQgZGVmYXVsdCBsaXN0OyIsImltcG9ydCBsaXN0IGZyb20gJy4vbGlzdCc7XG5cbmNvbnN0IHNpemUgPSAobGksIHMpID0+IGxpc3QobGksIHMpLmxlbmd0aDtcblxuZXhwb3J0IGRlZmF1bHQgc2l6ZTsiLCJpbXBvcnQgSGVhZGVyIGZyb20gJy4vSGVhZGVyJztcbmltcG9ydCBUb2RvIGZyb20gJy4vVG9kbyc7XG5pbXBvcnQgRm9vdGVyIGZyb20gJy4vRm9vdGVyJztcbmltcG9ydCBJbmZvIGZyb20gJy4vSW5mbyc7XG5pbXBvcnQgTWFpbiBmcm9tICcuL01haW4nO1xuaW1wb3J0IGZpbHRlciBmcm9tICcuLi9tZXRob2RzL2ZpbHRlcic7XG5pbXBvcnQgbGlzdCBmcm9tICcuLi9tZXRob2RzL2xpc3QnO1xuaW1wb3J0IHNpemUgZnJvbSAnLi4vbWV0aG9kcy9zaXplJztcblxuY29uc3QgQUxMID0gMjtcdFx0XG5jb25zdCBBQ1RJVkUgPSAwO1x0XHRcbmNvbnN0IENPTVBMRVRFRCA9IDE7XG5cbi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZVxuY29uc3Qge2NvbXBvbmVudCwgbWV0aG9kLCBkaXJlY3RpdmUsIGV2ZW50LCBjb21wdXRlZH0gPSBEYWlzeS5hbm5vdGF0aW9ucztcblxuQGNvbXBvbmVudCh7VG9kbywgSGVhZGVyLCBGb290ZXIsIEluZm8sIE1haW59KVxuQG1ldGhvZCh7ZmlsdGVyLCBzaXplLCBsaXN0fSlcbkBkaXJlY3RpdmUoKVxuQGV2ZW50KClcbkBjb21wdXRlZCh7IFxuICAgIHRvZG9zKCkge1xuICAgICAgICByZXR1cm4gJ3RvZG9zJztcbiAgICB9XG59KVxuXG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmVcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENvbXBvbmVudCBleHRlbmRzIERhaXN5LkNvbXBvbmVudCB7XG4gICAgc3RhdGUocHJvcHMgPSB7fSkge1xuICAgICAgICBsZXQgbGFzdFN0YXRlID0ge307XG4gICAgICAgIGlmIChsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgndG9kb1N0YXRlJykpIHtcbiAgICAgICAgICAgIGxhc3RTdGF0ZSA9IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0oJ3RvZG9TdGF0ZScpKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gT2JqZWN0LmFzc2lnbih7XG4gICAgICAgICAgICBoaXN0b3J5OiBbXSxcbiAgICAgICAgICAgIHN0YXR1czogMixcbiAgICAgICAgICAgIHRvZG9MaXN0OiBbXG4gICAgICAgICAgICBdLFxuICAgICAgICAgICAgYWN0aXZlU3RhdHVzOiBBQ1RJVkUsXG4gICAgICAgICAgICBzdGF0dXNMaXN0OiBbXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBuYW1lOiAnQWxsJyxcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogQUxMXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIG5hbWU6ICdBY3RpdmUnLFxuICAgICAgICAgICAgICAgICAgICB0eXBlOiBBQ1RJVkVcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogJ2NvbXBsZXRlZCcsXG4gICAgICAgICAgICAgICAgICAgIHR5cGU6IENPTVBMRVRFRFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF1cbiAgICAgICAgfSwgcHJvcHMsIGxhc3RTdGF0ZSk7XG4gICAgfVxuICAgIHJlbmRlcigpIHtcbiAgICAgICAgcmV0dXJuIGA8c2VjdGlvbiBjbGFzcz1cInRvZG9hcHBcIj5cbiAgICAgICAgICAgIDxIZWFkZXJcbiAgICAgICAgICAgICAgICB0aXRsZT17e3RvZG9zfX1cbiAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICA8aW5wdXRcbiAgICAgICAgICAgICAgICAgICAgYXV0b2ZvY3VzPVwiYXV0b2ZvY3VzXCJcbiAgICAgICAgICAgICAgICAgICAgYXV0b2NvbXBsZXRlPVwib2ZmXCJcbiAgICAgICAgICAgICAgICAgICAgcGxhY2Vob2xkZXI9XCJXaGF0IG5lZWRzIHRvIGJlIGRvbmU/XCJcbiAgICAgICAgICAgICAgICAgICAgY2xhc3M9XCJuZXctdG9kb1wiXG4gICAgICAgICAgICAgICAgICAgIEBvbktleWRvd249e3t0aGlzLm9uS2V5RG93bigkZXZlbnQpfX1cbiAgICAgICAgICAgICAgICAgICAgQHJlZj1cImlucHV0XCJcbiAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICA8L0hlYWRlcj5cbiAgICAgICAgICAgIDxNYWluPlxuICAgICAgICAgICAgICAgIDxUb2RvXG4gICAgICAgICAgICAgICAgICAgIDpmb3I9e3t0b2RvTGlzdH19XG4gICAgICAgICAgICAgICAgICAgIDppZj17e2ZpbHRlcihpdGVtLnN0YXR1cywgc3RhdHVzKX19XG4gICAgICAgICAgICAgICAgICAgIG5hbWU9e3tpdGVtLm5hbWV9fVxuICAgICAgICAgICAgICAgICAgICBzdGF0dXM9e3tpdGVtLnN0YXR1c319XG4gICAgICAgICAgICAgICAgICAgIHRvZG89e3tpdGVtfX1cbiAgICAgICAgICAgICAgICAgICAgQG9uQ2xpY2s9e3t0aGlzLm9uVG9kb0NsaWNrKGl0ZW0sICRldmVudCl9fVxuICAgICAgICAgICAgICAgICAgICBAb25EZXN0cm95PXt7dGhpcy5vbkRlc3Ryb3koaW5kZXgpfX1cbiAgICAgICAgICAgICAgICA+PC9Ub2RvPlxuICAgICAgICAgICAgPC9NYWluPlxuICAgICAgICAgICAgPEZvb3RlclxuICAgICAgICAgICAgICAgIDppZj17e3RvZG9MaXN0Lmxlbmd0aCA+IDB9fVxuICAgICAgICAgICAgICAgIHNpemU9e3tzaXplKHRvZG9MaXN0LCBhY3RpdmVTdGF0dXMpfX1cbiAgICAgICAgICAgICAgICBzdGF0dXM9e3tzdGF0dXN9fVxuICAgICAgICAgICAgICAgIHN0YXR1c0xpc3Q9e3tzdGF0dXNMaXN0fX1cbiAgICAgICAgICAgICAgICBAb25DaGFuZ2U9e3t0aGlzLm9uU3RhdHVzQ2hhbmdlKCRldmVudCl9fVxuICAgICAgICAgICAgICAgIEBvbkNsZWFyPXt7dGhpcy5vbkNsZWFyKCl9fVxuICAgICAgICAgICAgPjwvRm9vdGVyPlxuICAgICAgICA8L3NlY3Rpb24+YDtcbiAgICB9XG4gICAgXG4gICAgb25LZXlEb3duKHtrZXlDb2RlfSkge1xuICAgICAgICBpZiAoa2V5Q29kZSA9PT0gMTMpIHtcbiAgICAgICAgICAgIGNvbnN0IHZhbHVlID0gdGhpcy5yZWZzLmlucHV0LnZhbHVlO1xuICAgICAgICAgICAgdGhpcy5hZGQodmFsdWUpO1xuICAgICAgICAgICAgdGhpcy5yZWZzLmlucHV0LnZhbHVlID0gJyc7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBvblRvZG9DbGljayh0b2RvKSB7XG4gICAgICAgIGNvbnN0IHRvZG9MaXN0ID0gdGhpcy5nZXRTdGF0ZSgpLnRvZG9MaXN0O1xuICAgICAgICBjb25zdCBpbmRleCA9IHRvZG9MaXN0LmluZGV4T2YodG9kbyk7XG4gICAgICAgIFxuICAgICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgICAgIFtgdG9kb0xpc3QuJHtpbmRleH0uc3RhdHVzYF06IE51bWJlcighdG9kby5zdGF0dXMpXG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIG9uRGVzdHJveShpbmRleCkge1xuICAgICAgICBsZXQgdG9kb0xpc3QgPSB0aGlzLmdldFN0YXRlKCkudG9kb0xpc3Q7XG4gICAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICAgICAgdG9kb0xpc3Q6IFtcbiAgICAgICAgICAgICAgICAuLi50b2RvTGlzdC5zbGljZSgwLCBpbmRleCksXG4gICAgICAgICAgICAgICAgLi4udG9kb0xpc3Quc2xpY2UoaW5kZXgrMSlcbiAgICAgICAgICAgIF1cbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgYWRkKHZhbHVlKSB7XG4gICAgICAgIGNvbnN0IHRvZG9MaXN0ID0gdGhpcy5nZXRTdGF0ZSgpLnRvZG9MaXN0O1xuICAgICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgICAgIFtgdG9kb0xpc3QuJHt0b2RvTGlzdC5sZW5ndGh9YF06IHtcbiAgICAgICAgICAgICAgICBuYW1lOiB2YWx1ZSxcbiAgICAgICAgICAgICAgICBzdGF0dXM6IDBcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgb25TdGF0dXNDaGFuZ2Uoc3RhdHVzKSB7XG4gICAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICAgICAgc3RhdHVzXG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIG9uQ2xlYXIoKSB7XG4gICAgICAgIGNvbnN0IHRvZG9MaXN0ID0gdGhpcy5nZXRTdGF0ZSgpLnRvZG9MaXN0LmZpbHRlcigoaXRlbSkgPT4gIWl0ZW0uc3RhdHVzKTtcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgICAgICB0b2RvTGlzdFxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmVcbiAgICBwYXJzZWQoKSB7XG4gICAgfVxuXG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lXG4gICAgcmVhZHkoKSB7XG4gICAgfVxuXG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lXG4gICAgbW91bnRlZChkb20pIHtcbiAgICB9XG5cbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmVcbiAgICBwYXRjaGVkKGRvbSkge1xuICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgndG9kb1N0YXRlJywgXG4gICAgICAgICAgICBKU09OLnN0cmluZ2lmeShcbiAgICAgICAgICAgICAgICB0aGlzLmdldFN0YXRlKClcbiAgICAgICAgICAgIClcbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICBvblJlc2V0KCkge1xuICAgICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgICAgIHRvZG9MaXN0OiB0aGlzLnN0YXRlLnRvZG9MaXN0XG4gICAgICAgIH0pO1xuICAgIH1cbn0iLCJpbXBvcnQgSW5kZXggZnJvbSAnLi9jb21wb25lbnRzL0luZGV4Jztcbm5ldyBJbmRleCh7XG4gICAgc3RhdGU6IHt9XG59KS5tb3VudChkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjYXBwJykpOyJdLCJuYW1lcyI6WyJIZWFkZXIiLCJEYWlzeSIsIkNvbXBvbmVudCIsIlRvZG9JdGVtIiwic3RhdGUiLCJPYmplY3QiLCJhc3NpZ24iLCJldmVudCIsImVtaXQiLCJzdG9wUHJvcGFnYXRpb24iLCJhc3QiLCJGb290ZXIiLCJ0eXBlIiwiSW5mbyIsIk1haW4iLCJmaWx0ZXIiLCJzdGF0dXMiLCJzIiwibGlzdCIsIml0ZW0iLCJzaXplIiwibGkiLCJsZW5ndGgiLCJBTEwiLCJBQ1RJVkUiLCJDT01QTEVURUQiLCJhbm5vdGF0aW9ucyIsImNvbXBvbmVudCIsIm1ldGhvZCIsImRpcmVjdGl2ZSIsImNvbXB1dGVkIiwiVG9kbyIsInByb3BzIiwibGFzdFN0YXRlIiwibG9jYWxTdG9yYWdlIiwiZ2V0SXRlbSIsIkpTT04iLCJwYXJzZSIsImtleUNvZGUiLCJ2YWx1ZSIsInJlZnMiLCJpbnB1dCIsImFkZCIsInRvZG8iLCJ0b2RvTGlzdCIsImdldFN0YXRlIiwiaW5kZXgiLCJpbmRleE9mIiwic2V0U3RhdGUiLCJOdW1iZXIiLCJzbGljZSIsImRvbSIsInNldEl0ZW0iLCJzdHJpbmdpZnkiLCJJbmRleCIsIm1vdW50IiwiZG9jdW1lbnQiLCJxdWVyeVNlbGVjdG9yIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBO0lBQ3FCQTs7Ozs7Ozs7OztpQ0FDUjs7Ozs7RUFEdUJDLE1BQU1DOztBQ0QxQztJQUNxQkM7Ozs7Ozs7Ozs7OEJBQ1hDLFFBQU87bUJBQ0ZDLE9BQU9DLE1BQVAsQ0FBY0YsTUFBZCxFQUFxQjs4QkFDVixTQURVO2dDQUVSO2FBRmIsQ0FBUDs7OztpQ0FNSzs7Ozs7a0NBa0JDRyxPQUFPO2lCQUNSQyxJQUFMLENBQVUsU0FBVjtrQkFDTUMsZUFBTjs7Ozs7OzsrQkFJR0MsS0FBSzs7O0VBaENzQlQsTUFBTUM7O0FDRDVDO0lBQ3FCUzs7Ozs7Ozs7OztpQ0FDUjs7Ozs7c0NBYUtDLE1BQU07aUJBQ1hKLElBQUwsQ0FBVSxR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
