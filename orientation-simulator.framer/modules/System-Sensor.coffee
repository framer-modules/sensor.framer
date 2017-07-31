'''
Sensor

@auther ho.s
@date 2016.10.04
'''

# Sensor manager
SensorManager = {}
# Sensor manager : Get default sensor
SensorManager.getDefaultSensor = (type) ->
	switch type
		# Orientation
		when Sensor.TYPE_ORIENTATION then return Orientation.get()
		# Motion
		when Sensor.TYPE_MOTION then return Motion.get()

# Sensor
class Sensor extends Framer.BaseClass
	# Sensor type
	@TYPE_ORIENTATION: "sensor.orientation"
	@TYPE_MOTION: "sensor.motion"

	# Events : Change
	Events.Change = "sensor.change"

	# Smooth
	@define 'smooth', @simpleProperty('smooth', 1)

	# Constructor
	constructor: () ->
		super

	# Event lisntener : change
	onChange: (cb) -> @on Events.Change, cb

# Sensor : Orientation
class Orientation extends Sensor

	# Singleton
	instance = null
	@get: -> 
		# Orientation event supported
		if window.DeviceOrientationEvent then instance ?= new Orientation()
		# Not supported
		else console.error "Not supported", "Device orientation events are not suported on this device"

		instance

	# Value
	@define 'alpha', @simpleProperty('alpha', 0)
	@define 'beta', @simpleProperty('beta', 0)
	@define 'gamma', @simpleProperty('gamma', 0)

	# Constructor
	constructor: () ->
		super

		# Event
		Events.wrap(window).addEventListener "deviceorientation", (event) =>
			@alpha = (event.alpha * @smooth) + (@alpha * (1- @smooth))
			@beta = (event.beta * @smooth) + (@beta * (1- @smooth))
			@gamma = (event.gamma * @smooth) + (@gamma * (1- @smooth))

			orientation = 
				alpha: @alpha
				beta: @beta
				gamma: @gamma
				absolute: event.absolute

			@emit Events.Change, orientation

# Sensor : Motion
class Motion extends Sensor

	# Singleton
	instance = null
	@get: -> 
		# Orientation event supported
		if window.DeviceMotionEvent then instance ?= new Motion()
		# Not supported
		else console.error "Not supported", "Device motion events are not suported on this device"

		instance

	# Value
	@define 'x', @simpleProperty('x', 0)
	@define 'y', @simpleProperty('y', 0)
	@define 'z', @simpleProperty('z', 0)
	@define 'gx', @simpleProperty('gx', 0)
	@define 'gy', @simpleProperty('gy', 0)
	@define 'gz', @simpleProperty('gz', 0)
	@define 'alpha', @simpleProperty('alpha', 0)
	@define 'beta', @simpleProperty('beta', 0)
	@define 'gamma', @simpleProperty('gamma', 0)
	@define 'interval', @simpleProperty('interval', 0)


	# Constructor
	constructor: () ->
		super

		# Event
		Events.wrap(window).addEventListener "devicemotion", (event) =>
			@x = (event.acceleration.x * @smooth) + (@x * (1- @smooth))
			@y = (event.acceleration.y * @smooth) + (@y * (1- @smooth))
			@z = (event.acceleration.z * @smooth) + (@z * (1- @smooth))

			@gx = (event.accelerationIncludingGravity.x * @smooth) + (@gx * (1- @smooth))
			@gy = (event.accelerationIncludingGravity.y * @smooth) + (@gy * (1- @smooth))
			@gz = (event.accelerationIncludingGravity.z * @smooth) + (@gz * (1- @smooth))

			@alpha = (event.rotationRate.alpha * @smooth) + (@alpha * (1- @smooth))
			@beta = (event.rotationRate.beta * @smooth) + (@beta * (1- @smooth))
			@gamma = (event.rotationRate.gamma * @smooth) + (@gamma * (1- @smooth))

			@interval = event.interval

			motion = 
				acceleration: x: @x, y: @y, z: @z
				accelerationIncludingGravity: x: @gx, y: @gy, z: @gz
				rotationRate: alpha: @alpha, beta: @beta, gamma: @gamma
				interval: @interval

			@emit Events.Change, motion

#
if window
	window.SensorManager = SensorManager
	window.Sensor = Sensor
	window.Orientation = Orientation
	window.Motion = Motion