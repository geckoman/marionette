function Navi() {
  var self = this;
  this.nav = this.root;
  this.nav_items = this.nav.children().children('a');
  this.active = this.nav.children('a.active');
  this.sketcher = new Sketch();
  
  this.start_up = function(e) {
    self.nav_items.bind('mouseover', self.set_hover);
    self.nav_items.parent().bind('mouseleave', self.release_hover);
  }
  
  this.set_hover = function(e) {
    self.active.siblings('ul').hide();
    self.active = $(e.currentTarget);
    self.active.siblings('ul').show();
  }
 this.release_hover = function(e) {
    self.active.siblings('ul').hide();
  }
  
  return this;
}

function Navi_two_level_slide() {
  Navi.call(this);
  var self = this;
  this.nav.append('<li class="helper"><a href="#navi">&nbsp;</a></li>');
  this.navi_help = this.nav.children(':last')
  this.sub_nav = this.nav.next();
  
  this.start_up = function(e) {
    self.active = self.nav_items.filter(self.active_filter);
    self.nav_items.bind('mouseenter', self.set_hover);
    self.nav.parent().bind('mouseleave', self.release_hover);
    if (self.active.length > 0) {
      self.active = self.active.next();
      self.active.prev().trigger('mouseenter');
    } else {
      self.navi_help.stop();
      self.navi_help.hide();
      self.sub_nav.html('');
      self.active = [0,2];
    }
  }
  
  this.active_filter = function(index) {
    return this.className.match(/active/);
  }
  
  this.get_hover = function() {
    self.sketcher.draw(self.navi_help.css({display : 'block'}), {
      left: self.active.position().left, 
      width: self.active.outerWidth()
    }, null, .4);
    self.sub_nav.html(self.active.siblings('ul').clone().children().css({opacity: 0}));
    self.sketcher.draw(self.sub_nav.children(), {
      opacity : 1
    }, function() {
      this.removeAttribute('style')
    });
  }
  
  this.set_hover = function(e) {
    e.preventDefault();
    e.stopPropagation();
    if (e.currentTarget == self.active[0]) return false;
    self.active = $(e.currentTarget);
    self.get_hover();
  }
  this.release_hover = function(e) {
    e.preventDefault();
    e.stopPropagation();
    var me = self.nav_items.filter(self.active_filter);
    if (me[0] == self.active[0]) return false;
    
    if (me.length > 0) {
      self.active = me;
      self.get_hover();
    } else {
      self.navi_help.stop();
      self.navi_help.hide();
      self.sub_nav.html('')
      self.active = [0,2];
   }
 }

  return this;
}

/* ------------------------- Navi_side_slide ------------------------
/	** Navi_side_slide
  *  controls the behavior of the subnav
  *  subnav needs to be contained in a ul, each li of the ul is given a with of 200px via css
  *  subnav is positioned to the right absolutly and animated in using the Sketch js class
  *  @param element{jquery} variable: root element
  *  @member start_up bindes events (controller)
  *  @member slide_in slides in hidden ul
  *  @member slide_out slides out and hides visible ul
  */
/* --------------------------------------------------------- */

function Navi_side_slide(element) {
  Navi.call(this, element)
  var self = this;
  this.nav_slide_out = this.nav_items.siblings('ul')
  for (var i = 0; i < this.nav_slide_out.length; i++) {
    this.nav_slide_out.eq(i).data('width', this.nav_slide_out.eq(i).outerWidth());
  }
  
  this.set_hover = function(e) {
    var me = $(e.currentTarget);
    self.time_delay = setTimeout( function() {
      self.active.siblings('ul').hide();
      self.active.bind('mouseover', self.set_hover);
      self.active = me;
      self.active.unbind('mouseover', self.set_hover);
      self.sketcher.draw(self.active.siblings('ul').css({display : 'block', opacity: 0, width: 0}), { 
        opacity: 1, 
        width: self.active.siblings('ul').data('width')
      }, null, .4);
    }, 150);
  }
  this.release_hover = function(e) {
    clearTimeout(self.time_delay);
    self.active.bind('mouseover', self.set_hover);
    self.sketcher.draw(self.active.siblings('ul'), { opacity: 0}, function() {this.style.display = 'none';}, .4);
  }
  return this;
}