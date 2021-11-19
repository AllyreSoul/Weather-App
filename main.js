const doc = {
    city:[],
    date:[],
    temp:[],
    weatherimg:[],
    weather:[],
    humidity:[],
    windspeed:[],
    airpressure:[],
    citysearch:""
}
const forcastLength = 5;
let woe = null;
let Forecast = null;
let process = false;
//get WoeID
const getWoe = async (Location) => {
    const data = await fetch(`http://cors.io/?https://www.metaweather.com/api/location/search/?query=${Location}`)
    .then(async (res) => await res.json())
    .then(async (json) => await json);
    return data;
}

const getForecast = async (Location, Date) => {
    const data = await fetch(`http://cors.io/?https://www.metaweather.com/api/location/${Location}/${Date}/`)
    .then(async (res) => await res.json())
    .then(async (json) => await json);
    return data;
}

//compile datagathering in one funct coz i'm lazy
const getData = async (Location) => {
    const output = {
        consolidatedWeather:[],
    }
    woe = await getWoe(Location);
    if(!woe[0]?.title ||woe[0]?.title != Location) {
        alert("City not found")
        process = false;
        return;
    }
    for(i = 0; i <= forcastLength; i++){
        var today = new Date();
        var date = today.getFullYear()+'/'+(today.getMonth()+1)+'/'+(today.getDate()+i);
        let result = await getForecast(woe[0].woeid, date);
        result[0].min_temp = Math.ceil(result[0].min_temp);
        result[0].max_temp = Math.ceil(result[0].max_temp);
        result[0].wind_speed = Math.ceil(result[0].wind_speed);
        result[0].air_pressure = Math.ceil(result[0].air_pressure);
        output.consolidatedWeather[i] = result[0];
        
    };
    console.log(woe);
    return output;
}

const cast = async (Location) =>{
        const data = await getData(Location)
        return await data
}

//change this function to change cities
document.addEventListener('DOMContentLoaded', async() => {
    setHtml();
    updatehtml("London");
})

function setHtml(){
    for(i = 0; i <= forcastLength; i++){
    doc.city[i] = document.getElementById(`city${i}`);
    doc.date[i] = document.getElementById(`date${i}`);
    doc.temp[i] = document.getElementById(`temp${i}`);
    doc.weatherimg[i] = document.getElementById(`weatherimage${i}`);
    doc.weather[i] = document.getElementById(`weather${i}`);
    doc.humidity[i] = document.getElementById(`humidity${i}`);
    doc.windspeed[i] = document.getElementById(`windspeed${i}`)
    doc.airpressure[i] = document.getElementById(`air-pressure${i}`);
    doc.citysearch = document.getElementById("citySearch")
    }
    console.log(doc);
}

async function updatehtml(cityName){
    Forecast = await cast(cityName).then(Forecast => {
        doc.city[0].innerHTML = `Weather in ${woe[0].title}`
        for(i = 0; i <= forcastLength; i++){
            doc.date[i].innerHTML = `${Forecast.consolidatedWeather[i].applicable_date}`
            doc.temp[i].innerHTML = `${Forecast.consolidatedWeather[i].min_temp}\xB0/${Forecast.consolidatedWeather[i].max_temp}\xB0C`
            doc.weatherimg[i].src = `http://cors.io/?https://www.metaweather.com/static/img/weather/png/64/${Forecast.consolidatedWeather[i].weather_state_abbr}.png`
            doc.weather[i].innerHTML = `${Forecast.consolidatedWeather[i].weather_state_name}`
            doc.humidity[i].innerHTML = `${Forecast.consolidatedWeather[i].humidity}`
            doc.windspeed[i].innerHTML = `${Forecast.consolidatedWeather[i].wind_speed} Mph`
            doc.airpressure[i].innerHTML = `${Forecast.consolidatedWeather[i].air_pressure} Mbar`
        } 
        process = false
        return Forecast
    })
}
function updateCity(){
    if(process){
        alert("Please wait, processing previous request..")
        return;
    }else process = true
    setHtml();
    updatehtml(doc.citysearch.value);    
}
