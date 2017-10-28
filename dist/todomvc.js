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
            var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

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
                this.refs.input.value = '';
            }
        }
    }, {
        key: 'onTodoClick',
        value: function onTodoClick(todo) {
            var todoList = this.getState().todoList;
            var index = todoList.indexOf(todo);

            this.setState(defineProperty({}, 'todoList.' + index + '.status', Number(!todo.status)));

            console.log('checkbox-click', todo);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidG9kb212Yy5qcyIsInNvdXJjZXMiOlsiLi4vc3JjL2NvbXBvbmVudHMvSGVhZGVyLmpzIiwiLi4vc3JjL2NvbXBvbmVudHMvVG9kby5qcyIsIi4uL3NyYy9jb21wb25lbnRzL0Zvb3Rlci5qcyIsIi4uL3NyYy9jb21wb25lbnRzL0luZm8uanMiLCIuLi9zcmMvY29tcG9uZW50cy9NYWluLmpzIiwiLi4vc3JjL21ldGhvZHMvZmlsdGVyLmpzIiwiLi4vc3JjL21ldGhvZHMvbGlzdC5qcyIsIi4uL3NyYy9tZXRob2RzL3NpemUuanMiLCIuLi9zcmMvY29tcG9uZW50cy9JbmRleC5qcyIsIi4uL3NyYy90b2RvbXZjLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZVxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgSGVhZGVyIGV4dGVuZHMgRGFpc3kuQ29tcG9uZW50IHtcbiAgICByZW5kZXIoKSB7XG4gICAgICAgIHJldHVybiBgPGhlYWRlciBjbGFzcz1cImhlYWRlclwiPlxuICAgICAgICAgICAgPGgxPnt7dG9kb3N9fTwvaDE+XG4gICAgICAgICAgICA8dGVtcGxhdGUgOmluY2x1ZGU9e3t0aGlzLmJvZHl9fT48L3RlbXBsYXRlPlxuICAgICAgICA8L2hlYWRlcj5gO1xuICAgIH1cbn0iLCIvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmVcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFRvZG9JdGVtIGV4dGVuZHMgRGFpc3kuQ29tcG9uZW50IHtcbiAgICByZW5kZXIoKSB7XG4gICAgICAgIHJldHVybiBgXG4gICAgICAgICAgICA8bGkgY2xhc3M9XCJ0b2RvIHt7ISFzdGF0dXMgPyAnY29tcGxldGVkJzogJyd9fVwiPlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJ2aWV3XCI+XG4gICAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwiY2hlY2tib3hcIiBcbiAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzPVwidG9nZ2xlXCIgXG4gICAgICAgICAgICAgICAgICAgICAgICBjaGVja2VkPXt7ISFzdGF0dXN9fSBcbiAgICAgICAgICAgICAgICAgICAgICAgIEBvbkNsaWNrPXt7dGhpcy5lbWl0KCdjbGljaycsIG5hbWUpfX1cbiAgICAgICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgICAgICA8bGFiZWw+e3tuYW1lfX08L2xhYmVsPiA8YnV0dG9uIGNsYXNzPVwiZGVzdHJveVwiIEBvbkNsaWNrPXt7dGhpcy5lbWl0KCdkZXN0cm95Jyl9fT48L2J1dHRvbj4gICAgXG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJ0ZXh0XCIgY2xhc3M9XCJlZGl0XCI+XG4gICAgICAgICAgICA8L2xpPmA7XG4gICAgfVxuXG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lXG4gICAgcGFyc2VkKGFzdCkge1xuICAgIH1cbn1cbiIsIi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZVxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRm9vdGVyIGV4dGVuZHMgRGFpc3kuQ29tcG9uZW50e1xuICAgIHJlbmRlcigpIHtcbiAgICAgICAgcmV0dXJuIGBcbiAgICAgICAgPGZvb3RlciBjbGFzcz1cImZvb3RlclwiPlxuICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJ0b2RvLWNvdW50XCI+PHN0cm9uZz57e3NpemV9fTwvc3Ryb25nPiBpdGVtcyBsZWZ0PC9zcGFuPlxuICAgICAgICAgICAgPHVsIGNsYXNzPVwiZmlsdGVyc1wiPlxuICAgICAgICAgICAgICAgIDxsaSA6Zm9yPXt7c3RhdHVzTGlzdH19PlxuICAgICAgICAgICAgICAgICAgICA8YSBocmVmPVwiIy9hbGxcIiBjbGFzcz1cInt7aXRlbS50eXBlID09PSBzdGF0dXM/ICdzZWxlY3RlZCc6ICcnfX1cIiBAb25DbGljaz17e3RoaXMub25GaWx0ZXJDbGljayhpdGVtLnR5cGUpfX0+e3tpdGVtLm5hbWV9fTwvYT5cbiAgICAgICAgICAgICAgICA8L2xpPlxuICAgICAgICAgICAgPC91bD5cbiAgICAgICAgICAgIDxidXR0b24gY2xhc3M9XCJjbGVhci1jb21wbGV0ZWRcIiBAb25DbGljaz17e3RoaXMuZW1pdCgnY2xlYXInKX19PkNsZWFyIGNvbXBsZXRlZDwvYnV0dG9uPlxuICAgICAgICA8L2Zvb3Rlcj5gO1xuICAgIH1cblxuICAgIG9uRmlsdGVyQ2xpY2sodHlwZSkge1xuICAgICAgICB0aGlzLmVtaXQoJ2NoYW5nZScsIHR5cGUpO1xuICAgIH1cbn0iLCIvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmVcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEluZm8gZXh0ZW5kcyBEYWlzeS5Db21wb25lbnQge1xuICAgIHJlbmRlcigpIHtcbiAgICAgICAgcmV0dXJuIGA8Zm9vdGVyIGNsYXNzPVwiaW5mb1wiPlxuXHRcdFx0PHA+RG91YmxlLWNsaWNrIHRvIGVkaXQgYSB0b2RvPC9wPlxuXHRcdFx0PHA+V3JpdHRlbiBieSA8YSBocmVmPVwiaHR0cDovL2V2YW55b3UubWVcIj5FdmFuIFlvdTwvYT48L3A+XG5cdFx0XHQ8cD5QYXJ0IG9mIDxhIGhyZWY9XCJodHRwOi8vdG9kb212Yy5jb21cIj5Ub2RvTVZDPC9hPjwvcD5cblx0XHQ8L2Zvb3Rlcj5gO1xuICAgIH1cbn0iLCIvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmVcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE1haW4gZXh0ZW5kcyBEYWlzeS5Db21wb25lbnQge1xuICAgIHJlbmRlcigpIHtcbiAgICAgICAgcmV0dXJuIGA8c2VjdGlvbiBjbGFzcz1cIm1haW5cIj48aW5wdXQgdHlwZT1cImNoZWNrYm94XCIgY2xhc3M9XCJ0b2dnbGUtYWxsXCI+IFxuICAgICAgICAgICAgPHVsIGNsYXNzPVwidG9kby1saXN0XCI+XG4gICAgICAgICAgICAgICAgPHRlbXBsYXRlIDppbmNsdWRlPXt7dGhpcy5ib2R5fX0vPlxuICAgICAgICAgICAgPC91bD5cbiAgICAgICAgPC9zZWN0aW9uPmA7XG4gICAgfVxufSIsImNvbnN0IGZpbHRlciA9IChzdGF0dXMsIHMpID0+IChzID09PSAyID8gdHJ1ZSA6IChzdGF0dXMgPT09IHMpKTtcbmV4cG9ydCBkZWZhdWx0IGZpbHRlcjsiLCJpbXBvcnQgZmlsdGVyIGZyb20gJy4vZmlsdGVyJztcblxuY29uc3QgbGlzdCA9IChsaXN0LCBzKSA9PiBsaXN0LmZpbHRlcihpdGVtID0+IGl0ZW0uc3RhdHVzID09PSBzKTtcblxuZXhwb3J0IGRlZmF1bHQgbGlzdDsiLCJpbXBvcnQgbGlzdCBmcm9tICcuL2xpc3QnO1xuXG5jb25zdCBzaXplID0gKGxpLCBzKSA9PiBsaXN0KGxpLCBzKS5sZW5ndGg7XG5cbmV4cG9ydCBkZWZhdWx0IHNpemU7IiwiaW1wb3J0IEhlYWRlciBmcm9tICcuL0hlYWRlcic7XG5pbXBvcnQgVG9kbyBmcm9tICcuL1RvZG8nO1xuaW1wb3J0IEZvb3RlciBmcm9tICcuL0Zvb3Rlcic7XG5pbXBvcnQgSW5mbyBmcm9tICcuL0luZm8nO1xuaW1wb3J0IE1haW4gZnJvbSAnLi9NYWluJztcbmltcG9ydCBmaWx0ZXIgZnJvbSAnLi4vbWV0aG9kcy9maWx0ZXInO1xuaW1wb3J0IGxpc3QgZnJvbSAnLi4vbWV0aG9kcy9saXN0JztcbmltcG9ydCBzaXplIGZyb20gJy4uL21ldGhvZHMvc2l6ZSc7XG5cbi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZVxuY29uc3Qge2NvbXBvbmVudCwgbWV0aG9kLCBkaXJlY3RpdmUsIGV2ZW50LCBjb21wdXRlZH0gPSBEYWlzeS5hbm5vdGF0aW9ucztcblxuQGNvbXBvbmVudCh7VG9kbywgSGVhZGVyLCBGb290ZXIsIEluZm8sIE1haW59KVxuQG1ldGhvZCh7ZmlsdGVyLCBzaXplLCBsaXN0fSlcbkBkaXJlY3RpdmUoKVxuQGV2ZW50KClcbkBjb21wdXRlZCh7IFxuICAgIHRvZG9zKCkge1xuICAgICAgICByZXR1cm4gJ3RvZG9zJztcbiAgICB9XG59KVxuXG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmVcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENvbXBvbmVudCBleHRlbmRzIERhaXN5LkNvbXBvbmVudCB7XG4gICAgc3RhdGUocHJvcHMgPSB7fSkge1xuICAgICAgICByZXR1cm4gT2JqZWN0LmFzc2lnbih7XG4gICAgICAgICAgICBoaXN0b3J5OiBbXSxcbiAgICAgICAgICAgIHN0YXR1czogMixcbiAgICAgICAgICAgIHRvZG9MaXN0OiBbXG4gICAgICAgICAgICBdLFxuICAgICAgICAgICAgc3RhdHVzTGlzdDogW1xuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogJ0FsbCcsXG4gICAgICAgICAgICAgICAgICAgIHR5cGU6IDJcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogJ0FjdGl2ZScsXG4gICAgICAgICAgICAgICAgICAgIHR5cGU6IDBcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogJ2NvbXBsZXRlZCcsXG4gICAgICAgICAgICAgICAgICAgIHR5cGU6IDFcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICBdXG4gICAgICAgIH0sIHByb3BzKTtcbiAgICB9XG4gICAgcmVuZGVyKCkge1xuICAgICAgICByZXR1cm4gYDxzZWN0aW9uIGNsYXNzPVwidG9kb2FwcFwiPlxuICAgICAgICAgICAgPEhlYWRlclxuICAgICAgICAgICAgICAgIHRpdGxlPXt7dG9kb3N9fVxuICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgIDxpbnB1dFxuICAgICAgICAgICAgICAgICAgICBhdXRvZm9jdXM9XCJhdXRvZm9jdXNcIlxuICAgICAgICAgICAgICAgICAgICBhdXRvY29tcGxldGU9XCJvZmZcIlxuICAgICAgICAgICAgICAgICAgICBwbGFjZWhvbGRlcj1cIldoYXQgbmVlZHMgdG8gYmUgZG9uZT9cIlxuICAgICAgICAgICAgICAgICAgICBjbGFzcz1cIm5ldy10b2RvXCJcbiAgICAgICAgICAgICAgICAgICAgQG9uS2V5ZG93bj17e3RoaXMub25LZXlEb3duKCRldmVudCl9fVxuICAgICAgICAgICAgICAgICAgICBAcmVmPVwiaW5wdXRcIlxuICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgIDwvSGVhZGVyPlxuICAgICAgICAgICAgPE1haW4+XG4gICAgICAgICAgICAgICAgPFRvZG9cbiAgICAgICAgICAgICAgICAgICAgOmZvcj17e3RvZG9MaXN0fX1cbiAgICAgICAgICAgICAgICAgICAgOmlmPXt7ZmlsdGVyKGl0ZW0uc3RhdHVzLCBzdGF0dXMpfX1cbiAgICAgICAgICAgICAgICAgICAgbmFtZT17e2l0ZW0ubmFtZX19XG4gICAgICAgICAgICAgICAgICAgIHN0YXR1cz17e2l0ZW0uc3RhdHVzfX1cbiAgICAgICAgICAgICAgICAgICAgdG9kbz17e2l0ZW19fVxuICAgICAgICAgICAgICAgICAgICBAb25DbGljaz17e3RoaXMub25Ub2RvQ2xpY2soaXRlbSwgJGV2ZW50KX19XG4gICAgICAgICAgICAgICAgICAgIEBvbkRlc3Ryb3k9e3t0aGlzLm9uRGVzdHJveShpbmRleCl9fVxuICAgICAgICAgICAgICAgID48L1RvZG8+XG4gICAgICAgICAgICA8L01haW4+XG4gICAgICAgICAgICA8Rm9vdGVyXG4gICAgICAgICAgICAgICAgOmlmPXt7dG9kb0xpc3QubGVuZ3RoID4gMH19XG4gICAgICAgICAgICAgICAgc2l6ZT17e3NpemUodG9kb0xpc3QsIHN0YXR1cyl9fVxuICAgICAgICAgICAgICAgIHN0YXR1cz17e3N0YXR1c319XG4gICAgICAgICAgICAgICAgc3RhdHVzTGlzdD17e3N0YXR1c0xpc3R9fVxuICAgICAgICAgICAgICAgIEBvbkNoYW5nZT17e3RoaXMub25TdGF0dXNDaGFuZ2UoJGV2ZW50KX19XG4gICAgICAgICAgICAgICAgQG9uQ2xlYXI9e3t0aGlzLm9uQ2xlYXIoKX19XG4gICAgICAgICAgICA+PC9Gb290ZXI+XG4gICAgICAgIDwvc2VjdGlvbj5gO1xuICAgIH1cbiAgICBjb25zdHJ1Y3RvcihvcHRpb25zKSB7XG4gICAgICAgIHN1cGVyKG9wdGlvbnMpO1xuICAgICAgICB0aGlzLm9uKCdkZWxldGVkJywgZnVuY3Rpb24obXNnKSB7XG4gICAgICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmVcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdkZWxldGVkOiAnICsgbXNnLm5hbWUpO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgb25LZXlEb3duKHtrZXlDb2RlfSkge1xuICAgICAgICBpZiAoa2V5Q29kZSA9PT0gMTMpIHtcbiAgICAgICAgICAgIGNvbnN0IHZhbHVlID0gdGhpcy5yZWZzLmlucHV0LnZhbHVlO1xuICAgICAgICAgICAgdGhpcy5hZGQodmFsdWUpO1xuICAgICAgICAgICAgdGhpcy5yZWZzLmlucHV0LnZhbHVlID0gJyc7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBvblRvZG9DbGljayh0b2RvKSB7XG4gICAgICAgIGNvbnN0IHRvZG9MaXN0ID0gdGhpcy5nZXRTdGF0ZSgpLnRvZG9MaXN0O1xuICAgICAgICBjb25zdCBpbmRleCA9IHRvZG9MaXN0LmluZGV4T2YodG9kbyk7XG4gICAgICAgIFxuICAgICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgICAgIFtgdG9kb0xpc3QuJHtpbmRleH0uc3RhdHVzYF06IE51bWJlcighdG9kby5zdGF0dXMpXG4gICAgICAgIH0pO1xuXG4gICAgICAgIGNvbnNvbGUubG9nKCdjaGVja2JveC1jbGljaycsIHRvZG8pO1xuICAgICAgICBcbiAgICB9XG5cbiAgICBvbkRlc3Ryb3koaW5kZXgpIHtcbiAgICAgICAgbGV0IHRvZG9MaXN0ID0gdGhpcy5nZXRTdGF0ZSgpLnRvZG9MaXN0O1xuICAgICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgICAgIHRvZG9MaXN0OiBbXG4gICAgICAgICAgICAgICAgLi4udG9kb0xpc3Quc2xpY2UoMCwgaW5kZXgpLFxuICAgICAgICAgICAgICAgIC4uLnRvZG9MaXN0LnNsaWNlKGluZGV4KzEpXG4gICAgICAgICAgICBdXG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGFkZCh2YWx1ZSkge1xuICAgICAgICBjb25zdCB0b2RvTGlzdCA9IHRoaXMuZ2V0U3RhdGUoKS50b2RvTGlzdDtcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgICAgICBbYHRvZG9MaXN0LiR7dG9kb0xpc3QubGVuZ3RofWBdOiB7XG4gICAgICAgICAgICAgICAgbmFtZTogdmFsdWUsXG4gICAgICAgICAgICAgICAgc3RhdHVzOiAwXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIG9uU3RhdHVzQ2hhbmdlKHN0YXR1cykge1xuICAgICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgICAgIHN0YXR1c1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBvbkNsZWFyKCkge1xuICAgICAgICBjb25zdCB0b2RvTGlzdCA9IHRoaXMuZ2V0U3RhdGUoKS50b2RvTGlzdDtcblxuICAgICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgICAgIHRvZG9MaXN0OiB0b2RvTGlzdC5tYXAoKGl0ZW0pID0+IE9iamVjdC5hc3NpZ24oaXRlbSwge1xuICAgICAgICAgICAgICAgIHN0YXR1czogMFxuICAgICAgICAgICAgfSkpXG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZVxuICAgIHBhcnNlZCgpIHtcbiAgICB9XG5cbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmVcbiAgICByZWFkeSgpIHtcbiAgICB9XG5cbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmVcbiAgICBtb3VudGVkKGRvbSkge1xuICAgIH1cblxuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZVxuICAgIHBhdGNoZWQoZG9tKSB7XG4gICAgfVxuXG4gICAgb25SZXNldCgpIHtcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgICAgICB0b2RvTGlzdDogdGhpcy5zdGF0ZS50b2RvTGlzdFxuICAgICAgICB9KTtcbiAgICB9XG59IiwiaW1wb3J0IEluZGV4IGZyb20gJy4vY29tcG9uZW50cy9JbmRleCc7XG5uZXcgSW5kZXgoe1xuICAgIHN0YXRlOiB7fVxufSkubW91bnQoZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2FwcCcpKTsiXSwibmFtZXMiOlsiSGVhZGVyIiwiRGFpc3kiLCJDb21wb25lbnQiLCJUb2RvSXRlbSIsImFzdCIsIkZvb3RlciIsInR5cGUiLCJlbWl0IiwiSW5mbyIsIk1haW4iLCJmaWx0ZXIiLCJzdGF0dXMiLCJzIiwibGlzdCIsIml0ZW0iLCJzaXplIiwibGkiLCJsZW5ndGgiLCJhbm5vdGF0aW9ucyIsImNvbXBvbmVudCIsIm1ldGhvZCIsImRpcmVjdGl2ZSIsImV2ZW50IiwiY29tcHV0ZWQiLCJUb2RvIiwicHJvcHMiLCJPYmplY3QiLCJhc3NpZ24iLCJvcHRpb25zIiwib24iLCJtc2ciLCJsb2ciLCJuYW1lIiwia2V5Q29kZSIsInZhbHVlIiwicmVmcyIsImlucHV0IiwiYWRkIiwidG9kbyIsInRvZG9MaXN0IiwiZ2V0U3RhdGUiLCJpbmRleCIsImluZGV4T2YiLCJzZXRTdGF0ZSIsIk51bWJlciIsInNsaWNlIiwibWFwIiwiZG9tIiwic3RhdGUiLCJJbmRleCIsIm1vdW50IiwiZG9jdW1lbnQiLCJxdWVyeVNlbGVjdG9yIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7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
