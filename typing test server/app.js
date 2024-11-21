const express = require('express')
const app = express();
const cors = require('cors');
const routes = require('./config/AllRoutes')
const path = require('path')
const bodyParser = require('body-parser');


app.use(bodyParser.json());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'assets')))
app.use(express.urlencoded({ extended : true }))
app.use(cors());
app.use(routes)


const PORT = process.env.PORT || 8080
app.listen(PORT, (req, res) => {
    console.log("server running with port", PORT)
});