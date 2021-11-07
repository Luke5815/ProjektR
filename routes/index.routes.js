const express = require('express');
const router = express.Router();
var AWS = require('aws-sdk');
var fs =  require('fs');
var uuid = require('uuid');
const app = express();
const path = require('path');
const bp = require('body-parser');
var keys = [];
var reading = "";

router.get('/', function (req, res, next) {
    res.render('index',{
        reading: reading,
        keys: keys
    });
});
router.post("/upload", (req, res) => {
    var s3 = new AWS.S3({
        region:"eu-central-1",
        secretAccessKey: '5WEKxCpPjapV1d7gUiPtkr/jUcxAUhXxxNMZF+96',
        accessKeyId:'AKIA4FSIPVOAVMMWBCPL'
    });
      
    var myBucket = 'projektrtesting';
    var filename= req.body.filename;
    var content= req.body.content;
    console.log("--------------------------------------------");
    console.log("Sending file to the cloud");
    console.log("--------------------------------------------");
    params = {Bucket: myBucket, Key: filename+".txt", Body: content };
    s3.putObject(params, function(err, data) {
        if (err) {
            console.log(err)
        } else {
            console.log("Successfully uploaded data to projekrtesting");
            console.log("File name: "+filename+".txt");
            console.log("Content: "+content);
        }
    });
    res.redirect("/");
  });
  
router.post("/print", (req, res) => {
    var s3 = new AWS.S3({
        region:"eu-central-1",
        secretAccessKey: '5WEKxCpPjapV1d7gUiPtkr/jUcxAUhXxxNMZF+96',
        accessKeyId:'AKIA4FSIPVOAVMMWBCPL'
    });
      
    var myBucket = 'projektrtesting';
    s3.listObjectsV2({Bucket: myBucket}, function(err, data) {
        keys = [];
        if (err)  {
            console.log(err); 
        }else {
            console.log("--------------------------------------------");
            console.log("Printing files in bucket");
            console.log("--------------------------------------------");
            var KeyList = [];
            data.Contents.forEach(item => {
                console.log(item.Key);
                keys.push(item.Key)
            });
            res.redirect("/");
        }});
});
router.post("/read", (req, res) => {

    var s3 = new AWS.S3({
        region:"eu-central-1",
        secretAccessKey: '5WEKxCpPjapV1d7gUiPtkr/jUcxAUhXxxNMZF+96',
        accessKeyId:'AKIA4FSIPVOAVMMWBCPL'
    });
    var filename= req.body.filename;
    var myBucket = 'projektrtesting';
    params = {Bucket: myBucket, Key: filename+".txt"};
    console.log("--------------------------------------------");
    console.log("File " +filename+ ".txt contains: ");
    s3.getObject(params, function(err, data) {
        if (err) console.log(err); 
        else{
           const text=data.Body.toString();
           console.log(text);
           reading=text;
        }          
      });
    console.log("--------------------------------------------");
    res.redirect("/");

      
});
module.exports = router;