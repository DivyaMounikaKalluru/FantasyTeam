function search() {
$(document).ready(function(){

  // Search all columns
  $('#txt_searchall').keyup(function(){
    // Search Text
    var search = $(this).val();

    // Hide all table tbody rows
    $('.sortable tbody tr').hide();

    // Count total search result
    var len = $('.sortable tbody tr:not(.notfound) td:contains("'+search+'")').length;

    if(len > 0){
      // Searching text in columns and show match row
      $('.sortable tbody tr:not(.notfound) td:contains("'+search+'")').each(function(){
        $(this).closest('tr').show();
      });
    }else{
      $('.notfound').show();
    }

  });
});

$.expr[":"].contains = $.expr.createPseudo(function(arg) {
   return function( elem ) {
     return $(elem).text().toUpperCase().indexOf(arg.toUpperCase()) >= 0;
   };
});
}

/*function search() {
  $(document).ready(function () { 
        //add index column with all content. 
        $(".sortable tr:has(td)").each(function () { 
            var t = $(this).text().toLowerCase(); //all row text 
            $("<td class='indexColumn'></td>").hide().text(t).appendTo(this); 
        }); //each tr 
        $("#search").keyup(function () { 
            var s = $(this).val().toLowerCase().split(" "); 
          
            $(".sortable tr:hidden").show(); 
            $.each(s, function () { 
                $(".sortable tr:visible .indexColumn:not(:contains('"+ this + "'))").parent().hide(); 
            }); //each 
        }); //key up. 
    }); //document.ready 
}*/