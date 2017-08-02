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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZnJhbWVyLm1vZHVsZXMuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL1VzZXJzL3RocmVld29yZC90b3kvZ2l0aHViL2ZyYW1lci1tb2R1bGVzL3NlbnNvci5mcmFtZXIvMzYwVmlld2VyLmZyYW1lci9tb2R1bGVzL1ZpZXdlcjM2MC5jb2ZmZWUiLCIuLi8uLi8uLi8uLi8uLi9Vc2Vycy90aHJlZXdvcmQvdG95L2dpdGh1Yi9mcmFtZXItbW9kdWxlcy9zZW5zb3IuZnJhbWVyLzM2MFZpZXdlci5mcmFtZXIvbW9kdWxlcy9TeXN0ZW0uY29mZmVlIiwiLi4vLi4vLi4vLi4vLi4vVXNlcnMvdGhyZWV3b3JkL3RveS9naXRodWIvZnJhbWVyLW1vZHVsZXMvc2Vuc29yLmZyYW1lci8zNjBWaWV3ZXIuZnJhbWVyL21vZHVsZXMvU3lzdGVtLVNlbnNvci5jb2ZmZWUiLCIuLi8uLi8uLi8uLi8uLi9Vc2Vycy90aHJlZXdvcmQvdG95L2dpdGh1Yi9mcmFtZXItbW9kdWxlcy9zZW5zb3IuZnJhbWVyLzM2MFZpZXdlci5mcmFtZXIvbW9kdWxlcy9PcmllbnRhdGlvblNpbXVsYXRvci5jb2ZmZWUiLCJub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIl0sInNvdXJjZXNDb250ZW50IjpbInJlcXVpcmUgJ1N5c3RlbSdcbk9yaWVudGF0aW9uU2ltdWxhdG9yID0gcmVxdWlyZSAnT3JpZW50YXRpb25TaW11bGF0b3InXG5cbicnJ1xuMzYwIFJvdGF0aW9uIHZpZXdlclxuXG5AYXV0aGVyIGhvLnNcbkBzaW5jZSAyMDE2LjA3LjA4XG4nJydcbmNsYXNzIGV4cG9ydHMuVmlld2VyMzYwIGV4dGVuZHMgTGF5ZXJcblxuXHQjIFZhcmlhYmxlXG5cdGRyYWcgPSA1LjBcblx0ZmxpbmcgPSA1LjBcblx0c2Vuc29yID0gMi4wXG5cblx0c2NlbmVJZHggPSAwXG5cblx0aXNTd2lwZSA9IGZhbHNlXG5cdGlzRmxpbmcgPSBmYWxzZVxuXG5cdGltYWdlcyA9IFtdXG5cdG1heCA9IDBcblxuXHQjIERyYWcgbGV2ZWxcblx0QGRlZmluZSAnZHJhZ0ZyaWN0aW9uJywgQHNpbXBsZVByb3BlcnR5KCdkcmFnRnJpY3Rpb24nLCAxLjApXG5cdCMgRmxpbmcgbGV2ZWxcblx0QGRlZmluZSAnZmxpbmdGcmljdGlvbicsIEBzaW1wbGVQcm9wZXJ0eSgnZmxpbmdGcmljdGlvbicsIDEuMClcblx0IyBTZW5zb3IgbGV2ZWxcblx0QGRlZmluZSAnc2Vuc29yRnJpY3Rpb24nLCBAc2ltcGxlUHJvcGVydHkoJ3NlbnNvckZyaWN0aW9uJywgMS4wKVxuXHRcblx0JycnXG5cdG9wdGlvbnM6XG5cdFx0ZHJhZ0ZyaWN0aW9uOiA8TnVtYmVyPiBEcmFnIGZyaWN0aW9uIChkZWZhdWx0OiAxLjApXG5cdFx0ZmxpbmdGcmljdGlvbjogPE51bWJlcj4gRmxpbmcgZnJpY3Rpb24gKGRlZmF1bHQ6IDEuMClcblx0XHRzZW5zb3JGcmljdGlvbjogPE51bWJlcj4gU2Vub3IgZnJpY3Rpb24gKGRlZmF1bHQ6IDEuMClcblx0XHRpbWFnZXM6IDxBcnJheT4gUm90YXRpb24gaW1hZ2UgbGlzdFxuXHQnJydcblx0IyBDb25zdHVyY3RvclxuXHRjb25zdHJ1Y3RvcjogKG9wdGlvbnMgPSB7fSkgLT5cblx0XHRvcHRpb25zLm5hbWUgPz0gXCJWaWV3ZXIzNjBcIlxuXHRcdG9wdGlvbnMuYmFja2dyb3VuZENvbG9yID89IFwiXCJcblx0XHRvcHRpb25zLnogPSAtMjAwXG5cdFx0c3VwZXIgb3B0aW9uc1xuXG5cdFx0I1xuXHRcdG9wdGlvbnMuaW1hZ2VzID89IFtdXG5cblx0XHQjXG5cdFx0QGRyYWdGcmljdGlvbiA9IG9wdGlvbnMuZHJhZ0ZyaWN0aW9uIGlmIG9wdGlvbnMuZHJhZ0ZyaWN0aW9uXG5cdFx0QGZsaW5nRnJpY3Rpb24gPSBvcHRpb25zLmZsaW5nRnJpY3Rpb24gaWYgb3B0aW9ucy5mbGluZ0ZyaWN0aW9uXG5cdFx0QHNlbnNvckZyaWN0aW9uID0gb3B0aW9ucy5zZW5zb3JGcmljdGlvbiBpZiBvcHRpb25zLnNlbnNvckZyaWN0aW9uXG5cdFx0XG5cdFx0IyBMYXllciA6IFZpZXdwb3J0XG5cdFx0QHZpZXdwb3J0ID0gbmV3IExheWVyIFxuXHRcdFx0bmFtZTogJ3ZpZXdwb3J0J1xuXHRcdFx0cG9pbnQ6IEFsaWduLmNlbnRlclxuXHRcdFx0d2lkdGg6IEB3aWR0aCwgaGVpZ2h0OiBAaGVpZ2h0XG5cdFx0XHR6OiAyMDBcblx0XHRcdGJhY2tncm91bmRDb2xvcjogJydcblx0XHRcdHBhcmVudDogQFxuXG5cdFx0IyBMYXllciA6IEtub2Jcblx0XHRAa25vYiA9IG5ldyBMYXllciBuYW1lOiBcIi5rbm9iXCIsIHBvaW50OiAwLCBzaXplOiAwLCBwYXJlbnQ6IEBcblx0XHRAa25vYi5vbiBcImNoYW5nZTp4XCIsIEBvbkNoYW5nZVhcblx0XHRcdFx0XHRcblx0XHQjIEV2ZW50IDogU3RhcnRcblx0XHRAb25Td2lwZVN0YXJ0IChldmVudCkgPT4gXG5cdFx0XHRpc1N3aXBlID0gdHJ1ZVxuXHRcdFx0QGtub2IuYW5pbWF0ZVN0b3AoKVxuXG5cdFx0IyBFdmVudCA6IE1vdmUgXG5cdFx0QG9uU3dpcGUgKGV2ZW50KSA9PiBcblx0XHRcdEBrbm9iLnggKz0gZXZlbnQuZGVsdGEueCAvIChkcmFnIC8gQGRyYWdGcmljdGlvbilcblxuXHRcdCMgRXZlbnQgOiBFbmRcblx0XHRAb25Td2lwZUVuZCAoZXZlbnQpID0+IFxuXHRcdFx0aXNTd2lwZSA9IGZhbHNlXG5cdFx0XHRpc0ZsaW5nID0gdHJ1ZVxuXG5cdFx0XHRAa25vYi5hbmltYXRlXG5cdFx0XHRcdHg6IEBrbm9iLnggKyAoZXZlbnQudmVsb2NpdHkueCAqIChmbGluZyAvIEBmbGluZ0ZyaWN0aW9uKSlcblx0XHRcdFx0b3B0aW9uczpcblx0XHRcdFx0XHR0aW1lOiAuMzVcblx0XHRcdFx0XHRjdXJ2ZTogXCJiZXppZXItY3VydmUoLjAsLjAsLjIsMSlcIlxuXHRcdFx0QGtub2Iub25jZSBFdmVudHMuQW5pbWF0aW9uRW5kLCAtPiBpc0ZsaW5nID0gZmFsc2Vcblx0XHRcblx0XHQjXG5cdFx0QHNldEltYWdlcyhvcHRpb25zLmltYWdlcylcblx0XHRcblx0XHQjIFNlbnNvciA6IERldmljZVxuXHRcdGlmIFV0aWxzLmlzTW9iaWxlKClcblx0XHRcdCMgU2Vuc29yIG1hbmFnZXJcblx0XHRcdHNlbnNvck1hbmFnZXIgPSBnZXRTeXN0ZW1TZXJ2aWNlKENvbnRleHQuU0VOU09SX1NFUlZJQ0UpXG5cdFx0XHQjIFNlbnNvciA6IE9yaWVudGF0aW9uXG5cdFx0XHRzZW5zb3JPcmllbnRhdGlvbiA9IHNlbnNvck1hbmFnZXIuZ2V0RGVmYXVsdFNlbnNvcihTZW5zb3IuVFlQRV9PUklFTlRBVElPTilcblx0XHRcdGlmIHNlbnNvck9yaWVudGF0aW9uXG5cdFx0XHRcdHNlbnNvck9yaWVudGF0aW9uLnNtb290aCA9IDAuMVxuXHRcdFx0XHRzZW5zb3JPcmllbnRhdGlvbi5vbkNoYW5nZSAoZXZlbnQpID0+XG5cdFx0XHRcdFx0IyBBbmkgOiBWaWV3cG9ydCA6IFJvdGF0aW9uIFggYW5kIFlcblx0XHRcdFx0XHRAdmlld3BvcnQuYW5pbWF0ZVN0b3AoKVxuXHRcdFx0XHRcdEB2aWV3cG9ydC5hbmltYXRlIFxuXHRcdFx0XHRcdFx0cm90YXRpb25YOiBVdGlscy5tb2R1bGF0ZShldmVudC5iZXRhLCBbLTE1LCA0MF0sIFstNSwgNV0sIHRydWUpXG5cdFx0XHRcdFx0XHRyb3RhdGlvblk6IFV0aWxzLm1vZHVsYXRlKGV2ZW50LmdhbW1hLCBbLTEwLCAxMF0sIFstMTUsIDE1XSwgdHJ1ZSlcblx0XHRcdFx0XHRcdG9wdGlvbnM6IGN1cnZlOiBcImVhc2VcIiwgdGltZTogLjJcblx0XHRcdFx0XHRcblx0XHRcdFx0XHQjIEFuaSA6IFZpZXdwb3J0IDogMzYwdmlld1xuXHRcdFx0XHRcdGlmICFpc1N3aXBlICYmICFpc0ZsaW5nXG5cdFx0XHRcdFx0XHRAa25vYi5hbmltYXRlU3RvcCgpXG5cdFx0XHRcdFx0XHRAa25vYi5hbmltYXRlXG5cdFx0XHRcdFx0XHRcdHg6IEBrbm9iLnggKyAoZXZlbnQuZ2FtbWEgLyAoc2Vuc29yIC8gQHNlbnNvckZyaWN0aW9uKSlcblx0XHRcdFx0XHRcdFx0b3B0aW9uczogY3VydmU6IFwiZWFzZVwiLCB0aW1lOiAuMjVcblx0XHQjIFNlbnNvciA6IFNpbXVsYXRvclxuXHRcdGVsc2UgaWYgVXRpbHMuaXNEZXNrdG9wKClcblx0XHRcdE9yaWVudGF0aW9uU2ltdWxhdG9yLm9uVGlsdCAoZ2FtbWEpID0+XG5cdFx0XHRcdGZpbHRlckdhbW1hID0gVXRpbHMubW9kdWxhdGUoZ2FtbWEsIFstMSwgMV0sIFstNSwgNV0sIHRydWUpXG5cdFx0XHRcdFxuXHRcdFx0XHRAdmlld3BvcnQuYW5pbWF0ZVN0b3AoKVxuXHRcdFx0XHRAdmlld3BvcnQuYW5pbWF0ZVxuXHRcdFx0XHRcdCMgcm90YXRpb25YOiBVdGlscy5tb2R1bGF0ZShldmVudC5iZXRhLCBbLTE1LCA0MF0sIFstNSwgNV0sIHRydWUpXG5cdFx0XHRcdFx0cm90YXRpb25ZOiBVdGlscy5tb2R1bGF0ZShmaWx0ZXJHYW1tYSwgWy0xMCwgMTBdLCBbLTE1LCAxNV0sIHRydWUpXG5cdFx0XHRcdFx0b3B0aW9uczogY3VydmU6IFwiZWFzZVwiLCB0aW1lOiAuMlxuXG5cdFx0XHRcdGlmICFpc1N3aXBlICYmICFpc0ZsaW5nXG5cdFx0XHRcdFx0QGtub2IuYW5pbWF0ZVN0b3AoKVxuXHRcdFx0XHRcdEBrbm9iLmFuaW1hdGVcblx0XHRcdFx0XHRcdHg6IEBrbm9iLnggKyBmaWx0ZXJHYW1tYVxuXHRcdFx0XHRcdFx0b3B0aW9uczogY3VydmU6IFwiZWFzZVwiLCB0aW1lOiAuMjVcblxuXHQjIEV2ZW50IDogQ2hhbmdlXG5cdG9uQ2hhbmdlWDogPT4gXG5cdFx0cmV0dXJuIGlmIF8uaXNFbXB0eShpbWFnZXMpXG5cblx0XHRpZiBAdmlld3BvcnQgYW5kIEBrbm9iXG5cdFx0XHRAdmlld3BvcnQuaW1hZ2UgPSBpbWFnZXNbY29udmVydEluZGV4KEBrbm9iLngpXSBcblxuXHQjIFNldCBpbWFnZXNcblx0c2V0SW1hZ2VzOiAodmFsdWUgPSBbXSkgLT5cblx0XHRyZXR1cm4gaWYgXy5pc0VtcHR5KHZhbHVlKVxuXG5cdFx0aW1hZ2VzID0gdmFsdWVcblx0XHRtYXggPSBpbWFnZXMubGVuZ3RoIC0gMVxuXG5cdFx0QG9uQ2hhbmdlWCgpXG5cblx0IyBSZXNldCA6IHBvc2l0aW9uIGZpcnN0IGluZGV4XG5cdHJlc2V0OiAoKSAtPiBAa25vYi54ID0gMCBpZiBAa25vYlxuXG5cdCMgQ29udmVydCBpbmRleCBmb3IgaW5maW5pdHlcblx0Y29udmVydEluZGV4ID0gKGluZGV4KSAtPiBcblx0XHRpZHggPSBpbmRleCAlIG1heFxuXHRcdGlkeCA9IG1heCArIGlkeCBpZiBpZHggPCAwXG5cdFx0cmV0dXJuIHBhcnNlSW50KGlkeCkiLCJyZXF1aXJlICdTeXN0ZW0tU2Vuc29yJ1xuXG4nJydcblN5c3RlbVxuXG5AYXV0aGVyIGhvLnNcbkBkYXRlIDIwMTYuMTAuMDRcbicnJ1xuXG4jIENvbnRleHRcbkNvbnRleHQgPSB7fVxuIyBDb250ZXh0IDogU2Vuc29yXG5Db250ZXh0LlNFTlNPUl9TRVJWSUNFID0gXCJjb250ZXh0LlNFTlNPUl9TRVJWSUNFXCJcblxuIyBHZXQgc3lzdGVtIHNlcnZpY2VcbmdldFN5c3RlbVNlcnZpY2UgPSAoc2VydmljZSktPlxuXHRzd2l0Y2ggc2VydmljZVxuXHRcdCMgU2Vuc29yXG5cdFx0d2hlbiBDb250ZXh0LlNFTlNPUl9TRVJWSUNFIHRoZW4gcmV0dXJuIFNlbnNvck1hbmFnZXJcblx0XG5cbiNcbmlmIHdpbmRvd1xuXHR3aW5kb3cuQ29udGV4dCA9IENvbnRleHQgXG5cdHdpbmRvdy5nZXRTeXN0ZW1TZXJ2aWNlID0gZ2V0U3lzdGVtU2VydmljZVxuXHQiLCInJydcblNlbnNvclxuXG5AYXV0aGVyIGhvLnNcbkBkYXRlIDIwMTYuMTAuMDRcbicnJ1xuXG4jIFNlbnNvciBtYW5hZ2VyXG5TZW5zb3JNYW5hZ2VyID0ge31cbiMgU2Vuc29yIG1hbmFnZXIgOiBHZXQgZGVmYXVsdCBzZW5zb3JcblNlbnNvck1hbmFnZXIuZ2V0RGVmYXVsdFNlbnNvciA9ICh0eXBlKSAtPlxuXHRzd2l0Y2ggdHlwZVxuXHRcdCMgT3JpZW50YXRpb25cblx0XHR3aGVuIFNlbnNvci5UWVBFX09SSUVOVEFUSU9OIHRoZW4gcmV0dXJuIE9yaWVudGF0aW9uLmdldCgpXG5cdFx0IyBNb3Rpb25cblx0XHR3aGVuIFNlbnNvci5UWVBFX01PVElPTiB0aGVuIHJldHVybiBNb3Rpb24uZ2V0KClcblxuIyBTZW5zb3JcbmNsYXNzIFNlbnNvciBleHRlbmRzIEZyYW1lci5CYXNlQ2xhc3Ncblx0IyBTZW5zb3IgdHlwZVxuXHRAVFlQRV9PUklFTlRBVElPTjogXCJzZW5zb3Iub3JpZW50YXRpb25cIlxuXHRAVFlQRV9NT1RJT046IFwic2Vuc29yLm1vdGlvblwiXG5cblx0IyBFdmVudHMgOiBDaGFuZ2Vcblx0RXZlbnRzLkNoYW5nZSA9IFwic2Vuc29yLmNoYW5nZVwiXG5cblx0IyBTbW9vdGhcblx0QGRlZmluZSAnc21vb3RoJywgQHNpbXBsZVByb3BlcnR5KCdzbW9vdGgnLCAxKVxuXG5cdCMgQ29uc3RydWN0b3Jcblx0Y29uc3RydWN0b3I6ICgpIC0+XG5cdFx0c3VwZXJcblxuXHQjIEV2ZW50IGxpc250ZW5lciA6IGNoYW5nZVxuXHRvbkNoYW5nZTogKGNiKSAtPiBAb24gRXZlbnRzLkNoYW5nZSwgY2JcblxuIyBTZW5zb3IgOiBPcmllbnRhdGlvblxuY2xhc3MgT3JpZW50YXRpb24gZXh0ZW5kcyBTZW5zb3JcblxuXHQjIFNpbmdsZXRvblxuXHRpbnN0YW5jZSA9IG51bGxcblx0QGdldDogLT4gXG5cdFx0IyBPcmllbnRhdGlvbiBldmVudCBzdXBwb3J0ZWRcblx0XHRpZiB3aW5kb3cuRGV2aWNlT3JpZW50YXRpb25FdmVudCB0aGVuIGluc3RhbmNlID89IG5ldyBPcmllbnRhdGlvbigpXG5cdFx0IyBOb3Qgc3VwcG9ydGVkXG5cdFx0ZWxzZSBjb25zb2xlLmVycm9yIFwiTm90IHN1cHBvcnRlZFwiLCBcIkRldmljZSBvcmllbnRhdGlvbiBldmVudHMgYXJlIG5vdCBzdXBvcnRlZCBvbiB0aGlzIGRldmljZVwiXG5cblx0XHRpbnN0YW5jZVxuXG5cdCMgVmFsdWVcblx0QGRlZmluZSAnYWxwaGEnLCBAc2ltcGxlUHJvcGVydHkoJ2FscGhhJywgMClcblx0QGRlZmluZSAnYmV0YScsIEBzaW1wbGVQcm9wZXJ0eSgnYmV0YScsIDApXG5cdEBkZWZpbmUgJ2dhbW1hJywgQHNpbXBsZVByb3BlcnR5KCdnYW1tYScsIDApXG5cblx0IyBDb25zdHJ1Y3RvclxuXHRjb25zdHJ1Y3RvcjogKCkgLT5cblx0XHRzdXBlclxuXG5cdFx0IyBFdmVudFxuXHRcdEV2ZW50cy53cmFwKHdpbmRvdykuYWRkRXZlbnRMaXN0ZW5lciBcImRldmljZW9yaWVudGF0aW9uXCIsIChldmVudCkgPT5cblx0XHRcdEBhbHBoYSA9IChldmVudC5hbHBoYSAqIEBzbW9vdGgpICsgKEBhbHBoYSAqICgxLSBAc21vb3RoKSlcblx0XHRcdEBiZXRhID0gKGV2ZW50LmJldGEgKiBAc21vb3RoKSArIChAYmV0YSAqICgxLSBAc21vb3RoKSlcblx0XHRcdEBnYW1tYSA9IChldmVudC5nYW1tYSAqIEBzbW9vdGgpICsgKEBnYW1tYSAqICgxLSBAc21vb3RoKSlcblxuXHRcdFx0b3JpZW50YXRpb24gPSBcblx0XHRcdFx0YWxwaGE6IEBhbHBoYVxuXHRcdFx0XHRiZXRhOiBAYmV0YVxuXHRcdFx0XHRnYW1tYTogQGdhbW1hXG5cdFx0XHRcdGFic29sdXRlOiBldmVudC5hYnNvbHV0ZVxuXG5cdFx0XHRAZW1pdCBFdmVudHMuQ2hhbmdlLCBvcmllbnRhdGlvblxuXG4jIFNlbnNvciA6IE1vdGlvblxuY2xhc3MgTW90aW9uIGV4dGVuZHMgU2Vuc29yXG5cblx0IyBTaW5nbGV0b25cblx0aW5zdGFuY2UgPSBudWxsXG5cdEBnZXQ6IC0+IFxuXHRcdCMgT3JpZW50YXRpb24gZXZlbnQgc3VwcG9ydGVkXG5cdFx0aWYgd2luZG93LkRldmljZU1vdGlvbkV2ZW50IHRoZW4gaW5zdGFuY2UgPz0gbmV3IE1vdGlvbigpXG5cdFx0IyBOb3Qgc3VwcG9ydGVkXG5cdFx0ZWxzZSBjb25zb2xlLmVycm9yIFwiTm90IHN1cHBvcnRlZFwiLCBcIkRldmljZSBtb3Rpb24gZXZlbnRzIGFyZSBub3Qgc3Vwb3J0ZWQgb24gdGhpcyBkZXZpY2VcIlxuXG5cdFx0aW5zdGFuY2VcblxuXHQjIFZhbHVlXG5cdEBkZWZpbmUgJ3gnLCBAc2ltcGxlUHJvcGVydHkoJ3gnLCAwKVxuXHRAZGVmaW5lICd5JywgQHNpbXBsZVByb3BlcnR5KCd5JywgMClcblx0QGRlZmluZSAneicsIEBzaW1wbGVQcm9wZXJ0eSgneicsIDApXG5cdEBkZWZpbmUgJ2d4JywgQHNpbXBsZVByb3BlcnR5KCdneCcsIDApXG5cdEBkZWZpbmUgJ2d5JywgQHNpbXBsZVByb3BlcnR5KCdneScsIDApXG5cdEBkZWZpbmUgJ2d6JywgQHNpbXBsZVByb3BlcnR5KCdneicsIDApXG5cdEBkZWZpbmUgJ2FscGhhJywgQHNpbXBsZVByb3BlcnR5KCdhbHBoYScsIDApXG5cdEBkZWZpbmUgJ2JldGEnLCBAc2ltcGxlUHJvcGVydHkoJ2JldGEnLCAwKVxuXHRAZGVmaW5lICdnYW1tYScsIEBzaW1wbGVQcm9wZXJ0eSgnZ2FtbWEnLCAwKVxuXHRAZGVmaW5lICdpbnRlcnZhbCcsIEBzaW1wbGVQcm9wZXJ0eSgnaW50ZXJ2YWwnLCAwKVxuXG5cblx0IyBDb25zdHJ1Y3RvclxuXHRjb25zdHJ1Y3RvcjogKCkgLT5cblx0XHRzdXBlclxuXG5cdFx0IyBFdmVudFxuXHRcdEV2ZW50cy53cmFwKHdpbmRvdykuYWRkRXZlbnRMaXN0ZW5lciBcImRldmljZW1vdGlvblwiLCAoZXZlbnQpID0+XG5cdFx0XHRAeCA9IChldmVudC5hY2NlbGVyYXRpb24ueCAqIEBzbW9vdGgpICsgKEB4ICogKDEtIEBzbW9vdGgpKVxuXHRcdFx0QHkgPSAoZXZlbnQuYWNjZWxlcmF0aW9uLnkgKiBAc21vb3RoKSArIChAeSAqICgxLSBAc21vb3RoKSlcblx0XHRcdEB6ID0gKGV2ZW50LmFjY2VsZXJhdGlvbi56ICogQHNtb290aCkgKyAoQHogKiAoMS0gQHNtb290aCkpXG5cblx0XHRcdEBneCA9IChldmVudC5hY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5LnggKiBAc21vb3RoKSArIChAZ3ggKiAoMS0gQHNtb290aCkpXG5cdFx0XHRAZ3kgPSAoZXZlbnQuYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eS55ICogQHNtb290aCkgKyAoQGd5ICogKDEtIEBzbW9vdGgpKVxuXHRcdFx0QGd6ID0gKGV2ZW50LmFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHkueiAqIEBzbW9vdGgpICsgKEBneiAqICgxLSBAc21vb3RoKSlcblxuXHRcdFx0QGFscGhhID0gKGV2ZW50LnJvdGF0aW9uUmF0ZS5hbHBoYSAqIEBzbW9vdGgpICsgKEBhbHBoYSAqICgxLSBAc21vb3RoKSlcblx0XHRcdEBiZXRhID0gKGV2ZW50LnJvdGF0aW9uUmF0ZS5iZXRhICogQHNtb290aCkgKyAoQGJldGEgKiAoMS0gQHNtb290aCkpXG5cdFx0XHRAZ2FtbWEgPSAoZXZlbnQucm90YXRpb25SYXRlLmdhbW1hICogQHNtb290aCkgKyAoQGdhbW1hICogKDEtIEBzbW9vdGgpKVxuXG5cdFx0XHRAaW50ZXJ2YWwgPSBldmVudC5pbnRlcnZhbFxuXG5cdFx0XHRtb3Rpb24gPSBcblx0XHRcdFx0YWNjZWxlcmF0aW9uOiB4OiBAeCwgeTogQHksIHo6IEB6XG5cdFx0XHRcdGFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHk6IHg6IEBneCwgeTogQGd5LCB6OiBAZ3pcblx0XHRcdFx0cm90YXRpb25SYXRlOiBhbHBoYTogQGFscGhhLCBiZXRhOiBAYmV0YSwgZ2FtbWE6IEBnYW1tYVxuXHRcdFx0XHRpbnRlcnZhbDogQGludGVydmFsXG5cblx0XHRcdEBlbWl0IEV2ZW50cy5DaGFuZ2UsIG1vdGlvblxuXG4jXG5pZiB3aW5kb3dcblx0d2luZG93LlNlbnNvck1hbmFnZXIgPSBTZW5zb3JNYW5hZ2VyXG5cdHdpbmRvdy5TZW5zb3IgPSBTZW5zb3Jcblx0d2luZG93Lk9yaWVudGF0aW9uID0gT3JpZW50YXRpb25cblx0d2luZG93Lk1vdGlvbiA9IE1vdGlvbiIsIiMjI1xuVGlsdCB0aGUgc2ltdWxhdG9yXG5cbkBhdXRoZXIgaG8uc1xuQGRhdGUgMjAxNi4xMC4wNFxuIyMjXG5PcmllbnRhdGlvblNpbXVsYXRvciA9IHt9XG5PcmllbnRhdGlvblNpbXVsYXRvci5vblRpbHQgPSAoY2IpIC0+XG5cdHJldHVybiB1bmxlc3MgVXRpbHMuaXNEZXNrdG9wKClcblxuXHRFdmVudHMuR2FtbWEgPSBcIk9yaWVudGF0aW9uU2ltdWxhdG9yLmdhbW1hXCJcblxuXHRyeSA9IDEgKiAxLjJcblx0ZHggPSA1MFxuXHRkeiA9IC01XG5cdGRTY2FsZVggPSAuOTZcblx0Z3VpZGVEeCA9IDMwXG5cblx0IyBTZXQgcGVyc3BlY3RpdmVcblx0RnJhbWVyLkRldmljZS5oYW5kcy5wZXJzcGVjdGl2ZSA9IDEwMCAqIDJcblx0RnJhbWVyLkRldmljZS5oYW5kcy56ID0gMTAwXG5cblx0IyBWaWV3XG5cdF9sZWZ0ID0gbmV3IExheWVyXG5cdFx0bmFtZTogJy5sZWZ0J1xuXHRcdHdpZHRoOiBGcmFtZXIuRGV2aWNlLmJhY2tncm91bmQud2lkdGggLyAyLCBoZWlnaHQ6IEZyYW1lci5EZXZpY2UuYmFja2dyb3VuZC5oZWlnaHRcblx0XHRiYWNrZ3JvdW5kQ29sb3I6ICdyZ2JhKDAsMCwwLDApJ1xuXHRcdHBhcmVudDogRnJhbWVyLkRldmljZS5iYWNrZ3JvdW5kXG5cdF9yaWdodCA9IG5ldyBMYXllclxuXHRcdG5hbWU6ICcucmlnaHQnXG5cdFx0eDogRnJhbWVyLkRldmljZS5iYWNrZ3JvdW5kLndpZHRoIC8gMlxuXHRcdHdpZHRoOiBGcmFtZXIuRGV2aWNlLmJhY2tncm91bmQud2lkdGggLyAyLCBoZWlnaHQ6IEZyYW1lci5EZXZpY2UuYmFja2dyb3VuZC5oZWlnaHRcblx0XHRiYWNrZ3JvdW5kQ29sb3I6ICdyZ2JhKDAsMCwwLDApJ1xuXHRcdHBhcmVudDogRnJhbWVyLkRldmljZS5iYWNrZ3JvdW5kXG5cdF9sZWZ0LmxhYmVsID0gbmV3IExheWVyXG5cdFx0bmFtZTogJy5sZWZ0LmxhYmVsJ1xuXHRcdHg6IEFsaWduLnJpZ2h0KC04MDAgKiBGcmFtZXIuRGV2aWNlLmhhbmRzLnNjYWxlKSwgeTogQWxpZ24uY2VudGVyXG5cdFx0d2lkdGg6IDUwMFxuXHRcdGh0bWw6IFwiPHN0cm9uZz7smbzsqr08L3N0cm9uZz7snLzroZw8YnIvPuq4sOyauOydtOq4sFwiXG5cdFx0Y29sb3I6IFwicmdiYSgwLDAsMCwuMylcIlxuXHRcdHN0eWxlOiB7IGZvbnQ6IFwiMzAwIDEwMHB4LzEgI3tVdGlscy5kZXZpY2VGb250KCl9XCIsIHRleHRBbGlnbjogXCJyaWdodFwiLCBcIi13ZWJraXQtZm9udC1zbW9vdGhpbmdcIjogXCJhbnRpYWxpYXNlZFwiIH1cblx0XHRzY2FsZTogRnJhbWVyLkRldmljZS5oYW5kcy5zY2FsZSwgb3JpZ2luWDogMVxuXHRcdGJhY2tncm91bmRDb2xvcjogXCJ0cmFuc3BhcmVudFwiXG5cdFx0cGFyZW50OiBfbGVmdFxuXHRfbGVmdC5sYWJlbC5jdXN0b20gPSB7IG9YOiBfbGVmdC5sYWJlbC54IH1cblx0X3JpZ2h0LmxhYmVsID0gbmV3IExheWVyXG5cdFx0bmFtZTogJy5yaWdodC5sYWJlbCdcblx0XHR4OiBBbGlnbi5sZWZ0KDgwMCAqIEZyYW1lci5EZXZpY2UuaGFuZHMuc2NhbGUpLCB5OiBBbGlnbi5jZW50ZXJcblx0XHR3aWR0aDogNTAwXG5cdFx0aHRtbDogXCI8c3Ryb25nPuyYpOuluOyqvTwvc3Ryb25nPuycvOuhnDxici8+6riw7Jq47J206riwXCJcblx0XHRjb2xvcjogXCJyZ2JhKDAsMCwwLC4zKVwiXG5cdFx0c3R5bGU6IHsgZm9udDogXCIzMDAgMTAwcHgvMSAje1V0aWxzLmRldmljZUZvbnQoKX1cIiwgdGV4dEFsaWduOiBcImxlZnRcIiwgXCItd2Via2l0LWZvbnQtc21vb3RoaW5nXCI6IFwiYW50aWFsaWFzZWRcIiB9XG5cdFx0c2NhbGU6IEZyYW1lci5EZXZpY2UuaGFuZHMuc2NhbGUsIG9yaWdpblg6IDBcblx0XHRiYWNrZ3JvdW5kQ29sb3I6IFwidHJhbnNwYXJlbnRcIlxuXHRcdHBhcmVudDogX3JpZ2h0XG5cdF9yaWdodC5sYWJlbC5jdXN0b20gPSB7IG9YOiBfcmlnaHQubGFiZWwueCB9XG5cblx0IyMjXG5cdCMgRXZlbnQgOjogVG91Y2ggc3RhcnRcblx0RnJhbWVyLkRldmljZS5iYWNrZ3JvdW5kLm9uVGFwU3RhcnQgLT5cblx0XHRjZW50ZXJYID0gRnJhbWVyLkRldmljZS5iYWNrZ3JvdW5kLndpZHRoIC8gMlxuXHRcdGlmIGV2ZW50LnBvaW50LnggPCBjZW50ZXJYXG5cdFx0XHRGcmFtZXIuRGV2aWNlLmhhbmRzSW1hZ2VMYXllci5hbmltYXRlIHByb3BlcnRpZXM6IHsgeDogQWxpZ24uY2VudGVyKGR4KSwgcm90YXRpb25ZOiAtcnksIHo6IGR6LCBzY2FsZVg6IGRTY2FsZVggfVxuXHRcdFx0RnJhbWVyLkRldmljZS5waG9uZS5hbmltYXRlIHByb3BlcnRpZXM6IHsgeDogQWxpZ24uY2VudGVyKGR4KSwgcm90YXRpb25ZOiAtcnksIHo6IGR6LCBzY2FsZVg6IGRTY2FsZVggfVxuXHRcdGVsc2Vcblx0XHRcdEZyYW1lci5EZXZpY2UuaGFuZHNJbWFnZUxheWVyLmFuaW1hdGUgcHJvcGVydGllczogeyB4OiBBbGlnbi5jZW50ZXIoLWR4KSwgcm90YXRpb25ZOiByeSwgejogZHosIHNjYWxlWDogZFNjYWxlWCB9XG5cdFx0XHRGcmFtZXIuRGV2aWNlLnBob25lLmFuaW1hdGUgcHJvcGVydGllczogeyB4OiBBbGlnbi5jZW50ZXIoLWR4KSwgcm90YXRpb25ZOiByeSwgejogZHosIHNjYWxlWDogZFNjYWxlWCB9XG5cblx0IyBFdmVudCA6OiBUb3VjaCBlbmRcblx0RnJhbWVyLkRldmljZS5iYWNrZ3JvdW5kLm9uVGFwRW5kIC0+XG5cdFx0RnJhbWVyLkRldmljZS5oYW5kc0ltYWdlTGF5ZXIuYW5pbWF0ZSBwcm9wZXJ0aWVzOiB7IHg6IEFsaWduLmNlbnRlciwgcm90YXRpb25YOiAwLCByb3RhdGlvblk6IDAsIHo6IDAsIHNjYWxlWDogMSB9XG5cdFx0RnJhbWVyLkRldmljZS5waG9uZS5hbmltYXRlIHByb3BlcnRpZXM6IHsgeDogQWxpZ24uY2VudGVyLCByb3RhdGlvblg6IDAsIHJvdGF0aW9uWTogMCwgejogMCwgc2NhbGVYOiAxIH1cblx0IyMjXG5cblx0VXRpbHMuaW50ZXJ2YWwgLjEsIC0+XG5cdFx0Y2IoVXRpbHMubW9kdWxhdGUoRnJhbWVyLkRldmljZS5waG9uZS5yb3RhdGlvblksIFstcnksIHJ5XSwgWy0xLCAxXSwgdHJ1ZSksIEApID8gY2JcblxuXHQjIEV2ZW50IDo6IENoYW5nZVxuXHQjIEZyYW1lci5EZXZpY2UucGhvbmUub24gXCJjaGFuZ2U6cm90YXRpb25ZXCIsIC0+XG5cdFx0IyBDYWxsYmFja1xuXHRcdCMgY2IoVXRpbHMubW9kdWxhdGUoRnJhbWVyLkRldmljZS5waG9uZS5yb3RhdGlvblksIFstcnksIHJ5XSwgWy0xLCAxXSwgdHJ1ZSksIEApID8gY2JcblxuXHRGcmFtZXIuRGV2aWNlLmJhY2tncm91bmQub24gXCJjaGFuZ2U6c2l6ZVwiLCAtPlxuXHRcdF9sZWZ0LnByb3BzID0gXG5cdFx0XHR3aWR0aDogRnJhbWVyLkRldmljZS5iYWNrZ3JvdW5kLndpZHRoIC8gMiwgaGVpZ2h0OiBGcmFtZXIuRGV2aWNlLmJhY2tncm91bmQuaGVpZ2h0XG5cdFx0X3JpZ2h0LnByb3BzID0gXG5cdFx0XHR4OiBGcmFtZXIuRGV2aWNlLmJhY2tncm91bmQud2lkdGggLyAyXG5cdFx0XHR3aWR0aDogRnJhbWVyLkRldmljZS5iYWNrZ3JvdW5kLndpZHRoIC8gMiwgaGVpZ2h0OiBGcmFtZXIuRGV2aWNlLmJhY2tncm91bmQuaGVpZ2h0XG5cblx0XHRfbGVmdC5sYWJlbC5wcm9wcyA9XG5cdFx0XHR4OiBBbGlnbi5yaWdodCgtODAwICogRnJhbWVyLkRldmljZS5oYW5kcy5zY2FsZSksIHk6IEFsaWduLmNlbnRlclxuXHRcdFx0c2NhbGU6IEZyYW1lci5EZXZpY2UuaGFuZHMuc2NhbGVcblx0XHRfbGVmdC5sYWJlbC5jdXN0b20gPSB7IG9YOiBfbGVmdC5sYWJlbC54IH1cblx0XHRfcmlnaHQubGFiZWwucHJvcHMgPVxuXHRcdFx0eDogQWxpZ24ubGVmdCg4MDAgKiBGcmFtZXIuRGV2aWNlLmhhbmRzLnNjYWxlKSwgeTogQWxpZ24uY2VudGVyXG5cdFx0XHRzY2FsZTogRnJhbWVyLkRldmljZS5oYW5kcy5zY2FsZVxuXHRcdF9yaWdodC5sYWJlbC5jdXN0b20gPSB7IG9YOiBfcmlnaHQubGFiZWwueCB9XG5cblx0aXNMZWZ0QW5pID0gaXNCYWNrQW5pID0gaXNSaWdodEFuaSA9IGZhbHNlXG5cdFxuXHRvbk1vdXNlT3ZlciA9IC0+IFxuXHRcdGlmIEBuYW1lIGlzIFwiLmxlZnRcIiB0aGVuIHggPSBAY2hpbGRyZW5bMF0uY3VzdG9tLm9YIC0gZ3VpZGVEeCBlbHNlIHggPSBAY2hpbGRyZW5bMF0uY3VzdG9tLm9YICsgZ3VpZGVEeFxuXHRcdEBjaGlsZHJlblswXS5hbmltYXRlIHByb3BlcnRpZXM6IHsgeDogeCB9XG5cblx0b25Nb3VzZU91dCA9IC0+XG5cdFx0QGNoaWxkcmVuWzBdLmFuaW1hdGUgcHJvcGVydGllczogeyB4OiBAY2hpbGRyZW5bMF0uY3VzdG9tLm9YIH1cblxuXHRcdGlmIEZyYW1lci5EZXZpY2UucGhvbmUucm90YXRpb25ZIGlzbnQgMCBhbmQgIWlzQmFja0FuaVxuXHRcdFx0aXNMZWZ0QW5pID0gZmFsc2Vcblx0XHRcdGlzQmFja0FuaSA9IHRydWVcblx0XHRcdGlzUmlnaHRBbmkgPSBmYWxzZVxuXHRcdFx0RnJhbWVyLkRldmljZS5oYW5kc0ltYWdlTGF5ZXIuYW5pbWF0ZSBwcm9wZXJ0aWVzOiB7IHg6IEFsaWduLmNlbnRlciwgcm90YXRpb25YOiAwLCByb3RhdGlvblk6IDAsIHo6IDAsIHNjYWxlWDogMSB9XG5cdFx0XHRGcmFtZXIuRGV2aWNlLnBob25lLmFuaW1hdGUgcHJvcGVydGllczogeyB4OiBBbGlnbi5jZW50ZXIsIHJvdGF0aW9uWDogMCwgcm90YXRpb25ZOiAwLCB6OiAwLCBzY2FsZVg6IDEgfVxuXHRcdFx0RnJhbWVyLkRldmljZS5waG9uZS5vbkFuaW1hdGlvbkVuZCBjYWxsYmFjayA9IC0+XG5cdFx0XHRcdGlzQmFja0FuaSA9IGZhbHNlXG5cdFx0XHRcdEZyYW1lci5EZXZpY2UucGhvbmUub2ZmIEV2ZW50cy5BbmltYXRpb25FbmQsIGNhbGxiYWNrXG5cblx0X2xlZnQub25Nb3VzZU92ZXIgb25Nb3VzZU92ZXJcblx0X2xlZnQub25Nb3VzZU91dCBvbk1vdXNlT3V0XG5cdF9yaWdodC5vbk1vdXNlT3ZlciBvbk1vdXNlT3ZlclxuXHRfcmlnaHQub25Nb3VzZU91dCBvbk1vdXNlT3V0XG5cblx0b25Ub3VjaE1vdmUgPSAoX2R4LCBfcnkpIC0+XG5cdFx0aWYgRnJhbWVyLkRldmljZS5waG9uZS5yb3RhdGlvblkgaXNudCBfcnkgYW5kICEoaWYgX3J5IGlzIC1yeSB0aGVuIGlzTGVmdEFuaSBlbHNlIGlzUmlnaHRBbmkpXG5cdFx0XHRpc0xlZnRBbmkgPSBpc0JhY2tBbmkgPSBpc1JpZ2h0QW5pID0gZmFsc2Vcblx0XHRcdGlmIF9yeSBpcyAtcnkgdGhlbiBpc0xlZnRBbmkgPSB0cnVlIGVsc2UgaXNSaWdodEFuaSA9IHRydWVcblxuXHRcdFx0RnJhbWVyLkRldmljZS5oYW5kc0ltYWdlTGF5ZXIuYW5pbWF0ZSBwcm9wZXJ0aWVzOiB7IHg6IEFsaWduLmNlbnRlcihfZHgpLCByb3RhdGlvblk6IF9yeSwgejogZHosIHNjYWxlWDogZFNjYWxlWCB9XG5cdFx0XHRGcmFtZXIuRGV2aWNlLnBob25lLmFuaW1hdGUgcHJvcGVydGllczogeyB4OiBBbGlnbi5jZW50ZXIoX2R4KSwgcm90YXRpb25ZOiBfcnksIHo6IGR6LCBzY2FsZVg6IGRTY2FsZVggfVxuXG5cdF9sZWZ0Lm9uVG91Y2hNb3ZlIC0+IG9uVG91Y2hNb3ZlKGR4LCAtcnksIGlzTGVmdEFuaSlcblx0X3JpZ2h0Lm9uVG91Y2hNb3ZlIC0+IG9uVG91Y2hNb3ZlKC1keCwgcnksIGlzUmlnaHRBbmkpXG5cbm1vZHVsZS5leHBvcnRzID0gT3JpZW50YXRpb25TaW11bGF0b3IgaWYgbW9kdWxlP1xuRnJhbWVyLk9yaWVudGF0aW9uU2ltdWxhdG9yID0gT3JpZW50YXRpb25TaW11bGF0b3IiLCIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUlBQTs7QURBQTs7Ozs7O0FBQUEsSUFBQTs7QUFNQSxvQkFBQSxHQUF1Qjs7QUFDdkIsb0JBQW9CLENBQUMsTUFBckIsR0FBOEIsU0FBQyxFQUFEO0FBQzdCLE1BQUE7RUFBQSxJQUFBLENBQWMsS0FBSyxDQUFDLFNBQU4sQ0FBQSxDQUFkO0FBQUEsV0FBQTs7RUFFQSxNQUFNLENBQUMsS0FBUCxHQUFlO0VBRWYsRUFBQSxHQUFLLENBQUEsR0FBSTtFQUNULEVBQUEsR0FBSztFQUNMLEVBQUEsR0FBSyxDQUFDO0VBQ04s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
