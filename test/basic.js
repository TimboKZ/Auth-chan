var expect = require('chai').expect;
var Authchan = require('../assets/js/auth-chan.js');

describe("Authchan object", function () {
    it("Check if Authchan object is defined", function () {
        expect(typeof Authchan).to.equal('function');
    });
});