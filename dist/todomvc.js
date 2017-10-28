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
            return '\n            <li class="todo {{!!status ? \'completed\': \'\'}}">\n                <div class="view"\n                    @onClick={{this.emit(\'click\', name)}}\n                >\n                    <input type="checkbox" \n                        class="toggle" \n                        checked={{!!status}} \n                    >\n                    <label\n                        class={{status ? checkedClass : uncheckedClass}}\n                    >{{name}}</label> <button class="destroy" @onClick={{this.emit(\'destroy\')}}></button>    \n                </div>\n                <input type="text" class="edit">\n            </li>';
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

            if (localStorage.getItem('todoState')) {
                return JSON.parse(localStorage.getItem('todoState'));
            }
            return Object.assign({
                history: [],
                status: 2,
                todoList: [],
                statusList: [{
                    name: 'All',
                    type: 2
                }, {
                    name: 'Active',
                    type: 0
                }, {
                    name: 'completed',
                    type: 1
                }]
            }, props);
        }
    }, {
        key: 'render',
        value: function render() {
            return '<section class="todoapp">\n            <Header\n                title={{todos}}\n            >\n                <input\n                    autofocus="autofocus"\n                    autocomplete="off"\n                    placeholder="What needs to be done?"\n                    class="new-todo"\n                    @onKeydown={{this.onKeyDown($event)}}\n                    @ref="input"\n                >\n            </Header>\n            <Main>\n                <Todo\n                    :for={{todoList}}\n                    :if={{filter(item.status, status)}}\n                    name={{item.name}}\n                    status={{item.status}}\n                    todo={{item}}\n                    @onClick={{this.onTodoClick(item, $event)}}\n                    @onDestroy={{this.onDestroy(index)}}\n                ></Todo>\n            </Main>\n            <Footer\n                :if={{todoList.length > 0}}\n                size={{size(todoList, status)}}\n                status={{status}}\n                statusList={{statusList}}\n                @onChange={{this.onStatusChange($event)}}\n                @onClear={{this.onClear()}}\n            ></Footer>\n        </section>';
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidG9kb212Yy5qcyIsInNvdXJjZXMiOlsiLi4vc3JjL2NvbXBvbmVudHMvSGVhZGVyLmpzIiwiLi4vc3JjL2NvbXBvbmVudHMvVG9kby5qcyIsIi4uL3NyYy9jb21wb25lbnRzL0Zvb3Rlci5qcyIsIi4uL3NyYy9jb21wb25lbnRzL0luZm8uanMiLCIuLi9zcmMvY29tcG9uZW50cy9NYWluLmpzIiwiLi4vc3JjL21ldGhvZHMvZmlsdGVyLmpzIiwiLi4vc3JjL21ldGhvZHMvbGlzdC5qcyIsIi4uL3NyYy9tZXRob2RzL3NpemUuanMiLCIuLi9zcmMvY29tcG9uZW50cy9JbmRleC5qcyIsIi4uL3NyYy90b2RvbXZjLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZVxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgSGVhZGVyIGV4dGVuZHMgRGFpc3kuQ29tcG9uZW50IHtcbiAgICByZW5kZXIoKSB7XG4gICAgICAgIHJldHVybiBgPGhlYWRlciBjbGFzcz1cImhlYWRlclwiPlxuICAgICAgICAgICAgPGgxPnt7dG9kb3N9fTwvaDE+XG4gICAgICAgICAgICA8dGVtcGxhdGUgOmluY2x1ZGU9e3t0aGlzLmJvZHl9fT48L3RlbXBsYXRlPlxuICAgICAgICA8L2hlYWRlcj5gO1xuICAgIH1cbn0iLCIvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmVcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFRvZG9JdGVtIGV4dGVuZHMgRGFpc3kuQ29tcG9uZW50IHtcbiAgICBzdGF0ZShzdGF0ZSkge1xuICAgICAgICByZXR1cm4gT2JqZWN0LmFzc2lnbihzdGF0ZSwge1xuICAgICAgICAgICAgY2hlY2tlZENsYXNzOiAnY2hlY2tlZCcsXG4gICAgICAgICAgICB1bmNoZWNrZWRDbGFzczogJ3VuY2hlY2tlZCcsXG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHJlbmRlcigpIHtcbiAgICAgICAgcmV0dXJuIGBcbiAgICAgICAgICAgIDxsaSBjbGFzcz1cInRvZG8ge3shIXN0YXR1cyA/ICdjb21wbGV0ZWQnOiAnJ319XCI+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInZpZXdcIlxuICAgICAgICAgICAgICAgICAgICBAb25DbGljaz17e3RoaXMuZW1pdCgnY2xpY2snLCBuYW1lKX19XG4gICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cImNoZWNrYm94XCIgXG4gICAgICAgICAgICAgICAgICAgICAgICBjbGFzcz1cInRvZ2dsZVwiIFxuICAgICAgICAgICAgICAgICAgICAgICAgY2hlY2tlZD17eyEhc3RhdHVzfX0gXG4gICAgICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgICAgPGxhYmVsXG4gICAgICAgICAgICAgICAgICAgICAgICBjbGFzcz17e3N0YXR1cyA/IGNoZWNrZWRDbGFzcyA6IHVuY2hlY2tlZENsYXNzfX1cbiAgICAgICAgICAgICAgICAgICAgPnt7bmFtZX19PC9sYWJlbD4gPGJ1dHRvbiBjbGFzcz1cImRlc3Ryb3lcIiBAb25DbGljaz17e3RoaXMuZW1pdCgnZGVzdHJveScpfX0+PC9idXR0b24+ICAgIFxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwidGV4dFwiIGNsYXNzPVwiZWRpdFwiPlxuICAgICAgICAgICAgPC9saT5gO1xuICAgIH1cblxuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZVxuICAgIHBhcnNlZChhc3QpIHtcbiAgICB9XG59XG4iLCIvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmVcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEZvb3RlciBleHRlbmRzIERhaXN5LkNvbXBvbmVudHtcbiAgICByZW5kZXIoKSB7XG4gICAgICAgIHJldHVybiBgXG4gICAgICAgIDxmb290ZXIgY2xhc3M9XCJmb290ZXJcIj5cbiAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwidG9kby1jb3VudFwiPjxzdHJvbmc+e3tzaXplfX08L3N0cm9uZz4gaXRlbXMgbGVmdDwvc3Bhbj5cbiAgICAgICAgICAgIDx1bCBjbGFzcz1cImZpbHRlcnNcIj5cbiAgICAgICAgICAgICAgICA8bGkgOmZvcj17e3N0YXR1c0xpc3R9fT5cbiAgICAgICAgICAgICAgICAgICAgPGEgaHJlZj1cIiMvYWxsXCIgY2xhc3M9XCJ7e2l0ZW0udHlwZSA9PT0gc3RhdHVzPyAnc2VsZWN0ZWQnOiAnJ319XCIgQG9uQ2xpY2s9e3t0aGlzLm9uRmlsdGVyQ2xpY2soaXRlbS50eXBlKX19Pnt7aXRlbS5uYW1lfX08L2E+XG4gICAgICAgICAgICAgICAgPC9saT5cbiAgICAgICAgICAgIDwvdWw+XG4gICAgICAgICAgICA8YnV0dG9uIGNsYXNzPVwiY2xlYXItY29tcGxldGVkXCIgQG9uQ2xpY2s9e3t0aGlzLmVtaXQoJ2NsZWFyJyl9fT5DbGVhciBjb21wbGV0ZWQ8L2J1dHRvbj5cbiAgICAgICAgPC9mb290ZXI+YDtcbiAgICB9XG5cbiAgICBvbkZpbHRlckNsaWNrKHR5cGUpIHtcbiAgICAgICAgdGhpcy5lbWl0KCdjaGFuZ2UnLCB0eXBlKTtcbiAgICB9XG59IiwiLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBJbmZvIGV4dGVuZHMgRGFpc3kuQ29tcG9uZW50IHtcbiAgICByZW5kZXIoKSB7XG4gICAgICAgIHJldHVybiBgPGZvb3RlciBjbGFzcz1cImluZm9cIj5cblx0XHRcdDxwPkRvdWJsZS1jbGljayB0byBlZGl0IGEgdG9kbzwvcD5cblx0XHRcdDxwPldyaXR0ZW4gYnkgPGEgaHJlZj1cImh0dHA6Ly9ldmFueW91Lm1lXCI+RXZhbiBZb3U8L2E+PC9wPlxuXHRcdFx0PHA+UGFydCBvZiA8YSBocmVmPVwiaHR0cDovL3RvZG9tdmMuY29tXCI+VG9kb01WQzwvYT48L3A+XG5cdFx0PC9mb290ZXI+YDtcbiAgICB9XG59IiwiLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBNYWluIGV4dGVuZHMgRGFpc3kuQ29tcG9uZW50IHtcbiAgICByZW5kZXIoKSB7XG4gICAgICAgIHJldHVybiBgPHNlY3Rpb24gY2xhc3M9XCJtYWluXCI+PGlucHV0IHR5cGU9XCJjaGVja2JveFwiIGNsYXNzPVwidG9nZ2xlLWFsbFwiPiBcbiAgICAgICAgICAgIDx1bCBjbGFzcz1cInRvZG8tbGlzdFwiPlxuICAgICAgICAgICAgICAgIDx0ZW1wbGF0ZSA6aW5jbHVkZT17e3RoaXMuYm9keX19Lz5cbiAgICAgICAgICAgIDwvdWw+XG4gICAgICAgIDwvc2VjdGlvbj5gO1xuICAgIH1cbn0iLCJjb25zdCBmaWx0ZXIgPSAoc3RhdHVzLCBzKSA9PiAocyA9PT0gMiA/IHRydWUgOiAoc3RhdHVzID09PSBzKSk7XG5leHBvcnQgZGVmYXVsdCBmaWx0ZXI7IiwiaW1wb3J0IGZpbHRlciBmcm9tICcuL2ZpbHRlcic7XG5cbmNvbnN0IGxpc3QgPSAobGlzdCwgcykgPT4gbGlzdC5maWx0ZXIoaXRlbSA9PiBpdGVtLnN0YXR1cyA9PT0gcyk7XG5cbmV4cG9ydCBkZWZhdWx0IGxpc3Q7IiwiaW1wb3J0IGxpc3QgZnJvbSAnLi9saXN0JztcblxuY29uc3Qgc2l6ZSA9IChsaSwgcykgPT4gbGlzdChsaSwgcykubGVuZ3RoO1xuXG5leHBvcnQgZGVmYXVsdCBzaXplOyIsImltcG9ydCBIZWFkZXIgZnJvbSAnLi9IZWFkZXInO1xuaW1wb3J0IFRvZG8gZnJvbSAnLi9Ub2RvJztcbmltcG9ydCBGb290ZXIgZnJvbSAnLi9Gb290ZXInO1xuaW1wb3J0IEluZm8gZnJvbSAnLi9JbmZvJztcbmltcG9ydCBNYWluIGZyb20gJy4vTWFpbic7XG5pbXBvcnQgZmlsdGVyIGZyb20gJy4uL21ldGhvZHMvZmlsdGVyJztcbmltcG9ydCBsaXN0IGZyb20gJy4uL21ldGhvZHMvbGlzdCc7XG5pbXBvcnQgc2l6ZSBmcm9tICcuLi9tZXRob2RzL3NpemUnO1xuXG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmVcbmNvbnN0IHtjb21wb25lbnQsIG1ldGhvZCwgZGlyZWN0aXZlLCBldmVudCwgY29tcHV0ZWR9ID0gRGFpc3kuYW5ub3RhdGlvbnM7XG5cbkBjb21wb25lbnQoe1RvZG8sIEhlYWRlciwgRm9vdGVyLCBJbmZvLCBNYWlufSlcbkBtZXRob2Qoe2ZpbHRlciwgc2l6ZSwgbGlzdH0pXG5AZGlyZWN0aXZlKClcbkBldmVudCgpXG5AY29tcHV0ZWQoeyBcbiAgICB0b2RvcygpIHtcbiAgICAgICAgcmV0dXJuICd0b2Rvcyc7XG4gICAgfVxufSlcblxuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDb21wb25lbnQgZXh0ZW5kcyBEYWlzeS5Db21wb25lbnQge1xuICAgIHN0YXRlKHByb3BzID0ge30pIHtcbiAgICAgICAgaWYgKGxvY2FsU3RvcmFnZS5nZXRJdGVtKCd0b2RvU3RhdGUnKSkge1xuICAgICAgICAgICAgcmV0dXJuIEpTT04ucGFyc2UoXG4gICAgICAgICAgICAgICAgbG9jYWxTdG9yYWdlLmdldEl0ZW0oJ3RvZG9TdGF0ZScpXG4gICAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBPYmplY3QuYXNzaWduKHtcbiAgICAgICAgICAgIGhpc3Rvcnk6IFtdLFxuICAgICAgICAgICAgc3RhdHVzOiAyLFxuICAgICAgICAgICAgdG9kb0xpc3Q6IFtcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgICBzdGF0dXNMaXN0OiBbXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBuYW1lOiAnQWxsJyxcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogMlxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBuYW1lOiAnQWN0aXZlJyxcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogMFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBuYW1lOiAnY29tcGxldGVkJyxcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogMVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF1cbiAgICAgICAgfSwgcHJvcHMpO1xuICAgIH1cbiAgICByZW5kZXIoKSB7XG4gICAgICAgIHJldHVybiBgPHNlY3Rpb24gY2xhc3M9XCJ0b2RvYXBwXCI+XG4gICAgICAgICAgICA8SGVhZGVyXG4gICAgICAgICAgICAgICAgdGl0bGU9e3t0b2Rvc319XG4gICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgPGlucHV0XG4gICAgICAgICAgICAgICAgICAgIGF1dG9mb2N1cz1cImF1dG9mb2N1c1wiXG4gICAgICAgICAgICAgICAgICAgIGF1dG9jb21wbGV0ZT1cIm9mZlwiXG4gICAgICAgICAgICAgICAgICAgIHBsYWNlaG9sZGVyPVwiV2hhdCBuZWVkcyB0byBiZSBkb25lP1wiXG4gICAgICAgICAgICAgICAgICAgIGNsYXNzPVwibmV3LXRvZG9cIlxuICAgICAgICAgICAgICAgICAgICBAb25LZXlkb3duPXt7dGhpcy5vbktleURvd24oJGV2ZW50KX19XG4gICAgICAgICAgICAgICAgICAgIEByZWY9XCJpbnB1dFwiXG4gICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgPC9IZWFkZXI+XG4gICAgICAgICAgICA8TWFpbj5cbiAgICAgICAgICAgICAgICA8VG9kb1xuICAgICAgICAgICAgICAgICAgICA6Zm9yPXt7dG9kb0xpc3R9fVxuICAgICAgICAgICAgICAgICAgICA6aWY9e3tmaWx0ZXIoaXRlbS5zdGF0dXMsIHN0YXR1cyl9fVxuICAgICAgICAgICAgICAgICAgICBuYW1lPXt7aXRlbS5uYW1lfX1cbiAgICAgICAgICAgICAgICAgICAgc3RhdHVzPXt7aXRlbS5zdGF0dXN9fVxuICAgICAgICAgICAgICAgICAgICB0b2RvPXt7aXRlbX19XG4gICAgICAgICAgICAgICAgICAgIEBvbkNsaWNrPXt7dGhpcy5vblRvZG9DbGljayhpdGVtLCAkZXZlbnQpfX1cbiAgICAgICAgICAgICAgICAgICAgQG9uRGVzdHJveT17e3RoaXMub25EZXN0cm95KGluZGV4KX19XG4gICAgICAgICAgICAgICAgPjwvVG9kbz5cbiAgICAgICAgICAgIDwvTWFpbj5cbiAgICAgICAgICAgIDxGb290ZXJcbiAgICAgICAgICAgICAgICA6aWY9e3t0b2RvTGlzdC5sZW5ndGggPiAwfX1cbiAgICAgICAgICAgICAgICBzaXplPXt7c2l6ZSh0b2RvTGlzdCwgc3RhdHVzKX19XG4gICAgICAgICAgICAgICAgc3RhdHVzPXt7c3RhdHVzfX1cbiAgICAgICAgICAgICAgICBzdGF0dXNMaXN0PXt7c3RhdHVzTGlzdH19XG4gICAgICAgICAgICAgICAgQG9uQ2hhbmdlPXt7dGhpcy5vblN0YXR1c0NoYW5nZSgkZXZlbnQpfX1cbiAgICAgICAgICAgICAgICBAb25DbGVhcj17e3RoaXMub25DbGVhcigpfX1cbiAgICAgICAgICAgID48L0Zvb3Rlcj5cbiAgICAgICAgPC9zZWN0aW9uPmA7XG4gICAgfVxuICAgIFxuICAgIG9uS2V5RG93bih7a2V5Q29kZX0pIHtcbiAgICAgICAgaWYgKGtleUNvZGUgPT09IDEzKSB7XG4gICAgICAgICAgICBjb25zdCB2YWx1ZSA9IHRoaXMucmVmcy5pbnB1dC52YWx1ZTtcbiAgICAgICAgICAgIHRoaXMuYWRkKHZhbHVlKTtcbiAgICAgICAgICAgIHRoaXMucmVmcy5pbnB1dC52YWx1ZSA9ICcnO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgb25Ub2RvQ2xpY2sodG9kbykge1xuICAgICAgICBjb25zdCB0b2RvTGlzdCA9IHRoaXMuZ2V0U3RhdGUoKS50b2RvTGlzdDtcbiAgICAgICAgY29uc3QgaW5kZXggPSB0b2RvTGlzdC5pbmRleE9mKHRvZG8pO1xuICAgICAgICBcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgICAgICBbYHRvZG9MaXN0LiR7aW5kZXh9LnN0YXR1c2BdOiBOdW1iZXIoIXRvZG8uc3RhdHVzKVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBvbkRlc3Ryb3koaW5kZXgpIHtcbiAgICAgICAgbGV0IHRvZG9MaXN0ID0gdGhpcy5nZXRTdGF0ZSgpLnRvZG9MaXN0O1xuICAgICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgICAgIHRvZG9MaXN0OiBbXG4gICAgICAgICAgICAgICAgLi4udG9kb0xpc3Quc2xpY2UoMCwgaW5kZXgpLFxuICAgICAgICAgICAgICAgIC4uLnRvZG9MaXN0LnNsaWNlKGluZGV4KzEpXG4gICAgICAgICAgICBdXG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGFkZCh2YWx1ZSkge1xuICAgICAgICBjb25zdCB0b2RvTGlzdCA9IHRoaXMuZ2V0U3RhdGUoKS50b2RvTGlzdDtcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgICAgICBbYHRvZG9MaXN0LiR7dG9kb0xpc3QubGVuZ3RofWBdOiB7XG4gICAgICAgICAgICAgICAgbmFtZTogdmFsdWUsXG4gICAgICAgICAgICAgICAgc3RhdHVzOiAwXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIG9uU3RhdHVzQ2hhbmdlKHN0YXR1cykge1xuICAgICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgICAgIHN0YXR1c1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBvbkNsZWFyKCkge1xuICAgICAgICBjb25zdCB0b2RvTGlzdCA9IHRoaXMuZ2V0U3RhdGUoKS50b2RvTGlzdC5maWx0ZXIoKGl0ZW0pID0+ICFpdGVtLnN0YXR1cyk7XG4gICAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICAgICAgdG9kb0xpc3RcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lXG4gICAgcGFyc2VkKCkge1xuICAgIH1cblxuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZVxuICAgIHJlYWR5KCkge1xuICAgIH1cblxuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZVxuICAgIG1vdW50ZWQoZG9tKSB7XG4gICAgfVxuXG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lXG4gICAgcGF0Y2hlZChkb20pIHtcbiAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ3RvZG9TdGF0ZScsIFxuICAgICAgICAgICAgSlNPTi5zdHJpbmdpZnkoXG4gICAgICAgICAgICAgICAgdGhpcy5nZXRTdGF0ZSgpXG4gICAgICAgICAgICApXG4gICAgICAgICk7XG4gICAgfVxuXG4gICAgb25SZXNldCgpIHtcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgICAgICB0b2RvTGlzdDogdGhpcy5zdGF0ZS50b2RvTGlzdFxuICAgICAgICB9KTtcbiAgICB9XG59IiwiaW1wb3J0IEluZGV4IGZyb20gJy4vY29tcG9uZW50cy9JbmRleCc7XG5uZXcgSW5kZXgoe1xuICAgIHN0YXRlOiB7fVxufSkubW91bnQoZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2FwcCcpKTsiXSwibmFtZXMiOlsiSGVhZGVyIiwiRGFpc3kiLCJDb21wb25lbnQiLCJUb2RvSXRlbSIsInN0YXRlIiwiT2JqZWN0IiwiYXNzaWduIiwiYXN0IiwiRm9vdGVyIiwidHlwZSIsImVtaXQiLCJJbmZvIiwiTWFpbiIsImZpbHRlciIsInN0YXR1cyIsInMiLCJsaXN0IiwiaXRlbSIsInNpemUiLCJsaSIsImxlbmd0aCIsImFubm90YXRpb25zIiwiY29tcG9uZW50IiwibWV0aG9kIiwiZGlyZWN0aXZlIiwiZXZlbnQiLCJjb21wdXRlZCIsIlRvZG8iLCJwcm9wcyIsImxvY2FsU3RvcmFnZSIsImdldEl0ZW0iLCJKU09OIiwicGFyc2UiLCJrZXlDb2RlIiwidmFsdWUiLCJyZWZzIiwiaW5wdXQiLCJhZGQiLCJ0b2RvIiwidG9kb0xpc3QiLCJnZXRTdGF0ZSIsImluZGV4IiwiaW5kZXhPZiIsInNldFN0YXRlIiwiTnVtYmVyIiwic2xpY2UiLCJkb20iLCJzZXRJdGVtIiwic3RyaW5naWZ5IiwiSW5kZXgiLCJtb3VudCIsImRvY3VtZW50IiwicXVlcnlTZWxlY3RvciJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTtJQUNxQkE7Ozs7Ozs7Ozs7aUNBQ1I7Ozs7O0VBRHVCQyxNQUFNQzs7QUNEMUM7SUFDcUJDOzs7Ozs7Ozs7OzhCQUNYQyxRQUFPO21CQUNGQyxPQUFPQyxNQUFQLENBQWNGLE1BQWQsRUFBcUI7OEJBQ1YsU0FEVTtnQ0FFUjthQUZiLENBQVA7Ozs7aUNBTUs7Ozs7Ozs7OytCQW1CRkcsS0FBSzs7O0VBM0JzQk4sTUFBTUM7O0FDRDVDO0lBQ3FCTTs7Ozs7Ozs7OztpQ0FDUjs7Ozs7c0NBYUtDLE1BQU07aUJBQ1hDLElBQUwsQ0FBVSxRQUFWLEVBQW9CRCxJQUFwQjs7OztFQWY0QlIsTUFBTUM7O0FDRDFDO0lBQ3FCUzs7Ozs7Ozs7OztpQ0FDUjs7Ozs7RUFEcUJWLE1BQU1DOztBQ0R4QztJQUNxQlU7Ozs7Ozs7Ozs7aUNBQ1I7Ozs7O0VBRHFCWCxNQUFNQzs7QUNEeEMsSUFBTVcsU0FBUyxTQUFUQSxNQUFTLENBQUNDLE1BQUQsRUFBU0MsQ0FBVDtTQUFnQkEsTUFBTSxDQUFOLEdBQVUsSUFBVixHQUFrQkQsV0FBV0MsQ0FBN0M7Q0FBZjs7QUNFQSxJQUFNQyxPQUFPLGNBQUNBLEtBQUQsRUFBT0QsQ0FBUDtTQUFhQyxNQUFLSCxNQUFMLENBQVk7V0FBUUksS0FBS0gsTUFBTCxLQUFnQkMsQ0FBeEI7R0FBWixDQUFiO0NBQWI7O0FDQUEsSUFB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
