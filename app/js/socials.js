$(document).ready(function(){
	var openKey=false;
   $(".socials_like-link").click(function(){
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

});