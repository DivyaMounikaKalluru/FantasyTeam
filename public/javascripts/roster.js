
//console.log(checked());

function roster(){
const button = document.getElementById('PlayerStats');
//const error = document.getElementById('errormessage');

//var username= $("#username");
//var password = $("#password");
var QuarterBack = document.getElementsByName('QuarterBack')[0].value;
var RunningBacks = document.getElementsByName('RunningBacks')[0].value;
var WideReceivers = document.getElementsByName('WideReceivers')[0].value;
var TightEnd = document.getElementsByName('TightEnd')[0].value;
console.log(QuarterBack);
console.log(RunningBacks);
console.log(WideReceivers);
console.log(TightEnd);
var roasterObj = {};
roasterObj["QuarterBack"]=QuarterBack;
roasterObj["RunningBacks"]=RunningBacks;
roasterObj["WideReceivers"]=WideReceivers;
roasterObj["TightEnd"]=TightEnd;
roasterObj["Total"]=QuarterBack+RunningBacks+WideReceivers+TightEnd;


//const password = document.getElementById('password').value;
//const data={selectedplayers:window.players};
//button.addEventListener('click', function() {
	console.log(roasterObj);
  console.log('button was clicked');
  //console.log(players);
  //console.log(username.length);
  //console.log(password);
  /*fetch('/listPlayers', {method: 'GET',
	headers: {'Content-Type':'application/json'},
	})
    .then(function(response) {
      if(response.ok) {
        console.log('click was recorded.');
        CallGetMethod();
		return;
      }
      throw new Error('Request failed.');
    })
    .catch(function(error) {
      console.log(error);
    });*/
	 window.location.href = "/listPlayers";  
//});
}
