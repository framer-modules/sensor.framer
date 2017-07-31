require 'System-Sensor'

'''
System

@auther ho.s
@date 2016.10.04
'''

# Context
Context = {}
# Context : Sensor
Context.SENSOR_SERVICE = "context.SENSOR_SERVICE"

# Get system service
getSystemService = (service)->
	switch service
		# Sensor
		when Context.SENSOR_SERVICE then return SensorManager
	

#
if window
	window.Context = Context 
	window.getSystemService = getSystemService
	