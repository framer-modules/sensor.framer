require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"System-Sensor":[function(require,module,exports){
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZnJhbWVyLm1vZHVsZXMuanMiLCJzb3VyY2VzIjpbIi4uL21vZHVsZXMvU3lzdGVtLmNvZmZlZSIsIi4uL21vZHVsZXMvU3lzdGVtLVNlbnNvci5jb2ZmZWUiLCJub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIl0sInNvdXJjZXNDb250ZW50IjpbInJlcXVpcmUgJ1N5c3RlbS1TZW5zb3InXG5cbicnJ1xuU3lzdGVtXG5cbkBhdXRoZXIgaG8uc1xuQGRhdGUgMjAxNi4xMC4wNFxuJycnXG5cbiMgQ29udGV4dFxuQ29udGV4dCA9IHt9XG4jIENvbnRleHQgOiBTZW5zb3JcbkNvbnRleHQuU0VOU09SX1NFUlZJQ0UgPSBcImNvbnRleHQuU0VOU09SX1NFUlZJQ0VcIlxuXG4jIEdldCBzeXN0ZW0gc2VydmljZVxuZ2V0U3lzdGVtU2VydmljZSA9IChzZXJ2aWNlKS0+XG5cdHN3aXRjaCBzZXJ2aWNlXG5cdFx0IyBTZW5zb3Jcblx0XHR3aGVuIENvbnRleHQuU0VOU09SX1NFUlZJQ0UgdGhlbiByZXR1cm4gU2Vuc29yTWFuYWdlclxuXHRcblxuI1xuaWYgd2luZG93XG5cdHdpbmRvdy5Db250ZXh0ID0gQ29udGV4dCBcblx0d2luZG93LmdldFN5c3RlbVNlcnZpY2UgPSBnZXRTeXN0ZW1TZXJ2aWNlXG5cdCIsIicnJ1xuU2Vuc29yXG5cbkBhdXRoZXIgaG8uc1xuQGRhdGUgMjAxNi4xMC4wNFxuJycnXG5cbiMgU2Vuc29yIG1hbmFnZXJcblNlbnNvck1hbmFnZXIgPSB7fVxuIyBTZW5zb3IgbWFuYWdlciA6IEdldCBkZWZhdWx0IHNlbnNvclxuU2Vuc29yTWFuYWdlci5nZXREZWZhdWx0U2Vuc29yID0gKHR5cGUpIC0+XG5cdHN3aXRjaCB0eXBlXG5cdFx0IyBPcmllbnRhdGlvblxuXHRcdHdoZW4gU2Vuc29yLlRZUEVfT1JJRU5UQVRJT04gdGhlbiByZXR1cm4gT3JpZW50YXRpb24uZ2V0KClcblx0XHQjIE1vdGlvblxuXHRcdHdoZW4gU2Vuc29yLlRZUEVfTU9USU9OIHRoZW4gcmV0dXJuIE1vdGlvbi5nZXQoKVxuXG4jIFNlbnNvclxuY2xhc3MgU2Vuc29yIGV4dGVuZHMgRnJhbWVyLkJhc2VDbGFzc1xuXHQjIFNlbnNvciB0eXBlXG5cdEBUWVBFX09SSUVOVEFUSU9OOiBcInNlbnNvci5vcmllbnRhdGlvblwiXG5cdEBUWVBFX01PVElPTjogXCJzZW5zb3IubW90aW9uXCJcblxuXHQjIEV2ZW50cyA6IENoYW5nZVxuXHRFdmVudHMuQ2hhbmdlID0gXCJzZW5zb3IuY2hhbmdlXCJcblxuXHQjIFNtb290aFxuXHRAZGVmaW5lICdzbW9vdGgnLCBAc2ltcGxlUHJvcGVydHkoJ3Ntb290aCcsIDEpXG5cblx0IyBDb25zdHJ1Y3RvclxuXHRjb25zdHJ1Y3RvcjogKCkgLT5cblx0XHRzdXBlclxuXG5cdCMgRXZlbnQgbGlzbnRlbmVyIDogY2hhbmdlXG5cdG9uQ2hhbmdlOiAoY2IpIC0+IEBvbiBFdmVudHMuQ2hhbmdlLCBjYlxuXG4jIFNlbnNvciA6IE9yaWVudGF0aW9uXG5jbGFzcyBPcmllbnRhdGlvbiBleHRlbmRzIFNlbnNvclxuXG5cdCMgU2luZ2xldG9uXG5cdGluc3RhbmNlID0gbnVsbFxuXHRAZ2V0OiAtPiBcblx0XHQjIE9yaWVudGF0aW9uIGV2ZW50IHN1cHBvcnRlZFxuXHRcdGlmIHdpbmRvdy5EZXZpY2VPcmllbnRhdGlvbkV2ZW50IHRoZW4gaW5zdGFuY2UgPz0gbmV3IE9yaWVudGF0aW9uKClcblx0XHQjIE5vdCBzdXBwb3J0ZWRcblx0XHRlbHNlIGNvbnNvbGUuZXJyb3IgXCJOb3Qgc3VwcG9ydGVkXCIsIFwiRGV2aWNlIG9yaWVudGF0aW9uIGV2ZW50cyBhcmUgbm90IHN1cG9ydGVkIG9uIHRoaXMgZGV2aWNlXCJcblxuXHRcdGluc3RhbmNlXG5cblx0IyBWYWx1ZVxuXHRAZGVmaW5lICdhbHBoYScsIEBzaW1wbGVQcm9wZXJ0eSgnYWxwaGEnLCAwKVxuXHRAZGVmaW5lICdiZXRhJywgQHNpbXBsZVByb3BlcnR5KCdiZXRhJywgMClcblx0QGRlZmluZSAnZ2FtbWEnLCBAc2ltcGxlUHJvcGVydHkoJ2dhbW1hJywgMClcblxuXHQjIENvbnN0cnVjdG9yXG5cdGNvbnN0cnVjdG9yOiAoKSAtPlxuXHRcdHN1cGVyXG5cblx0XHQjIEV2ZW50XG5cdFx0RXZlbnRzLndyYXAod2luZG93KS5hZGRFdmVudExpc3RlbmVyIFwiZGV2aWNlb3JpZW50YXRpb25cIiwgKGV2ZW50KSA9PlxuXHRcdFx0QGFscGhhID0gKGV2ZW50LmFscGhhICogQHNtb290aCkgKyAoQGFscGhhICogKDEtIEBzbW9vdGgpKVxuXHRcdFx0QGJldGEgPSAoZXZlbnQuYmV0YSAqIEBzbW9vdGgpICsgKEBiZXRhICogKDEtIEBzbW9vdGgpKVxuXHRcdFx0QGdhbW1hID0gKGV2ZW50LmdhbW1hICogQHNtb290aCkgKyAoQGdhbW1hICogKDEtIEBzbW9vdGgpKVxuXG5cdFx0XHRvcmllbnRhdGlvbiA9IFxuXHRcdFx0XHRhbHBoYTogQGFscGhhXG5cdFx0XHRcdGJldGE6IEBiZXRhXG5cdFx0XHRcdGdhbW1hOiBAZ2FtbWFcblx0XHRcdFx0YWJzb2x1dGU6IGV2ZW50LmFic29sdXRlXG5cblx0XHRcdEBlbWl0IEV2ZW50cy5DaGFuZ2UsIG9yaWVudGF0aW9uXG5cbiMgU2Vuc29yIDogTW90aW9uXG5jbGFzcyBNb3Rpb24gZXh0ZW5kcyBTZW5zb3JcblxuXHQjIFNpbmdsZXRvblxuXHRpbnN0YW5jZSA9IG51bGxcblx0QGdldDogLT4gXG5cdFx0IyBPcmllbnRhdGlvbiBldmVudCBzdXBwb3J0ZWRcblx0XHRpZiB3aW5kb3cuRGV2aWNlTW90aW9uRXZlbnQgdGhlbiBpbnN0YW5jZSA/PSBuZXcgTW90aW9uKClcblx0XHQjIE5vdCBzdXBwb3J0ZWRcblx0XHRlbHNlIGNvbnNvbGUuZXJyb3IgXCJOb3Qgc3VwcG9ydGVkXCIsIFwiRGV2aWNlIG1vdGlvbiBldmVudHMgYXJlIG5vdCBzdXBvcnRlZCBvbiB0aGlzIGRldmljZVwiXG5cblx0XHRpbnN0YW5jZVxuXG5cdCMgVmFsdWVcblx0QGRlZmluZSAneCcsIEBzaW1wbGVQcm9wZXJ0eSgneCcsIDApXG5cdEBkZWZpbmUgJ3knLCBAc2ltcGxlUHJvcGVydHkoJ3knLCAwKVxuXHRAZGVmaW5lICd6JywgQHNpbXBsZVByb3BlcnR5KCd6JywgMClcblx0QGRlZmluZSAnZ3gnLCBAc2ltcGxlUHJvcGVydHkoJ2d4JywgMClcblx0QGRlZmluZSAnZ3knLCBAc2ltcGxlUHJvcGVydHkoJ2d5JywgMClcblx0QGRlZmluZSAnZ3onLCBAc2ltcGxlUHJvcGVydHkoJ2d6JywgMClcblx0QGRlZmluZSAnYWxwaGEnLCBAc2ltcGxlUHJvcGVydHkoJ2FscGhhJywgMClcblx0QGRlZmluZSAnYmV0YScsIEBzaW1wbGVQcm9wZXJ0eSgnYmV0YScsIDApXG5cdEBkZWZpbmUgJ2dhbW1hJywgQHNpbXBsZVByb3BlcnR5KCdnYW1tYScsIDApXG5cdEBkZWZpbmUgJ2ludGVydmFsJywgQHNpbXBsZVByb3BlcnR5KCdpbnRlcnZhbCcsIDApXG5cblxuXHQjIENvbnN0cnVjdG9yXG5cdGNvbnN0cnVjdG9yOiAoKSAtPlxuXHRcdHN1cGVyXG5cblx0XHQjIEV2ZW50XG5cdFx0RXZlbnRzLndyYXAod2luZG93KS5hZGRFdmVudExpc3RlbmVyIFwiZGV2aWNlbW90aW9uXCIsIChldmVudCkgPT5cblx0XHRcdEB4ID0gKGV2ZW50LmFjY2VsZXJhdGlvbi54ICogQHNtb290aCkgKyAoQHggKiAoMS0gQHNtb290aCkpXG5cdFx0XHRAeSA9IChldmVudC5hY2NlbGVyYXRpb24ueSAqIEBzbW9vdGgpICsgKEB5ICogKDEtIEBzbW9vdGgpKVxuXHRcdFx0QHogPSAoZXZlbnQuYWNjZWxlcmF0aW9uLnogKiBAc21vb3RoKSArIChAeiAqICgxLSBAc21vb3RoKSlcblxuXHRcdFx0QGd4ID0gKGV2ZW50LmFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHkueCAqIEBzbW9vdGgpICsgKEBneCAqICgxLSBAc21vb3RoKSlcblx0XHRcdEBneSA9IChldmVudC5hY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5LnkgKiBAc21vb3RoKSArIChAZ3kgKiAoMS0gQHNtb290aCkpXG5cdFx0XHRAZ3ogPSAoZXZlbnQuYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eS56ICogQHNtb290aCkgKyAoQGd6ICogKDEtIEBzbW9vdGgpKVxuXG5cdFx0XHRAYWxwaGEgPSAoZXZlbnQucm90YXRpb25SYXRlLmFscGhhICogQHNtb290aCkgKyAoQGFscGhhICogKDEtIEBzbW9vdGgpKVxuXHRcdFx0QGJldGEgPSAoZXZlbnQucm90YXRpb25SYXRlLmJldGEgKiBAc21vb3RoKSArIChAYmV0YSAqICgxLSBAc21vb3RoKSlcblx0XHRcdEBnYW1tYSA9IChldmVudC5yb3RhdGlvblJhdGUuZ2FtbWEgKiBAc21vb3RoKSArIChAZ2FtbWEgKiAoMS0gQHNtb290aCkpXG5cblx0XHRcdEBpbnRlcnZhbCA9IGV2ZW50LmludGVydmFsXG5cblx0XHRcdG1vdGlvbiA9IFxuXHRcdFx0XHRhY2NlbGVyYXRpb246IHg6IEB4LCB5OiBAeSwgejogQHpcblx0XHRcdFx0YWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eTogeDogQGd4LCB5OiBAZ3ksIHo6IEBnelxuXHRcdFx0XHRyb3RhdGlvblJhdGU6IGFscGhhOiBAYWxwaGEsIGJldGE6IEBiZXRhLCBnYW1tYTogQGdhbW1hXG5cdFx0XHRcdGludGVydmFsOiBAaW50ZXJ2YWxcblxuXHRcdFx0QGVtaXQgRXZlbnRzLkNoYW5nZSwgbW90aW9uXG5cbiNcbmlmIHdpbmRvd1xuXHR3aW5kb3cuU2Vuc29yTWFuYWdlciA9IFNlbnNvck1hbmFnZXJcblx0d2luZG93LlNlbnNvciA9IFNlbnNvclxuXHR3aW5kb3cuT3JpZW50YXRpb24gPSBPcmllbnRhdGlvblxuXHR3aW5kb3cuTW90aW9uID0gTW90aW9uIiwiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFFQUE7QURBQTtBQUFBLElBQUEsMENBQUE7RUFBQTs7O0FBUUEsYUFBQSxHQUFnQjs7QUFFaEIsYUFBYSxDQUFDLGdCQUFkLEdBQWlDLFNBQUMsSUFBRDtBQUNoQyxVQUFPLElBQVA7QUFBQSxTQUVNLE1BQU0sQ0FBQyxnQkFGYjtBQUVtQyxhQUFPLFdBQVcsQ0FBQyxHQUFaLENBQUE7QUFGMUMsU0FJTSxNQUFNLENBQUMsV0FKYjtBQUk4QixhQUFPLE1BQU0sQ0FBQyxHQUFQLENBQUE7QUFKckM7QUFEZ0M7O0FBUTNCOzs7RUFFTCxNQUFDLENBQUEsZ0JBQUQsR0FBbUI7O0VBQ25CLE1BQUMsQ0FBQSxXQUFELEdBQWM7O0VBR2QsTUFBTSxDQUFDLE1BQVAsR0FBZ0I7O0VBR2hCLE1BQUMsQ0FBQSxNQUFELENBQVEsUUFBUixFQUFrQixNQUFDLENBQUEsY0FBRCxDQUFnQixRQUFoQixFQUEwQixDQUExQixDQUFsQjs7RUFHYSxnQkFBQTtJQUNaLHlDQUFBLFNBQUE7RUFEWTs7bUJBSWIsUUFBQSxHQUFVLFNBQUMsRUFBRDtXQUFRLElBQUMsQ0FBQSxFQUFELENBQUksTUFBTSxDQUFDLE1BQVgsRUFBbUIsRUFBbkI7RUFBUjs7OztHQWhCVSxNQUFNLENBQUM7O0FBbUJ0QjtBQUdMLE1BQUE7Ozs7RUFBQSxRQUFBLEdBQVc7O0VBQ1gsV0FBQyxDQUFBLEdBQUQsR0FBTSxTQUFBO0lBRUwsSUFBRyxNQUFNLENBQUMsc0JBQVY7O1FBQXNDLFdBQWdCLElBQUEsV0FBQSxDQUFBO09BQXREO0tBQUEsTUFBQTtNQUVLLE9BQU8sQ0FBQyxLQUFSLENBQWMsZUFBZCxFQUErQiwyREFBL0IsRUFGTDs7V0FJQTtFQU5LOztFQVNOLFdBQUMsQ0FBQSxNQUFELENBQVEsT0FBUixFQUFpQixXQUFDLENBQUEsY0FBRCxDQUFnQixPQUFoQixFQUF5QixDQUF6QixDQUFqQjs7RUFDQSxXQUFDLENBQUEsTUFBRCxDQUFRLE1BQVIsRUFBZ0IsV0FBQyxDQUFBLGNBQUQsQ0FBZ0IsTUFBaEIsRUFBd0IsQ0FBeEIsQ0FBaEI7O0VBQ0EsV0FBQyxDQUFBLE1BQUQsQ0FBUSxPQUFSLEVBQWlCLFdBQUMsQ0FBQSxjQUFELENBQWdCLE9BQWhCLEVBQXlCLENBQXpCLENBQWpCOztFQUdhLHFCQUFBO0lBQ1osOENBQUEsU0FBQTtJQUdBLE1BQU0sQ0FBQyxJQUFQLENBQVksTUFBWixDQUFtQixDQUFDLGdCQUFwQixDQUFxQyxtQkFBckMsRUFBMEQsQ0FBQSxTQUFBLEtBQUE7YUFBQSxTQUFDLEtBQUQ7QUFDekQsWUFBQTtRQUFBLEtBQUMsQ0FBQSxLQUFELEdBQVMsQ0FBQyxLQUFLLENBQUMsS0FBTixHQUFjLEtBQUMsQ0FBQSxNQUFoQixDQUFBLEdBQTBCLENBQUMsS0FBQyxDQUFBLEtBQUQsR0FBUyxDQUFDLENBQUEsR0FBRyxLQUFDLENBQUEsTUFBTCxDQUFWO1FBQ25DLEtBQUMsQ0FBQSxJQUFELEdBQVEsQ0FBQyxLQUFLLENBQUMsSUFBTixHQUFhLEtBQUMsQ0FBQSxNQUFmLENBQUEsR0FBeUIsQ0FBQyxLQUFDLENBQUEsSUFBRCxHQUFRLENBQUMsQ0FBQSxHQUFHLEtBQUMsQ0FBQSxNQUFMLENBQVQ7UUFDakMsS0FBQyxDQUFBLEtBQUQsR0FBUyxDQUFDLEtBQUssQ0FBQyxLQUFOLEdBQWMsS0FBQyxDQUFBLE1BQWhCLENBQUEsR0FBMEIsQ0FBQyxLQUFDLENBQUEsS0FBRCxHQUFTLENBQUMsQ0FBQSxHQUFHLEtBQUMsQ0FBQSxNQUFMLENBQVY7UUFFbkMsV0FBQSxHQUNDO1VBQUEsS0FBQSxFQUFPLEtBQUMsQ0FBQSxLQUFSO1VBQ0EsSUFBQSxFQUFNLEtBQUMsQ0FBQSxJQURQO1VBRUEsS0FBQSxFQUFPLEtBQUMsQ0FBQSxLQUZSO1VBR0EsUUFBQSxFQUFVLEtBQUssQ0FBQyxRQUhoQjs7ZUFLRCxLQUFDLENBQUEsSUFBRCxDQUFNLE1BQU0sQ0FBQyxNQUFiLEVBQXFCLFdBQXJCO01BWHlEO0lBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUExRDtFQUpZOzs7O0dBbEJZOztBQW9DcEI7QUFHTCxNQUFBOzs7O0VBQUEsUUFBQSxHQUFXOztFQUNYLE1BQUMsQ0FBQSxHQUFELEdBQU0sU0FBQTtJQUVMLElBQUcsTUFBTSxDQUFDLGlCQUFWOztRQUFpQyxXQUFnQixJQUFBLE1BQUEsQ0FBQTtPQUFqRDtLQUFBLE1BQUE7TUFFSyxPQUFPLENBQUMsS0FBUixDQUFjLGVBQWQsRUFBK0Isc0RBQS9CLEVBRkw7O1dBSUE7RUFOSzs7RUFTTixNQUFDLENBQUEsTUFBRCxDQUFRLEdBQVIsRUFBYSxNQUFDLENBQUEsY0FBRCxDQUFnQixHQUFoQixFQUFxQixDQUFyQixDQUFiOztFQUNBLE1BQUMsQ0FBQSxNQUFELENBQVEsR0FBUixFQUFhLE1BQUMsQ0FBQSxjQUFELENBQWdCLEdBQWhCLEVBQXFCLENBQXJCLENBQWI7O0VBQ0EsTUFBQyxDQUFBLE1BQUQsQ0FBUSxHQUFSLEVBQWEsTUFBQyxDQUFBLGNBQUQsQ0FBZ0IsR0FBaEIsRUFBcUIsQ0FBckIsQ0FBYjs7RUFDQSxNQUFDLENBQUEsTUFBRCxDQUFRLElBQVIsRUFBYyxNQUFDLENBQUEsY0FBRCxDQUFnQixJQUFoQixFQUFzQixDQUF0QixDQUFkOztFQUNBLE1BQUMsQ0FBQSxNQUFELENBQVEsSUFBUixFQUFjLE1BQUMsQ0FBQSxjQUFELENBQWdCLElBQWhCLEVBQXNCLENBQXRCLENBQWQ7O0VBQ0EsTUFBQyxDQUFBLE1BQUQsQ0FBUSxJQUFSLEVBQWMsTUFBQyxDQUFBLGNBQUQsQ0FBZ0IsSUFBaEIsRUFBc0IsQ0FBdEIsQ0FBZDs7RUFDQSxNQUFDLENBQUEsTUFBRCxDQUFRLE9BQVIsRUFBaUIsTUFBQyxDQUFBLGNBQUQsQ0FBZ0IsT0FBaEIsRUFBeUIsQ0FBekIsQ0FBakI7O0VBQ0EsTUFBQyxDQUFBLE1BQUQsQ0FBUSxNQUFSLEVBQWdCLE1BQUMsQ0FBQSxjQUFELENBQWdCLE1BQWhCLEVBQXdCLENBQXhCLENBQWhCOztFQUNBLE1BQUMsQ0FBQSxNQUFELENBQVEsT0FBUixFQUFpQixNQUFDLENBQUEsY0FBRCxDQUFnQixPQUFoQixFQUF5QixDQUF6QixDQUFqQjs7RUFDQSxNQUFDLENBQUEsTUFBRCxDQUFRLFVBQVIsRUFBb0IsTUFBQyxDQUFBLGNBQUQsQ0FBZ0IsVUFBaEIsRUFBNEIsQ0FBNUIsQ0FBcEI7O0VBSWEsZ0JBQUE7SUFDWix5Q0FBQSxTQUFBO0lBR0EsTUFBTSxDQUFDLElBQVAsQ0FBWSxNQUFaLENBQW1CLENBQUMsZ0JBQXBCLENBQXFDLGNBQXJDLEVBQXFELENBQUEsU0FBQSxLQUFBO2FBQUEsU0FBQyxLQUFEO0FBQ3BELFlBQUE7UUFBQSxLQUFDLENBQUEsQ0FBRCxHQUFLLENBQUMsS0FBSyxDQUFDLFlBQVksQ0FBQyxDQUFuQixHQUF1QixLQUFDLENBQUEsTUFBekIsQ0FBQSxHQUFtQyxDQUFDLEtBQUMsQ0FBQSxDQUFELEdBQUssQ0FBQyxDQUFBLEdBQUcsS0FBQyxDQUFBLE1BQUwsQ0FBTjtRQUN4QyxLQUFDLENBQUEsQ0FBRCxHQUFLLENBQUMsS0FBSyxDQUFDLFlBQVksQ0FBQyxDQUFuQixHQUF1QixLQUFDLENBQUEsTUFBekIsQ0FBQSxHQUFtQyxDQUFDLEtBQUMsQ0FBQSxDQUFELEdBQUssQ0FBQyxDQUFBLEdBQUcsS0FBQyxDQUFBLE1BQUwsQ0FBTjtRQUN4QyxLQUFDLENBQUEsQ0FBRCxHQUFLLENBQUMsS0FBSyxDQUFDLFlBQVksQ0FBQyxDQUFuQixHQUF1QixLQUFDLENBQUEsTUFBekIsQ0FBQSxHQUFtQyxDQUFDLEtBQUMsQ0FBQSxDQUFELEdBQUssQ0FBQyxDQUFBLEdBQUcsS0FBQyxDQUFBLE1BQUwsQ0FBTjtRQUV4QyxLQUFDLENBQUEsRUFBRCxHQUFNLENBQUMsS0FBSyxDQUFDLDRCQUE0QixDQUFDLENBQW5DLEdBQXVDLEtBQUMsQ0FBQSxNQUF6QyxDQUFBLEdBQW1ELENBQUMsS0FBQyxDQUFBLEVBQUQsR0FBTSxDQUFDLENBQUEsR0FBRyxLQUFDLENBQUEsTUFBTCxDQUFQO1FBQ3pELEtBQUMsQ0FBQSxFQUFELEdBQU0sQ0FBQyxLQUFLLENBQUMsNEJBQTRCLENBQUMsQ0FBbkMsR0FBdUMsS0FBQyxDQUFBLE1BQXpDLENBQUEsR0FBbUQsQ0FBQyxLQUFDLENBQUEsRUFBRCxHQUFNLENBQUMsQ0FBQSxHQUFHLEtBQUMsQ0FBQSxNQUFMLENBQVA7UUFDekQsS0FBQyxDQUFBLEVBQUQsR0FBTSxDQUFDLEtBQUssQ0FBQyw0QkFBNEIsQ0FBQyxDQUFuQyxHQUF1QyxLQUFDLENBQUEsTUFBekMsQ0FBQSxHQUFtRCxDQUFDLEtBQUMsQ0FBQSxFQUFELEdBQU0sQ0FBQyxDQUFBLEdBQUcsS0FBQyxDQUFBLE1BQUwsQ0FBUDtRQUV6RCxLQUFDLENBQUEsS0FBRCxHQUFTLENBQUMsS0FBSyxDQUFDLFlBQVksQ0FBQyxLQUFuQixHQUEyQixLQUFDLENBQUEsTUFBN0IsQ0FBQSxHQUF1QyxDQUFDLEtBQUMsQ0FBQSxLQUFELEdBQVMsQ0FBQyxDQUFBLEdBQUcsS0FBQyxDQUFBLE1BQUwsQ0FBVjtRQUNoRCxLQUFDLENBQUEsSUFBRCxHQUFRLENBQUMsS0FBSyxDQUFDLFlBQVksQ0FBQyxJQUFuQixHQUEwQixLQUFDLENBQUEsTUFBNUIsQ0FBQSxHQUFzQyxDQUFDLEtBQUMsQ0FBQSxJQUFELEdBQVEsQ0FBQyxDQUFBLEdBQUcsS0FBQyxDQUFBLE1BQUwsQ0FBVDtRQUM5QyxLQUFDLENBQUEsS0FBRCxHQUFTLENBQUMsS0FBSyxDQUFDLFlBQVksQ0FBQyxLQUFuQixHQUEyQixLQUFDLENBQUEsTUFBN0IsQ0FBQSxHQUF1QyxDQUFDLEtBQUMsQ0FBQSxLQUFELEdBQVMsQ0FBQyxDQUFBLEdBQUcsS0FBQyxDQUFBLE1BQUwsQ0FBVjtRQUVoRCxLQUFDLENBQUEsUUFBRCxHQUFZLEtBQUssQ0FBQztRQUVsQixNQUFBLEdBQ0M7VUFBQSxZQUFBLEVBQWM7WUFBQSxDQUFBLEVBQUcsS0FBQyxDQUFBLENBQUo7WUFBTyxDQUFBLEVBQUcsS0FBQyxDQUFBLENBQVg7WUFBYyxDQUFBLEVBQUcsS0FBQyxDQUFBLENBQWxCO1dBQWQ7VUFDQSw0QkFBQSxFQUE4QjtZQUFBLENBQUEsRUFBRyxLQUFDLENBQUEsRUFBSjtZQUFRLENBQUEsRUFBRyxLQUFDLENBQUEsRUFBWjtZQUFnQixDQUFBLEVBQUcsS0FBQyxDQUFBLEVBQXBCO1dBRDlCO1VBRUEsWUFBQSxFQUFjO1lBQUEsS0FBQSxFQUFPLEtBQUMsQ0FBQSxLQUFSO1lBQWUsSUFBQSxFQUFNLEtBQUMsQ0FBQSxJQUF0QjtZQUE0QixLQUFBLEVBQU8sS0FBQyxDQUFBLEtBQXBDO1dBRmQ7VUFHQSxRQUFBLEVBQVUsS0FBQyxDQUFBLFFBSFg7O2VBS0QsS0FBQyxDQUFBLElBQUQsQ0FBTSxNQUFNLENBQUMsTUFBYixFQUFxQixNQUFyQjtNQXJCb0Q7SUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQXJEO0VBSlk7Ozs7R0ExQk87O0FBc0RyQixJQUFHLE1BQUg7RUFDQyxNQUFNLENBQUMsYUFBUCxHQUF1QjtFQUN2QixNQUFNLENBQUMsTUFBUCxHQUFnQjtFQUNoQixNQUFNLENBQUMsV0FBUCxHQUFxQjtFQUNyQixNQUFNLENBQUMsTUFBUCxHQUFnQixPQUpqQjs7Ozs7QUQvSEEsSUFBQTs7QUFBQSxPQUFBLENBQVEsZUFBUjs7QUFFQTs7QUFRQSxPQUFBLEdBQVU7O0FBRVYsT0FBTyxDQUFDLGNBQVIsR0FBeUI7O0FBR3pCLGdCQUFBLEdBQW1CLFNBQUMsT0FBRDtBQUNsQixVQUFPLE9BQVA7QUFBQSxTQUVNLE9BQU8sQ0FBQyxjQUZkO0FBRWtDLGFBQU87QUFGekM7QUFEa0I7O0FBT25CLElBQUcsTUFBSDtFQUNDLE1BQU0sQ0FBQyxPQUFQLEdBQWlCO0VBQ2pCLE1BQU0sQ0FBQyxnQkFBUCxHQUEwQixpQkFGM0IifQ==
