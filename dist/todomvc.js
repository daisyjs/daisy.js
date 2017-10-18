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
var Header = function (_Daisy) {
    inherits(Header, _Daisy);

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
}(Daisy);

// eslint-disable-next-line
var TodoItem = function (_Daisy) {
    inherits(TodoItem, _Daisy);

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
}(Daisy);

// eslint-disable-next-line
var Footer = function (_Daisy) {
    inherits(Footer, _Daisy);

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
}(Daisy);

// eslint-disable-next-line
var Info = function (_Daisy) {
				inherits(Info, _Daisy);

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
}(Daisy);

// eslint-disable-next-line
var Main = function (_Daisy) {
    inherits(Main, _Daisy);

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
}(Daisy);

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
}), _dec(_class = _dec2(_class = _dec3(_class = _dec4(_class = _dec5(_class = function (_Daisy) {
    inherits(Component, _Daisy);
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
}(Daisy)) || _class) || _class) || _class) || _class) || _class);

new Component({
    state: {}
}).mount(document.querySelector('#app'));

})));
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidG9kb212Yy5qcyIsInNvdXJjZXMiOlsiLi4vc3JjL2NvbXBvbmVudHMvSGVhZGVyLmpzIiwiLi4vc3JjL2NvbXBvbmVudHMvVG9kby5qcyIsIi4uL3NyYy9jb21wb25lbnRzL0Zvb3Rlci5qcyIsIi4uL3NyYy9jb21wb25lbnRzL0luZm8uanMiLCIuLi9zcmMvY29tcG9uZW50cy9NYWluLmpzIiwiLi4vc3JjL21ldGhvZHMvZmlsdGVyLmpzIiwiLi4vc3JjL21ldGhvZHMvbGlzdC5qcyIsIi4uL3NyYy9tZXRob2RzL3NpemUuanMiLCIuLi9zcmMvY29tcG9uZW50cy9JbmRleC5qcyIsIi4uL3NyYy90b2RvbXZjLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZVxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBIZWFkZXIgZXh0ZW5kcyBEYWlzeSB7XHJcbiAgICByZW5kZXIoKSB7XHJcbiAgICAgICAgcmV0dXJuIGA8aGVhZGVyIGNsYXNzPVwiaGVhZGVyXCI+XHJcbiAgICAgICAgICAgIDxoMT57e3RvZG9zfX08L2gxPlxyXG4gICAgICAgICAgICA8dGVtcGxhdGUgOmluY2x1ZGU9e3t0aGlzLmJvZHl9fT48L3RlbXBsYXRlPlxyXG4gICAgICAgIDwvaGVhZGVyPmA7XHJcbiAgICB9XHJcbn0iLCIvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmVcclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVG9kb0l0ZW0gZXh0ZW5kcyBEYWlzeSB7XHJcbiAgICByZW5kZXIoKSB7XHJcbiAgICAgICAgcmV0dXJuIGBcclxuICAgICAgICAgICAgPGxpIGNsYXNzPVwidG9kbyB7eyEhc3RhdHVzID8gJ2NvbXBsZXRlZCc6ICcnfX1cIj5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJ2aWV3XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJjaGVja2JveFwiIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjbGFzcz1cInRvZ2dsZVwiIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjaGVja2VkPXt7ISFzdGF0dXN9fSBcclxuICAgICAgICAgICAgICAgICAgICAgICAgQG9uLWNsaWNrPXt7dGhpcy5lbWl0KCdjbGljaycsIG5hbWUpfX1cclxuICAgICAgICAgICAgICAgICAgICA+XHJcbiAgICAgICAgICAgICAgICAgICAgPGxhYmVsPnt7bmFtZX19PC9sYWJlbD4gPGJ1dHRvbiBjbGFzcz1cImRlc3Ryb3lcIiBAb24tY2xpY2s9e3t0aGlzLmVtaXQoJ2Rlc3Ryb3knKX19PjwvYnV0dG9uPiAgICBcclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJ0ZXh0XCIgY2xhc3M9XCJlZGl0XCI+XHJcbiAgICAgICAgICAgIDwvbGk+YDtcclxuICAgIH1cclxuXHJcbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmVcclxuICAgIHBhcnNlZChhc3QpIHtcclxuICAgIH1cclxufVxyXG4iLCIvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmVcclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRm9vdGVyIGV4dGVuZHMgRGFpc3l7XHJcbiAgICByZW5kZXIoKSB7XHJcbiAgICAgICAgcmV0dXJuIGBcclxuICAgICAgICA8Zm9vdGVyIGNsYXNzPVwiZm9vdGVyXCI+XHJcbiAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwidG9kby1jb3VudFwiPjxzdHJvbmc+e3tzaXplfX08L3N0cm9uZz4gaXRlbXMgbGVmdDwvc3Bhbj5cclxuICAgICAgICAgICAgPHVsIGNsYXNzPVwiZmlsdGVyc1wiPlxyXG4gICAgICAgICAgICAgICAgPGxpIDpmb3I9e3tzdGF0dXNMaXN0fX0+XHJcbiAgICAgICAgICAgICAgICAgICAgPGEgaHJlZj1cIiMvYWxsXCIgY2xhc3M9XCJ7e2l0ZW0udHlwZSA9PT0gc3RhdHVzPyAnc2VsZWN0ZWQnOiAnJ319XCIgQG9uLWNsaWNrPXt7dGhpcy5vbkZpbHRlckNsaWNrKGl0ZW0udHlwZSl9fT57e2l0ZW0ubmFtZX19PC9hPlxyXG4gICAgICAgICAgICAgICAgPC9saT5cclxuICAgICAgICAgICAgPC91bD5cclxuICAgICAgICAgICAgPGJ1dHRvbiBjbGFzcz1cImNsZWFyLWNvbXBsZXRlZFwiIEBvbi1jbGljaz17e3RoaXMuZW1pdCgnY2xlYXInKX19PkNsZWFyIGNvbXBsZXRlZDwvYnV0dG9uPlxyXG4gICAgICAgIDwvZm9vdGVyPmA7XHJcbiAgICB9XHJcblxyXG4gICAgb25GaWx0ZXJDbGljayh0eXBlKSB7XHJcbiAgICAgICAgdGhpcy5lbWl0KCdjaGFuZ2UnLCB0eXBlKTtcclxuICAgIH1cclxufSIsIi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZVxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBJbmZvIGV4dGVuZHMgRGFpc3kge1xyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIHJldHVybiBgPGZvb3RlciBjbGFzcz1cImluZm9cIj5cclxuXHRcdFx0PHA+RG91YmxlLWNsaWNrIHRvIGVkaXQgYSB0b2RvPC9wPlxyXG5cdFx0XHQ8cD5Xcml0dGVuIGJ5IDxhIGhyZWY9XCJodHRwOi8vZXZhbnlvdS5tZVwiPkV2YW4gWW91PC9hPjwvcD5cclxuXHRcdFx0PHA+UGFydCBvZiA8YSBocmVmPVwiaHR0cDovL3RvZG9tdmMuY29tXCI+VG9kb01WQzwvYT48L3A+XHJcblx0XHQ8L2Zvb3Rlcj5gO1xyXG4gICAgfVxyXG59IiwiLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE1haW4gZXh0ZW5kcyBEYWlzeSB7XHJcbiAgICByZW5kZXIoKSB7XHJcbiAgICAgICAgcmV0dXJuIGA8c2VjdGlvbiBjbGFzcz1cIm1haW5cIj48aW5wdXQgdHlwZT1cImNoZWNrYm94XCIgY2xhc3M9XCJ0b2dnbGUtYWxsXCI+IFxyXG4gICAgICAgICAgICA8dWwgY2xhc3M9XCJ0b2RvLWxpc3RcIj5cclxuICAgICAgICAgICAgICAgIDx0ZW1wbGF0ZSA6aW5jbHVkZT17e3RoaXMuYm9keX19Lz5cclxuICAgICAgICAgICAgPC91bD5cclxuICAgICAgICA8L3NlY3Rpb24+YDtcclxuICAgIH1cclxufSIsImNvbnN0IGZpbHRlciA9IChzdGF0dXMsIHMpID0+IChzID09PSAyID8gdHJ1ZSA6IChzdGF0dXMgPT09IHMpKTtcclxuZXhwb3J0IGRlZmF1bHQgZmlsdGVyOyIsImltcG9ydCBmaWx0ZXIgZnJvbSAnLi9maWx0ZXInO1xyXG5cclxuY29uc3QgbGlzdCA9IChsaXN0LCBzKSA9PiBsaXN0LmZpbHRlcihpdGVtID0+IGZpbHRlcihpdGVtLnN0YXR1cywgcykpO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgbGlzdDsiLCJpbXBvcnQgbGlzdCBmcm9tICcuL2xpc3QnO1xyXG5cclxuY29uc3Qgc2l6ZSA9IChsaSwgcykgPT4gbGlzdChsaSwgcykubGVuZ3RoO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgc2l6ZTsiLCJpbXBvcnQgSGVhZGVyIGZyb20gJy4vSGVhZGVyJztcclxuaW1wb3J0IFRvZG8gZnJvbSAnLi9Ub2RvJztcclxuaW1wb3J0IEZvb3RlciBmcm9tICcuL0Zvb3Rlcic7XHJcbmltcG9ydCBJbmZvIGZyb20gJy4vSW5mbyc7XHJcbmltcG9ydCBNYWluIGZyb20gJy4vTWFpbic7XHJcbmltcG9ydCBmaWx0ZXIgZnJvbSAnLi4vbWV0aG9kcy9maWx0ZXInO1xyXG5pbXBvcnQgbGlzdCBmcm9tICcuLi9tZXRob2RzL2xpc3QnO1xyXG5pbXBvcnQgc2l6ZSBmcm9tICcuLi9tZXRob2RzL3NpemUnO1xyXG5cclxuY29uc3Qge2NvbXBvbmVudCwgbWV0aG9kLCBkaXJlY3RpdmUsIGV2ZW50LCBjb21wdXRlZH0gPSBEYWlzeS5hbm5vdGF0aW9ucztcclxuXHJcbkBjb21wb25lbnQoe1RvZG8sIEhlYWRlciwgRm9vdGVyLCBJbmZvLCBNYWlufSlcclxuQG1ldGhvZCh7ZmlsdGVyLCBzaXplLCBsaXN0fSlcclxuQGRpcmVjdGl2ZSgpXHJcbkBldmVudCgpXHJcbkBjb21wdXRlZCh7IFxyXG4gICAgdG9kb3MoKSB7XHJcbiAgICAgICAgcmV0dXJuICd0b2Rvcyc7XHJcbiAgICB9XHJcbn0pXHJcbi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZVxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDb21wb25lbnQgZXh0ZW5kcyBEYWlzeSB7XHJcbiAgICBzdGF0ZSgpIHtcclxuICAgICAgICByZXR1cm4gT2JqZWN0LmFzc2lnbihcclxuICAgICAgICAgICAgc3VwZXIuc3RhdGUoKSwge1xyXG4gICAgICAgICAgICAgICAgaGlzdG9yeTogW10sXHJcbiAgICAgICAgICAgICAgICBzdGF0dXM6IDIsXHJcbiAgICAgICAgICAgICAgICB0b2RvTGlzdDogW1xyXG4gICAgICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgICAgIHN0YXR1c0xpc3Q6IFtcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6ICdBbGwnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAyXHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6ICdBY3RpdmUnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAwXHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6ICdjb21wbGV0ZWQnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAxXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgXVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgKTtcclxuICAgIH1cclxuICAgIHJlbmRlcigpIHtcclxuICAgICAgICByZXR1cm4gYDxzZWN0aW9uIGNsYXNzPVwidG9kb2FwcFwiPlxyXG4gICAgICAgICAgICA8SGVhZGVyXHJcbiAgICAgICAgICAgICAgICB0aXRsZT17e3RvZG9zfX1cclxuICAgICAgICAgICAgPlxyXG4gICAgICAgICAgICAgICAgPGlucHV0XHJcbiAgICAgICAgICAgICAgICAgICAgYXV0b2ZvY3VzPVwiYXV0b2ZvY3VzXCJcclxuICAgICAgICAgICAgICAgICAgICBhdXRvY29tcGxldGU9XCJvZmZcIlxyXG4gICAgICAgICAgICAgICAgICAgIHBsYWNlaG9sZGVyPVwiV2hhdCBuZWVkcyB0byBiZSBkb25lP1wiXHJcbiAgICAgICAgICAgICAgICAgICAgY2xhc3M9XCJuZXctdG9kb1wiXHJcbiAgICAgICAgICAgICAgICAgICAgQG9uLWtleWRvd249e3t0aGlzLm9uS2V5RG93bigkZXZlbnQpfX1cclxuICAgICAgICAgICAgICAgICAgICBAcmVmPVwiaW5wdXRcIlxyXG4gICAgICAgICAgICAgICAgPlxyXG4gICAgICAgICAgICA8L0hlYWRlcj5cclxuICAgICAgICAgICAgPE1haW4+XHJcbiAgICAgICAgICAgICAgICA8VG9kb1xyXG4gICAgICAgICAgICAgICAgICAgIDpmb3I9e3t0b2RvTGlzdH19XHJcbiAgICAgICAgICAgICAgICAgICAgOmlmPXt7ZmlsdGVyKGl0ZW0uc3RhdHVzLCBzdGF0dXMpfX1cclxuICAgICAgICAgICAgICAgICAgICBuYW1lPXt7aXRlbS5uYW1lfX1cclxuICAgICAgICAgICAgICAgICAgICBzdGF0dXM9e3tpdGVtLnN0YXR1c319XHJcbiAgICAgICAgICAgICAgICAgICAgQG9uLWNsaWNrPXt7dGhpcy5vblRvZG9DbGljayhpdGVtLCAkZXZlbnQpfX1cclxuICAgICAgICAgICAgICAgICAgICBAb24tZGVzdHJveT17e3RoaXMub25EZXN0cm95KGluZGV4KX19XHJcbiAgICAgICAgICAgICAgICA+PC9Ub2RvPlxyXG4gICAgICAgICAgICA8L01haW4+XHJcbiAgICAgICAgICAgIDxGb290ZXJcclxuICAgICAgICAgICAgICAgIDppZj17e3RvZG9MaXN0Lmxlbmd0aCA+IDB9fVxyXG4gICAgICAgICAgICAgICAgc2l6ZT17e3NpemUodG9kb0xpc3QsIHN0YXR1cyl9fVxyXG4gICAgICAgICAgICAgICAgc3RhdHVzPXt7c3RhdHVzfX1cclxuICAgICAgICAgICAgICAgIHN0YXR1c0xpc3Q9e3tzdGF0dXNMaXN0fX1cclxuICAgICAgICAgICAgICAgIEBvbi1jaGFuZ2U9e3t0aGlzLm9uU3RhdHVzQ2hhbmdlKCRldmVudCl9fVxyXG4gICAgICAgICAgICAgICAgQG9uLWNsZWFyPXt7dGhpcy5vbkNsZWFyKCl9fVxyXG4gICAgICAgICAgICA+PC9Gb290ZXI+XHJcbiAgICAgICAgPC9zZWN0aW9uPmA7XHJcbiAgICB9XHJcbiAgICBjb25zdHJ1Y3RvcihvcHRpb25zKSB7XHJcbiAgICAgICAgc3VwZXIob3B0aW9ucyk7XHJcbiAgICAgICAgdGhpcy5vbignZGVsZXRlZCcsIGZ1bmN0aW9uKG1zZykge1xyXG4gICAgICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmVcclxuICAgICAgICAgICAgY29uc29sZS5sb2coJ2RlbGV0ZWQ6ICcgKyBtc2cubmFtZSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICBvbktleURvd24oe2tleUNvZGV9KSB7XHJcbiAgICAgICAgaWYgKGtleUNvZGUgPT09IDEzKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHZhbHVlID0gdGhpcy5yZWZzLmlucHV0LnZhbHVlO1xyXG4gICAgICAgICAgICB0aGlzLmFkZCh2YWx1ZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIG9uVG9kb0NsaWNrKHRvZG8pIHtcclxuICAgICAgICBsZXQgdG9kb0xpc3QgPSB0aGlzLmdldFN0YXRlKCkudG9kb0xpc3Q7XHJcbiAgICAgICAgY29uc3QgaW5kZXggPSB0b2RvTGlzdC5pbmRleE9mKHRvZG9MaXN0LmZpbHRlcigoe25hbWV9KSA9PiBuYW1lID09PSB0b2RvLm5hbWUgKVswXSk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XHJcbiAgICAgICAgICAgIHRvZG9MaXN0OiBbXHJcbiAgICAgICAgICAgICAgICAuLi50b2RvTGlzdC5zbGljZSgwLCBpbmRleCksXHJcbiAgICAgICAgICAgICAgICBPYmplY3QuYXNzaWduKHt9LCB0b2RvLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgc3RhdHVzOiBOdW1iZXIoIXRvZG8uc3RhdHVzKVxyXG4gICAgICAgICAgICAgICAgfSksXHJcbiAgICAgICAgICAgICAgICAuLi50b2RvTGlzdC5zbGljZShpbmRleCsxKVxyXG4gICAgICAgICAgICBdXHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgb25EZXN0cm95KGluZGV4KSB7XHJcbiAgICAgICAgbGV0IHRvZG9MaXN0ID0gdGhpcy5nZXRTdGF0ZSgpLnRvZG9MaXN0O1xyXG4gICAgICAgIHRoaXMuc2V0U3RhdGUoe1xyXG4gICAgICAgICAgICB0b2RvTGlzdDogW1xyXG4gICAgICAgICAgICAgICAgLi4udG9kb0xpc3Quc2xpY2UoMCwgaW5kZXgpLFxyXG4gICAgICAgICAgICAgICAgLi4udG9kb0xpc3Quc2xpY2UoaW5kZXgrMSlcclxuICAgICAgICAgICAgXVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGFkZCh2YWx1ZSkge1xyXG4gICAgICAgIGNvbnN0IHRvZG9MaXN0ID0gdGhpcy5nZXRTdGF0ZSgpLnRvZG9MaXN0O1xyXG4gICAgICAgIHRoaXMuc2V0U3RhdGUoe1xyXG4gICAgICAgICAgICB0b2RvTGlzdDogW1xyXG4gICAgICAgICAgICAgICAgLi4udG9kb0xpc3QsXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogdmFsdWUsXHJcbiAgICAgICAgICAgICAgICAgICAgc3RhdHVzOiAwXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIF1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBvblN0YXR1c0NoYW5nZShzdGF0dXMpIHtcclxuICAgICAgICB0aGlzLnNldFN0YXRlKHtcclxuICAgICAgICAgICAgc3RhdHVzXHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgb25DbGVhcigpIHtcclxuICAgICAgICBjb25zdCB0b2RvTGlzdCA9IHRoaXMuZ2V0U3RhdGUoKS50b2RvTGlzdDtcclxuXHJcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XHJcbiAgICAgICAgICAgIHRvZG9MaXN0OiB0b2RvTGlzdC5tYXAoKGl0ZW0pID0+IE9iamVjdC5hc3NpZ24oe30sIGl0ZW0sIHtzdGF0dXM6IDB9KSlcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmVcclxuICAgIHBhcnNlZCgpIHtcclxuICAgIH1cclxuXHJcbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmVcclxuICAgIHJlYWR5KCkge1xyXG4gICAgfVxyXG5cclxuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZVxyXG4gICAgbW91bnRlZChkb20pIHtcclxuICAgIH1cclxuXHJcbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmVcclxuICAgIHBhdGNoZWQoZG9tKSB7XHJcbiAgICB9XHJcblxyXG4gICAgb25SZXNldCgpIHtcclxuICAgICAgICB0aGlzLnNldFN0YXRlKHtcclxuICAgICAgICAgICAgdG9kb0xpc3Q6IHRoaXMuc3RhdGUudG9kb0xpc3RcclxuICAgICAgICB9KTtcclxuICAgIH1cclxufSIsImltcG9ydCBJbmRleCBmcm9tICcuL2NvbXBvbmVudHMvSW5kZXgnO1xyXG5uZXcgSW5kZXgoe1xyXG4gICAgc3RhdGU6IHt9XHJcbn0pLm1vdW50KGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNhcHAnKSk7Il0sIm5hbWVzIjpbIkhlYWRlciIsIkRhaXN5IiwiVG9kb0l0ZW0iLCJhc3QiLCJGb290ZXIiLCJ0eXBlIiwiZW1pdCIsIkluZm8iLCJNYWluIiwiZmlsdGVyIiwic3RhdHVzIiwicyIsImxpc3QiLCJpdGVtIiwic2l6ZSIsImxpIiwibGVuZ3RoIiwiYW5ub3RhdGlvbnMiLCJjb21wb25lbnQiLCJtZXRob2QiLCJkaXJlY3RpdmUiLCJldmVudCIsImNvbXB1dGVkIiwiQ29tcG9uZW50IiwiVG9kbyIsIk9iamVjdCIsImFzc2lnbiIsIm9wdGlvbnMiLCJvbiIsIm1zZyIsImxvZyIsIm5hbWUiLCJrZXlDb2RlIiwidmFsdWUiLCJyZWZzIiwiaW5wdXQiLCJhZGQiLCJ0b2RvIiwidG9kb0xpc3QiLCJnZXRTdGF0ZSIsImluZGV4IiwiaW5kZXhPZiIsInNldFN0YXRlIiwic2xpY2UiLCJOdW1iZXIiLCJtYXAiLCJkb20iLCJzdGF0ZSIsIkluZGV4IiwibW91bnQiLCJkb2N1bWVudCIsInF1ZXJ5U2VsZWN0b3IiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBO0lBQ3FCQTs7Ozs7Ozs7OztpQ0FDUjs7Ozs7RUFEdUJDOztBQ0RwQztJQUNxQkM7Ozs7Ozs7Ozs7aUNBQ1I7Ozs7Ozs7OytCQWdCRkMsS0FBSzs7O0VBakJzQkY7O0FDRHRDO0lBQ3FCRzs7Ozs7Ozs7OztpQ0FDUjs7Ozs7c0NBYUtDLE1BQU07aUJBQ1hDLElBQUwsQ0FBVSxRQUFWLEVBQW9CRCxJQUFwQjs7OztFQWY0Qko7O0FDRHBDO0lBQ3FCTTs7Ozs7Ozs7OztpQ0FDUjs7Ozs7RUFEcUJOOztB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
