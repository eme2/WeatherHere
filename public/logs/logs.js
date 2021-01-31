getData();

async function getData() {
    const response = await fetch('/api');
    const data = await response.json();
    //document.getElementById("content").textContent = data;
    // affichage des informations
    for (item of data) {
        const root = document.createElement("p");
        const timestamp = document.createElement('div');
        const geo = document.createElement('div');

        const ds = new Date(item.timestamp).toLocaleString();
        timestamp.innerText = ds;
        geo.innerText = `coordonnées : ${item.lat}°,${item.lng}°`;
        
        root.append(timestamp, geo);
        document.body.append(root);
    }
    console.log(data);
}