require 'System'
OrientationSimulator = require 'OrientationSimulator'

'''
Lenticular

@auther ho.s
@date 2016.10.04
'''
class exports.Lenticular extends Layer
	@Orientation: {}
	@Orientation.Both = "orientation.both"
	@Orientation.Left = "orientation.left"
	@Orientation.Right = "orientation.right"

	# @Orientation: Orientation

	# Constructor
	constructor: (options = {}) ->
		super options

		@contents = new Layer
			name: "contents"
			width: @width, height: @height
			backgroundColor: ""
			parent: @

		@material = new Layer
			name: ".lens"
			width: 750, height: 160
			image: "images/lenticular_material.png"
			style: mixBlendMode : "darken"
			scaleY: @height/160, originY: 0
			backgroundColor: ""
			parent: @

		# Mobile
		if Utils.isMobile()
			sensorManager = getSystemService(Context.SENSOR_SERVICE)
			sensor = sensorManager.getDefaultSensor(Sensor.TYPE_ORIENTATION)
			if sensor
				sensor.smooth = .1
				sensor.onChange (event) =>
					gamma = if event.gamma < 0 then Utils.modulate(event.gamma, [-30, -10], [-1, 0], true) else Utils.modulate(event.gamma, [10, 30], [0, 1], true)
					@toGamma gamma
		# Desktop
		else if Utils.isDesktop()
			OrientationSimulator.onTilt (gamma) => @toGamma gamma

	# Set default scene
	setDefault: (layer) ->
		@addChild layer
		layer.placeBehind @contents

	# Add scene
	addScene: (layer, orientation = Lenticular.Orientation.Both) ->
		layer.opacity = 0
		layer.orientation = orientation
		@contents.addChild layer
	
	# 
	toGamma: (gamma) ->
		for child in @contents.children
			if child.orientation is Lenticular.Orientation.Left
				child.opacity = Math.abs(gamma) if gamma <= 0
			else if child.orientation is Lenticular.Orientation.Right
				child.opacity = gamma if gamma >= 0
			else 
				child.opacity = Math.abs(gamma)
				
			


