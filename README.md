# Mobile sensor
A Framer Studio module for deivce sensor to your project.  

[Demo - Orientation Sensor](http://share.framerjs.com/0u4qyj91uvub/)  
[Demo - Motion Sensor](http://share.framerjs.com/9ugkru2ubjy6/)

# Preview
[![Sensor module for Framer](screenrecord.gif)](https://vimeo.com/196395840)  
"Sensor module for Framer - Click to Watch!"

# Features
- Multiple browser supported
- Orientation Sensor 
- Motion Sensor

# Installation
Copy the "module" folder and paste it into your prototype folder
> More info about modules for Framer Studio: [FramerJS Docs - Modules](http://framerjs.com/docs/#modules.modules)

# Usage
## Context
### Constant
##### Context.SENSOR_SERVICE
Sensor service

### Method
##### getSystemService(service)
Get system service

###### Parameters
* service [string] - service

## Sensor
### Constant
##### Sensor.TYPE_ORIENTATION
Orientation sensor

##### Sensor.TYPE_MOTION
Motion sensor

### Properties
##### Sensor.smooth
[Number] Coefficient of sensor transfer value  
> Since the sensor of the device reacts very sensitively, if the value transmitted from the sensor is used as it is, the small movement of the device will cause it to shake or vibrate.
>You can adjust the value to obtain a smoothly tuned value

### Events
#### Change
When the sensor value changes  

`Events.Change` - New sensor value.  

##### Shortcut
**Sensor.onChange(orientation or motion)**

###### Parameters
* orientation [Object] - Orientation values (Orientation Sensor)
    * alpha [Double] - Z-axis rotation
    * beta [Double] - X-axis rotation
    * gamma [Double] - Y-axis rotation

* motion [Object] - Motion values (Motion Sensro)
    * acceleration
        * x [Double]
        * y [Double]
        * z [Double]
    * accelerationIncludingGravity
        * x [Double]
        * y [Double]
        * z [Double]
    * rotationRate
        * alpha [Double]
        * beta [Double]
        * gamma [Double]
        * interval [Double]

> More info about Device Orientation Event : [W3C Device Orientation Event Specification](https://www.w3.org/TR/orientation-event/)

# Sample


## Prepare
### Set background color
```coffeescript
Screen.backgroundColor = "gray"
```

### Create cube
```coffeescript
#
SIZE = 200
# Cube
cube = new Layer
    point: Align.center
    size: SIZE
    rotationY: 0, rotationX: -30
    style: 
        transformStyle: "preserve-3d"
        "-webkit-transform-style": "preserve-3d"
    backgroundColor: ""

# Face properties
properties = 
    size: SIZE
    style: 
        fontSize: "20px", fontWeight: "500", lineHeight: "#{SIZE}px"
        textAlign: "center", textTransform: "uppercase"
        boxShadow: "inset 0 0 30px rgba(0,0,0,0.2)"
    color: "rgba(0,0,0,.5)"
    backgroundColor: "rgba(255,255,255,1.1)"
    parent: cube
    
# Front
front = new Layer _.extend _.clone(properties), html: "front", z: 100
# Back
back = new Layer _.extend _.clone(properties), html: "back", z: -100, rotationY: 180
# Top
top = new Layer _.extend _.clone(properties), html: "top", rotationX: 90, y: -100
# Bottom
bottom = new Layer _.extend _.clone(properties), html: "bottom", rotationX: -90, y: 100
# Left
left = new Layer _.extend _.clone(properties), html: "left", rotationY: -90, x: -100
# RightSe
right = new Layer _.extend _.clone(properties), html: "right", rotationY: 90, x: 100
```

## Use module
### Orientation sensor
```coffeescript
# Module
require 'System'
# Sensor manager
sensorManager = getSystemService(Context.SENSOR_SERVICE)
# Sensor : Orientation
sensorOrientation = sensorManager.getDefaultSensor(Sensor.TYPE_ORIENTATION)
if sensorOrientation
    sensorOrientation.smooth = 0.1
    sensorOrientation.onChange (event) ->
        cube.rotationX = -(event.beta) * 2 + 60
        cube.rotationY = (event.gamma) * 2
```

**or**

### Motion sensor
```coffeescript
# Module
require 'System'
# Sensor manager
sensorManager = getSystemService(Context.SENSOR_SERVICE)
# Sensor : Motion
sensorMotion = sensorManager.getDefaultSensor(Sensor.TYPE_MOTION)
if sensorMotion
    sensorMotion.smooth = 0.005
    sensorMotion.onChange (event) ->
        cube.rotationX -= event.rotationRate.alpha
        cube.rotationY += event.rotationRate.beta
```