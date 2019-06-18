const fs = require('fs');
const puppeteer = require('puppeteer');
const request_client = require('request-promise-native');

// created with help from github (source available)

var articles = 
["https://www.foxnews.com/us/dallas-shooters-troubling-facebook-posts",
"https://www.foxnews.com/politics/trump-puts-army-secretary-in-charge-of-pentagon-after-shanahan-drops-out-of-contention-for-secdef",
"https://www.foxnews.com/politics/trump-launches-campaign-machine-with-massive-war-chest-despite-polling-lag",
"https://www.foxnews.com/politics/manafort-transferred-to-ny-federal-prison-as-he-awaits-trial-on-state-charges",
"https://www.infowars.com/medical-ids-enemy-of-privacy-liberty-and-health/",
"https://www.infowars.com/facebook-internet-of-money-to-control-bill-pay-access-to-public-transportation/",
"https://www.infowars.com/aoc-claims-us-is-running-concentration-camps-on-southern-border/",
"https://www.infowars.com/trump-ice-will-remove-millions-of-illegal-immigrants-from-u-s/",
"https://www.huffpost.com/entry/daniela-lourdes-falanga-arcigay-italy-transgender-trans-women-rights-italy_n_5ce6bd19e4b0db9c2994713f",
"https://www.huffpost.com/entry/medicare-for-all-poll-democrats_n_5d08264de4b0886dd15db364",
"https://www.huffpost.com/entry/texas-governor-vetoes-bill-that-would-help-sex-trafficking-victims-get-out-of-prison_n_5d08f8d9e4b0f7b744272a9e",
"https://www.huffpost.com/entry/sebastian-gorka-trump-access-hollywood-groping-democrat_n_5d08f69fe4b0f7b74427206a",
"http://www.msnbc.com/rachel-maddow-show/why-trumps-new-vow-use-ice-deport-millions-matters",
"https://www.msnbc.com/rachel-maddow/watch/trump-flips-out-over-nyt-report-on-new-us-aggression-with-russia-62136901919",
"https://www.msnbc.com/morning-joe/watch/amid-sagging-poll-numbers-trump-begins-re-election-62145605984",
"https://www.msnbc.com/hardball/watch/-wow-that-s-about-10-hands-have-dayton-voters-benefited-from-trump-tax-cuts-62135365510",
"https://en.wikipedia.org/wiki/5G"
]


var log = [];
var errorLog = [];

function stoperror() {
   return true;
}

function parseFile(fileName) {
	return new Promise(function(resolve, reject) {
		var contents = fs.readFileSync(fileName, 'utf8').split('\n');
		resolve(contents);
	});
}

// test function 
function getDNS(url) {
  return new Promise(function(resolve, reject) {
  var disk = dns.lookup(url, function(err, address, family) {
    // console.log("Address :", address);
  try {
    dns.reverse(address,function(err,hostnames) {
      if (err) {
        // console.log("not found");
        resolve(null);
      }
      else {
      // console.log(list);
      // console.log(hostnames[0]);
      
      resolve(hostnames[0]);
      }
    });
  }
  catch {
    console.log("DNS error");
    resolve(null);
  }

  });
  });
}


function record(article) {
	return new Promise(function(resolve, reject) {

	var all_headers = new Array();
	var all_errors = new Array();

	puppeteer.launch().then(async browser => {
	   const page = await browser.newPage();
	   await page.setRequestInterception(true);
	   // try to handle the socket error 
	   // make sure to have < 8 listeners 
	   process.setMaxListeners(9);
	   // start page.on

	  page.on('request', request => {
	    request_client({
	      uri: request.url(),
	      resolveWithFullResponse: true,
	    }).then(response => {
	      const page_url = article;
	      const request_url = request.url();
	      const request_headers = request.headers();
	      const response_headers = response.headers;
	      const response_status = response.statusCode;
	      // console.log(response.remoteAddress.ip);
	      const response_ip = response.remoteAddress;

	      all_headers.push({
	      	page_url,
	        request_url,
	        request_headers,
	        response_headers,
	        response_status,
	        response_ip,
	      });
	      request.continue();
	    }).catch(error => {
	      const http_err = error;
	      all_errors.push(http_err);
	      // console.error(error);
	      request.abort();
	    });
	  });
	  // end page.on
	try {
	    await page.goto(article, {
	      waitUntil: 'networkidle2', timeout: 10000
	    });
	    console.log("page loaded");
	  }
	  catch(err) {
	    console.log("timeout or error");
	  }
	  finally {
	  	console.log("hit final")
	  	await browser.close();
	    await resolve([all_headers, all_errors]);
	  }
	  await reject("error");
	  return;
	  // maybe something needs to be added here later 
	});
	});
}



async function main() {
	try {
	await runThrough().then(function() {
		var x = JSON.stringify(log, null, 2);
			fs.writeFile('Output10.txt', x, (err) => {
		  	// console.log(JSON.stringify(obj)); 
		    // In case of a error throw err. 
		    if (err) throw err; 
		    });
	});
}
catch (err) {
	console.log("ignore");
	}
}

async function runThrough() {
	return new Promise(async function(resolve, reject) {
	
	for (var i = 0; i < articles.length; i++) {
		if (i == articles.length - 1) {
			resolve();
		}
		await record(articles[i]).then(function(value) {
			log.push(value)});
	}
});
}

main();

