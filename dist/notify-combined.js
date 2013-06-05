/** Notify.js - v0.0.1 - 2013/06/05
 * http://notifyjs.com/
 * Copyright (c) 2013 Jaime Pillora - MIT
 */
(function(window,document,undefined) {
'use strict';

var Notification, addStyle, coreStyle, cornerElem, createElem, defaults, getAnchorElement, hAligns, incr, inherit, insertCSS, mainPositions, opposites, parsePosition, pluginClassName, pluginName, pluginOptions, positions, realign, stylePrefixes, styles, vAligns,
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

stylePrefixes = {
  "border-radius": ["-webkit-", "-moz-"]
};

addStyle = function(name, def) {
  var cssText;
  if (styles[name]) {
    if (window.console) {
      console.warn("" + pluginName + ": overwriting style '" + name + "'");
    }
    $("#notify-" + name).remove();
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
  return def.cssElem.attr('id', "notify-" + def.name);
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
  elementPosition: 'bottom',
  globalPosition: 'top right',
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

defaults = function(opts) {
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
      this.rawHTML = true;
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
    text = this.options.position || (this.elem ? this.options.elementPosition : this.options.globalPosition);
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

  Notification.prototype.updateClasses = function() {
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
      this.text[this.rawHTML ? 'html' : 'text'](data);
    } else {
      this.text.empty().append(data);
    }
    this.updateClasses();
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
  defaults: defaults,
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
/** Notify.js - v0.0.1 - 2013/06/05
 * http://notifyjs.com/
 * Copyright (c) 2013 Jaime Pillora - MIT
 */
(function(t,i,n){"use strict";var e,o,s,r,a,h,l,p,c,u,d,f,m,w,y,g,v,b,x,C,H,S,T=[].indexOf||function(t){for(var i=0,n=this.length;n>i;i++)if(i in this&&this[i]===t)return i;return-1};g="notify",y=g+"js",b={t:"top",m:"middle",b:"bottom",l:"left",c:"center",r:"right"},p=["l","c","r"],S=["t","m","b"],f=["t","b","l","r"],m={t:"b",m:null,b:"t",l:"r",c:null,r:"l"},w=function(t){var i;return i=[],$.each(t.split(/\W+/),function(t,e){var o;return o=e.toLowerCase().charAt(0),b[o]?i.push(o):n}),i},H={},s={name:"core",html:'<div class="'+y+'-wrapper">\n  <div class="'+y+'-arrow"></div>\n  <div class="'+y+'-container"></div>\n</div>',css:"."+y+"-corner {\n  position: fixed;\n  top: 0;\n  right: 0;\n  margin: 5px;\n  z-index: 1050;\n}\n\n."+y+"-corner ."+y+"-wrapper,\n."+y+"-corner ."+y+"-container {\n  position: relative;\n  display: block;\n  height: inherit;\n  width: inherit;\n}\n\n."+y+"-wrapper {\n  z-index: 1;\n  position: absolute;\n  display: inline-block;\n  height: 0;\n  width: 0;\n}\n\n."+y+"-container {\n  display: none;\n  z-index: 1;\n  position: absolute;\n  cursor: pointer;\n}\n\n."+y+"-text {\n  position: relative;\n}\n\n."+y+"-arrow {\n  position: absolute;\n  z-index: 2;\n  width: 0;\n  height: 0;\n}"},C={"border-radius":["-webkit-","-moz-"]},o=function(i,e){var o;return H[i]&&(t.console&&console.warn(""+g+": overwriting style '"+i+"'"),$("#notify-"+i).remove()),e.name=i,H[i]=e,!e.cssElem&&(o="",e.classes&&$.each(e.classes,function(t,i){return o+="."+y+"-"+e.name+"-"+t+" {\n",$.each(i,function(t,i){return C[t]&&$.each(C[t],function(n,e){return o+="  "+e+t+": "+i+";\n"}),o+="  "+t+": "+i+";\n"}),o+="}\n"}),e.css&&(o+="/* styles for "+e.name+" */\n"+e.css),o)?(e.cssElem=d(o),e.cssElem.attr("id","notify-"+e.name)):n},d=function(t){var i;i=a("style"),$("head").append(i);try{i.html(t)}catch(n){i[0].styleSheet.cssText=t}return i},v={autoHide:!0,autoHideDelay:5e3,arrowShow:!0,arrowSize:5,elementPosition:"bottom",globalPosition:"top right",style:"bootstrap",className:"error",showAnimation:"slideDown",showDuration:400,hideAnimation:"slideUp",hideDuration:200,offsetY:0,offsetX:0},u=function(t,i){var n;return n=function(){},n.prototype=t,$.extend(!0,new n,i)},h=function(t){return $.extend(v,t)},a=function(t){return $("<"+t+"></"+t+">")},r=a("div").addClass(""+y+"-corner"),l=function(t){var i;return t.is("[type=radio]")&&(i=t.parents("form:first").find("[type=radio]").filter(function(i,n){return $(n).attr("name")===t.attr("name")}),t=i.first()),t},c=function(t,i,e){var o,s;if("string"==typeof e)e=parseInt(e,10);else if("number"!=typeof e)return;if(!isNaN(e))return o=b[m[i.charAt(0)]],s=i,t[o]!==n&&(i=b[o.charAt(0)],e*=-1),t[i]===n?t[i]=e:t[i]+=e,null},x=function(t,i,n){if("l"===t||"t"===t)return 0;if("c"===t||"m"===t)return n/2-i/2;if("r"===t||"b"===t)return n-i;throw"Invalid alignment"},e=function(){function t(t,i,n){"string"==typeof n&&(n={className:n}),this.options=u(v,$.isPlainObject(n)?n:{}),this.loadHTML(),this.wrapper=$(s.html),this.wrapper.data(y,this),this.arrow=this.wrapper.find("."+y+"-arrow"),this.container=this.wrapper.find("."+y+"-container"),this.container.append(this.userContainer),t&&t.length?(this.elementType=t.attr("type"),this.originalElement=t,this.elem=l(t),this.elem.data(y,this),this.elem.before(this.wrapper)):(this.options.arrowShow=!1,r.prepend(this.wrapper)),this.container.hide(),this.run(i)}return t.prototype.loadHTML=function(){var t;if(t=this.getStyle(),this.userContainer=$(t.html),this.text=this.userContainer.find("[data-notify-text]"),0===this.text.length&&(this.text=this.userContainer.find("[data-notify-html]"),this.rawHTML=!0),0===this.text.length)throw"style: '"+name+"' HTML is missing a: 'data-notify-text' or 'data-notify-html' attribute";return this.text.addClass(""+y+"-text")},t.prototype.show=function(t,i){var n,e,o,s;if(null==i&&(i=$.noop),s=this.container.parent().parents(":hidden").length>0,e=this.container.add(this.arrow),n=[],s&&t)o="show";else if(s&&!t)o="hide";else if(!s&&t)o=this.options.showAnimation,n.push(this.options.showDuration);else{if(s||t)return i();o=this.options.hideAnimation,n.push(this.options.hideDuration)}return n.push(i),e[o].apply(e,n)},t.prototype.updatePosition=function(){var t,i,e,o,s,r,a,h,l,u,d,w,y,g,v,C,H,A,N,P,k,z,D,M,L,j,E;if(this.elem){if(d=this.elem.position(),h=this.elem.outerHeight(),w=this.elem.outerWidth(),l=this.elem.innerHeight(),u=this.elem.innerWidth(),L=this.wrapper.position(),s=this.container.height(),r=this.container.width(),D=this.getPosition(),N=D[0],H=D[1],A=D[2]||H,y=b[N],v=m[N],C=b[v],a={},a[C]="b"===N?h:"r"===N?w:0,c(a,"left",d.left-L.left),g=parseInt(this.elem.css("margin-left"),10),g&&c(a,"left",g),/^inline/.test(this.elem.css("display"))&&(P=parseInt(this.elem.css("padding-top"),10),P&&c(a,"top",-P)),c(a,"top",this.options.offsetY),c(a,"left",this.options.offsetX),M=this.getStyle(),this.options.arrowShow){for(e=this.options.arrowSize,i=$.extend({},a),t=this.userContainer.css("border-color")||this.userContainer.css("background-color")||"white",j=0,E=f.length;E>j;j++)k=f[j],z=b[k],k!==v&&(o=z===y?t:"transparent",i["border-"+z]=""+e+"px solid "+o);c(a,b[v],e),T.call(f,H)>=0&&c(i,b[H],2*e)}else this.arrow.hide();return T.call(S,N)>=0?(c(a,"left",x(H,r,w)),i&&c(i,"left",x(H,e,u))):T.call(p,N)>=0&&(c(a,"top",x(H,s,h)),i&&c(i,"top",x(H,e,l))),this.container.is(":visible")&&(a.display="block"),this.container.removeAttr("style").css(a),i?this.arrow.removeAttr("style").css(i):n}},t.prototype.getPosition=function(){var t,i,n,e,o,s,r,a;if(i=this.options.position||(this.elem?this.options.elementPosition:this.options.globalPosition),t=w(i),0===t.length&&(t[0]="b"),n=t[0],0>T.call(f,n))throw"Must be one of ["+f+"]";if((1===t.length||(e=t[0],T.call(S,e)>=0&&(o=t[1],0>T.call(p,o)))||(s=t[0],T.call(p,s)>=0&&(r=t[1],0>T.call(S,r))))&&(t[1]=(a=t[0],T.call(p,a)>=0?"m":"l")),!this.options.autoReposition)return t;throw"Not implemented"},t.prototype.getStyle=function(t){var i;if(t||(t=this.options.style),t||(t="default"),i=H[t],!i)throw"Missing style: "+t;return i},t.prototype.updateClasses=function(){var t,i;return t=["base"],$.isArray(this.options.className)?t=t.concat(this.options.className):this.options.className&&t.push(this.options.className),i=this.getStyle(),t=$.map(t,function(t){return""+y+"-"+i.name+"-"+t}).join(" "),this.userContainer.attr("class",t)},t.prototype.run=function(t,i){var e=this;return $.isPlainObject(i)?$.extend(this.options,i):"string"===$.type(i)&&(this.options.color=i),this.container&&!t?(this.show(!1),n):this.container||t?("string"===$.type(t)?this.text[this.rawHTML?"html":"text"](t):this.text.empty().append(t),this.updateClasses(),this.updatePosition(),this.show(!0),this.options.autoHide?(clearTimeout(this.autohideTimer),this.autohideTimer=setTimeout(function(){return e.show(!1)},this.options.autoHideDelay)):n):n},t.prototype.destroy=function(){var t=this;return this.show(!1,function(){return t.wrapper.remove()})},t}(),$[g]=function(t,i,n){return t&&t.nodeName||t.jquery?$(t)[g](i,n):(n=i,i=t,new e(null,i,n)),t},$.fn[g]=function(t,i){return $(this).each(function(){var n;return n=l($(this)).data(y),n?n.run(t,i):new e($(this),t,i)}),this},$.extend($[g],{defaults:h,addStyle:o}),$(function(){return $("body").append(r),$("link").each(function(){var t,i;return i=$(this).attr("href"),i.match(/bootstrap/)?(t=!0,!1):n}),d(s.css).attr("data-notify-style","core"),$(i).on("click","."+y+"-wrapper",function(){var t;return(t=$(this).data(y))?t.elem?t.show(!1):t.destroy():n})})})(window,document);

$.notify.addStyle("bootstrap", {
  html: "<div>\n<span data-notify-text></span>\n</div>",
  classes: {
    base: {
      "font-weight": "bold",
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
    info: {
      "color": "#3A87AD",
      "background-color": "#D9EDF7",
      "border-color": "#BCE8F1",
      "background-image": "url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3QYFAhkSsdes/QAAA8dJREFUOMvVlGtMW2UYx//POaWHXg6lLaW0ypAtw1UCgbniNOLcVOLmAjHZolOYlxmTGXVZdAnRfXQm+7SoU4mXaOaiZsEpC9FkiQs6Z6bdCnNYruM6KNBw6YWewzl9z+sHImEWv+vz7XmT95f/+3/+7wP814v+efDOV3/SoX3lHAA+6ODeUFfMfjOWMADgdk+eEKz0pF7aQdMAcOKLLjrcVMVX3xdWN29/GhYP7SvnP0cWfS8caSkfHZsPE9Fgnt02JNutQ0QYHB2dDz9/pKX8QjjuO9xUxd/66HdxTeCHZ3rojQObGQBcuNjfplkD3b19Y/6MrimSaKgSMmpGU5WevmE/swa6Oy73tQHA0Rdr2Mmv/6A1n9w9suQ7097Z9lM4FlTgTDrzZTu4StXVfpiI48rVcUDM5cmEksrFnHxfpTtU/3BFQzCQF/2bYVoNbH7zmItbSoMj40JSzmMyX5qDvriA7QdrIIpA+3cdsMpu0nXI8cV0MtKXCPZev+gCEM1S2NHPvWfP/hL+7FSr3+0p5RBEyhEN5JCKYr8XnASMT0xBNyzQGQeI8fjsGD39RMPk7se2bd5ZtTyoFYXftF6y37gx7NeUtJJOTFlAHDZLDuILU3j3+H5oOrD3yWbIztugaAzgnBKJuBLpGfQrS8wO4FZgV+c1IxaLgWVU0tMLEETCos4xMzEIv9cJXQcyagIwigDGwJgOAtHAwAhisQUjy0ORGERiELgG4iakkzo4MYAxcM5hAMi1WWG1yYCJIcMUaBkVRLdGeSU2995TLWzcUAzONJ7J6FBVBYIggMzmFbvdBV44Corg8vjhzC+EJEl8U1kJtgYrhCzgc/vvTwXKSib1paRFVRVORDAJAsw5FuTaJEhWM2SHB3mOAlhkNxwuLzeJsGwqWzf5TFNdKgtY5qHp6ZFf67Y/sAVadCaVY5YACDDb3Oi4NIjLnWMw2QthCBIsVhsUTU9tvXsjeq9+X1d75/KEs4LNOfcdf/+HthMnvwxOD0wmHaXr7ZItn2wuH2SnBzbZAbPJwpPx+VQuzcm7dgRCB57a1uBzUDRL4bfnI0RE0eaXd9W89mpjqHZnUI5Hh2l2dkZZUhOqpi2qSmpOmZ64Tuu9qlz/SEXo6MEHa3wOip46F1n7633eekV8ds8Wxjn37Wl63VVa+ej5oeEZ/82ZBETJjpJ1Rbij2D3Z/1trXUvLsblCK0XfOx0SX2kMsn9dX+d+7Kf6h8o4AIykuffjT8L20LU+w4AZd5VvEPY+XpWqLV327HR7DzXuDnD8r+ovkBehJ8i+y8YAAAAASUVORK5CYII=)"
    },
    warn: {
      "color": "#C09853",
      "background-color": "#FCF8E3",
      "border-color": "#FBEED5",
      "background-image": "url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAMAAAC6V+0/AAABJlBMVEXr6eb/2oD/wi7/xjr/0mP/ykf/tQD/vBj/3o7/uQ//vyL/twebhgD/4pzX1K3z8e349vK6tHCilCWbiQymn0jGworr6dXQza3HxcKkn1vWvV/5uRfk4dXZ1bD18+/52YebiAmyr5S9mhCzrWq5t6ufjRH54aLs0oS+qD751XqPhAybhwXsujG3sm+Zk0PTwG6Shg+PhhObhwOPgQL4zV2nlyrf27uLfgCPhRHu7OmLgAafkyiWkD3l49ibiAfTs0C+lgCniwD4sgDJxqOilzDWowWFfAH08uebig6qpFHBvH/aw26FfQTQzsvy8OyEfz20r3jAvaKbhgG9q0nc2LbZxXanoUu/u5WSggCtp1anpJKdmFz/zlX/1nGJiYmuq5Dx7+sAAADoPUZSAAAAAXRSTlMAQObYZgAAAAFiS0dEAIgFHUgAAAAJcEhZcwAACxMAAAsTAQCanBgAAAAHdElNRQfdBgUBGhh4aah5AAAAlklEQVQY02NgoBIIE8EUcwn1FkIXM1Tj5dDUQhPU502Mi7XXQxGz5uVIjGOJUUUW81HnYEyMi2HVcUOICQZzMMYmxrEyMylJwgUt5BljWRLjmJm4pI1hYp5SQLGYxDgmLnZOVxuooClIDKgXKMbN5ggV1ACLJcaBxNgcoiGCBiZwdWxOETBDrTyEFey0jYJ4eHjMGWgEAIpRFRCUt08qAAAAAElFTkSuQmCC)"
    }
  }
});

/** Notify.js - v0.0.1 - 2013/06/05
 * http://notifyjs.com/
 * Copyright (c) 2013 Jaime Pillora - MIT
 */
(function(window,document,undefined) {
'use strict';

var Notification, addStyle, coreStyle, cornerElem, createElem, defaults, getAnchorElement, hAligns, incr, inherit, insertCSS, mainPositions, opposites, parsePosition, pluginClassName, pluginName, pluginOptions, positions, realign, stylePrefixes, styles, vAligns,
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

stylePrefixes = {
  "border-radius": ["-webkit-", "-moz-"]
};

addStyle = function(name, def) {
  var cssText;
  if (styles[name]) {
    if (window.console) {
      console.warn("" + pluginName + ": overwriting style '" + name + "'");
    }
    $("#notify-" + name).remove();
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
  return def.cssElem.attr('id', "notify-" + def.name);
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
  elementPosition: 'bottom',
  globalPosition: 'top right',
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

defaults = function(opts) {
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
      this.rawHTML = true;
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
    text = this.options.position || (this.elem ? this.options.elementPosition : this.options.globalPosition);
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

  Notification.prototype.updateClasses = function() {
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
      this.text[this.rawHTML ? 'html' : 'text'](data);
    } else {
      this.text.empty().append(data);
    }
    this.updateClasses();
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
  defaults: defaults,
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
/** Notify.js - v0.0.1 - 2013/06/05
 * http://notifyjs.com/
 * Copyright (c) 2013 Jaime Pillora - MIT
 */
(function(t,i,n){"use strict";var e,o,s,r,a,h,l,p,c,u,d,f,m,w,y,g,v,b,x,C,H,S,T=[].indexOf||function(t){for(var i=0,n=this.length;n>i;i++)if(i in this&&this[i]===t)return i;return-1};g="notify",y=g+"js",b={t:"top",m:"middle",b:"bottom",l:"left",c:"center",r:"right"},p=["l","c","r"],S=["t","m","b"],f=["t","b","l","r"],m={t:"b",m:null,b:"t",l:"r",c:null,r:"l"},w=function(t){var i;return i=[],$.each(t.split(/\W+/),function(t,e){var o;return o=e.toLowerCase().charAt(0),b[o]?i.push(o):n}),i},H={},s={name:"core",html:'<div class="'+y+'-wrapper">\n  <div class="'+y+'-arrow"></div>\n  <div class="'+y+'-container"></div>\n</div>',css:"."+y+"-corner {\n  position: fixed;\n  top: 0;\n  right: 0;\n  margin: 5px;\n  z-index: 1050;\n}\n\n."+y+"-corner ."+y+"-wrapper,\n."+y+"-corner ."+y+"-container {\n  position: relative;\n  display: block;\n  height: inherit;\n  width: inherit;\n}\n\n."+y+"-wrapper {\n  z-index: 1;\n  position: absolute;\n  display: inline-block;\n  height: 0;\n  width: 0;\n}\n\n."+y+"-container {\n  display: none;\n  z-index: 1;\n  position: absolute;\n  cursor: pointer;\n}\n\n."+y+"-text {\n  position: relative;\n}\n\n."+y+"-arrow {\n  position: absolute;\n  z-index: 2;\n  width: 0;\n  height: 0;\n}"},C={"border-radius":["-webkit-","-moz-"]},o=function(i,e){var o;return H[i]&&(t.console&&console.warn(""+g+": overwriting style '"+i+"'"),$("#notify-"+i).remove()),e.name=i,H[i]=e,!e.cssElem&&(o="",e.classes&&$.each(e.classes,function(t,i){return o+="."+y+"-"+e.name+"-"+t+" {\n",$.each(i,function(t,i){return C[t]&&$.each(C[t],function(n,e){return o+="  "+e+t+": "+i+";\n"}),o+="  "+t+": "+i+";\n"}),o+="}\n"}),e.css&&(o+="/* styles for "+e.name+" */\n"+e.css),o)?(e.cssElem=d(o),e.cssElem.attr("id","notify-"+e.name)):n},d=function(t){var i;i=a("style"),$("head").append(i);try{i.html(t)}catch(n){i[0].styleSheet.cssText=t}return i},v={autoHide:!0,autoHideDelay:5e3,arrowShow:!0,arrowSize:5,elementPosition:"bottom",globalPosition:"top right",style:"bootstrap",className:"error",showAnimation:"slideDown",showDuration:400,hideAnimation:"slideUp",hideDuration:200,offsetY:0,offsetX:0},u=function(t,i){var n;return n=function(){},n.prototype=t,$.extend(!0,new n,i)},h=function(t){return $.extend(v,t)},a=function(t){return $("<"+t+"></"+t+">")},r=a("div").addClass(""+y+"-corner"),l=function(t){var i;return t.is("[type=radio]")&&(i=t.parents("form:first").find("[type=radio]").filter(function(i,n){return $(n).attr("name")===t.attr("name")}),t=i.first()),t},c=function(t,i,e){var o,s;if("string"==typeof e)e=parseInt(e,10);else if("number"!=typeof e)return;if(!isNaN(e))return o=b[m[i.charAt(0)]],s=i,t[o]!==n&&(i=b[o.charAt(0)],e*=-1),t[i]===n?t[i]=e:t[i]+=e,null},x=function(t,i,n){if("l"===t||"t"===t)return 0;if("c"===t||"m"===t)return n/2-i/2;if("r"===t||"b"===t)return n-i;throw"Invalid alignment"},e=function(){function t(t,i,n){"string"==typeof n&&(n={className:n}),this.options=u(v,$.isPlainObject(n)?n:{}),this.loadHTML(),this.wrapper=$(s.html),this.wrapper.data(y,this),this.arrow=this.wrapper.find("."+y+"-arrow"),this.container=this.wrapper.find("."+y+"-container"),this.container.append(this.userContainer),t&&t.length?(this.elementType=t.attr("type"),this.originalElement=t,this.elem=l(t),this.elem.data(y,this),this.elem.before(this.wrapper)):(this.options.arrowShow=!1,r.prepend(this.wrapper)),this.container.hide(),this.run(i)}return t.prototype.loadHTML=function(){var t;if(t=this.getStyle(),this.userContainer=$(t.html),this.text=this.userContainer.find("[data-notify-text]"),0===this.text.length&&(this.text=this.userContainer.find("[data-notify-html]"),this.rawHTML=!0),0===this.text.length)throw"style: '"+name+"' HTML is missing a: 'data-notify-text' or 'data-notify-html' attribute";return this.text.addClass(""+y+"-text")},t.prototype.show=function(t,i){var n,e,o,s;if(null==i&&(i=$.noop),s=this.container.parent().parents(":hidden").length>0,e=this.container.add(this.arrow),n=[],s&&t)o="show";else if(s&&!t)o="hide";else if(!s&&t)o=this.options.showAnimation,n.push(this.options.showDuration);else{if(s||t)return i();o=this.options.hideAnimation,n.push(this.options.hideDuration)}return n.push(i),e[o].apply(e,n)},t.prototype.updatePosition=function(){var t,i,e,o,s,r,a,h,l,u,d,w,y,g,v,C,H,A,N,P,k,z,D,M,L,j,E;if(this.elem){if(d=this.elem.position(),h=this.elem.outerHeight(),w=this.elem.outerWidth(),l=this.elem.innerHeight(),u=this.elem.innerWidth(),L=this.wrapper.position(),s=this.container.height(),r=this.container.width(),D=this.getPosition(),N=D[0],H=D[1],A=D[2]||H,y=b[N],v=m[N],C=b[v],a={},a[C]="b"===N?h:"r"===N?w:0,c(a,"left",d.left-L.left),g=parseInt(this.elem.css("margin-left"),10),g&&c(a,"left",g),/^inline/.test(this.elem.css("display"))&&(P=parseInt(this.elem.css("padding-top"),10),P&&c(a,"top",-P)),c(a,"top",this.options.offsetY),c(a,"left",this.options.offsetX),M=this.getStyle(),this.options.arrowShow){for(e=this.options.arrowSize,i=$.extend({},a),t=this.userContainer.css("border-color")||this.userContainer.css("background-color")||"white",j=0,E=f.length;E>j;j++)k=f[j],z=b[k],k!==v&&(o=z===y?t:"transparent",i["border-"+z]=""+e+"px solid "+o);c(a,b[v],e),T.call(f,H)>=0&&c(i,b[H],2*e)}else this.arrow.hide();return T.call(S,N)>=0?(c(a,"left",x(H,r,w)),i&&c(i,"left",x(H,e,u))):T.call(p,N)>=0&&(c(a,"top",x(H,s,h)),i&&c(i,"top",x(H,e,l))),this.container.is(":visible")&&(a.display="block"),this.container.removeAttr("style").css(a),i?this.arrow.removeAttr("style").css(i):n}},t.prototype.getPosition=function(){var t,i,n,e,o,s,r,a;if(i=this.options.position||(this.elem?this.options.elementPosition:this.options.globalPosition),t=w(i),0===t.length&&(t[0]="b"),n=t[0],0>T.call(f,n))throw"Must be one of ["+f+"]";if((1===t.length||(e=t[0],T.call(S,e)>=0&&(o=t[1],0>T.call(p,o)))||(s=t[0],T.call(p,s)>=0&&(r=t[1],0>T.call(S,r))))&&(t[1]=(a=t[0],T.call(p,a)>=0?"m":"l")),!this.options.autoReposition)return t;throw"Not implemented"},t.prototype.getStyle=function(t){var i;if(t||(t=this.options.style),t||(t="default"),i=H[t],!i)throw"Missing style: "+t;return i},t.prototype.updateClasses=function(){var t,i;return t=["base"],$.isArray(this.options.className)?t=t.concat(this.options.className):this.options.className&&t.push(this.options.className),i=this.getStyle(),t=$.map(t,function(t){return""+y+"-"+i.name+"-"+t}).join(" "),this.userContainer.attr("class",t)},t.prototype.run=function(t,i){var e=this;return $.isPlainObject(i)?$.extend(this.options,i):"string"===$.type(i)&&(this.options.color=i),this.container&&!t?(this.show(!1),n):this.container||t?("string"===$.type(t)?this.text[this.rawHTML?"html":"text"](t):this.text.empty().append(t),this.updateClasses(),this.updatePosition(),this.show(!0),this.options.autoHide?(clearTimeout(this.autohideTimer),this.autohideTimer=setTimeout(function(){return e.show(!1)},this.options.autoHideDelay)):n):n},t.prototype.destroy=function(){var t=this;return this.show(!1,function(){return t.wrapper.remove()})},t}(),$[g]=function(t,i,n){return t&&t.nodeName||t.jquery?$(t)[g](i,n):(n=i,i=t,new e(null,i,n)),t},$.fn[g]=function(t,i){return $(this).each(function(){var n;return n=l($(this)).data(y),n?n.run(t,i):new e($(this),t,i)}),this},$.extend($[g],{defaults:h,addStyle:o}),$(function(){return $("body").append(r),$("link").each(function(){var t,i;return i=$(this).attr("href"),i.match(/bootstrap/)?(t=!0,!1):n}),d(s.css).attr("data-notify-style","core"),$(i).on("click","."+y+"-wrapper",function(){var t;return(t=$(this).data(y))?t.elem?t.show(!1):t.destroy():n})})})(window,document);

$.notify.addStyle("bootstrap", {
  html: "<div>\n<span data-notify-text></span>\n</div>",
  classes: {
    base: {
      "font-weight": "bold",
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
    info: {
      "color": "#3A87AD",
      "background-color": "#D9EDF7",
      "border-color": "#BCE8F1",
      "background-image": "url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3QYFAhkSsdes/QAAA8dJREFUOMvVlGtMW2UYx//POaWHXg6lLaW0ypAtw1UCgbniNOLcVOLmAjHZolOYlxmTGXVZdAnRfXQm+7SoU4mXaOaiZsEpC9FkiQs6Z6bdCnNYruM6KNBw6YWewzl9z+sHImEWv+vz7XmT95f/+3/+7wP814v+efDOV3/SoX3lHAA+6ODeUFfMfjOWMADgdk+eEKz0pF7aQdMAcOKLLjrcVMVX3xdWN29/GhYP7SvnP0cWfS8caSkfHZsPE9Fgnt02JNutQ0QYHB2dDz9/pKX8QjjuO9xUxd/66HdxTeCHZ3rojQObGQBcuNjfplkD3b19Y/6MrimSaKgSMmpGU5WevmE/swa6Oy73tQHA0Rdr2Mmv/6A1n9w9suQ7097Z9lM4FlTgTDrzZTu4StXVfpiI48rVcUDM5cmEksrFnHxfpTtU/3BFQzCQF/2bYVoNbH7zmItbSoMj40JSzmMyX5qDvriA7QdrIIpA+3cdsMpu0nXI8cV0MtKXCPZev+gCEM1S2NHPvWfP/hL+7FSr3+0p5RBEyhEN5JCKYr8XnASMT0xBNyzQGQeI8fjsGD39RMPk7se2bd5ZtTyoFYXftF6y37gx7NeUtJJOTFlAHDZLDuILU3j3+H5oOrD3yWbIztugaAzgnBKJuBLpGfQrS8wO4FZgV+c1IxaLgWVU0tMLEETCos4xMzEIv9cJXQcyagIwigDGwJgOAtHAwAhisQUjy0ORGERiELgG4iakkzo4MYAxcM5hAMi1WWG1yYCJIcMUaBkVRLdGeSU2995TLWzcUAzONJ7J6FBVBYIggMzmFbvdBV44Corg8vjhzC+EJEl8U1kJtgYrhCzgc/vvTwXKSib1paRFVRVORDAJAsw5FuTaJEhWM2SHB3mOAlhkNxwuLzeJsGwqWzf5TFNdKgtY5qHp6ZFf67Y/sAVadCaVY5YACDDb3Oi4NIjLnWMw2QthCBIsVhsUTU9tvXsjeq9+X1d75/KEs4LNOfcdf/+HthMnvwxOD0wmHaXr7ZItn2wuH2SnBzbZAbPJwpPx+VQuzcm7dgRCB57a1uBzUDRL4bfnI0RE0eaXd9W89mpjqHZnUI5Hh2l2dkZZUhOqpi2qSmpOmZ64Tuu9qlz/SEXo6MEHa3wOip46F1n7633eekV8ds8Wxjn37Wl63VVa+ej5oeEZ/82ZBETJjpJ1Rbij2D3Z/1trXUvLsblCK0XfOx0SX2kMsn9dX+d+7Kf6h8o4AIykuffjT8L20LU+w4AZd5VvEPY+XpWqLV327HR7DzXuDnD8r+ovkBehJ8i+y8YAAAAASUVORK5CYII=)"
    },
    warn: {
      "color": "#C09853",
      "background-color": "#FCF8E3",
      "border-color": "#FBEED5",
      "background-image": "url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAMAAAC6V+0/AAABJlBMVEXr6eb/2oD/wi7/xjr/0mP/ykf/tQD/vBj/3o7/uQ//vyL/twebhgD/4pzX1K3z8e349vK6tHCilCWbiQymn0jGworr6dXQza3HxcKkn1vWvV/5uRfk4dXZ1bD18+/52YebiAmyr5S9mhCzrWq5t6ufjRH54aLs0oS+qD751XqPhAybhwXsujG3sm+Zk0PTwG6Shg+PhhObhwOPgQL4zV2nlyrf27uLfgCPhRHu7OmLgAafkyiWkD3l49ibiAfTs0C+lgCniwD4sgDJxqOilzDWowWFfAH08uebig6qpFHBvH/aw26FfQTQzsvy8OyEfz20r3jAvaKbhgG9q0nc2LbZxXanoUu/u5WSggCtp1anpJKdmFz/zlX/1nGJiYmuq5Dx7+sAAADoPUZSAAAAAXRSTlMAQObYZgAAAAFiS0dEAIgFHUgAAAAJcEhZcwAACxMAAAsTAQCanBgAAAAHdElNRQfdBgUBGhh4aah5AAAAlklEQVQY02NgoBIIE8EUcwn1FkIXM1Tj5dDUQhPU502Mi7XXQxGz5uVIjGOJUUUW81HnYEyMi2HVcUOICQZzMMYmxrEyMylJwgUt5BljWRLjmJm4pI1hYp5SQLGYxDgmLnZOVxuooClIDKgXKMbN5ggV1ACLJcaBxNgcoiGCBiZwdWxOETBDrTyEFey0jYJ4eHjMGWgEAIpRFRCUt08qAAAAAElFTkSuQmCC)"
    }
  }
});
