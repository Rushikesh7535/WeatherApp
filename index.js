const http = require("http");

const fs = require("fs");

var requests = require("requests");

const  homeFile = fs.readFileSync("index.html","utf-8");

const replaceval = ((tempVal,orgVal) => {
    let temperature = tempVal.replace("{%tempval%}",orgVal.main.temp);
    temperature = temperature.replace("{%tempmin%}",orgVal.main.temp_min);
    temperature = temperature.replace("{%tempmax%}",orgVal.main.temp_max);
    temperature = temperature.replace("{%location%}",orgVal.name);
    temperature = temperature.replace("{%country%}",orgVal.sys.country);
    temperature = temperature.replace("{%tempstatus%}",orgVal.weather[0].main);


    return temperature;
});
// &units=metric
const server = http.createServer((req,res) => {

    if(req.url = "/"){
        requests("https://api.openweathermap.org/data/2.5/weather?q=pune&APPID=ac6e4c86a891fb02d218367935a6d5f2&units=metric")
        .on("data",function (chunk){
            const objdata = JSON.parse(chunk); // object api
            const arrdata = [objdata];         // array of an object api
             //console.log(arrdata[0].main.temp);

            // map method to call right api's
            const realTimeData = arrdata
            .map((val) =>   replaceval(homeFile,val))
            .join("");
            res.write(realTimeData);
        })
        .on("end",function (err) {
            if (err) return console.log("connection closed",err);

            res.end();
        });
    }
});

server.listen(3000);