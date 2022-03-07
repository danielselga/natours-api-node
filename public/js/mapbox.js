
const locations = JSON.parse(document.getElementById('map').dataset.locations);
console.log(locations);

mapboxgl.accessToken =
  'pk.eyJ1IjoiZGFuaWVsc2VsZ2EiLCJhIjoiY2wwaDA5amhpMDN4dTNibnlqczN1cm1mYSJ9.E8x9pjZTSePh0oPiOxgFOg';

const map = new mapboxgl.Map({
  container: 'map', // container ID
  style: 'mapbox://styles/danielselga/cl0h2nlsk000914kwhz60ocq7/draft', // style URL
  scrollZoom: false
  // center: [-74.5, 40], // starting position [lng, lat]
  // zoom: 9, // starting zoom,
  // interactive: false
});

const bounds = new mapboxgl.LngLatBounds();

locations.forEach((loc) => {
  // Add marker
  const el = document.createElement('div');
  el.className = 'marker';

  new mapboxgl.Marker({
    element: el,
    anchor: 'bottom',
  })
    .setLngLat(loc.coordinates)
    .addTo(map);

  new mapboxgl.Popup({
      offSet:30
  }).setLngLat(loc.coordinates).setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`).addTo(map)

  bounds.extend(loc.coordinates, );
});

map.fitBounds(bounds, {
    padding: {
      top: 200,
      bottom: 150,
      left: 100,
      right: 100,
    },
  });
