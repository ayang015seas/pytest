# pychrometest
import sys
sys.path.insert(0, "/users/ayang015/PyChromeDevTools")
import PyChromeDevTools
import time
#from geoip import geolite2
import json

chrome = PyChromeDevTools.ChromeInterface()
chrome.Network.enable()
chrome.Page.enable()

#start_time=time.time()

writ = open("writ.txt", "w")

json1 = chrome.Page.navigate(url="http://www.facebook.com")
event,messages=chrome.wait_event("Page.frameStoppedLoading", timeout=60)
#response1 = chrome.Network.getRequestPostData(url="http://www.google.com/")
#chrome.wait_event("Network.responseReceived", timeout=200)
#time.sleep(10)

#end_time=time.time()

for m in messages:
    if "method" in m and m["method"] == "Network.responseReceived":
    	#print(m)
    	#print("test1")
    	writ.write(json.dumps(m))
    	writ.write("\n")
    	writ.write("\n")
        #try:
        #    url=m["params"]["response"]["url"]
        #    #print(chrome.Network.getResponseBody(url))
        #    print (url)
        #except:
        #    pass

writ.close()

# print(json1)


#todo get remote address, 
# match = geolite2.lookup('17.0.0.1')
# display timezone, print to word file 
#print(response1)

# print ("Page Loading Time:", end_time-start_time)
