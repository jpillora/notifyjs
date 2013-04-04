/** Notify.js - v0.0.1 - 2013/04/04
 * http://notifyjs.com/
 * Copyright (c) 2013 Jaime Pillora - MIT
 */
(function(window,document,undefined) {
'use strict';

var Notification, Options, arrowDirs, className, cornerElem, create, getAnchorElement, pluginName, pluginOptions, styles;

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
    html: "<div class=\"" + className + "Wrapper\">\n  <div class=\"" + className + "Container\">\n  </div>\n</div>",
    css: "." + className + "Corner {\n  position: fixed;\n  top: 0;\n  right: 0;\n  margin: 5px;\n  z-index: 1050;\n}\n\n." + className + "Corner ." + className + "Wrapper,\n." + className + "Corner ." + className + "Container {\n  position: relative;\n  display: block;\n  height: inherit;\n  width: inherit;\n\n}\n\n." + className + "Wrapper {\n  z-index: 1;\n  position: absolute;\n  display: inline-block;\n  height: 0;\n  width: 0;\n  opacity: 0.85;\n}\n\n." + className + "Container {\n  display: none;\n  z-index: 1;\n  position: absolute;\n  cursor: pointer;\n}\n\n." + className + "Text {\n  position: relative;\n}"
  },
  user: {
    "default": {
      html: "<div class=\"" + className + "Default\" \n     data-notify-style=\"\n      color: {{color}}; \n      border-color: {{color}};\n     \">\n   <span data-notify=\"text\"></span>\n </div>",
      css: "." + className + "Default {\n  background: #fff;\n  font-size: 11px;\n  box-shadow: 0 0 6px #000;\n  -moz-box-shadow: 0 0 6px #000;\n  -webkit-box-shadow: 0 0 6px #000;\n  padding: 4px 10px 4px 8px;\n  border-radius: 6px;\n  border-style: solid;\n  border-width: 2px;\n  -moz-border-radius: 6px;\n  -webkit-border-radius: 6px;\n  white-space: nowrap;\n}"
    },
    bootstrap: {
      html: "<div class=\"alert alert-error " + className + "Bootstrap\">\n  <strong>Warning!</strong> <span data-notify=\"text\"></span>\n</div>",
      css: "." + className + "Bootstrap {\n  white-space: nowrap;\n}",
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
  arrowPosition: 'top',
  style: 'default',
  color: 'red',
  colors: {
    red: '#b94a48',
    green: '#33be40',
    black: '#393939',
    blue: '#00f'
  },
  showAnimation: 'slideDown',
  showDuration: 200,
  hideAnimation: 'slideUp',
  hideDuration: 600,
  gap: 2
};

create = function(tag) {
  return $(document.createElement(tag));
};

Options = function(options) {
  return $.extend(this, options);
};

Options.prototype = pluginOptions;

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

Notification = (function() {

  function Notification(elem, data, options) {
    if ($.type(options) === 'string') {
      options = {
        color: options
      };
    }
    this.options = new Options($.isPlainObject(options) ? options : {});
    this.loadCSS();
    this.loadHTML();
    this.wrapper = $(styles.core.html);
    this.wrapper.data(pluginName, this);
    this.container = this.wrapper.find("." + className + "Container");
    this.container.append(this.userContainer);
    if (elem && elem.length) {
      this.elementType = elem.attr('type');
      this.originalElement = elem;
      this.elem = getAnchorElement(elem);
      this.elem.data(pluginName, this);
      this.elem.before(this.wrapper);
      this.container.css(this.calculateCSS());
    } else {
      this.options.arrowShow = false;
      cornerElem.prepend(this.wrapper);
    }
    this.container.hide();
    this.run(data);
  }

  Notification.prototype.loadCSS = function(style) {
    var elem, name;
    name = this.options.style;
    style = this.getStyle(name);
    elem = style.cssElem;
    if (elem) {
      return elem.html(style.css);
    } else {
      elem = create("style").attr('id', "" + name + "-styles").html(style.css);
      $("head").append(elem);
      return style.cssElem = elem;
    }
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

  Notification.prototype.buildArrow = function() {
    var alt, d, dir, showArrow, size;
    dir = this.options.arrowPosition;
    size = this.options.arrowSize;
    alt = arrowDirs[dir];
    this.arrow = create("div");
    this.arrow.addClass(className + 'Arrow').css({
      'margin-top': 2 + (document.documentMode === 5 ? size * -4 : 0),
      'position': 'relative',
      'z-index': '2',
      'margin-left': 10,
      'width': 0,
      'height': 0
    }).css('border-' + alt, size + 'px solid ' + this.getColor());
    for (d in arrowDirs) {
      if (d !== dir && d !== alt) {
        this.arrow.css('border-' + d, size + 'px solid transparent');
      }
    }
    showArrow = this.options.arrowShow && this.elementType !== 'radio';
    if (showArrow) {
      return this.arrow.show();
    } else {
      return this.arrow.hide();
    }
  };

  Notification.prototype.show = function(show) {
    var hidden;
    hidden = this.container.parent().parents(':hidden').length > 0;
    if (hidden && show) {
      this.container.show();
    }
    if (hidden && !show) {
      this.container.hide();
    }
    if (!hidden && show) {
      this.container[this.options.showAnimation](this.options.showDuration);
    }
    if (!hidden && !show) {
      return this.container[this.options.hideAnimation](this.options.hideDuration);
    }
  };

  Notification.prototype.calculateCSS = function() {
    var elementPosition, height, left, mainPosition;
    elementPosition = this.elem.position();
    mainPosition = this.container.parent().position();
    height = this.elem.outerHeight();
    left = elementPosition.left - mainPosition.left;
    if (!navigator.userAgent.match(/MSIE/)) {
      height += elementPosition.top - mainPosition.top;
    }
    return {
      top: height + this.options.gap,
      left: left
    };
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
    style = styles.user[name];
    if (!style) {
      throw "Missing style: " + name;
    }
    return style;
  };

  Notification.prototype.run = function(data, options) {
    var autohideTimer, color,
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
    color = this.getColor();
    this.container.find('[data-notify-style]').each(function() {
      var s;
      s = $(this).attr('data-notify-style');
      return $(this).attr('style', s.replace(/\{\{\s*color\s*\}\}/ig, color));
    });
    if (this.arrow) {
      this.arrow.remove();
    }
    this.buildArrow();
    this.container.prepend(this.arrow);
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
    if (src.match(/bootstrap[^\/]*\.css/)) {
      $[pluginName].options({
        style: 'bootstrap'
      });
      return false;
    }
  });
  $("head").append(create("style").html(styles.core.css));
  return $(document).on('click', "." + className + "Wrapper", function() {
    var inst;
    inst = $(this).data(pluginName);
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

$[pluginName].addStyle = function(s) {
  return $.extend(true, styles.user, s);
};

$.fn[pluginName] = function(data, options) {
  return $(this).each(function() {
    var inst;
    inst = getAnchorElement($(this)).data(pluginName);
    if (inst) {
      return inst.run(data, options);
    } else {
      return new Notification($(this), data, options);
    }
  });
};

}(window,document));