#!/usr/bin/python
#
#   AddBehaviourAndObject.py
#   args: ts behaviours (must be default exports)
#   Adds a behaviour and an object when given a .ts file
#       1. Determines if the .ts file contains a _behaviours.ts, makes one if it doesn't have one
#       2. Updates _behaviours.ts with a new entry
#       3. If a new _behaviours was made, add an import and concat
#       4. Creates an keyObject with a cube and the new behaviour
#
#   Also: I don't care about stuff like POSIX, etc..

import pathlib
import sys
from typing import List
import json5
import re

#if true, doesn't stop when the behaviour already exists in _behaviours.ts
IGNORE_EXISTING_BEHAVIOUR = False;
BEHAVIOURS_EXISTS = True; #_behaviours.ts file already exists in directory
BASE_DIR = "../src/desktop/"

#Make sure we have an appropriate amount of args
if (len(sys.argv) < 2):
    print("Script requires at least one argument (.ts/.tsx file) ")
    exit(1)

#Get fileName and search for it
fileName = sys.argv[1]

#Find desired file in BASE_DIR
print("Looking for: '" + fileName + "'...")
searchPath = list(pathlib.Path(BASE_DIR).glob('**/' + fileName))

if (len(searchPath) != 1):
    print("Multiple or no files exist with that name")
    exit(1)
print("Found. Reading..")

filePath = searchPath[0]

f = open(filePath, 'r')
data_class = f.read() #save data into a single string
f.close()

#Regex to find the name of the default exported class
regex0 = r'(export default class (.*?) extends)'
match = re.search(regex0,data_class)
if match == None: 
    print('something didn\'t work right')
    exit(1)

#Set our classname
className = match.group(2) #Based on the regex, the className will be the second group
currentDirectory = pathlib.Path(filePath)
currentDirectory_resolved = currentDirectory.resolve().parent #Resolve all symlinks so we have an exact location of our path

#Check to see if ther eis a _behaviours.ts in the current directory
behaviours = pathlib.Path(str(currentDirectory_resolved) + '/_behaviours.ts')

#Create behaviours file if it does not exist
if not behaviours.exists():
    print("No Behaviours file. Creating..")
    f = open(behaviours, 'w')
    behaviour_doc = "/*\nTHIS CODE IS GENERATED WITH A SCRIPT. DO NOT EDIT.\n*/\nimport SceneObject from '../../../../engine/SceneObject'\n//[BEGIN_BEHAVIOURS]\n//[END_BEHAVIOURS]\n\nvar behaviours : {name:string, factory: Function}[] = [\n]\n\n\nexport { behaviours };"
    f.write(behaviour_doc)
    f.close()
    BEHAVIOURS_EXISTS = False; #set flag to let script write a new entry in behaviours

else:
    print("Found Behaviours file.")

f = open(behaviours)
data_behaviours = f.read()
f.close()

#Check if the behaviour was already added
if (data_behaviours.find(className) != -1) and (not IGNORE_EXISTING_BEHAVIOUR):
    print("Behaviour already exists in _behaviours.ts, exiting")
    exit(1)

#Find import list
regex1 = r'\/\/\[BEGIN_BEHAVIOURS\](.*)\/\/\[END_BEHAVIOURS\]' #Matches everything within the Begin and End comment

match = re.search(regex1,data_behaviours, flags=re.DOTALL)
if match == None:
    print('Something didn\'t work right')
    exit(1)

#With our import list, add our new class in the import spot
raw_match = match.group(1).replace('\n','') #remove newlines
raw_match += "import " + className + " from './" + fileName.split('.')[0] + "';"
raw_match = raw_match.replace(';',';\n') #add newlines
raw_match = "//[BEGIN_BEHAVIOURS]\n" + raw_match + "//[END_BEHAVIOURS]\n" #re-add formatting to beginning of string
data_behaviours = data_behaviours.replace(match.group(0), raw_match) #Finish our change by replacing the section in the original file

#Find factory list
regex2 = r'\}\n\]|\[\n' #Specifically selects either the beginning or the end of the behaviours list

#Find all matches
match = re.findall(regex2,data_behaviours)
if match == None:
    print('Something didn\'t work right')
    exit(1)

