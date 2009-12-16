/* ------------------------- marionette ------------------------
  Copyright (c) 2009 Mark Avery. Copious Inc. -- copiousinc.com --
  
  Permission is hereby granted, free of charge, to any person
  obtaining a copy of this software and associated documentation
  files (the "Software"), to deal in the Software without
  restriction, including without limitation the rights to use,
  copy, modify, merge, publish, distribute, sublicense, and/or sell
  copies of the Software, and to permit persons to whom the
  Software is furnished to do so, subject to the following
  conditions:
  
  The above copyright notice and this permission notice shall be
  included in all copies or substantial portions of the Software.
  
  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
  EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
  OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
  NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
  HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
  WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
  FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
  OTHER DEALINGS IN THE SOFTWARE.
*/
/* ------------------------- marionette ------------------------
  marionette
  
  the main idea behind the marionette framework is to provide an easy way
  to instantiate classes only when the necessary html is present.. No inline javascript
  is needed, and DOM look ups are [virtually] always scoped.. With the ready up
  function that inherits the controller, there are 3 main parts..
 
  First are acts and scenes.. Acts get instantiated with all matching HTMLElement, while Sceenes get instantiated per HTMLElement.. The HTMLElement that gets passed into the controller is the HTMLElement
  that all DOM lookups are scoped to.. This allows for re-instantiation of ajax loaded content..
 
  Second are the linkers... Each link gets iterated through and if are cretin attributes on links..
  especially regular expressed urls, are pared up with particular classes.. can create a indy_hookup
  function to set your own linkers
 
  Third is the underdeveloped image.. this is for when developing sites locally... you don't want to have
  to keep the data bases out of sync, but still maintain nice visual appearance for debugging purposes.. and
  will not have to worry about keeping you images in-sync as well.. It simply appends the live_site value
  you set to the current src attribute of the element.. this is done only on images.. [all images that are in the system
  directory since that is where all of our uploaded images are kept]
----------------------------------------------------------- */

/* ------------------------- Controller -------------------------
/	** Controller
  *  Used to attach classes to HTMLElements
  *  if the element is a 'act' it passes all the the class, if it's a 'scene', it instantiates a method per Element
  *  @param element{jQuery} this is the containing element that the the all elements are scoped to..
  *  @memeber cLone: function: discirption of what the function does and how it is used
  *  @event cLone{event type}: function: discirption of what the event does, and when or why it is called
  */
/* --------------------------------------------------------- */
function Controler(element){
  var self = this;
  this.container = element;
  this.live_site = '';

  this.showing = function(actions, is_act) {
    for (var i = 0; i < actions.length; i++) {
      if(actions[i].item.length > 0 && is_act) {
        if (!actions[i].extras) {
          actions[i].extras = new Array()
        }
        actions[i].handle.apply(new Manipulator(actions[i].item), actions[i].extras).start_up();
      } else {
        for(var j = 0; j < actions[i].item.length; j++) {
          if (!actions[i].extras) {
            actions[i].extras = new Array()
          }
          actions[i].handle.apply(new Manipulator(actions[i].item.eq(j)), actions[i].extras).start_up();
        }
      }
    }
  }
  
  this.start_up = function() {
    if (self.live_site) {
      new Underdevelop_img(self.container, self.live_site);
    }
    if (self.linker_force) {
      new Linker(self.container, self.linker_force).start_up();
    }
    if (self.scenes) {
      self.showing(self.scenes, false);
    }
    if (self.acts) {
      self.showing(self.acts, true);
    }
    return self;
  }
  return this;
}
/* ------------------------- Linker ---------------------------
/	** Linker
  *  short description of what class does
  *  short description of how html needs to be formated.. if at all
  *  short explination for why done the way that it is
  *  @param cLone{data type} variable: discirption of what the variable does does
  *  @memeber cLone: function: discirption of what the function does and how it is used
  *  @event cLone{event type}: function: discirption of what the event does, and when or why it is called
  */
/* --------------------------------------------------------- */
function Linker(element, linker_force) {
  var self = this;
  this.linker_force = linker_force;
  this.linkers = element.find('a').filter(function(index) {return $(this).attr('href')});
  
  this.start_up = function() {
    for (var i = 0; i < self.linkers.length; i++) {
      self.indy_linkup(self.linkers.eq(i), self.linkers.eq(i).attr('href'));
    }
    return self;
  }
  
  this.popin_filter = function(index) {
    return $(this).attr('href').match(/\/popin\//i);
  }
  
  this.indy_linkup = function(linker, hookshot) {
    for (var i = 0; i < self.linker_force.length; i++) {
      if (!self.linker_force[i].extras) {
        self.linker_force[i].extras = new Array()
      }
      if (hookshot.match(self.linker_force[i].hookshot)) {
        self.linker_force[i].handle.apply(new Manipulator(linker), self.linker_force[i].extras).start_up();
      }
    }
  }
  
  return this;
}

/* ------------------------- Underdevelop Images ----------------
/	** Underdevelop_img
  *  short description of what class does
  *  short description of how html needs to be formated.. if at all
  *  short explination for why done the way that it is
  *  @param cLone{data type} variable: discirption of what the variable does does
  *  @memeber cLone: function: discirption of what the function does and how it is used
  *  @event cLone{event type}: function: discirption of what the event does, and when or why it is called
  */
/* --------------------------------------------------------- */
function Underdevelop_img(element, domain) {
  var self = this;
  this.root = element.find('img');
  for (var i = 0; i < this.root.length; i++) {
    if (this.root.eq(i).attr('src').match(/^\/system\//i) && window.location.port != "") {
      this.root.eq(i).attr('src', domain + this.root.eq(i).attr('src'))
    }
    if (!Is_image(this.root.eq(i).attr('src'))) {
      var temp_width = this.root[i].getAttribute('width');
      var temp_height = this.root[i].getAttribute('height');
      if ($.browser.msie) {
        var ie_width = this.root[i].outerHTML.toString().match(/width\=.*\ /);
        if (ie_width) {
          ie_width = ie_width.toString().replace('width=', '').replace(' ','');
          temp_width = Number(ie_width);
        } else {
          ie_width = this.root[i].outerHTML.toString().match(/width\=.*\>/);
          if (ie_width) {
            ie_width = ie_width.toString().replace('width=', '').replace('>','');
            temp_width = Number(ie_width);
          }
        }
      }
      this.root.eq(i).addClass('flashed').media({
        width : temp_width,
        height : temp_height,
        autoplay : true,
        wmode: 'transparent',
        params : {
          "allowscriptaccess" : "samedomain"
        }
      });
    }
  }
  return this;
}
/* ------------------------- Manipulator ------------------------
/	** Manipulator
  *  short description of what class does
  *  short description of how html needs to be formated.. if at all
  *  short explination for why done the way that it is
  *  @param cLone{data type} variable: discirption of what the variable does does
  *  @memeber cLone: function: discirption of what the function does and how it is used
  *  @event cLone{event type}: function: discirption of what the event does, and when or why it is called
  */
/* --------------------------------------------------------- */
function Manipulator(element) {
  this.root = element;
  this.sketcher = new Sketch();
  this.start_up = function() {
    
  }
  return this;
}