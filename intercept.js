// intercept.js
// get all necessary imports 
const puppeteer = require('puppeteer');
const fs = require('fs') 

var totalobjects = 0;
var cachedobjects = 0;
var obj = null;

puppeteer.launch().then(async browser => {
  const page = await browser.newPage();
  await page.setRequestInterception(true);
  page.on('request', interceptedRequest => {
  	// console.log(interceptedRequest);
  	interceptedRequest.continue();
  });

  // this configuration actually works quite well 
  page.on('response', response => {
  	obj = JSON.stringify(response.headers());


  	fs.appendFile('Output.txt', JSON.stringify(obj), (err) => {
	  	console.log(JSON.stringify(obj)); 
	    // In case of a error throw err. 
	    if (err) throw err; 
		});
  	// console.log(obj);
  });

  // section to write to file 
  /*
  fs.writeFile('Output.txt', JSON.stringify(obj), (err) => {
  	console.log(JSON.stringify(obj)); 
    // In case of a error throw err. 
    if (err) throw err; 
	});
	*/

  await page.goto('https://github.com/GoogleChrome/puppeteer/blob/master/docs/api.md#pagesetrequestinterceptionvalue');
  await browser.close();
});
