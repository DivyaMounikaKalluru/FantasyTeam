
var players = [];
$( "input[type=checkbox]" ).on( "click", function() {

 players = $.map($('input[name="playerName"]:checked'), function(c){return c.value; })
 
 //players.push(window.players);
 console.log(players);
  /*$.each($("input[name='[playerName']:checked"), function() {
                    players.push($("input:checked" ).val());
                });*/
  //alert("My location themes colors are: " + players.join(", "));              
  //alert($( "input:checked" ).val() + " is checked!" );
});
//console.log(checked());

function playerlist(){
const button = document.getElementById('playerselection');
//const data={selectedplayers:window.players};
//button.addEventListener('click', function() {
  console.log('button was clicked');
  console.log(players);
  if(players.length<6 || players.length>6){
	  document.getElementById('errormessage').innerHTML = 'please select only 6 players from the player list';
  }
  else{
  fetch('/InsertTeam', {method: 'POST',
	body: JSON.stringify(players),
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
    });
  }
//});
}
function CallGetMethod(){

  console.log('Inside CallGetMethod');
  /*$.ajax({
	  type: 'GET',
	  url: '/FantasyTeam',
	  success: function(result){
		  window.location.href = "/FantasyTeam";
	  },
	  error:function(xhr,status,err){
		  console.log(xhr.responseText);
	  }
  });*/
  fetch('/FantasyTeam', {method: 'GET'})
    .then(function() {
		console.log('Inside response');
		window.location.href = "/FantasyTeam";
    })
    .catch(function(error) {
      console.log(error);
    });
  
}
