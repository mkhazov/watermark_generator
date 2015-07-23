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
   $(".socials_like-link").mouseenter(function(){
   	  $(this).children().addClass("sprite-like-active");
   });
   $(".socials_like-link").mouseleave(function(){
   	  $(this).children().removeClass("sprite-like-active");
   });
   $(".socials-fb").mouseenter(function(){
   	  $(this).children().addClass("sprite-fb-active");
   });
   $(".socials-fb").mouseleave(function(){
   	  $(this).children().removeClass("sprite-fb-active");
   });
   $(".socials-tw").mouseenter(function(){
   	  $(this).children().addClass("sprite-tw-active");
   });
   $(".socials-tw").mouseleave(function(){
   	  $(this).children().removeClass("sprite-tw-active");
   });
   $(".socials-vk").mouseenter(function(){
   	  $(this).children().addClass("sprite-vk-active");
   });
   $(".socials-vk").mouseleave(function(){
   	  $(this).children().removeClass("sprite-vk-active");
   });
  
   var newUrl = window.location; 

   
   if(newUrl == "http://watermark.mkhazov.ru/"){
    if($("#ru-lang").hasClass("chosen-lang"))
      window.location.replace("http://watermark.mkhazov.ru/rus");
    else if($("#en-lang").hasClass("chosen-lang"))
      window.location.replace("http://watermark.mkhazov.ru/eng");
   }

});