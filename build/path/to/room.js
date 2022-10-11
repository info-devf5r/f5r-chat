$('.ch-open').on('click',function(){
    $(this).css({transform:'translateX(100%)'});
    $('.rchat-holder').css({visibility:'visible'});
    $('.rchat-holder').css({transform:'translateX(0%)'});
    $('.rvideo-holder').css({left:'5%'});
    $('.ch-close').css({right:'22%'});
});

$('.ch-close').on('click',function(){
    $(this).css({right:'-5%'});
    $('.rchat-holder').css({transform:'translateX(100%)'});
    $('.rvideo-holder').css({left:'17.5%'});
    setTimeout(function(){$('.ch-open').css({transform:'translateX(0%)'});$('.rchat-holder').css({visibility:'hidden'})},400);
})

$('.rvideo-pin').hover(
    function(){
        $(this).html('UN '+$(this).html())
    },
    function(){
        $(this).html('<i class="fas fa-map-pin ricon"></i>')
    }
)

$('.voice-slider-range').on("input change", function () {
    var range = $(this).val()
    $('.voice-slider-buffer').css("width", range * 100 + "%");
    $('.voice-slider-range').attr("value", range);
  });
  $('.voice-slider-range').keyup(function () {
      var range = $(this).val();
      $('.voice-slider-buffer').css("width", range * 100 + "%");
      $('.voice-slider-range').attr("value", range);
    })
    .keyup();
var optid  = ['home','vidup','vidch','vid']
var col = [
        'rgb(185,20,30) 0,rgb(174,20,30) 50%,',
        'rgb(0,150,50) 0,rgb(25,155,20) 50%,',
        'rgb(16,26,150) 0,rgb(10,20,150) 50%,',
        'rgb(32,125,120) 0,rgb(22,115,110) 50%,'
    ]
var pos = ['13.5%','36%','58%','80%']
$('.dashboard-option').css({width:$('.dashboard-option').height()})
$('.dashboard-option').first().css({borderRadius:'13px',backgroundImage:'linear-gradient(45deg,rgb(185,20,30) 0,rgb(174,20,30) 50%,rgb(30,180,250) 50%,rgb(50,200,210) 100%)'})
$($('.d-opt-icon')[0]).css({color:'rgb(255,255,255)',textShadow:'0 0 3px rgb(255,255,255)'})

var prev_id = 'home';
var ind = 0; 
$('.dashboard-option').on('click',function(){
    ind = optid.indexOf($(this).attr('id'))
    $('.dashboard-option').not(this).css({borderRadius:'50%',backgroundImage:'linear-gradient(45deg,rgb(255,245,255) 0,rgb(244,240,240) 50%,rgb(30,180,250) 50%,rgb(50,200,210) 100%)'})
    $(this).css({borderRadius:'13px',backgroundImage:'linear-gradient(45deg,'+col[ind]+'rgb(30,180,250) 50%,rgb(50,200,210) 100%)'})
    $('.d-opt-selector').css({left:pos[ind],backgroundColor:col[ind].split(' ')[0]})
    $('.d-opt-icon').css({color:'rgba(25,25,25)',textShadow:'0 0 3px rgb(25,25,25)'})
    $($('.d-opt-icon')[ind]).css({textShadow:'0 0 3px rgb(255,255,255)',color:'rgba(255,255,255)'})

    var ioc = $('.inside-overall-container');
    var ioc_child = $('.container,.video-upload-container,.video-list')
    var id = $(this).attr('id');
    if(prev_id == id) return;
    if(id == 'home'){
        $('.r-members,.r-videos').css({transform:'translateX(-100%)'});
        $('.r-rooms').css({transform:'translateX(0%)'});
    
        if(prev_id == 'vid') return
        ioc.css({transform:"translateY(0%)"})
    }
    else if(id == 'vidup'){
        $('.r-members,.r-rooms').css({transform:'translateX(-100%)'});
        $('.r-videos').css({transform:'translateX(0%)'});
        ioc.css({transform:"translateY(-33.334%)"})
    }
    else if(id == 'vid'){
        $('.r-members,.r-rooms').css({transform:'translateX(-100%)'});
        $('.r-videos').css({transform:'translateX(0%)'});
        if(prev_id == 'home') return
        ioc.css({transform:"translateY(0%)"})
    }
    else if(id == 'vidch'){
        $('.r-videos,.r-rooms').css({transform:'translateX(-100%)'});
        $('.r-members').css({transform:'translateX(0%)'});
        ioc.css({transform:"translateY(-66.667%)"})
    }
    ioc_child.css({transform:'scale(0.6)',borderRadius:'200px'})
    prev_id = id;
    setTimeout(()=>{ioc_child.css({transform:'scale(1.0)',borderRadius:'0px'})},800)
})
$('.dashboard-option').hover(function(){
    $(this).find('.d-opt-icon').css({color:'rgba(255,255,255)',textShadow:'0 0 3px rgb(255,255,255)'});
},function(){
    temp_ind = optid.indexOf($(this).attr('id'))
    if(temp_ind == ind){
        return;
    }
    $(this).find('.d-opt-icon').css({color:'rgba(25,25,25)',textShadow:'0 0 3px rgb(25,25,25)'});
})

$('.rk-vid-upload').hover(function(){
    $('.rinnercircle').css({backgroundPosition:'100%'})
},function(){
    $('.rinnercircle').css({backgroundPosition:'0%'})
})