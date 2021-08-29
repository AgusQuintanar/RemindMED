const express = require("express");
const cors = require("cors");


const app = express();

app.use(cors());
app.use(express.json());


//* --------- Controllers -----------


const PORT = process.env.PORT || 3000
app.listen( PORT, () => {
    console.log("Corriendo en el puerto " + PORT);
});