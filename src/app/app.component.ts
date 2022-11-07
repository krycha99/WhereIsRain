import { Component, OnInit } from '@angular/core';
import { WeatherWidgetComponent } from "./Components/weather-widget/weather-widget.component"

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
        var crd = position.coords;
        var lat = crd.latitude.toString();
        var lng = crd.longitude.toString();
        var coordinates = [lat, lng];
      this.getCity(coordinates);
      //ustawiamy miasto
      
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

   //custom marker on searching
   var geocoder = L.Control.geocoder({
    defaultMarkGeocode: false
  })
    .on('markgeocode', function(e: { geocode: { name: any; center: any; bbox: any;  }; }) {


      //sprawdzanie pogody po elemencie
    //zdobycie nazwy miasta i zmiana na widgecie
          var latlng = e.geocode.center;
          
      let nameArr = e.geocode.name.split(",");
      console.log(nameArr);
      console.log("sama nazwa: " + nameArr[0]);
      const span = <HTMLElement>document.getElementById('cityName');
      span.textContent = nameArr[0];

      //sprawdzenie pogody po zmianie chyba
      const myTimeout = setTimeout(function(){
      const box = document.getElementById('testpogody') as HTMLDivElement | null;
      let sprawdzam = (<HTMLElement>document.getElementById("testpogody")).nodeValue;
      console.log(box?.innerHTML );
      let url;
      //wybór zdjecia do pogody
      //  Snow, Thunderstorm,   
      if(box?.innerHTML == "Haze" || box?.innerHTML == "Clouds"){
        url = 'assets/day/cloudy.svg';
      }
      else if(box?.innerHTML == "Rain") {
        url = 'assets/rainy-6.svg';
      }
      else if(box?.innerHTML == "Thunderstorm") {
        url = 'assets/thunder.svg';
      }
      else if(box?.innerHTML == "Snow") {
        url = 'assets/snowy-6.svg';
      }
      else {
        url = 'assets/day/day.svg';
      }
      var greenIcon = L.icon({
            
        iconUrl: url,

        iconSize:     [150, 250], // size of the icon
        shadowSize:   [100, 200], // size of the shadow
        iconAnchor:   [90, 220], // point of the icon which will correspond to marker's location
        shadowAnchor: [4, 62],  // the same for the shadow
        popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
 });

      var marker = L.marker(latlng,{icon: greenIcon}).addTo(map);
    }, 3500);
      map.fitBounds(e.geocode.bbox);
    })
    .addTo(map);

   //adding custom marker at startpoint
   const myTimeout = setTimeout(function(){
    let url =  'assets/rainy-1.svg';
    //wybór zdjecia do pogody
    const box = document.getElementById('testpogody') as HTMLDivElement | null;
    if(box?.innerHTML == "Haze" || box?.innerHTML == "Clouds"){
      url = 'assets/day/cloudy.svg';
    }
    else if(box?.innerHTML == "Rain") {
      url = 'assets/rainy-6.svg';
    }
    else if(box?.innerHTML == "Thunderstorm") {
      url = 'assets/thunder.svg';
    }
    else if(box?.innerHTML == "Snow") {
      url = 'assets/snowy-6.svg';
    }
    else {
      url = 'assets/day/day.svg';
    }
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
   }, 3500);
   

  
  

   });

   
    
   

  }
  getCity(coordinates: any[]) {
    var xhr = new XMLHttpRequest();
    var lat = coordinates[0];
    var lng = coordinates[1];
  
    // Paste your LocationIQ token below.
    xhr.open('GET', "https://us1.locationiq.com/v1/reverse.php?" + window.atob("a2V5PXBrLjNkNWFjNDc4NjQzODgzNTU1ZWIyNDg4MjM4NTQ0ODlhJmxhdD0=") +
    lat + "&lon=" + lng + "&format=json", true);
    xhr.send();
    xhr.onreadystatechange = processRequest;
    xhr.addEventListener("readystatechange", processRequest, false);
  
    function processRequest(e: any) {
        if (xhr.readyState == 4 && xhr.status == 200) {
            var response = JSON.parse(xhr.responseText);
            let city;
            //checking if its a village
            if( response.address.town != null) {
              city = response.address.town;
            } else {
              city = response.address.village;
            }
            
            console.log(city);
            const span = <HTMLElement>document.getElementById('cityName');
          span.textContent = city;
            return city;
        }
    }
}
}
