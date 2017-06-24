$(function() {
  var params = {
    key: 'wFTSIH61nwMjLBhphd4T',
    query: "SELECT * FROM 'home' ORDER BY `date` DESC"
  };

  var allData = null;
  var marker = null;
  var themap = null;
  var current = 0;

  function setupMarker(d) {
    var d = allData[current];
    marker.setLatLng([d.lat, d.lng]);

    var wasis = 'was';
    if (current == 0) {
      wasis = 'is';
    }
    var msg = '';
    msg += '<div class="popupmsg"><h1>Jasmine ' + wasis + ' here</h1>';
    msg += '<h2><em>near ' + d['location'] + '</em></h2>'
    if (current == 0) {
      msg += '<p>Arrived ' + moment(d['date']).fromNow() + '.</p>';
    } else {
      var endDate = moment(allData[current-1]['date']);
      msg += '<p>' + moment(d['date']).format('Do MMMM') + '&ndash;' + endDate.format('Do MMMM');
      msg += ' (' + endDate.fromNow() + ')</p>'
    }
    msg += '</div><p><a href="#" class="prev">&larr;</a>';
    if (current != 0) {
      msg += '<a href="#" class="next pull-right">&rarr;</a>';
    }
    msg += '</p>';

    var popup = marker.getPopup();
    popup.setContent(msg);

    themap.panTo([d.lat, d.lng], {duration: 4});
  }

  $.ajax({
    url: 'https://api.morph.io/andylolz/boat/data.json?' + $.param(params),
    dataType: 'jsonp',
    success: function(data) {
      allData = data;

      var d = data[0];
      themap = L.map('mapid').setView([d['lat'], d['lng']], 12);
      L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png').addTo(themap);
      marker = L.marker([d['lat'], d['lng']])
          .bindPopup('')
          .addTo(themap)
          .openPopup();

      setupMarker(d);
    }
  });

  $('body').on('click', '.prev', function() {
    current += 1;
    setupMarker();
    return false;
  });

  $('body').on('click', '.next', function() {
    current -= 1;
    setupMarker();
    return false;
  });
});
