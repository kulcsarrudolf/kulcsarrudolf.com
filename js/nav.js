
$(document).ready(function(){ 

    $('#btnContact').click(function(){ 
        //$("html, body").animate({ scrollTop: 0 }, 600); 
        //return false;
        
        $('html, body').animate({
            scrollTop: $("#contact-me").offset().top
        }, 2000);
        
        
        //alert("test");

    }); 

    
});

function goToSection(sectionId){
    $('html, body').animate({
        scrollTop: $(sectionId).offset().top
    }, 1500);
}
