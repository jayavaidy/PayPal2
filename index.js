const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');

//var courseslist = {1:{course:'Data Structure',professor:'Radha'}}
var registered = {}
var offered = {}

var app = express();

app.set('view engine','pug')
app.set('views','./views')

app.use(express.json()); //to support JSON encoded bodies

app.use(bodyParser.urlencoded({extended:false}))

//to write an JSON object into a csv file
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

//creating a csv writer to write into the file that contains student details
const csvWriterstudent = createCsvWriter({
    path: './student.csv',
    header: ['username', 'age','branch','institute','password']
});

//creating a csv writer to write into a file that contains the professor details
const csvWriterprofessor = createCsvWriter({
  path:'./professor.csv',
  header:['username','age','branch','institute','password']
})

const csvWritercourselist = createCsvWriter({
  path:'./courselist.csv',
  header:['name','professor']
})

app.get('/',function(req,res){
  res.render('home_page');
})
app.get('/signup',function(req,res){
  res.render('signup_page');
})
app.get('/login',function(req,res){
  res.render('login_page')
})
app.post('/signup_page_details',function(req,res){
  var a = req.body;
  if(a.profession==='student')
  {
    delete a.profession;
    csvWriterstudent.writeRecords([a])
      .then(()=>res.render('return',{username:a.username}));
  }
  else if(a.profession==='professor')
  {
    delete a.profession;
    csvWriterprofessor.writeRecords([a])
      .then(()=>res.render('return',{username:a.username}));
  }
})
app.post('/login_page_details',function(req,res){
  var a = req.body;
  flag = 0;
  console.log(a);
  if(a.profession==='student'){
    fs.readFile('./student.csv',function(err,data){
      var b = data.toString().split('\n');
      for (var i = 0;i<b.length;i++){
        var c = b[i].split(',');
        if (c[0]===a.Username && c[4] === a.Password){
          flag = 1;
          break;
        }
      }
      if(flag===1)
      res.render('student_homepage',{username:c[0], institute:c[3],subject:c[2],age:c[1]});
      else
      res.render('wrong_page');
    })
  }
  else if(a.profession==='professor'){
    fs.readFile('./professor.csv',function(err,data){
        var b = data.toString().split('\n');
        for (var i = 0;i<b.length;i++){
          var c = b[i].split(',');
          if (c[0]===a.Username && c[4] === a.Password){
            flag = 1;
            break;
          }
        }
        if(flag===1)
        res.render('professor_homepage',{username:c[0], institute:c[3],subject:c[2],age:c[1]});
        else
        res.render('wrong_page');
    })
  }
})
app.get('/registerstu/',function(req,res){
  res.send(req.params);
})
app.get('/regiscourses/',function(req,res){

})
app.get('/registerprof/',function(req,res){

})
app.get('/offcourses/',function(req,res){

})
app.listen(3000);
