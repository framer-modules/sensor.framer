# 모듈
{Lenticular} = require 'Lenticular'
# 생성
lenticular = new Lenticular
	width: 750, height: 1334
	backgroundColor: "white"


lenticular.setDefault new Layer width: 750, height: 1334, image: "images/before.jpg"
lenticular.addScene new Layer(width: 750, height: 1334, image: "images/after.jpg")
	