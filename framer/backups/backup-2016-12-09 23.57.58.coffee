#
Screen.backgroundColor = "green"

# cube
SIZE = 200	
cube = new Layer
	point: Align.center
	size: SIZE
	rotationY: 0
	rotationX: -30
	style: 
		transformStyle: "preserve-3d"
		"-webkit-transform-style": "preserve-3d"
	backgroundColor: ""
	
cube.draggable.enabled = true
# cube.draggable.speedX = 0
# cube.draggable.speedY = 0
cube.onDrag (e) ->
	@rotationX = -e.clientY/2
	@rotationY = e.clientX/2

properties = 
	size: SIZE
	style: 
		fontSize: "20px", fontWeight: "500", lineHeight: "#{SIZE}px"
		textAlign: "center", textTransform: "uppercase"
		boxShadow: "inset 0 0 30px rgba(0,0,0,0.2)"
	color: "rgba(0,0,0,.5)"
	backgroundColor: "rgba(255,255,255,1.1)"
	parent: cube

front = new Layer _.extend _.clone(properties), 
	html: "front"
	z: 100
back = new Layer _.extend _.clone(properties),
	html: "back"
	z: -100
	rotationY: 180
top = new Layer _.extend _.clone(properties),
	html: "top"
	rotationX: 90
	y: -100
bottom = new Layer _.extend _.clone(properties),
	html: "bottom"
	rotationX: -90
	y: 100
left = new Layer _.extend _.clone(properties),
	html: "left"
	rotationY: -90
	x: -100
right = new Layer _.extend _.clone(properties),
	html: "right"
	rotationY: 90
	x: 100
	
# cube.animate rotationY: 360, options: time: 10, repeat: "Infinity", curve: "linear"

# 모듈
require 'System'
# Sensor manager
sensorManager = getSystemService(Context.SENSOR_SERVICE)
# Sensor : Orientation
sensorOrientation = sensorManager.getDefaultSensor(Sensor.TYPE_ORIENTATION)
# if sensorOrientation
# 	sensorOrientation.onChange (event) ->
# 		cube.rotationX = -event.beta+45
# 		cube.rotationY = event.gamma
		
# Sensor : Motion
sensorMotion = sensorManager.getDefaultSensor(Sensor.TYPE_MOTION)
if sensorMotion
	sensorMotion.smooth = 2
	sensorMotion.onChange (event) ->
		cube.rotationX -= event.rotationRate.gamma
		cube.rotationY += event.rotationRate.beta
