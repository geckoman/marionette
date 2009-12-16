function Load_shadow_box(element, extention) {
  var self = this;
	this.root = element;
	this.playa = false;

	switch (extention) {
	  case 'mov': case 'mp4':
	    this.playa = 'qt';
	    break;
	  case 'flv':
	    this.playa = 'flv';
	    break;
	  case 'swf':
	    this.playa = 'swf';
	    break;
	  case 'jpg': case 'jpeg': case 'png': case 'tiff': case 'gif':
	    this.playa = false;
	  default : 
	    return false;
  }
  
  this.load_gallery = function(e) {
		e.preventDefault();
		jQuery.getJSON("files/listing" + dir.toString().replace('/system/uploads', ""), function(data) {
			var shadow_hidden = new Array();
			for (var i = 0; i < data.assets.length; i++) {
				shadow_hidden[i] = new Object();
				shadow_hidden[i].content = dir + data.assets[i].filename;
				shadow_hidden[i].player = 'img';
				shadow_hidden[i].gallery = (/[^.]+$/).exec(dir);
			}
			Shadowbox.open(shadow_hidden);
		});
  }
  this.load_media = function(e) {
		Shadowbox.open({
		    title: $(this).attr('title'),
				player: self.playa,
				content:	$(this).attr('href')
		});
  }
  
  if (this.playa) {
    this.root.bind('click', this.load_gallery);
  } else {
    this.root.bind('click', this.load_media);
  }
}
