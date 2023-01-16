const express = require('express');
const app  =  express();
const cors  = require('cors');
const mongoose = require('mongoose');
const router = require('./Routes/authRoutes');
const cookieParser = require('cookie-parser');

const indexConfigs = require('./configs/indexConfig');
indexConfigs.homeConfig();


const PORT = process.env.PORT || 3000;

app.use(
    cors({
      origin: ["http://localhost:3000"],
      methods: ["GET", "POST"],
      credentials: true,
    })
  );
app.use(express.json());
app.use('/api/auth',router);
app.use(cookieParser());



mongoose.connect(process.env.DB_URL,({
    useNewUrlParser: true,
    useUnifiedTopology: true
})).then(() => {
    
    console.log('DB CONNECTION SUCCESSFUL');
}).catch((err) => {
    console.log(err);
})

app.listen(PORT,() => {
    console.log(`app listening on ${PORT}`);
});