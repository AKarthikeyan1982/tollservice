const request = require('request');

// Helper functions
const baseURL = 'http://tis.nhai.gov.in';
const getFormatData = function(rtolls){
	let fData = {};
	if(rtolls.length){
		rtolls.forEach(eachTollObj => {
			let tmpObj = {'tollID': '', 'tollName': '', 'carSingle': ''};
			let tmpLatLong = eachTollObj.latitude +','+ eachTollObj.longitude;
			tmpObj.tollID = eachTollObj.TollPlazaID;
			tmpObj.tollName = eachTollObj.TollName;
			tmpObj.carSingle = eachTollObj.CarRate_single;
			fData[tmpLatLong] = tmpObj;
		});
	}
	return fData;
};

const getTollInfo = function (rObj, cb){
	request(rObj, function(err, response, body) {
		if(err){ return cb(err, null); }
		else{ return cb(null, body); } 
	});
};

module.exports = {
	getAllToll: function(req, res, next) {
		const options = {  
			url: baseURL +'/TollPlazaService.asmx/GetTollPlazaInfoForMapOnPC',
			method: 'POST',
			headers: {'Content-Type': 'application/json; charset=utf-8'}
		};
		let hrStart = process.hrtime(), hrEnd;
		getTollInfo(options, function(err, resBody){
			if(err){ res.json({status: "error", data: err}); }
			let formatedData = {}, responseData = JSON.parse(JSON.stringify(JSON.parse(resBody)));
			if(responseData && responseData.d && responseData.d.length){
				hrEnd = process.hrtime(hrStart);
				console.info('Response time (hr): %ds %dms', hrEnd[0], hrEnd[1] / 1000000);
				formatedData = getFormatData(responseData.d);
				hrEnd = process.hrtime(hrStart);
				console.info('Execution time (hr): %ds %dms', hrEnd[0], hrEnd[1] / 1000000);
			}
			res.json({status: "success", data: formatedData});
		});
	},

	searchToll: function(req, res, next) {
		try{
			if(req.query && req.query.src && req.query.dest){
				let tmpSearchURL = baseURL +'/UploadHandler.ashx?Up=3&Source='+req.query.src+'&Destination='+req.query.dest;
				console.log('##SearchURL: ' + tmpSearchURL);
				const options = {  
					url: tmpSearchURL,
					method: 'GET'
				};
				let hrStart = process.hrtime(), hrEnd;
				getTollInfo(options, function(err, resBody){
					if(err){ 
						res.json({status: "error", data: err}); 
					}
					let responseData = [];
					if(resBody){
						responseData = resBody.split('$$');
						hrEnd = process.hrtime(hrStart);
						console.info('Response time (hr): %ds %dms', hrEnd[0], hrEnd[1] / 1000000);
					}
					res.json({status: "success", data: responseData[0]});
				});
			}
		}catch(e){
			console.error(e);
			res.err(e);
		}
	}
}					
