require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"OrientationSimulator":[function(require,module,exports){

/*
Tilt the simulator

@auther ho.s
@date 2016.10.04
 */
var OrientationSimulator;

OrientationSimulator = {};

OrientationSimulator.onTilt = function(cb) {
  var _left, _right, dScaleX, dx, dz, guideDx, isBackAni, isLeftAni, isRightAni, onMouseOut, onMouseOver, onTouchMove, ry;
  if (!Utils.isDesktop()) {
    return;
  }
  Events.Gamma = "OrientationSimulator.gamma";
  ry = 1 * 1.2;
  dx = 50;
  dz = -5;
  dScaleX = .96;
  guideDx = 30;
  Framer.Device.hands.perspective = 100 * 2;
  Framer.Device.hands.z = 100;
  _left = new Layer({
    name: '.left',
    width: Framer.Device.background.width / 2,
    height: Framer.Device.background.height,
    backgroundColor: 'rgba(0,0,0,0)',
    parent: Framer.Device.background
  });
  _right = new Layer({
    name: '.right',
    x: Framer.Device.background.width / 2,
    width: Framer.Device.background.width / 2,
    height: Framer.Device.background.height,
    backgroundColor: 'rgba(0,0,0,0)',
    parent: Framer.Device.background
  });
  _left.label = new Layer({
    name: '.left.label',
    x: Align.right(-800 * Framer.Device.hands.scale),
    y: Align.center,
    width: 500,
    html: "<strong>왼쪽</strong>으로<br/>기울이기",
    color: "rgba(0,0,0,.3)",
    style: {
      font: "300 100px/1 " + (Utils.deviceFont()),
      textAlign: "right",
      "-webkit-font-smoothing": "antialiased"
    },
    scale: Framer.Device.hands.scale,
    originX: 1,
    backgroundColor: "transparent",
    parent: _left
  });
  _left.label.custom = {
    oX: _left.label.x
  };
  _right.label = new Layer({
    name: '.right.label',
    x: Align.left(800 * Framer.Device.hands.scale),
    y: Align.center,
    width: 500,
    html: "<strong>오른쪽</strong>으로<br/>기울이기",
    color: "rgba(0,0,0,.3)",
    style: {
      font: "300 100px/1 " + (Utils.deviceFont()),
      textAlign: "left",
      "-webkit-font-smoothing": "antialiased"
    },
    scale: Framer.Device.hands.scale,
    originX: 0,
    backgroundColor: "transparent",
    parent: _right
  });
  _right.label.custom = {
    oX: _right.label.x
  };

  /*
  	 * Event :: Touch start
  	Framer.Device.background.onTapStart ->
  		centerX = Framer.Device.background.width / 2
  		if event.point.x < centerX
  			Framer.Device.handsImageLayer.animate properties: { x: Align.center(dx), rotationY: -ry, z: dz, scaleX: dScaleX }
  			Framer.Device.phone.animate properties: { x: Align.center(dx), rotationY: -ry, z: dz, scaleX: dScaleX }
  		else
  			Framer.Device.handsImageLayer.animate properties: { x: Align.center(-dx), rotationY: ry, z: dz, scaleX: dScaleX }
  			Framer.Device.phone.animate properties: { x: Align.center(-dx), rotationY: ry, z: dz, scaleX: dScaleX }
  
  	 * Event :: Touch end
  	Framer.Device.background.onTapEnd ->
  		Framer.Device.handsImageLayer.animate properties: { x: Align.center, rotationX: 0, rotationY: 0, z: 0, scaleX: 1 }
  		Framer.Device.phone.animate properties: { x: Align.center, rotationX: 0, rotationY: 0, z: 0, scaleX: 1 }
   */
  Framer.Device.phone.on("change:rotationY", function() {
    var ref;
    return (ref = cb(Utils.modulate(Framer.Device.phone.rotationY, [-ry, ry], [-1, 1], true), this)) != null ? ref : cb;
  });
  Framer.Device.background.on("change:size", function() {
    _left.props = {
      width: Framer.Device.background.width / 2,
      height: Framer.Device.background.height
    };
    _right.props = {
      x: Framer.Device.background.width / 2,
      width: Framer.Device.background.width / 2,
      height: Framer.Device.background.height
    };
    _left.label.props = {
      x: Align.right(-800 * Framer.Device.hands.scale),
      y: Align.center,
      scale: Framer.Device.hands.scale
    };
    _left.label.custom = {
      oX: _left.label.x
    };
    _right.label.props = {
      x: Align.left(800 * Framer.Device.hands.scale),
      y: Align.center,
      scale: Framer.Device.hands.scale
    };
    return _right.label.custom = {
      oX: _right.label.x
    };
  });
  isLeftAni = isBackAni = isRightAni = false;
  onMouseOver = function() {
    var x;
    if (this.name === ".left") {
      x = this.children[0].custom.oX - guideDx;
    } else {
      x = this.children[0].custom.oX + guideDx;
    }
    return this.children[0].animate({
      properties: {
        x: x
      }
    });
  };
  onMouseOut = function() {
    var callback;
    this.children[0].animate({
      properties: {
        x: this.children[0].custom.oX
      }
    });
    if (Framer.Device.phone.rotationY !== 0 && !isBackAni) {
      isLeftAni = false;
      isBackAni = true;
      isRightAni = false;
      Framer.Device.handsImageLayer.animate({
        properties: {
          x: Align.center,
          rotationX: 0,
          rotationY: 0,
          z: 0,
          scaleX: 1
        }
      });
      Framer.Device.phone.animate({
        properties: {
          x: Align.center,
          rotationX: 0,
          rotationY: 0,
          z: 0,
          scaleX: 1
        }
      });
      return Framer.Device.phone.onAnimationEnd(callback = function() {
        isBackAni = false;
        return Framer.Device.phone.off(Events.AnimationEnd, callback);
      });
    }
  };
  _left.onMouseOver(onMouseOver);
  _left.onMouseOut(onMouseOut);
  _right.onMouseOver(onMouseOver);
  _right.onMouseOut(onMouseOut);
  onTouchMove = function(_dx, _ry) {
    if (Framer.Device.phone.rotationY !== _ry && !(_ry === -ry ? isLeftAni : isRightAni)) {
      isLeftAni = isBackAni = isRightAni = false;
      if (_ry === -ry) {
        isLeftAni = true;
      } else {
        isRightAni = true;
      }
      Framer.Device.handsImageLayer.animate({
        properties: {
          x: Align.center(_dx),
          rotationY: _ry,
          z: dz,
          scaleX: dScaleX
        }
      });
      return Framer.Device.phone.animate({
        properties: {
          x: Align.center(_dx),
          rotationY: _ry,
          z: dz,
          scaleX: dScaleX
        }
      });
    }
  };
  _left.onTouchMove(function() {
    return onTouchMove(dx, -ry, isLeftAni);
  });
  return _right.onTouchMove(function() {
    return onTouchMove(-dx, ry, isRightAni);
  });
};

if (typeof module !== "undefined" && module !== null) {
  module.exports = OrientationSimulator;
}

Framer.OrientationSimulator = OrientationSimulator;


},{}],"System-Sensor":[function(require,module,exports){
'Sensor\n\n@auther ho.s\n@date 2016.10.04';
var Motion, Orientation, Sensor, SensorManager,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

SensorManager = {};

SensorManager.getDefaultSensor = function(type) {
  switch (type) {
    case Sensor.TYPE_ORIENTATION:
      return Orientation.get();
    case Sensor.TYPE_MOTION:
      return Motion.get();
  }
};

Sensor = (function(superClass) {
  extend(Sensor, superClass);

  Sensor.TYPE_ORIENTATION = "sensor.orientation";

  Sensor.TYPE_MOTION = "sensor.motion";

  Events.Change = "sensor.change";

  Sensor.define('smooth', Sensor.simpleProperty('smooth', 1));

  function Sensor() {
    Sensor.__super__.constructor.apply(this, arguments);
  }

  Sensor.prototype.onChange = function(cb) {
    return this.on(Events.Change, cb);
  };

  return Sensor;

})(Framer.BaseClass);

Orientation = (function(superClass) {
  var instance;

  extend(Orientation, superClass);

  instance = null;

  Orientation.get = function() {
    if (window.DeviceOrientationEvent) {
      if (instance == null) {
        instance = new Orientation();
      }
    } else {
      console.error("Not supported", "Device orientation events are not suported on this device");
    }
    return instance;
  };

  Orientation.define('alpha', Orientation.simpleProperty('alpha', 0));

  Orientation.define('beta', Orientation.simpleProperty('beta', 0));

  Orientation.define('gamma', Orientation.simpleProperty('gamma', 0));

  function Orientation() {
    Orientation.__super__.constructor.apply(this, arguments);
    Events.wrap(window).addEventListener("deviceorientation", (function(_this) {
      return function(event) {
        var orientation;
        _this.alpha = (event.alpha * _this.smooth) + (_this.alpha * (1 - _this.smooth));
        _this.beta = (event.beta * _this.smooth) + (_this.beta * (1 - _this.smooth));
        _this.gamma = (event.gamma * _this.smooth) + (_this.gamma * (1 - _this.smooth));
        orientation = {
          alpha: _this.alpha,
          beta: _this.beta,
          gamma: _this.gamma,
          absolute: event.absolute
        };
        return _this.emit(Events.Change, orientation);
      };
    })(this));
  }

  return Orientation;

})(Sensor);

Motion = (function(superClass) {
  var instance;

  extend(Motion, superClass);

  instance = null;

  Motion.get = function() {
    if (window.DeviceMotionEvent) {
      if (instance == null) {
        instance = new Motion();
      }
    } else {
      console.error("Not supported", "Device motion events are not suported on this device");
    }
    return instance;
  };

  Motion.define('x', Motion.simpleProperty('x', 0));

  Motion.define('y', Motion.simpleProperty('y', 0));

  Motion.define('z', Motion.simpleProperty('z', 0));

  Motion.define('gx', Motion.simpleProperty('gx', 0));

  Motion.define('gy', Motion.simpleProperty('gy', 0));

  Motion.define('gz', Motion.simpleProperty('gz', 0));

  Motion.define('alpha', Motion.simpleProperty('alpha', 0));

  Motion.define('beta', Motion.simpleProperty('beta', 0));

  Motion.define('gamma', Motion.simpleProperty('gamma', 0));

  Motion.define('interval', Motion.simpleProperty('interval', 0));

  function Motion() {
    Motion.__super__.constructor.apply(this, arguments);
    Events.wrap(window).addEventListener("devicemotion", (function(_this) {
      return function(event) {
        var motion;
        _this.x = (event.acceleration.x * _this.smooth) + (_this.x * (1 - _this.smooth));
        _this.y = (event.acceleration.y * _this.smooth) + (_this.y * (1 - _this.smooth));
        _this.z = (event.acceleration.z * _this.smooth) + (_this.z * (1 - _this.smooth));
        _this.gx = (event.accelerationIncludingGravity.x * _this.smooth) + (_this.gx * (1 - _this.smooth));
        _this.gy = (event.accelerationIncludingGravity.y * _this.smooth) + (_this.gy * (1 - _this.smooth));
        _this.gz = (event.accelerationIncludingGravity.z * _this.smooth) + (_this.gz * (1 - _this.smooth));
        _this.alpha = (event.rotationRate.alpha * _this.smooth) + (_this.alpha * (1 - _this.smooth));
        _this.beta = (event.rotationRate.beta * _this.smooth) + (_this.beta * (1 - _this.smooth));
        _this.gamma = (event.rotationRate.gamma * _this.smooth) + (_this.gamma * (1 - _this.smooth));
        _this.interval = event.interval;
        motion = {
          acceleration: {
            x: _this.x,
            y: _this.y,
            z: _this.z
          },
          accelerationIncludingGravity: {
            x: _this.gx,
            y: _this.gy,
            z: _this.gz
          },
          rotationRate: {
            alpha: _this.alpha,
            beta: _this.beta,
            gamma: _this.gamma
          },
          interval: _this.interval
        };
        return _this.emit(Events.Change, motion);
      };
    })(this));
  }

  return Motion;

})(Sensor);

if (window) {
  window.SensorManager = SensorManager;
  window.Sensor = Sensor;
  window.Orientation = Orientation;
  window.Motion = Motion;
}


},{}],"System":[function(require,module,exports){
var Context, getSystemService;

require('System-Sensor');

'System\n\n@auther ho.s\n@date 2016.10.04';

Context = {};

Context.SENSOR_SERVICE = "context.SENSOR_SERVICE";

getSystemService = function(service) {
  switch (service) {
    case Context.SENSOR_SERVICE:
      return SensorManager;
  }
};

if (window) {
  window.Context = Context;
  window.getSystemService = getSystemService;
}


},{"System-Sensor":"System-Sensor"}]},{},[])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZnJhbWVyLm1vZHVsZXMuanMiLCJzb3VyY2VzIjpbIi4uL21vZHVsZXMvU3lzdGVtLmNvZmZlZSIsIi4uL21vZHVsZXMvU3lzdGVtLVNlbnNvci5jb2ZmZWUiLCIuLi9tb2R1bGVzL09yaWVudGF0aW9uU2ltdWxhdG9yLmNvZmZlZSIsIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiXSwic291cmNlc0NvbnRlbnQiOlsicmVxdWlyZSAnU3lzdGVtLVNlbnNvcidcblxuJycnXG5TeXN0ZW1cblxuQGF1dGhlciBoby5zXG5AZGF0ZSAyMDE2LjEwLjA0XG4nJydcblxuIyBDb250ZXh0XG5Db250ZXh0ID0ge31cbiMgQ29udGV4dCA6IFNlbnNvclxuQ29udGV4dC5TRU5TT1JfU0VSVklDRSA9IFwiY29udGV4dC5TRU5TT1JfU0VSVklDRVwiXG5cbiMgR2V0IHN5c3RlbSBzZXJ2aWNlXG5nZXRTeXN0ZW1TZXJ2aWNlID0gKHNlcnZpY2UpLT5cblx0c3dpdGNoIHNlcnZpY2Vcblx0XHQjIFNlbnNvclxuXHRcdHdoZW4gQ29udGV4dC5TRU5TT1JfU0VSVklDRSB0aGVuIHJldHVybiBTZW5zb3JNYW5hZ2VyXG5cdFxuXG4jXG5pZiB3aW5kb3dcblx0d2luZG93LkNvbnRleHQgPSBDb250ZXh0IFxuXHR3aW5kb3cuZ2V0U3lzdGVtU2VydmljZSA9IGdldFN5c3RlbVNlcnZpY2Vcblx0IiwiJycnXG5TZW5zb3JcblxuQGF1dGhlciBoby5zXG5AZGF0ZSAyMDE2LjEwLjA0XG4nJydcblxuIyBTZW5zb3IgbWFuYWdlclxuU2Vuc29yTWFuYWdlciA9IHt9XG4jIFNlbnNvciBtYW5hZ2VyIDogR2V0IGRlZmF1bHQgc2Vuc29yXG5TZW5zb3JNYW5hZ2VyLmdldERlZmF1bHRTZW5zb3IgPSAodHlwZSkgLT5cblx0c3dpdGNoIHR5cGVcblx0XHQjIE9yaWVudGF0aW9uXG5cdFx0d2hlbiBTZW5zb3IuVFlQRV9PUklFTlRBVElPTiB0aGVuIHJldHVybiBPcmllbnRhdGlvbi5nZXQoKVxuXHRcdCMgTW90aW9uXG5cdFx0d2hlbiBTZW5zb3IuVFlQRV9NT1RJT04gdGhlbiByZXR1cm4gTW90aW9uLmdldCgpXG5cbiMgU2Vuc29yXG5jbGFzcyBTZW5zb3IgZXh0ZW5kcyBGcmFtZXIuQmFzZUNsYXNzXG5cdCMgU2Vuc29yIHR5cGVcblx0QFRZUEVfT1JJRU5UQVRJT046IFwic2Vuc29yLm9yaWVudGF0aW9uXCJcblx0QFRZUEVfTU9USU9OOiBcInNlbnNvci5tb3Rpb25cIlxuXG5cdCMgRXZlbnRzIDogQ2hhbmdlXG5cdEV2ZW50cy5DaGFuZ2UgPSBcInNlbnNvci5jaGFuZ2VcIlxuXG5cdCMgU21vb3RoXG5cdEBkZWZpbmUgJ3Ntb290aCcsIEBzaW1wbGVQcm9wZXJ0eSgnc21vb3RoJywgMSlcblxuXHQjIENvbnN0cnVjdG9yXG5cdGNvbnN0cnVjdG9yOiAoKSAtPlxuXHRcdHN1cGVyXG5cblx0IyBFdmVudCBsaXNudGVuZXIgOiBjaGFuZ2Vcblx0b25DaGFuZ2U6IChjYikgLT4gQG9uIEV2ZW50cy5DaGFuZ2UsIGNiXG5cbiMgU2Vuc29yIDogT3JpZW50YXRpb25cbmNsYXNzIE9yaWVudGF0aW9uIGV4dGVuZHMgU2Vuc29yXG5cblx0IyBTaW5nbGV0b25cblx0aW5zdGFuY2UgPSBudWxsXG5cdEBnZXQ6IC0+IFxuXHRcdCMgT3JpZW50YXRpb24gZXZlbnQgc3VwcG9ydGVkXG5cdFx0aWYgd2luZG93LkRldmljZU9yaWVudGF0aW9uRXZlbnQgdGhlbiBpbnN0YW5jZSA/PSBuZXcgT3JpZW50YXRpb24oKVxuXHRcdCMgTm90IHN1cHBvcnRlZFxuXHRcdGVsc2UgY29uc29sZS5lcnJvciBcIk5vdCBzdXBwb3J0ZWRcIiwgXCJEZXZpY2Ugb3JpZW50YXRpb24gZXZlbnRzIGFyZSBub3Qgc3Vwb3J0ZWQgb24gdGhpcyBkZXZpY2VcIlxuXG5cdFx0aW5zdGFuY2VcblxuXHQjIFZhbHVlXG5cdEBkZWZpbmUgJ2FscGhhJywgQHNpbXBsZVByb3BlcnR5KCdhbHBoYScsIDApXG5cdEBkZWZpbmUgJ2JldGEnLCBAc2ltcGxlUHJvcGVydHkoJ2JldGEnLCAwKVxuXHRAZGVmaW5lICdnYW1tYScsIEBzaW1wbGVQcm9wZXJ0eSgnZ2FtbWEnLCAwKVxuXG5cdCMgQ29uc3RydWN0b3Jcblx0Y29uc3RydWN0b3I6ICgpIC0+XG5cdFx0c3VwZXJcblxuXHRcdCMgRXZlbnRcblx0XHRFdmVudHMud3JhcCh3aW5kb3cpLmFkZEV2ZW50TGlzdGVuZXIgXCJkZXZpY2VvcmllbnRhdGlvblwiLCAoZXZlbnQpID0+XG5cdFx0XHRAYWxwaGEgPSAoZXZlbnQuYWxwaGEgKiBAc21vb3RoKSArIChAYWxwaGEgKiAoMS0gQHNtb290aCkpXG5cdFx0XHRAYmV0YSA9IChldmVudC5iZXRhICogQHNtb290aCkgKyAoQGJldGEgKiAoMS0gQHNtb290aCkpXG5cdFx0XHRAZ2FtbWEgPSAoZXZlbnQuZ2FtbWEgKiBAc21vb3RoKSArIChAZ2FtbWEgKiAoMS0gQHNtb290aCkpXG5cblx0XHRcdG9yaWVudGF0aW9uID0gXG5cdFx0XHRcdGFscGhhOiBAYWxwaGFcblx0XHRcdFx0YmV0YTogQGJldGFcblx0XHRcdFx0Z2FtbWE6IEBnYW1tYVxuXHRcdFx0XHRhYnNvbHV0ZTogZXZlbnQuYWJzb2x1dGVcblxuXHRcdFx0QGVtaXQgRXZlbnRzLkNoYW5nZSwgb3JpZW50YXRpb25cblxuIyBTZW5zb3IgOiBNb3Rpb25cbmNsYXNzIE1vdGlvbiBleHRlbmRzIFNlbnNvclxuXG5cdCMgU2luZ2xldG9uXG5cdGluc3RhbmNlID0gbnVsbFxuXHRAZ2V0OiAtPiBcblx0XHQjIE9yaWVudGF0aW9uIGV2ZW50IHN1cHBvcnRlZFxuXHRcdGlmIHdpbmRvdy5EZXZpY2VNb3Rpb25FdmVudCB0aGVuIGluc3RhbmNlID89IG5ldyBNb3Rpb24oKVxuXHRcdCMgTm90IHN1cHBvcnRlZFxuXHRcdGVsc2UgY29uc29sZS5lcnJvciBcIk5vdCBzdXBwb3J0ZWRcIiwgXCJEZXZpY2UgbW90aW9uIGV2ZW50cyBhcmUgbm90IHN1cG9ydGVkIG9uIHRoaXMgZGV2aWNlXCJcblxuXHRcdGluc3RhbmNlXG5cblx0IyBWYWx1ZVxuXHRAZGVmaW5lICd4JywgQHNpbXBsZVByb3BlcnR5KCd4JywgMClcblx0QGRlZmluZSAneScsIEBzaW1wbGVQcm9wZXJ0eSgneScsIDApXG5cdEBkZWZpbmUgJ3onLCBAc2ltcGxlUHJvcGVydHkoJ3onLCAwKVxuXHRAZGVmaW5lICdneCcsIEBzaW1wbGVQcm9wZXJ0eSgnZ3gnLCAwKVxuXHRAZGVmaW5lICdneScsIEBzaW1wbGVQcm9wZXJ0eSgnZ3knLCAwKVxuXHRAZGVmaW5lICdneicsIEBzaW1wbGVQcm9wZXJ0eSgnZ3onLCAwKVxuXHRAZGVmaW5lICdhbHBoYScsIEBzaW1wbGVQcm9wZXJ0eSgnYWxwaGEnLCAwKVxuXHRAZGVmaW5lICdiZXRhJywgQHNpbXBsZVByb3BlcnR5KCdiZXRhJywgMClcblx0QGRlZmluZSAnZ2FtbWEnLCBAc2ltcGxlUHJvcGVydHkoJ2dhbW1hJywgMClcblx0QGRlZmluZSAnaW50ZXJ2YWwnLCBAc2ltcGxlUHJvcGVydHkoJ2ludGVydmFsJywgMClcblxuXG5cdCMgQ29uc3RydWN0b3Jcblx0Y29uc3RydWN0b3I6ICgpIC0+XG5cdFx0c3VwZXJcblxuXHRcdCMgRXZlbnRcblx0XHRFdmVudHMud3JhcCh3aW5kb3cpLmFkZEV2ZW50TGlzdGVuZXIgXCJkZXZpY2Vtb3Rpb25cIiwgKGV2ZW50KSA9PlxuXHRcdFx0QHggPSAoZXZlbnQuYWNjZWxlcmF0aW9uLnggKiBAc21vb3RoKSArIChAeCAqICgxLSBAc21vb3RoKSlcblx0XHRcdEB5ID0gKGV2ZW50LmFjY2VsZXJhdGlvbi55ICogQHNtb290aCkgKyAoQHkgKiAoMS0gQHNtb290aCkpXG5cdFx0XHRAeiA9IChldmVudC5hY2NlbGVyYXRpb24ueiAqIEBzbW9vdGgpICsgKEB6ICogKDEtIEBzbW9vdGgpKVxuXG5cdFx0XHRAZ3ggPSAoZXZlbnQuYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eS54ICogQHNtb290aCkgKyAoQGd4ICogKDEtIEBzbW9vdGgpKVxuXHRcdFx0QGd5ID0gKGV2ZW50LmFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHkueSAqIEBzbW9vdGgpICsgKEBneSAqICgxLSBAc21vb3RoKSlcblx0XHRcdEBneiA9IChldmVudC5hY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5LnogKiBAc21vb3RoKSArIChAZ3ogKiAoMS0gQHNtb290aCkpXG5cblx0XHRcdEBhbHBoYSA9IChldmVudC5yb3RhdGlvblJhdGUuYWxwaGEgKiBAc21vb3RoKSArIChAYWxwaGEgKiAoMS0gQHNtb290aCkpXG5cdFx0XHRAYmV0YSA9IChldmVudC5yb3RhdGlvblJhdGUuYmV0YSAqIEBzbW9vdGgpICsgKEBiZXRhICogKDEtIEBzbW9vdGgpKVxuXHRcdFx0QGdhbW1hID0gKGV2ZW50LnJvdGF0aW9uUmF0ZS5nYW1tYSAqIEBzbW9vdGgpICsgKEBnYW1tYSAqICgxLSBAc21vb3RoKSlcblxuXHRcdFx0QGludGVydmFsID0gZXZlbnQuaW50ZXJ2YWxcblxuXHRcdFx0bW90aW9uID0gXG5cdFx0XHRcdGFjY2VsZXJhdGlvbjogeDogQHgsIHk6IEB5LCB6OiBAelxuXHRcdFx0XHRhY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5OiB4OiBAZ3gsIHk6IEBneSwgejogQGd6XG5cdFx0XHRcdHJvdGF0aW9uUmF0ZTogYWxwaGE6IEBhbHBoYSwgYmV0YTogQGJldGEsIGdhbW1hOiBAZ2FtbWFcblx0XHRcdFx0aW50ZXJ2YWw6IEBpbnRlcnZhbFxuXG5cdFx0XHRAZW1pdCBFdmVudHMuQ2hhbmdlLCBtb3Rpb25cblxuI1xuaWYgd2luZG93XG5cdHdpbmRvdy5TZW5zb3JNYW5hZ2VyID0gU2Vuc29yTWFuYWdlclxuXHR3aW5kb3cuU2Vuc29yID0gU2Vuc29yXG5cdHdpbmRvdy5PcmllbnRhdGlvbiA9IE9yaWVudGF0aW9uXG5cdHdpbmRvdy5Nb3Rpb24gPSBNb3Rpb24iLCIjIyNcblRpbHQgdGhlIHNpbXVsYXRvclxuXG5AYXV0aGVyIGhvLnNcbkBkYXRlIDIwMTYuMTAuMDRcbiMjI1xuT3JpZW50YXRpb25TaW11bGF0b3IgPSB7fVxuT3JpZW50YXRpb25TaW11bGF0b3Iub25UaWx0ID0gKGNiKSAtPlxuXHRyZXR1cm4gdW5sZXNzIFV0aWxzLmlzRGVza3RvcCgpXG5cblx0RXZlbnRzLkdhbW1hID0gXCJPcmllbnRhdGlvblNpbXVsYXRvci5nYW1tYVwiXG5cblx0cnkgPSAxICogMS4yXG5cdGR4ID0gNTBcblx0ZHogPSAtNVxuXHRkU2NhbGVYID0gLjk2XG5cdGd1aWRlRHggPSAzMFxuXG5cdCMgU2V0IHBlcnNwZWN0aXZlXG5cdEZyYW1lci5EZXZpY2UuaGFuZHMucGVyc3BlY3RpdmUgPSAxMDAgKiAyXG5cdEZyYW1lci5EZXZpY2UuaGFuZHMueiA9IDEwMFxuXG5cdCMgVmlld1xuXHRfbGVmdCA9IG5ldyBMYXllclxuXHRcdG5hbWU6ICcubGVmdCdcblx0XHR3aWR0aDogRnJhbWVyLkRldmljZS5iYWNrZ3JvdW5kLndpZHRoIC8gMiwgaGVpZ2h0OiBGcmFtZXIuRGV2aWNlLmJhY2tncm91bmQuaGVpZ2h0XG5cdFx0YmFja2dyb3VuZENvbG9yOiAncmdiYSgwLDAsMCwwKSdcblx0XHRwYXJlbnQ6IEZyYW1lci5EZXZpY2UuYmFja2dyb3VuZFxuXHRfcmlnaHQgPSBuZXcgTGF5ZXJcblx0XHRuYW1lOiAnLnJpZ2h0J1xuXHRcdHg6IEZyYW1lci5EZXZpY2UuYmFja2dyb3VuZC53aWR0aCAvIDJcblx0XHR3aWR0aDogRnJhbWVyLkRldmljZS5iYWNrZ3JvdW5kLndpZHRoIC8gMiwgaGVpZ2h0OiBGcmFtZXIuRGV2aWNlLmJhY2tncm91bmQuaGVpZ2h0XG5cdFx0YmFja2dyb3VuZENvbG9yOiAncmdiYSgwLDAsMCwwKSdcblx0XHRwYXJlbnQ6IEZyYW1lci5EZXZpY2UuYmFja2dyb3VuZFxuXHRfbGVmdC5sYWJlbCA9IG5ldyBMYXllclxuXHRcdG5hbWU6ICcubGVmdC5sYWJlbCdcblx0XHR4OiBBbGlnbi5yaWdodCgtODAwICogRnJhbWVyLkRldmljZS5oYW5kcy5zY2FsZSksIHk6IEFsaWduLmNlbnRlclxuXHRcdHdpZHRoOiA1MDBcblx0XHRodG1sOiBcIjxzdHJvbmc+7Jm87Kq9PC9zdHJvbmc+7Jy866GcPGJyLz7quLDsmrjsnbTquLBcIlxuXHRcdGNvbG9yOiBcInJnYmEoMCwwLDAsLjMpXCJcblx0XHRzdHlsZTogeyBmb250OiBcIjMwMCAxMDBweC8xICN7VXRpbHMuZGV2aWNlRm9udCgpfVwiLCB0ZXh0QWxpZ246IFwicmlnaHRcIiwgXCItd2Via2l0LWZvbnQtc21vb3RoaW5nXCI6IFwiYW50aWFsaWFzZWRcIiB9XG5cdFx0c2NhbGU6IEZyYW1lci5EZXZpY2UuaGFuZHMuc2NhbGUsIG9yaWdpblg6IDFcblx0XHRiYWNrZ3JvdW5kQ29sb3I6IFwidHJhbnNwYXJlbnRcIlxuXHRcdHBhcmVudDogX2xlZnRcblx0X2xlZnQubGFiZWwuY3VzdG9tID0geyBvWDogX2xlZnQubGFiZWwueCB9XG5cdF9yaWdodC5sYWJlbCA9IG5ldyBMYXllclxuXHRcdG5hbWU6ICcucmlnaHQubGFiZWwnXG5cdFx0eDogQWxpZ24ubGVmdCg4MDAgKiBGcmFtZXIuRGV2aWNlLmhhbmRzLnNjYWxlKSwgeTogQWxpZ24uY2VudGVyXG5cdFx0d2lkdGg6IDUwMFxuXHRcdGh0bWw6IFwiPHN0cm9uZz7smKTrpbjsqr08L3N0cm9uZz7snLzroZw8YnIvPuq4sOyauOydtOq4sFwiXG5cdFx0Y29sb3I6IFwicmdiYSgwLDAsMCwuMylcIlxuXHRcdHN0eWxlOiB7IGZvbnQ6IFwiMzAwIDEwMHB4LzEgI3tVdGlscy5kZXZpY2VGb250KCl9XCIsIHRleHRBbGlnbjogXCJsZWZ0XCIsIFwiLXdlYmtpdC1mb250LXNtb290aGluZ1wiOiBcImFudGlhbGlhc2VkXCIgfVxuXHRcdHNjYWxlOiBGcmFtZXIuRGV2aWNlLmhhbmRzLnNjYWxlLCBvcmlnaW5YOiAwXG5cdFx0YmFja2dyb3VuZENvbG9yOiBcInRyYW5zcGFyZW50XCJcblx0XHRwYXJlbnQ6IF9yaWdodFxuXHRfcmlnaHQubGFiZWwuY3VzdG9tID0geyBvWDogX3JpZ2h0LmxhYmVsLnggfVxuXG5cdCMjI1xuXHQjIEV2ZW50IDo6IFRvdWNoIHN0YXJ0XG5cdEZyYW1lci5EZXZpY2UuYmFja2dyb3VuZC5vblRhcFN0YXJ0IC0+XG5cdFx0Y2VudGVyWCA9IEZyYW1lci5EZXZpY2UuYmFja2dyb3VuZC53aWR0aCAvIDJcblx0XHRpZiBldmVudC5wb2ludC54IDwgY2VudGVyWFxuXHRcdFx0RnJhbWVyLkRldmljZS5oYW5kc0ltYWdlTGF5ZXIuYW5pbWF0ZSBwcm9wZXJ0aWVzOiB7IHg6IEFsaWduLmNlbnRlcihkeCksIHJvdGF0aW9uWTogLXJ5LCB6OiBkeiwgc2NhbGVYOiBkU2NhbGVYIH1cblx0XHRcdEZyYW1lci5EZXZpY2UucGhvbmUuYW5pbWF0ZSBwcm9wZXJ0aWVzOiB7IHg6IEFsaWduLmNlbnRlcihkeCksIHJvdGF0aW9uWTogLXJ5LCB6OiBkeiwgc2NhbGVYOiBkU2NhbGVYIH1cblx0XHRlbHNlXG5cdFx0XHRGcmFtZXIuRGV2aWNlLmhhbmRzSW1hZ2VMYXllci5hbmltYXRlIHByb3BlcnRpZXM6IHsgeDogQWxpZ24uY2VudGVyKC1keCksIHJvdGF0aW9uWTogcnksIHo6IGR6LCBzY2FsZVg6IGRTY2FsZVggfVxuXHRcdFx0RnJhbWVyLkRldmljZS5waG9uZS5hbmltYXRlIHByb3BlcnRpZXM6IHsgeDogQWxpZ24uY2VudGVyKC1keCksIHJvdGF0aW9uWTogcnksIHo6IGR6LCBzY2FsZVg6IGRTY2FsZVggfVxuXG5cdCMgRXZlbnQgOjogVG91Y2ggZW5kXG5cdEZyYW1lci5EZXZpY2UuYmFja2dyb3VuZC5vblRhcEVuZCAtPlxuXHRcdEZyYW1lci5EZXZpY2UuaGFuZHNJbWFnZUxheWVyLmFuaW1hdGUgcHJvcGVydGllczogeyB4OiBBbGlnbi5jZW50ZXIsIHJvdGF0aW9uWDogMCwgcm90YXRpb25ZOiAwLCB6OiAwLCBzY2FsZVg6IDEgfVxuXHRcdEZyYW1lci5EZXZpY2UucGhvbmUuYW5pbWF0ZSBwcm9wZXJ0aWVzOiB7IHg6IEFsaWduLmNlbnRlciwgcm90YXRpb25YOiAwLCByb3RhdGlvblk6IDAsIHo6IDAsIHNjYWxlWDogMSB9XG5cdCMjI1xuXG5cdCMgRXZlbnQgOjogQ2hhbmdlXG5cdEZyYW1lci5EZXZpY2UucGhvbmUub24gXCJjaGFuZ2U6cm90YXRpb25ZXCIsIC0+XG5cdFx0IyBDYWxsYmFja1xuXHRcdGNiKFV0aWxzLm1vZHVsYXRlKEZyYW1lci5EZXZpY2UucGhvbmUucm90YXRpb25ZLCBbLXJ5LCByeV0sIFstMSwgMV0sIHRydWUpLCBAKSA/IGNiXG5cblx0RnJhbWVyLkRldmljZS5iYWNrZ3JvdW5kLm9uIFwiY2hhbmdlOnNpemVcIiwgLT5cblx0XHRfbGVmdC5wcm9wcyA9IFxuXHRcdFx0d2lkdGg6IEZyYW1lci5EZXZpY2UuYmFja2dyb3VuZC53aWR0aCAvIDIsIGhlaWdodDogRnJhbWVyLkRldmljZS5iYWNrZ3JvdW5kLmhlaWdodFxuXHRcdF9yaWdodC5wcm9wcyA9IFxuXHRcdFx0eDogRnJhbWVyLkRldmljZS5iYWNrZ3JvdW5kLndpZHRoIC8gMlxuXHRcdFx0d2lkdGg6IEZyYW1lci5EZXZpY2UuYmFja2dyb3VuZC53aWR0aCAvIDIsIGhlaWdodDogRnJhbWVyLkRldmljZS5iYWNrZ3JvdW5kLmhlaWdodFxuXG5cdFx0X2xlZnQubGFiZWwucHJvcHMgPVxuXHRcdFx0eDogQWxpZ24ucmlnaHQoLTgwMCAqIEZyYW1lci5EZXZpY2UuaGFuZHMuc2NhbGUpLCB5OiBBbGlnbi5jZW50ZXJcblx0XHRcdHNjYWxlOiBGcmFtZXIuRGV2aWNlLmhhbmRzLnNjYWxlXG5cdFx0X2xlZnQubGFiZWwuY3VzdG9tID0geyBvWDogX2xlZnQubGFiZWwueCB9XG5cdFx0X3JpZ2h0LmxhYmVsLnByb3BzID1cblx0XHRcdHg6IEFsaWduLmxlZnQoODAwICogRnJhbWVyLkRldmljZS5oYW5kcy5zY2FsZSksIHk6IEFsaWduLmNlbnRlclxuXHRcdFx0c2NhbGU6IEZyYW1lci5EZXZpY2UuaGFuZHMuc2NhbGVcblx0XHRfcmlnaHQubGFiZWwuY3VzdG9tID0geyBvWDogX3JpZ2h0LmxhYmVsLnggfVxuXG5cdGlzTGVmdEFuaSA9IGlzQmFja0FuaSA9IGlzUmlnaHRBbmkgPSBmYWxzZVxuXHRcblx0b25Nb3VzZU92ZXIgPSAtPiBcblx0XHRpZiBAbmFtZSBpcyBcIi5sZWZ0XCIgdGhlbiB4ID0gQGNoaWxkcmVuWzBdLmN1c3RvbS5vWCAtIGd1aWRlRHggZWxzZSB4ID0gQGNoaWxkcmVuWzBdLmN1c3RvbS5vWCArIGd1aWRlRHhcblx0XHRAY2hpbGRyZW5bMF0uYW5pbWF0ZSBwcm9wZXJ0aWVzOiB7IHg6IHggfVxuXG5cdG9uTW91c2VPdXQgPSAtPlxuXHRcdEBjaGlsZHJlblswXS5hbmltYXRlIHByb3BlcnRpZXM6IHsgeDogQGNoaWxkcmVuWzBdLmN1c3RvbS5vWCB9XG5cblx0XHRpZiBGcmFtZXIuRGV2aWNlLnBob25lLnJvdGF0aW9uWSBpc250IDAgYW5kICFpc0JhY2tBbmlcblx0XHRcdGlzTGVmdEFuaSA9IGZhbHNlXG5cdFx0XHRpc0JhY2tBbmkgPSB0cnVlXG5cdFx0XHRpc1JpZ2h0QW5pID0gZmFsc2Vcblx0XHRcdEZyYW1lci5EZXZpY2UuaGFuZHNJbWFnZUxheWVyLmFuaW1hdGUgcHJvcGVydGllczogeyB4OiBBbGlnbi5jZW50ZXIsIHJvdGF0aW9uWDogMCwgcm90YXRpb25ZOiAwLCB6OiAwLCBzY2FsZVg6IDEgfVxuXHRcdFx0RnJhbWVyLkRldmljZS5waG9uZS5hbmltYXRlIHByb3BlcnRpZXM6IHsgeDogQWxpZ24uY2VudGVyLCByb3RhdGlvblg6IDAsIHJvdGF0aW9uWTogMCwgejogMCwgc2NhbGVYOiAxIH1cblx0XHRcdEZyYW1lci5EZXZpY2UucGhvbmUub25BbmltYXRpb25FbmQgY2FsbGJhY2sgPSAtPlxuXHRcdFx0XHRpc0JhY2tBbmkgPSBmYWxzZVxuXHRcdFx0XHRGcmFtZXIuRGV2aWNlLnBob25lLm9mZiBFdmVudHMuQW5pbWF0aW9uRW5kLCBjYWxsYmFja1xuXG5cdF9sZWZ0Lm9uTW91c2VPdmVyIG9uTW91c2VPdmVyXG5cdF9sZWZ0Lm9uTW91c2VPdXQgb25Nb3VzZU91dFxuXHRfcmlnaHQub25Nb3VzZU92ZXIgb25Nb3VzZU92ZXJcblx0X3JpZ2h0Lm9uTW91c2VPdXQgb25Nb3VzZU91dFxuXG5cdG9uVG91Y2hNb3ZlID0gKF9keCwgX3J5KSAtPlxuXHRcdGlmIEZyYW1lci5EZXZpY2UucGhvbmUucm90YXRpb25ZIGlzbnQgX3J5IGFuZCAhKGlmIF9yeSBpcyAtcnkgdGhlbiBpc0xlZnRBbmkgZWxzZSBpc1JpZ2h0QW5pKVxuXHRcdFx0aXNMZWZ0QW5pID0gaXNCYWNrQW5pID0gaXNSaWdodEFuaSA9IGZhbHNlXG5cdFx0XHRpZiBfcnkgaXMgLXJ5IHRoZW4gaXNMZWZ0QW5pID0gdHJ1ZSBlbHNlIGlzUmlnaHRBbmkgPSB0cnVlXG5cblx0XHRcdEZyYW1lci5EZXZpY2UuaGFuZHNJbWFnZUxheWVyLmFuaW1hdGUgcHJvcGVydGllczogeyB4OiBBbGlnbi5jZW50ZXIoX2R4KSwgcm90YXRpb25ZOiBfcnksIHo6IGR6LCBzY2FsZVg6IGRTY2FsZVggfVxuXHRcdFx0RnJhbWVyLkRldmljZS5waG9uZS5hbmltYXRlIHByb3BlcnRpZXM6IHsgeDogQWxpZ24uY2VudGVyKF9keCksIHJvdGF0aW9uWTogX3J5LCB6OiBkeiwgc2NhbGVYOiBkU2NhbGVYIH1cblxuXHRfbGVmdC5vblRvdWNoTW92ZSAtPiBvblRvdWNoTW92ZShkeCwgLXJ5LCBpc0xlZnRBbmkpXG5cdF9yaWdodC5vblRvdWNoTW92ZSAtPiBvblRvdWNoTW92ZSgtZHgsIHJ5LCBpc1JpZ2h0QW5pKVxuXG5tb2R1bGUuZXhwb3J0cyA9IE9yaWVudGF0aW9uU2ltdWxhdG9yIGlmIG1vZHVsZT9cbkZyYW1lci5PcmllbnRhdGlvblNpbXVsYXRvciA9IE9yaWVudGF0aW9uU2ltdWxhdG9yIiwiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFHQUE7O0FEQUE7Ozs7OztBQUFBLElBQUE7O0FBTUEsb0JBQUEsR0FBdUI7O0FBQ3ZCLG9CQUFvQixDQUFDLE1BQXJCLEdBQThCLFNBQUMsRUFBRDtBQUM3QixNQUFBO0VBQUEsSUFBQSxDQUFjLEtBQUssQ0FBQyxTQUFOLENBQUEsQ0FBZDtBQUFBLFdBQUE7O0VBRUEsTUFBTSxDQUFDLEtBQVAsR0FBZTtFQUVmLEVBQUEsR0FBSyxDQUFBLEdBQUk7RUFDVCxFQUFBLEdBQUs7RUFDTCxFQUFBLEdBQUssQ0FBQztFQUNOLE9BQUEsR0FBVTtFQUNWLE9BQUEsR0FBVTtFQUdWLE1BQU0sQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLFdBQXBCLEdBQWtDLEdBQUEsR0FBTTtFQUN4QyxNQUFNLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFwQixHQUF3QjtFQUd4QixLQUFBLEdBQVksSUFBQSxLQUFBLENBQ1g7SUFBQSxJQUFBLEVBQU0sT0FBTjtJQUNBLEtBQUEsRUFBTyxNQUFNLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxLQUF6QixHQUFpQyxDQUR4QztJQUMyQyxNQUFBLEVBQVEsTUFB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
