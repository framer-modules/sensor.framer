###
# content
container = new Layer
	width: Screen.width
	height: Screen.height
	backgroundColor: 'white'
	
# background
# bg = new Layer x: Align.center, y: Align.bottom(10), width: 550, height: 821,image: "images/02.jpg", parent: container, scale: (container.height + 20)/821, originY: 1, blur: 10, opacity: 0.9

# lenticular
lenticular = new Layer x: Align.center, y: Align.center, width: 550, height: 821,image: "images/02.jpg", parent: container, clip: true, scale: (container.height + 20)/821
new Layer x: Align.center, y: Align.center, width: 550, height: 821,image: "images/02.jpg", parent: lenticular
new Layer x: Align.center, y: Align.center, width: 550, height: 821,image: "images/01.jpg", parent: lenticular, opacity: 0

new Layer width: 750, height: 160, image: "images/lenticular_material.png", style: { mixBlendMode : "darken"}, scaleY: lenticular.height/160, originY: 0, parent: lenticular

# Mobile
if Utils.isMobile()
	orien = require "OrientationEvents"
	orien.OrientationEvents()

	Utils.interval .1, ->
		if orien? && orien.orientation?
			gamma = orien.orientation.gamma
			beta  = orien.orientation.beta
			
			opacity = 0
			if (beta >= 40) 
				opacity = if beta < 90 then Utils.modulate(beta, [40, 50], [0, 1], true) else Utils.modulate(beta, [90, 100], [1, 0], true)
			else 
				opacity = if gamma < 0 then Math.abs(Utils.modulate(gamma, [-20, -10], [-1, 0], true)) else Utils.modulate(gamma, [10, 20], [0, 1], true)
				
			lenticular.children[1].animate properties: { opacity: opacity }, curve: "ease", time: .2
			
# Desktop
else if Utils.isDesktop()
	OrientationSimulator = require "OrientationSimulator"
	OrientationSimulator.onTilt (gamma) ->
		lenticular.children[1].opacity = Math.abs(gamma)

require 'System'
sensorManager = getSystemService(Context.SENSOR_SERVICE)
sensor = sensorManager.getDefaultSensor(Sensor.TYPE_MOTION)
if sensor
	sensor.onChange (event) ->
		print event
###

{Lenticular} = require 'Lenticular'

lenticular = new Lenticular
	width: 750, height: 1334
	backgroundColor: "white"


lenticular.setDefault new Layer width: 750, height: 1334, image: "images/before.jpg"
lenticular.addScene new Layer(width: 750, height: 1334, image: "images/after.jpg"), Lenticular.Orientation.Right
	