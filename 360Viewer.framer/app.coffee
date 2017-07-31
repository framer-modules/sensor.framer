# Utils : Load image
loadImage = (url, callback, context) ->
	element = new Image
	
	context ?= Framer.CurrentContext
	context.domEventManager.wrap(element).addEventListener "load", (event) -> callback(event)
	context.domEventManager.wrap(element).addEventListener "error", (event) -> callback(event)

	element.src = url
	
# Formatting : Number to digit
Number::toDigit = (digit = 0) -> this.toFixed(digit).slice(1 + this.toString().length, -this.toString().length) + this.toString()

# Information
FOLDER = if Utils.isDesktop() then "desktop" else "mobile"
SIZE = width: 1280, height: 720
IMAGES = [
	{ color: "eq900-ext-color-marble-white.jpg", folder: "eq900_exterior_mar", size: 60, checkColor: "rgba(102,102,102,1)" },
	{ color: "eq900-ext-color-platinum-silver.jpg", folder: "eq900_exterior_pla", size: 60, checkColor: "rgba(102,102,102,1)" },
	{ color: "eq900-ext-color-fine-titanium.jpg", folder: "eq900_exterior_pai", size: 60, checkColor: "rgba(255,255,255,1)" },
	{ color: "eq900-ext-color-cosmo-grey.jpg", folder: "eq900_exterior_gra", size: 60, checkColor: "rgba(255,255,255,1)" },
	{ color: "eq900-ext-color-neptune-blue.jpg", folder: "eq900_exterior_nep", size: 60, checkColor: "rgba(255,255,255,1)" },
	{ color: "eq900-ext-color-onyx-black.jpg", folder: "eq900_exterior_oni", size: 60, checkColor: "rgba(255,255,255,1)" },
]
if Utils.isMobile() then SIZE.width /= 2; SIZE.height /= 2

# Image resource formatting
convertImageUrl = (folder, num) -> "images/viewer/#{FOLDER}/#{folder}/#{folder}_#{num.toDigit(5)}.png"
# Preload
preload = (image, index, loadedCallback) -> 
	image.urls = []
	for i in [0...image.size]
		do (image, i, loadedCallback) ->
			loadImage convertImageUrl(image.folder, i), (event) ->
				image.urls.push event.target.src
				
				if image.size is image.urls.length
					image.urls.sort()
					image.loadComplete = true
					loadedCallback() if loadedCallback
		
# Preload : All
preloadAll = (loadedAllCallback) -> 
	for image, i in IMAGES
		do (image) ->
			preload image, i, ->
				loadCompleteAll = true
				for image in IMAGES
					unless image.loadComplete
						loadCompleteAll = false
						return
				loadedAllCallback() if loadedAllCallback and loadCompleteAll

# Background
Screen.backgroundColor = "white"

# Load all image resource
preloadAll ->	
	{Viewer360} = require "Viewer360"
	viewer = new Viewer360
		point: Align.center
		width: SIZE.width, height: SIZE.height
		scale: Screen.width / SIZE.width
		images: IMAGES[0].urls