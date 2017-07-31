require 'System'
OrientationSimulator = require 'OrientationSimulator'

'''
360 Rotation viewer

@auther ho.s
@since 2016.07.08
'''
class exports.Viewer360 extends Layer

	# Variable
	drag = 5.0
	fling = 5.0
	sensor = 2.0

	sceneIdx = 0

	isSwipe = false
	isFling = false

	images = []
	max = 0

	# Drag level
	@define 'dragFriction', @simpleProperty('dragFriction', 1.0)
	# Fling level
	@define 'flingFriction', @simpleProperty('flingFriction', 1.0)
	# Sensor level
	@define 'sensorFriction', @simpleProperty('sensorFriction', 1.0)
	
	'''
	options:
		dragFriction: <Number> Drag friction (default: 1.0)
		flingFriction: <Number> Fling friction (default: 1.0)
		sensorFriction: <Number> Senor friction (default: 1.0)
		images: <Array> Rotation image list
	'''
	# Consturctor
	constructor: (options = {}) ->
		options.name ?= "Viewer360"
		options.backgroundColor ?= ""
		options.z = -200
		super options

		#
		options.images ?= []

		#
		@dragFriction = options.dragFriction if options.dragFriction
		@flingFriction = options.flingFriction if options.flingFriction
		@sensorFriction = options.sensorFriction if options.sensorFriction
		
		# Layer : Viewport
		@viewport = new Layer 
			name: 'viewport'
			point: Align.center
			width: @width, height: @height
			z: 200
			backgroundColor: ''
			parent: @

		# Layer : Knob
		@knob = new Layer name: ".knob", point: 0, size: 0, parent: @
		@knob.on "change:x", @onChangeX
					
		# Event : Start
		@onSwipeStart (event) => 
			isSwipe = true
			@knob.animateStop()

		# Event : Move 
		@onSwipe (event) => 
			@knob.x += event.delta.x / (drag / @dragFriction)

		# Event : End
		@onSwipeEnd (event) => 
			isSwipe = false
			isFling = true

			@knob.animate
				x: @knob.x + (event.velocity.x * (fling / @flingFriction))
				options:
					time: .35
					curve: "bezier-curve(.0,.0,.2,1)"
			@knob.once Events.AnimationEnd, -> isFling = false
		
		#
		@setImages(options.images)
		
		# Sensor : Device
		if Utils.isMobile()
			# Sensor manager
			sensorManager = getSystemService(Context.SENSOR_SERVICE)
			# Sensor : Orientation
			sensorOrientation = sensorManager.getDefaultSensor(Sensor.TYPE_ORIENTATION)
			if sensorOrientation
				sensorOrientation.smooth = 0.1
				sensorOrientation.onChange (event) =>
					# Ani : Viewport : Rotation X and Y
					@viewport.animateStop()
					@viewport.animate 
						rotationX: Utils.modulate(event.beta, [-15, 40], [-5, 5], true)
						rotationY: Utils.modulate(event.gamma, [-10, 10], [-15, 15], true)
						options: curve: "ease", time: .2
					
					# Ani : Viewport : 360view
					if !isSwipe && !isFling
						@knob.animateStop()
						@knob.animate
							x: @knob.x + (event.gamma / (sensor / @sensorFriction))
							options: curve: "ease", time: .25
		# Sensor : Simulator
		else if Utils.isDesktop()
			OrientationSimulator.onTilt (gamma) =>
				filterGamma = Utils.modulate(gamma, [-1, 1], [-5, 5], true)
				
				@viewport.animateStop()
				@viewport.animate
					# rotationX: Utils.modulate(event.beta, [-15, 40], [-5, 5], true)
					rotationY: Utils.modulate(filterGamma, [-10, 10], [-15, 15], true)
					options: curve: "ease", time: .2

				if !isSwipe && !isFling
					@knob.animateStop()
					@knob.animate
						x: @knob.x + filterGamma
						options: curve: "ease", time: .25

	# Event : Change
	onChangeX: => 
		return if _.isEmpty(images)

		if @viewport and @knob
			@viewport.image = images[convertIndex(@knob.x)] 

	# Set images
	setImages: (value = []) ->
		return if _.isEmpty(value)

		images = value
		max = images.length - 1

		@onChangeX()

	# Reset : position first index
	reset: () -> @knob.x = 0 if @knob

	# Convert index for infinity
	convertIndex = (index) -> 
		idx = index % max
		idx = max + idx if idx < 0
		return parseInt(idx)