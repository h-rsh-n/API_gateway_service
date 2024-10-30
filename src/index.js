const express = require('express')
const {serverConfig,loggerConfig} = require('./config')
const app = express();
const apiRouter = require('./routes')
const {rateLimit} = require('express-rate-limit')
const { createProxyMiddleware } = require('http-proxy-middleware');

const limiter = rateLimit({
  windowMs:2*60*1000,
  limit:10
})

app.use(express.urlencoded({extended:true}));
app.use(express.json());

app.use(limiter)
app.use('/flightService',createProxyMiddleware({target:serverConfig.FLIGHT_SERVICE,changeOrigin:true,pathRewrite:{'^/flightService':'/'}}))
app.use('/bookingService',createProxyMiddleware({target:serverConfig.BOOKING_SERVICE,changeOrigin:true,pathRewrite:{'^/bookingService':'/'}}))
app.use('/api',apiRouter);

app.listen(serverConfig.PORT,()=>{
  console.log(`Server started on port ${serverConfig.PORT}`);
})