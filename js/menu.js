$(document).ready (function(){
    var menu = $("nav ul");
    if ($(window).innerWidth() < 750){
        menu.hide();
    }
    
    $(window).resize(function(){
        $(".menu-toggle").removeClass("active");
        if ($(window).innerWidth() > 750){
            menu.show();
        }else {
            menu.hide();
        }
    })
    
    $(".menu-toggle").click(function(){
        $("nav ul").slideToggle();
    });
})