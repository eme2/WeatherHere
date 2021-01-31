
const attribution = '&copy; <a href="http://www.openstreetmap.org/copyright">openstreetmap</a> contributors';
const tileURL = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

getData();
async function getData() {
    const response = await fetch('/api');
    const data = await response.json();
    
    mymap = L.map('Map').setView([48.6333756, 7.7427876], 5);
    const tiles = L.tileLayer(tileURL , {attribution, noWrap: true});

    tiles.addTo(mymap);
    // L.marker([lat, lng]).addTo(mymap);

    //document.getElementById("content").textContent = data;
    // affichage des informations
    for (item of data) {
        const marker = L.marker([item.lat, item.lng]).addTo(mymap);
        const root = document.createElement("p");
        const timestamp = document.createElement('div');
        const geo = document.createElement('div');

        const ds = new Date(item.timestamp).toLocaleString();
        const weather = item.weather;
        timestamp.innerText = ds;
        const txt = `coordonnées : ${item.lat.toFixed(2)}°,${item.lng.toFixed(2)}° ${weather.name} : Température : ${weather.main.temp.toFixed(1)}° : ${weather.weather[0].description}`;
        geo.innerText = txt;
        marker.bindPopup(txt);
        root.append(timestamp, geo);
        document.body.append(root);
    }
    console.log(data);
}