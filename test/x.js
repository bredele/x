
/**
 * Test dependencies.
 */

var assert = require('assert');
var x = require('..');

describe('basic', function() {

	it('should create dom element', function() {
		var dom = x('button');
		assert.equal(dom.nodeName, 'BUTTON');
	});

	it('should set attributes', function() {
		var dom = x('button', {
			class: 'btn'
		});
		assert.equal(dom.className, 'btn');
	});

});
