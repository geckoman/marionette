//**************************************************************
// jQZoom allows you to realize a small magnifier window,close
// to the image or images on your web page easily.
//
// jqZoom version 2.2
// Author Doc. Ing. Renzi Marco(www.mind-projects.it)
// First Release on Dec 05 2007
// i'm looking for a job,pick me up!!!
// mail: renzi.mrc@gmail.com
//**************************************************************

//**************************************************************

// jqZoom version 2.5
//  updated by Mark Avery
// now just uses the actuall image you are zooming on to set features..

// Zoomer version 3
//  updated by Mark Avery
// now it is independent of any parent elements.. can also be applied to images anywhere on the page.. 

// Zoomer version 3.1
//  updated by Mark Avery
// more reliable stability, and sizing, also is activated on click, and a neet idea for a perloader implimented 

//**************************************************************

var Zoomer = function(options, element){
	var settings = {
		xzoom: 200,		//zoomed width default width
		yzoom: 200,		//zoomed div default width
		offset: 10,		//zoomed div default offset
		position: "right", //zoomed div default position,offset position is to the right of the image
		source: "title"
	};
	if(options) {
		$.extend(settings, options);
	}
	
	var self = this;
	this.root = element;
	this.root.removeAttr('height');
	
	this.root.after("<div id='jqZoomPup' alt='" + this.root.attr('alt') + "'>&nbsp;</div>");
	this.root.after("<div id='zoomdiv'>&nbsp;</div>");

	this.zoomed = this.root.next('#zoomdiv').css('visibility', 'hidden');
	this.lens = this.zoomed.next('#jqZoomPup');
	
	var scalex = null;
	var scaley = null;
	self.zoomed_image = null;
		
	this.zoom_setup = function() {
		$(window).unbind('load', self.zoom_setup);
		
		self.root.bind('load', self.zoom_setup);
		self.lens.unbind('mousedown', self.magnify);
		self.imageLeft = self.root.position().left + Number(self.root.css('paddingLeft').replace('px', '')) + Number(self.root.css('borderLeftWidth').replace('px', '')) + Number(self.root.css('marginLeft').replace('px', ''));
		
		self.imageTop = self.root.position().top + Number(self.root.css('paddingTop').replace('px', '')) + Number(self.root.css('borderTopWidth').replace('px', '')) + Number(self.root.css('marginTop').replace('px', ''));
		
		self.lens.css('background-image', 'url(/images/pre_load.gif)').fadeTo(150, .6);
		self.topOff = self.root.offset().top;
		self.leftOff = self.root.offset().left;
		self.rootWidth = self.root.width() -4;
		self.rootHeight = self.root.height() - 4;
		self.lens.css({ top: self.imageTop, left: self.imageLeft });
		self.lens.height(self.rootHeight);
		self.lens.width(self.rootWidth);
		if (settings.source == "title")
			self.zoomed.html('<img alt="large image" src="' +  self.root.attr('title') +'" />');
		else if (settings.source == "product")
			self.zoomed.html('<img alt="large image" src="'+  self.root.attr('src').replace('/large.jpg', '').replace('_v/', '') +'" />');
		self.zoomed_image = self.zoomed.children();
		self.zoomed_image.bind('load', self.loadup);
	}

	this.loadup = function() {
		self.lens.stop();
		self.lens.fadeTo(200, 0, function() {
			self.lens.css('visibility', 'visible');
			self.lens.css('background-image', 'url()');
		});
		self.zoomed.css('visibility', 'hidden').show();
		self.zoomed_image.unbind('load', self.loadup);
		self.zoomed_image.fadeTo(0, 0);
		self.bigwidth = self.zoomed_image.width();
		self.bigheight = self.zoomed_image.height();
		scalex = settings.xzoom/(self.bigwidth/self.rootWidth);
		scaley = settings.yzoom/(self.bigheight/self.rootHeight);
		if(settings.position == "right") {
			if(self.imageLeft + self.rootWidth + settings.offset + settings.xzoom > screen.width)
				leftpos = self.imageLeft - settings.offset - settings.xzoom;
			else
				leftpos = self.imageLeft + self.rootWidth + settings.offset;
		}
		else	{
			leftpos = self.imageLeft - settings.xzoom - settings.offset;
			if (leftpos < 0)
				leftpos = self.imageLeft + self.rootWidth	+ settings.offset;
		}
		self.zoomed.css({ top: self.imageTop,left: leftpos });
		self.zoomed.width(settings.xzoom);
		self.zoomed.height(settings.yzoom);
		self.zoomed.css('visibility', 'visible').hide();
		if (self.lens.height() < scalex)
			self.zoomed.html('');
		else
			self.lens.bind('mousedown', self.magnify);
	}
	
	this.repositionX = function(x)  {
		if (x < self.leftOff || x > self.leftOff + self.rootWidth)
			self.backin_order();
		x = x - self.leftOff + self.imageLeft - scalex/2;
		if (x < self.imageLeft - 1)
			x = self.imageLeft;
		else if (x + scalex > self.imageLeft + self.rootWidth) 
			x = self.imageLeft + self.rootWidth - scalex;
		return x;
	}
	
	this.repositionY = function(y)  {
		if (y < self.topOff || y > self.topOff + self.rootHeight)
			self.backin_order();
		y = y - self.topOff + self.imageTop - scaley/2;
		if (y < self.imageTop - 1)
			y = self.imageTop;
		else if (y + scaley > self.imageTop + self.rootHeight) 
			y = self.imageTop + self.rootHeight - scaley;
		return y;
	}
	
	this.move_around = function(e)  {
		var t_y = self.repositionY(e.pageY - 2);
		var t_x = self.repositionX(e.pageX - 2);
		self.lens.css({ top: t_y, left: t_x});
		self.zoomed_image.css({ 
			top: -(t_y - self.imageTop) * (self.bigwidth / self.rootWidth), 
			left: -(t_x - self.imageLeft) * (self.bigheight / self.rootHeight)
		});
	}
	
	this.magnify = function(e) {
		self.lens.css('cursor', 'move');
		var t_y = self.repositionY(e.pageY);
		var t_x = self.repositionX(e.pageX);
		self.zoomed_image.css({ 
			top: -(t_y - self.imageTop) * (self.bigwidth / self.rootWidth), 
			left: -(t_x - self.imageLeft) * (self.bigheight / self.rootHeight)
		});
		self.zoomed_image.stop(true);
		self.zoomed.stop(true);
		self.zoomed.css('display', 'block').fadeTo(150, 1, function() {self.zoomed_image.fadeTo(200, 1, "easeOutQuad")}, "easeOutQuad");
		self.lens.stop(true);
		self.lens.fadeTo(150, .6, function() {
			self.lens.animate({
				width: scalex,
				height: scaley,
				top: t_y,
				left: t_x
			}, 200, "easeOutQuad", function() {
				$(document).bind('mousemove', self.move_around);
			});
		}, "easeOutQuad");		
	}
	this.backin_order = function() {
		self.lens.css('cursor', 'pointer');
		$(document).unbind('mousemove', self.move_around);
		self.zoomed_image.stop(true);
		self.zoomed.stop(true);
		self.zoomed_image.fadeTo(200, 0, function() {
			self.zoomed.fadeTo(150, 0, function(){
				self.zoomed.hide();
			}, "easeOutQuad");
		}, "easeOutQuad");
		self.lens.stop(true);
		self.lens.animate({
			width: self.rootWidth,
			height: self.rootHeight,
			top: self.imageTop,
			left: self.imageLeft
		}, 200, "easeOutQuad", function() {
			self.lens.fadeTo(150, 0, "easeOutQuad");
		});
	}
	$(window).bind('load', self.zoom_setup);
}