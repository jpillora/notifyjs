/** Notify.js - v0.0.1 - 2013/05/31
 * http://notifyjs.com/
 * Copyright (c) 2013 Jaime Pillora - MIT
 */
(function(window,document,undefined) {
'use strict';

var Notification, className, cornerElem, createElem, getAnchorElement, hPositions, incr, inherit, insertCSS, mainPositions, opposites, parsePosition, pluginName, pluginOptions, positions, realign, styles, vPositions,
  __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

pluginName = 'notify';

className = '__' + pluginName;

positions = {
  t: 'top',
  m: 'middle',
  b: 'bottom',
  l: 'left',
  c: 'center',
  r: 'right'
};

hPositions = ['l', 'c', 'r'];

vPositions = ['t', 'm', 'b'];

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

styles = {
  core: {
    html: "<div class=\"" + className + "Wrapper\">\n  <div class=\"" + className + "Debug\"></div>\n  <div class=\"" + className + "Arrow\"></div>\n  <div class=\"" + className + "Container\"></div>\n</div>",
    css: "." + className + "Corner {\n  position: fixed;\n  top: 0;\n  right: 0;\n  margin: 5px;\n  z-index: 1050;\n}\n\n." + className + "Corner ." + className + "Wrapper,\n." + className + "Corner ." + className + "Container {\n  position: relative;\n  display: block;\n  height: inherit;\n  width: inherit;\n}\n\n." + className + "Wrapper {\n  z-index: 1;\n  position: absolute;\n  display: inline-block;\n  height: 0;\n  width: 0;\n}\n\n." + className + "Debug {\n  position: absolute;\n  border: 3px solid red;\n  height: 0;\n  width: 0;\n}\n\n." + className + "Container {\n  display: none;\n  z-index: 1;\n  position: absolute;\n  cursor: pointer;\n}\n\n." + className + "Text {\n  position: relative;\n}\n\n." + className + "Arrow {\n  position: absolute;\n  z-index: 2;\n  width: 0;\n  height: 0;\n}\n"
  },
  user: {
    "default": {
      html: "<div class=\"" + className + "Default\" \n     data-notify-style=\"\n      color: {{color}}; \n      border-color: {{color}};\n     \">\n   <span data-notify-text></span>\n </div>",
      css: "." + className + "Default {\n  background: #fff;\n  font-size: 11px;\n  box-shadow: 0 0 6px #000;\n  -moz-box-shadow: 0 0 6px #000;\n  -webkit-box-shadow: 0 0 6px #000;\n  padding: 4px 10px 4px 8px;\n  border-radius: 6px;\n  border-style: solid;\n  border-width: 2px;\n  -moz-border-radius: 6px;\n  -webkit-border-radius: 6px;\n  white-space: nowrap;\n}"
    },
    bootstrap: {
      html: "<div class=\"alert alert-error " + className + "Bootstrap\">\n  <strong data-notify-text></strong>\n</div>",
      css: "." + className + "Bootstrap {\n  white-space: nowrap;\n  margin: 5px !important;\n  padding-left: 25px !important;\n  background-repeat: no-repeat;\n  background-position: 3px 7px;\n  background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAtRJREFUeNqkVc1u00AQHq+dOD+0poIQfkIjalW0SEGqRMuRnHos3DjwAH0ArlyQeANOOSMeAA5VjyBxKBQhgSpVUKKQNGloFdw4cWw2jtfMOna6JOUArDTazXi/b3dm55socPqQhFka++aHBsI8GsopRJERNFlY88FCEk9Yiwf8RhgRyaHFQpPHCDmZG5oX2ui2yilkcTT1AcDsbYC1NMAyOi7zTX2Agx7A9luAl88BauiiQ/cJaZQfIpAlngDcvZZMrl8vFPK5+XktrWlx3/ehZ5r9+t6e+WVnp1pxnNIjgBe4/6dAysQc8dsmHwPcW9C0h3fW1hans1ltwJhy0GxK7XZbUlMp5Ww2eyan6+ft/f2FAqXGK4CvQk5HueFz7D6GOZtIrK+srupdx1GRBBqNBtzc2AiMr7nPplRdKhb1q6q6zjFhrklEFOUutoQ50xcX86ZlqaZpQrfbBdu2R6/G19zX6XSgh6RX5ubyHCM8nqSID6ICrGiZjGYYxojEsiw4PDwMSL5VKsC8Yf4VRYFzMzMaxwjlJSlCyAQ9l0CW44PBADzXhe7xMdi9HtTrdYjFYkDQL0cn4Xdq2/EAE+InCnvADTf2eah4Sx9vExQjkqXT6aAERICMewd/UAp/IeYANM2joxt+q5VI+ieq2i0Wg3l6DNzHwTERPgo1ko7XBXj3vdlsT2F+UuhIhYkp7u7CarkcrFOCtR3H5JiwbAIeImjT/YQKKBtGjRFCU5IUgFRe7fF4cCNVIPMYo3VKqxwjyNAXNepuopyqnld602qVsfRpEkkz+GFL1wPj6ySXBpJtWVa5xlhpcyhBNwpZHmtX8AGgfIExo0ZpzkWVTBGiXCSEaHh62/PoR0p/vHaczxXGnj4bSo+G78lELU80h1uogBwWLf5YlsPmgDEd4M236xjm+8nm4IuE/9u+/PH2JXZfbwz4zw1WbO+SQPpXfwG/BBgAhCNZiSb/pOQAAAAASUVORK5CYII=);\n}",
      colors: {
        red: '#eed3d7'
      }
    }
  }
};

pluginOptions = {
  autoHide: false,
  autoHideDelay: 2000,
  arrowShow: true,
  arrowSize: 5,
  position: 'bottom',
  style: 'default',
  color: 'red',
  colors: {
    red: '#b94a48',
    green: '#33be40',
    black: '#393939',
    blue: '#00f'
  },
  showAnimation: 'slideDown',
  showDuration: 400,
  hideAnimation: 'slideUp',
  hideDuration: 200,
  offsetY: 0,
  offsetX: 0
};

createElem = function(tag) {
  return $("<" + tag + "></" + tag + ">");
};

inherit = function(a, b) {
  var F;
  F = function() {};
  F.prototype = a;
  return $.extend(true, new F(), b);
};

cornerElem = createElem("div").addClass("" + className + "Corner");

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

insertCSS = function(style) {
  var elem;
  if (!(style && style.css)) {
    return;
  }
  elem = style.cssElem;
  if (elem) {
    return;
  }
  elem = createElem("style");
  $("head").append(elem);
  style.cssElem = elem;
  try {
    return elem.html(style.css);
  } catch (e) {
    return elem[0].styleSheet.cssText = style.css;
  }
};

Notification = (function() {

  function Notification(elem, data, options) {
    if (typeof options === 'string') {
      options = {
        color: options
      };
    }
    this.options = inherit(pluginOptions, $.isPlainObject(options) ? options : {});
    this.loadCSS();
    this.loadHTML();
    this.wrapper = $(styles.core.html);
    this.wrapper.data(className, this);
    this.arrow = this.wrapper.find("." + className + "Arrow");
    this.container = this.wrapper.find("." + className + "Container");
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

  Notification.prototype.loadCSS = function(style) {
    var name;
    if (!style) {
      name = this.options.style;
      style = this.getStyle(name);
    }
    return insertCSS(style);
  };

  Notification.prototype.loadHTML = function() {
    var style;
    style = this.getStyle();
    this.userContainer = $(style.html);
    this.text = this.userContainer.find('[data-notify-text]');
    if (this.text.length === 0) {
      throw "style: " + name + " HTML is missing the: 'data-notify-text' attribute";
    }
    return this.text.addClass("" + className + "Text");
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
    var arrowCss, color, contH, contW, css, elemH, elemPos, elemW, mainFull, margin, opp, oppFull, pAlign, pArrow, pMain, padding, pos, posFull, position, size, wrapPos, _i, _len;
    if (!this.elem) {
      return;
    }
    elemPos = this.elem.position();
    elemH = this.elem.outerHeight();
    elemW = this.elem.outerWidth();
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
    if (!this.options.arrowShow) {
      this.arrow.hide();
    } else {
      size = this.options.arrowSize;
      arrowCss = $.extend({}, css);
      for (_i = 0, _len = mainPositions.length; _i < _len; _i++) {
        pos = mainPositions[_i];
        posFull = positions[pos];
        if (pos === opp) {
          continue;
        }
        color = posFull === mainFull ? this.getColor() : 'transparent';
        arrowCss["border-" + posFull] = "" + size + "px solid " + color;
      }
      incr(css, positions[opp], size);
      this.arrow.css(arrowCss).show();
    }
    if (__indexOf.call(vPositions, pMain) >= 0) {
      incr(css, 'left', realign(pAlign, contW, elemW));
    }
    if (__indexOf.call(hPositions, pMain) >= 0) {
      incr(css, 'top', realign(pAlign, contH, elemH));
    }
    if (this.container.is(":visible")) {
      css.display = 'block';
    }
    return this.container.removeAttr('style').css(css);
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
    if (pos.length === 1 || ((_ref1 = pos[0], __indexOf.call(vPositions, _ref1) >= 0) && (_ref2 = pos[1], __indexOf.call(hPositions, _ref2) < 0)) || ((_ref3 = pos[0], __indexOf.call(hPositions, _ref3) >= 0) && (_ref4 = pos[1], __indexOf.call(vPositions, _ref4) < 0))) {
      pos[1] = (_ref5 = pos[0], __indexOf.call(hPositions, _ref5) >= 0) ? 'm' : 'l';
    }
    if (!this.options.autoReposition) {
      return pos;
    }
    throw "Not implemented";
  };

  Notification.prototype.getColor = function() {
    var styleColors;
    styleColors = this.getStyle().colors;
    return (styleColors && styleColors[this.options.color]) || this.options.colors[this.options.color] || this.options.color;
  };

  Notification.prototype.getStyle = function(name) {
    var style;
    if (!name) {
      name = this.options.style;
    }
    if (!name) {
      name = 'default';
    }
    style = styles.user[name];
    if (!style) {
      throw "Missing style: " + name;
    }
    return style;
  };

  Notification.prototype.updateStyle = function() {
    var _this = this;
    return this.wrapper.find('[data-notify-style]').each(function(i, e) {
      return $(e).attr('style', $(e).attr('data-notify-style').replace(/\{\{\s*color\s*\}\}/ig, _this.getColor()));
    });
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
  insertCSS(styles.core);
  return $(document).on('click', "." + className + "Wrapper", function() {
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

$[pluginName].options = function(options) {
  return $.extend(pluginOptions, options);
};

$[pluginName].styles = function(s) {
  return $.extend(true, styles.user, s);
};

$[pluginName].insertCSS = insertCSS;

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

}(window,document));