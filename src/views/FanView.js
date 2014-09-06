define(function(require, exports, module) {
  var View      = require('famous/core/View');
  var Surface   = require('famous/core/Surface');
  var Modifier  = require('famous/core/Modifier');
  var Transform = require('famous/core/Transform');
  var StripView = require('views/StripView');

  var FanView = function(){
    View.apply(this, arguments);
    this.isOpen = false;

    _createStrips.call(this);
  };

  FanView.prototype = View.prototype;
  FanView.prototype.constructor = FanView;

  FanView.DEFAULT_OPTIONS = {
    zones: null
  };

  FanView.prototype.reset = function() {
    for(var i=0; i<this.options.zones.length; i++) {
      if (i === this.options.zones.length - 1) {
        this.stripViews[i].rotate( Math.PI ,
                                  function() {
                                    this._eventOutput.emit('FanClosed');
                                  }.bind(this) );
      } else {
        this.stripViews[i].rotate( Math.PI );
      }
    }
    this.isOpen = false;
  };

  FanView.prototype.open = function() {
    for (var i = 0; i < this.options.zones.length; i++) {
      this.stripViews[i].stripContainerMod.setTransform(
          Transform.rotateZ( i * (Math.PI / 15) - (Math.PI / 7.5)),
        {duration:500}
      );
    }
    this._eventOutput.emit('FanOpened');
    this.isOpen = true;
  };

  var _createStrips = function() {
    this.stripViews = [];
    var zones = this.options.zones;
    for (var j=0; j<zones.length; j++) {
      this.stripViews[j] = new StripView({
        content: zones[j],
        angle: Math.PI
      });
      this.stripViews[j].on('clicked', function(data) {
        this._eventOutput.emit('clicked', {data: data});
        if (this.isOpen) {
          this.reset();
        } else {
          this.open();
        }
      }.bind(this));
      this._add( this.stripViews[j] )
    }
  };

  module.exports = FanView;
});