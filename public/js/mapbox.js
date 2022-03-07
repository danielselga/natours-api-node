const locations = JSON.parse(document.getElementById('map').dataset.locations)

mapboxgl.accessToken = 'pk.eyJ1IjoiZGFuaWVsc2VsZ2EiLCJhIjoiY2wwaDB6ZG85MDQ1ajNrbzNhZXg1b2dlYSJ9.GuRhgi1nQPNlZxTsC0WV4A';

const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/streets-v11', // style URL
    center: [-74.5, 40], // starting position [lng, lat]
    zoom: 9 // starting zoom
});