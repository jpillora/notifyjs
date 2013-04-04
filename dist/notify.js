/** Notify.js - v0.0.1 - 2013/04/04
 * http://notifyjs.com/
 * Copyright (c) 2013 Jaime Pillora - MIT
 */
(function(window,document,undefined) {
'use strict';

var Options, Prompt, arrowDirs, className, coreStyle, create, getAnchorElement, pluginName, pluginOptions, userStyles;

pluginName = 'notify';

className = '__notify';

arrowDirs = {
  top: 'bottom',
  bottom: 'top',
  left: 'right',
  right: 'left'
};

coreStyle = {
  html: "<div class=\"" + className + "Wrapper\">\n  <div class=\"" + className + "Main\">\n    <div class=\"" + className + "Content\">\n    </div>\n  </div>\n</div>",
  css: "." + className + "Wrapper {\n  z-index: 1;\n  position: absolute;\n  display: inline-block;\n  height: 0;\n  width: 0;\n}\n\n." + className + "Main {\n  display: none;\n  z-index: 1;\n  position: absolute;\n  cursor: pointer;\n}\n\n." + className + "Content {\n  background: #fff;\n  position: relative;\n  font-size: 11px;\n  box-shadow: 0 0 6px #000;\n  -moz-box-shadow: 0 0 6px #000;\n  -webkit-box-shadow: 0 0 6px #000;\n  padding: 4px 10px 4px 8px;\n  border-radius: 6px;\n  border-style: solid;\n  border-width: 2px;\n  -moz-border-radius: 6px;\n  -webkit-border-radius: 6px;\n  white-space: nowrap;\n}"
};

userStyles = {
  "default": {
    html: "<span>test</span>",
    css: "body {\n  test: 42\n}"
  },
  bootstrap: {
    html: "<span>test</span>",
    css: "body {\n  test: 42\n}"
  }
};

pluginOptions = {
  autoHidePrompt: false,
  autoHideDelay: 10000,
  arrowShow: true,
  arrowSize: 5,
  arrowPosition: 'top',
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
  if ($.isPlainObject(options)) {
    return $.extend(this, options);
  }
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
    this.wrapper = $(coreStyle.html);
    this.main = this.wrapper.find("." + className + "Main");
    this.content = this.main.find("." + className + "Content");
    this.elem.before(this.wrapper);
    this.main.css(this.calculateCSS());
    this.run(node);
  }

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
    hidden = this.main.parent().parents(':hidden').length > 0;
    if (hidden && show) {
      this.main.show();
    }
    if (hidden && !show) {
      this.main.hide();
    }
    if (!hidden && show) {
      this.main[this.options.showAnimation](this.options.showDuration);
    }
    if (!hidden && !show) {
      return this.main[this.options.hideAnimation](this.options.hideDuration);
    }
  };

  Prompt.prototype.calculateCSS = function() {
    var elementPosition, height, left, mainPosition;
    elementPosition = this.elem.position();
    mainPosition = this.main.parent().position();
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

  Prompt.prototype.run = function(node, options) {
    var t;
    if ($.isPlainObject(options)) {
      $.extend(this.options, options);
    } else if ($.type(options) === 'string') {
      this.options.color = options;
    }
    if (this.main && !node) {
      this.showMain(false);
      return;
    } else if (!this.main && !node) {
      return;
    }
    if ($.type(node) === 'string') {
      this.content.html(node.replace('\n', '<br/>'));
    } else {
      this.content.empty().append(node);
    }
    this.content.css({
      'color': this.getColor(),
      'border-color': this.getColor()
    });
    if (this.arrow) {
      this.arrow.remove();
    }
    this.buildArrow();
    this.content.before(this.arrow);
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
  $("head").append(create("style").html(coreStyle.css));
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
  return $.extend(true, userStyles, s);
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