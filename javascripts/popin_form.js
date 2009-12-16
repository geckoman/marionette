/* -----------------------------------------------------------
/* ------------------------- cLone ----------------------------
*/
function Popn_form() {
  var self = this;
  this.url = this.root.attr('href');
  this.jaxer = $('#jax_container');
  this.form_title = '';
  this.current_popin = null;
  this.ajax_form = null
  
  this.start_up = function() {
    self.root.bind('click', self.openForm);
  }
  
  this.popin_whipup = function(html) {
    var popin = new Plain_Popin_view();
    popin.view.popin_title += '<h4>' + self.form_title + '</h4>';
    popin.view.popin_content += '<div class="deskman">';
    popin.view.popin_content += html;
    popin.view.popin_content += '</div>';
    self.current_popin = new Popin(popin);
    self.current_popin.plugin_popin(self.jaxer);
    self.ajax_form = self.current_popin.popin.find('form');
    console.log(self.ajax_form);
  }

  this.filter_response = function(html) {
    var tempHtml = $(html).find('div.form_notifier');
    self.ajax_form.find('div.form_notifier').remove();
    if (tempHtml.hasClass('failure')) {
      self.ajax_form.prepend(tempHtml);
    }
    else {
      self.ajax_form.html("<h4> Success </h4>");
      self.current_popin.close_popin();
    }
  }
  
  this.send_data = function(e) {
    e.preventDefault();
    $.ajax({
      url: self.url,
      type: "POST",
      data: self.ajax_form.serialize(),
      async: false,
      success: self.filter_response
    });
    return false;
  }
  
  this.create_form = function(html) {
    self.popin_whipup(html);
    self.ajax_form.bind('submit', self.send_data)
  }
  
  this.openForm = function(e) {
    e.preventDefault();
    self.root.unbind('click', self.openForm);
    $.ajax({
      url: self.url,
      async: false,
      success: self.create_form
    });
  }	
  return this;
}

function Email_page() {
  Popn_form.call(this);
  this.url = '/contact/refer?ajax=true';
  this.form_title = 'Email this Page to a Friend';
  return this;
}

function Personal_contact() {
  Popn_form.call(this);
  this.url = this.root.attr('href') + '&ajax=true';
  this.form_title = 'Send a personal Email';
  return this;
}
