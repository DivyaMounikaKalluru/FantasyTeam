
//console.log(checked());

function login(){ 
const button = document.getElementById('login');
//const error = document.getElementById('errormessage');

//var username= $("#username");
//var password = $("#password");
const username = document.getElementById('username').value;
const password = document.getElementById('password').value;
//const data={selectedplayers:window.players};
//button.addEventListener('click', function() {
  console.log('button was clicked');
  //console.log(players);
  console.log(username.length);
  console.log(password);
  
	  if(username.length==0){
						 document.getElementById('errormessage').innerHTML = 'Please enter the username and password';
						//alert('Please enter the username');
						}
		else
		{
					if(password.length==0)
						{
							document.getElementById('errormessage').innerHTML = 'Please enter the password';
						}
					 else {
							fetch('/Login', {method: 'POST',
							body: JSON.stringify({"username": username,"password":password}),
							headers: {'Content-Type':'application/json'},
							})
							.then(function(response) {
								console.log(response);
								if(response.status==501){
								document.getElementById('errormessage').innerHTML = 'Please enter correct Password!!!';
								}
								else if(response.status==502){
								document.getElementById('errormessage').innerHTML = 'User doesnot exist!!!!Please register User.';
								}
								else if(response.status==400){
								document.getElementById('errormessage').innerHTML = 'Please enter Username and Password.';
								}
								else if(response.status==200){
									console.log('click was recorded.');
									//CallGetMethod();
									window.location.href = "/Participant";
								}
							  
							  throw new Error('Request failed.');
							})
							.catch(function(error) {
							  console.log(error);
							});
					 }					 
	 
		}  
//});
}
