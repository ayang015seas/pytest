#let's try something 
from bs4 import BeautifulSoup
import requests
import csv
#import urllib2
import time

url = 'https://www.foxnews.com/world/us-russian-warships-almost-collide-philippine-sea'

start = time.process_time()
response = requests.post(url)
request_time = time.process_time() - start
print(request_time)