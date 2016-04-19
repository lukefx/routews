var proj4 = require("proj4");
var request = require('request');

class Route {
  constructor(start, stop) {
    
    if (!start || !stop) {
      throw new Error("Start and stop location have to be defined.");
    }
    
    this.start = this.convert(start);
    this.stop = this.convert(stop);
    this.results = {};
  }
  
  convert(coords) {
    var epsg21781 = "+title=CH1903 / LV03 +proj=somerc +lat_0=46.95240555555556 +lon_0=7.439583333333333 +x_0=600000 +y_0=200000 +ellps=bessel +towgs84=674.374,15.056,405.346,0,0,0,0 +units=m +no_defs";
    var xy = coords.split(',');
    var swiss_coords = proj4(epsg21781, proj4.WGS84, xy);
    return swiss_coords;
  }
  
  getToken() {
    
    var self = this;
      
    return new Promise(function(resolve, reject) {
          
      request.post({
        url: 'https://www.arcgis.com/sharing/rest/oauth2/token/',
        headers: { 'content-type' : 'application/x-www-form-urlencoded' },
        form: {
          client_id: process.env.CLIENT_ID,
          client_secret: process.env.CLIENT_SECRET,
          grant_type: 'client_credentials',
          expiration: '3600'
        }
      }, function(error, response, body) {
        
        if (error) {
          reject(error);
        }
        
        self.results.token = JSON.parse(body);
        resolve(true);
        
      });    
    });
    
  }
  
  route() {
    
    var self = this;
    
    return new Promise(function(resolve, reject) {
      
      if (!self.results.token) {
        reject(new Error("No valid token specified."));
      }
      
      var params = {
        stops: `${self.start};${self.stop}`,
        token: self.results.token.access_token,
        f: 'pjson'
      }
      
      var service = "http://route.arcgis.com/arcgis/rest/services/World/Route/NAServer/Route_World/solve";
      var url = `${service}?stops=${params.stops}&token=${params.token}&f=${params.f}`
      
      request(url, function(error, response, body) {
        self.results.route = JSON.parse(body);
        resolve(true);
      });
      
    });
    
  }
  
  getRoute() {
    var self = this;
    return new Promise(function(resolve, reject) {
      self.getToken()
        .then(self.route.bind(self))
        .then(function() {
          resolve(self.results.route.directions[0].summary);
        }).catch(function(error) {
          reject(new Error(error));
        });
    });
  }

}

// export default Route;
module.exports = Route;
