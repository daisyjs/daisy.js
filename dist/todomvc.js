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
                lastState = localStorage.getItem('todoState');
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidG9kb212Yy5qcyIsInNvdXJjZXMiOlsiLi4vc3JjL2NvbXBvbmVudHMvSGVhZGVyLmpzIiwiLi4vc3JjL2NvbXBvbmVudHMvVG9kby5qcyIsIi4uL3NyYy9jb21wb25lbnRzL0Zvb3Rlci5qcyIsIi4uL3NyYy9jb21wb25lbnRzL0luZm8uanMiLCIuLi9zcmMvY29tcG9uZW50cy9NYWluLmpzIiwiLi4vc3JjL21ldGhvZHMvZmlsdGVyLmpzIiwiLi4vc3JjL21ldGhvZHMvbGlzdC5qcyIsIi4uL3NyYy9tZXRob2RzL3NpemUuanMiLCIuLi9zcmMvY29tcG9uZW50cy9JbmRleC5qcyIsIi4uL3NyYy90b2RvbXZjLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZVxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgSGVhZGVyIGV4dGVuZHMgRGFpc3kuQ29tcG9uZW50IHtcbiAgICByZW5kZXIoKSB7XG4gICAgICAgIHJldHVybiBgPGhlYWRlciBjbGFzcz1cImhlYWRlclwiPlxuICAgICAgICAgICAgPGgxPnt7dG9kb3N9fTwvaDE+XG4gICAgICAgICAgICA8dGVtcGxhdGUgOmluY2x1ZGU9e3t0aGlzLmJvZHl9fT48L3RlbXBsYXRlPlxuICAgICAgICA8L2hlYWRlcj5gO1xuICAgIH1cbn0iLCIvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmVcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFRvZG9JdGVtIGV4dGVuZHMgRGFpc3kuQ29tcG9uZW50IHtcbiAgICBzdGF0ZShzdGF0ZSkge1xuICAgICAgICByZXR1cm4gT2JqZWN0LmFzc2lnbihzdGF0ZSwge1xuICAgICAgICAgICAgY2hlY2tlZENsYXNzOiAnY2hlY2tlZCcsXG4gICAgICAgICAgICB1bmNoZWNrZWRDbGFzczogJ3VuY2hlY2tlZCcsXG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHJlbmRlcigpIHtcbiAgICAgICAgcmV0dXJuIGBcbiAgICAgICAgICAgIDxsaSBjbGFzcz1cInRvZG8ge3shIXN0YXR1cyA/ICdjb21wbGV0ZWQnOiAnJ319XCI+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInZpZXdcIlxuICAgICAgICAgICAgICAgICAgICBAb25DbGljaz17e3RoaXMuZW1pdCgnY2xpY2snLCBuYW1lKX19XG4gICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cImNoZWNrYm94XCIgXG4gICAgICAgICAgICAgICAgICAgICAgICBjbGFzcz1cInRvZ2dsZVwiIFxuICAgICAgICAgICAgICAgICAgICAgICAgY2hlY2tlZD17eyEhc3RhdHVzfX0gXG4gICAgICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgICAgPGxhYmVsXG4gICAgICAgICAgICAgICAgICAgICAgICBjbGFzcz17e3N0YXR1cyA/IGNoZWNrZWRDbGFzcyA6IHVuY2hlY2tlZENsYXNzfX1cbiAgICAgICAgICAgICAgICAgICAgPnt7bmFtZX19PC9sYWJlbD4gPGJ1dHRvbiBjbGFzcz1cImRlc3Ryb3lcIiBAb25DbGljaz17e3RoaXMuZW1pdCgnZGVzdHJveScpfX0+PC9idXR0b24+ICAgIFxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwidGV4dFwiIGNsYXNzPVwiZWRpdFwiPlxuICAgICAgICAgICAgPC9saT5gO1xuICAgIH1cblxuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZVxuICAgIHBhcnNlZChhc3QpIHtcbiAgICB9XG59XG4iLCIvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmVcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEZvb3RlciBleHRlbmRzIERhaXN5LkNvbXBvbmVudHtcbiAgICByZW5kZXIoKSB7XG4gICAgICAgIHJldHVybiBgXG4gICAgICAgIDxmb290ZXIgY2xhc3M9XCJmb290ZXJcIj5cbiAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwidG9kby1jb3VudFwiPjxzdHJvbmc+e3tzaXplfX08L3N0cm9uZz4gaXRlbXMgbGVmdDwvc3Bhbj5cbiAgICAgICAgICAgIDx1bCBjbGFzcz1cImZpbHRlcnNcIj5cbiAgICAgICAgICAgICAgICA8bGkgOmZvcj17e3N0YXR1c0xpc3R9fT5cbiAgICAgICAgICAgICAgICAgICAgPGEgaHJlZj1cIiMvYWxsXCIgY2xhc3M9XCJ7e2l0ZW0udHlwZSA9PT0gc3RhdHVzPyAnc2VsZWN0ZWQnOiAnJ319XCIgQG9uQ2xpY2s9e3t0aGlzLm9uRmlsdGVyQ2xpY2soaXRlbS50eXBlKX19Pnt7aXRlbS5uYW1lfX08L2E+XG4gICAgICAgICAgICAgICAgPC9saT5cbiAgICAgICAgICAgIDwvdWw+XG4gICAgICAgICAgICA8YnV0dG9uIGNsYXNzPVwiY2xlYXItY29tcGxldGVkXCIgQG9uQ2xpY2s9e3t0aGlzLmVtaXQoJ2NsZWFyJyl9fT5DbGVhciBjb21wbGV0ZWQ8L2J1dHRvbj5cbiAgICAgICAgPC9mb290ZXI+YDtcbiAgICB9XG5cbiAgICBvbkZpbHRlckNsaWNrKHR5cGUpIHtcbiAgICAgICAgdGhpcy5lbWl0KCdjaGFuZ2UnLCB0eXBlKTtcbiAgICB9XG59IiwiLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBJbmZvIGV4dGVuZHMgRGFpc3kuQ29tcG9uZW50IHtcbiAgICByZW5kZXIoKSB7XG4gICAgICAgIHJldHVybiBgPGZvb3RlciBjbGFzcz1cImluZm9cIj5cblx0XHRcdDxwPkRvdWJsZS1jbGljayB0byBlZGl0IGEgdG9kbzwvcD5cblx0XHRcdDxwPldyaXR0ZW4gYnkgPGEgaHJlZj1cImh0dHA6Ly9ldmFueW91Lm1lXCI+RXZhbiBZb3U8L2E+PC9wPlxuXHRcdFx0PHA+UGFydCBvZiA8YSBocmVmPVwiaHR0cDovL3RvZG9tdmMuY29tXCI+VG9kb01WQzwvYT48L3A+XG5cdFx0PC9mb290ZXI+YDtcbiAgICB9XG59IiwiLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBNYWluIGV4dGVuZHMgRGFpc3kuQ29tcG9uZW50IHtcbiAgICByZW5kZXIoKSB7XG4gICAgICAgIHJldHVybiBgPHNlY3Rpb24gY2xhc3M9XCJtYWluXCI+PGlucHV0IHR5cGU9XCJjaGVja2JveFwiIGNsYXNzPVwidG9nZ2xlLWFsbFwiPiBcbiAgICAgICAgICAgIDx1bCBjbGFzcz1cInRvZG8tbGlzdFwiPlxuICAgICAgICAgICAgICAgIDx0ZW1wbGF0ZSA6aW5jbHVkZT17e3RoaXMuYm9keX19Lz5cbiAgICAgICAgICAgIDwvdWw+XG4gICAgICAgIDwvc2VjdGlvbj5gO1xuICAgIH1cbn0iLCJjb25zdCBmaWx0ZXIgPSAoc3RhdHVzLCBzKSA9PiAocyA9PT0gMiA/IHRydWUgOiAoc3RhdHVzID09PSBzKSk7XG5leHBvcnQgZGVmYXVsdCBmaWx0ZXI7IiwiaW1wb3J0IGZpbHRlciBmcm9tICcuL2ZpbHRlcic7XG5cbmNvbnN0IGxpc3QgPSAobGlzdCwgcykgPT4gbGlzdC5maWx0ZXIoaXRlbSA9PiBpdGVtLnN0YXR1cyA9PT0gcyk7XG5cbmV4cG9ydCBkZWZhdWx0IGxpc3Q7IiwiaW1wb3J0IGxpc3QgZnJvbSAnLi9saXN0JztcblxuY29uc3Qgc2l6ZSA9IChsaSwgcykgPT4gbGlzdChsaSwgcykubGVuZ3RoO1xuXG5leHBvcnQgZGVmYXVsdCBzaXplOyIsImltcG9ydCBIZWFkZXIgZnJvbSAnLi9IZWFkZXInO1xuaW1wb3J0IFRvZG8gZnJvbSAnLi9Ub2RvJztcbmltcG9ydCBGb290ZXIgZnJvbSAnLi9Gb290ZXInO1xuaW1wb3J0IEluZm8gZnJvbSAnLi9JbmZvJztcbmltcG9ydCBNYWluIGZyb20gJy4vTWFpbic7XG5pbXBvcnQgZmlsdGVyIGZyb20gJy4uL21ldGhvZHMvZmlsdGVyJztcbmltcG9ydCBsaXN0IGZyb20gJy4uL21ldGhvZHMvbGlzdCc7XG5pbXBvcnQgc2l6ZSBmcm9tICcuLi9tZXRob2RzL3NpemUnO1xuXG5jb25zdCBBTEwgPSAyO1x0XHRcbmNvbnN0IEFDVElWRSA9IDA7XHRcdFxuY29uc3QgQ09NUExFVEVEID0gMTtcblxuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lXG5jb25zdCB7Y29tcG9uZW50LCBtZXRob2QsIGRpcmVjdGl2ZSwgZXZlbnQsIGNvbXB1dGVkfSA9IERhaXN5LmFubm90YXRpb25zO1xuXG5AY29tcG9uZW50KHtUb2RvLCBIZWFkZXIsIEZvb3RlciwgSW5mbywgTWFpbn0pXG5AbWV0aG9kKHtmaWx0ZXIsIHNpemUsIGxpc3R9KVxuQGRpcmVjdGl2ZSgpXG5AZXZlbnQoKVxuQGNvbXB1dGVkKHsgXG4gICAgdG9kb3MoKSB7XG4gICAgICAgIHJldHVybiAndG9kb3MnO1xuICAgIH1cbn0pXG5cbi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZVxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ29tcG9uZW50IGV4dGVuZHMgRGFpc3kuQ29tcG9uZW50IHtcbiAgICBzdGF0ZShwcm9wcyA9IHt9KSB7XG4gICAgICAgIGxldCBsYXN0U3RhdGUgPSB7fTtcbiAgICAgICAgaWYgKGxvY2FsU3RvcmFnZS5nZXRJdGVtKCd0b2RvU3RhdGUnKSkge1xuICAgICAgICAgICAgbGFzdFN0YXRlID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oJ3RvZG9TdGF0ZScpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBPYmplY3QuYXNzaWduKHtcbiAgICAgICAgICAgIGhpc3Rvcnk6IFtdLFxuICAgICAgICAgICAgc3RhdHVzOiAyLFxuICAgICAgICAgICAgdG9kb0xpc3Q6IFtcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgICBhY3RpdmVTdGF0dXM6IEFDVElWRSxcbiAgICAgICAgICAgIHN0YXR1c0xpc3Q6IFtcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIG5hbWU6ICdBbGwnLFxuICAgICAgICAgICAgICAgICAgICB0eXBlOiBBTExcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogJ0FjdGl2ZScsXG4gICAgICAgICAgICAgICAgICAgIHR5cGU6IEFDVElWRVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBuYW1lOiAnY29tcGxldGVkJyxcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogQ09NUExFVEVEXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgXVxuICAgICAgICB9LCBwcm9wcywgbGFzdFN0YXRlKTtcbiAgICB9XG4gICAgcmVuZGVyKCkge1xuICAgICAgICByZXR1cm4gYDxzZWN0aW9uIGNsYXNzPVwidG9kb2FwcFwiPlxuICAgICAgICAgICAgPEhlYWRlclxuICAgICAgICAgICAgICAgIHRpdGxlPXt7dG9kb3N9fVxuICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgIDxpbnB1dFxuICAgICAgICAgICAgICAgICAgICBhdXRvZm9jdXM9XCJhdXRvZm9jdXNcIlxuICAgICAgICAgICAgICAgICAgICBhdXRvY29tcGxldGU9XCJvZmZcIlxuICAgICAgICAgICAgICAgICAgICBwbGFjZWhvbGRlcj1cIldoYXQgbmVlZHMgdG8gYmUgZG9uZT9cIlxuICAgICAgICAgICAgICAgICAgICBjbGFzcz1cIm5ldy10b2RvXCJcbiAgICAgICAgICAgICAgICAgICAgQG9uS2V5ZG93bj17e3RoaXMub25LZXlEb3duKCRldmVudCl9fVxuICAgICAgICAgICAgICAgICAgICBAcmVmPVwiaW5wdXRcIlxuICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgIDwvSGVhZGVyPlxuICAgICAgICAgICAgPE1haW4+XG4gICAgICAgICAgICAgICAgPFRvZG9cbiAgICAgICAgICAgICAgICAgICAgOmZvcj17e3RvZG9MaXN0fX1cbiAgICAgICAgICAgICAgICAgICAgOmlmPXt7ZmlsdGVyKGl0ZW0uc3RhdHVzLCBzdGF0dXMpfX1cbiAgICAgICAgICAgICAgICAgICAgbmFtZT17e2l0ZW0ubmFtZX19XG4gICAgICAgICAgICAgICAgICAgIHN0YXR1cz17e2l0ZW0uc3RhdHVzfX1cbiAgICAgICAgICAgICAgICAgICAgdG9kbz17e2l0ZW19fVxuICAgICAgICAgICAgICAgICAgICBAb25DbGljaz17e3RoaXMub25Ub2RvQ2xpY2soaXRlbSwgJGV2ZW50KX19XG4gICAgICAgICAgICAgICAgICAgIEBvbkRlc3Ryb3k9e3t0aGlzLm9uRGVzdHJveShpbmRleCl9fVxuICAgICAgICAgICAgICAgID48L1RvZG8+XG4gICAgICAgICAgICA8L01haW4+XG4gICAgICAgICAgICA8Rm9vdGVyXG4gICAgICAgICAgICAgICAgOmlmPXt7dG9kb0xpc3QubGVuZ3RoID4gMH19XG4gICAgICAgICAgICAgICAgc2l6ZT17e3NpemUodG9kb0xpc3QsIGFjdGl2ZVN0YXR1cyl9fVxuICAgICAgICAgICAgICAgIHN0YXR1cz17e3N0YXR1c319XG4gICAgICAgICAgICAgICAgc3RhdHVzTGlzdD17e3N0YXR1c0xpc3R9fVxuICAgICAgICAgICAgICAgIEBvbkNoYW5nZT17e3RoaXMub25TdGF0dXNDaGFuZ2UoJGV2ZW50KX19XG4gICAgICAgICAgICAgICAgQG9uQ2xlYXI9e3t0aGlzLm9uQ2xlYXIoKX19XG4gICAgICAgICAgICA+PC9Gb290ZXI+XG4gICAgICAgIDwvc2VjdGlvbj5gO1xuICAgIH1cbiAgICBcbiAgICBvbktleURvd24oe2tleUNvZGV9KSB7XG4gICAgICAgIGlmIChrZXlDb2RlID09PSAxMykge1xuICAgICAgICAgICAgY29uc3QgdmFsdWUgPSB0aGlzLnJlZnMuaW5wdXQudmFsdWU7XG4gICAgICAgICAgICB0aGlzLmFkZCh2YWx1ZSk7XG4gICAgICAgICAgICB0aGlzLnJlZnMuaW5wdXQudmFsdWUgPSAnJztcbiAgICAgICAgfVxuICAgIH1cblxuICAgIG9uVG9kb0NsaWNrKHRvZG8pIHtcbiAgICAgICAgY29uc3QgdG9kb0xpc3QgPSB0aGlzLmdldFN0YXRlKCkudG9kb0xpc3Q7XG4gICAgICAgIGNvbnN0IGluZGV4ID0gdG9kb0xpc3QuaW5kZXhPZih0b2RvKTtcbiAgICAgICAgXG4gICAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICAgICAgW2B0b2RvTGlzdC4ke2luZGV4fS5zdGF0dXNgXTogTnVtYmVyKCF0b2RvLnN0YXR1cylcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgb25EZXN0cm95KGluZGV4KSB7XG4gICAgICAgIGxldCB0b2RvTGlzdCA9IHRoaXMuZ2V0U3RhdGUoKS50b2RvTGlzdDtcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgICAgICB0b2RvTGlzdDogW1xuICAgICAgICAgICAgICAgIC4uLnRvZG9MaXN0LnNsaWNlKDAsIGluZGV4KSxcbiAgICAgICAgICAgICAgICAuLi50b2RvTGlzdC5zbGljZShpbmRleCsxKVxuICAgICAgICAgICAgXVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBhZGQodmFsdWUpIHtcbiAgICAgICAgY29uc3QgdG9kb0xpc3QgPSB0aGlzLmdldFN0YXRlKCkudG9kb0xpc3Q7XG4gICAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICAgICAgW2B0b2RvTGlzdC4ke3RvZG9MaXN0Lmxlbmd0aH1gXToge1xuICAgICAgICAgICAgICAgIG5hbWU6IHZhbHVlLFxuICAgICAgICAgICAgICAgIHN0YXR1czogMFxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBvblN0YXR1c0NoYW5nZShzdGF0dXMpIHtcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgICAgICBzdGF0dXNcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgb25DbGVhcigpIHtcbiAgICAgICAgY29uc3QgdG9kb0xpc3QgPSB0aGlzLmdldFN0YXRlKCkudG9kb0xpc3QuZmlsdGVyKChpdGVtKSA9PiAhaXRlbS5zdGF0dXMpO1xuICAgICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgICAgIHRvZG9MaXN0XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZVxuICAgIHBhcnNlZCgpIHtcbiAgICB9XG5cbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmVcbiAgICByZWFkeSgpIHtcbiAgICB9XG5cbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmVcbiAgICBtb3VudGVkKGRvbSkge1xuICAgIH1cblxuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZVxuICAgIHBhdGNoZWQoZG9tKSB7XG4gICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKCd0b2RvU3RhdGUnLCBcbiAgICAgICAgICAgIEpTT04uc3RyaW5naWZ5KFxuICAgICAgICAgICAgICAgIHRoaXMuZ2V0U3RhdGUoKVxuICAgICAgICAgICAgKVxuICAgICAgICApO1xuICAgIH1cblxuICAgIG9uUmVzZXQoKSB7XG4gICAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICAgICAgdG9kb0xpc3Q6IHRoaXMuc3RhdGUudG9kb0xpc3RcbiAgICAgICAgfSk7XG4gICAgfVxufSIsImltcG9ydCBJbmRleCBmcm9tICcuL2NvbXBvbmVudHMvSW5kZXgnO1xubmV3IEluZGV4KHtcbiAgICBzdGF0ZToge31cbn0pLm1vdW50KGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNhcHAnKSk7Il0sIm5hbWVzIjpbIkhlYWRlciIsIkRhaXN5IiwiQ29tcG9uZW50IiwiVG9kb0l0ZW0iLCJzdGF0ZSIsIk9iamVjdCIsImFzc2lnbiIsImFzdCIsIkZvb3RlciIsInR5cGUiLCJlbWl0IiwiSW5mbyIsIk1haW4iLCJmaWx0ZXIiLCJzdGF0dXMiLCJzIiwibGlzdCIsIml0ZW0iLCJzaXplIiwibGkiLCJsZW5ndGgiLCJBTEwiLCJBQ1RJVkUiLCJDT01QTEVURUQiLCJhbm5vdGF0aW9ucyIsImNvbXBvbmVudCIsIm1ldGhvZCIsImRpcmVjdGl2ZSIsImV2ZW50IiwiY29tcHV0ZWQiLCJUb2RvIiwicHJvcHMiLCJsYXN0U3RhdGUiLCJsb2NhbFN0b3JhZ2UiLCJnZXRJdGVtIiwia2V5Q29kZSIsInZhbHVlIiwicmVmcyIsImlucHV0IiwiYWRkIiwidG9kbyIsInRvZG9MaXN0IiwiZ2V0U3RhdGUiLCJpbmRleCIsImluZGV4T2YiLCJzZXRTdGF0ZSIsIk51bWJlciIsInNsaWNlIiwiZG9tIiwic2V0SXRlbSIsIkpTT04iLCJzdHJpbmdpZnkiLCJJbmRleCIsIm1vdW50IiwiZG9jdW1lbnQiLCJxdWVyeVNlbGVjdG9yIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBO0lBQ3FCQTs7Ozs7Ozs7OztpQ0FDUjs7Ozs7RUFEdUJDLE1BQU1DOztBQ0QxQztJQUNxQkM7Ozs7Ozs7Ozs7OEJBQ1hDLFFBQU87bUJBQ0ZDLE9BQU9DLE1BQVAsQ0FBY0YsTUFBZCxFQUFxQjs4QkFDVixTQURVO2dDQUVSO2FBRmIsQ0FBUDs7OztpQ0FNSzs7Ozs7Ozs7K0JBbUJGRyxLQUFLOzs7RUEzQnNCTixNQUFNQzs7QUNENUM7SUFDcUJNOzs7Ozs7Ozs7O2lDQUNSOzs7OztzQ0FhS0MsTUFBTTtpQkFDWEMsSUFBTCxDQUFVLFFBQVYsRUFBb0JELElBQXBCOzs7O0VBZjRCUixNQUFNQzs7QUNEMUM7SUFDcUJTOzs7Ozs7Ozs7O2lDQUNSOzs7OztFQURxQlYsTUFBTUM7O0FDRHhDO0lBQ3FCVTs7Ozs7Ozs7OztpQ0FDUjs7Ozs7RUFEcUJYLE1BQU1DOztBQ0R4QyxJQUFNVyxTQUFTLFNBQVRBLE1BQVMsQ0FBQ0MsTUFBRCxFQUFTQyxDQUFUO1NBQWdCQSxNQUFNLENBQU4sR0FBVSxJQUFWLEdBQWtCRCxXQUFXQyxDQUE3QztDQUFmOztBQ0VBLElBQU1DLE9BQU8sY0FBQ0EsS0FBRCxFQUFPRCxDQUFQO1NBQWFDLE1BQUtILE1BQUwsQ0FBWTtXQUFRSSxLQUFLSCxNQUFMLEtBQWdCQyxDQUF4QjtHQUFaLENBQWI7Q0FBYjs7QUNBQSxJQUFNRyxPQUFPLFNBQVBBLElBQU8sQ0FBQ0MsRUFBRCxFQUFLSixDQUFMO1NBQVdDLEtBQUtHLEVBQUwsRUFBU0osQ0FBVCxFQUFZSyxNQUF2QjtDQUFiOzs7Ozs7Ozs7QUNGQSxBQVNBLElBQU1DLE1BQU0sQ0FBWjtBQUNBLElBQU1DLFNBQVMsQ0FBZjtBQUNBLElBQU1DLFlBQVksQ0FBbEI7Ozt5QkFHd0R0QixNQUFNdUI7SUFBdkRDLCtCQUFBQTtJQUFXQyw0QkFBQUE7SUFBUUMsK0JBQUFBO0lBQVdDLDJCQUFBQTtJQUFPQyw4QkFBQUE7Ozs7SUFhdkIzQixvQkFYcEJ1QixVQUFVLEVBQUNLLGNBQUQsRUFBTzlCLGNBQVAsRUFBZVEsY0FBZixFQUF1QkcsVUFBdkIsRUFBNkJDLFVBQTdCLEVBQVYsV0FDQWMsT0FBTyxFQUFDYixjQUFELEVBQVNLLFVBQVQsRUFBZUYsVUFBZixFQUFQLFdBQ0FXLHFCQUNBQyxpQkFDQUMsU0FBUztTQUFBLG1CQUNFO2VBQ0csT0FBUDs7Q0FGUDs7Ozs7Ozs7OztnQ0FRcUI7Z0JBQVpFLEtBQVksdUVBQUosRUFBSTs7Z0JBQ1ZDLFlBQVksRUFBaEI7Z0JBQ0lDLGFBQWFDLE9BQWIsQ0FBcUIsV0FBckIsQ0FBSixFQUF1Qzs0QkFDdkJELGFBQWFDLE9BQWIsQ0FBcUIsV0FBckIsQ0FBWjs7bUJBRUc3QixPQUFPQyxNQUFQLENBQWM7eUJBQ1IsRUFEUTt3QkFFVCxDQUZTOzBCQUdQLEVBSE87OEJBS0hnQixNQUxHOzRCQU1MLENBQ1I7MEJBQ1UsS0FEVjswQkFFVUQ7aUJBSEYsRUFLUjswQkFDVSxRQURWOzBCQUVVQztpQkFQRixFQVNSOzBCQUNVLFdBRFY7MEJBRVVDO2lCQVhGO2FBTlQsRUFvQkpRLEtBcEJJLEVBb0JHQyxTQXBCSCxDQUFQOzs7O2lDQXNCSzs7Ozs7d0NBb0NZO2dCQUFWRyxPQUFVLFFBQVZBLE9BQVU7O2dCQUNiQSxZQUFZLEVBQWhCLEVBQW9CO29CQUNWQyxRQUFRLEtBQUtDLElBQUwsQ0FBVUMsS0FBVixDQUFnQkYsS0FBOUI7cUJBQ0tHLEdBQUwsQ0FBU0gsS0FBVDtxQkFDS0MsSUFBTCxDQUFVQyxLQUFWLENBQWdCRixLQUFoQixHQUF3QixFQUF4Qjs7Ozs7b0NBSUlJLE1BQU07Z0JBQ1JDLFdBQVcsS0FBS0MsUUFBTCxHQUFnQkQsUUFBakM7Z0JBQ01FLFFBQVFGLFNBQVNHLE9BQVQsQ0FBaUJKLElBQWpCLENBQWQ7O2lCQUVLSyxRQUFMLGtDQUNpQkYsS0FEakIsY0FDa0NHLE9BQU8sQ0FBQ04sS0FBSzFCLE1BQWIsQ0FEbEM7Ozs7a0NBS002QixPQUFPO2dCQUNURixXQUFXLEtBQUtDLFFBQUwsR0FBZ0JELFFBQS9CO2lCQUNLSSxRQUFMLENBQWM7c0RBRUhKLFNBQVNNLEtBQVQsQ0FBZSxDQUFmLEVBQWtCSixLQUFsQixDQURQLHFCQUVPRixTQUFTTSxLQUFULENBQWVKLFFBQU0sQ0FBckIsQ0FGUDthQURKOzs7OzRCQVFBUCxPQUFPO2dCQUNESyxXQUFXLEtBQUtDLFFBQUwsR0FBZ0JELFFBQWpDO2lCQUNLSSxRQUFMLGtDQUNpQkosU0FBU3JCLE1BRDFCLEVBQ3FDO3NCQUN2QmdCLEtBRHVCO3dCQUVyQjthQUhoQjs7Ozt1Q0FRV3RCLFFBQVE7aUJBQ2QrQixRQUFMLENBQWM7O2FBQWQ7Ozs7a0NBS007Z0JBQ0FKLFdBQVcsS0FBS0MsUUFBTCxHQUFnQkQsUUFBaEIsQ0FBeUI1QixNQUF6QixDQUFnQyxVQUFDSSxJQUFEO3VCQUFVLENBQUNBLEtBQUtILE1BQWhCO2FBQWhDLENBQWpCO2lCQUNLK0IsUUFBTCxDQUFjOzthQUFkOzs7Ozs7O2lDQU1LOzs7Ozs7Z0NBSUQ7Ozs7OztnQ0FJQUcsS0FBSzs7Ozs7O2dDQUlMQSxLQUFLO3lCQUNJQyxPQUFiLENBQXFCLFdBQXJCLEVBQ0lDLEtBQUtDLFNBQUwsQ0FDSSxLQUFLVCxRQUFMLEVBREosQ0FESjs7OztrQ0FPTTtpQkFDREcsUUFBTCxDQUFjOzBCQUNBLEtBQUt6QyxLQUFMLENBQVdxQzthQUR6Qjs7OztFQXhJK0J4QyxNQUFNQzs7QUMxQjdDLElBQUlrRCxTQUFKLENBQVU7V0FDQztDQURYLEVBRUdDLEtBRkgsQ0FFU0MsU0FBU0MsYUFBVCxDQUF1QixNQUF2QixDQUZUOzs7OyJ9
