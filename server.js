const express = require('express');
const bodyParser= require('body-parser');
const session = require('express-session');
const url = require('url');
//const { body, validationResult } = require('express-validator');
const http = require('http');
const dbConfig = require('./config/database.config.js');
const sql = require("mssql");
const app = express();
const { check, validationResult } = require('express-validator');

/*const app = http.createServer((request, response) => {
    response.writeHead(200, {"Content-Type": "text/plain"});
     res.render('index.ejs')
	 
});*/
const path = require('path');
//const bcrypt = require('bcrypt');
const key = "FantasyFootballLeague";
const encryptor = require('simple-encryptor')(key);


//Let express know that we are using embeddedjs as our view engine.
app.set('view engine', 'ejs')
app.set('views','views')

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json());
const Public_DIR = path.join(__dirname, '/public/')
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(Public_DIR))
app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));
	
const port = process.env.PORT || 1337;
app.listen(port);
	
/*app.listen(3000, function() {
  console.log('listening on 3000')
})*/




app.get('/', (req, res) => {
  res.render('index.ejs')  
})


/*var request = sql.connect(dbConfig, {
			useNewUrlParser: true
		}).then(() => {
			return new sql.Request();
		}).catch(err => {
			console.log('Could not connect to the database. Exiting now...', err);
			process.exit();
		});
*/
app.post('/Login', (req, res) => {
	
  sql.connect(dbConfig, {
			useNewUrlParser: true
		}).then(() => {
			 // create Request object
        var request = new sql.Request();
		console.log(req.body.username);
		console.log(req.body.password);
		  const username = req.body.username;
		  const password = req.body.password;
		  
		  const encryptedPassword = encryptor.encrypt(password);
		  
		if (username && password) {
		request.query("SELECT * FROM Users WHERE Username = '"+username+"'", function(error, results) {
			//console.log(results);
			//console.log(!isEmpty(results.recordset));
			//console.log(results.recordset.length);
			//console.log(!isEmpty(results.recordset[0]));
			if (results.recordset.length > 0) {
			const pwd=results.recordset.Password;
			//console.log(results.recordset.);
			var decrypted = encryptor.decrypt(results.recordset[0].Password);
			console.log(decrypted);
			console.log(decrypted===password);
			if (results.recordset.length > 0 && decrypted===password) {
				req.session.loggedin = true;
				req.session.username = username;
				
				//console.log("inside results");
				//res.redirect('/listplayers');
			
			} else {
				//res.status(400).send(JSON.stringify(error, 'Incorrect Username and/or Password!', 2));
				res.status(501);
				//res.send('Incorrect Username and/or Password!');
				//res.redirect('/Login',{err});
			}
			}else{
				res.status(502);
			}				
			res.end();
		});
		} else {
		res.status(400).send({error: "Please enter Username and Password!  "})
		//res.status(400).send(JSON.stringify(error, 'Please enter Username and Password!', 2));
		//res.end();
	}
    
		}).catch(err => {
			console.log('Could not connect to the database. Exiting now...', err);
			process.exit();
		});
		//res.sendFile(__dirname + '/index.html')
})  
	
  
  


app.get('/Login', (req, res) => {
  //res.sendFile(__dirname + '/index.ejs')
  res.render('index.ejs')
  
})

app.get('/roster',isAuthenticated, (req, res) => {
  //res.sendFile(__dirname + '/index.ejs')
  res.render('startingroaster.ejs');
})

app.get('/register', (req, res) => {
  //res.sendFile(__dirname + '/index.ejs')
  res.render('register.ejs');
})



