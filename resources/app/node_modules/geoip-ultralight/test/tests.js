var geoip  = require('../lib/geoip');
var expect = require('expect.js');

describe('geoip-ultralight', function() {
  describe('lookupCountry', function() {
    it('returns the country for IPv4 addresses', function() {
      var ip = '8.8.4.4';
      expect(geoip.lookupCountry(ip)).to.be('US');
    });

    it('returns the country for IPv6 addresses', function() {
      var ip = '2001:4860:b002::68';
      expect(geoip.lookupCountry(ip)).to.be('US');
    });
  });
});
