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
        key: "render",
        value: function render() {
            return "\n            <li class=\"todo {{!!status ? 'completed': ''}}\">\n                <div class=\"view\">\n                    <input type=\"checkbox\" \n                        class=\"toggle\" \n                        checked={{!!status}} \n                        @onClick={{this.emit('click', name)}}\n                    >\n                    <label>{{name}}</label> <button class=\"destroy\" @onClick={{this.emit('destroy')}}></button>    \n                </div>\n                <input type=\"text\" class=\"edit\">\n            </li>";
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
            var todoList = this.getState().todoList;

            this.setState({
                todoList: todoList.map(function (item) {
                    return Object.assign(item, {
                        status: 0
                    });
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidG9kb212Yy5qcyIsInNvdXJjZXMiOlsiLi4vc3JjL2NvbXBvbmVudHMvSGVhZGVyLmpzIiwiLi4vc3JjL2NvbXBvbmVudHMvVG9kby5qcyIsIi4uL3NyYy9jb21wb25lbnRzL0Zvb3Rlci5qcyIsIi4uL3NyYy9jb21wb25lbnRzL0luZm8uanMiLCIuLi9zcmMvY29tcG9uZW50cy9NYWluLmpzIiwiLi4vc3JjL21ldGhvZHMvZmlsdGVyLmpzIiwiLi4vc3JjL21ldGhvZHMvbGlzdC5qcyIsIi4uL3NyYy9tZXRob2RzL3NpemUuanMiLCIuLi9zcmMvY29tcG9uZW50cy9JbmRleC5qcyIsIi4uL3NyYy90b2RvbXZjLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZVxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgSGVhZGVyIGV4dGVuZHMgRGFpc3kuQ29tcG9uZW50IHtcbiAgICByZW5kZXIoKSB7XG4gICAgICAgIHJldHVybiBgPGhlYWRlciBjbGFzcz1cImhlYWRlclwiPlxuICAgICAgICAgICAgPGgxPnt7dG9kb3N9fTwvaDE+XG4gICAgICAgICAgICA8dGVtcGxhdGUgOmluY2x1ZGU9e3t0aGlzLmJvZHl9fT48L3RlbXBsYXRlPlxuICAgICAgICA8L2hlYWRlcj5gO1xuICAgIH1cbn0iLCIvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmVcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFRvZG9JdGVtIGV4dGVuZHMgRGFpc3kuQ29tcG9uZW50IHtcbiAgICByZW5kZXIoKSB7XG4gICAgICAgIHJldHVybiBgXG4gICAgICAgICAgICA8bGkgY2xhc3M9XCJ0b2RvIHt7ISFzdGF0dXMgPyAnY29tcGxldGVkJzogJyd9fVwiPlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJ2aWV3XCI+XG4gICAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwiY2hlY2tib3hcIiBcbiAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzPVwidG9nZ2xlXCIgXG4gICAgICAgICAgICAgICAgICAgICAgICBjaGVja2VkPXt7ISFzdGF0dXN9fSBcbiAgICAgICAgICAgICAgICAgICAgICAgIEBvbkNsaWNrPXt7dGhpcy5lbWl0KCdjbGljaycsIG5hbWUpfX1cbiAgICAgICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgICAgICA8bGFiZWw+e3tuYW1lfX08L2xhYmVsPiA8YnV0dG9uIGNsYXNzPVwiZGVzdHJveVwiIEBvbkNsaWNrPXt7dGhpcy5lbWl0KCdkZXN0cm95Jyl9fT48L2J1dHRvbj4gICAgXG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJ0ZXh0XCIgY2xhc3M9XCJlZGl0XCI+XG4gICAgICAgICAgICA8L2xpPmA7XG4gICAgfVxuXG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lXG4gICAgcGFyc2VkKGFzdCkge1xuICAgIH1cbn1cbiIsIi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZVxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRm9vdGVyIGV4dGVuZHMgRGFpc3kuQ29tcG9uZW50e1xuICAgIHJlbmRlcigpIHtcbiAgICAgICAgcmV0dXJuIGBcbiAgICAgICAgPGZvb3RlciBjbGFzcz1cImZvb3RlclwiPlxuICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJ0b2RvLWNvdW50XCI+PHN0cm9uZz57e3NpemV9fTwvc3Ryb25nPiBpdGVtcyBsZWZ0PC9zcGFuPlxuICAgICAgICAgICAgPHVsIGNsYXNzPVwiZmlsdGVyc1wiPlxuICAgICAgICAgICAgICAgIDxsaSA6Zm9yPXt7c3RhdHVzTGlzdH19PlxuICAgICAgICAgICAgICAgICAgICA8YSBocmVmPVwiIy9hbGxcIiBjbGFzcz1cInt7aXRlbS50eXBlID09PSBzdGF0dXM/ICdzZWxlY3RlZCc6ICcnfX1cIiBAb25DbGljaz17e3RoaXMub25GaWx0ZXJDbGljayhpdGVtLnR5cGUpfX0+e3tpdGVtLm5hbWV9fTwvYT5cbiAgICAgICAgICAgICAgICA8L2xpPlxuICAgICAgICAgICAgPC91bD5cbiAgICAgICAgICAgIDxidXR0b24gY2xhc3M9XCJjbGVhci1jb21wbGV0ZWRcIiBAb25DbGljaz17e3RoaXMuZW1pdCgnY2xlYXInKX19PkNsZWFyIGNvbXBsZXRlZDwvYnV0dG9uPlxuICAgICAgICA8L2Zvb3Rlcj5gO1xuICAgIH1cblxuICAgIG9uRmlsdGVyQ2xpY2sodHlwZSkge1xuICAgICAgICB0aGlzLmVtaXQoJ2NoYW5nZScsIHR5cGUpO1xuICAgIH1cbn0iLCIvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmVcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEluZm8gZXh0ZW5kcyBEYWlzeS5Db21wb25lbnQge1xuICAgIHJlbmRlcigpIHtcbiAgICAgICAgcmV0dXJuIGA8Zm9vdGVyIGNsYXNzPVwiaW5mb1wiPlxuXHRcdFx0PHA+RG91YmxlLWNsaWNrIHRvIGVkaXQgYSB0b2RvPC9wPlxuXHRcdFx0PHA+V3JpdHRlbiBieSA8YSBocmVmPVwiaHR0cDovL2V2YW55b3UubWVcIj5FdmFuIFlvdTwvYT48L3A+XG5cdFx0XHQ8cD5QYXJ0IG9mIDxhIGhyZWY9XCJodHRwOi8vdG9kb212Yy5jb21cIj5Ub2RvTVZDPC9hPjwvcD5cblx0XHQ8L2Zvb3Rlcj5gO1xuICAgIH1cbn0iLCIvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmVcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE1haW4gZXh0ZW5kcyBEYWlzeS5Db21wb25lbnQge1xuICAgIHJlbmRlcigpIHtcbiAgICAgICAgcmV0dXJuIGA8c2VjdGlvbiBjbGFzcz1cIm1haW5cIj48aW5wdXQgdHlwZT1cImNoZWNrYm94XCIgY2xhc3M9XCJ0b2dnbGUtYWxsXCI+IFxuICAgICAgICAgICAgPHVsIGNsYXNzPVwidG9kby1saXN0XCI+XG4gICAgICAgICAgICAgICAgPHRlbXBsYXRlIDppbmNsdWRlPXt7dGhpcy5ib2R5fX0vPlxuICAgICAgICAgICAgPC91bD5cbiAgICAgICAgPC9zZWN0aW9uPmA7XG4gICAgfVxufSIsImNvbnN0IGZpbHRlciA9IChzdGF0dXMsIHMpID0+IChzID09PSAyID8gdHJ1ZSA6IChzdGF0dXMgPT09IHMpKTtcbmV4cG9ydCBkZWZhdWx0IGZpbHRlcjsiLCJpbXBvcnQgZmlsdGVyIGZyb20gJy4vZmlsdGVyJztcblxuY29uc3QgbGlzdCA9IChsaXN0LCBzKSA9PiBsaXN0LmZpbHRlcihpdGVtID0+IGl0ZW0uc3RhdHVzID09PSBzKTtcblxuZXhwb3J0IGRlZmF1bHQgbGlzdDsiLCJpbXBvcnQgbGlzdCBmcm9tICcuL2xpc3QnO1xuXG5jb25zdCBzaXplID0gKGxpLCBzKSA9PiBsaXN0KGxpLCBzKS5sZW5ndGg7XG5cbmV4cG9ydCBkZWZhdWx0IHNpemU7IiwiaW1wb3J0IEhlYWRlciBmcm9tICcuL0hlYWRlcic7XG5pbXBvcnQgVG9kbyBmcm9tICcuL1RvZG8nO1xuaW1wb3J0IEZvb3RlciBmcm9tICcuL0Zvb3Rlcic7XG5pbXBvcnQgSW5mbyBmcm9tICcuL0luZm8nO1xuaW1wb3J0IE1haW4gZnJvbSAnLi9NYWluJztcbmltcG9ydCBmaWx0ZXIgZnJvbSAnLi4vbWV0aG9kcy9maWx0ZXInO1xuaW1wb3J0IGxpc3QgZnJvbSAnLi4vbWV0aG9kcy9saXN0JztcbmltcG9ydCBzaXplIGZyb20gJy4uL21ldGhvZHMvc2l6ZSc7XG5cbi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZVxuY29uc3Qge2NvbXBvbmVudCwgbWV0aG9kLCBkaXJlY3RpdmUsIGV2ZW50LCBjb21wdXRlZH0gPSBEYWlzeS5hbm5vdGF0aW9ucztcblxuQGNvbXBvbmVudCh7VG9kbywgSGVhZGVyLCBGb290ZXIsIEluZm8sIE1haW59KVxuQG1ldGhvZCh7ZmlsdGVyLCBzaXplLCBsaXN0fSlcbkBkaXJlY3RpdmUoKVxuQGV2ZW50KClcbkBjb21wdXRlZCh7IFxuICAgIHRvZG9zKCkge1xuICAgICAgICByZXR1cm4gJ3RvZG9zJztcbiAgICB9XG59KVxuXG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmVcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENvbXBvbmVudCBleHRlbmRzIERhaXN5LkNvbXBvbmVudCB7XG4gICAgc3RhdGUocHJvcHMgPSB7fSkge1xuICAgICAgICBpZiAobG9jYWxTdG9yYWdlLmdldEl0ZW0oJ3RvZG9TdGF0ZScpKSB7XG4gICAgICAgICAgICByZXR1cm4gSlNPTi5wYXJzZShcbiAgICAgICAgICAgICAgICBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgndG9kb1N0YXRlJylcbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oe1xuICAgICAgICAgICAgaGlzdG9yeTogW10sXG4gICAgICAgICAgICBzdGF0dXM6IDIsXG4gICAgICAgICAgICB0b2RvTGlzdDogW1xuICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIHN0YXR1c0xpc3Q6IFtcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIG5hbWU6ICdBbGwnLFxuICAgICAgICAgICAgICAgICAgICB0eXBlOiAyXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIG5hbWU6ICdBY3RpdmUnLFxuICAgICAgICAgICAgICAgICAgICB0eXBlOiAwXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIG5hbWU6ICdjb21wbGV0ZWQnLFxuICAgICAgICAgICAgICAgICAgICB0eXBlOiAxXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgXVxuICAgICAgICB9LCBwcm9wcyk7XG4gICAgfVxuICAgIHJlbmRlcigpIHtcbiAgICAgICAgcmV0dXJuIGA8c2VjdGlvbiBjbGFzcz1cInRvZG9hcHBcIj5cbiAgICAgICAgICAgIDxIZWFkZXJcbiAgICAgICAgICAgICAgICB0aXRsZT17e3RvZG9zfX1cbiAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICA8aW5wdXRcbiAgICAgICAgICAgICAgICAgICAgYXV0b2ZvY3VzPVwiYXV0b2ZvY3VzXCJcbiAgICAgICAgICAgICAgICAgICAgYXV0b2NvbXBsZXRlPVwib2ZmXCJcbiAgICAgICAgICAgICAgICAgICAgcGxhY2Vob2xkZXI9XCJXaGF0IG5lZWRzIHRvIGJlIGRvbmU/XCJcbiAgICAgICAgICAgICAgICAgICAgY2xhc3M9XCJuZXctdG9kb1wiXG4gICAgICAgICAgICAgICAgICAgIEBvbktleWRvd249e3t0aGlzLm9uS2V5RG93bigkZXZlbnQpfX1cbiAgICAgICAgICAgICAgICAgICAgQHJlZj1cImlucHV0XCJcbiAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICA8L0hlYWRlcj5cbiAgICAgICAgICAgIDxNYWluPlxuICAgICAgICAgICAgICAgIDxUb2RvXG4gICAgICAgICAgICAgICAgICAgIDpmb3I9e3t0b2RvTGlzdH19XG4gICAgICAgICAgICAgICAgICAgIDppZj17e2ZpbHRlcihpdGVtLnN0YXR1cywgc3RhdHVzKX19XG4gICAgICAgICAgICAgICAgICAgIG5hbWU9e3tpdGVtLm5hbWV9fVxuICAgICAgICAgICAgICAgICAgICBzdGF0dXM9e3tpdGVtLnN0YXR1c319XG4gICAgICAgICAgICAgICAgICAgIHRvZG89e3tpdGVtfX1cbiAgICAgICAgICAgICAgICAgICAgQG9uQ2xpY2s9e3t0aGlzLm9uVG9kb0NsaWNrKGl0ZW0sICRldmVudCl9fVxuICAgICAgICAgICAgICAgICAgICBAb25EZXN0cm95PXt7dGhpcy5vbkRlc3Ryb3koaW5kZXgpfX1cbiAgICAgICAgICAgICAgICA+PC9Ub2RvPlxuICAgICAgICAgICAgPC9NYWluPlxuICAgICAgICAgICAgPEZvb3RlclxuICAgICAgICAgICAgICAgIDppZj17e3RvZG9MaXN0Lmxlbmd0aCA+IDB9fVxuICAgICAgICAgICAgICAgIHNpemU9e3tzaXplKHRvZG9MaXN0LCBzdGF0dXMpfX1cbiAgICAgICAgICAgICAgICBzdGF0dXM9e3tzdGF0dXN9fVxuICAgICAgICAgICAgICAgIHN0YXR1c0xpc3Q9e3tzdGF0dXNMaXN0fX1cbiAgICAgICAgICAgICAgICBAb25DaGFuZ2U9e3t0aGlzLm9uU3RhdHVzQ2hhbmdlKCRldmVudCl9fVxuICAgICAgICAgICAgICAgIEBvbkNsZWFyPXt7dGhpcy5vbkNsZWFyKCl9fVxuICAgICAgICAgICAgPjwvRm9vdGVyPlxuICAgICAgICA8L3NlY3Rpb24+YDtcbiAgICB9XG4gICAgXG4gICAgb25LZXlEb3duKHtrZXlDb2RlfSkge1xuICAgICAgICBpZiAoa2V5Q29kZSA9PT0gMTMpIHtcbiAgICAgICAgICAgIGNvbnN0IHZhbHVlID0gdGhpcy5yZWZzLmlucHV0LnZhbHVlO1xuICAgICAgICAgICAgdGhpcy5hZGQodmFsdWUpO1xuICAgICAgICAgICAgdGhpcy5yZWZzLmlucHV0LnZhbHVlID0gJyc7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBvblRvZG9DbGljayh0b2RvKSB7XG4gICAgICAgIGNvbnN0IHRvZG9MaXN0ID0gdGhpcy5nZXRTdGF0ZSgpLnRvZG9MaXN0O1xuICAgICAgICBjb25zdCBpbmRleCA9IHRvZG9MaXN0LmluZGV4T2YodG9kbyk7XG4gICAgICAgIFxuICAgICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgICAgIFtgdG9kb0xpc3QuJHtpbmRleH0uc3RhdHVzYF06IE51bWJlcighdG9kby5zdGF0dXMpXG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIG9uRGVzdHJveShpbmRleCkge1xuICAgICAgICBsZXQgdG9kb0xpc3QgPSB0aGlzLmdldFN0YXRlKCkudG9kb0xpc3Q7XG4gICAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICAgICAgdG9kb0xpc3Q6IFtcbiAgICAgICAgICAgICAgICAuLi50b2RvTGlzdC5zbGljZSgwLCBpbmRleCksXG4gICAgICAgICAgICAgICAgLi4udG9kb0xpc3Quc2xpY2UoaW5kZXgrMSlcbiAgICAgICAgICAgIF1cbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgYWRkKHZhbHVlKSB7XG4gICAgICAgIGNvbnN0IHRvZG9MaXN0ID0gdGhpcy5nZXRTdGF0ZSgpLnRvZG9MaXN0O1xuICAgICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgICAgIFtgdG9kb0xpc3QuJHt0b2RvTGlzdC5sZW5ndGh9YF06IHtcbiAgICAgICAgICAgICAgICBuYW1lOiB2YWx1ZSxcbiAgICAgICAgICAgICAgICBzdGF0dXM6IDBcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgb25TdGF0dXNDaGFuZ2Uoc3RhdHVzKSB7XG4gICAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICAgICAgc3RhdHVzXG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIG9uQ2xlYXIoKSB7XG4gICAgICAgIGNvbnN0IHRvZG9MaXN0ID0gdGhpcy5nZXRTdGF0ZSgpLnRvZG9MaXN0O1xuXG4gICAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICAgICAgdG9kb0xpc3Q6IHRvZG9MaXN0Lm1hcCgoaXRlbSkgPT4gT2JqZWN0LmFzc2lnbihpdGVtLCB7XG4gICAgICAgICAgICAgICAgc3RhdHVzOiAwXG4gICAgICAgICAgICB9KSlcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lXG4gICAgcGFyc2VkKCkge1xuICAgIH1cblxuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZVxuICAgIHJlYWR5KCkge1xuICAgIH1cblxuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZVxuICAgIG1vdW50ZWQoZG9tKSB7XG4gICAgfVxuXG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lXG4gICAgcGF0Y2hlZChkb20pIHtcbiAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ3RvZG9TdGF0ZScsIFxuICAgICAgICAgICAgSlNPTi5zdHJpbmdpZnkoXG4gICAgICAgICAgICAgICAgdGhpcy5nZXRTdGF0ZSgpXG4gICAgICAgICAgICApXG4gICAgICAgICk7XG4gICAgfVxuXG4gICAgb25SZXNldCgpIHtcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgICAgICB0b2RvTGlzdDogdGhpcy5zdGF0ZS50b2RvTGlzdFxuICAgICAgICB9KTtcbiAgICB9XG59IiwiaW1wb3J0IEluZGV4IGZyb20gJy4vY29tcG9uZW50cy9JbmRleCc7XG5uZXcgSW5kZXgoe1xuICAgIHN0YXRlOiB7fVxufSkubW91bnQoZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2FwcCcpKTsiXSwibmFtZXMiOlsiSGVhZGVyIiwiRGFpc3kiLCJDb21wb25lbnQiLCJUb2RvSXRlbSIsImFzdCIsIkZvb3RlciIsInR5cGUiLCJlbWl0IiwiSW5mbyIsIk1haW4iLCJmaWx0ZXIiLCJzdGF0dXMiLCJzIiwibGlzdCIsIml0ZW0iLCJzaXplIiwibGkiLCJsZW5ndGgiLCJhbm5vdGF0aW9ucyIsImNvbXBvbmVudCIsIm1ldGhvZCIsImRpcmVjdGl2ZSIsImV2ZW50IiwiY29tcHV0ZWQiLCJUb2RvIiwicHJvcHMiLCJsb2NhbFN0b3JhZ2UiLCJnZXRJdGVtIiwiSlNPTiIsInBhcnNlIiwiT2JqZWN0IiwiYXNzaWduIiwia2V5Q29kZSIsInZhbHVlIiwicmVmcyIsImlucHV0IiwiYWRkIiwidG9kbyIsInRvZG9MaXN0IiwiZ2V0U3RhdGUiLCJpbmRleCIsImluZGV4T2YiLCJzZXRTdGF0ZSIsIk51bWJlciIsInNsaWNlIiwibWFwIiwiZG9tIiwic2V0SXRlbSIsInN0cmluZ2lmeSIsInN0YXRlIiwiSW5kZXgiLCJtb3VudCIsImRvY3VtZW50IiwicXVlcnlTZWxlY3RvciJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7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
