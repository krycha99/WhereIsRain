import { Component, OnInit } from '@angular/core';

declare const L: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'WhereIsRain';

  ngOnInit(){
    
    //Checking user location
    if(!navigator.geolocation){
      console.log('location is not supported');
    }
    navigator.geolocation.getCurrentPosition((position) => {
      // console.log(`lat: ${position.coords.latitude}, lon: ${position.coords.longitude}`);

     //map open
    var map = L.map('map').setView([position.coords.latitude, position.coords.longitude], 15);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

    //geocoding plugin(searchbar on map)
   L.tileLayer('https://{s}.tile.osm.org/{z}/{x}/{y}.png', {
     attribution: '&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
   }).addTo(map);
   L.Control.geocoder().addTo(map);

   //adding custom marker at startpoint
   const url =  'assets/rainy-1.svg';
    var customIcon = L.icon({
      
      iconUrl: url,
      iconSize:     [100, 150], // size of the icon
      shadowSize:   [50, 64], // size of the shadow
      iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
      shadowAnchor: [4, 62],  // the same for the shadow
      popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
  });
  L.marker([position.coords.latitude, position.coords.longitude], {icon: customIcon}, {alt: 'ogór rick'}).addTo(map) .bindPopup('You are here :)') ;
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }).addTo(map);

   });

   
    
   

  }
}
