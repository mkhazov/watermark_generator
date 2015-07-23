$(document).ready(function(){
  
  if($("html").attr("lang")=="ru"){
    $("#ru-lang").addClass("chosen-lang").removeAttr("href");
  }
  else if($("html").attr("lang")=="en"){
    $("#en-lang").addClass("chosen-lang").removeAttr("href");
  }

	var openKey=false;

   $(".socials_like-link").mouseenter(function(){
   	   if(openKey===false){
       $(".socials").stop(true, true).animate({marginLeft: "+=43px"},"fast");
       
       openKey=true;}
   });
   
    $(".socials").mouseleave(function(){
       if(openKey===true){
        $(".socials").stop(true, true).animate({marginLeft: "-=43px"},"fast");	
       openKey=false;}   
      }); 
    
   var newUrl = window.location; 

   
   if(newUrl == "http://watermark.mkhazov.ru/"){
    if($("#ru-lang").hasClass("chosen-lang"))
      window.location.replace("http://watermark.mkhazov.ru/rus");
    else if($("#en-lang").hasClass("chosen-lang"))
      window.location.replace("http://watermark.mkhazov.ru/eng");
   }

});