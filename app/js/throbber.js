$(document).ready(function() {

     $("#download").click(function(){
    if($("#source-image").val() && $("#watermark-image").val()){

     $('#image_container').block({ message: $('#throbber'), css: { border: 'none', backgroundColor: 'none'}});
    }
  });
      
});  