app.post('/register',  [

  check('username').isLength({ min: 3 }).withMessage('Username should have atleast 3 characters'),
  check('email').isEmail().withMessage('Email is Invalid'),
  check('firstname').isLength({ min: 3 }).withMessage('Firstname should have atleast 3 characters'),
  check('lastname').isLength({ min: 3 }).withMessage('Lastname should have atleast 3 characters'),
  // password must be at least 5 chars long
  check('password')
    .isLength({ min: 3 }).withMessage('Password must be atleast 3 characters')
  
],(req, res) => {
  //res.sendFile(__dirname + '/index.ejs')
  console.log(req.body.username);
  console.log(req.body.email);
  console.log(req.body.firstname);
  console.log(req.body.lastname);
  
 const result = validationResult(req);
 console.log(errors);
 var errors = result.errors;
 for (var key in errors) {
        console.log(errors[key].value);
  }
  
  if (!result.isEmpty()) {
    //return res.status(422).json({ errors: errors.array() })
	console.log(errors);
	 res.render('register', {errors: errors});
  }
  else{
  const password = req.body.password;
  const encryptedPassword = encryptor.encrypt(password); 
  const  Username = req.body.username;
  const  Email =req.body.email;
  const FirstName= req.body.firstname;
  const LastName = req.body.lastname;
  
   sql.connect(dbConfig, {
			useNewUrlParser: true
		}).then(() => {
			 // create Request object
        var request = new sql.Request();
           
        // query to the database and get the records
        request.query("INSERT INTO Users ([Username],[Email],[FirstName],[LastName],[Password]) VALUES ('"+Username+"','"+Email+"','"+FirstName+"','"+LastName+"','"+encryptedPassword+"')") .then(function (err, result) {
			
			//res.sendFile(__dirname + '/index.ejs')
			res.redirect('/Login');
			//res.redirect("/participantstats");
        });
		}).catch(err => {
			console.log('Could not connect to the database. Exiting now...', err);
			process.exit();
		});
  }
  //res.sendFile(__dirname + '/index.html')
})

app.get('/Participant',isAuthenticated, (req, res) => {
  // connect to your database
	sql.connect(dbConfig, {
			useNewUrlParser: true
		}).then(() => {
			 // create Request object
        var request = new sql.Request();
        console.log(req.session.username);   
        // query to the database and get the records
        request.query("select distinct * from Users where Username='"+req.session.username+"'", function (err, result) {
            // send records as a response
            //res.send(result);
			//console.log(result.recordset[1].Name);
			//const parsedJSON = JSON.parse(result);
			//console.log(result.recordsets.);
			//res.send(result);
			console.log("Registered User successfully");
			console.log(result);
			res.render('user.ejs', { result });
			//console.log(result.recordset.length);
            
        });
		}).catch(err => {
			console.log('Could not connect to the database. Exiting now...', err);
			process.exit();
		});
 
})


app.get('/listplayers',isAuthenticated, (req, res) => {
	var url_parts = url.parse(req.url, true);
	var query = url_parts.query;
	console.log(query);
  // connect to your database
	sql.connect(dbConfig, {
			useNewUrlParser: true
		}).then(() => {
			 // create Request object
        var request = new sql.Request();
           
        // query to the database and get the records
        request.query('select * from NFL_Players', function (err, result) {
            // send records as a response
            //res.send(result);
			//console.log(result.recordset[1].Name);
			//const parsedJSON = JSON.parse(result);
			//console.log(result.recordsets.);
			//res.send(result);
			res.render('playerlist.ejs', { result });
			//console.log(result.recordset.length);
            
        });
		}).catch(err => {
			console.log('Could not connect to the database. Exiting now...', err);
			process.exit();
		});
 
})

app.post('/listplayers',isAuthenticated, (req, res) => {
  // connect to your database
    
	res.redirect('/listplayers');
})

