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
      //setting cords for lookig city
        let crd = position.coords;
        let lat = crd.latitude.toString();
        let lng = crd.longitude.toString();
        let coordinates = [lat, lng];
      this.getCity(coordinates);
      //setting city
      
     //map open
    let map = L.map('map').setView([position.coords.latitude, position.coords.longitude], 14);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

    //geocoding plugin(searchbar on map)
   L.tileLayer('https://{s}.tile.osm.org/{z}/{x}/{y}.png', {
     attribution: '&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
   }).addTo(map);

   //custom marker on searching
   let geocoder = L.Control.geocoder({
    defaultMarkGeocode: false
  })
    .on('markgeocode', function(e: { geocode: { name: any; center: any; bbox: any;  }; }) {

      //Getting name of thhe city and changin it for currently
          let latlng = e.geocode.center;
          
      let nameArr = e.geocode.name.split(",");
      // console.log(nameArr);
      // console.log("sama nazwa: " + nameArr[0]);
      const span = <HTMLElement>document.getElementById('cityName');
      span.textContent = nameArr[0];

      //cheking weather
      const myTimeout = setTimeout(function(){
      const box = document.getElementById('testpogody') as HTMLDivElement | null;
      let sprawdzam = (<HTMLElement>document.getElementById("testpogody")).nodeValue;
      // console.log(box?.innerHTML );
      let url;
      //  Cheking weather to chose image,   
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
      let markIcon = L.icon({
            
        iconUrl: url,

        iconSize:     [150, 250], // size of the icon
        shadowSize:   [100, 200], // size of the shadow
        iconAnchor:   [90, 180], // point of the icon which will correspond to marker's location
        shadowAnchor: [4, 62],  // the same for the shadow
        popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
 });

      let marker = L.marker(latlng,{icon: markIcon}).addTo(map);
    }, 1500);
      map.fitBounds(e.geocode.bbox);
    })
    .addTo(map);

   //adding custom marker at startpoint
   const myTimeout = setTimeout(function(){
    let url =  'assets/rainy-1.svg';
    //cheking img for weather
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
      let customIcon = L.icon({
        
        iconUrl: url,
        iconSize:     [150, 250], // size of the icon
        shadowSize:   [100, 200], // size of the shadow
        iconAnchor:   [100, 180], // point of the icon which will correspond to marker's location
        shadowAnchor: [4, 62],  // the same for the shadow
        popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
    });
    L.marker([position.coords.latitude, position.coords.longitude], {icon: customIcon}, {alt: 'ogór rick'}).addTo(map) .bindPopup('You are here :)') ;
          L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);
   }, 1500);
   

  });

 }
  getCity(coordinates: any[]) {
    let xhr = new XMLHttpRequest();
    let lat = coordinates[0];
    let lng = coordinates[1];
  
    // locationIQ api.
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
            
            // console.log(city);
            const span = <HTMLElement>document.getElementById('cityName');
          span.textContent = city;
            return city;
        }
    }
}
}
