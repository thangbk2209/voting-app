var express=require("express");
//var router=express.Router();
//var app=express();
var mongo=require("mongodb").MongoClient;
var mongoURL="mongodb://thangbk2209:thang2209@ds059516.mlab.com:59516/url-fcc-thangbk2209";
module.exports=function(app){
    app.get('/',function(req,res){
        mongo.connect(mongoURL,function(err,db){
            if(err) throw err;
            var collect=db.collection("polls");
                collect.find({}).toArray(function(err,data){
                    if(err) throw err;
                    if(data.length>0){
                      // console.log(data);
                        res.render('index',{polls :data});
                    }else{
                        res.render('index',{polls :data});
                        console.log("database is empty")};
                })
                db.close();
        })
    });
    
}