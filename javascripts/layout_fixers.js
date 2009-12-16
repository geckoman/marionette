/* -----------------------------------------------------------
/* ------------------------- cLone ----------------------------
*/
function Window_fixer(element) {
  var self = this;
  this.root = element;
  this.wind = $(window);
  
  this.foot = this.root.find('#footer');
  this.foot_height = this.foot.children('.boiler').height();
  
  this.root_width = this.root.width()
  this.root_height = this.root.height()

  this.footer_widther = function()  {
    if (self.root_width < self.wind.width()) {
      this.widther = (self.wind.width() - self.root_width) / 2;
      if (!$.support.boxModel) {
        self.foot.width(self.root_width + (this.widther * 2));
        self.foot.css({
          'padding-left' : this.widther,
          'margin-left' : -this.widther
        });
      } else {
        self.foot.width(self.root_width + this.widther);
        self.foot.children('.boiler').andSelf().css({
          'padding-left' : this.widther,
          'margin-left' : -this.widther
        });
      }
    }
    if (self.root_height < self.wind.height()) {
      this.heighter = (self.wind.height() - self.root_height);
      self.foot.children('.boiler').height(self.foot_height + this.heighter);
    }
    else {
      self.foot.children('.boiler').css({
        'height' : 'auto'
      });
    }
  }
  
  this.container_position_fix = function(e) {
    if (self.wind.width() < self.root_width && !self.fixed) {
      self.fixed = true;
      self.root.css({'margin-left' : 'auto', 'left': 'auto'});
    } else if (self.wind.width() > self.root_width && self.fixed) {
      self.fixed = false;
      self.root.removeAttr('style');
    }
  }
  
  this.start_up = function() {
    self.wind.bind('resize', this.container_position_fix);
    self.wind.trigger('resize');
  }
  
  return this;
}
/* -----------------------------------------------------------
/* ------------------------- cLone ----------------------------
*/
function Framer(element) {
  for (var i = 0; i < element.length; i++) {
    element.eq(i).wrap('<span class="frame"></span>');
    if (element.eq(i).hasClass('right')) {
      element.eq(i).removeClass('right').parent().addClass('right');
    } else if (element.eq(i).hasClass('left')) {
      element.eq(i).removeClass('left').parent().addClass('left');
    }
  }
}
/* -----------------------------------------------------------
/* ------------------------- cLone ----------------------------
*/
function Table_styled(element) {
  var self = this;
  this.root = element;
  this.table_rows = this.root.find('tbody tr');
  for (var i = 0; i < this.table_rows.length; i++) {
    if (i % 2 == 0) {
      this.table_rows.eq(i).addClass('alt');
    }
  }
}
/* -----------------------------------------------------------
/* ------------------------- cLone ----------------------------
*/
function Three_columns(element) {
  var self = this;
  this.root = element.children('div, form, fieldset');
  for (var i = 0; i < this.root.length; i++) {
    if (i % 3 == 0) {
      this.root.eq(i).addClass('first');
    }
  }
}
/* -----------------------------------------------------------
/* ------------------------- cLone ----------------------------
*/
function Grid_fixer(element, number_in_row)  {
	var self = this;
	this.root = element;
	this.items = this.root.children();
	this.num_columns = number_in_row;
	this.current_row = new Array();
	this.row_height = 0;
	this.fix_heights = function()  {
	  for (var i = 0; i < self.items.length; i++) {
      if (i % self.num_columns == 0) {
        self.current_row = new Array();
        self.row_height = self.items.eq(i).height();
      }
      self.current_row.push(self.items.eq(i));
	    if (self.items.eq(i).height() > self.row_height) {
	      self.row_height = self.items.eq(i).height();
      } else {
        for (var j = 0; j < self.current_row.length; j++) {
  	      self.current_row[j].height(self.row_height);
  	    }
      }
    }
  }
	this.fix_heights();
}

function Popin_view() {
  var self = this;
  this.view = {
    popin : '',
    popin_title : '',
    popin_content : '',
    popin_actions : ''
  }
  
  this.view.make_popin = function() {
    self.view.popin = '';
    self.view.popin += '<div class="popin">';
      self.view.popin += '<div class="title">';
        self.view.popin += self.view.popin_title;
        self.view.popin += '<div class="actions">';
          self.view.popin += self.view.popin_actions;
        self.view.popin += '</div>';
      self.view.popin += '</div>';
      self.view.popin += '<div class="content">';
        self.view.popin += self.view.popin_content;
      self.view.popin += '</div>';
    self.view.popin += '</div>';
    return self.view.popin;
  }
  
  return this;
}

function Image_gallery_Popin_view() {
  var self = this;
  
  Popin_view.call(this);
  
  self.view.popin_title += '<h3> <img src="/images/global/logo_grey.png" alt="fawn&amp;forest" /> </h3>';
  
  self.view.popin_actions += '<img src="/images/global/icons/previous_arrow.png" alt="previous" />';
  self.view.popin_actions += '<img src="/images/global/icons/next_arrow.png" alt="next" />';
  self.view.popin_actions += '<img src="/images/global/icons/big_close.png" alt="close" class="close" />';
  
  return this;
}

function Plain_Popin_view() {
  var self = this;
  
  Popin_view.call(this);
  
  self.view.popin_actions += '<img src="/images/global/icons/medium_close.png" alt="close" class="close" />';
  
  return this;
}


