#!/usr/bin/python
#
# FormatCameraTimeline.py
#
# Reads a JSON List of CameraAngle JSON objects and condenses them into a timeline for ScrolLScene

import sys
import json5
import re

#Make sure we have an appropriate amount of args
if (len(sys.argv) < 2):
    print("Script requires at least one argument (.JSON file) ")
    exit(1)
    
#Go through each argument
for i in range(1, len(sys.argv)):
    filePath = sys.argv[i]
    print("Reading '" + filePath + "'")
    
    #Read the file and load it as JSON
    f = open(filePath, 'r')
    data = json5.load(f)
    f.close()

    #Set up our values to append to
    pos_x = []
    pos_y = []
    pos_z = []
    qua_x = []
    qua_y = []
    qua_z = []
    qua_w = []
    orT_x = []
    orT_y = []
    orT_z = []
       
    #Iterate through each angle and append our values
    for angle in data:
        pos_x.append(angle['position']['x'])
        pos_y.append(angle['position']['y'])
        pos_z.append(angle['position']['z'])
        qua_x.append(angle['quaternion']['_x'])
        qua_y.append(angle['quaternion']['_y'])
        qua_z.append(angle['quaternion']['_z'])
        qua_w.append(angle['quaternion']['_w'])
        orT_x.append(angle['orbitTarget']['x'])
        orT_y.append(angle['orbitTarget']['y'])
        orT_z.append(angle['orbitTarget']['z'])

    #Here's our timeline object
    timeline = {
        "position": {
            'x': pos_x,
            'y': pos_y,
            'z': pos_z
        },
        "quaternion": {
            '_x': qua_x,
            '_y': qua_y,
            '_z': qua_z,
            '_w': qua_w
        },
        "orbitTarget": {
            'x': orT_x,
            'y': orT_y,
            'z': orT_z
        }
    }

    f2 = open(filePath + "_combined", 'w')
    s = json5.dumps(timeline) #Dump json into a string

    #Apply regex so that we don't just have a json but a easily copyable file
    regex0 = r'((: [{])|(\], )|(}, ))' #indent JSON
    regex1 = r'((\")|(\},)|(\{)|(}))' #remove unecessary stuff
    s = re.sub(regex0, '\g<0>\n', s) 
    s = re.sub(regex1, '',s)

    f2.write(s)
    f2.close()
    print("Wrote to '" + filePath + "_combined'")

print( "Complete")