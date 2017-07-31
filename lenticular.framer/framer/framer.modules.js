require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"Lenticular":[function(require,module,exports){
var OrientationSimulator,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

require('System');

OrientationSimulator = require('OrientationSimulator');

'Lenticular\n\n@auther ho.s\n@date 2016.10.04';

exports.Lenticular = (function(superClass) {
  extend(Lenticular, superClass);

  Lenticular.Orientation = {};

  Lenticular.Orientation.Both = "orientation.both";

  Lenticular.Orientation.Left = "orientation.left";

  Lenticular.Orientation.Right = "orientation.right";

  function Lenticular(options) {
    var sensor, sensorManager;
    if (options == null) {
      options = {};
    }
    Lenticular.__super__.constructor.call(this, options);
    this.contents = new Layer({
      name: "contents",
      width: this.width,
      height: this.height,
      backgroundColor: "",
      parent: this
    });
    this.material = new Layer({
      name: ".lens",
      width: 750,
      height: 160,
      image: "images/lenticular_material.png",
      style: {
        mixBlendMode: "darken"
      },
      scaleY: this.height / 160,
      originY: 0,
      backgroundColor: "",
      parent: this
    });
    if (Utils.isMobile()) {
      sensorManager = getSystemService(Context.SENSOR_SERVICE);
      sensor = sensorManager.getDefaultSensor(Sensor.TYPE_ORIENTATION);
      if (sensor) {
        sensor.smooth = .1;
        sensor.onChange((function(_this) {
          return function(event) {
            var gamma;
            gamma = event.gamma < 0 ? Utils.modulate(event.gamma, [-30, -10], [-1, 0], true) : Utils.modulate(event.gamma, [10, 30], [0, 1], true);
            return _this.toGamma(gamma);
          };
        })(this));
      }
    } else if (Utils.isDesktop()) {
      OrientationSimulator.onTilt((function(_this) {
        return function(gamma) {
          return _this.toGamma(gamma);
        };
      })(this));
    }
  }

  Lenticular.prototype.setDefault = function(layer) {
    this.addChild(layer);
    return layer.placeBehind(this.contents);
  };

  Lenticular.prototype.addScene = function(layer, orientation) {
    if (orientation == null) {
      orientation = Lenticular.Orientation.Both;
    }
    layer.opacity = 0;
    layer.orientation = orientation;
    return this.contents.addChild(layer);
  };

  Lenticular.prototype.toGamma = function(gamma) {
    var child, i, len, ref, results;
    ref = this.contents.children;
    results = [];
    for (i = 0, len = ref.length; i < len; i++) {
      child = ref[i];
      if (child.orientation === Lenticular.Orientation.Left) {
        if (gamma <= 0) {
          results.push(child.opacity = Math.abs(gamma));
        } else {
          results.push(void 0);
        }
      } else if (child.orientation === Lenticular.Orientation.Right) {
        if (gamma >= 0) {
          results.push(child.opacity = gamma);
        } else {
          results.push(void 0);
        }
      } else {
        results.push(child.opacity = Math.abs(gamma));
      }
    }
    return results;
  };

  return Lenticular;

})(Layer);


},{"OrientationSimulator":"OrientationSimulator","System":"System"}],"OrientationSimulator":[function(require,module,exports){

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZnJhbWVyLm1vZHVsZXMuanMiLCJzb3VyY2VzIjpbIi4uL21vZHVsZXMvU3lzdGVtLmNvZmZlZSIsIi4uL21vZHVsZXMvU3lzdGVtLVNlbnNvci5jb2ZmZWUiLCIuLi9tb2R1bGVzL09yaWVudGF0aW9uU2ltdWxhdG9yLmNvZmZlZSIsIi4uL21vZHVsZXMvTGVudGljdWxhci5jb2ZmZWUiLCJub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIl0sInNvdXJjZXNDb250ZW50IjpbInJlcXVpcmUgJ1N5c3RlbS1TZW5zb3InXG5cbicnJ1xuU3lzdGVtXG5cbkBhdXRoZXIgaG8uc1xuQGRhdGUgMjAxNi4xMC4wNFxuJycnXG5cbiMgQ29udGV4dFxuQ29udGV4dCA9IHt9XG4jIENvbnRleHQgOiBTZW5zb3JcbkNvbnRleHQuU0VOU09SX1NFUlZJQ0UgPSBcImNvbnRleHQuU0VOU09SX1NFUlZJQ0VcIlxuXG4jIEdldCBzeXN0ZW0gc2VydmljZVxuZ2V0U3lzdGVtU2VydmljZSA9IChzZXJ2aWNlKS0+XG5cdHN3aXRjaCBzZXJ2aWNlXG5cdFx0IyBTZW5zb3Jcblx0XHR3aGVuIENvbnRleHQuU0VOU09SX1NFUlZJQ0UgdGhlbiByZXR1cm4gU2Vuc29yTWFuYWdlclxuXHRcblxuI1xuaWYgd2luZG93XG5cdHdpbmRvdy5Db250ZXh0ID0gQ29udGV4dCBcblx0d2luZG93LmdldFN5c3RlbVNlcnZpY2UgPSBnZXRTeXN0ZW1TZXJ2aWNlXG5cdCIsIicnJ1xuU2Vuc29yXG5cbkBhdXRoZXIgaG8uc1xuQGRhdGUgMjAxNi4xMC4wNFxuJycnXG5cbiMgU2Vuc29yIG1hbmFnZXJcblNlbnNvck1hbmFnZXIgPSB7fVxuIyBTZW5zb3IgbWFuYWdlciA6IEdldCBkZWZhdWx0IHNlbnNvclxuU2Vuc29yTWFuYWdlci5nZXREZWZhdWx0U2Vuc29yID0gKHR5cGUpIC0+XG5cdHN3aXRjaCB0eXBlXG5cdFx0IyBPcmllbnRhdGlvblxuXHRcdHdoZW4gU2Vuc29yLlRZUEVfT1JJRU5UQVRJT04gdGhlbiByZXR1cm4gT3JpZW50YXRpb24uZ2V0KClcblx0XHQjIE1vdGlvblxuXHRcdHdoZW4gU2Vuc29yLlRZUEVfTU9USU9OIHRoZW4gcmV0dXJuIE1vdGlvbi5nZXQoKVxuXG4jIFNlbnNvclxuY2xhc3MgU2Vuc29yIGV4dGVuZHMgRnJhbWVyLkJhc2VDbGFzc1xuXHQjIFNlbnNvciB0eXBlXG5cdEBUWVBFX09SSUVOVEFUSU9OOiBcInNlbnNvci5vcmllbnRhdGlvblwiXG5cdEBUWVBFX01PVElPTjogXCJzZW5zb3IubW90aW9uXCJcblxuXHQjIEV2ZW50cyA6IENoYW5nZVxuXHRFdmVudHMuQ2hhbmdlID0gXCJzZW5zb3IuY2hhbmdlXCJcblxuXHQjIFNtb290aFxuXHRAZGVmaW5lICdzbW9vdGgnLCBAc2ltcGxlUHJvcGVydHkoJ3Ntb290aCcsIDEpXG5cblx0IyBDb25zdHJ1Y3RvclxuXHRjb25zdHJ1Y3RvcjogKCkgLT5cblx0XHRzdXBlclxuXG5cdCMgRXZlbnQgbGlzbnRlbmVyIDogY2hhbmdlXG5cdG9uQ2hhbmdlOiAoY2IpIC0+IEBvbiBFdmVudHMuQ2hhbmdlLCBjYlxuXG4jIFNlbnNvciA6IE9yaWVudGF0aW9uXG5jbGFzcyBPcmllbnRhdGlvbiBleHRlbmRzIFNlbnNvclxuXG5cdCMgU2luZ2xldG9uXG5cdGluc3RhbmNlID0gbnVsbFxuXHRAZ2V0OiAtPiBcblx0XHQjIE9yaWVudGF0aW9uIGV2ZW50IHN1cHBvcnRlZFxuXHRcdGlmIHdpbmRvdy5EZXZpY2VPcmllbnRhdGlvbkV2ZW50IHRoZW4gaW5zdGFuY2UgPz0gbmV3IE9yaWVudGF0aW9uKClcblx0XHQjIE5vdCBzdXBwb3J0ZWRcblx0XHRlbHNlIGNvbnNvbGUuZXJyb3IgXCJOb3Qgc3VwcG9ydGVkXCIsIFwiRGV2aWNlIG9yaWVudGF0aW9uIGV2ZW50cyBhcmUgbm90IHN1cG9ydGVkIG9uIHRoaXMgZGV2aWNlXCJcblxuXHRcdGluc3RhbmNlXG5cblx0IyBWYWx1ZVxuXHRAZGVmaW5lICdhbHBoYScsIEBzaW1wbGVQcm9wZXJ0eSgnYWxwaGEnLCAwKVxuXHRAZGVmaW5lICdiZXRhJywgQHNpbXBsZVByb3BlcnR5KCdiZXRhJywgMClcblx0QGRlZmluZSAnZ2FtbWEnLCBAc2ltcGxlUHJvcGVydHkoJ2dhbW1hJywgMClcblxuXHQjIENvbnN0cnVjdG9yXG5cdGNvbnN0cnVjdG9yOiAoKSAtPlxuXHRcdHN1cGVyXG5cblx0XHQjIEV2ZW50XG5cdFx0RXZlbnRzLndyYXAod2luZG93KS5hZGRFdmVudExpc3RlbmVyIFwiZGV2aWNlb3JpZW50YXRpb25cIiwgKGV2ZW50KSA9PlxuXHRcdFx0QGFscGhhID0gKGV2ZW50LmFscGhhICogQHNtb290aCkgKyAoQGFscGhhICogKDEtIEBzbW9vdGgpKVxuXHRcdFx0QGJldGEgPSAoZXZlbnQuYmV0YSAqIEBzbW9vdGgpICsgKEBiZXRhICogKDEtIEBzbW9vdGgpKVxuXHRcdFx0QGdhbW1hID0gKGV2ZW50LmdhbW1hICogQHNtb290aCkgKyAoQGdhbW1hICogKDEtIEBzbW9vdGgpKVxuXG5cdFx0XHRvcmllbnRhdGlvbiA9IFxuXHRcdFx0XHRhbHBoYTogQGFscGhhXG5cdFx0XHRcdGJldGE6IEBiZXRhXG5cdFx0XHRcdGdhbW1hOiBAZ2FtbWFcblx0XHRcdFx0YWJzb2x1dGU6IGV2ZW50LmFic29sdXRlXG5cblx0XHRcdEBlbWl0IEV2ZW50cy5DaGFuZ2UsIG9yaWVudGF0aW9uXG5cbiMgU2Vuc29yIDogTW90aW9uXG5jbGFzcyBNb3Rpb24gZXh0ZW5kcyBTZW5zb3JcblxuXHQjIFNpbmdsZXRvblxuXHRpbnN0YW5jZSA9IG51bGxcblx0QGdldDogLT4gXG5cdFx0IyBPcmllbnRhdGlvbiBldmVudCBzdXBwb3J0ZWRcblx0XHRpZiB3aW5kb3cuRGV2aWNlTW90aW9uRXZlbnQgdGhlbiBpbnN0YW5jZSA/PSBuZXcgTW90aW9uKClcblx0XHQjIE5vdCBzdXBwb3J0ZWRcblx0XHRlbHNlIGNvbnNvbGUuZXJyb3IgXCJOb3Qgc3VwcG9ydGVkXCIsIFwiRGV2aWNlIG1vdGlvbiBldmVudHMgYXJlIG5vdCBzdXBvcnRlZCBvbiB0aGlzIGRldmljZVwiXG5cblx0XHRpbnN0YW5jZVxuXG5cdCMgVmFsdWVcblx0QGRlZmluZSAneCcsIEBzaW1wbGVQcm9wZXJ0eSgneCcsIDApXG5cdEBkZWZpbmUgJ3knLCBAc2ltcGxlUHJvcGVydHkoJ3knLCAwKVxuXHRAZGVmaW5lICd6JywgQHNpbXBsZVByb3BlcnR5KCd6JywgMClcblx0QGRlZmluZSAnZ3gnLCBAc2ltcGxlUHJvcGVydHkoJ2d4JywgMClcblx0QGRlZmluZSAnZ3knLCBAc2ltcGxlUHJvcGVydHkoJ2d5JywgMClcblx0QGRlZmluZSAnZ3onLCBAc2ltcGxlUHJvcGVydHkoJ2d6JywgMClcblx0QGRlZmluZSAnYWxwaGEnLCBAc2ltcGxlUHJvcGVydHkoJ2FscGhhJywgMClcblx0QGRlZmluZSAnYmV0YScsIEBzaW1wbGVQcm9wZXJ0eSgnYmV0YScsIDApXG5cdEBkZWZpbmUgJ2dhbW1hJywgQHNpbXBsZVByb3BlcnR5KCdnYW1tYScsIDApXG5cdEBkZWZpbmUgJ2ludGVydmFsJywgQHNpbXBsZVByb3BlcnR5KCdpbnRlcnZhbCcsIDApXG5cblxuXHQjIENvbnN0cnVjdG9yXG5cdGNvbnN0cnVjdG9yOiAoKSAtPlxuXHRcdHN1cGVyXG5cblx0XHQjIEV2ZW50XG5cdFx0RXZlbnRzLndyYXAod2luZG93KS5hZGRFdmVudExpc3RlbmVyIFwiZGV2aWNlbW90aW9uXCIsIChldmVudCkgPT5cblx0XHRcdEB4ID0gKGV2ZW50LmFjY2VsZXJhdGlvbi54ICogQHNtb290aCkgKyAoQHggKiAoMS0gQHNtb290aCkpXG5cdFx0XHRAeSA9IChldmVudC5hY2NlbGVyYXRpb24ueSAqIEBzbW9vdGgpICsgKEB5ICogKDEtIEBzbW9vdGgpKVxuXHRcdFx0QHogPSAoZXZlbnQuYWNjZWxlcmF0aW9uLnogKiBAc21vb3RoKSArIChAeiAqICgxLSBAc21vb3RoKSlcblxuXHRcdFx0QGd4ID0gKGV2ZW50LmFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHkueCAqIEBzbW9vdGgpICsgKEBneCAqICgxLSBAc21vb3RoKSlcblx0XHRcdEBneSA9IChldmVudC5hY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5LnkgKiBAc21vb3RoKSArIChAZ3kgKiAoMS0gQHNtb290aCkpXG5cdFx0XHRAZ3ogPSAoZXZlbnQuYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eS56ICogQHNtb290aCkgKyAoQGd6ICogKDEtIEBzbW9vdGgpKVxuXG5cdFx0XHRAYWxwaGEgPSAoZXZlbnQucm90YXRpb25SYXRlLmFscGhhICogQHNtb290aCkgKyAoQGFscGhhICogKDEtIEBzbW9vdGgpKVxuXHRcdFx0QGJldGEgPSAoZXZlbnQucm90YXRpb25SYXRlLmJldGEgKiBAc21vb3RoKSArIChAYmV0YSAqICgxLSBAc21vb3RoKSlcblx0XHRcdEBnYW1tYSA9IChldmVudC5yb3RhdGlvblJhdGUuZ2FtbWEgKiBAc21vb3RoKSArIChAZ2FtbWEgKiAoMS0gQHNtb290aCkpXG5cblx0XHRcdEBpbnRlcnZhbCA9IGV2ZW50LmludGVydmFsXG5cblx0XHRcdG1vdGlvbiA9IFxuXHRcdFx0XHRhY2NlbGVyYXRpb246IHg6IEB4LCB5OiBAeSwgejogQHpcblx0XHRcdFx0YWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eTogeDogQGd4LCB5OiBAZ3ksIHo6IEBnelxuXHRcdFx0XHRyb3RhdGlvblJhdGU6IGFscGhhOiBAYWxwaGEsIGJldGE6IEBiZXRhLCBnYW1tYTogQGdhbW1hXG5cdFx0XHRcdGludGVydmFsOiBAaW50ZXJ2YWxcblxuXHRcdFx0QGVtaXQgRXZlbnRzLkNoYW5nZSwgbW90aW9uXG5cbiNcbmlmIHdpbmRvd1xuXHR3aW5kb3cuU2Vuc29yTWFuYWdlciA9IFNlbnNvck1hbmFnZXJcblx0d2luZG93LlNlbnNvciA9IFNlbnNvclxuXHR3aW5kb3cuT3JpZW50YXRpb24gPSBPcmllbnRhdGlvblxuXHR3aW5kb3cuTW90aW9uID0gTW90aW9uIiwiIyMjXG5UaWx0IHRoZSBzaW11bGF0b3JcblxuQGF1dGhlciBoby5zXG5AZGF0ZSAyMDE2LjEwLjA0XG4jIyNcbk9yaWVudGF0aW9uU2ltdWxhdG9yID0ge31cbk9yaWVudGF0aW9uU2ltdWxhdG9yLm9uVGlsdCA9IChjYikgLT5cblx0cmV0dXJuIHVubGVzcyBVdGlscy5pc0Rlc2t0b3AoKVxuXG5cdEV2ZW50cy5HYW1tYSA9IFwiT3JpZW50YXRpb25TaW11bGF0b3IuZ2FtbWFcIlxuXG5cdHJ5ID0gMSAqIDEuMlxuXHRkeCA9IDUwXG5cdGR6ID0gLTVcblx0ZFNjYWxlWCA9IC45NlxuXHRndWlkZUR4ID0gMzBcblxuXHQjIFNldCBwZXJzcGVjdGl2ZVxuXHRGcmFtZXIuRGV2aWNlLmhhbmRzLnBlcnNwZWN0aXZlID0gMTAwICogMlxuXHRGcmFtZXIuRGV2aWNlLmhhbmRzLnogPSAxMDBcblxuXHQjIFZpZXdcblx0X2xlZnQgPSBuZXcgTGF5ZXJcblx0XHRuYW1lOiAnLmxlZnQnXG5cdFx0d2lkdGg6IEZyYW1lci5EZXZpY2UuYmFja2dyb3VuZC53aWR0aCAvIDIsIGhlaWdodDogRnJhbWVyLkRldmljZS5iYWNrZ3JvdW5kLmhlaWdodFxuXHRcdGJhY2tncm91bmRDb2xvcjogJ3JnYmEoMCwwLDAsMCknXG5cdFx0cGFyZW50OiBGcmFtZXIuRGV2aWNlLmJhY2tncm91bmRcblx0X3JpZ2h0ID0gbmV3IExheWVyXG5cdFx0bmFtZTogJy5yaWdodCdcblx0XHR4OiBGcmFtZXIuRGV2aWNlLmJhY2tncm91bmQud2lkdGggLyAyXG5cdFx0d2lkdGg6IEZyYW1lci5EZXZpY2UuYmFja2dyb3VuZC53aWR0aCAvIDIsIGhlaWdodDogRnJhbWVyLkRldmljZS5iYWNrZ3JvdW5kLmhlaWdodFxuXHRcdGJhY2tncm91bmRDb2xvcjogJ3JnYmEoMCwwLDAsMCknXG5cdFx0cGFyZW50OiBGcmFtZXIuRGV2aWNlLmJhY2tncm91bmRcblx0X2xlZnQubGFiZWwgPSBuZXcgTGF5ZXJcblx0XHRuYW1lOiAnLmxlZnQubGFiZWwnXG5cdFx0eDogQWxpZ24ucmlnaHQoLTgwMCAqIEZyYW1lci5EZXZpY2UuaGFuZHMuc2NhbGUpLCB5OiBBbGlnbi5jZW50ZXJcblx0XHR3aWR0aDogNTAwXG5cdFx0aHRtbDogXCI8c3Ryb25nPuyZvOyqvTwvc3Ryb25nPuycvOuhnDxici8+6riw7Jq47J206riwXCJcblx0XHRjb2xvcjogXCJyZ2JhKDAsMCwwLC4zKVwiXG5cdFx0c3R5bGU6IHsgZm9udDogXCIzMDAgMTAwcHgvMSAje1V0aWxzLmRldmljZUZvbnQoKX1cIiwgdGV4dEFsaWduOiBcInJpZ2h0XCIsIFwiLXdlYmtpdC1mb250LXNtb290aGluZ1wiOiBcImFudGlhbGlhc2VkXCIgfVxuXHRcdHNjYWxlOiBGcmFtZXIuRGV2aWNlLmhhbmRzLnNjYWxlLCBvcmlnaW5YOiAxXG5cdFx0YmFja2dyb3VuZENvbG9yOiBcInRyYW5zcGFyZW50XCJcblx0XHRwYXJlbnQ6IF9sZWZ0XG5cdF9sZWZ0LmxhYmVsLmN1c3RvbSA9IHsgb1g6IF9sZWZ0LmxhYmVsLnggfVxuXHRfcmlnaHQubGFiZWwgPSBuZXcgTGF5ZXJcblx0XHRuYW1lOiAnLnJpZ2h0LmxhYmVsJ1xuXHRcdHg6IEFsaWduLmxlZnQoODAwICogRnJhbWVyLkRldmljZS5oYW5kcy5zY2FsZSksIHk6IEFsaWduLmNlbnRlclxuXHRcdHdpZHRoOiA1MDBcblx0XHRodG1sOiBcIjxzdHJvbmc+7Jik66W47Kq9PC9zdHJvbmc+7Jy866GcPGJyLz7quLDsmrjsnbTquLBcIlxuXHRcdGNvbG9yOiBcInJnYmEoMCwwLDAsLjMpXCJcblx0XHRzdHlsZTogeyBmb250OiBcIjMwMCAxMDBweC8xICN7VXRpbHMuZGV2aWNlRm9udCgpfVwiLCB0ZXh0QWxpZ246IFwibGVmdFwiLCBcIi13ZWJraXQtZm9udC1zbW9vdGhpbmdcIjogXCJhbnRpYWxpYXNlZFwiIH1cblx0XHRzY2FsZTogRnJhbWVyLkRldmljZS5oYW5kcy5zY2FsZSwgb3JpZ2luWDogMFxuXHRcdGJhY2tncm91bmRDb2xvcjogXCJ0cmFuc3BhcmVudFwiXG5cdFx0cGFyZW50OiBfcmlnaHRcblx0X3JpZ2h0LmxhYmVsLmN1c3RvbSA9IHsgb1g6IF9yaWdodC5sYWJlbC54IH1cblxuXHQjIyNcblx0IyBFdmVudCA6OiBUb3VjaCBzdGFydFxuXHRGcmFtZXIuRGV2aWNlLmJhY2tncm91bmQub25UYXBTdGFydCAtPlxuXHRcdGNlbnRlclggPSBGcmFtZXIuRGV2aWNlLmJhY2tncm91bmQud2lkdGggLyAyXG5cdFx0aWYgZXZlbnQucG9pbnQueCA8IGNlbnRlclhcblx0XHRcdEZyYW1lci5EZXZpY2UuaGFuZHNJbWFnZUxheWVyLmFuaW1hdGUgcHJvcGVydGllczogeyB4OiBBbGlnbi5jZW50ZXIoZHgpLCByb3RhdGlvblk6IC1yeSwgejogZHosIHNjYWxlWDogZFNjYWxlWCB9XG5cdFx0XHRGcmFtZXIuRGV2aWNlLnBob25lLmFuaW1hdGUgcHJvcGVydGllczogeyB4OiBBbGlnbi5jZW50ZXIoZHgpLCByb3RhdGlvblk6IC1yeSwgejogZHosIHNjYWxlWDogZFNjYWxlWCB9XG5cdFx0ZWxzZVxuXHRcdFx0RnJhbWVyLkRldmljZS5oYW5kc0ltYWdlTGF5ZXIuYW5pbWF0ZSBwcm9wZXJ0aWVzOiB7IHg6IEFsaWduLmNlbnRlcigtZHgpLCByb3RhdGlvblk6IHJ5LCB6OiBkeiwgc2NhbGVYOiBkU2NhbGVYIH1cblx0XHRcdEZyYW1lci5EZXZpY2UucGhvbmUuYW5pbWF0ZSBwcm9wZXJ0aWVzOiB7IHg6IEFsaWduLmNlbnRlcigtZHgpLCByb3RhdGlvblk6IHJ5LCB6OiBkeiwgc2NhbGVYOiBkU2NhbGVYIH1cblxuXHQjIEV2ZW50IDo6IFRvdWNoIGVuZFxuXHRGcmFtZXIuRGV2aWNlLmJhY2tncm91bmQub25UYXBFbmQgLT5cblx0XHRGcmFtZXIuRGV2aWNlLmhhbmRzSW1hZ2VMYXllci5hbmltYXRlIHByb3BlcnRpZXM6IHsgeDogQWxpZ24uY2VudGVyLCByb3RhdGlvblg6IDAsIHJvdGF0aW9uWTogMCwgejogMCwgc2NhbGVYOiAxIH1cblx0XHRGcmFtZXIuRGV2aWNlLnBob25lLmFuaW1hdGUgcHJvcGVydGllczogeyB4OiBBbGlnbi5jZW50ZXIsIHJvdGF0aW9uWDogMCwgcm90YXRpb25ZOiAwLCB6OiAwLCBzY2FsZVg6IDEgfVxuXHQjIyNcblxuXHQjIEV2ZW50IDo6IENoYW5nZVxuXHRGcmFtZXIuRGV2aWNlLnBob25lLm9uIFwiY2hhbmdlOnJvdGF0aW9uWVwiLCAtPlxuXHRcdCMgQ2FsbGJhY2tcblx0XHRjYihVdGlscy5tb2R1bGF0ZShGcmFtZXIuRGV2aWNlLnBob25lLnJvdGF0aW9uWSwgWy1yeSwgcnldLCBbLTEsIDFdLCB0cnVlKSwgQCkgPyBjYlxuXG5cdEZyYW1lci5EZXZpY2UuYmFja2dyb3VuZC5vbiBcImNoYW5nZTpzaXplXCIsIC0+XG5cdFx0X2xlZnQucHJvcHMgPSBcblx0XHRcdHdpZHRoOiBGcmFtZXIuRGV2aWNlLmJhY2tncm91bmQud2lkdGggLyAyLCBoZWlnaHQ6IEZyYW1lci5EZXZpY2UuYmFja2dyb3VuZC5oZWlnaHRcblx0XHRfcmlnaHQucHJvcHMgPSBcblx0XHRcdHg6IEZyYW1lci5EZXZpY2UuYmFja2dyb3VuZC53aWR0aCAvIDJcblx0XHRcdHdpZHRoOiBGcmFtZXIuRGV2aWNlLmJhY2tncm91bmQud2lkdGggLyAyLCBoZWlnaHQ6IEZyYW1lci5EZXZpY2UuYmFja2dyb3VuZC5oZWlnaHRcblxuXHRcdF9sZWZ0LmxhYmVsLnByb3BzID1cblx0XHRcdHg6IEFsaWduLnJpZ2h0KC04MDAgKiBGcmFtZXIuRGV2aWNlLmhhbmRzLnNjYWxlKSwgeTogQWxpZ24uY2VudGVyXG5cdFx0XHRzY2FsZTogRnJhbWVyLkRldmljZS5oYW5kcy5zY2FsZVxuXHRcdF9sZWZ0LmxhYmVsLmN1c3RvbSA9IHsgb1g6IF9sZWZ0LmxhYmVsLnggfVxuXHRcdF9yaWdodC5sYWJlbC5wcm9wcyA9XG5cdFx0XHR4OiBBbGlnbi5sZWZ0KDgwMCAqIEZyYW1lci5EZXZpY2UuaGFuZHMuc2NhbGUpLCB5OiBBbGlnbi5jZW50ZXJcblx0XHRcdHNjYWxlOiBGcmFtZXIuRGV2aWNlLmhhbmRzLnNjYWxlXG5cdFx0X3JpZ2h0LmxhYmVsLmN1c3RvbSA9IHsgb1g6IF9yaWdodC5sYWJlbC54IH1cblxuXHRpc0xlZnRBbmkgPSBpc0JhY2tBbmkgPSBpc1JpZ2h0QW5pID0gZmFsc2Vcblx0XG5cdCMgRXZlbnQgOiBNb3VzZSBvdmVyXG5cdG9uTW91c2VPdmVyID0gLT4gXG5cdFx0aWYgQG5hbWUgaXMgXCIubGVmdFwiIHRoZW4geCA9IEBjaGlsZHJlblswXS5jdXN0b20ub1ggLSBndWlkZUR4IGVsc2UgeCA9IEBjaGlsZHJlblswXS5jdXN0b20ub1ggKyBndWlkZUR4XG5cdFx0QGNoaWxkcmVuWzBdLmFuaW1hdGUgcHJvcGVydGllczogeyB4OiB4IH1cblxuXHQjIEV2ZW50IDogTW91c2Ugb3V0XG5cdG9uTW91c2VPdXQgPSAtPlxuXHRcdEBjaGlsZHJlblswXS5hbmltYXRlIHByb3BlcnRpZXM6IHsgeDogQGNoaWxkcmVuWzBdLmN1c3RvbS5vWCB9XG5cblx0XHRpZiBGcmFtZXIuRGV2aWNlLnBob25lLnJvdGF0aW9uWSBpc250IDAgYW5kICFpc0JhY2tBbmlcblx0XHRcdGlzTGVmdEFuaSA9IGZhbHNlXG5cdFx0XHRpc0JhY2tBbmkgPSB0cnVlXG5cdFx0XHRpc1JpZ2h0QW5pID0gZmFsc2Vcblx0XHRcdEZyYW1lci5EZXZpY2UuaGFuZHNJbWFnZUxheWVyLmFuaW1hdGUgcHJvcGVydGllczogeyB4OiBBbGlnbi5jZW50ZXIsIHJvdGF0aW9uWDogMCwgcm90YXRpb25ZOiAwLCB6OiAwLCBzY2FsZVg6IDEgfVxuXHRcdFx0RnJhbWVyLkRldmljZS5waG9uZS5hbmltYXRlIHByb3BlcnRpZXM6IHsgeDogQWxpZ24uY2VudGVyLCByb3RhdGlvblg6IDAsIHJvdGF0aW9uWTogMCwgejogMCwgc2NhbGVYOiAxIH1cblx0XHRcdEZyYW1lci5EZXZpY2UucGhvbmUub25BbmltYXRpb25FbmQgY2FsbGJhY2sgPSAtPlxuXHRcdFx0XHRpc0JhY2tBbmkgPSBmYWxzZVxuXHRcdFx0XHRGcmFtZXIuRGV2aWNlLnBob25lLm9mZiBFdmVudHMuQW5pbWF0aW9uRW5kLCBjYWxsYmFja1xuXG5cdF9sZWZ0Lm9uTW91c2VPdmVyIG9uTW91c2VPdmVyXG5cdF9sZWZ0Lm9uTW91c2VPdXQgb25Nb3VzZU91dFxuXHRfcmlnaHQub25Nb3VzZU92ZXIgb25Nb3VzZU92ZXJcblx0X3JpZ2h0Lm9uTW91c2VPdXQgb25Nb3VzZU91dFxuXG5cdCMgRXZlbnQgOiBUb3VjaCBtb3ZlXG5cdG9uVG91Y2hNb3ZlID0gKF9keCwgX3J5KSAtPlxuXHRcdGlmIEZyYW1lci5EZXZpY2UucGhvbmUucm90YXRpb25ZIGlzbnQgX3J5IGFuZCAhKGlmIF9yeSBpcyAtcnkgdGhlbiBpc0xlZnRBbmkgZWxzZSBpc1JpZ2h0QW5pKVxuXHRcdFx0aXNMZWZ0QW5pID0gaXNCYWNrQW5pID0gaXNSaWdodEFuaSA9IGZhbHNlXG5cdFx0XHRpZiBfcnkgaXMgLXJ5IHRoZW4gaXNMZWZ0QW5pID0gdHJ1ZSBlbHNlIGlzUmlnaHRBbmkgPSB0cnVlXG5cblx0XHRcdEZyYW1lci5EZXZpY2UuaGFuZHNJbWFnZUxheWVyLmFuaW1hdGUgcHJvcGVydGllczogeyB4OiBBbGlnbi5jZW50ZXIoX2R4KSwgcm90YXRpb25ZOiBfcnksIHo6IGR6LCBzY2FsZVg6IGRTY2FsZVggfVxuXHRcdFx0RnJhbWVyLkRldmljZS5waG9uZS5hbmltYXRlIHByb3BlcnRpZXM6IHsgeDogQWxpZ24uY2VudGVyKF9keCksIHJvdGF0aW9uWTogX3J5LCB6OiBkeiwgc2NhbGVYOiBkU2NhbGVYIH1cblxuXHRfbGVmdC5vblRvdWNoTW92ZSAtPiBvblRvdWNoTW92ZShkeCwgLXJ5LCBpc0xlZnRBbmkpXG5cdF9yaWdodC5vblRvdWNoTW92ZSAtPiBvblRvdWNoTW92ZSgtZHgsIHJ5LCBpc1JpZ2h0QW5pKVxuXG5tb2R1bGUuZXhwb3J0cyA9IE9yaWVudGF0aW9uU2ltdWxhdG9yIGlmIG1vZHVsZT9cbkZyYW1lci5PcmllbnRhdGlvblNpbXVsYXRvciA9IE9yaWVudGF0aW9uU2ltdWxhdG9yIiwicmVxdWlyZSAnU3lzdGVtJ1xuT3JpZW50YXRpb25TaW11bGF0b3IgPSByZXF1aXJlICdPcmllbnRhdGlvblNpbXVsYXRvcidcblxuJycnXG5MZW50aWN1bGFyXG5cbkBhdXRoZXIgaG8uc1xuQGRhdGUgMjAxNi4xMC4wNFxuJycnXG5jbGFzcyBleHBvcnRzLkxlbnRpY3VsYXIgZXh0ZW5kcyBMYXllclxuXHRAT3JpZW50YXRpb246IHt9XG5cdEBPcmllbnRhdGlvbi5Cb3RoID0gXCJvcmllbnRhdGlvbi5ib3RoXCJcblx0QE9yaWVudGF0aW9uLkxlZnQgPSBcIm9yaWVudGF0aW9uLmxlZnRcIlxuXHRAT3JpZW50YXRpb24uUmlnaHQgPSBcIm9yaWVudGF0aW9uLnJpZ2h0XCJcblxuXHQjIEBPcmllbnRhdGlvbjogT3JpZW50YXRpb25cblxuXHQjIENvbnN0cnVjdG9yXG5cdGNvbnN0cnVjdG9yOiAob3B0aW9ucyA9IHt9KSAtPlxuXHRcdHN1cGVyIG9wdGlvbnNcblxuXHRcdEBjb250ZW50cyA9IG5ldyBMYXllclxuXHRcdFx0bmFtZTogXCJjb250ZW50c1wiXG5cdFx0XHR3aWR0aDogQHdpZHRoLCBoZWlnaHQ6IEBoZWlnaHRcblx0XHRcdGJhY2tncm91bmRDb2xvcjogXCJcIlxuXHRcdFx0cGFyZW50OiBAXG5cblx0XHRAbWF0ZXJpYWwgPSBuZXcgTGF5ZXJcblx0XHRcdG5hbWU6IFwiLmxlbnNcIlxuXHRcdFx0d2lkdGg6IDc1MCwgaGVpZ2h0OiAxNjBcblx0XHRcdGltYWdlOiBcImltYWdlcy9sZW50aWN1bGFyX21hdGVyaWFsLnBuZ1wiXG5cdFx0XHRzdHlsZTogbWl4QmxlbmRNb2RlIDogXCJkYXJrZW5cIlxuXHRcdFx0c2NhbGVZOiBAaGVpZ2h0LzE2MCwgb3JpZ2luWTogMFxuXHRcdFx0YmFja2dyb3VuZENvbG9yOiBcIlwiXG5cdFx0XHRwYXJlbnQ6IEBcblxuXHRcdCMgTW9iaWxlXG5cdFx0aWYgVXRpbHMuaXNNb2JpbGUoKVxuXHRcdFx0c2Vuc29yTWFuYWdlciA9IGdldFN5c3RlbVNlcnZpY2UoQ29udGV4dC5TRU5TT1JfU0VSVklDRSlcblx0XHRcdHNlbnNvciA9IHNlbnNvck1hbmFnZXIuZ2V0RGVmYXVsdFNlbnNvcihTZW5zb3IuVFlQRV9PUklFTlRBVElPTilcblx0XHRcdGlmIHNlbnNvclxuXHRcdFx0XHRzZW5zb3Iuc21vb3RoID0gLjFcblx0XHRcdFx0c2Vuc29yLm9uQ2hhbmdlIChldmVudCkgPT5cblx0XHRcdFx0XHRnYW1tYSA9IGlmIGV2ZW50LmdhbW1hIDwgMCB0aGVuIFV0aWxzLm1vZHVsYXRlKGV2ZW50LmdhbW1hLCBbLTMwLCAtMTBdLCBbLTEsIDBdLCB0cnVlKSBlbHNlIFV0aWxzLm1vZHVsYXRlKGV2ZW50LmdhbW1hLCBbMTAsIDMwXSwgWzAsIDFdLCB0cnVlKVxuXHRcdFx0XHRcdEB0b0dhbW1hIGdhbW1hXG5cdFx0IyBEZXNrdG9wXG5cdFx0ZWxzZSBpZiBVdGlscy5pc0Rlc2t0b3AoKVxuXHRcdFx0T3JpZW50YXRpb25TaW11bGF0b3Iub25UaWx0IChnYW1tYSkgPT4gQHRvR2FtbWEgZ2FtbWFcblxuXHQjIFNldCBkZWZhdWx0IHNjZW5lXG5cdHNldERlZmF1bHQ6IChsYXllcikgLT5cblx0XHRAYWRkQ2hpbGQgbGF5ZXJcblx0XHRsYXllci5wbGFjZUJlaGluZCBAY29udGVudHNcblxuXHQjIEFkZCBzY2VuZVxuXHRhZGRTY2VuZTogKGxheWVyLCBvcmllbnRhdGlvbiA9IExlbnRpY3VsYXIuT3JpZW50YXRpb24uQm90aCkgLT5cblx0XHRsYXllci5vcGFjaXR5ID0gMFxuXHRcdGxheWVyLm9yaWVudGF0aW9uID0gb3JpZW50YXRpb25cblx0XHRAY29udGVudHMuYWRkQ2hpbGQgbGF5ZXJcblx0XG5cdCMgXG5cdHRvR2FtbWE6IChnYW1tYSkgLT5cblx0XHRmb3IgY2hpbGQgaW4gQGNvbnRlbnRzLmNoaWxkcmVuXG5cdFx0XHRpZiBjaGlsZC5vcmllbnRhdGlvbiBpcyBMZW50aWN1bGFyLk9yaWVudGF0aW9uLkxlZnRcblx0XHRcdFx0Y2hpbGQub3BhY2l0eSA9IE1hdGguYWJzKGdhbW1hKSBpZiBnYW1tYSA8PSAwXG5cdFx0XHRlbHNlIGlmIGNoaWxkLm9yaWVudGF0aW9uIGlzIExlbnRpY3VsYXIuT3JpZW50YXRpb24uUmlnaHRcblx0XHRcdFx0Y2hpbGQub3BhY2l0eSA9IGdhbW1hIGlmIGdhbW1hID49IDBcblx0XHRcdGVsc2UgXG5cdFx0XHRcdGNoaWxkLm9wYWNpdHkgPSBNYXRoLmFicyhnYW1tYSlcblx0XHRcdFx0XG5cdFx0XHRcblxuXG4iLCIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUlBQTtBREFBLElBQUEsb0JBQUE7RUFBQTs7O0FBQUEsT0FBQSxDQUFRLFFBQVI7O0FBQ0Esb0JBQUEsR0FBdUIsT0FBQSxDQUFRLHNCQUFSOztBQUV2Qjs7QUFNTSxPQUFPLENBQUM7OztFQUNiLFVBQUMsQ0FBQSxXQUFELEdBQWM7O0VBQ2QsVUFBQyxDQUFBLFdBQVcsQ0FBQyxJQUFiLEdBQW9COztFQUNw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
