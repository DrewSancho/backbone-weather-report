(function ($) {
    var collection = new Backbone.Collection();
    var cityEl = document.querySelector('#city');
    var cityInfo = document.querySelector('.city-info');
    var apiKey = '5c669e705404936d7356e998c577e839';
// create a function that can be reused for whichever city we would want to use for weather
    function getWeatherForecast (cityId, callback) {
        var data;
        var url = 'http://api.openweathermap.org/data/2.5/forecast/daily?count=7&id=' + cityId;
// query string with query perameters
        url += '&appid=' + apiKey;
// creating an xml http request
        var request = new XMLHttpRequest();
        request.onreadystatechange = function () {
            if (request.readyState === 4) {
                data = JSON.parse(request.responseText);
// use the callback function to collect and remember the data for later use
                console.log(data);
                callback(data);
            }
        };
        request.open('GET', url);
        request.send();
    }
// making a callback function to remember the data that was created asynchonously
    getWeatherForecast('2644080', updateData);

    function fahrenheit (temp) {
        return Math.floor((temp - 273.15) * 1.8000 + 32.00);
    };

    function windDirection (input) {
        var cardinalDirections = ['\u2191', '\u2197', '\u2192', '\u2198', '\u2193', '\u2199', '\u2190', '\u2196'];
        var output = cardinalDirections[0];
        var range = 360 / cardinalDirections.length;

        for (var i = cardinalDirections.length, j = 360; input > 0 && j > input - 22.5; (i--, j -= range)) {
            output = cardinalDirections[i];
        }

        return output;
    }
    function updateData (data) {
        collection.reset();
        data.list.forEach(function (obj) {
            obj.temp.min = fahrenheit(obj.temp.min);
            obj.temp.max = fahrenheit(obj.temp.max);
            obj.deg = windDirection(obj.deg);
            obj.speed = Math.ceil(obj.speed) + ' mph';
        });
        collection.add(data.list);
        cityEl.textContent = data.city.name;
        cityInfo.textContent = data.city.country + ' ' + data.city.coord.lat + ' ' + data.city.coord.lon;
    }

    collection.on('add', function () {
        buildApplication(collection);
    });
// templating
    var weatherViewTemplate = _.template($('#weather-template').html());

    function createWeatherView (model) {
        var el = $('<div>');
        var contents = weatherViewTemplate(model);
        el.html(contents);
        return {
            el: el
        };
    }

// function takes some data and updates the value of element with id city
    function buildApplication (collection) {
        var children = collection.map(createWeatherView);
        $('.main').empty();
        children.map(function (view) {
            $('.main').append(view.el);
        });
    }
    $('input').on('keyup', function (e) {
        if (e.keyCode === 13) {
            getWeatherForecast($('input').val(), updateData);
            $('input').val('');
        }
    });
    $('button').on('click', function () {
        getWeatherForecast($('input').val(), updateData);
        $('input').val('');
    });
})(window.jQuery);