#We now pointed at the end of the behaviours list, we'll replace the newline with our text
if (len(match) == 2): chosen_match = 1 #if there was elements already in the list
else: chosen_match = 0 #if there were no elements in the list
raw_match = match[chosen_match]
new_behaviour = ",\n    {\n\tname: '" +className +"',\n\tfactory: (parent : SceneObject|undefined, params:Object|undefined)=>{return new "+className+"(parent,params)}\n    }\n"
raw_match = raw_match.replace('\n',new_behaviour)
data_behaviours = data_behaviours.replace(match[chosen_match], raw_match) #Finish our change by replacing the section in the original file
data_behaviours = data_behaviours.replace(r'[,',r'[') #Fix any unecessary comma (added when there are no behaviours)

print("Writing to Behaviours File.")
f = open(behaviours,'w')
f.write(data_behaviours)
f.close()

#If a new _behaviours.ts was made, append toconfig.ts
if BEHAVIOURS_EXISTS == False: 
    print("Adding new entry to config.ts")
    f = open(BASE_DIR + "config.ts",'r')
    data_config = f.read()
    f.close()

    #Find import list (we use the old pattern)
    match = re.search(regex1, data_config, flags=re.DOTALL)
    if match == None:
        print('Something didn\'t work right')
        exit(1)
    
    raw_match = match.group(0)
    regex2 = r'import \* as b\d' #Count the number of imports made
    import_count = len(re.findall(regex2, raw_match))
    import_count += 1
    if (import_count > 1): #if the original was not 0
        #Update Import line
        regex2 = r';\nconst behaviours' #Get the end of the imports line
        raw_match_2 = re.search(regex2, raw_match)
        if raw_match_2 == None:
            print('Something didn\'t work right')
            exit(1)
        raw_match_2 = raw_match_2.group(0)
        new_import = "\nimport * as b" + str(import_count) + " from './" + str(behaviours.parent.relative_to(pathlib.Path(BASE_DIR).resolve())) + "/_behaviours';\n"
        raw_match_3 = raw_match_2.replace('\n', new_import)
        raw_match = raw_match.replace(raw_match_2, raw_match_3)

        ##Update Array definition
        regex2 = r'\n\)' #specifically get the end of the array definition
        raw_match_2 = re.search(regex2, raw_match).group(0)
        if raw_match_2 == None:
                print('Something didn\'t work right')
                exit(1)
        new_array = ",\n    b"+str(import_count)+".behaviours\n)"
        raw_match = raw_match.replace(raw_match_2, new_array)

        #Update data
        data_config = data_config.replace(match.group(0), raw_match)
    else: #if the original was 0. we need to add a new line

        #This usually implies we also don't have an array definition, either, so we'll just append the array definition alongside the import
        new_behaviours = "//[BEGIN_BEHAVIOURS]\nimport * as b" + str(import_count) + " from './" + str(behaviours.parent.relative_to(pathlib.Path(BASE_DIR).resolve())) + "/_behaviours';\nconst behaviours = new Array<{name:string,factory:Function}>().concat(\n    b"+str(import_count)+".behaviours\n)\n//[END_BEHAVIOURS]"
        
        #Update Data
        data_config = data_config.replace(match.group(0), new_behaviours)

    print("Updating config.ts...")
    f = open(BASE_DIR + "config.ts",'w')
    f.write(data_config)
    f.close()

#Find KeyObjects and load it as JSON5
f = open("../public/data/json/keyObjects.json5",'r')
list_keyObjects : List = json5.load(f)
f.close()
#Append a new object
new_keyObject = {
    "name" : className,
    "sceneObject":{
        "geometry" : "box",
        "behaviours" : [
            {"name": className, "params":{"elementId": className} }, #Optional, but we'll just assume this for the sake of conenienvcee
        ]
    }
}
list_keyObjects.append(new_keyObject)

data_keyObjects = json5.dumps(list_keyObjects,indent=4)
regex3 = r'(behaviours: \[(.*?)\],)' #get the entire behaviours section of the json
match = re.findall(regex3, data_keyObjects, flags=re.DOTALL)
for item in match:
    innerBehaviour = item[1] #group 1 of the result
    innerBehaviour = innerBehaviour.replace('\n', '') #remove newlines
    innerBehaviour = innerBehaviour.replace(' ', '') #remove tabs
    
    #Replace respective section
    data_keyObjects = data_keyObjects.replace( item[1], innerBehaviour )

print("Updating KeyObjects.JSON5")
f = open("../public/data/json/keyObjects.json5",'w')
f.write(data_keyObjects)
f.close()

print("Done.")