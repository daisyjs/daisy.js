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







var get = function get(object, property, receiver) {
  if (object === null) object = Function.prototype;
  var desc = Object.getOwnPropertyDescriptor(object, property);

  if (desc === undefined) {
    var parent = Object.getPrototypeOf(object);

    if (parent === null) {
      return undefined;
    } else {
      return get(parent, property, receiver);
    }
  } else if ("value" in desc) {
    return desc.value;
  } else {
    var getter = desc.get;

    if (getter === undefined) {
      return undefined;
    }

    return getter.call(receiver);
  }
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
        key: "render",
        value: function render() {
            return "\n            <li class=\"todo {{!!status ? 'completed': ''}}\">\n                <div class=\"view\">\n                    <input type=\"checkbox\" \n                        class=\"toggle\" \n                        checked={{!!status}} \n                        @on-click={{this.emit('click', name)}}\n                    >\n                    <label>{{name}}</label> <button class=\"destroy\" @on-click={{this.emit('destroy')}}></button>    \n                </div>\n                <input type=\"text\" class=\"edit\">\n            </li>";
        }

        // eslint-disable-next-line

    }, {
        key: "parsed",
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
            return '\n        <footer class="footer">\n            <span class="todo-count"><strong>{{size}}</strong> items left</span>\n            <ul class="filters">\n                <li :for={{statusList}}>\n                    <a href="#/all" class="{{item.type === status? \'selected\': \'\'}}" @on-click={{this.onFilterClick(item.type)}}>{{item.name}}</a>\n                </li>\n            </ul>\n            <button class="clear-completed" @on-click={{this.emit(\'clear\')}}>Clear completed</button>\n        </footer>';
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
    return filter(item.status, s);
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
    createClass(Component, [{
        key: 'state',
        value: function state() {
            return Object.assign(get(Component.prototype.__proto__ || Object.getPrototypeOf(Component.prototype), 'state', this).call(this), {
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
            });
        }
    }, {
        key: 'render',
        value: function render() {
            return '<section class="todoapp">\n            <Header\n                title={{todos}}\n            >\n                <input\n                    autofocus="autofocus"\n                    autocomplete="off"\n                    placeholder="What needs to be done?"\n                    class="new-todo"\n                    @on-keydown={{this.onKeyDown($event)}}\n                    @ref="input"\n                >\n            </Header>\n            <Main>\n                <Todo\n                    :for={{todoList}}\n                    :if={{filter(item.status, status)}}\n                    name={{item.name}}\n                    status={{item.status}}\n                    @on-click={{this.onTodoClick(item, $event)}}\n                    @on-destroy={{this.onDestroy(index)}}\n                ></Todo>\n            </Main>\n            <Footer\n                :if={{todoList.length > 0}}\n                size={{size(todoList, status)}}\n                status={{status}}\n                statusList={{statusList}}\n                @on-change={{this.onStatusChange($event)}}\n                @on-clear={{this.onClear()}}\n            ></Footer>\n        </section>';
        }
    }]);

    function Component(options) {
        classCallCheck(this, Component);

        var _this = possibleConstructorReturn(this, (Component.__proto__ || Object.getPrototypeOf(Component)).call(this, options));

        _this.on('deleted', function (msg) {
            // eslint-disable-next-line
            console.log('deleted: ' + msg.name);
        });
        return _this;
    }

    createClass(Component, [{
        key: 'onKeyDown',
        value: function onKeyDown(_ref) {
            var keyCode = _ref.keyCode;

            if (keyCode === 13) {
                var value = this.refs.input.value;
                this.add(value);
            }
        }
    }, {
        key: 'onTodoClick',
        value: function onTodoClick(todo) {
            var todoList = this.getState().todoList;
            var index = todoList.indexOf(todoList.filter(function (_ref2) {
                var name = _ref2.name;
                return name === todo.name;
            })[0]);

            this.setState({
                todoList: [].concat(toConsumableArray(todoList.slice(0, index)), [Object.assign({}, todo, {
                    status: Number(!todo.status)
                })], toConsumableArray(todoList.slice(index + 1)))
            });
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
            this.setState({
                todoList: [].concat(toConsumableArray(todoList), [{
                    name: value,
                    status: 0
                }])
            });
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
            var todoList = this.getState().todoList;

            this.setState({
                todoList: todoList.map(function (item) {
                    return Object.assign({}, item, { status: 0 });
                })
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
        value: function patched(dom) {}
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidG9kb212Yy5qcyIsInNvdXJjZXMiOlsiLi4vc3JjL2NvbXBvbmVudHMvSGVhZGVyLmpzIiwiLi4vc3JjL2NvbXBvbmVudHMvVG9kby5qcyIsIi4uL3NyYy9jb21wb25lbnRzL0Zvb3Rlci5qcyIsIi4uL3NyYy9jb21wb25lbnRzL0luZm8uanMiLCIuLi9zcmMvY29tcG9uZW50cy9NYWluLmpzIiwiLi4vc3JjL21ldGhvZHMvZmlsdGVyLmpzIiwiLi4vc3JjL21ldGhvZHMvbGlzdC5qcyIsIi4uL3NyYy9tZXRob2RzL3NpemUuanMiLCIuLi9zcmMvY29tcG9uZW50cy9JbmRleC5qcyIsIi4uL3NyYy90b2RvbXZjLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZVxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgSGVhZGVyIGV4dGVuZHMgRGFpc3kuQ29tcG9uZW50IHtcclxuICAgIHJlbmRlcigpIHtcbiAgICAgICAgcmV0dXJuIGA8aGVhZGVyIGNsYXNzPVwiaGVhZGVyXCI+XG4gICAgICAgICAgICA8aDE+e3t0b2Rvc319PC9oMT5cbiAgICAgICAgICAgIDx0ZW1wbGF0ZSA6aW5jbHVkZT17e3RoaXMuYm9keX19PjwvdGVtcGxhdGU+XG4gICAgICAgIDwvaGVhZGVyPmA7XG4gICAgfVxufSIsIi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZVxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVG9kb0l0ZW0gZXh0ZW5kcyBEYWlzeS5Db21wb25lbnQge1xyXG4gICAgcmVuZGVyKCkge1xuICAgICAgICByZXR1cm4gYFxuICAgICAgICAgICAgPGxpIGNsYXNzPVwidG9kbyB7eyEhc3RhdHVzID8gJ2NvbXBsZXRlZCc6ICcnfX1cIj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwidmlld1wiPlxuICAgICAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cImNoZWNrYm94XCIgXG4gICAgICAgICAgICAgICAgICAgICAgICBjbGFzcz1cInRvZ2dsZVwiIFxuICAgICAgICAgICAgICAgICAgICAgICAgY2hlY2tlZD17eyEhc3RhdHVzfX0gXG4gICAgICAgICAgICAgICAgICAgICAgICBAb24tY2xpY2s9e3t0aGlzLmVtaXQoJ2NsaWNrJywgbmFtZSl9fVxuICAgICAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICAgIDxsYWJlbD57e25hbWV9fTwvbGFiZWw+IDxidXR0b24gY2xhc3M9XCJkZXN0cm95XCIgQG9uLWNsaWNrPXt7dGhpcy5lbWl0KCdkZXN0cm95Jyl9fT48L2J1dHRvbj4gICAgXG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJ0ZXh0XCIgY2xhc3M9XCJlZGl0XCI+XG4gICAgICAgICAgICA8L2xpPmA7XG4gICAgfVxuXG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lXG4gICAgcGFyc2VkKGFzdCkge1xyXG4gICAgfVxufVxuIiwiLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBGb290ZXIgZXh0ZW5kcyBEYWlzeS5Db21wb25lbnR7XHJcbiAgICByZW5kZXIoKSB7XG4gICAgICAgIHJldHVybiBgXG4gICAgICAgIDxmb290ZXIgY2xhc3M9XCJmb290ZXJcIj5cbiAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwidG9kby1jb3VudFwiPjxzdHJvbmc+e3tzaXplfX08L3N0cm9uZz4gaXRlbXMgbGVmdDwvc3Bhbj5cbiAgICAgICAgICAgIDx1bCBjbGFzcz1cImZpbHRlcnNcIj5cbiAgICAgICAgICAgICAgICA8bGkgOmZvcj17e3N0YXR1c0xpc3R9fT5cbiAgICAgICAgICAgICAgICAgICAgPGEgaHJlZj1cIiMvYWxsXCIgY2xhc3M9XCJ7e2l0ZW0udHlwZSA9PT0gc3RhdHVzPyAnc2VsZWN0ZWQnOiAnJ319XCIgQG9uLWNsaWNrPXt7dGhpcy5vbkZpbHRlckNsaWNrKGl0ZW0udHlwZSl9fT57e2l0ZW0ubmFtZX19PC9hPlxuICAgICAgICAgICAgICAgIDwvbGk+XG4gICAgICAgICAgICA8L3VsPlxuICAgICAgICAgICAgPGJ1dHRvbiBjbGFzcz1cImNsZWFyLWNvbXBsZXRlZFwiIEBvbi1jbGljaz17e3RoaXMuZW1pdCgnY2xlYXInKX19PkNsZWFyIGNvbXBsZXRlZDwvYnV0dG9uPlxuICAgICAgICA8L2Zvb3Rlcj5gO1xuICAgIH1cblxuICAgIG9uRmlsdGVyQ2xpY2sodHlwZSkge1xuICAgICAgICB0aGlzLmVtaXQoJ2NoYW5nZScsIHR5cGUpO1xuICAgIH1cbn0iLCIvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmVcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEluZm8gZXh0ZW5kcyBEYWlzeS5Db21wb25lbnQge1xyXG4gICAgcmVuZGVyKCkge1xuICAgICAgICByZXR1cm4gYDxmb290ZXIgY2xhc3M9XCJpbmZvXCI+XG5cdFx0XHQ8cD5Eb3VibGUtY2xpY2sgdG8gZWRpdCBhIHRvZG88L3A+XG5cdFx0XHQ8cD5Xcml0dGVuIGJ5IDxhIGhyZWY9XCJodHRwOi8vZXZhbnlvdS5tZVwiPkV2YW4gWW91PC9hPjwvcD5cblx0XHRcdDxwPlBhcnQgb2YgPGEgaHJlZj1cImh0dHA6Ly90b2RvbXZjLmNvbVwiPlRvZG9NVkM8L2E+PC9wPlxuXHRcdDwvZm9vdGVyPmA7XG4gICAgfVxufSIsIi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZVxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTWFpbiBleHRlbmRzIERhaXN5LkNvbXBvbmVudCB7XHJcbiAgICByZW5kZXIoKSB7XG4gICAgICAgIHJldHVybiBgPHNlY3Rpb24gY2xhc3M9XCJtYWluXCI+PGlucHV0IHR5cGU9XCJjaGVja2JveFwiIGNsYXNzPVwidG9nZ2xlLWFsbFwiPiBcbiAgICAgICAgICAgIDx1bCBjbGFzcz1cInRvZG8tbGlzdFwiPlxuICAgICAgICAgICAgICAgIDx0ZW1wbGF0ZSA6aW5jbHVkZT17e3RoaXMuYm9keX19Lz5cbiAgICAgICAgICAgIDwvdWw+XG4gICAgICAgIDwvc2VjdGlvbj5gO1xuICAgIH1cbn0iLCJjb25zdCBmaWx0ZXIgPSAoc3RhdHVzLCBzKSA9PiAocyA9PT0gMiA/IHRydWUgOiAoc3RhdHVzID09PSBzKSk7XG5leHBvcnQgZGVmYXVsdCBmaWx0ZXI7IiwiaW1wb3J0IGZpbHRlciBmcm9tICcuL2ZpbHRlcic7XG5cbmNvbnN0IGxpc3QgPSAobGlzdCwgcykgPT4gbGlzdC5maWx0ZXIoaXRlbSA9PiBmaWx0ZXIoaXRlbS5zdGF0dXMsIHMpKTtcblxuZXhwb3J0IGRlZmF1bHQgbGlzdDsiLCJpbXBvcnQgbGlzdCBmcm9tICcuL2xpc3QnO1xuXG5jb25zdCBzaXplID0gKGxpLCBzKSA9PiBsaXN0KGxpLCBzKS5sZW5ndGg7XG5cbmV4cG9ydCBkZWZhdWx0IHNpemU7IiwiaW1wb3J0IEhlYWRlciBmcm9tICcuL0hlYWRlcic7XG5pbXBvcnQgVG9kbyBmcm9tICcuL1RvZG8nO1xuaW1wb3J0IEZvb3RlciBmcm9tICcuL0Zvb3Rlcic7XG5pbXBvcnQgSW5mbyBmcm9tICcuL0luZm8nO1xuaW1wb3J0IE1haW4gZnJvbSAnLi9NYWluJztcbmltcG9ydCBmaWx0ZXIgZnJvbSAnLi4vbWV0aG9kcy9maWx0ZXInO1xuaW1wb3J0IGxpc3QgZnJvbSAnLi4vbWV0aG9kcy9saXN0JztcbmltcG9ydCBzaXplIGZyb20gJy4uL21ldGhvZHMvc2l6ZSc7XG5cbi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZVxuY29uc3Qge2NvbXBvbmVudCwgbWV0aG9kLCBkaXJlY3RpdmUsIGV2ZW50LCBjb21wdXRlZH0gPSBEYWlzeS5hbm5vdGF0aW9ucztcblxuQGNvbXBvbmVudCh7VG9kbywgSGVhZGVyLCBGb290ZXIsIEluZm8sIE1haW59KVxuQG1ldGhvZCh7ZmlsdGVyLCBzaXplLCBsaXN0fSlcbkBkaXJlY3RpdmUoKVxuQGV2ZW50KClcbkBjb21wdXRlZCh7IFxuICAgIHRvZG9zKCkge1xuICAgICAgICByZXR1cm4gJ3RvZG9zJztcbiAgICB9XG59KVxuXG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmVcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENvbXBvbmVudCBleHRlbmRzIERhaXN5LkNvbXBvbmVudCB7XG4gICAgc3RhdGUoKSB7XG4gICAgICAgIHJldHVybiBPYmplY3QuYXNzaWduKFxuICAgICAgICAgICAgc3VwZXIuc3RhdGUoKSwge1xuICAgICAgICAgICAgICAgIGhpc3Rvcnk6IFtdLFxuICAgICAgICAgICAgICAgIHN0YXR1czogMixcbiAgICAgICAgICAgICAgICB0b2RvTGlzdDogW1xuICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgc3RhdHVzTGlzdDogW1xuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiAnQWxsJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6IDJcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogJ0FjdGl2ZScsXG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAwXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6ICdjb21wbGV0ZWQnLFxuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogMVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgfVxuICAgICAgICApO1xuICAgIH1cbiAgICByZW5kZXIoKSB7XG4gICAgICAgIHJldHVybiBgPHNlY3Rpb24gY2xhc3M9XCJ0b2RvYXBwXCI+XG4gICAgICAgICAgICA8SGVhZGVyXG4gICAgICAgICAgICAgICAgdGl0bGU9e3t0b2Rvc319XG4gICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgPGlucHV0XG4gICAgICAgICAgICAgICAgICAgIGF1dG9mb2N1cz1cImF1dG9mb2N1c1wiXG4gICAgICAgICAgICAgICAgICAgIGF1dG9jb21wbGV0ZT1cIm9mZlwiXG4gICAgICAgICAgICAgICAgICAgIHBsYWNlaG9sZGVyPVwiV2hhdCBuZWVkcyB0byBiZSBkb25lP1wiXG4gICAgICAgICAgICAgICAgICAgIGNsYXNzPVwibmV3LXRvZG9cIlxuICAgICAgICAgICAgICAgICAgICBAb24ta2V5ZG93bj17e3RoaXMub25LZXlEb3duKCRldmVudCl9fVxuICAgICAgICAgICAgICAgICAgICBAcmVmPVwiaW5wdXRcIlxuICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgIDwvSGVhZGVyPlxuICAgICAgICAgICAgPE1haW4+XG4gICAgICAgICAgICAgICAgPFRvZG9cbiAgICAgICAgICAgICAgICAgICAgOmZvcj17e3RvZG9MaXN0fX1cbiAgICAgICAgICAgICAgICAgICAgOmlmPXt7ZmlsdGVyKGl0ZW0uc3RhdHVzLCBzdGF0dXMpfX1cbiAgICAgICAgICAgICAgICAgICAgbmFtZT17e2l0ZW0ubmFtZX19XG4gICAgICAgICAgICAgICAgICAgIHN0YXR1cz17e2l0ZW0uc3RhdHVzfX1cbiAgICAgICAgICAgICAgICAgICAgQG9uLWNsaWNrPXt7dGhpcy5vblRvZG9DbGljayhpdGVtLCAkZXZlbnQpfX1cbiAgICAgICAgICAgICAgICAgICAgQG9uLWRlc3Ryb3k9e3t0aGlzLm9uRGVzdHJveShpbmRleCl9fVxuICAgICAgICAgICAgICAgID48L1RvZG8+XG4gICAgICAgICAgICA8L01haW4+XG4gICAgICAgICAgICA8Rm9vdGVyXG4gICAgICAgICAgICAgICAgOmlmPXt7dG9kb0xpc3QubGVuZ3RoID4gMH19XG4gICAgICAgICAgICAgICAgc2l6ZT17e3NpemUodG9kb0xpc3QsIHN0YXR1cyl9fVxuICAgICAgICAgICAgICAgIHN0YXR1cz17e3N0YXR1c319XG4gICAgICAgICAgICAgICAgc3RhdHVzTGlzdD17e3N0YXR1c0xpc3R9fVxuICAgICAgICAgICAgICAgIEBvbi1jaGFuZ2U9e3t0aGlzLm9uU3RhdHVzQ2hhbmdlKCRldmVudCl9fVxuICAgICAgICAgICAgICAgIEBvbi1jbGVhcj17e3RoaXMub25DbGVhcigpfX1cbiAgICAgICAgICAgID48L0Zvb3Rlcj5cbiAgICAgICAgPC9zZWN0aW9uPmA7XG4gICAgfVxuICAgIGNvbnN0cnVjdG9yKG9wdGlvbnMpIHtcbiAgICAgICAgc3VwZXIob3B0aW9ucyk7XG4gICAgICAgIHRoaXMub24oJ2RlbGV0ZWQnLCBmdW5jdGlvbihtc2cpIHtcbiAgICAgICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZVxuICAgICAgICAgICAgY29uc29sZS5sb2coJ2RlbGV0ZWQ6ICcgKyBtc2cubmFtZSk7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBvbktleURvd24oe2tleUNvZGV9KSB7XG4gICAgICAgIGlmIChrZXlDb2RlID09PSAxMykge1xuICAgICAgICAgICAgY29uc3QgdmFsdWUgPSB0aGlzLnJlZnMuaW5wdXQudmFsdWU7XG4gICAgICAgICAgICB0aGlzLmFkZCh2YWx1ZSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBvblRvZG9DbGljayh0b2RvKSB7XG4gICAgICAgIGxldCB0b2RvTGlzdCA9IHRoaXMuZ2V0U3RhdGUoKS50b2RvTGlzdDtcbiAgICAgICAgY29uc3QgaW5kZXggPSB0b2RvTGlzdC5pbmRleE9mKHRvZG9MaXN0LmZpbHRlcigoe25hbWV9KSA9PiBuYW1lID09PSB0b2RvLm5hbWUgKVswXSk7XG4gICAgICAgIFxuICAgICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgICAgIHRvZG9MaXN0OiBbXG4gICAgICAgICAgICAgICAgLi4udG9kb0xpc3Quc2xpY2UoMCwgaW5kZXgpLFxuICAgICAgICAgICAgICAgIE9iamVjdC5hc3NpZ24oe30sIHRvZG8sIHtcbiAgICAgICAgICAgICAgICAgICAgc3RhdHVzOiBOdW1iZXIoIXRvZG8uc3RhdHVzKVxuICAgICAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgICAgIC4uLnRvZG9MaXN0LnNsaWNlKGluZGV4KzEpXG4gICAgICAgICAgICBdXG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIG9uRGVzdHJveShpbmRleCkge1xuICAgICAgICBsZXQgdG9kb0xpc3QgPSB0aGlzLmdldFN0YXRlKCkudG9kb0xpc3Q7XG4gICAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICAgICAgdG9kb0xpc3Q6IFtcbiAgICAgICAgICAgICAgICAuLi50b2RvTGlzdC5zbGljZSgwLCBpbmRleCksXG4gICAgICAgICAgICAgICAgLi4udG9kb0xpc3Quc2xpY2UoaW5kZXgrMSlcbiAgICAgICAgICAgIF1cbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgYWRkKHZhbHVlKSB7XG4gICAgICAgIGNvbnN0IHRvZG9MaXN0ID0gdGhpcy5nZXRTdGF0ZSgpLnRvZG9MaXN0O1xuICAgICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgICAgIHRvZG9MaXN0OiBbXG4gICAgICAgICAgICAgICAgLi4udG9kb0xpc3QsXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBuYW1lOiB2YWx1ZSxcbiAgICAgICAgICAgICAgICAgICAgc3RhdHVzOiAwXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgXVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBvblN0YXR1c0NoYW5nZShzdGF0dXMpIHtcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgICAgICBzdGF0dXNcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgb25DbGVhcigpIHtcbiAgICAgICAgY29uc3QgdG9kb0xpc3QgPSB0aGlzLmdldFN0YXRlKCkudG9kb0xpc3Q7XG5cbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgICAgICB0b2RvTGlzdDogdG9kb0xpc3QubWFwKChpdGVtKSA9PiBPYmplY3QuYXNzaWduKHt9LCBpdGVtLCB7c3RhdHVzOiAwfSkpXG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZVxuICAgIHBhcnNlZCgpIHtcbiAgICB9XG5cbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmVcbiAgICByZWFkeSgpIHtcbiAgICB9XG5cbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmVcbiAgICBtb3VudGVkKGRvbSkge1xuICAgIH1cblxuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZVxuICAgIHBhdGNoZWQoZG9tKSB7XG4gICAgfVxuXG4gICAgb25SZXNldCgpIHtcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgICAgICB0b2RvTGlzdDogdGhpcy5zdGF0ZS50b2RvTGlzdFxuICAgICAgICB9KTtcbiAgICB9XG59IiwiaW1wb3J0IEluZGV4IGZyb20gJy4vY29tcG9uZW50cy9JbmRleCc7XHJcbm5ldyBJbmRleCh7XHJcbiAgICBzdGF0ZToge31cclxufSkubW91bnQoZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2FwcCcpKTsiXSwibmFtZXMiOlsiSGVhZGVyIiwiRGFpc3kiLCJDb21wb25lbnQiLCJUb2RvSXRlbSIsImFzdCIsIkZvb3RlciIsInR5cGUiLCJlbWl0IiwiSW5mbyIsIk1haW4iLCJmaWx0ZXIiLCJzdGF0dXMiLCJzIiwibGlzdCIsIml0ZW0iLCJzaXplIiwibGkiLCJsZW5ndGgiLCJhbm5vdGF0aW9ucyIsImNvbXBvbmVudCIsIm1ldGhvZCIsImRpcmVjdGl2ZSIsImV2ZW50IiwiY29tcHV0ZWQiLCJUb2RvIiwiT2JqZWN0IiwiYXNzaWduIiwib3B0aW9ucyIsIm9uIiwibXNnIiwibG9nIiwibmFtZSIsImtleUNvZGUiLCJ2YWx1ZSIsInJlZnMiLCJpbnB1dCIsImFkZCIsInRvZG8iLCJ0b2RvTGlzdCIsImdldFN0YXRlIiwiaW5kZXgiLCJpbmRleE9mIiwic2V0U3RhdGUiLCJzbGljZSIsIk51bWJlciIsIm1hcCIsImRvbSIsInN0YXRlIiwiSW5kZXgiLCJtb3VudCIsImRvY3VtZW50IiwicXVlcnlTZWxlY3RvciJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7SUFDcUJBOzs7Ozs7Ozs7O2lDQUNSOzs7OztFQUR1QkMsTUFBTUM7O0FDRDFDO0lBQ3FCQzs7Ozs7Ozs7OztpQ0FDUjs7Ozs7Ozs7K0JBZ0JGQyxLQUFLOzs7RUFqQnNCSCxNQUFNQzs7QUNENUM7SUFDcUJHOzs7Ozs7Ozs7O2lDQUNSOzs7OztzQ0FhS0MsTUFBTTtpQkFDWEMsSUFBTCxDQUFVLFFBQVYsRUFBb0JELElBQXBCOzs7O0VBZjRCTCxNQUFNQzs7QUNEMUM7SUFDcUJNOzs7Ozs7Ozs7O2lDQUNSOzs7OztFQURxQlAsTUFBTUM7O0FDRHhDO0lBQ3FCTzs7Ozs7Ozs7OztpQ0FDUjs7Ozs7RUFEcUJSLE1BQU1DOztBQ0R4QyxJQUFNUSxTQUFTLFNBQVRBLE1BQVMsQ0FBQ0MsTUFBRCxFQUFTQyxDQUFUO1NBQWdCQSxNQUFNLENBQU4sR0FBVSxJQUFWLEdBQWtCRCxXQUFXQyxDQUE3QztDQUFmOztBQ0VBLElBQU1DLE9BQU8sY0FBQ0EsS0FBRCxFQUFPRCxDQUFQO1NBQWFDLE1BQUtILE1BQUwsQ0FBWTtXQUFRQSxPQUFPSSxLQUFLSCxNQUFaLEVBQW9CQyxDQUFwQixDQUFSO0dBQVosQ0FBYjtDQUFiOztBQ0FBLElBQU1HLE9BQU8sU0FBUEEsSUFBTyxDQUFDQyxFQUFELEVBQUtKLENBQUw7U0FBV0MsS0FBS0csRUFBTCxFQUFTSixDQUFULEVBQVlLLE1BQXZCO0NB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
