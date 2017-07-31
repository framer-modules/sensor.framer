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
  Utils.interval(.1, function() {
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


},{"System-Sensor":"System-Sensor"}],"Viewer360":[function(require,module,exports){
var OrientationSimulator,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

require('System');

OrientationSimulator = require('OrientationSimulator');

'360 Rotation viewer\n\n@auther ho.s\n@since 2016.07.08';

exports.Viewer360 = (function(superClass) {
  var convertIndex, drag, fling, images, isFling, isSwipe, max, sceneIdx, sensor;

  extend(Viewer360, superClass);

  drag = 5.0;

  fling = 5.0;

  sensor = 2.0;

  sceneIdx = 0;

  isSwipe = false;

  isFling = false;

  images = [];

  max = 0;

  Viewer360.define('dragFriction', Viewer360.simpleProperty('dragFriction', 1.0));

  Viewer360.define('flingFriction', Viewer360.simpleProperty('flingFriction', 1.0));

  Viewer360.define('sensorFriction', Viewer360.simpleProperty('sensorFriction', 1.0));

  'options:\n	dragFriction: <Number> Drag friction (default: 1.0)\n	flingFriction: <Number> Fling friction (default: 1.0)\n	sensorFriction: <Number> Senor friction (default: 1.0)\n	images: <Array> Rotation image list';

  function Viewer360(options) {
    var sensorManager, sensorOrientation;
    if (options == null) {
      options = {};
    }
    this.onChangeX = bind(this.onChangeX, this);
    if (options.name == null) {
      options.name = "Viewer360";
    }
    if (options.backgroundColor == null) {
      options.backgroundColor = "";
    }
    options.z = -200;
    Viewer360.__super__.constructor.call(this, options);
    if (options.images == null) {
      options.images = [];
    }
    if (options.dragFriction) {
      this.dragFriction = options.dragFriction;
    }
    if (options.flingFriction) {
      this.flingFriction = options.flingFriction;
    }
    if (options.sensorFriction) {
      this.sensorFriction = options.sensorFriction;
    }
    this.viewport = new Layer({
      name: 'viewport',
      point: Align.center,
      width: this.width,
      height: this.height,
      z: 200,
      backgroundColor: '',
      parent: this
    });
    this.knob = new Layer({
      name: ".knob",
      point: 0,
      size: 0,
      parent: this
    });
    this.knob.on("change:x", this.onChangeX);
    this.onSwipeStart((function(_this) {
      return function(event) {
        isSwipe = true;
        return _this.knob.animateStop();
      };
    })(this));
    this.onSwipe((function(_this) {
      return function(event) {
        return _this.knob.x += event.delta.x / (drag / _this.dragFriction);
      };
    })(this));
    this.onSwipeEnd((function(_this) {
      return function(event) {
        isSwipe = false;
        isFling = true;
        _this.knob.animate({
          x: _this.knob.x + (event.velocity.x * (fling / _this.flingFriction)),
          options: {
            time: .35,
            curve: "bezier-curve(.0,.0,.2,1)"
          }
        });
        return _this.knob.once(Events.AnimationEnd, function() {
          return isFling = false;
        });
      };
    })(this));
    this.setImages(options.images);
    if (Utils.isMobile()) {
      sensorManager = getSystemService(Context.SENSOR_SERVICE);
      sensorOrientation = sensorManager.getDefaultSensor(Sensor.TYPE_ORIENTATION);
      if (sensorOrientation) {
        sensorOrientation.smooth = 0.1;
        sensorOrientation.onChange((function(_this) {
          return function(event) {
            _this.viewport.animateStop();
            _this.viewport.animate({
              rotationX: Utils.modulate(event.beta, [-15, 40], [-5, 5], true),
              rotationY: Utils.modulate(event.gamma, [-10, 10], [-15, 15], true),
              options: {
                curve: "ease",
                time: .2
              }
            });
            if (!isSwipe && !isFling) {
              _this.knob.animateStop();
              return _this.knob.animate({
                x: _this.knob.x + (event.gamma / (sensor / _this.sensorFriction)),
                options: {
                  curve: "ease",
                  time: .25
                }
              });
            }
          };
        })(this));
      }
    } else if (Utils.isDesktop()) {
      OrientationSimulator.onTilt((function(_this) {
        return function(gamma) {
          var filterGamma;
          filterGamma = Utils.modulate(gamma, [-1, 1], [-5, 5], true);
          _this.viewport.animateStop();
          _this.viewport.animate({
            rotationY: Utils.modulate(filterGamma, [-10, 10], [-15, 15], true),
            options: {
              curve: "ease",
              time: .2
            }
          });
          if (!isSwipe && !isFling) {
            _this.knob.animateStop();
            return _this.knob.animate({
              x: _this.knob.x + filterGamma,
              options: {
                curve: "ease",
                time: .25
              }
            });
          }
        };
      })(this));
    }
  }

  Viewer360.prototype.onChangeX = function() {
    if (_.isEmpty(images)) {
      return;
    }
    if (this.viewport && this.knob) {
      return this.viewport.image = images[convertIndex(this.knob.x)];
    }
  };

  Viewer360.prototype.setImages = function(value) {
    if (value == null) {
      value = [];
    }
    if (_.isEmpty(value)) {
      return;
    }
    images = value;
    max = images.length - 1;
    return this.onChangeX();
  };

  Viewer360.prototype.reset = function() {
    if (this.knob) {
      return this.knob.x = 0;
    }
  };

  convertIndex = function(index) {
    var idx;
    idx = index % max;
    if (idx < 0) {
      idx = max + idx;
    }
    return parseInt(idx);
  };

  return Viewer360;

})(Layer);


},{"OrientationSimulator":"OrientationSimulator","System":"System"}]},{},[])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZnJhbWVyLm1vZHVsZXMuanMiLCJzb3VyY2VzIjpbIi4uL21vZHVsZXMvVmlld2VyMzYwLmNvZmZlZSIsIi4uL21vZHVsZXMvU3lzdGVtLmNvZmZlZSIsIi4uL21vZHVsZXMvU3lzdGVtLVNlbnNvci5jb2ZmZWUiLCIuLi9tb2R1bGVzL09yaWVudGF0aW9uU2ltdWxhdG9yLmNvZmZlZSIsIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiXSwic291cmNlc0NvbnRlbnQiOlsicmVxdWlyZSAnU3lzdGVtJ1xuT3JpZW50YXRpb25TaW11bGF0b3IgPSByZXF1aXJlICdPcmllbnRhdGlvblNpbXVsYXRvcidcblxuJycnXG4zNjAgUm90YXRpb24gdmlld2VyXG5cbkBhdXRoZXIgaG8uc1xuQHNpbmNlIDIwMTYuMDcuMDhcbicnJ1xuY2xhc3MgZXhwb3J0cy5WaWV3ZXIzNjAgZXh0ZW5kcyBMYXllclxuXG5cdCMgVmFyaWFibGVcblx0ZHJhZyA9IDUuMFxuXHRmbGluZyA9IDUuMFxuXHRzZW5zb3IgPSAyLjBcblxuXHRzY2VuZUlkeCA9IDBcblxuXHRpc1N3aXBlID0gZmFsc2Vcblx0aXNGbGluZyA9IGZhbHNlXG5cblx0aW1hZ2VzID0gW11cblx0bWF4ID0gMFxuXG5cdCMgRHJhZyBsZXZlbFxuXHRAZGVmaW5lICdkcmFnRnJpY3Rpb24nLCBAc2ltcGxlUHJvcGVydHkoJ2RyYWdGcmljdGlvbicsIDEuMClcblx0IyBGbGluZyBsZXZlbFxuXHRAZGVmaW5lICdmbGluZ0ZyaWN0aW9uJywgQHNpbXBsZVByb3BlcnR5KCdmbGluZ0ZyaWN0aW9uJywgMS4wKVxuXHQjIFNlbnNvciBsZXZlbFxuXHRAZGVmaW5lICdzZW5zb3JGcmljdGlvbicsIEBzaW1wbGVQcm9wZXJ0eSgnc2Vuc29yRnJpY3Rpb24nLCAxLjApXG5cdFxuXHQnJydcblx0b3B0aW9uczpcblx0XHRkcmFnRnJpY3Rpb246IDxOdW1iZXI+IERyYWcgZnJpY3Rpb24gKGRlZmF1bHQ6IDEuMClcblx0XHRmbGluZ0ZyaWN0aW9uOiA8TnVtYmVyPiBGbGluZyBmcmljdGlvbiAoZGVmYXVsdDogMS4wKVxuXHRcdHNlbnNvckZyaWN0aW9uOiA8TnVtYmVyPiBTZW5vciBmcmljdGlvbiAoZGVmYXVsdDogMS4wKVxuXHRcdGltYWdlczogPEFycmF5PiBSb3RhdGlvbiBpbWFnZSBsaXN0XG5cdCcnJ1xuXHQjIENvbnN0dXJjdG9yXG5cdGNvbnN0cnVjdG9yOiAob3B0aW9ucyA9IHt9KSAtPlxuXHRcdG9wdGlvbnMubmFtZSA/PSBcIlZpZXdlcjM2MFwiXG5cdFx0b3B0aW9ucy5iYWNrZ3JvdW5kQ29sb3IgPz0gXCJcIlxuXHRcdG9wdGlvbnMueiA9IC0yMDBcblx0XHRzdXBlciBvcHRpb25zXG5cblx0XHQjXG5cdFx0b3B0aW9ucy5pbWFnZXMgPz0gW11cblxuXHRcdCNcblx0XHRAZHJhZ0ZyaWN0aW9uID0gb3B0aW9ucy5kcmFnRnJpY3Rpb24gaWYgb3B0aW9ucy5kcmFnRnJpY3Rpb25cblx0XHRAZmxpbmdGcmljdGlvbiA9IG9wdGlvbnMuZmxpbmdGcmljdGlvbiBpZiBvcHRpb25zLmZsaW5nRnJpY3Rpb25cblx0XHRAc2Vuc29yRnJpY3Rpb24gPSBvcHRpb25zLnNlbnNvckZyaWN0aW9uIGlmIG9wdGlvbnMuc2Vuc29yRnJpY3Rpb25cblx0XHRcblx0XHQjIExheWVyIDogVmlld3BvcnRcblx0XHRAdmlld3BvcnQgPSBuZXcgTGF5ZXIgXG5cdFx0XHRuYW1lOiAndmlld3BvcnQnXG5cdFx0XHRwb2ludDogQWxpZ24uY2VudGVyXG5cdFx0XHR3aWR0aDogQHdpZHRoLCBoZWlnaHQ6IEBoZWlnaHRcblx0XHRcdHo6IDIwMFxuXHRcdFx0YmFja2dyb3VuZENvbG9yOiAnJ1xuXHRcdFx0cGFyZW50OiBAXG5cblx0XHQjIExheWVyIDogS25vYlxuXHRcdEBrbm9iID0gbmV3IExheWVyIG5hbWU6IFwiLmtub2JcIiwgcG9pbnQ6IDAsIHNpemU6IDAsIHBhcmVudDogQFxuXHRcdEBrbm9iLm9uIFwiY2hhbmdlOnhcIiwgQG9uQ2hhbmdlWFxuXHRcdFx0XHRcdFxuXHRcdCMgRXZlbnQgOiBTdGFydFxuXHRcdEBvblN3aXBlU3RhcnQgKGV2ZW50KSA9PiBcblx0XHRcdGlzU3dpcGUgPSB0cnVlXG5cdFx0XHRAa25vYi5hbmltYXRlU3RvcCgpXG5cblx0XHQjIEV2ZW50IDogTW92ZSBcblx0XHRAb25Td2lwZSAoZXZlbnQpID0+IFxuXHRcdFx0QGtub2IueCArPSBldmVudC5kZWx0YS54IC8gKGRyYWcgLyBAZHJhZ0ZyaWN0aW9uKVxuXG5cdFx0IyBFdmVudCA6IEVuZFxuXHRcdEBvblN3aXBlRW5kIChldmVudCkgPT4gXG5cdFx0XHRpc1N3aXBlID0gZmFsc2Vcblx0XHRcdGlzRmxpbmcgPSB0cnVlXG5cblx0XHRcdEBrbm9iLmFuaW1hdGVcblx0XHRcdFx0eDogQGtub2IueCArIChldmVudC52ZWxvY2l0eS54ICogKGZsaW5nIC8gQGZsaW5nRnJpY3Rpb24pKVxuXHRcdFx0XHRvcHRpb25zOlxuXHRcdFx0XHRcdHRpbWU6IC4zNVxuXHRcdFx0XHRcdGN1cnZlOiBcImJlemllci1jdXJ2ZSguMCwuMCwuMiwxKVwiXG5cdFx0XHRAa25vYi5vbmNlIEV2ZW50cy5BbmltYXRpb25FbmQsIC0+IGlzRmxpbmcgPSBmYWxzZVxuXHRcdFxuXHRcdCNcblx0XHRAc2V0SW1hZ2VzKG9wdGlvbnMuaW1hZ2VzKVxuXHRcdFxuXHRcdCMgU2Vuc29yIDogRGV2aWNlXG5cdFx0aWYgVXRpbHMuaXNNb2JpbGUoKVxuXHRcdFx0IyBTZW5zb3IgbWFuYWdlclxuXHRcdFx0c2Vuc29yTWFuYWdlciA9IGdldFN5c3RlbVNlcnZpY2UoQ29udGV4dC5TRU5TT1JfU0VSVklDRSlcblx0XHRcdCMgU2Vuc29yIDogT3JpZW50YXRpb25cblx0XHRcdHNlbnNvck9yaWVudGF0aW9uID0gc2Vuc29yTWFuYWdlci5nZXREZWZhdWx0U2Vuc29yKFNlbnNvci5UWVBFX09SSUVOVEFUSU9OKVxuXHRcdFx0aWYgc2Vuc29yT3JpZW50YXRpb25cblx0XHRcdFx0c2Vuc29yT3JpZW50YXRpb24uc21vb3RoID0gMC4xXG5cdFx0XHRcdHNlbnNvck9yaWVudGF0aW9uLm9uQ2hhbmdlIChldmVudCkgPT5cblx0XHRcdFx0XHQjIEFuaSA6IFZpZXdwb3J0IDogUm90YXRpb24gWCBhbmQgWVxuXHRcdFx0XHRcdEB2aWV3cG9ydC5hbmltYXRlU3RvcCgpXG5cdFx0XHRcdFx0QHZpZXdwb3J0LmFuaW1hdGUgXG5cdFx0XHRcdFx0XHRyb3RhdGlvblg6IFV0aWxzLm1vZHVsYXRlKGV2ZW50LmJldGEsIFstMTUsIDQwXSwgWy01LCA1XSwgdHJ1ZSlcblx0XHRcdFx0XHRcdHJvdGF0aW9uWTogVXRpbHMubW9kdWxhdGUoZXZlbnQuZ2FtbWEsIFstMTAsIDEwXSwgWy0xNSwgMTVdLCB0cnVlKVxuXHRcdFx0XHRcdFx0b3B0aW9uczogY3VydmU6IFwiZWFzZVwiLCB0aW1lOiAuMlxuXHRcdFx0XHRcdFxuXHRcdFx0XHRcdCMgQW5pIDogVmlld3BvcnQgOiAzNjB2aWV3XG5cdFx0XHRcdFx0aWYgIWlzU3dpcGUgJiYgIWlzRmxpbmdcblx0XHRcdFx0XHRcdEBrbm9iLmFuaW1hdGVTdG9wKClcblx0XHRcdFx0XHRcdEBrbm9iLmFuaW1hdGVcblx0XHRcdFx0XHRcdFx0eDogQGtub2IueCArIChldmVudC5nYW1tYSAvIChzZW5zb3IgLyBAc2Vuc29yRnJpY3Rpb24pKVxuXHRcdFx0XHRcdFx0XHRvcHRpb25zOiBjdXJ2ZTogXCJlYXNlXCIsIHRpbWU6IC4yNVxuXHRcdCMgU2Vuc29yIDogU2ltdWxhdG9yXG5cdFx0ZWxzZSBpZiBVdGlscy5pc0Rlc2t0b3AoKVxuXHRcdFx0T3JpZW50YXRpb25TaW11bGF0b3Iub25UaWx0IChnYW1tYSkgPT5cblx0XHRcdFx0ZmlsdGVyR2FtbWEgPSBVdGlscy5tb2R1bGF0ZShnYW1tYSwgWy0xLCAxXSwgWy01LCA1XSwgdHJ1ZSlcblx0XHRcdFx0XG5cdFx0XHRcdEB2aWV3cG9ydC5hbmltYXRlU3RvcCgpXG5cdFx0XHRcdEB2aWV3cG9ydC5hbmltYXRlXG5cdFx0XHRcdFx0IyByb3RhdGlvblg6IFV0aWxzLm1vZHVsYXRlKGV2ZW50LmJldGEsIFstMTUsIDQwXSwgWy01LCA1XSwgdHJ1ZSlcblx0XHRcdFx0XHRyb3RhdGlvblk6IFV0aWxzLm1vZHVsYXRlKGZpbHRlckdhbW1hLCBbLTEwLCAxMF0sIFstMTUsIDE1XSwgdHJ1ZSlcblx0XHRcdFx0XHRvcHRpb25zOiBjdXJ2ZTogXCJlYXNlXCIsIHRpbWU6IC4yXG5cblx0XHRcdFx0aWYgIWlzU3dpcGUgJiYgIWlzRmxpbmdcblx0XHRcdFx0XHRAa25vYi5hbmltYXRlU3RvcCgpXG5cdFx0XHRcdFx0QGtub2IuYW5pbWF0ZVxuXHRcdFx0XHRcdFx0eDogQGtub2IueCArIGZpbHRlckdhbW1hXG5cdFx0XHRcdFx0XHRvcHRpb25zOiBjdXJ2ZTogXCJlYXNlXCIsIHRpbWU6IC4yNVxuXG5cdCMgRXZlbnQgOiBDaGFuZ2Vcblx0b25DaGFuZ2VYOiA9PiBcblx0XHRyZXR1cm4gaWYgXy5pc0VtcHR5KGltYWdlcylcblxuXHRcdGlmIEB2aWV3cG9ydCBhbmQgQGtub2Jcblx0XHRcdEB2aWV3cG9ydC5pbWFnZSA9IGltYWdlc1tjb252ZXJ0SW5kZXgoQGtub2IueCldIFxuXG5cdCMgU2V0IGltYWdlc1xuXHRzZXRJbWFnZXM6ICh2YWx1ZSA9IFtdKSAtPlxuXHRcdHJldHVybiBpZiBfLmlzRW1wdHkodmFsdWUpXG5cblx0XHRpbWFnZXMgPSB2YWx1ZVxuXHRcdG1heCA9IGltYWdlcy5sZW5ndGggLSAxXG5cblx0XHRAb25DaGFuZ2VYKClcblxuXHQjIFJlc2V0IDogcG9zaXRpb24gZmlyc3QgaW5kZXhcblx0cmVzZXQ6ICgpIC0+IEBrbm9iLnggPSAwIGlmIEBrbm9iXG5cblx0IyBDb252ZXJ0IGluZGV4IGZvciBpbmZpbml0eVxuXHRjb252ZXJ0SW5kZXggPSAoaW5kZXgpIC0+IFxuXHRcdGlkeCA9IGluZGV4ICUgbWF4XG5cdFx0aWR4ID0gbWF4ICsgaWR4IGlmIGlkeCA8IDBcblx0XHRyZXR1cm4gcGFyc2VJbnQoaWR4KSIsInJlcXVpcmUgJ1N5c3RlbS1TZW5zb3InXG5cbicnJ1xuU3lzdGVtXG5cbkBhdXRoZXIgaG8uc1xuQGRhdGUgMjAxNi4xMC4wNFxuJycnXG5cbiMgQ29udGV4dFxuQ29udGV4dCA9IHt9XG4jIENvbnRleHQgOiBTZW5zb3JcbkNvbnRleHQuU0VOU09SX1NFUlZJQ0UgPSBcImNvbnRleHQuU0VOU09SX1NFUlZJQ0VcIlxuXG4jIEdldCBzeXN0ZW0gc2VydmljZVxuZ2V0U3lzdGVtU2VydmljZSA9IChzZXJ2aWNlKS0+XG5cdHN3aXRjaCBzZXJ2aWNlXG5cdFx0IyBTZW5zb3Jcblx0XHR3aGVuIENvbnRleHQuU0VOU09SX1NFUlZJQ0UgdGhlbiByZXR1cm4gU2Vuc29yTWFuYWdlclxuXHRcblxuI1xuaWYgd2luZG93XG5cdHdpbmRvdy5Db250ZXh0ID0gQ29udGV4dCBcblx0d2luZG93LmdldFN5c3RlbVNlcnZpY2UgPSBnZXRTeXN0ZW1TZXJ2aWNlXG5cdCIsIicnJ1xuU2Vuc29yXG5cbkBhdXRoZXIgaG8uc1xuQGRhdGUgMjAxNi4xMC4wNFxuJycnXG5cbiMgU2Vuc29yIG1hbmFnZXJcblNlbnNvck1hbmFnZXIgPSB7fVxuIyBTZW5zb3IgbWFuYWdlciA6IEdldCBkZWZhdWx0IHNlbnNvclxuU2Vuc29yTWFuYWdlci5nZXREZWZhdWx0U2Vuc29yID0gKHR5cGUpIC0+XG5cdHN3aXRjaCB0eXBlXG5cdFx0IyBPcmllbnRhdGlvblxuXHRcdHdoZW4gU2Vuc29yLlRZUEVfT1JJRU5UQVRJT04gdGhlbiByZXR1cm4gT3JpZW50YXRpb24uZ2V0KClcblx0XHQjIE1vdGlvblxuXHRcdHdoZW4gU2Vuc29yLlRZUEVfTU9USU9OIHRoZW4gcmV0dXJuIE1vdGlvbi5nZXQoKVxuXG4jIFNlbnNvclxuY2xhc3MgU2Vuc29yIGV4dGVuZHMgRnJhbWVyLkJhc2VDbGFzc1xuXHQjIFNlbnNvciB0eXBlXG5cdEBUWVBFX09SSUVOVEFUSU9OOiBcInNlbnNvci5vcmllbnRhdGlvblwiXG5cdEBUWVBFX01PVElPTjogXCJzZW5zb3IubW90aW9uXCJcblxuXHQjIEV2ZW50cyA6IENoYW5nZVxuXHRFdmVudHMuQ2hhbmdlID0gXCJzZW5zb3IuY2hhbmdlXCJcblxuXHQjIFNtb290aFxuXHRAZGVmaW5lICdzbW9vdGgnLCBAc2ltcGxlUHJvcGVydHkoJ3Ntb290aCcsIDEpXG5cblx0IyBDb25zdHJ1Y3RvclxuXHRjb25zdHJ1Y3RvcjogKCkgLT5cblx0XHRzdXBlclxuXG5cdCMgRXZlbnQgbGlzbnRlbmVyIDogY2hhbmdlXG5cdG9uQ2hhbmdlOiAoY2IpIC0+IEBvbiBFdmVudHMuQ2hhbmdlLCBjYlxuXG4jIFNlbnNvciA6IE9yaWVudGF0aW9uXG5jbGFzcyBPcmllbnRhdGlvbiBleHRlbmRzIFNlbnNvclxuXG5cdCMgU2luZ2xldG9uXG5cdGluc3RhbmNlID0gbnVsbFxuXHRAZ2V0OiAtPiBcblx0XHQjIE9yaWVudGF0aW9uIGV2ZW50IHN1cHBvcnRlZFxuXHRcdGlmIHdpbmRvdy5EZXZpY2VPcmllbnRhdGlvbkV2ZW50IHRoZW4gaW5zdGFuY2UgPz0gbmV3IE9yaWVudGF0aW9uKClcblx0XHQjIE5vdCBzdXBwb3J0ZWRcblx0XHRlbHNlIGNvbnNvbGUuZXJyb3IgXCJOb3Qgc3VwcG9ydGVkXCIsIFwiRGV2aWNlIG9yaWVudGF0aW9uIGV2ZW50cyBhcmUgbm90IHN1cG9ydGVkIG9uIHRoaXMgZGV2aWNlXCJcblxuXHRcdGluc3RhbmNlXG5cblx0IyBWYWx1ZVxuXHRAZGVmaW5lICdhbHBoYScsIEBzaW1wbGVQcm9wZXJ0eSgnYWxwaGEnLCAwKVxuXHRAZGVmaW5lICdiZXRhJywgQHNpbXBsZVByb3BlcnR5KCdiZXRhJywgMClcblx0QGRlZmluZSAnZ2FtbWEnLCBAc2ltcGxlUHJvcGVydHkoJ2dhbW1hJywgMClcblxuXHQjIENvbnN0cnVjdG9yXG5cdGNvbnN0cnVjdG9yOiAoKSAtPlxuXHRcdHN1cGVyXG5cblx0XHQjIEV2ZW50XG5cdFx0RXZlbnRzLndyYXAod2luZG93KS5hZGRFdmVudExpc3RlbmVyIFwiZGV2aWNlb3JpZW50YXRpb25cIiwgKGV2ZW50KSA9PlxuXHRcdFx0QGFscGhhID0gKGV2ZW50LmFscGhhICogQHNtb290aCkgKyAoQGFscGhhICogKDEtIEBzbW9vdGgpKVxuXHRcdFx0QGJldGEgPSAoZXZlbnQuYmV0YSAqIEBzbW9vdGgpICsgKEBiZXRhICogKDEtIEBzbW9vdGgpKVxuXHRcdFx0QGdhbW1hID0gKGV2ZW50LmdhbW1hICogQHNtb290aCkgKyAoQGdhbW1hICogKDEtIEBzbW9vdGgpKVxuXG5cdFx0XHRvcmllbnRhdGlvbiA9IFxuXHRcdFx0XHRhbHBoYTogQGFscGhhXG5cdFx0XHRcdGJldGE6IEBiZXRhXG5cdFx0XHRcdGdhbW1hOiBAZ2FtbWFcblx0XHRcdFx0YWJzb2x1dGU6IGV2ZW50LmFic29sdXRlXG5cblx0XHRcdEBlbWl0IEV2ZW50cy5DaGFuZ2UsIG9yaWVudGF0aW9uXG5cbiMgU2Vuc29yIDogTW90aW9uXG5jbGFzcyBNb3Rpb24gZXh0ZW5kcyBTZW5zb3JcblxuXHQjIFNpbmdsZXRvblxuXHRpbnN0YW5jZSA9IG51bGxcblx0QGdldDogLT4gXG5cdFx0IyBPcmllbnRhdGlvbiBldmVudCBzdXBwb3J0ZWRcblx0XHRpZiB3aW5kb3cuRGV2aWNlTW90aW9uRXZlbnQgdGhlbiBpbnN0YW5jZSA/PSBuZXcgTW90aW9uKClcblx0XHQjIE5vdCBzdXBwb3J0ZWRcblx0XHRlbHNlIGNvbnNvbGUuZXJyb3IgXCJOb3Qgc3VwcG9ydGVkXCIsIFwiRGV2aWNlIG1vdGlvbiBldmVudHMgYXJlIG5vdCBzdXBvcnRlZCBvbiB0aGlzIGRldmljZVwiXG5cblx0XHRpbnN0YW5jZVxuXG5cdCMgVmFsdWVcblx0QGRlZmluZSAneCcsIEBzaW1wbGVQcm9wZXJ0eSgneCcsIDApXG5cdEBkZWZpbmUgJ3knLCBAc2ltcGxlUHJvcGVydHkoJ3knLCAwKVxuXHRAZGVmaW5lICd6JywgQHNpbXBsZVByb3BlcnR5KCd6JywgMClcblx0QGRlZmluZSAnZ3gnLCBAc2ltcGxlUHJvcGVydHkoJ2d4JywgMClcblx0QGRlZmluZSAnZ3knLCBAc2ltcGxlUHJvcGVydHkoJ2d5JywgMClcblx0QGRlZmluZSAnZ3onLCBAc2ltcGxlUHJvcGVydHkoJ2d6JywgMClcblx0QGRlZmluZSAnYWxwaGEnLCBAc2ltcGxlUHJvcGVydHkoJ2FscGhhJywgMClcblx0QGRlZmluZSAnYmV0YScsIEBzaW1wbGVQcm9wZXJ0eSgnYmV0YScsIDApXG5cdEBkZWZpbmUgJ2dhbW1hJywgQHNpbXBsZVByb3BlcnR5KCdnYW1tYScsIDApXG5cdEBkZWZpbmUgJ2ludGVydmFsJywgQHNpbXBsZVByb3BlcnR5KCdpbnRlcnZhbCcsIDApXG5cblxuXHQjIENvbnN0cnVjdG9yXG5cdGNvbnN0cnVjdG9yOiAoKSAtPlxuXHRcdHN1cGVyXG5cblx0XHQjIEV2ZW50XG5cdFx0RXZlbnRzLndyYXAod2luZG93KS5hZGRFdmVudExpc3RlbmVyIFwiZGV2aWNlbW90aW9uXCIsIChldmVudCkgPT5cblx0XHRcdEB4ID0gKGV2ZW50LmFjY2VsZXJhdGlvbi54ICogQHNtb290aCkgKyAoQHggKiAoMS0gQHNtb290aCkpXG5cdFx0XHRAeSA9IChldmVudC5hY2NlbGVyYXRpb24ueSAqIEBzbW9vdGgpICsgKEB5ICogKDEtIEBzbW9vdGgpKVxuXHRcdFx0QHogPSAoZXZlbnQuYWNjZWxlcmF0aW9uLnogKiBAc21vb3RoKSArIChAeiAqICgxLSBAc21vb3RoKSlcblxuXHRcdFx0QGd4ID0gKGV2ZW50LmFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHkueCAqIEBzbW9vdGgpICsgKEBneCAqICgxLSBAc21vb3RoKSlcblx0XHRcdEBneSA9IChldmVudC5hY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5LnkgKiBAc21vb3RoKSArIChAZ3kgKiAoMS0gQHNtb290aCkpXG5cdFx0XHRAZ3ogPSAoZXZlbnQuYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eS56ICogQHNtb290aCkgKyAoQGd6ICogKDEtIEBzbW9vdGgpKVxuXG5cdFx0XHRAYWxwaGEgPSAoZXZlbnQucm90YXRpb25SYXRlLmFscGhhICogQHNtb290aCkgKyAoQGFscGhhICogKDEtIEBzbW9vdGgpKVxuXHRcdFx0QGJldGEgPSAoZXZlbnQucm90YXRpb25SYXRlLmJldGEgKiBAc21vb3RoKSArIChAYmV0YSAqICgxLSBAc21vb3RoKSlcblx0XHRcdEBnYW1tYSA9IChldmVudC5yb3RhdGlvblJhdGUuZ2FtbWEgKiBAc21vb3RoKSArIChAZ2FtbWEgKiAoMS0gQHNtb290aCkpXG5cblx0XHRcdEBpbnRlcnZhbCA9IGV2ZW50LmludGVydmFsXG5cblx0XHRcdG1vdGlvbiA9IFxuXHRcdFx0XHRhY2NlbGVyYXRpb246IHg6IEB4LCB5OiBAeSwgejogQHpcblx0XHRcdFx0YWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eTogeDogQGd4LCB5OiBAZ3ksIHo6IEBnelxuXHRcdFx0XHRyb3RhdGlvblJhdGU6IGFscGhhOiBAYWxwaGEsIGJldGE6IEBiZXRhLCBnYW1tYTogQGdhbW1hXG5cdFx0XHRcdGludGVydmFsOiBAaW50ZXJ2YWxcblxuXHRcdFx0QGVtaXQgRXZlbnRzLkNoYW5nZSwgbW90aW9uXG5cbiNcbmlmIHdpbmRvd1xuXHR3aW5kb3cuU2Vuc29yTWFuYWdlciA9IFNlbnNvck1hbmFnZXJcblx0d2luZG93LlNlbnNvciA9IFNlbnNvclxuXHR3aW5kb3cuT3JpZW50YXRpb24gPSBPcmllbnRhdGlvblxuXHR3aW5kb3cuTW90aW9uID0gTW90aW9uIiwiIyMjXG5UaWx0IHRoZSBzaW11bGF0b3JcblxuQGF1dGhlciBoby5zXG5AZGF0ZSAyMDE2LjEwLjA0XG4jIyNcbk9yaWVudGF0aW9uU2ltdWxhdG9yID0ge31cbk9yaWVudGF0aW9uU2ltdWxhdG9yLm9uVGlsdCA9IChjYikgLT5cblx0cmV0dXJuIHVubGVzcyBVdGlscy5pc0Rlc2t0b3AoKVxuXG5cdEV2ZW50cy5HYW1tYSA9IFwiT3JpZW50YXRpb25TaW11bGF0b3IuZ2FtbWFcIlxuXG5cdHJ5ID0gMSAqIDEuMlxuXHRkeCA9IDUwXG5cdGR6ID0gLTVcblx0ZFNjYWxlWCA9IC45NlxuXHRndWlkZUR4ID0gMzBcblxuXHQjIFNldCBwZXJzcGVjdGl2ZVxuXHRGcmFtZXIuRGV2aWNlLmhhbmRzLnBlcnNwZWN0aXZlID0gMTAwICogMlxuXHRGcmFtZXIuRGV2aWNlLmhhbmRzLnogPSAxMDBcblxuXHQjIFZpZXdcblx0X2xlZnQgPSBuZXcgTGF5ZXJcblx0XHRuYW1lOiAnLmxlZnQnXG5cdFx0d2lkdGg6IEZyYW1lci5EZXZpY2UuYmFja2dyb3VuZC53aWR0aCAvIDIsIGhlaWdodDogRnJhbWVyLkRldmljZS5iYWNrZ3JvdW5kLmhlaWdodFxuXHRcdGJhY2tncm91bmRDb2xvcjogJ3JnYmEoMCwwLDAsMCknXG5cdFx0cGFyZW50OiBGcmFtZXIuRGV2aWNlLmJhY2tncm91bmRcblx0X3JpZ2h0ID0gbmV3IExheWVyXG5cdFx0bmFtZTogJy5yaWdodCdcblx0XHR4OiBGcmFtZXIuRGV2aWNlLmJhY2tncm91bmQud2lkdGggLyAyXG5cdFx0d2lkdGg6IEZyYW1lci5EZXZpY2UuYmFja2dyb3VuZC53aWR0aCAvIDIsIGhlaWdodDogRnJhbWVyLkRldmljZS5iYWNrZ3JvdW5kLmhlaWdodFxuXHRcdGJhY2tncm91bmRDb2xvcjogJ3JnYmEoMCwwLDAsMCknXG5cdFx0cGFyZW50OiBGcmFtZXIuRGV2aWNlLmJhY2tncm91bmRcblx0X2xlZnQubGFiZWwgPSBuZXcgTGF5ZXJcblx0XHRuYW1lOiAnLmxlZnQubGFiZWwnXG5cdFx0eDogQWxpZ24ucmlnaHQoLTgwMCAqIEZyYW1lci5EZXZpY2UuaGFuZHMuc2NhbGUpLCB5OiBBbGlnbi5jZW50ZXJcblx0XHR3aWR0aDogNTAwXG5cdFx0aHRtbDogXCI8c3Ryb25nPuyZvOyqvTwvc3Ryb25nPuycvOuhnDxici8+6riw7Jq47J206riwXCJcblx0XHRjb2xvcjogXCJyZ2JhKDAsMCwwLC4zKVwiXG5cdFx0c3R5bGU6IHsgZm9udDogXCIzMDAgMTAwcHgvMSAje1V0aWxzLmRldmljZUZvbnQoKX1cIiwgdGV4dEFsaWduOiBcInJpZ2h0XCIsIFwiLXdlYmtpdC1mb250LXNtb290aGluZ1wiOiBcImFudGlhbGlhc2VkXCIgfVxuXHRcdHNjYWxlOiBGcmFtZXIuRGV2aWNlLmhhbmRzLnNjYWxlLCBvcmlnaW5YOiAxXG5cdFx0YmFja2dyb3VuZENvbG9yOiBcInRyYW5zcGFyZW50XCJcblx0XHRwYXJlbnQ6IF9sZWZ0XG5cdF9sZWZ0LmxhYmVsLmN1c3RvbSA9IHsgb1g6IF9sZWZ0LmxhYmVsLnggfVxuXHRfcmlnaHQubGFiZWwgPSBuZXcgTGF5ZXJcblx0XHRuYW1lOiAnLnJpZ2h0LmxhYmVsJ1xuXHRcdHg6IEFsaWduLmxlZnQoODAwICogRnJhbWVyLkRldmljZS5oYW5kcy5zY2FsZSksIHk6IEFsaWduLmNlbnRlclxuXHRcdHdpZHRoOiA1MDBcblx0XHRodG1sOiBcIjxzdHJvbmc+7Jik66W47Kq9PC9zdHJvbmc+7Jy866GcPGJyLz7quLDsmrjsnbTquLBcIlxuXHRcdGNvbG9yOiBcInJnYmEoMCwwLDAsLjMpXCJcblx0XHRzdHlsZTogeyBmb250OiBcIjMwMCAxMDBweC8xICN7VXRpbHMuZGV2aWNlRm9udCgpfVwiLCB0ZXh0QWxpZ246IFwibGVmdFwiLCBcIi13ZWJraXQtZm9udC1zbW9vdGhpbmdcIjogXCJhbnRpYWxpYXNlZFwiIH1cblx0XHRzY2FsZTogRnJhbWVyLkRldmljZS5oYW5kcy5zY2FsZSwgb3JpZ2luWDogMFxuXHRcdGJhY2tncm91bmRDb2xvcjogXCJ0cmFuc3BhcmVudFwiXG5cdFx0cGFyZW50OiBfcmlnaHRcblx0X3JpZ2h0LmxhYmVsLmN1c3RvbSA9IHsgb1g6IF9yaWdodC5sYWJlbC54IH1cblxuXHQjIyNcblx0IyBFdmVudCA6OiBUb3VjaCBzdGFydFxuXHRGcmFtZXIuRGV2aWNlLmJhY2tncm91bmQub25UYXBTdGFydCAtPlxuXHRcdGNlbnRlclggPSBGcmFtZXIuRGV2aWNlLmJhY2tncm91bmQud2lkdGggLyAyXG5cdFx0aWYgZXZlbnQucG9pbnQueCA8IGNlbnRlclhcblx0XHRcdEZyYW1lci5EZXZpY2UuaGFuZHNJbWFnZUxheWVyLmFuaW1hdGUgcHJvcGVydGllczogeyB4OiBBbGlnbi5jZW50ZXIoZHgpLCByb3RhdGlvblk6IC1yeSwgejogZHosIHNjYWxlWDogZFNjYWxlWCB9XG5cdFx0XHRGcmFtZXIuRGV2aWNlLnBob25lLmFuaW1hdGUgcHJvcGVydGllczogeyB4OiBBbGlnbi5jZW50ZXIoZHgpLCByb3RhdGlvblk6IC1yeSwgejogZHosIHNjYWxlWDogZFNjYWxlWCB9XG5cdFx0ZWxzZVxuXHRcdFx0RnJhbWVyLkRldmljZS5oYW5kc0ltYWdlTGF5ZXIuYW5pbWF0ZSBwcm9wZXJ0aWVzOiB7IHg6IEFsaWduLmNlbnRlcigtZHgpLCByb3RhdGlvblk6IHJ5LCB6OiBkeiwgc2NhbGVYOiBkU2NhbGVYIH1cblx0XHRcdEZyYW1lci5EZXZpY2UucGhvbmUuYW5pbWF0ZSBwcm9wZXJ0aWVzOiB7IHg6IEFsaWduLmNlbnRlcigtZHgpLCByb3RhdGlvblk6IHJ5LCB6OiBkeiwgc2NhbGVYOiBkU2NhbGVYIH1cblxuXHQjIEV2ZW50IDo6IFRvdWNoIGVuZFxuXHRGcmFtZXIuRGV2aWNlLmJhY2tncm91bmQub25UYXBFbmQgLT5cblx0XHRGcmFtZXIuRGV2aWNlLmhhbmRzSW1hZ2VMYXllci5hbmltYXRlIHByb3BlcnRpZXM6IHsgeDogQWxpZ24uY2VudGVyLCByb3RhdGlvblg6IDAsIHJvdGF0aW9uWTogMCwgejogMCwgc2NhbGVYOiAxIH1cblx0XHRGcmFtZXIuRGV2aWNlLnBob25lLmFuaW1hdGUgcHJvcGVydGllczogeyB4OiBBbGlnbi5jZW50ZXIsIHJvdGF0aW9uWDogMCwgcm90YXRpb25ZOiAwLCB6OiAwLCBzY2FsZVg6IDEgfVxuXHQjIyNcblxuXHRVdGlscy5pbnRlcnZhbCAuMSwgLT5cblx0XHRjYihVdGlscy5tb2R1bGF0ZShGcmFtZXIuRGV2aWNlLnBob25lLnJvdGF0aW9uWSwgWy1yeSwgcnldLCBbLTEsIDFdLCB0cnVlKSwgQCkgPyBjYlxuXG5cdCMgRXZlbnQgOjogQ2hhbmdlXG5cdCMgRnJhbWVyLkRldmljZS5waG9uZS5vbiBcImNoYW5nZTpyb3RhdGlvbllcIiwgLT5cblx0XHQjIENhbGxiYWNrXG5cdFx0IyBjYihVdGlscy5tb2R1bGF0ZShGcmFtZXIuRGV2aWNlLnBob25lLnJvdGF0aW9uWSwgWy1yeSwgcnldLCBbLTEsIDFdLCB0cnVlKSwgQCkgPyBjYlxuXG5cdEZyYW1lci5EZXZpY2UuYmFja2dyb3VuZC5vbiBcImNoYW5nZTpzaXplXCIsIC0+XG5cdFx0X2xlZnQucHJvcHMgPSBcblx0XHRcdHdpZHRoOiBGcmFtZXIuRGV2aWNlLmJhY2tncm91bmQud2lkdGggLyAyLCBoZWlnaHQ6IEZyYW1lci5EZXZpY2UuYmFja2dyb3VuZC5oZWlnaHRcblx0XHRfcmlnaHQucHJvcHMgPSBcblx0XHRcdHg6IEZyYW1lci5EZXZpY2UuYmFja2dyb3VuZC53aWR0aCAvIDJcblx0XHRcdHdpZHRoOiBGcmFtZXIuRGV2aWNlLmJhY2tncm91bmQud2lkdGggLyAyLCBoZWlnaHQ6IEZyYW1lci5EZXZpY2UuYmFja2dyb3VuZC5oZWlnaHRcblxuXHRcdF9sZWZ0LmxhYmVsLnByb3BzID1cblx0XHRcdHg6IEFsaWduLnJpZ2h0KC04MDAgKiBGcmFtZXIuRGV2aWNlLmhhbmRzLnNjYWxlKSwgeTogQWxpZ24uY2VudGVyXG5cdFx0XHRzY2FsZTogRnJhbWVyLkRldmljZS5oYW5kcy5zY2FsZVxuXHRcdF9sZWZ0LmxhYmVsLmN1c3RvbSA9IHsgb1g6IF9sZWZ0LmxhYmVsLnggfVxuXHRcdF9yaWdodC5sYWJlbC5wcm9wcyA9XG5cdFx0XHR4OiBBbGlnbi5sZWZ0KDgwMCAqIEZyYW1lci5EZXZpY2UuaGFuZHMuc2NhbGUpLCB5OiBBbGlnbi5jZW50ZXJcblx0XHRcdHNjYWxlOiBGcmFtZXIuRGV2aWNlLmhhbmRzLnNjYWxlXG5cdFx0X3JpZ2h0LmxhYmVsLmN1c3RvbSA9IHsgb1g6IF9yaWdodC5sYWJlbC54IH1cblxuXHRpc0xlZnRBbmkgPSBpc0JhY2tBbmkgPSBpc1JpZ2h0QW5pID0gZmFsc2Vcblx0XG5cdG9uTW91c2VPdmVyID0gLT4gXG5cdFx0aWYgQG5hbWUgaXMgXCIubGVmdFwiIHRoZW4geCA9IEBjaGlsZHJlblswXS5jdXN0b20ub1ggLSBndWlkZUR4IGVsc2UgeCA9IEBjaGlsZHJlblswXS5jdXN0b20ub1ggKyBndWlkZUR4XG5cdFx0QGNoaWxkcmVuWzBdLmFuaW1hdGUgcHJvcGVydGllczogeyB4OiB4IH1cblxuXHRvbk1vdXNlT3V0ID0gLT5cblx0XHRAY2hpbGRyZW5bMF0uYW5pbWF0ZSBwcm9wZXJ0aWVzOiB7IHg6IEBjaGlsZHJlblswXS5jdXN0b20ub1ggfVxuXG5cdFx0aWYgRnJhbWVyLkRldmljZS5waG9uZS5yb3RhdGlvblkgaXNudCAwIGFuZCAhaXNCYWNrQW5pXG5cdFx0XHRpc0xlZnRBbmkgPSBmYWxzZVxuXHRcdFx0aXNCYWNrQW5pID0gdHJ1ZVxuXHRcdFx0aXNSaWdodEFuaSA9IGZhbHNlXG5cdFx0XHRGcmFtZXIuRGV2aWNlLmhhbmRzSW1hZ2VMYXllci5hbmltYXRlIHByb3BlcnRpZXM6IHsgeDogQWxpZ24uY2VudGVyLCByb3RhdGlvblg6IDAsIHJvdGF0aW9uWTogMCwgejogMCwgc2NhbGVYOiAxIH1cblx0XHRcdEZyYW1lci5EZXZpY2UucGhvbmUuYW5pbWF0ZSBwcm9wZXJ0aWVzOiB7IHg6IEFsaWduLmNlbnRlciwgcm90YXRpb25YOiAwLCByb3RhdGlvblk6IDAsIHo6IDAsIHNjYWxlWDogMSB9XG5cdFx0XHRGcmFtZXIuRGV2aWNlLnBob25lLm9uQW5pbWF0aW9uRW5kIGNhbGxiYWNrID0gLT5cblx0XHRcdFx0aXNCYWNrQW5pID0gZmFsc2Vcblx0XHRcdFx0RnJhbWVyLkRldmljZS5waG9uZS5vZmYgRXZlbnRzLkFuaW1hdGlvbkVuZCwgY2FsbGJhY2tcblxuXHRfbGVmdC5vbk1vdXNlT3ZlciBvbk1vdXNlT3ZlclxuXHRfbGVmdC5vbk1vdXNlT3V0IG9uTW91c2VPdXRcblx0X3JpZ2h0Lm9uTW91c2VPdmVyIG9uTW91c2VPdmVyXG5cdF9yaWdodC5vbk1vdXNlT3V0IG9uTW91c2VPdXRcblxuXHRvblRvdWNoTW92ZSA9IChfZHgsIF9yeSkgLT5cblx0XHRpZiBGcmFtZXIuRGV2aWNlLnBob25lLnJvdGF0aW9uWSBpc250IF9yeSBhbmQgIShpZiBfcnkgaXMgLXJ5IHRoZW4gaXNMZWZ0QW5pIGVsc2UgaXNSaWdodEFuaSlcblx0XHRcdGlzTGVmdEFuaSA9IGlzQmFja0FuaSA9IGlzUmlnaHRBbmkgPSBmYWxzZVxuXHRcdFx0aWYgX3J5IGlzIC1yeSB0aGVuIGlzTGVmdEFuaSA9IHRydWUgZWxzZSBpc1JpZ2h0QW5pID0gdHJ1ZVxuXG5cdFx0XHRGcmFtZXIuRGV2aWNlLmhhbmRzSW1hZ2VMYXllci5hbmltYXRlIHByb3BlcnRpZXM6IHsgeDogQWxpZ24uY2VudGVyKF9keCksIHJvdGF0aW9uWTogX3J5LCB6OiBkeiwgc2NhbGVYOiBkU2NhbGVYIH1cblx0XHRcdEZyYW1lci5EZXZpY2UucGhvbmUuYW5pbWF0ZSBwcm9wZXJ0aWVzOiB7IHg6IEFsaWduLmNlbnRlcihfZHgpLCByb3RhdGlvblk6IF9yeSwgejogZHosIHNjYWxlWDogZFNjYWxlWCB9XG5cblx0X2xlZnQub25Ub3VjaE1vdmUgLT4gb25Ub3VjaE1vdmUoZHgsIC1yeSwgaXNMZWZ0QW5pKVxuXHRfcmlnaHQub25Ub3VjaE1vdmUgLT4gb25Ub3VjaE1vdmUoLWR4LCByeSwgaXNSaWdodEFuaSlcblxubW9kdWxlLmV4cG9ydHMgPSBPcmllbnRhdGlvblNpbXVsYXRvciBpZiBtb2R1bGU/XG5GcmFtZXIuT3JpZW50YXRpb25TaW11bGF0b3IgPSBPcmllbnRhdGlvblNpbXVsYXRvciIsIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBSUFBOztBREFBOzs7Ozs7QUFBQSxJQUFBOztBQU1BLG9CQUFBLEdBQXVCOztBQUN2QixvQkFBb0IsQ0FBQyxNQUFyQixHQUE4QixTQUFDLEVBQUQ7QUFDN0IsTUFBQTtFQUFBLElBQUEsQ0FBYyxLQUFLLENBQUMsU0FBTixDQUFBLENBQWQ7QUFBQSxXQUFBOztFQUVBLE1BQU0sQ0FBQyxLQUFQLEdBQWU7RUFFZixFQUFBLEdBQUssQ0FBQSxHQUFJO0VBQ1QsRUFBQSxHQUFLO0VBQ0wsRUFBQSxHQUFLLENBQUM7RUFDTixPQUFBLEdBQVU7RUFDVixPQUFBLEdBQVU7RUFHVixNQUFNLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxXQUFwQixHQUFrQyxHQUFBLEdBQU07RUFDeEMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBcEIsR0FBd0I7RUFHeEIsS0FBQSxHQUFZLElBQUEsS0FBQSxDQUNYO0lBQUEsSUFBQSxFQUFNLE9BQU47SUFDQSxLQUFBLEVBQU8sTUFBTSxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsS0FBekIsR0FBaUMsQ0FEeEM7SUFDMkMsTUFBQSxFQUFRLE1BQU0sQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLE1BRDVFO0lBRUEsZUFBQSxFQUFpQixlQUZqQjtJQUdBLE1BQUEsRUFBUSxNQUFNLENB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
