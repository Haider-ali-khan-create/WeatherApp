let para=document.querySelectorAll("p");
let temp=para[0];
let climate=para[1];
let latt=0;
let long=0;
let loc=document.querySelector("input");
let button=document.querySelector("button");
let body=document.querySelector("body");
let address=document.querySelector("#loc");
let bg = document.getElementById("bg");


const fetchWeather = ()=> {
    let city=loc.value;
    if(city===''){
        city='prayagraj';
    };
    let url=`http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=4&appid=${API_KEY}`;
    let geos=`https://api.geoapify.com/v1/geocode/search?text=${city}&format=json&apiKey=${GEO_KEY}`;
    hai(url,geos);
}
const hai= async (url,geos)=>{
    let response = await fetch(url);
    let data =await response.json();
    let geoResponse= await fetch(geos);
    let geoData= await geoResponse.json();
    let match = data.find(i => i.country === "IN");
    let match2 = geoData.results.find(j => j.country === "India");
    
    address.innerText='';
    if (match) {
        latt = match.lat;
        long = match.lon;
        address.innerText=`${match.name}, ${match.state}`;
    }else if(match2){
        latt = match2.lat;
        long = match2.lon;
        address.innerText=`${match2.formatted}`;
    }else {
        alert("not found");
    }
    let weather=`https://api.openweathermap.org/data/2.5/weather?lat=${latt}&lon=${long}&appid=${API_KEY}`;
    let weatherLink=await fetch(weather);
    let data2=await weatherLink.json();
    let climateDes=data2.weather[0].description;
    climate.innerText=climateDes;
    let climateBag=data2.weather[0].main;
    let tempUnit=`${(data2.main.temp-273.15).toFixed(1)}°`;
    temp.innerText=tempUnit;
    //animation
    bg.style.opacity = 0;
    setTimeout(() => {
        bg.className = '';
        if (climateBag === 'Clear')                                  bg.className = 'clear';
        else if (climateBag === 'Clouds')                            bg.className = 'cloudy';
        else if (climateBag === 'Rain' || climateBag === 'Drizzle')  bg.className = 'rainy';
        else if (climateBag === 'Snow')                              bg.className = 'snowy';
        else                                                         bg.className = 'stormy';
        bg.style.opacity=1;
    }, 600);
}
button.addEventListener("pointerup",fetchWeather);
loc.addEventListener("keydown", (e)=>{
    if(e.key==="Enter") fetchWeather();
});


// let suggestions = document.getElementById("suggestions");
// loc.addEventListener("input", async () => {
//     let cityy = loc.value.trim();
    
//     if (cityy.length < 2) {       // don't search for 1 letter
//         suggestions.style.display = "none";
//         suggestions.innerHTML = "";
//         return;
//     }

//     let urll = `http://api.openweathermap.org/geo/1.0/direct?q=${cityy}&limit=5&appid=${API_KEY}`;
//     let resa = await fetch(urll);
//     let dataa = await resa.json();

//     // filter and show suggestions
//     suggestions.innerHTML = "";
//     if (dataa.length === 0) {
//         suggestions.style.display = "none";
//         return;
//     }

//     suggestions.style.display = "block";
//     dataa.forEach(place => {
//         let div = document.createElement("div");
//         div.textContent = `${place.name}, ${place.state ? place.state + ", " : ""}${place.country}`;
//         div.addEventListener("click", () => {
//             loc.value = place.name;
//             suggestions.style.display = "none";
//             suggestions.innerHTML = "";
//             fetchWeather();   // trigger search directly on click
//         });
//         suggestions.appendChild(div);
//     });
// });

// // hide suggestions when clicking outside
// document.addEventListener("click", (e) => {
//     if (!e.target.closest(".search") && e.target !== suggestions) {
//         suggestions.style.display = "none";
//     }
// });