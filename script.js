const celsius = -273.15 //converting kelvin to celsius for humam understanding

const key = "f0c57c94bbb9dad436b198bd695ec2ff" // API key of openweather.org

function convert_unix(time) {
  // This will convert EPOCH time or Unix time into Human readable time
  let date = new Date(time * 1000)
  let day = "0" + date.getDate()
  let mon = date.getMonth()
  let months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec"
  ]
  let yr = date.getFullYear()
  let hours = date.getHours()
  let min = "0" + date.getMinutes()
  return (
    day.substr(-2) +
    "-" +
    months[mon] +
    "-" +
    yr +
    ", " +
    hours +
    ":" +
    min.substr(-2)
  )
}

function checkArrayHasKeyOrNot(location) {
  return (
    location.postal_code != undefined && location.location_name != undefined
  )
}

function sendRequest(link, location_name) {
  let request = new XMLHttpRequest()
  request.open("GET", link, false)
  let result = ""
  request.onload = function() {
    let obj = JSON.parse(this.response)
    result =
      location_name +
      " " +
      Math.floor(obj.list[0].main.temp + celsius) +
      " C " +
      convert_unix(obj.list[0].dt)
  }
  request.send()
  return result
}

function getCountryCode(link, location_name) {
  let request = new XMLHttpRequest()
  link += "q=" + location_name + "&&APPID=" + key
  let countryCode = ""
  request.open("GET", link, false)
  request.onload = function() {
    let list = JSON.parse(this.response)
    countryCode = list.city.country
  }
  request.send()
  return countryCode
}

function getWeatherDetail(locationDetail) {
  if (locationDetail.length > 0) {
    locationDetail.forEach(function(location, index) {
      link = "https://api.openweathermap.org/data/2.5/forecast?"
      if (checkArrayHasKeyOrNot(location)) {
        let postal_code = 0
        let location_name = ""

        postal_code = location.postal_code
        location_name = location.location_name

        let countryCode = getCountryCode(link, location_name)
        if (countryCode) {
          link += "zip=" + postal_code + "," + countryCode + "&&APPID=" + key

          let result = sendRequest(link, location_name)
          console.log(result)
        } else {
          console.log("Country code not found")
        }
      } else {
        console.log(
          "There Is Mismatch Is Array Object Please Pass Array In Seen Format Array=[{location_name:'',postal_code:''}]"
        )
      }
    })
  } else {
    console.log("Array Is Empty")
  }
}

let locationDetail = [
  { location_name: "D Cabin", postal_code: 380019 },
  { location_name: "Sabarmati", postal_code: 380005 }
]

getWeatherDetail(locationDetail)
