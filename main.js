
//get WoeID
const getWoe = async (Location) => {
    const data = await fetch(`https://www.metaweather.com/api/location/search/?query=${Location}`).then(async (res) => await res.json()).then(async (json) => await json);
    return data;
}

const getForecast = async (Location, Date) => {
    const data = await fetch(`https://www.metaweather.com/api/location/${Location}/${Date}/`).then(async (res) => await res.json()).then(async (json) => await json);
    return data;
}

//compile datagathering in one funct coz i'm lazy
const getData = async (Location) => {
    const output = {
        consolidatedWeather:[],
        forecast:[]
    }
    const woeID = await getWoe(Location);
    console.log(woeID)
    for(i = 0; i <= 5; i++){
        var today = new Date();
        var date = today.getFullYear()+'/'+(today.getMonth()+1)+'/'+(today.getDate()+i);
        let result = await getForecast(woeID[0].woeid, date);
        console.log("this is result" + i + result)
        output.consolidatedWeather[i] = result[0];
    }
    return output;
}

async function cast (Location){
    const data = await getData(Location)
    return data;
}

//change this function to change cities
document.addEventListener('DOMContentLoaded', async() => {
    console.log(await cast("London"))
})
