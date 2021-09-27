'use strict';

const express = require("express");
const cors = require("cors");
const config = require("./config");
const patientRoutes = require("./routes/patient-routes");
const doctorRoutes = require("./routes/doctor-routes");
const appointmentRoutes = require("./routes/appointment-routes");
const fileUpload = require('express-fileupload');



const app = express();

app.use(cors());

app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({ extended: true }))
app.use(fileUpload());


app.use('/api', patientRoutes.routes, doctorRoutes.routes, appointmentRoutes.routes);

app.listen(config.port, () => console.log('App is listening on url http://localhost:' + config.port));