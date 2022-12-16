let map;
const Home = {lat:40.730610 ,lng:-73.935242};

function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 40.730610, lng: -73.935242 },
    zoom: 8,
  });
}

function addMarker(location)
{
    const marker = new google.maps.Marker({
        position: location,
        map: map,
      });

      map.setZoom(13);
      map.panTo(marker.position);
}

window.initMap = initMap;
