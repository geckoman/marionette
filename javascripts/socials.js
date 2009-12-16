/* -----------------------------------------------------------
/* ------------------------- cLone ----------------------------
*/
function Socials(element) {
  var self = this;
  this.social_bar = element;
  this.social_links = this.social_bar.find('a');
  
  this.page_local = document.URL;
  this.page_title = document.title;
  
  this.social_function = function(e) {
    e.preventDefault();
    window.open($(e.currentTarget).data('socialize'), '_blank');
  }
  
  this.social_hookup = function(linker, social_type, post_location) {
    
    switch (social_type) {
      case 'Delicious':
        their_local = post_location + "?v=4;url="+ this.page_local + ";title="+ this.page_title;
        break;
      case 'Stumbleupon':
        their_local = post_location + "?url="+ this.page_local + "&title="+ this.page_title;
        break;
      case 'Reddit':
        their_local = post_location + "?url="+ this.page_local;
        break;
      case 'Google':
        their_local = post_location + "?op=edit&output=popup&" +
        "bkmk="+ this.page_local + "&title="+ this.page_title;
        break;
      case 'Yahoo':
        their_local = post_location + "?u="+ this.page_local;
        break;
      case 'Facebook':
        their_local = post_location + "?u="+ this.page_local + "&t="+ this.page_title;
        break;
      case 'Myspace':
        their_local = post_location + "?u="+ this.page_local + "&t="+ this.page_title;
        break;
      case 'Twitter':
        their_local = post_location + "?status=Add+This:+"+ this.page_local + "";
        break;
      case 'Digg':
        their_local = post_location + "?url="+ this.page_local + "&title="+ this.page_title + 
        "&bodytext="+ this.page_title + "&media=video&topic=something";
        break;
      case 'Kirtsy':
        their_local = post_location + "?url="+ this.page_local;
        break;
      case 'Technorati':
        their_local = post_location + "?sub=favthis&add="+ this.page_local;
        break;
      default :
        break;
    }
    linker.data('socialize', thier_local);
    linker.bind('click', self.social_function);
  }
  
  for (var i = 0; i < this.social_links.length; i++) {
    var temp_link = this.social_links.eq(i)
    this.social_hookup(temp_link, temp_link.attr('title'), temp_link.attr('href'));
  }
  
}
/* -----------------------------------------------------------
/* ------------------------- cLone ----------------------------
*/
function Social_expander(element) {
  var self = this;
  this.root = element;
  
  this.socials = this.root.children('ul').css('height', 'auto');
  this.ego = this.socials.height();
  this.socials.css('height', '0');
  this.root.children('h6').append('<em> click to share </em>');
  
  this.root.children('h6').toggle(function() {
    self.socials.animate({
      height: self.ego
    }, {duration: 350, 
      easing: "easeOutQuad",
      queue: false
    })
    self.socials.animate({
      opacity: 1
    }, {duration: 250, 
      easing: "easeOutQuad",
      queue: false,
      complete: function() {
        self.socials.css({opacity: ''});
      }
    });
  }, function() {
    self.socials.animate({
      height: 0,
      opacity: 0
    }, {duration: 350, 
      easing: "easeOutQuad",
      queue: false
    });
  });
}
