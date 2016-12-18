var express=require("express");
var mongo=require("mongodb").MongoClient;
var mongoURL="mongodb://thangbk2209:thang2209@ds059516.mlab.com:59516/url-fcc-thangbk2209";
//var ObjectId=require("mongodb").ObjectId;
module.exports=function(app,passport){
    //register
    app.get("/register",function(req,res){
        res.render("register");
    })
    //login
    app.get("/login",function(req,res){
        res.render('login');
    })
    	app.post('/login', passport.authenticate('local-login', {
		successRedirect: '/mypoll',
		failureRedirect: '/login',
		failureFlash: true
	}));
    app.post("/users/register",function(req,res){
        var name=req.body.name;
        var username=req.body.username;
        var email=req.body.email;
        var password=req.body.password;
        var password2=req.body.confirmpassword;
       // console.log(name);
        
        mongo.connect(mongoURL,function(err,db){
            if(err) throw err;
           var collect=db.collection("user-voting-app");
           var data={
               name:name,
               username:username,
               email:email,
               password:password
           }
           collect.insert(data,function(err){
               if(err) console.log("can't insert to database!!!");
                res.render("login");
           })
            db.close();
        })
    })
    app.post("/users/login",function(req,res){
        var username=req.body.username;
        var password=req.body.password;
      //  console.log(username);
        mongo.connect(mongoURL,function(err,db){
            if(err) throw err;
            var collect=db.collection("user-voting-app");
            collect.find({username:username})
            .toArray(function(err,docs){
                if(err){
                    console.log("err");
                }
                if(docs.length>0){
                    //console.log(docs);
                    var pass=docs[0].password;
                    if(password===pass){
                        console.log("done!!!");
                        res.redirect('/');
                    }
                }else{
                         console.log("not found!!!");
                }
            })
            db.close();
        })
    })
    //tạo poll mới
      app.get('/newpoll',function(req,res){
        res.render('createpoll');
    })
    
    app.post('/createpoll',function(req,res){
        mongo.connect(mongoURL,function(err,db){
                if(err) throw err;
                var collect=db.collection("polls");
                var name=req.body.name;
                var option1=req.body.option1;
                var option2=req.body.option2;
                var vote1=0;
                var vote2=0;
                var sumVote=0;
                var sumVote=vote1+vote2;
                var data={
                    name: name,
                    option1:option1,
                    option2:option2,
                    vote1:vote1,
                    vote2:vote2,
                    sumVote:sumVote
                };
                collect.insert(data,function(err){
                    if(err){
                        console.log("can't insert to database!!!");
                    }
                })
                res.redirect("/");
                db.close();
         })

    })
    //vote poll
    app.get('/poll/:pollName',function(req,res){
       console.log("start");
       var myName = req.params.pollName;
       console.log(myName);
        mongo.connect(mongoURL,function(err,db){
            if(err) throw err;
            var collect=db.collection("polls");
            collect.find({name: myName})
            .toArray(function(err,data){
                if(err) throw err;
                if(data.length>0){
                    console.log(data);
                    res.render('vote',{
                     poll:data
                    });
                    console.log(data);
                }else{
                    res.render('vote',{
                        poll:data
                    });
                    console.log("not have in database!!!");
                }
            })
            db.close();
        });
    })
    app.post("/vote",function(req,res){
            var myVote = req.body.votefor;
            var myPoll=req.body.pollid;
            var docs=[];
            var vote1=0;
            var vote2=0;
            var sumvote=0;
            console.log(docs+ "docs");
            console.log(myVote);
            mongo.connect(mongoURL,function(err,db){
                if(err) throw err;
                var collect=db.collection("polls");
                collect.find({name: myPoll})
                    .toArray(function(err,data){
                    if(err) throw err;
                    if(data.length>0){
                        docs.push=data[0];
                        console.log('----');
                       console.log(data);
                       console.log('----');
                        if(myVote===data[0].option1){
                            data[0].vote1 += 1;
                            //vote1=data[0].vote1;
                            data[0].sumVote+=1;
                          //  sumVote=data[0].sumVote;
                          
                        }else if(myVote===data[0].option2){
                            data[0].vote2 += 1;
                          //  vote2=data[0].vote2;
                            data[0].sumVote+=1;
                          //  sumVote=data[0].sumVote;
                        }
                    //   console.log(data);
                        vote1=data[0].vote1;
                        //console.log('vote1 :  '+  vote1);
                        vote2=data[0].vote2;
                        //console.log('vote2 :  '+  vote2);
                        sumvote=data[0].sumVote;
                       
                        // collect.update({name:myPoll},{$set:{
                        //         vote1 : 5,
                        //         vote2 : 7,
                        //         sumVote:sumvote
                        //     }},{ $multi: true });
                        collect.update({name:myPoll},{$set:{
                                 vote1 : vote1,
                                 vote2 : vote2,
                                 sumVote:sumvote
                             }},{ $multi: true });

                db.close();
                        res.render('result',{
                            poll:data,
                            myVote:myVote
                        });
                        //docs.push(data[0]);

                    }else{
                        console.log("err");
                    }
                })
                
                console.log('vote1 :  '+  vote1);
                        console.log('vote2 :  '+  vote2);
                
            //       collect.save(function(err, poll){
				        //     if(err) throw err;
				        //   // res.redirect('/poll/' + myPoll);
			         //   })
			         //console.log("docs: "+ vote1 + vote2 + sumvote);
                //  collect.update({name:myPoll},{$set:{
                //                  vote1 : vote1,
                //                  vote2 : vote2,
                //                  sumVote:sumvote
                //              }},{ $multi: true });

                // db.close();
            });
        });

    
    

};
// function isLoggedIn(req, res, next) {
// 	if(req.isAuthenticated()){
// 		return next();
// 	}

// 	res.redirect('/login');
// }