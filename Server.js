const express = require('express');
const mongoose = require("mongoose");
const dotenv = require('dotenv');
dotenv.config();
const cors = require('cors');

const Data = require("./model/Data");
const PORT = 8080;

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

const DB = process.env.MONGO_URI
const connectToDatabase = () => {
    mongoose.connect(DB, {
        useNewUrlParser: true,
    }).then(() => {
        console.log("Connection Successful");
    }).catch((e) => {
        console.log("Connection Failed\n", e);
    });
}
connectToDatabase()

app.get("/", (req, res) => {
    res.send("Hello From API");
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
app.post("/getFilteredData",(req, res)=>{
    const {filters} = req.body;
    let check = false;
    for(let key in filters){
        if(filters[key].length>0){
            check = true;
            break;
        }
    }
    if(!check){
        Data.find({}).then((data)=>{
            res.json(data);
        }).catch((e)=>{
            console.log(e);
        });
    }else{
        let query = {};
        for(let key in filters){
            if(filters[key].length>0){
                query[key] = {$in:filters[key]};
            }
        }
        Data.find(query).then((data)=>{
            let d = [];
            data.forEach((x)=>{
                d.push({
                    end_year: x.end_year,
                    intensity: x.intensity,
                    sector: x.sector,
                    topic: x.topic,
                    region: x.region,
                    country: x.country,
                    relevance: x.relevance,
                    pestle: x.pestle,
                    source: x.source,
                    likelihood: x.likelihood,
                });
            });
            res.json(d);
            console.log(d);
        }).catch((e)=>{
            console.log(e);
        });
    }
})