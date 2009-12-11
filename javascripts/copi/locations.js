function Locator() {
  var self = this;
  var api_key = 'ABQIAAAA0ncOW-xlUJ_xndBjTlNftRQTzofM4o87mKyViKNclpuppsWWExS9dIXB9q8cKuC7V_VEWRLaSG8qPw';
  this.location_page = this.root;

  //this.location_page.find('#gmap').append('<div id="g_street_view"></div>')
 // this.g_street = this.location_page.find('#g_street_view')[0];
  
  this.g_map = this.location_page.find('#gmap')[0];
  this.locations = null;
  this.geocode_elements = null
  this.location_filter = this.location_page.children('#location_filter');

  this.geocodes = new Array();
  this.markers = new Array();
  this.location_data = new Array();
    
  this.start_up = function() {
    $.getScript('http://www.google.com/jsapi?key=' + api_key, self.initiate_map);
    self.location_filter.bind('submit', self.map_change);
    $(window).bind('unload', self.destroy_map);
  }
    
  this.destroy_map = function() {
    google.maps.Unload();
  }
  
  this.reload_locations = function(json, status) {
    eval('self.locations = ' + json);
    self.redraw_map();
  }
  
  this.map_change = function(e) {
    e.preventDefault();
    var me = $(e.currentTarget);
    $.ajax({
  		type: "GET",
  		datatype: 'json',
  		url: me.attr('action'),
  		contentType: "application/json",
  		scriptCharset: 'utf-8',
  		data: me.serialize(),
  		success: self.reload_locations
  	});
  }
  
  this.cache_geocodes = function() {
    self.geocode_elements = self.locations.results;
    self.geocodes = new Array();
    self.markers = new Array();
    self.location_data = new Array();
    var j = 0;
    for (i in self.geocode_elements) {
      self.location_data[j] = self.geocode_elements[i];
      self.geocodes[j] = new google.maps.LatLng(Number(self.geocode_elements[i].geocode.latitude), Number(self.geocode_elements[i].geocode.longitude));
      self.markers[j] = new google.maps.Marker(self.geocodes[j]);
      j++;
    }
  }
  
  this.inner_map_bubble = function(json_content) {
    var content = '<div class="map_location_contact">'
    content += '<h3 style="margin-left: 10px;">' + json_content.story_category + '</h3>';
    content += '<p style="margin-left: 10px;"> County <strong>' + json_content.additional_info.county + '</strong>';
    content += 'Industry <strong>' + json_content.industry + '</strong> </p>';
    content += '<div class="image-holder"><div class="lt"><div class="rb">';
    content += '<img src="' + json_content.img_path + '" alt="' + json_content.headline + '" width="272" height="163" />';
    content += '<div class="rt"></div><div class="lb"></div></div></div></div>';
    content += '<div style="width: 46%; float: right;">';
    content += '<h4>' + json_content.headline + '</h4>';
    content += '<p>' + json_content.description + '</p>';
    content += '<a href="/story.php?storyID=' + json_content.additional_info.id + '">' + json_content.link_label + '</h3>';
    content += '</div>';
    return content;
  }
  
  this.maker_marker = function(iter) {
    google.maps.Event.addListener(self.markers[iter], "click", function(latlng) {
      //self.g_street.setLocationAndPOV(latlng);
      self.g_map.panTo(latlng, true);
      self.g_map.openInfoWindowHtml(latlng, self.inner_map_bubble(self.location_data[iter]))
    });
    self.g_map.addOverlay(self.markers[iter]);
  }
  
  this.redraw_map = function() {
    self.g_map.clearOverlays();
    
    self.cache_geocodes();
    self.g_map.setCenter(self.geocodes[0], 11);
    //self.g_street.setLocationAndPOV(self.geocodes[0]);
    for (var i = 0; i < self.markers.length; i++) {
      self.maker_marker(i);
    }
  }
  
  this.build_map = function() {
    self.g_map = new google.maps.Map2(self.g_map);
    //self.g_street = new google.maps.StreetviewPanorama(self.g_street);
    var customUI = self.g_map.getDefaultUI();
    customUI.zoom.scrollwheel = false;
    customUI.maptypes.physical = true;
    self.g_map.setUI(customUI);
    self.g_map.setMapType(self.g_map.getMapTypes()[3]);
    self.g_map.enableContinuousZoom();
    self.location_filter.trigger('submit');
  }
  
  this.initiate_map = function() {
    google.load("maps", "2", {"callback" : self.build_map});
  }
  
  return this;
}