app.post('/InsertTeam',isAuthenticated, (req, res) => {
  
  const playerlist = req.body;
  console.log(playerlist);
	sql.connect(dbConfig, {
			useNewUrlParser: true
		}).then(() => {
			 // create Request object
		 console.log("Connected!");	 
		 
        var request = new sql.Request();
        //var sqlquery =  "INSERT INTO Fantasy_Team (PlayerName,Team) VALUES (@name,@team)";
			
        //Insert query to FantasyTeam Database with selected players. 
		 for(var i = 0; i < playerlist.length; i++) {
			 var split=playerlist[i].split(",");
			 var name=split[0].toString();
			 var team=split[1].toString();
			 //request.multiple = true;
			 console.log(name);
			 console.log(team);
        
		//request.query('INSERT INTO Fantasy_Team ([PlayerName],[Team]) VALUES ('+name+','+team+')').then(function (err, result)
		request.query("INSERT INTO Fantasy_Team ([Participant],[Player],[Team]) VALUES ('"+req.session.username+"','"+name+"','"+team+"')").then(function (err, result)
		{
            
			console.log('record added to db');	
			
		 }).catch(err => {
			console.log('Could not insert the record to DB. Exiting now...', err);
			process.exit();
		});
		}
		
		res.sendStatus(201);
		
		}).catch(err => {
			console.log('Could not connect to the database. Exiting now...', err);
			process.exit();
		});
		 
});

app.get('/FantasyTeam',isAuthenticated, (req, res) => {
  // connect to your database
	sql.connect(dbConfig, {
			useNewUrlParser: true
		}).then(() => {
			 // create Request object
        var request = new sql.Request();
		request.query("select distinct * from dbo.NFL_Players where Player in (select Player from dbo.Fantasy_Team where Participant='"+req.session.username+"')", function (err, result) 
		{
            
			console.log('records fetched from DB');	
			
			//res.send('/index.html')
			//res.send('FantasyTeam');
			//res.render(path.resolve(__dirname + "/views/FantasyTeam"),{result});
			res.render('FantasyTeam.ejs', { result });
			//console.log(result.recordset.length);
		 });
		}).catch(err => {
			console.log('Could not connect to the database. Exiting now...', err);
			process.exit();
		});
  
});

