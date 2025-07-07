const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

// POST request saves user schedule data to a file and saves it in MongoDB
router.post('/schedule',(req,res)=>{
    
})

// GET request gets schedule data + processes it so that gym workouts are integrated into the schedule
router.get('/schedule',(req,res)=>{
    // get data from Mongo of user's weekly schedule
    // process data 
    // 
})


module.exports = router