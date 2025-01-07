const express = require('express');
const app = express();

require('dotenv').config();
const PORT = process.env.PORT || 4000;

app.use(express.json());

require('./config/database.js').connect();


const userRoutes = require('./routes/user');  
const cookieParser = require('cookie-parser');

const cors = require("cors");
app.use(cors());

app.use(cookieParser());
app.use('/api/v1', userRoutes);


// Activate the server
app.listen(PORT, () => {
    console.log(`APP is Listening at Port ${PORT}`);
});
