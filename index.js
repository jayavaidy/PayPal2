const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');

var registered = []

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
  header:['username','coursename']
})

const csvWriterregisteredlist = createCsvWriter({
  path:'./registerlist.csv',
  header:['username','coursename']
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
app.get('/courselist',function(req,res){
  res.sendFile(__dirname+'/courselist.csv');
})
app.get('/registerstu',function(req,res){
  res.render('register_course');
})
app.get('/courses',function(req,res){
  res.render('get_username');
})
app.get('/registerprof',function(req,res){
  res.render('add_course');
})
app.post('/creating_course',function(req,res){
  var a = req.body;
  csvWritercourselist.writeRecords([a])
    .then(()=>{fs.readFile('./professor.csv',function(err,data){
        var b = data.toString().split('\n');
        for (var i = 0;i<b.length;i++){
          var c = b[i].split(',');
          if (c[0]===a.username){
            flag = 1;
            break;
          }
        }
        if(flag===1)
        res.render('professor_homepage',{username:c[0], institute:c[3],subject:c[2],age:c[1]});
      })
  })
})
app.post('/registering_course',function(req,res){
  var a = req.body;
  csvWriterregisteredlist.writeRecords([a])
    .then(()=>{fs.readFile('./student.csv',function(err,data){
        var b = data.toString().split('\n');
        for (var i = 0;i<b.length;i++){
          var c = b[i].split(',');
          if (c[0]===a.username){
            flag = 1;
            break;
          }
        }
        if(flag===1)
        res.render('student_homepage',{username:c[0], institute:c[3],subject:c[2],age:c[1]});
      })
  })
})
app.post('/getting_your_courses',function(req,res){
  var a = req.body;
  var courses= {}
  const csvWritertemp = createCsvWriter({
    path:'./temp.csv',
    header:['coursename']
  })
  if(a.profession==='student'){
    fs.readFile('./registerlist.csv',function(err,data){
      var b = data.toString().split('\n');
      for (var i = 0;i<b.length;i++){
        var c = b[i].split(',');
        if (c[0]===a.username){
          csvWritertemp.writeRecords([{coursename:c[1]}]);
        }}
    })
    res.sendFile(__dirname+'/temp.csv');
  }
  else if(a.profession==='professor'){
    fs.readFile('./courselist.csv',function(err,data){
      var b = data.toString().split('\n');
      for (var i = 0;i<b.length;i++){
        var c = b[i].split(',');
        if (c[0]===a.username){
          csvWritertemp.writeRecords([{coursename:c[1]}]);
        }}
    })
    res.sendFile(__dirname+'/temp.csv');
  }
})
app.listen(3000);
