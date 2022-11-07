import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-weather-widget',
  templateUrl: './weather-widget.component.html',
  styleUrls: ['./weather-widget.component.css']
})
export class WeatherWidgetComponent implements OnInit {
  
  WeatherData:any;
  constructor() { }

  ngOnInit(): void {
    //default values for app start
    let data = JSON.parse('{"coord":{"lon":72.85,"lat":19.01},"weather":[{"id":721,"main":"Haze","description":"haze","icon":"50n"}],"base":"stations","main":{"temp":297.15,"feels_like":297.4,"temp_min":297.15,"temp_max":297.15,"pressure":1013,"humidity":69},"visibility":3500,"wind":{"speed":3.6,"deg":300},"clouds":{"all":20},"dt":1580141589,"sys":{"type":1,"id":9052,"country":"IN","sunrise":1580089441,"sunset":1580129884},"timezone":19800,"id":1275339,"name":"Mumbai","cod":200}');
    this.setWeatherData(data);
    this.getWeatherData();
    //chek for searched place, if it is connect api for new result
  setInterval(() => {
    const span = document.getElementById('cityName') as HTMLDivElement | null;
    if(span?.innerHTML != this.WeatherData.name){
      this.getWeatherDataByName(span?.innerHTML);
      }
    }, 1000);
  }

  getWeatherData(){
    fetch('https://api.openweathermap.org/data/2.5/weather?q=London&' + window.atob("YXBwaWQ9Y2ZhZTJlMjFkN2JlZDc0NWVlOGU3ZjJiZTYxMWU5ZTI="))
    .then(response=>response.json())
    .then(data=>{this.setWeatherData(data);})
  }

  getWeatherDataByName(city: any){
    fetch('https://api.openweathermap.org/data/2.5/weather?q=' + city +'&' + window.atob("YXBwaWQ9Y2ZhZTJlMjFkN2JlZDc0NWVlOGU3ZjJiZTYxMWU5ZTI="))
    .then(response=>response.json())
    .then(data=>{this.setWeatherData(data);})

  }

  setWeatherData(data: any){
    this.WeatherData = data;
    let sunsetTime = new Date(this.WeatherData.sys.sunset * 1000);
    this.WeatherData.sunset_time = sunsetTime.toLocaleDateString();
    let currentDate = new Date();
    this.WeatherData.isDay = (currentDate.getTime() < sunsetTime.getTime());
    this.WeatherData.temp_celcius = (this.WeatherData.main.temp - 273.15).toFixed(0);
    this.WeatherData.temp_min = (this.WeatherData.main.temp_min - 273.15).toFixed(0);
    this.WeatherData.temp_max = (this.WeatherData.main.temp_max - 273.15).toFixed(0);
    this.WeatherData.temp_feels_like = (this.WeatherData.main.feels_like - 273.15).toFixed(0);
    this.WeatherData.weatherType = this.WeatherData.weather[0].main;
    if(this.WeatherData.weatherType != "Clear")
    {
      this.WeatherData.isCloud = true;
    }
    else{
      this.WeatherData.isCloud = false;
    }
  }

}
