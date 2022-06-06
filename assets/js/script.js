var apiKey = "d0cb8cd20790977405d779960bbd6f85";
var pastCities = JSON.parse(localStorage.getItem("pastCities")) || [];
var clear = document.getElementById("clear");
var currentCity = document.getElementById('search');
var searchBtn = document.getElementById('searchBtn');
var locations = document.getElementById("locations");
var fiveDay = document.getElementById('5day');


function searchCity (searchCity) {
    fetch("http://api.openweathermap.org/geo/1.0/direct?q=" + searchCity + "&limit=1&appid=" + apiKey).then(response => {
        console.log(response);
        return response.json();
    }).then(data => {
        $("#current").empty();
        getCurrentWeather(data, data[0].name);
    });
}

function getCurrentWeather (data, cityName) {

    fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${data[0].lat}&lon=${data[0].lon}&units=imperial&exclude=alerts&appid=${apiKey}`).then(response => {
        return response.json();
    }).then(data2 => {
        console.log(data2)
        var card = $("<div>").addClass("card");
        var cardTitle = $("<h2>").addClass("card-title").text(cityName);
        var temp = $("<h3>").addClass("card-text").text(Math.round(data2.current.temp) + "°")
        $("#current").append(card.append(cardTitle, "Temp: ", temp));
        var humidity = $("<h3>").addClass("card-text").text(data2.current.humidity  + " %")
        $("#current").append(card.append("Humidity: ", humidity));
        var windSpeed = $("<h3>").addClass("card-text").text(data2.current.wind_speed + " mph")
        $("#current").append(card.append("Wind Speed: ", windSpeed));
        var uvi = $("<h3>").addClass("card-text uvi").text(data2.current.uvi)
        $("#current").append(card.append("UV Index: ", uvi));
        if (data2.current.uvi >= 0 && data2.current.uvi <= 3) {
            uvi.addClass("low");
        } else if (data2.current.uvi >= 3 && data2.current.uvi <=5) {
            uvi.addClass("moderate");
        } else {
            uvi.addClass("severe")
        }

        buildFiveDay (data2);
    });
}

function buildFiveDay (data) {
    console.log(data);
    fiveDay.innerHTML = "";
    for (var i = 1; i < 6; i++) {
        console.log(data.daily[i]);
        var dailyWeather = data.daily[i];
        var momentDates = moment.unix(dailyWeather.dt).format("ddd");
        var icon = $("<img>").attr("src", `http://openweathermap.org/img/wn/${dailyWeather.weather[0].icon}@2x.png`);
        var card = $("<div>").addClass("card col-lg-2 col-md-2 col-sm-12 m-1 d-flex flex-wrap flex-lg-wrap ");
        var cardTitle = $("<h2>").addClass("card-title").text(momentDates);
        var temp = $("<h3>").addClass("card-text").text("Temp: " + dailyWeather.temp.day + "°");
        var windSpeed = $("<h3>").addClass("card-text").text("Wind Speed: " + dailyWeather.wind_speed + "mph");
        var humidity = $("<h3>").addClass("card-text").text("Humidity: " + dailyWeather.humidity + "%");
        $("#5day").append(card.append(cardTitle.append(icon), temp, windSpeed, humidity));

        console.log(momentDates);
    }
}

clear.addEventListener("click", function () {
    localStorage.clear();
    console.log("cleared")
})

searchBtn.addEventListener("click", function (){
    console.log(currentCity.value);
    var city = currentCity.value;
    if (pastCities.indexOf(city) === -1) {
        pastCities.push(city);
        localStorage.setItem("pastCities", JSON.stringify(pastCities));
    }
searchCity(city);
})

function getPastCities () {
    locations.innerHTML = "";
    pastCities.forEach(function (city){
        let btn = document.createElement("button");
        btn.setAttribute("class", "search-btn");
        btn.onclick = function () {
            searchCity(city);
        };
        btn.setAttribute("value", city);
        btn.innerHTML = city;
        locations.append(btn);

    }) 
}


 
getPastCities();