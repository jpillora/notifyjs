/** Notify.js - v0.0.1 - 2013/06/03
 * http://notifyjs.com/
 * Copyright (c) 2013 Jaime Pillora - MIT
 */
(function(window,document,undefined) {
'use strict';

var Notification, addStyle, className, coreStyle, cornerElem, createElem, defaultStyle, defaultStyleName, getAnchorElement, hAligns, incr, inherit, insertCSS, mainPositions, opposites, options, parsePosition, pluginName, pluginOptions, positions, realign, styles, vAligns,
  __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

pluginName = 'notify';

className = pluginName + 'js';

positions = {
  t: 'top',
  m: 'middle',
  b: 'bottom',
  l: 'left',
  c: 'center',
  r: 'right'
};

hAligns = ['l', 'c', 'r'];

vAligns = ['t', 'm', 'b'];

mainPositions = ['t', 'b', 'l', 'r'];

opposites = {
  t: 'b',
  m: null,
  b: 't',
  l: 'r',
  c: null,
  r: 'l'
};

parsePosition = function(str) {
  var pos;
  pos = [];
  $.each(str.split(/\W+/), function(i, word) {
    var w;
    w = word.toLowerCase().charAt(0);
    if (positions[w]) {
      return pos.push(w);
    }
  });
  return pos;
};

styles = {};

coreStyle = {
  name: 'core',
  html: "<div class=\"" + className + "-wrapper\">\n  <div class=\"" + className + "-arrow\"></div>\n  <div class=\"" + className + "-container\"></div>\n</div>",
  css: "." + className + "-corner {\n  position: fixed;\n  top: 0;\n  right: 0;\n  margin: 5px;\n  z-index: 1050;\n}\n\n." + className + "-corner ." + className + "-wrapper,\n." + className + "-corner ." + className + "-container {\n  position: relative;\n  display: block;\n  height: inherit;\n  width: inherit;\n}\n\n." + className + "-wrapper {\n  z-index: 1;\n  position: absolute;\n  display: inline-block;\n  height: 0;\n  width: 0;\n}\n\n." + className + "-container {\n  display: none;\n  z-index: 1;\n  position: absolute;\n  cursor: pointer;\n}\n\n." + className + "-text {\n  position: relative;\n}\n\n." + className + "-arrow {\n  position: absolute;\n  z-index: 2;\n  width: 0;\n  height: 0;\n}"
};

defaultStyleName = "bootstrap";

defaultStyle = {
  html: "<div>\n  <span data-notify-text></span>\n</div>",
  classes: {
    base: "padding: 8px 35px 8px 14px;\ntext-shadow: 0 1px 0 rgba(255, 255, 255, 0.5);\nbackground-color: #fcf8e3;\nborder: 1px solid #fbeed5;\n-webkit-border-radius: 4px;\n-moz-border-radius: 4px;\nborder-radius: 4px;\nwhite-space: nowrap;",
    error: "color: #B94A48;\nbackground-color: #F2DEDE;\nborder-color: #EED3D7;\npadding-left: 25px;\nbackground-repeat: no-repeat;\nbackground-position: 3px 7px;\nbackground-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAtRJREFUeNqkVc1u00AQHq+dOD+0poIQfkIjalW0SEGqRMuRnHos3DjwAH0ArlyQeANOOSMeAA5VjyBxKBQhgSpVUKKQNGloFdw4cWw2jtfMOna6JOUArDTazXi/b3dm55socPqQhFka++aHBsI8GsopRJERNFlY88FCEk9Yiwf8RhgRyaHFQpPHCDmZG5oX2ui2yilkcTT1AcDsbYC1NMAyOi7zTX2Agx7A9luAl88BauiiQ/cJaZQfIpAlngDcvZZMrl8vFPK5+XktrWlx3/ehZ5r9+t6e+WVnp1pxnNIjgBe4/6dAysQc8dsmHwPcW9C0h3fW1hans1ltwJhy0GxK7XZbUlMp5Ww2eyan6+ft/f2FAqXGK4CvQk5HueFz7D6GOZtIrK+srupdx1GRBBqNBtzc2AiMr7nPplRdKhb1q6q6zjFhrklEFOUutoQ50xcX86ZlqaZpQrfbBdu2R6/G19zX6XSgh6RX5ubyHCM8nqSID6ICrGiZjGYYxojEsiw4PDwMSL5VKsC8Yf4VRYFzMzMaxwjlJSlCyAQ9l0CW44PBADzXhe7xMdi9HtTrdYjFYkDQL0cn4Xdq2/EAE+InCnvADTf2eah4Sx9vExQjkqXT6aAERICMewd/UAp/IeYANM2joxt+q5VI+ieq2i0Wg3l6DNzHwTERPgo1ko7XBXj3vdlsT2F+UuhIhYkp7u7CarkcrFOCtR3H5JiwbAIeImjT/YQKKBtGjRFCU5IUgFRe7fF4cCNVIPMYo3VKqxwjyNAXNepuopyqnld602qVsfRpEkkz+GFL1wPj6ySXBpJtWVa5xlhpcyhBNwpZHmtX8AGgfIExo0ZpzkWVTBGiXCSEaHh62/PoR0p/vHaczxXGnj4bSo+G78lELU80h1uogBwWLf5YlsPmgDEd4M236xjm+8nm4IuE/9u+/PH2JXZfbwz4zw1WbO+SQPpXfwG/BBgAhCNZiSb/pOQAAAAASUVORK5CYII=);",
    info: "",
    warn: ""
  }
};

addStyle = function(name, def) {
  var cssText;
  if (styles[name]) {
    alert("" + pluginName + ": style '" + name + "' already defined");
    return;
  }
  def.name = name;
  styles[name] = def;
  if (def.cssElem) {
    return;
  }
  cssText = "";
  if (def.classes) {
    $.each(def.classes, function(subClassName, css) {
      return cssText += "." + className + "-" + def.name + "-" + subClassName + " {\n  " + css + "\n}\n";
    });
  }
  if (def.css) {
    cssText += "/* styles for " + def.name + " */\n" + def.css;
  }
  if (!cssText) {
    return;
  }
  def.cssElem = insertCSS(cssText);
  return def.cssElem.attr('data-notify-style', def.name);
};

insertCSS = function(cssText) {
  var elem;
  elem = createElem("style");
  $("head").append(elem);
  try {
    elem.html(cssText);
  } catch (e) {
    elem[0].styleSheet.cssText = cssText;
  }
  return elem;
};

pluginOptions = {
  autoHide: false,
  autoHideDelay: 2000,
  arrowShow: true,
  arrowSize: 5,
  arrowColor: 'border',
  position: 'bottom',
  style: 'bootstrap',
  cls: 'error',
  showAnimation: 'slideDown',
  showDuration: 400,
  hideAnimation: 'slideUp',
  hideDuration: 200,
  offsetY: 0,
  offsetX: 0
};

inherit = function(a, b) {
  var F;
  F = function() {};
  F.prototype = a;
  return $.extend(true, new F(), b);
};

options = function(opts) {
  return $.extend(pluginOptions, opts);
};

createElem = function(tag) {
  return $("<" + tag + "></" + tag + ">");
};

cornerElem = createElem("div").addClass("" + className + "-corner");

getAnchorElement = function(element) {
  var radios;
  if (element.is('[type=radio]')) {
    radios = element.parents('form:first').find('[type=radio]').filter(function(i, e) {
      return $(e).attr('name') === element.attr('name');
    });
    element = radios.first();
  }
  return element;
};

incr = function(obj, pos, val) {
  var opp, temp;
  if (typeof val === 'string') {
    val = parseInt(val, 10);
  } else if (typeof val !== 'number') {
    return;
  }
  if (isNaN(val)) {
    return;
  }
  opp = positions[opposites[pos.charAt(0)]];
  temp = pos;
  if (obj[opp] !== undefined) {
    pos = positions[opp.charAt(0)];
    val *= -1;
  }
  if (obj[pos] === undefined) {
    obj[pos] = val;
  } else {
    obj[pos] += val;
  }
  return null;
};

realign = function(alignment, inner, outer) {
  if (alignment === 'l' || alignment === 't') {
    return 0;
  } else if (alignment === 'c' || alignment === 'm') {
    return outer / 2 - inner / 2;
  } else if (alignment === 'r' || alignment === 'b') {
    return outer - inner;
  }
  throw "Invalid alignment";
};

Notification = (function() {

  function Notification(elem, data, options) {
    if (typeof options === 'string') {
      options = {
        color: options
      };
    }
    this.options = inherit(pluginOptions, $.isPlainObject(options) ? options : {});
    this.loadHTML();
    this.wrapper = $(coreStyle.html);
    this.wrapper.data(className, this);
    this.arrow = this.wrapper.find("." + className + "-arrow");
    this.container = this.wrapper.find("." + className + "-container");
    this.container.append(this.userContainer);
    if (elem && elem.length) {
      this.elementType = elem.attr('type');
      this.originalElement = elem;
      this.elem = getAnchorElement(elem);
      this.elem.data(className, this);
      this.elem.before(this.wrapper);
    } else {
      this.options.arrowShow = false;
      cornerElem.prepend(this.wrapper);
    }
    this.container.hide();
    this.run(data);
  }

  Notification.prototype.loadHTML = function() {
    var style;
    style = this.getStyle();
    this.userContainer = $(style.html);
    this.text = this.userContainer.find('[data-notify-text]');
    if (this.text.length === 0) {
      throw "style: " + name + " HTML is missing the: 'data-notify-text' attribute";
    }
    return this.text.addClass("" + className + "-text");
  };

  Notification.prototype.show = function(show, callback) {
    var args, elems, fn, hidden;
    if (callback == null) {
      callback = $.noop;
    }
    hidden = this.container.parent().parents(':hidden').length > 0;
    elems = this.container.add(this.arrow);
    args = [];
    if (hidden && show) {
      fn = 'show';
    } else if (hidden && !show) {
      fn = 'hide';
    } else if (!hidden && show) {
      fn = this.options.showAnimation;
      args.push(this.options.showDuration);
    } else if (!hidden && !show) {
      fn = this.options.hideAnimation;
      args.push(this.options.hideDuration);
    } else {
      return callback();
    }
    args.push(callback);
    return elems[fn].apply(elems, args);
  };

  Notification.prototype.updatePosition = function() {
    var arrowCss, arrowSize, color, contH, contW, css, elemH, elemIH, elemIW, elemPos, elemW, mainFull, margin, opp, oppFull, pAlign, pArrow, pMain, padding, pos, posFull, position, style, wrapPos, _i, _len;
    if (!this.elem) {
      return;
    }
    elemPos = this.elem.position();
    elemH = this.elem.outerHeight();
    elemW = this.elem.outerWidth();
    elemIH = this.elem.innerHeight();
    elemIW = this.elem.innerWidth();
    wrapPos = this.wrapper.position();
    contH = this.container.height();
    contW = this.container.width();
    position = this.getPosition();
    console.log(position);
    pMain = position[0];
    pAlign = position[1];
    pArrow = position[2] || pAlign;
    mainFull = positions[pMain];
    opp = opposites[pMain];
    oppFull = positions[opp];
    css = {};
    css[oppFull] = pMain === 'b' ? elemH : pMain === 'r' ? elemW : 0;
    incr(css, 'left', elemPos.left - wrapPos.left);
    margin = parseInt(this.elem.css("margin-left"), 10);
    if (margin) {
      incr(css, 'left', margin);
    }
    if (/^inline/.test(this.elem.css('display'))) {
      padding = parseInt(this.elem.css("padding-top"), 10);
      if (padding) {
        incr(css, 'top', -padding);
      }
    }
    incr(css, 'top', this.options.offsetY);
    incr(css, 'left', this.options.offsetX);
    style = this.getStyle();
    if (!this.options.arrowShow) {
      this.arrow.hide();
    } else {
      arrowSize = this.options.arrowSize;
      arrowCss = $.extend({}, css);
      for (_i = 0, _len = mainPositions.length; _i < _len; _i++) {
        pos = mainPositions[_i];
        posFull = positions[pos];
        if (pos === opp) {
          continue;
        }
        color = posFull === mainFull ? 'black' : 'transparent';
        arrowCss["border-" + posFull] = "" + arrowSize + "px solid " + color;
      }
      incr(css, positions[opp], arrowSize);
      if (__indexOf.call(mainPositions, pAlign) >= 0) {
        incr(arrowCss, positions[pAlign], arrowSize * 2);
      }
    }
    if (__indexOf.call(vAligns, pMain) >= 0) {
      incr(css, 'left', realign(pAlign, contW, elemW));
      if (arrowCss) {
        incr(arrowCss, 'left', realign(pAlign, arrowSize, elemIW));
      }
    } else if (__indexOf.call(hAligns, pMain) >= 0) {
      incr(css, 'top', realign(pAlign, contH, elemH));
      if (arrowCss) {
        incr(arrowCss, 'top', realign(pAlign, arrowSize, elemIH));
      }
    }
    if (this.container.is(":visible")) {
      css.display = 'block';
    }
    this.container.removeAttr('style').css(css);
    if (arrowCss) {
      return this.arrow.removeAttr('style').css(arrowCss);
    }
  };

  Notification.prototype.getPosition = function() {
    var pos, text, _ref, _ref1, _ref2, _ref3, _ref4, _ref5;
    text = this.options.position;
    pos = parsePosition(text);
    if (pos.length === 0) {
      pos[0] = 'b';
    }
    if (_ref = pos[0], __indexOf.call(mainPositions, _ref) < 0) {
      throw "Must be one of [" + mainPositions + "]";
    }
    if (pos.length === 1 || ((_ref1 = pos[0], __indexOf.call(vAligns, _ref1) >= 0) && (_ref2 = pos[1], __indexOf.call(hAligns, _ref2) < 0)) || ((_ref3 = pos[0], __indexOf.call(hAligns, _ref3) >= 0) && (_ref4 = pos[1], __indexOf.call(vAligns, _ref4) < 0))) {
      pos[1] = (_ref5 = pos[0], __indexOf.call(hAligns, _ref5) >= 0) ? 'm' : 'l';
    }
    if (!this.options.autoReposition) {
      return pos;
    }
    throw "Not implemented";
  };

  Notification.prototype.getStyle = function(name) {
    var style;
    if (!name) {
      name = this.options.style;
    }
    if (!name) {
      name = 'default';
    }
    style = styles[name];
    if (!style) {
      throw "Missing style: " + name;
    }
    return style;
  };

  Notification.prototype.updateStyleClasses = function() {
    var cls, style;
    cls = ['base'];
    if ($.isArray(this.options.cls)) {
      cls = cls.concat(this.options.cls);
    } else if (this.options.cls) {
      cls.push(this.options.cls);
    }
    style = this.getStyle();
    cls = $.map(cls, function(n) {
      return "" + className + "-" + style.name + "-" + n;
    }).join(' ');
    return this.userContainer.attr('class', cls);
  };

  Notification.prototype.run = function(data, options) {
    var _this = this;
    if ($.isPlainObject(options)) {
      $.extend(this.options, options);
    } else if ($.type(options) === 'string') {
      this.options.color = options;
    }
    if (this.container && !data) {
      this.show(false);
      return;
    } else if (!this.container && !data) {
      return;
    }
    if ($.type(data) === 'string') {
      this.text.html(data.replace('\n', '<br/>'));
    } else {
      this.text.empty().append(data);
    }
    this.updateStyleClasses();
    this.updatePosition();
    this.show(true);
    if (this.options.autoHide) {
      clearTimeout(this.autohideTimer);
      return this.autohideTimer = setTimeout(function() {
        return _this.show(false);
      }, this.options.autoHideDelay);
    }
  };

  Notification.prototype.destroy = function() {
    var _this = this;
    return this.show(false, function() {
      return _this.wrapper.remove();
    });
  };

  return Notification;

})();

$[pluginName] = function(elem, data, options) {
  if ((elem && elem.nodeName) || elem.jquery) {
    $(elem)[pluginName](data, options);
  } else {
    options = data;
    data = elem;
    new Notification(null, data, options);
  }
  return elem;
};

$.fn[pluginName] = function(data, options) {
  $(this).each(function() {
    var inst;
    inst = getAnchorElement($(this)).data(className);
    if (inst) {
      return inst.run(data, options);
    } else {
      return new Notification($(this), data, options);
    }
  });
  return this;
};

$.extend($[pluginName], {
  options: options,
  addStyle: addStyle
});

$(function() {
  $("body").append(cornerElem);
  $("link").each(function() {
    var bootstrapDetected, src;
    src = $(this).attr('href');
    if (src.match(/bootstrap/)) {
      bootstrapDetected = true;
      return false;
    }
  });
  insertCSS(coreStyle.css).attr('data-notify-style', 'core');
  $[pluginName].addStyle(defaultStyleName, defaultStyle);
  return $(document).on('click', "." + className + "-wrapper", function() {
    var inst;
    inst = $(this).data(className);
    if (!inst) {
      return;
    }
    if (inst.elem) {
      return inst.show(false);
    } else {
      return inst.destroy();
    }
  });
});

}(window,document));