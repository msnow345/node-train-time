var express = require('express');
var router = express.Router();
var Rail = require('national-rail-darwin')
const DARWIN_TOKEN = '744c2b06-42f9-4261-b0a3-159b96d3d931';
var rail = new Rail(DARWIN_TOKEN) // or -> new Rail(DARWIN_TOKEN)

function isEmpty(obj) {
  for (var key in obj) {
    if (obj.hasOwnProperty(key))
      return false;
  }
  return true;
}

/* GET users listing. */
router.get('/', function (req, res, next) {

  rail.getFastestDeparture('DYP', 'MOG', {}, function (err, result) {
    //do stuff
    if (result) {
      const { trainServices } = result;
      const fastestService = trainServices[0];

      console.log('fastestService', fastestService)

      const data = {
        "frames": [
          {
            "text": isEmpty(fastestService) ? `No trains for a while...` : `${fastestService.sta} ${fastestService.etd === 'On Time' ? 'is' : 'is leaving at'} ${fastestService.etd}`,
            "icon": "a1395"
          },
        ]
      }
      res.json(data);
    }

  });

});

module.exports = router;
