/** Notify.js - v0.0.1 - 2013/06/04
 * http://notifyjs.com/
 * Copyright (c) 2013 Jaime Pillora - MIT
 */
(function(window,document,undefined) {
'use strict';

var Notification, addStyle, coreStyle, cornerElem, createElem, defaultStyle, defaultStyleName, getAnchorElement, hAligns, incr, inherit, insertCSS, mainPositions, opposites, options, parsePosition, pluginClassName, pluginName, pluginOptions, positions, realign, stylePrefixes, styles, vAligns,
  __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

pluginName = 'notify';

pluginClassName = pluginName + 'js';

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
  html: "<div class=\"" + pluginClassName + "-wrapper\">\n  <div class=\"" + pluginClassName + "-arrow\"></div>\n  <div class=\"" + pluginClassName + "-container\"></div>\n</div>",
  css: "." + pluginClassName + "-corner {\n  position: fixed;\n  top: 0;\n  right: 0;\n  margin: 5px;\n  z-index: 1050;\n}\n\n." + pluginClassName + "-corner ." + pluginClassName + "-wrapper,\n." + pluginClassName + "-corner ." + pluginClassName + "-container {\n  position: relative;\n  display: block;\n  height: inherit;\n  width: inherit;\n}\n\n." + pluginClassName + "-wrapper {\n  z-index: 1;\n  position: absolute;\n  display: inline-block;\n  height: 0;\n  width: 0;\n}\n\n." + pluginClassName + "-container {\n  display: none;\n  z-index: 1;\n  position: absolute;\n  cursor: pointer;\n}\n\n." + pluginClassName + "-text {\n  position: relative;\n}\n\n." + pluginClassName + "-arrow {\n  position: absolute;\n  z-index: 2;\n  width: 0;\n  height: 0;\n}"
};

defaultStyleName = "bootstrap";

defaultStyle = {
  html: "<div>\n  <span data-notify-text></span>\n</div>",
  classes: {
    base: {
      "padding": "8px 15px 8px 14px",
      "text-shadow": "0 1px 0 rgba(255, 255, 255, 0.5)",
      "background-color": "#fcf8e3",
      "border": "1px solid #fbeed5",
      "border-radius": "4px",
      "white-space": "nowrap",
      "padding-left": "25px",
      "background-repeat": "no-repeat",
      "background-position": "3px 7px"
    },
    error: {
      "color": "#B94A48",
      "background-color": "#F2DEDE",
      "border-color": "#EED3D7",
      "background-image": "url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAtRJREFUeNqkVc1u00AQHq+dOD+0poIQfkIjalW0SEGqRMuRnHos3DjwAH0ArlyQeANOOSMeAA5VjyBxKBQhgSpVUKKQNGloFdw4cWw2jtfMOna6JOUArDTazXi/b3dm55socPqQhFka++aHBsI8GsopRJERNFlY88FCEk9Yiwf8RhgRyaHFQpPHCDmZG5oX2ui2yilkcTT1AcDsbYC1NMAyOi7zTX2Agx7A9luAl88BauiiQ/cJaZQfIpAlngDcvZZMrl8vFPK5+XktrWlx3/ehZ5r9+t6e+WVnp1pxnNIjgBe4/6dAysQc8dsmHwPcW9C0h3fW1hans1ltwJhy0GxK7XZbUlMp5Ww2eyan6+ft/f2FAqXGK4CvQk5HueFz7D6GOZtIrK+srupdx1GRBBqNBtzc2AiMr7nPplRdKhb1q6q6zjFhrklEFOUutoQ50xcX86ZlqaZpQrfbBdu2R6/G19zX6XSgh6RX5ubyHCM8nqSID6ICrGiZjGYYxojEsiw4PDwMSL5VKsC8Yf4VRYFzMzMaxwjlJSlCyAQ9l0CW44PBADzXhe7xMdi9HtTrdYjFYkDQL0cn4Xdq2/EAE+InCnvADTf2eah4Sx9vExQjkqXT6aAERICMewd/UAp/IeYANM2joxt+q5VI+ieq2i0Wg3l6DNzHwTERPgo1ko7XBXj3vdlsT2F+UuhIhYkp7u7CarkcrFOCtR3H5JiwbAIeImjT/YQKKBtGjRFCU5IUgFRe7fF4cCNVIPMYo3VKqxwjyNAXNepuopyqnld602qVsfRpEkkz+GFL1wPj6ySXBpJtWVa5xlhpcyhBNwpZHmtX8AGgfIExo0ZpzkWVTBGiXCSEaHh62/PoR0p/vHaczxXGnj4bSo+G78lELU80h1uogBwWLf5YlsPmgDEd4M236xjm+8nm4IuE/9u+/PH2JXZfbwz4zw1WbO+SQPpXfwG/BBgAhCNZiSb/pOQAAAAASUVORK5CYII=)"
    },
    success: {
      "color": "#468847",
      "background-color": "#DFF0D8",
      "border-color": "#D6E9C6",
      "background-image": "url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAutJREFUeNq0lctPE0Ecx38zu/RFS1EryqtgJFA08YCiMZIAQQ4eRG8eDGdPJiYeTIwHTfwPiAcvXIwXLwoXPaDxkWgQ6islKlJLSQWLUraPLTv7Gme32zoF9KSTfLO7v53vZ3d/M7/fIth+IO6INt2jjoA7bjHCJoAlzCRw59YwHYjBnfMPqAKWQYKjGkfCJqAF0xwZjipQtA3MxeSG87VhOOYegVrUCy7UZM9S6TLIdAamySTclZdYhFhRHloGYg7mgZv1Zzztvgud7V1tbQ2twYA34LJmF4p5dXF1KTufnE+SxeJtuCZNsLDCQU0+RyKTF27Unw101l8e6hns3u0PBalORVVVkcaEKBJDgV3+cGM4tKKmI+ohlIGnygKX00rSBfszz/n2uXv81wd6+rt1orsZCHRdr1Imk2F2Kob3hutSxW8thsd8AXNaln9D7CTfA6O+0UgkMuwVvEFFUbbAcrkcTA8+AtOk8E6KiQiDmMFSDqZItAzEVQviRkdDdaFgPp8HSZKAEAL5Qh7Sq2lIJBJwv2scUqkUnKoZgNhcDKhKg5aH+1IkcouCAdFGAQsuWZYhOjwFHQ96oagWgRoUov1T9kRBEODAwxM2QtEUl+Wp+Ln9VRo6BcMw4ErHRYjH4/B26AlQoQQTRdHWwcd9AH57+UAXddvDD37DmrBBV34WfqiXPl61g+vr6xA9zsGeM9gOdsNXkgpEtTwVvwOklXLKm6+/p5ezwk4B+j6droBs2CsGa/gNs6RIxazl4Tc25mpTgw/apPR1LYlNRFAzgsOxkyXYLIM1V8NMwyAkJSctD1eGVKiq5wWjSPdjmeTkiKvVW4f2YPHWl3GAVq6ymcyCTgovM3FzyRiDe2TaKcEKsLpJvNHjZgPNqEtyi6mZIm4SRFyLMUsONSSdkPeFtY1n0mczoY3BHTLhwPRy9/lzcziCw9ACI+yql0VLzcGAZbYSM5CCSZg1/9oc/nn7+i8N9p/8An4JMADxhH+xHfuiKwAAAABJRU5ErkJggg==)"
    },
    info: {},
    warn: {}
  }
};

stylePrefixes = {
  "border-radius": ["-webkit-", "-moz-"]
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
    $.each(def.classes, function(className, props) {
      cssText += "." + pluginClassName + "-" + def.name + "-" + className + " {\n";
      $.each(props, function(name, val) {
        if (stylePrefixes[name]) {
          $.each(stylePrefixes[name], function(i, prefix) {
            return cssText += "  " + prefix + name + ": " + val + ";\n";
          });
        }
        return cssText += "  " + name + ": " + val + ";\n";
      });
      return cssText += "}\n";
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
  autoHide: true,
  autoHideDelay: 5000,
  arrowShow: true,
  arrowSize: 5,
  position: 'bottom',
  style: 'bootstrap',
  className: 'error',
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

cornerElem = createElem("div").addClass("" + pluginClassName + "-corner");

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
        className: options
      };
    }
    this.options = inherit(pluginOptions, $.isPlainObject(options) ? options : {});
    this.loadHTML();
    this.wrapper = $(coreStyle.html);
    this.wrapper.data(pluginClassName, this);
    this.arrow = this.wrapper.find("." + pluginClassName + "-arrow");
    this.container = this.wrapper.find("." + pluginClassName + "-container");
    this.container.append(this.userContainer);
    if (elem && elem.length) {
      this.elementType = elem.attr('type');
      this.originalElement = elem;
      this.elem = getAnchorElement(elem);
      this.elem.data(pluginClassName, this);
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
      this.text = this.userContainer.find('[data-notify-html]');
      this.rawText = true;
    }
    if (this.text.length === 0) {
      throw "style: '" + name + "' HTML is missing a: 'data-notify-text' or 'data-notify-html' attribute";
    }
    return this.text.addClass("" + pluginClassName + "-text");
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
    var arrowColor, arrowCss, arrowSize, color, contH, contW, css, elemH, elemIH, elemIW, elemPos, elemW, mainFull, margin, opp, oppFull, pAlign, pArrow, pMain, padding, pos, posFull, position, style, wrapPos, _i, _len;
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
      arrowColor = this.userContainer.css("border-color") || this.userContainer.css("background-color") || 'white';
      for (_i = 0, _len = mainPositions.length; _i < _len; _i++) {
        pos = mainPositions[_i];
        posFull = positions[pos];
        if (pos === opp) {
          continue;
        }
        color = posFull === mainFull ? arrowColor : 'transparent';
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
    var classes, style;
    classes = ['base'];
    if ($.isArray(this.options.className)) {
      classes = classes.concat(this.options.className);
    } else if (this.options.className) {
      classes.push(this.options.className);
    }
    style = this.getStyle();
    classes = $.map(classes, function(n) {
      return "" + pluginClassName + "-" + style.name + "-" + n;
    }).join(' ');
    return this.userContainer.attr('class', classes);
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
    inst = getAnchorElement($(this)).data(pluginClassName);
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
  return $(document).on('click', "." + pluginClassName + "-wrapper", function() {
    var inst;
    inst = $(this).data(pluginClassName);
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