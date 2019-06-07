#let's try something 
from bs4 import BeautifulSoup
import requests
import csv
#import urllib2
import time

url = 'https://www.foxnews.com/world/us-russian-warships-almost-collide-philippine-sea'
url1 = 'https://baike.baidu.com/item/article'
url2 = 'https://www.youtube.com/channel/UCU22SYUm7Z1COjASmmQG1aA'
url4 = 'https://www.facebook.com/groups/1343933772408499/'

start = time.process_time()
r = requests.get(url2)
request_time = time.process_time() - start

#start2 = time.process_time()
#r2 = requests.post(url)
#request_time2 = time.process_time() - start2

hist = r.history

for x in r.history: 
	print(x.url, end="\n\n")

#for i, response in enumerate(r.history, 1):
#	print(i, response.url)

print(r.status_code, r.url)

#print('get time')
#print(request_time)
#print('post time')
#print(request_time2)
