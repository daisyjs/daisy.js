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
            return '\n        <footer class="footer">\n            <span class="todo-count"><strong>{{size}}</strong> items left</span>\n            <ul class="filters">\n                <li :for={{filters}}>\n                    <a href="#/all" class="{{item.type === status? \'selected\': \'\'}}" @on-click={{this.onFilterClick(item.type)}}>{{item.name}}</a>\n                </li>\n            </ul>\n            <button class="clear-completed" @on-click={{this.emit(\'clear\')}}>Clear completed</button>\n        </footer>';
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


var ALL = 2;
var ACTIVE = 0;
var COMPLETED = 1;

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
            return {
                history: [],
                status: ALL,
                todoList: [],
                activeStatus: ACTIVE,
                filters: [{
                    name: 'All',
                    type: ALL
                }, {
                    name: 'Active',
                    type: ACTIVE
                }, {
                    name: 'completed',
                    type: COMPLETED
                }]
            };
        }
    }, {
        key: 'render',
        value: function render() {
            return '<section class="todoapp">\n            <Header\n                title={{todos}}\n            >\n                <input\n                    autofocus="autofocus"\n                    autocomplete="off"\n                    placeholder="What needs to be done?"\n                    class="new-todo"\n                    @on-keydown={{this.onKeyDown($event)}}\n                    @ref="input"\n                >\n            </Header>\n            <Main>\n                <Todo\n                    :for={{todoList}}\n                    :if={{filter(item.status, status)}}\n                    name={{item.name}}\n                    status={{item.status}}\n                    @on-click={{this.onTodoClick(item, $event)}}\n                    @on-destroy={{this.onDestroy(index)}}\n                ></Todo>\n            </Main>\n            <Footer\n                :if={{todoList.length > 0}}\n                size={{size(todoList, activeStatus)}}\n                status={{status}}\n                filters={{filters}}\n                @on-change={{this.onStatusChange($event)}}\n                @on-clear={{this.onClear()}}\n            ></Footer>\n        </section>';
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
                todoList: todoList.filter(function (item) {
                    return item.status === ACTIVE;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidG9kb212Yy5qcyIsInNvdXJjZXMiOlsiLi4vc3JjL2NvbXBvbmVudHMvSGVhZGVyLmpzIiwiLi4vc3JjL2NvbXBvbmVudHMvVG9kby5qcyIsIi4uL3NyYy9jb21wb25lbnRzL0Zvb3Rlci5qcyIsIi4uL3NyYy9jb21wb25lbnRzL0luZm8uanMiLCIuLi9zcmMvY29tcG9uZW50cy9NYWluLmpzIiwiLi4vc3JjL21ldGhvZHMvZmlsdGVyLmpzIiwiLi4vc3JjL21ldGhvZHMvbGlzdC5qcyIsIi4uL3NyYy9tZXRob2RzL3NpemUuanMiLCIuLi9zcmMvY29tcG9uZW50cy9JbmRleC5qcyIsIi4uL3NyYy90b2RvbXZjLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZVxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgSGVhZGVyIGV4dGVuZHMgRGFpc3kuQ29tcG9uZW50IHtcclxuICAgIHJlbmRlcigpIHtcbiAgICAgICAgcmV0dXJuIGA8aGVhZGVyIGNsYXNzPVwiaGVhZGVyXCI+XG4gICAgICAgICAgICA8aDE+e3t0b2Rvc319PC9oMT5cbiAgICAgICAgICAgIDx0ZW1wbGF0ZSA6aW5jbHVkZT17e3RoaXMuYm9keX19PjwvdGVtcGxhdGU+XG4gICAgICAgIDwvaGVhZGVyPmA7XG4gICAgfVxufSIsIi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZVxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVG9kb0l0ZW0gZXh0ZW5kcyBEYWlzeS5Db21wb25lbnQge1xyXG4gICAgcmVuZGVyKCkge1xuICAgICAgICByZXR1cm4gYFxuICAgICAgICAgICAgPGxpIGNsYXNzPVwidG9kbyB7eyEhc3RhdHVzID8gJ2NvbXBsZXRlZCc6ICcnfX1cIj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwidmlld1wiPlxuICAgICAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cImNoZWNrYm94XCIgXG4gICAgICAgICAgICAgICAgICAgICAgICBjbGFzcz1cInRvZ2dsZVwiIFxuICAgICAgICAgICAgICAgICAgICAgICAgY2hlY2tlZD17eyEhc3RhdHVzfX0gXG4gICAgICAgICAgICAgICAgICAgICAgICBAb24tY2xpY2s9e3t0aGlzLmVtaXQoJ2NsaWNrJywgbmFtZSl9fVxuICAgICAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICAgIDxsYWJlbD57e25hbWV9fTwvbGFiZWw+IDxidXR0b24gY2xhc3M9XCJkZXN0cm95XCIgQG9uLWNsaWNrPXt7dGhpcy5lbWl0KCdkZXN0cm95Jyl9fT48L2J1dHRvbj4gICAgXG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJ0ZXh0XCIgY2xhc3M9XCJlZGl0XCI+XG4gICAgICAgICAgICA8L2xpPmA7XG4gICAgfVxuXG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lXG4gICAgcGFyc2VkKGFzdCkge1xyXG4gICAgfVxufVxuIiwiLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBGb290ZXIgZXh0ZW5kcyBEYWlzeS5Db21wb25lbnR7XG4gICAgcmVuZGVyKCkge1xuICAgICAgICByZXR1cm4gYFxuICAgICAgICA8Zm9vdGVyIGNsYXNzPVwiZm9vdGVyXCI+XG4gICAgICAgICAgICA8c3BhbiBjbGFzcz1cInRvZG8tY291bnRcIj48c3Ryb25nPnt7c2l6ZX19PC9zdHJvbmc+IGl0ZW1zIGxlZnQ8L3NwYW4+XG4gICAgICAgICAgICA8dWwgY2xhc3M9XCJmaWx0ZXJzXCI+XG4gICAgICAgICAgICAgICAgPGxpIDpmb3I9e3tmaWx0ZXJzfX0+XG4gICAgICAgICAgICAgICAgICAgIDxhIGhyZWY9XCIjL2FsbFwiIGNsYXNzPVwie3tpdGVtLnR5cGUgPT09IHN0YXR1cz8gJ3NlbGVjdGVkJzogJyd9fVwiIEBvbi1jbGljaz17e3RoaXMub25GaWx0ZXJDbGljayhpdGVtLnR5cGUpfX0+e3tpdGVtLm5hbWV9fTwvYT5cbiAgICAgICAgICAgICAgICA8L2xpPlxuICAgICAgICAgICAgPC91bD5cbiAgICAgICAgICAgIDxidXR0b24gY2xhc3M9XCJjbGVhci1jb21wbGV0ZWRcIiBAb24tY2xpY2s9e3t0aGlzLmVtaXQoJ2NsZWFyJyl9fT5DbGVhciBjb21wbGV0ZWQ8L2J1dHRvbj5cbiAgICAgICAgPC9mb290ZXI+YDtcbiAgICB9XG5cbiAgICBvbkZpbHRlckNsaWNrKHR5cGUpIHtcbiAgICAgICAgdGhpcy5lbWl0KCdjaGFuZ2UnLCB0eXBlKTtcbiAgICB9XG59IiwiLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBJbmZvIGV4dGVuZHMgRGFpc3kuQ29tcG9uZW50IHtcclxuICAgIHJlbmRlcigpIHtcbiAgICAgICAgcmV0dXJuIGA8Zm9vdGVyIGNsYXNzPVwiaW5mb1wiPlxuXHRcdFx0PHA+RG91YmxlLWNsaWNrIHRvIGVkaXQgYSB0b2RvPC9wPlxuXHRcdFx0PHA+V3JpdHRlbiBieSA8YSBocmVmPVwiaHR0cDovL2V2YW55b3UubWVcIj5FdmFuIFlvdTwvYT48L3A+XG5cdFx0XHQ8cD5QYXJ0IG9mIDxhIGhyZWY9XCJodHRwOi8vdG9kb212Yy5jb21cIj5Ub2RvTVZDPC9hPjwvcD5cblx0XHQ8L2Zvb3Rlcj5gO1xuICAgIH1cbn0iLCIvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmVcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE1haW4gZXh0ZW5kcyBEYWlzeS5Db21wb25lbnQge1xyXG4gICAgcmVuZGVyKCkge1xuICAgICAgICByZXR1cm4gYDxzZWN0aW9uIGNsYXNzPVwibWFpblwiPjxpbnB1dCB0eXBlPVwiY2hlY2tib3hcIiBjbGFzcz1cInRvZ2dsZS1hbGxcIj4gXG4gICAgICAgICAgICA8dWwgY2xhc3M9XCJ0b2RvLWxpc3RcIj5cbiAgICAgICAgICAgICAgICA8dGVtcGxhdGUgOmluY2x1ZGU9e3t0aGlzLmJvZHl9fS8+XG4gICAgICAgICAgICA8L3VsPlxuICAgICAgICA8L3NlY3Rpb24+YDtcbiAgICB9XG59IiwiY29uc3QgZmlsdGVyID0gKHN0YXR1cywgcykgPT4gKHMgPT09IDIgPyB0cnVlIDogKHN0YXR1cyA9PT0gcykpO1xuZXhwb3J0IGRlZmF1bHQgZmlsdGVyOyIsImltcG9ydCBmaWx0ZXIgZnJvbSAnLi9maWx0ZXInO1xuXG5jb25zdCBsaXN0ID0gKGxpc3QsIHMpID0+IGxpc3QuZmlsdGVyKGl0ZW0gPT4gaXRlbS5zdGF0dXMgPT09IHMpO1xuXG5leHBvcnQgZGVmYXVsdCBsaXN0OyIsImltcG9ydCBsaXN0IGZyb20gJy4vbGlzdCc7XG5cbmNvbnN0IHNpemUgPSAobGksIHMpID0+IGxpc3QobGksIHMpLmxlbmd0aDtcblxuZXhwb3J0IGRlZmF1bHQgc2l6ZTsiLCJpbXBvcnQgSGVhZGVyIGZyb20gJy4vSGVhZGVyJztcbmltcG9ydCBUb2RvIGZyb20gJy4vVG9kbyc7XG5pbXBvcnQgRm9vdGVyIGZyb20gJy4vRm9vdGVyJztcbmltcG9ydCBJbmZvIGZyb20gJy4vSW5mbyc7XG5pbXBvcnQgTWFpbiBmcm9tICcuL01haW4nO1xuaW1wb3J0IGZpbHRlciBmcm9tICcuLi9tZXRob2RzL2ZpbHRlcic7XG5pbXBvcnQgbGlzdCBmcm9tICcuLi9tZXRob2RzL2xpc3QnO1xuaW1wb3J0IHNpemUgZnJvbSAnLi4vbWV0aG9kcy9zaXplJztcblxuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lXG5jb25zdCB7Y29tcG9uZW50LCBtZXRob2QsIGRpcmVjdGl2ZSwgZXZlbnQsIGNvbXB1dGVkfSA9IERhaXN5LmFubm90YXRpb25zO1xuXG5jb25zdCBBTEwgPSAyO1xuY29uc3QgQUNUSVZFID0gMDtcbmNvbnN0IENPTVBMRVRFRCA9IDE7XG5cbkBjb21wb25lbnQoe1RvZG8sIEhlYWRlciwgRm9vdGVyLCBJbmZvLCBNYWlufSlcbkBtZXRob2Qoe2ZpbHRlciwgc2l6ZSwgbGlzdH0pXG5AZGlyZWN0aXZlKClcbkBldmVudCgpXG5AY29tcHV0ZWQoeyBcbiAgICB0b2RvcygpIHtcbiAgICAgICAgcmV0dXJuICd0b2Rvcyc7XG4gICAgfVxufSlcbi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZVxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ29tcG9uZW50IGV4dGVuZHMgRGFpc3kuQ29tcG9uZW50IHtcbiAgICBzdGF0ZSgpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGhpc3Rvcnk6IFtdLFxuICAgICAgICAgICAgc3RhdHVzOiBBTEwsXG4gICAgICAgICAgICB0b2RvTGlzdDogW10sXG4gICAgICAgICAgICBhY3RpdmVTdGF0dXM6IEFDVElWRSxcbiAgICAgICAgICAgIGZpbHRlcnM6IFtcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIG5hbWU6ICdBbGwnLFxuICAgICAgICAgICAgICAgICAgICB0eXBlOiBBTExcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogJ0FjdGl2ZScsXG4gICAgICAgICAgICAgICAgICAgIHR5cGU6IEFDVElWRVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBuYW1lOiAnY29tcGxldGVkJyxcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogQ09NUExFVEVEXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgXVxuICAgICAgICB9O1xuICAgIH1cbiAgICByZW5kZXIoKSB7XG4gICAgICAgIHJldHVybiBgPHNlY3Rpb24gY2xhc3M9XCJ0b2RvYXBwXCI+XG4gICAgICAgICAgICA8SGVhZGVyXG4gICAgICAgICAgICAgICAgdGl0bGU9e3t0b2Rvc319XG4gICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgPGlucHV0XG4gICAgICAgICAgICAgICAgICAgIGF1dG9mb2N1cz1cImF1dG9mb2N1c1wiXG4gICAgICAgICAgICAgICAgICAgIGF1dG9jb21wbGV0ZT1cIm9mZlwiXG4gICAgICAgICAgICAgICAgICAgIHBsYWNlaG9sZGVyPVwiV2hhdCBuZWVkcyB0byBiZSBkb25lP1wiXG4gICAgICAgICAgICAgICAgICAgIGNsYXNzPVwibmV3LXRvZG9cIlxuICAgICAgICAgICAgICAgICAgICBAb24ta2V5ZG93bj17e3RoaXMub25LZXlEb3duKCRldmVudCl9fVxuICAgICAgICAgICAgICAgICAgICBAcmVmPVwiaW5wdXRcIlxuICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgIDwvSGVhZGVyPlxuICAgICAgICAgICAgPE1haW4+XG4gICAgICAgICAgICAgICAgPFRvZG9cbiAgICAgICAgICAgICAgICAgICAgOmZvcj17e3RvZG9MaXN0fX1cbiAgICAgICAgICAgICAgICAgICAgOmlmPXt7ZmlsdGVyKGl0ZW0uc3RhdHVzLCBzdGF0dXMpfX1cbiAgICAgICAgICAgICAgICAgICAgbmFtZT17e2l0ZW0ubmFtZX19XG4gICAgICAgICAgICAgICAgICAgIHN0YXR1cz17e2l0ZW0uc3RhdHVzfX1cbiAgICAgICAgICAgICAgICAgICAgQG9uLWNsaWNrPXt7dGhpcy5vblRvZG9DbGljayhpdGVtLCAkZXZlbnQpfX1cbiAgICAgICAgICAgICAgICAgICAgQG9uLWRlc3Ryb3k9e3t0aGlzLm9uRGVzdHJveShpbmRleCl9fVxuICAgICAgICAgICAgICAgID48L1RvZG8+XG4gICAgICAgICAgICA8L01haW4+XG4gICAgICAgICAgICA8Rm9vdGVyXG4gICAgICAgICAgICAgICAgOmlmPXt7dG9kb0xpc3QubGVuZ3RoID4gMH19XG4gICAgICAgICAgICAgICAgc2l6ZT17e3NpemUodG9kb0xpc3QsIGFjdGl2ZVN0YXR1cyl9fVxuICAgICAgICAgICAgICAgIHN0YXR1cz17e3N0YXR1c319XG4gICAgICAgICAgICAgICAgZmlsdGVycz17e2ZpbHRlcnN9fVxuICAgICAgICAgICAgICAgIEBvbi1jaGFuZ2U9e3t0aGlzLm9uU3RhdHVzQ2hhbmdlKCRldmVudCl9fVxuICAgICAgICAgICAgICAgIEBvbi1jbGVhcj17e3RoaXMub25DbGVhcigpfX1cbiAgICAgICAgICAgID48L0Zvb3Rlcj5cbiAgICAgICAgPC9zZWN0aW9uPmA7XG4gICAgfVxuICAgIGNvbnN0cnVjdG9yKG9wdGlvbnMpIHtcbiAgICAgICAgc3VwZXIob3B0aW9ucyk7XG4gICAgICAgIHRoaXMub24oJ2RlbGV0ZWQnLCBmdW5jdGlvbihtc2cpIHtcbiAgICAgICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZVxuICAgICAgICAgICAgY29uc29sZS5sb2coJ2RlbGV0ZWQ6ICcgKyBtc2cubmFtZSk7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBvbktleURvd24oe2tleUNvZGV9KSB7XG4gICAgICAgIGlmIChrZXlDb2RlID09PSAxMykge1xuICAgICAgICAgICAgY29uc3QgdmFsdWUgPSB0aGlzLnJlZnMuaW5wdXQudmFsdWU7XG4gICAgICAgICAgICB0aGlzLmFkZCh2YWx1ZSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBvblRvZG9DbGljayh0b2RvKSB7XG4gICAgICAgIGxldCB0b2RvTGlzdCA9IHRoaXMuZ2V0U3RhdGUoKS50b2RvTGlzdDtcbiAgICAgICAgY29uc3QgaW5kZXggPSB0b2RvTGlzdC5pbmRleE9mKHRvZG9MaXN0LmZpbHRlcigoe25hbWV9KSA9PiBuYW1lID09PSB0b2RvLm5hbWUgKVswXSk7XG4gICAgICAgIFxuICAgICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgICAgIHRvZG9MaXN0OiBbXG4gICAgICAgICAgICAgICAgLi4udG9kb0xpc3Quc2xpY2UoMCwgaW5kZXgpLFxuICAgICAgICAgICAgICAgIE9iamVjdC5hc3NpZ24oe30sIHRvZG8sIHtcbiAgICAgICAgICAgICAgICAgICAgc3RhdHVzOiBOdW1iZXIoIXRvZG8uc3RhdHVzKVxuICAgICAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgICAgIC4uLnRvZG9MaXN0LnNsaWNlKGluZGV4KzEpXG4gICAgICAgICAgICBdXG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIG9uRGVzdHJveShpbmRleCkge1xuICAgICAgICBsZXQgdG9kb0xpc3QgPSB0aGlzLmdldFN0YXRlKCkudG9kb0xpc3Q7XG4gICAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICAgICAgdG9kb0xpc3Q6IFtcbiAgICAgICAgICAgICAgICAuLi50b2RvTGlzdC5zbGljZSgwLCBpbmRleCksXG4gICAgICAgICAgICAgICAgLi4udG9kb0xpc3Quc2xpY2UoaW5kZXgrMSlcbiAgICAgICAgICAgIF1cbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgYWRkKHZhbHVlKSB7XG4gICAgICAgIGNvbnN0IHRvZG9MaXN0ID0gdGhpcy5nZXRTdGF0ZSgpLnRvZG9MaXN0O1xuICAgICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgICAgIHRvZG9MaXN0OiBbXG4gICAgICAgICAgICAgICAgLi4udG9kb0xpc3QsXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBuYW1lOiB2YWx1ZSxcbiAgICAgICAgICAgICAgICAgICAgc3RhdHVzOiAwXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgXVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBvblN0YXR1c0NoYW5nZShzdGF0dXMpIHtcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgICAgICBzdGF0dXNcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgb25DbGVhcigpIHtcbiAgICAgICAgY29uc3QgdG9kb0xpc3QgPSB0aGlzLmdldFN0YXRlKCkudG9kb0xpc3Q7XG5cbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgICAgICB0b2RvTGlzdDogdG9kb0xpc3QuZmlsdGVyKChpdGVtKSA9PiBpdGVtLnN0YXR1cyA9PT0gQUNUSVZFKVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmVcbiAgICBwYXJzZWQoKSB7XG4gICAgfVxuXG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lXG4gICAgcmVhZHkoKSB7XG4gICAgfVxuXG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lXG4gICAgbW91bnRlZChkb20pIHtcbiAgICB9XG5cbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmVcbiAgICBwYXRjaGVkKGRvbSkge1xuICAgIH1cblxuICAgIG9uUmVzZXQoKSB7XG4gICAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICAgICAgdG9kb0xpc3Q6IHRoaXMuc3RhdGUudG9kb0xpc3RcbiAgICAgICAgfSk7XG4gICAgfVxufSIsImltcG9ydCBJbmRleCBmcm9tICcuL2NvbXBvbmVudHMvSW5kZXgnO1xyXG5uZXcgSW5kZXgoe1xyXG4gICAgc3RhdGU6IHt9XHJcbn0pLm1vdW50KGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNhcHAnKSk7Il0sIm5hbWVzIjpbIkhlYWRlciIsIkRhaXN5IiwiQ29tcG9uZW50IiwiVG9kb0l0ZW0iLCJhc3QiLCJGb290ZXIiLCJ0eXBlIiwiZW1pdCIsIkluZm8iLCJNYWluIiwiZmlsdGVyIiwic3RhdHVzIiwicyIsImxpc3QiLCJpdGVtIiwic2l6ZSIsImxpIiwibGVuZ3RoIiwiYW5ub3RhdGlvbnMiLCJjb21wb25lbnQiLCJtZXRob2QiLCJkaXJlY3RpdmUiLCJldmVudCIsImNvbXB1dGVkIiwiQUxMIiwiQUNUSVZFIiwiQ09NUExFVEVEIiwiVG9kbyIsIm9wdGlvbnMiLCJvbiIsIm1zZyIsImxvZyIsIm5hbWUiLCJrZXlDb2RlIiwidmFsdWUiLCJyZWZzIiwiaW5wdXQiLCJhZGQiLCJ0b2RvIiwidG9kb0xpc3QiLCJnZXRTdGF0ZSIsImluZGV4IiwiaW5kZXhPZiIsInNldFN0YXRlIiwic2xpY2UiLCJPYmplY3QiLCJhc3NpZ24iLCJOdW1iZXIiLCJkb20iLCJzdGF0ZSIsIkluZGV4IiwibW91bnQiLCJkb2N1bWVudCIsInF1ZXJ5U2VsZWN0b3Ii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
