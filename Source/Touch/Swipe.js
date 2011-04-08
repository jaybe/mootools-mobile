/*
---

name: Swipe

description: Provides a custom swipe event for touch devices

authors: Christopher Beloch (@C_BHole), Christoph Pojer (@cpojer), Ian Collins (@3n)

license: MIT-style license.

requires: [Core/Element.Event, Custom-Event/Element.defineCustomEvent, Browser.Features.Touch]

provides: Swipe

...
*/

(function(){

var name = 'swipe',
	distanceKey = name + ':distance',
	cancelKey = name + ':cancelVertical',
	dflt = 50;

var start = {}, disabled, active;

var clean = function(){
	active = false;
};

var events = {

	touchstart: function(event){
		if (event.touches.length > 1) return;

		var touch = event.touches[0];
		active = true;
		start = {x: touch.pageX, y: touch.pageY};
	},
	
	touchmove: function(event){
		event.preventDefault();
		if (disabled || !active) return;
		
		var touch = event.changedTouches[0];
		var end = {x: touch.pageX, y: touch.pageY};

		var distance = this.retrieve(distanceKey, dflt);
		var diffx = end.x - start.x;
		var diffy = end.y - start.y;

		if(Math.abs(diffx) > Math.abs(diffy) && Math.abs(diffx) > distance ) {
			event.direction = (diffx < -distance ? 'left' : 'right');
		} else if( Math.abs(diffy) > distance ) {
			event.direction = (diffy < -distance ? 'up' : 'down');
		} else {
			return;
		}
		
		active = false;
		event.start = start;
		event.end = end;
		
		this.fireEvent(name, event);
	},

	touchend: clean,
	touchcancel: clean

};

Element.defineCustomEvent(name, {

	onSetup: function(){
		this.addEvents(events);
	},

	onTeardown: function(){
		this.removeEvents(events);
	},

	onEnable: function(){
		disabled = false;
	},

	onDisable: function(){
		disabled = true;
		clean();
	}

});

})();
