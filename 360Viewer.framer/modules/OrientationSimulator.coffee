###
Tilt the simulator

@auther ho.s
@date 2016.10.04
###
OrientationSimulator = {}
OrientationSimulator.onTilt = (cb) ->
	return unless Utils.isDesktop()

	Events.Gamma = "OrientationSimulator.gamma"

	ry = 1 * 1.2
	dx = 50
	dz = -5
	dScaleX = .96
	guideDx = 30

	# Set perspective
	Framer.Device.hands.perspective = 100 * 2
	Framer.Device.hands.z = 100

	# View
	_left = new Layer
		name: '.left'
		width: Framer.Device.background.width / 2, height: Framer.Device.background.height
		backgroundColor: 'rgba(0,0,0,0)'
		parent: Framer.Device.background
	_right = new Layer
		name: '.right'
		x: Framer.Device.background.width / 2
		width: Framer.Device.background.width / 2, height: Framer.Device.background.height
		backgroundColor: 'rgba(0,0,0,0)'
		parent: Framer.Device.background
	_left.label = new Layer
		name: '.left.label'
		x: Align.right(-800 * Framer.Device.hands.scale), y: Align.center
		width: 500
		html: "<strong>왼쪽</strong>으로<br/>기울이기"
		color: "rgba(0,0,0,.3)"
		style: { font: "300 100px/1 #{Utils.deviceFont()}", textAlign: "right", "-webkit-font-smoothing": "antialiased" }
		scale: Framer.Device.hands.scale, originX: 1
		backgroundColor: "transparent"
		parent: _left
	_left.label.custom = { oX: _left.label.x }
	_right.label = new Layer
		name: '.right.label'
		x: Align.left(800 * Framer.Device.hands.scale), y: Align.center
		width: 500
		html: "<strong>오른쪽</strong>으로<br/>기울이기"
		color: "rgba(0,0,0,.3)"
		style: { font: "300 100px/1 #{Utils.deviceFont()}", textAlign: "left", "-webkit-font-smoothing": "antialiased" }
		scale: Framer.Device.hands.scale, originX: 0
		backgroundColor: "transparent"
		parent: _right
	_right.label.custom = { oX: _right.label.x }

	###
	# Event :: Touch start
	Framer.Device.background.onTapStart ->
		centerX = Framer.Device.background.width / 2
		if event.point.x < centerX
			Framer.Device.handsImageLayer.animate properties: { x: Align.center(dx), rotationY: -ry, z: dz, scaleX: dScaleX }
			Framer.Device.phone.animate properties: { x: Align.center(dx), rotationY: -ry, z: dz, scaleX: dScaleX }
		else
			Framer.Device.handsImageLayer.animate properties: { x: Align.center(-dx), rotationY: ry, z: dz, scaleX: dScaleX }
			Framer.Device.phone.animate properties: { x: Align.center(-dx), rotationY: ry, z: dz, scaleX: dScaleX }

	# Event :: Touch end
	Framer.Device.background.onTapEnd ->
		Framer.Device.handsImageLayer.animate properties: { x: Align.center, rotationX: 0, rotationY: 0, z: 0, scaleX: 1 }
		Framer.Device.phone.animate properties: { x: Align.center, rotationX: 0, rotationY: 0, z: 0, scaleX: 1 }
	###

	Utils.interval .1, ->
		cb(Utils.modulate(Framer.Device.phone.rotationY, [-ry, ry], [-1, 1], true), @) ? cb

	# Event :: Change
	# Framer.Device.phone.on "change:rotationY", ->
		# Callback
		# cb(Utils.modulate(Framer.Device.phone.rotationY, [-ry, ry], [-1, 1], true), @) ? cb

	Framer.Device.background.on "change:size", ->
		_left.props = 
			width: Framer.Device.background.width / 2, height: Framer.Device.background.height
		_right.props = 
			x: Framer.Device.background.width / 2
			width: Framer.Device.background.width / 2, height: Framer.Device.background.height

		_left.label.props =
			x: Align.right(-800 * Framer.Device.hands.scale), y: Align.center
			scale: Framer.Device.hands.scale
		_left.label.custom = { oX: _left.label.x }
		_right.label.props =
			x: Align.left(800 * Framer.Device.hands.scale), y: Align.center
			scale: Framer.Device.hands.scale
		_right.label.custom = { oX: _right.label.x }

	isLeftAni = isBackAni = isRightAni = false
	
	onMouseOver = -> 
		if @name is ".left" then x = @children[0].custom.oX - guideDx else x = @children[0].custom.oX + guideDx
		@children[0].animate properties: { x: x }

	onMouseOut = ->
		@children[0].animate properties: { x: @children[0].custom.oX }

		if Framer.Device.phone.rotationY isnt 0 and !isBackAni
			isLeftAni = false
			isBackAni = true
			isRightAni = false
			Framer.Device.handsImageLayer.animate properties: { x: Align.center, rotationX: 0, rotationY: 0, z: 0, scaleX: 1 }
			Framer.Device.phone.animate properties: { x: Align.center, rotationX: 0, rotationY: 0, z: 0, scaleX: 1 }
			Framer.Device.phone.onAnimationEnd callback = ->
				isBackAni = false
				Framer.Device.phone.off Events.AnimationEnd, callback

	_left.onMouseOver onMouseOver
	_left.onMouseOut onMouseOut
	_right.onMouseOver onMouseOver
	_right.onMouseOut onMouseOut

	onTouchMove = (_dx, _ry) ->
		if Framer.Device.phone.rotationY isnt _ry and !(if _ry is -ry then isLeftAni else isRightAni)
			isLeftAni = isBackAni = isRightAni = false
			if _ry is -ry then isLeftAni = true else isRightAni = true

			Framer.Device.handsImageLayer.animate properties: { x: Align.center(_dx), rotationY: _ry, z: dz, scaleX: dScaleX }
			Framer.Device.phone.animate properties: { x: Align.center(_dx), rotationY: _ry, z: dz, scaleX: dScaleX }

	_left.onTouchMove -> onTouchMove(dx, -ry, isLeftAni)
	_right.onTouchMove -> onTouchMove(-dx, ry, isRightAni)

module.exports = OrientationSimulator if module?
Framer.OrientationSimulator = OrientationSimulator