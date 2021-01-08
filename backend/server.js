
// Initializing packages
const http = require('http');
const express = require('express');
const csvtojson = require('csvtojson');
const bodyParser = require('body-parser');
const app = express();
const generateUniqueId = require('generate-unique-id');



const server = http.createServer(app);

// Using the body-parser package
app.use(bodyParser.json());

// Handling the HTTP Post request 
app.post('/app/usersInfo', (req, res) => {
    let csvUrl = req.body.csv.url;
    let selectedFields = req.body.csv.select_fields;
    let position = csvUrl.indexOf('.');
    let ext = csvUrl.slice(position);
    const uniqueId = generateUniqueId({
        length: 32
    });
    if(ext === ".csv"){
        csvtojson()
        .fromFile(csvUrl)
        .then((json) => {
            if(selectedFields.length === 0){
                res.json({"conversion_key": uniqueId, "json": json});
            }
            else{
                const newArray = arraySorting(json, selectedFields);
                res.json({"conversion_key": uniqueId, "json": newArray});
            }
        });
        
    }
    else{
        res.json({"status": "Incorrect file Format"});
    }
    
})

function arraySorting(json, selectedFields){
    let newArray = [];
    json.forEach((data) => {
        let newData = {};
        selectedFields.forEach((fields) => {
            newData[fields] = data[fields];
        })
        newArray.push(newData);
    })

return newArray;
}


server.listen(3000);