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

function getTimeStatement(service) {
  if (service.etd !== 'On time') {
    const time1 = parseInt(service.etd.split(':')[1], 10);
    const time2 = parseInt(service.std.split(':')[1], 10);
    return `${time1 - time2} minutes late`;
  } else {
    return 'on time';
  }
}

/* GET users listing. */
router.get('/', function (req, res, next) {

  rail.getDepartureBoard('DYP', { filter: 'MOG', rows: '2' }, function (err, result) {
    //do stuff
    if (result) {
      const { trainServices } = result;
      const service1 = trainServices[0];
      const service2 = trainServices[1];

      let data;

      if (isEmpty(trainServices)) {
        data = {
          "frames": [
            {
              "text": "No trains for a while...",
              "icon": "a1395"
            },
          ]
        };
      } else if (!service2) {
        data = {
          "frames": [
            {
              "text": `${service1.std} is ${getTimeStatement(service1)}`,
              "icon": "a1395"
            },
          ]
        };
      } else {
        data = {
          "frames": [
            {
              "text": `${service1.std} is ${getTimeStatement(service1)}`,
              "icon": "a1395"
            },
            {
              "text": `${service2.std} is ${getTimeStatement(service2)}`,
              "icon": "a1395"
            },
          ]
        };
      }

      res.json(data);
    }

  });

});

module.exports = router;
