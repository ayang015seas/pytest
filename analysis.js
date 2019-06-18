const fs = require('fs');
var hostFile = fs.readFileSync('Output10.txt', 'utf8').split("BREAK_SIG");
var data = JSON.parse(hostFile);

var all_pages = [];
function getHostName (str) {
  // taken from http://beardscratchers.com/journal/using-javascript-to-get-the-hostname-of-a-url
  try{
    var re = new RegExp('^(?:f|ht)tp(?:s)?\://([^/]+)', 'im');
    return str.match(re)[1].toString();
  } catch (err) {
    //probably data uri which we dont care abt
    //console.log(str)
    return null;
  }
}


var CDN  = [
  [".clients.turbobytes.com", "Turbobytes"],
  [".akamai.net", "Akamai"],
  [".edgekey.net", "Akamai"],
  [".edgesuite.net","Akamai"],
  [".cdn.bitgravity.com", "Bitgravity"],
  [".akamaiedge.net", "Akamai"],
  [".deploy.static.akamaitechnologies.com", "Akamai"],
  [".llnwd.net", "Limelight"],
  [".systemcdn.net", "EdgeCast"],
  [".cdn77.net", "CDN77"],
  [".edgecastcdn.net", "EdgeCast"],
  [".hwcdn.net", "Highwinds"],
  [".panthercdn.com", "CDNetworks"],
  [".simplecdn.net", "Simple CDN"],
  [".instacontent.net", "Mirror Image"],
  [".mirror-image.net", "Mirror Image"],
  [".cap-mii.net", "Mirror Image"],
  [".footprint.net", "Level3"],
  [".ay1.b.yahoo.com", "Yahoo"],
  [".yimg.", "Yahoo"],
  [".google.", "Google"],
  ["googlesyndication.", "Google"],
  ["youtube.", "Google"],
  [".googleusercontent.com", "Google"],
  [".l.doubleclick.net", "Google"],
  [".internapcdn.net", "Internap"],
  [".cloudfront.net", "Amazon Cloudfront"],
  [".netdna-cdn.com", "MaxCDN"],
  [".netdna-ssl.com", "MaxCDN"],
  [".netdna.com", "MaxCDN"],
  [".cotcdn.net", "Cotendo"],
  [".cachefly.net", "Cachefly"],
  ["bo.lt", "BO.LT"],
  [".cloudflare.com", "Cloudflare"],
  [".afxcdn.net", "afxcdn.net"],
  [".lxdns.com", "ChinaNetCenter"],
  [".att-dsa.net", "AT&T"],
  [".vo.msecnd.net", "Windows Azure"],
  [".voxcdn.net", "Voxel"],
  [".bluehatnetwork.com", "Blue Hat Network"],
  [".swiftcdn1.com", "SwiftCDN"],
  [".rncdn1.com", "Reflected Networks"],
  [".cdngc.net", "CDNetworks"],
  [".gccdn.net", "CDNetworks"],
  [".gccdn.cn", "CDNetworks"],
  [".fastly.net", "Fastly"],
  [".gslb.taobao.com", "Taobao"],
  [".gslb.tbcache.com", "Alimama"],
  [".ccgslb.com", "ChinaCache"],
  [".ccgslb.net", "ChinaCache"],
  [".c3cache.net", "ChinaCache"],
  [".chinacache.net", "ChinaCache"],
  [".c3cdn.net", "ChinaCache"],
  [".akadns.net", "Akamai"],
  [".cdn.telefonica.com", "Telefonica"],
  [".azioncdn.net", "Azion"],
  [".anankecdn.com.br", "Ananke"],
  [".kxcdn.com", "KeyCDN"],
  [".lswcdn.net", "LeaseWeb CDN"],
  [".cdn.amazon.com", "Amazon CDN"],
  [".cdn.amazon.co.uk", "Amazon CDN"],
  [".nyucd.net", "Coral Cache"],
  ["cdn1.graphiq.com", "Cloudflare"],
  ["cdn2.pubexchange.com", "Cloudflare"],
  ["cdn.districtm.ca", "Cloudflare"],
  ["cdn.engine.4dsply.com", "Cloudflare"],
  ["cdn.onesignal.com", "Cloudflare"],
  ["cdn.prizma.tv", "Cloudflare"],
  ["cdn.tinypass.com", "Cloudflare"],
  ["cdn.tynt.com", "Cloudflare"],
  ["lightboxcdn.com", "Cloudflare"]
  ]
function determineCDN(url) {
  const result = getHostName(url);
  // console.log(result);

  for (var i = 0; i < CDN.length; i++) {
    // console.log(CDN[i][0]);
    if ((url.toLowerCase().search(CDN[i][0]) != -1) || 
    	(result.toLowerCase().search(CDN[i][0]) != -1)) {
      return CDN[i][1];
    }
  }
  return false;
}

function xCache(obj) {
  var str = JSON.stringify(obj);
  str = str.toLowerCase();
  var result = str.search("x-cache");
  var cf = str.search("via");
  if ((result != -1) || (cf != -1)) {
    return true;
  }
  else {
    return false;
  }
}

function redirect(obj) {
	var num = parseInt(obj) 
		// console.log(num);
		if (num < 400 && num >= 300) {
			return true;
		}
		else {
			return false;
		}
}

function server(obj) {
  if (obj.server != undefined && obj.server != null) {
    return true;
  }
  else {
    return false;
  }
}

function parsePage(page) {
  const page_url = page[0][0].page_url;
  var total_obj = 0;
  var CDNCounter = 0;
  var total_xcache = 0; 
  var CDN_nX = 0;
  var CDN_yX = 0;
  var red = 0;
  var serv = 0;
  var no_serv = 0;
  var err = page[1].length;

  for (var j = 0; j < page[0].length; j++) {
    const req_obj = page[0][j];
    const req_header = req_obj.request_headers;
    const resp_header = req_obj.response_headers;
    const req_address = req_obj.request_url; 
    const resp_stat = req_obj.response_status;

    var CDN = determineCDN(req_address);
    var x_cache = xCache(resp_header);
    var code = redirect(resp_stat);
    var yServ = server(resp_header);
    // console.log(resp_header);
    // console.log(req_address + '\n');

    if (CDN) {
    	CDNCounter++;
    	if(x_cache) {
    		CDN_yX++;
    	}
    	else {
    		CDN_nX++;
    	}
    	if (yServ) {
    		serv++;
    	}
    	else {
    		no_serv++;
    	}
    }
    // 
    if (code) {
      red++;
    }
    if (xCache(resp_header)) {
      total_xcache ++;
    }
    //
    total_obj++;
  }
  var result = {Page: page_url, Objects: total_obj, CDNs: CDNCounter,
  X_Caches: total_xcache, CDN_No_X: CDN_nX, CDN_Yes_X: CDN_yX,
  Redirects: red, CDN_yServ: serv, CDN_nServ: no_serv, Errors: err};
  console.log(result);
  all_pages.push(result);
}

for (var i = 0; i < data.length; i++) {
   const page = data[i];
   parsePage(page);
}