const participants = [];

		
app.get('/weekstats', (req, res) => {
  
  sql.connect(dbConfig, {
			useNewUrlParser: true
		}).then(() => {
		// create Request object
        var request = new sql.Request();
		//var request2 = new sql.Request();
		//var weeklystats_participant = {};
		let map = new Map();	
		var recordlen;
		var counter=0;
		request.query("select distinct * from dbo.Users", function (err, result1) 
		{
			
			//let temp = new Map();
			var participant_week_Stats = {};
			//var temp ={};
			
            console.log(result1);
			console.log(result1.recordset.length);
			console.log('records fetched from DB');	
			
			result1.recordset.forEach(function(Participant){
				map.set(Participant.Username,[]);
			})
			
			result1.recordset.forEach(function(Participant) {
				var User=Participant.Username;
				
				participants.push(User);
				var week_stats = [];
				//participant_week_Stats.push("");
				request.query("select * from dbo.WeeklyStatistics where Player in (select Player from dbo.Fantasy_Team where Participant = '"+User+"')", function (err, result2) { 
					//console.log(result2);
					for(var i=1;i<18;i++){
						var weekly_score=0;
					result2.recordset.forEach(function(Player) {
						var key="Week"+i;
						weekly_score=weekly_score+(Player[key]);
						//console.log(key+" "+weekly_score);
						
					})
						week_stats.push(weekly_score);
						
						//weekly_score=0;
					}
					//console.log("User "+User);
					//console.log(week_stats);
					
					map.set(User,week_stats);
					console.log(week_stats);
					
					//participant_week_Stats = {week_stats};
					//console.log(participant_week_Stats);
					//participant_week_Stats.push(week_stats);
					console.log(map);
					//console.log(map.get(User)[0]);
					var stats=map.get(User);
					//temp.User=week_stats; Insert logic here
					
					request.query("INSERT INTO WeeklyStatistics_Participant ([Username],[Week01],[Week02],[Week03],[Week04],[Week05],[Week06],[Week07],[Week08],[Week09],[Week10],[Week11],[Week12],[Week13],[Week14],[Week15],[Week16],[Week17]) VALUES ('"+User+"','"+stats[0]+"','"+stats[1]+"','"+stats[2]+"','"+stats[3]+"','"+stats[4]+"','"+stats[5]+"','"+stats[6]+"','"+stats[7]+"','"+stats[8]+"','"+stats[9]+"','"+stats[10]+"','"+stats[11]+"','"+stats[12]+"','"+stats[13]+"','"+stats[14]+"','"+stats[15]+"','"+stats[16]+"')").then(function (err, result)
						{
							counter++;
							//console.log(err);
							console.log(map.size);
							//console.log("counter"+counter);
							console.log('Inserted Weekly stats to DB');	
							
							if(counter==map.size){
								res.redirect("/participantstats");
							}
							
						 }).catch(err => {
							console.log('Could not insert the record to DB. Exiting now...', err);
							process.exit();
						});
								
					//myJSON=JSON.stringify(map); Insert login end.
					week_stats=[];
					
					//res.render('weekstats',{map});
					//request2.end;	
					//res.render('weekstats',{map:map});
					//temp.set(map);
				});
				//res.sendStatus(202);
				//console.log(map);
				console.log("sending data to ejs");  
				//console.log(participants);
				//console.log(week_Stats);
				console.log("after foreach user loop");
				
			}); // result1 loop
			
			
			
			console.log("After the result1 loop");
			
			//console.log(map);
			//console.log(data);
			
			//res.render('FantasyTeam.ejs', { result });
			//console.log(result.recordset.length);
			 /*var participant = result1.map;
			 for (var key in participant) {
					console.log(participant[key].value);
			  }*/
			 console.log("counter"+counter);
			
			
		 }); // req1 loop
			//const result = validationResult(req);
			 //console.log(errors);
			
			 //console.log(""+);
			console.log("after all requests");
			//res.redirect("/participantstats");
			//console.log(map.get('jay'));
			//request.query("select distinct * from dbo.WeeklyStatistics_Participant", function (err, result) 
			/*request.query("select distinct * from dbo.WeeklyStatistics_Participant").then(function (err, result)
			{
				
				console.log('records fetched from DB');	
				
				//res.send('/index.html')
				//res.send('FantasyTeam');
				//res.render(path.resolve(__dirname + "/views/FantasyTeam"),{result});
				res.render('weekstats.ejs', { result });
				//console.log(result.recordset.length);
			 }).catch(err => {
							console.log('Could not fetch the records from DB. Exiting now...', err);
							process.exit();
						});*/
			//res.render('weekstats',{map});
			//console.log(result1);
			
		 
		}).catch(err => {
			console.log('Could not connect to the database. Exiting now...', err);
			process.exit();
		});
  
  
})

app.get('/participantstats',isAuthenticated, (req, res) => {
  //res.sendFile(__dirname + '/index.ejs')
  sql.connect(dbConfig, {
			useNewUrlParser: true
		}).then(() => {
		// create Request object
        var request = new sql.Request();
  request.query("select distinct * from dbo.WeeklyStatistics_Participant", function (err, result)
			{
				
				console.log('records fetched from DB');	
				console.log(result);
				//res.send('/index.html')
				//res.send('FantasyTeam');
				//res.render(path.resolve(__dirname + "/views/FantasyTeam"),{result});
				res.render('weekstats.ejs', { result });
				//console.log(result.recordset.length);
			 })
						
	}).catch(err => {
			console.log('Could not connect to the database. Exiting now...', err);
			process.exit();
		});					
})

function isAuthenticated(req, res, next) {
  // do any checks you want to in here

  // CHECK THE USER STORED IN SESSION FOR A CUSTOM VARIABLE
  // you can do this however you want with whatever variables you set up
  if (req.session.loggedin)
      return next();

  // IF A USER ISN'T LOGGED IN, THEN REDIRECT THEM SOMEWHERE
  res.redirect('/');
}
