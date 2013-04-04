/** Notify.js - v0.0.1 - 2013/04/04
 * http://notifyjs.com/
 * Copyright (c) 2013 Jaime Pillora - MIT
 */
(function(window,document,undefined) {
'use strict';

var Options, Prompt, arrowDirs, className, create, getAnchorElement, pluginName, pluginOptions, styles;

pluginName = 'notify';

className = '__notify';

arrowDirs = {
  top: 'bottom',
  bottom: 'top',
  left: 'right',
  right: 'left'
};

styles = {
  core: {
    html: "<div class=\"" + className + "Wrapper\">\n  <div class=\"" + className + "Container\">\n  </div>\n</div>",
    css: "." + className + "Wrapper {\n  z-index: 1;\n  position: absolute;\n  display: inline-block;\n  height: 0;\n  width: 0;\n}\n\n." + className + "Container {\n  display: none;\n  z-index: 1;\n  position: absolute;\n  cursor: pointer;\n}\n\n." + className + "Text {\n  position: relative;\n}"
  },
  user: {
    "default": {
      html: "<div class=\"" + className + "Default\" data-notify-style=\"color: {{COLOR}}; border-color: {{COLOR}};\">\n   <span data-notify=\"text\"></span>\n </div>",
      css: "." + className + "Default {\n  background: #fff;\n  font-size: 11px;\n  box-shadow: 0 0 6px #000;\n  -moz-box-shadow: 0 0 6px #000;\n  -webkit-box-shadow: 0 0 6px #000;\n  padding: 4px 10px 4px 8px;\n  border-radius: 6px;\n  border-style: solid;\n  border-width: 2px;\n  -moz-border-radius: 6px;\n  -webkit-border-radius: 6px;\n  white-space: nowrap;\n}"
    },
    bootstrap: {
      html: "<span>test</span>",
      css: "body {\n  test: 42\n}"
    }
  }
};

pluginOptions = {
  autoHidePrompt: false,
  autoHideDelay: 10000,
  arrowShow: true,
  arrowSize: 5,
  arrowPosition: 'top',
  style: 'default',
  color: 'red',
  colors: {
    red: '#ee0101',
    green: '#33be40',
    black: '#393939',
    blue: '#00f'
  },
  showAnimation: 'fadeIn',
  showDuration: 200,
  hideAnimation: 'fadeOut',
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

Prompt = (function() {

  function Prompt(elem, node, options) {
    if ($.type(options) === 'string') {
      options = {
        color: options
      };
    }
    this.options = new Options($.isPlainObject(options) ? options : {});
    this.elementType = elem.attr('type');
    this.originalElement = elem;
    this.elem = getAnchorElement(elem);
    this.elem.data(pluginName, this);
    this.loadCSS();
    this.loadHTML();
    this.wrapper = $(styles.core.html);
    this.container = this.wrapper.find("." + className + "Container");
    this.container.append(this.userContainer);
    this.elem.before(this.wrapper);
    this.container.css(this.calculateCSS());
    this.run(node);
  }

  Prompt.prototype.loadCSS = function(style) {
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

  Prompt.prototype.loadHTML = function(style) {
    style = this.getStyle(name);
    this.userContainer = $(style.html);
    this.text = this.userContainer.find('[data-notify=text]');
    if (this.text.length === 0) {
      throw "style: " + name + " HTML is missing the: data-notify='text' attribute";
    }
    return this.text.addClass("" + className + "Text");
  };

  Prompt.prototype.buildArrow = function() {
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

  Prompt.prototype.showMain = function(show) {
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

  Prompt.prototype.calculateCSS = function() {
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

  Prompt.prototype.getColor = function() {
    return this.options.colors[this.options.color] || this.options.color;
  };

  Prompt.prototype.getStyle = function(name) {
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

  Prompt.prototype.run = function(node, options) {
    var color, t;
    if ($.isPlainObject(options)) {
      $.extend(this.options, options);
    } else if ($.type(options) === 'string') {
      this.options.color = options;
    }
    if (this.container && !node) {
      this.showMain(false);
      return;
    } else if (!this.container && !node) {
      return;
    }
    if ($.type(node) === 'string') {
      this.text.html(node.replace('\n', '<br/>'));
    } else {
      this.text.empty().append(node);
    }
    color = this.getColor();
    this.container.find('[data-notify-style]').each(function() {
      var s;
      s = $(this).attr('data-notify-style');
      return $(this).attr('style', s.replace(/\{\{\s*COLOR\s*\}\}/ig, color));
    });
    if (this.arrow) {
      this.arrow.remove();
    }
    this.buildArrow();
    this.container.prepend(this.arrow);
    this.showMain(true);
    if (this.options.autoHidePrompt) {
      clearTimeout(this.elem.data('mainTimer'));
      t = setTimeout(function() {
        return this.showMain(false);
      }, this.options.autoHideDelay);
      return this.elem.data('mainTimer', t);
    }
  };

  return Prompt;

})();

$(function() {
  $("head").append(create("style").html(styles.core.css));
  return $(document).on('click', "." + className, function() {
    var inst;
    inst = getAnchorElement($(this)).data(pluginName);
    if (inst != null) {
      return inst.showMain(false);
    }
  });
});

$[pluginName] = function(elem, node, options) {
  return $(elem)[pluginName](node, options);
};

$[pluginName].options = function(options) {
  return $.extend(pluginOptions, options);
};

$[pluginName].addStyle = function(s) {
  return $.extend(true, styles.user, s);
};

$.fn[pluginName] = function(node, options) {
  return $(this).each(function() {
    var inst;
    inst = getAnchorElement($(this)).data(pluginName);
    if (inst != null) {
      return inst.run(node, options);
    } else {
      return new Prompt($(this), node, options);
    }
  });
};

}(window,document));