const connectToMongo = require("./db");
const cors = require('cors')
require("dotenv").config();
connectToMongo();

const express = require("express");
const app = express();
const { createProxyMiddleware } = require('http-proxy-middleware');
const port = process.env.PORT || 3000;

app.get('/',(req,res)=>{
  res.send('Welcome to bullet journal')
})
app.get('/api',(req,res)=>{
  res.send('Welcome to bullet journal api')
})
app.use(express.json())
app.use(cors());
app.use("/api/auth", require("./routes/auth.js"));
app.use("/api/notes", require("./routes/notes.js"));
app.use("/api/collections", require("./routes/collections.js"));
app.use("/api/futurelogs", require("./routes/futurelogs.js"));
app.use("/api/bullets", require("./routes/bullets.js"));
app.use("/api/habbits", require("./routes/habbit.js"));
app.use('/api', createProxyMiddleware({ 
    target: 'http://localhost:3000/', //original url
    changeOrigin: true, 
    //secure: false,
    onProxyRes: function (proxyRes, req, res) {
       proxyRes.headers['Access-Control-Allow-Origin'] = '*';
    }
}));

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
  console.log(process.env.PORT);
});
