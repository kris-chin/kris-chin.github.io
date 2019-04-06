import random

#goal: make a perfect vigenere cipher.

def keyGen(st, cap): #generates a key with unique numbers based off of string.
    #st = string to generate key from. cap = maximum rightward shift
    debug = False #set to true if you want debug
    e = ""
    for i in range(len(st)):
        charOrd = random.randint(0,cap)
        char = unichr(charOrd)
        
        while char in e:
            if debug: print("charOrd: " + str(charOrd) + " char: "+  char + " matches something in e.")
            charOrd = random.randint(0,cap)
            char = unichr(charOrd)
            if debug: print("new charOrd: " + str(charOrd) + " char: "+ char)
            if char not in e: continue
        e = e + char
        if debug: print("charOrd: " + str(charOrd) + " char: " + char + " | e: '" + e + "'")
        
    return e

def vigenere(st,key): #shifts each individual text rightwards based off of key
    e = ""
    for i in range(len(st)): e = e + unichr(ord(st[i])+ord(key[i]))
    return e

def decipher_vigenere(st,key): #shifts the given string left by the key
    e = ""
    for i in range(len(st)): e = e + unichr(ord(st[i])-ord(key[i]))
    return e

while True:
  print("Enter your string:")
  string = input()
  print("Enter your character cap (default: 30000):")
  while True:
      try:
          cap = int(input())
          break
      except ValueError:
          print("Defaulting to 30000...\n")
          cap = 30000
          break
      
  print("This is your unique key for this string:")
  key = keyGen(string,cap)
  print("\n   " + key)
  print("\n" + "This is your encrypted text: \n")
  newString = vigenere(string,key)
  print("   " + newString + "\n")
  print("decipher_vigenere(\"" + newString + "\",\"" + key + "\")\n")
  print("   " + decipher_vigenere(newString,key) + "\n")
  print("--------------------------------------")
