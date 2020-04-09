const CELSIUS = -273.15 //converting kelvin to celsius for humam understanding
const KEY = "f0c57c94bbb9dad436b198bd695ec2ff" // API key of openweather.org
const INTERVAL = 1000

function convert_unix(time) {
  // This will convert EPOCH time or Unix time into Human readable time
  let date = new Date(time * INTERVAL)
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

function sendRequest(link) {
  let request = new XMLHttpRequest()
  request.open("GET", link, false)
  let result = ""
  request.onload = function () {
    result = JSON.parse(this.response)
  }
  request.send()
  return result
}

function getOriginalLink() {
  return "https://api.openweathermap.org/data/2.5/forecast?"
}

function getCountryCode(location_name) {
  let link = getOriginalLink()
  let result = ""
  link += "q=" + location_name + "&&APPID=" + KEY
  result = sendRequest(link)
  return result
}

function getWeatherDetail(locationDetail) {
  if (locationDetail.length > 0) {
    locationDetail.forEach(function (location, index) {
      if (checkArrayHasKeyOrNot(location)) {
        let postal_code = location.postal_code
        let location_name = location.location_name

        let countryCode = getCountryCode(location_name)
        countryCode = countryCode.city.country
        if (countryCode) {
          countryCode
          let link = getOriginalLink()
          link += "zip=" + postal_code + "," + countryCode + "&&APPID=" + KEY

          let result = sendRequest(link)
          result =
            location_name +
            " " +
            Math.floor(result.list[0].main.temp + CELSIUS) +
            " C " +
            convert_unix(result.list[0].dt)
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
