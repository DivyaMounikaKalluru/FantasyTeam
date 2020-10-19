



function weekstats(){
//const button = document.getElementById('playerselection');
//const data={selectedplayers:window.players};
//button.addEventListener('click', function() {
  console.log('button was clicked');
  console.log(players);
   //const response = fetch('/weekstats', {method: 'GET'}); // get users list
  //const users = await response.status; // parse JSON
  fetch('/weekstats', {method: 'GET'});
		//console.log("response "+response);
		
		//window.location.href = "/participantstats";
   /*fetch('/weekstats', {method: 'GET'})
    .then(function(response) {
				console.log(response);
				if(response.status==200){
						window.location.href = "/participantstats";
					}
					else{
						console.log("response is 300");
					}
				
			//
    })
    .catch(function(error) {
      console.log(error);
    });*/
 
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
