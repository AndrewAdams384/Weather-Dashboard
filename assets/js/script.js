let searchHistory = {};

  function getInfo() { 

    const queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${$("#search-input").val().trim()}&appid=4535e384f0a4ea4ebc02ddb6fb1569c5&units=imperial`;
    const forecastQueryURL = `https://api.openweathermap.org/data/2.5/forecast?q=${$("#search-input").val().trim()}&appid=4535e384f0a4ea4ebc02ddb6fb1569c5&units=imperial`;
    
    $.ajax({
      url: queryURL,
      method: "GET"
    }).then(function (response) {
      $("#forecast").empty();
      $("#city").text(response.name).attr("class", "text-center");
      $("#temp").text("temperature: " + response.main.temp).attr("class", "text-center");
      $("#humidity").text("humidity: " + response.main.humidity).attr("class", "text-center");
      $("#windspeed").text("wind speed: " + response.wind.speed).attr("class", "text-center");
  
      const UVQueryURL = `https://api.openweathermap.org/data/2.5/uvi?lat=${response.coord.lat}&lon=${response.coord.lon}&appid=4535e384f0a4ea4ebc02ddb6fb1569c5`;
  
      $.ajax({
        url: UVQueryURL,
        method: "GET"
      }).then(function (UVresponse) {
        $("#uv").text("UV Index: " + UVresponse.value).attr("class", "text-center");

        if (UVresponse.value > 5) {
          $("#uv").attr("style", "color:red;");
        } else {
          $("#uv").attr("style", "color:green;");
        }
  
      });
    });
  
    $.ajax({
      url: forecastQueryURL,
      method: "GET"
    }).then(function (forecastresponse) {

      for (let i = 0; i < 5; i++) {

        const forecast = `
        <div class="col">
          <div id="${'card' + i}" class="text-white p-2 mt-1 mb-1" style="width: 10rem;">
            <h4 id="${'date' + i}"></h4>
            <p id="${'temp' + i}">Temp: </p>
            <p id="${'humidity' + i}">Humidity: </p>
          </div>
        </div>
        `;
  
        $("#forecast").append(forecast);
      }
  
      for (let i = 0; i < 5; i++) {
        let forcastDate = forecastresponse.list[i * 8 + 3].dt_txt;
        $(`${'#date' + i}`).text(forcastDate.slice(5, 10));
        $(`${'#icon' + i}`).append(`<img src="http://openweathermap.org/img/wn/${forecastresponse.list[i * 8 + 3].weather[0].icon}.png"></img>`);
        $(`${'#temp' + i}`).append(forecastresponse.list[i * 8 + 3].main.temp);
        $(`${'#humidity' + i}`).append(forecastresponse.list[i * 8 + 3].main.humidity);
      }
    });
  
    history();
  }
  
  function searchedCities() {
    let previously = JSON.parse(localStorage.getItem("cities"));
    if (previously) {
      searchHistory = previously;
    } else {
      localStorage.setItem("cities", JSON.stringify(searchHistory));
      $("#search-input").val("");
      getInfo();
    }
  }
  
  function history() { 
  
    searchHistory["city3"] = searchHistory["city2"];
    searchHistory["city2"] = searchHistory["city1"];
    searchHistory["city1"] = searchHistory["city0"];
    searchHistory["city0"] = $("#search-input").val().trim();
  
    localStorage.setItem("cities", JSON.stringify(searchHistory));
  
    showHistory();
  
  }
  function showHistory() {
    $("#city0").text(searchHistory.city0);
    $("#city1").text(searchHistory.city1);
    $("#city2").text(searchHistory.city2);
    $("#city3").text(searchHistory.city3);
  }
  
  $("#runSearch").on("click", function (event) {
    event.preventDefault();
    getInfo();
  });

  $(".searchButton").on("click", function (event) {
    event.preventDefault();
    searchButton = $(this).text();
    $("#search-input").val(searchButton);
    getInfo();
  })

  searchedCities();
  showHistory();