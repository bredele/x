
/**
 * Test dependencies.
 */

var assert = require('assert');
var x = require('..');
var Store = require('datastore');

describe('basic', function() {

  it('should return a function', function() {
    var dom = x('button');
    assert.equal(typeof dom, 'function');
  });

  it('should create dom element with a specified tag', function() {
    var el = x('button')();
    assert.equal(el.nodeName, 'BUTTON');
  });

  it('should set the inner value of the returned element', function() {
    var el = x('button', 'hello')();
    assert.equal(el.innerHTML, 'hello');
  });

  describe("inception", function() {
    
    it('should append one dom node', function() {
      var dom = x('ul', [
        x('li', 'hello')
      ])();

      var li = dom.firstChild;
      assert.equal(li.nodeName, 'LI');
      assert.equal(li.innerHTML, 'hello');

    });

    it('should append multiple dom nodes', function() {
      var dom = x('ul', [
        x('li', 'hello'),
        x('li', 'world')
      ])();
      assert.equal(dom.children.length, 2);
    });

    it('should append string as a dom node', function() {
      var dom = x('ul', [
        'hello'
      ])();
      assert.equal(dom.innerHTML, 'hello');
    });

    it('should mix text and dom nodes', function() {
      var dom = x('div', [
        'hello',
        x('ul', [
          x('li', 'hello'),
          x('li', 'world')
        ])
      ])();
      assert.equal(dom.innerHTML, 'hello<ul><li>hello</li><li>world</li></ul>');
    });

  });
  
  describe("attributes", function() {
    
    it('should set attributes', function() {
      var dom = x('button', {
        class: 'btn'
      })();
      assert.equal(dom.className, 'btn');
    });

    it('should still set dom nodes', function() {
      var dom = x('button', {
        class: 'btn'
      }, [
        x('img', {
          src: 'hello'
        })
      ])();

      var img = dom.firstChild;
      assert.equal(img.nodeName, 'IMG');
      assert.equal(img.getAttribute('src'), 'hello');
    });

    it('should still set text node', function() {
      var dom = x('button', {
        class: 'btn'
      }, 'hello')();
      assert.equal(dom.innerHTML, 'hello');
    });

    describe('attributes function', function() {

      it('should define functions as attributes', function() {
        var dom = x('button', {
          class: function() {
            return 'hello-world';
          }
        })();
        assert.equal(dom.className, 'hello-world');
      });

      it('should call function with data', function() {
        var dom = x('h1', {
          class: function() {
            return this.type;
          }
        })({
          type: 'title'
        });

        assert.equal(dom.className, 'title');
      });

    });

    describe('attributes listener', function() {
      var ev = document.createEvent('MouseEvents');
      ev.initEvent('click', true, true);
      //ev.synthetic = true;

      it('should listen dom events', function(done) {
        var dom = x('button', {
          onclick: function() {
            done();
          }
        })();

        dom.dispatchEvent(ev, true);

      });
    });
    
  });
  
  describe('styles', function() {

    it('should create styles from object', function() {
      var dom = x('button', {
        style: {
          background: 'red',
          width: '100px'
        }
      })();

      assert.equal(dom.getAttribute('style'), 'background:red;width:100px;');
    });

  });

});

describe('template', function() {

  it('should substitute inner text with data', function() {
    var dom = x('button', '${label}')({
      label: 'hello'
    });
    assert.equal(dom.innerHTML, 'hello');
  });

  it('should substitute attributes with data', function() {
    var dom = x('button', {
      class: 'btn ${label}'
    }, '${label}')({
      label: 'hello'
    });
    assert.equal(dom.className, 'btn hello');
  });

  describe('observable', function() {

    it('should update inner text when data changes', function() {
      var store = new Store({
        label: 'hello'
      });
      var dom = x('button', '${label}')(store);
      assert.equal(dom.innerHTML, 'hello');
      store.set('label', 'world');
      assert.equal(dom.innerHTML, 'world');
    });

    it('should update attribute when data changes', function() {
      var store = new Store({
        label: 'hello'
      });
      var dom = x('button', {
        class: 'btn ${label}'
      })(store);
      assert.equal(dom.className, 'btn hello');
      store.set('label', 'world');
      assert.equal(dom.className, 'btn world');
    });

  });

});
