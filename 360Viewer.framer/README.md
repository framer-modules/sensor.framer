# 360° Viewer
A Framer Studio module for 360 degree rotation viewer using mobile sensor  

Demo : https://framer-modules.github.io/sensor.framer/360Viewer.framer  

<br/>

## Preview
![Orientation simulator](screenrecord.gif)

<br/>

## Features
- Multiple browser supported
- 360° object rotation with left / right tilt (Using multiple rotation images)

<br/>

## Installation
Copy the "module" folder and paste it into your prototype folder
> More info about modules for Framer Studio: [FramerJS Docs - Modules](http://framerjs.com/docs/#modules.modules)

<br/>

## Usage
### Viewer360

#### Properties
##### dragFriction
[Number] Friction during drag (default : 1.0)

##### flingFriction
[Number] Friction during Fling (default : 1.0)

##### sensorFriction
[Number] Friction when moving by sensor (default : 1.0)

##### images
[Array] Array of image paths to rotate

#### Method
##### setImages(images)
Set array of image paths to rotate
###### Parameters
- images [Array] : array of image paths
  
##### reset()
Initialize image index of array (first image)

<br/>

## Sample
### Prepare

#### Load rotate image resource
```coffeescript
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
```

#### Set background color
```coffeescript
Screen.backgroundColor = "white"
```

### Use module
#### Basic
```coffeescript
# Load all image resource
preloadAll ->   
    {Viewer360} = require "Viewer360"
    viewer = new Viewer360
        point: Align.center
        width: SIZE.width, height: SIZE.height
        scale: Screen.width / SIZE.width
        images: IMAGES[0].urls
```

**and**  

#### Change images
```coffeescript
# Load all image resource
preloadAll ->   
    {Viewer360} = require "Viewer360"
    viewer = new Viewer360
        point: Align.center
        width: SIZE.width, height: SIZE.height
        scale: Screen.width / SIZE.width
    
    # Layer : Dots
    dotSlot = new Layer backgroundColor: ''
    for image, i in IMAGES
        # Layer : Dot
        dot = new Layer 
            name: "dot_#{i}"
            width: 70, height: 70
            borderRadius: "100%", borderWidth: 1, parent: dotSlot
            clip: true
            backgroundColor: "white"
            custom: image
        dot.x = (dot.width + 24) * i
        
        # Layer : Color
        dot.color = new Layer 
            name: ".color"
            x: Align.center, y:Align.center
            width: 70, height: 70
            image: "images/viewer/#{image.color}"
            backgroundColor: ''
            parent: dot
            
        # Layer : Check
        dot.check = new Layer 
            name: ".check"
            x:Align.center, y:Align.center(-5)
            width: 32, height: 16
            style: borderStyle: "hidden hidden solid solid"
            borderColor: IMAGES[i].checkColor, borderWidth:2
            rotation: -45, 
            shadowX: -.7, shadowY: .7, shadowBlur: .5, shadowSpread: .5, shadowColor: IMAGES[i].checkColor
            opacity: 0
            backgroundColor: ''
            parent: dot
        
        # Selected
        dot.selected = ->
            dot.children[1].animate properties: { opacity: if dot is @ then 1 else 0 }, curve: "spring(500,50,0)", time: .3 for dot in dotSlot.children
            # Set car image
            viewer.setImages @custom.urls
            
        # Event : Click 
        dot.onClick dot.selected
            
    # Properties : Dots
    dotSlot.props = size: dotSlot.contentFrame(), x: Align.center, y: viewer.maxY
    
    #
    dotSlot.children[0].selected()
```
