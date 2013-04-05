/** Notify.js - v0.0.1 - 2013/04/05
 * http://notifyjs.com/
 * Copyright (c) 2013 Jaime Pillora - MIT
 */
(function(window,document,undefined) {
'use strict';

var Notification, arrowDirs, bootstrapDetected, className, cornerElem, create, getAnchorElement, inherit, insertCSS, pluginName, pluginOptions, styles;

pluginName = 'notify';

className = '__' + pluginName;

arrowDirs = {
  top: 'bottom',
  bottom: 'top',
  left: 'right',
  right: 'left'
};

styles = {
  core: {
    html: "<div class=\"" + className + "Wrapper\">\n  <div class=\"" + className + "Arrow\"></div>\n  <div class=\"" + className + "Container\"></div>\n</div>",
    css: "." + className + "Corner {\n  position: fixed;\n  top: 0;\n  right: 0;\n  margin: 5px;\n  z-index: 1050;\n}\n\n." + className + "Corner ." + className + "Wrapper,\n." + className + "Corner ." + className + "Container {\n  position: relative;\n  display: block;\n  height: inherit;\n  width: inherit;\n}\n\n." + className + "Wrapper {\n  z-index: 1;\n  position: absolute;\n  display: inline-block;\n  height: 0;\n  width: 0;\n  opacity: 0.85;\n}\n\n." + className + "Container {\n  display: none;\n  z-index: 1;\n  position: absolute;\n  cursor: pointer;\n}\n\n." + className + "Text {\n  position: relative;\n}\n\n." + className + "Arrow {\n  margin-top: " + (2 + (document.documentMode === 5 ? size * -4 : 0)) + "px;\n  position: absolute;\n  z-index: 2;\n  margin-left: 10px;\n  width: 0;\n  height: 0;\n}\n"
  },
  user: {
    "default": {
      html: "<div class=\"" + className + "Default\" \n     data-notify-style=\"\n      color: {{color}}; \n      border-color: {{color}};\n     \">\n   <span data-notify=\"text\"></span>\n </div>",
      css: "." + className + "Default {\n  background: #fff;\n  font-size: 11px;\n  box-shadow: 0 0 6px #000;\n  -moz-box-shadow: 0 0 6px #000;\n  -webkit-box-shadow: 0 0 6px #000;\n  padding: 4px 10px 4px 8px;\n  border-radius: 6px;\n  border-style: solid;\n  border-width: 2px;\n  -moz-border-radius: 6px;\n  -webkit-border-radius: 6px;\n  white-space: nowrap;\n}"
    },
    bootstrap: {
      html: "<div class=\"alert alert-error " + className + "Bootstrap\">\n  <strong data-notify=\"text\"></strong>\n</div>",
      css: "." + className + "Bootstrap {\n  white-space: nowrap;\n  margin-bottom: 5px !important;\n  padding-left: 25px !important;\n  background-repeat: no-repeat;\n  background-position: 3px 7px;\n  background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAtRJREFUeNqkVc1u00AQHq+dOD+0poIQfkIjalW0SEGqRMuRnHos3DjwAH0ArlyQeANOOSMeAA5VjyBxKBQhgSpVUKKQNGloFdw4cWw2jtfMOna6JOUArDTazXi/b3dm55socPqQhFka++aHBsI8GsopRJERNFlY88FCEk9Yiwf8RhgRyaHFQpPHCDmZG5oX2ui2yilkcTT1AcDsbYC1NMAyOi7zTX2Agx7A9luAl88BauiiQ/cJaZQfIpAlngDcvZZMrl8vFPK5+XktrWlx3/ehZ5r9+t6e+WVnp1pxnNIjgBe4/6dAysQc8dsmHwPcW9C0h3fW1hans1ltwJhy0GxK7XZbUlMp5Ww2eyan6+ft/f2FAqXGK4CvQk5HueFz7D6GOZtIrK+srupdx1GRBBqNBtzc2AiMr7nPplRdKhb1q6q6zjFhrklEFOUutoQ50xcX86ZlqaZpQrfbBdu2R6/G19zX6XSgh6RX5ubyHCM8nqSID6ICrGiZjGYYxojEsiw4PDwMSL5VKsC8Yf4VRYFzMzMaxwjlJSlCyAQ9l0CW44PBADzXhe7xMdi9HtTrdYjFYkDQL0cn4Xdq2/EAE+InCnvADTf2eah4Sx9vExQjkqXT6aAERICMewd/UAp/IeYANM2joxt+q5VI+ieq2i0Wg3l6DNzHwTERPgo1ko7XBXj3vdlsT2F+UuhIhYkp7u7CarkcrFOCtR3H5JiwbAIeImjT/YQKKBtGjRFCU5IUgFRe7fF4cCNVIPMYo3VKqxwjyNAXNepuopyqnld602qVsfRpEkkz+GFL1wPj6ySXBpJtWVa5xlhpcyhBNwpZHmtX8AGgfIExo0ZpzkWVTBGiXCSEaHh62/PoR0p/vHaczxXGnj4bSo+G78lELU80h1uogBwWLf5YlsPmgDEd4M236xjm+8nm4IuE/9u+/PH2JXZfbwz4zw1WbO+SQPpXfwG/BBgAhCNZiSb/pOQAAAAASUVORK5CYII=);\n}",
      colors: {
        red: '#eed3d7'
      }
    }
  }
};

bootstrapDetected = false;

pluginOptions = {
  autoHide: false,
  autoHideDelay: 2000,
  arrowShow: false,
  arrowSize: 5,
  position: 'bottom',
  style: null,
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
  offsetY: 2,
  offsetX: 0
};

create = function(tag) {
  return $(document.createElement(tag));
};

inherit = function(a, b) {
  var F;
  F = function() {};
  F.prototype = a;
  return $.extend(true, new F(), b);
};

cornerElem = create("div").addClass("" + className + "Corner");

getAnchorElement = function(element) {
  var fBefore, radios;
  if (element.is('[type=radio]')) {
    radios = element.parents('form:first').find('[type=radio]').filter(function(i, e) {
      return $(e).attr('name') === element.attr('name');
    });
    element = radios.first();
  }
  fBefore = element.prev();
  if (fBefore.is('span.styled,span.OBS_checkbox')) {
    element = fBefore;
  }
  return element;
};

insertCSS = function(style) {
  var elem;
  if (!(style && style.css)) {
    return;
  }
  elem = style.cssElem;
  if (elem) {
    return elem.html(style.css);
  } else {
    elem = create("style").attr('type', 'text/css').html(style.css);
    $("head").append(elem);
    return style.cssElem = elem;
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

  Notification.prototype.loadHTML = function(style) {
    style = this.getStyle(name);
    this.userContainer = $(style.html);
    this.text = this.userContainer.find('[data-notify=text]');
    if (this.text.length === 0) {
      throw "style: " + name + " HTML is missing the: data-notify='text' attribute";
    }
    return this.text.addClass("" + className + "Text");
  };

  Notification.prototype.show = function(show) {
    var elems, hidden;
    hidden = this.container.parent().parents(':hidden').length > 0;
    elems = this.container.add(this.arrow);
    if (hidden && show) {
      elems.show();
    }
    if (hidden && !show) {
      elems.hide();
    }
    if (!hidden && show) {
      elems[this.options.showAnimation](this.options.showDuration);
    }
    if (!hidden && !show) {
      return elems[this.options.hideAnimation](this.options.hideDuration);
    }
  };

  Notification.prototype.updatePosition = function() {
    var elementPosition, mainPosition, p, position;
    if (!this.elem) {
      return;
    }
    elementPosition = this.elem.position();
    mainPosition = this.wrapper.position();
    position = this.getPosition();
    p = {
      top: 0,
      left: 0
    };
    switch (position) {
      case 'bottom':
        p.top += this.elem.outerHeight();
        break;
      case 'right':
        p.left += this.elem.width();
        break;
      default:
        throw "Unknown position: " + position;
    }
    if (!navigator.userAgent.match(/MSIE/)) {
      p.top += elementPosition.top - mainPosition.top;
    }
    p.left += elementPosition.left - mainPosition.left;
    p.top += this.options.offsetY;
    p.left += this.options.offsetX;
    this.updateArrow(p, position);
    return this.container.css(p);
  };

  Notification.prototype.updateArrow = function(p, position) {
    var d, dir, size;
    if (!(this.options.arrowShow && this.elementType !== 'radio')) {
      this.arrow.hide();
      return;
    }
    dir = arrowDirs[position];
    size = this.options.arrowSize;
    this.arrow.css('border-' + position, size + 'px solid ' + this.getColor());
    this.arrow.css(p);
    for (d in arrowDirs) {
      if (d !== dir && d !== position) {
        this.arrow.css('border-' + d, size + 'px solid transparent');
      }
    }
    switch (position) {
      case 'bottom':
        p.top += size;
        break;
      case 'right':
        p.left += size;
    }
    return this.arrow.show();
  };

  Notification.prototype.getPosition = function() {
    if (this.options.position) {
      return this.options.position;
    }
    if (this.elem.position().left + this.elem.width() + this.wrapper.width() < $(window).width()) {
      return 'right';
    }
    return 'bottom';
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
    if (bootstrapDetected && !name) {
      name = 'bootstrap';
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
      return $(e).attr('style', $(e).attr('data-notify-style').replace(/\{\{\s*color\s*\}\}/ig, _this.getColor()).replace(/\{\{\s*position\s*\}\}/ig, _this.getPosition()));
    });
  };

  Notification.prototype.run = function(data, options) {
    var autohideTimer,
      _this = this;
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
      return autohideTimer = setTimeout(function() {
        return _this.show(false);
      }, this.options.autoHideDelay);
    }
  };

  return Notification;

})();

$(function() {
  $("body").append(cornerElem);
  $("link").each(function() {
    var src;
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
    if (inst) {
      return inst.show(false);
    }
  });
});

$[pluginName] = function(elem, data, options) {
  if (elem instanceof HTMLElement || elem.jquery) {
    return $(elem)[pluginName](data, options);
  } else {
    options = data;
    data = elem;
    return new Notification(null, data, options);
  }
};

$[pluginName].options = function(options) {
  return $.extend(pluginOptions, options);
};

$[pluginName].styles = function(s) {
  return $.extend(true, styles.user, s);
};

$.fn[pluginName] = function(data, options) {
  return $(this).each(function() {
    var inst;
    inst = getAnchorElement($(this)).data(className);
    if (inst) {
      return inst.run(data, options);
    } else {
      return new Notification($(this), data, options);
    }
  });
};

}(window,document));