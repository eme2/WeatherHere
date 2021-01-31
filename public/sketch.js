let data = null;
let mymap;

console.log("c'est parti ....");

console.log("setup...");
const attribution = '&copy; <a href="http://www.openstreetmap.org/copyright">openstreetmap</a> contributors';
const tileURL = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';


if ("geolocation" in navigator) {
    var gps = navigator.geolocation.getCurrentPosition(
        async function (position) {
            lat = position.coords.latitude;
            lng = position.coords.longitude;
            document.getElementById("latitude").textContent = lat.toFixed(2);
            document.getElementById("longitude").textContent = position.coords.longitude.toFixed(2);
            const api_url = `/weather/${lat},${lng}`;
            console.log(api_url);
            const response = await fetch(api_url);
            const json = await response.json();
            console.log(json);
            const weather = json.weather;
            const temp = weather.main.temp;
            const lieu = weather.name;
            const weather_ow = weather.weather[0].description;
            const tempIci = json.ici.temp;
            const dateIci = json.ici.date;
            document.getElementById("temp").textContent = temp.toFixed(1);
            document.getElementById("lieu").textContent = lieu;
            document.getElementById("desc").textContent = weather_ow;
            document.getElementById("tempIci").textContent = tempIci;
            document.getElementById("dateIci").textContent = dateIci;
            data = {lat, lng, weather};
            const options = {
                method: 'POST',
                headers: {"Content-Type": "application/json; charset=UTF-8"},
                body: JSON.stringify(data)
            };
            const response_db = await fetch("/api", options);
            const json_db = await response_db.json();
            console.log(json_db);
            },
            function error(err) {
            console.warn(`ERREUR (${err.code}): ${err.message}`);
            }
    );
} else {
    document.write("L'api de géolocalisation n'est pas autorisée");
}

async function send () {
if (data) {
    console.log(data);

    const options = {
                method: 'POST',
                headers: {"Content-Type": "application/json; charset=UTF-8"},
                body: JSON.stringify(data)
            };
    const response = await fetch('/weather', options);
    const json = await response.json();
    console.log(json);
    
    
}

}