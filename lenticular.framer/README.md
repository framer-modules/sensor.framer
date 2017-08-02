# Lenticular
**For more information on Lenticular, please see [here](https://en.wikipedia.org/wiki/Lenticular_printing)**  
<br/>
2 ~ 3 images lenticular effect

> [Sensor](https://github.com/framer-modules/sensor.framer) and [Simulator](https://github.com/framer-modules/sensor.framer/tree/master/simulator.framer) module is included.  


<br/>

Demo : https://framer-modules.github.io/sensor.framer/lenticular.framer

<br/>

## Preview
### Both
![preview - BOTH](screenrecord-both.gif)
### Left
![preview - LEFT](screenrecord-left.gif)
### Right
![preview - RIGHT](screenrecord-right.gif)

<br/>

## Feature
- Multiple browser supported
- Lenticular effect according to left and right tilt

<br/>

## Installation
Copy the "modules" and "images"  folder and paste it into your prototype folder  
> More info about modules for Framer Studio: [FramerJS Docs - Modules](http://framer.com/docs/#modules.modules)

<br/>

## Usage
### Lenticular
#### Constant
##### Lenticular.Orientation
Tilting direction

###### Lenticular.Orientation.Left
Left
###### Lenticular.Orientation.Right
Right

#### Method
##### setDefault(layer)
Default layer (Include image)
###### Parameters
- layer [[Layer](https://framer.com/docs/#layer.layer)] : layer

##### addScene(layer, orientation
Add other layer
###### Parameters
- layer [[Layer](https://framer.com/docs/#layer.layer)] : layer
- orientation [[Orientation](#orientation)] : tilting direction (default : Lenticular.Orientation.Both)

<br/>

## Sample
```coffeescript
# Module
{Lenticular} = require 'Lenticular'
# Constructor
lenticular = new Lenticular
    width: 750, height: 1334
    backgroundColor: "white"
# set default
lenticular.setDefault new Layer width: 750, height: 1334, image: "images/before.jpg"
# add layer
lenticular.addScene new Layer width: 750, height: 1334, image: "images/after.jpg"
```
