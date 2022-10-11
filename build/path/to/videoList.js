var time_out;
var count = 0;
// abc()
function abc(){
    time_out = setTimeout(abc2,3000)
}
var tot = $('.indv-caurosel').length;
$($('.indv-caurosel')[0]).css({transform:'scale(1.1)'})
$('.prev-caurosel').fadeOut(1);


function abc2(k = 0){ 
    console.log('count : ',count);
    if(k == 1) {
        if(count == 0){$('.prev-caurosel').fadeOut(600);$('.next-caurosel').fadeIn(600);}
        else if(count == (tot-1)){$('.next-caurosel').fadeOut(600);$('.prev-caurosel').fadeIn(600);}
        else{$('.prev-caurosel,.next-caurosel').fadeIn(600);}
    }
    $('.vid-caurosel-mover').css({transform:'translateX(-'+count * (100/tot)+'%)'});
    $('.indv-caurosel').css({transform:'scale(0.9)'})
    $($('.indv-caurosel')[count]).css({transform:'scale(1.1)'})
    if(count == 0&&k == 0) {$('.next-caurosel').fadeIn(600);return;}
    if(k == 0)count++;
    if(count == tot) {count = 0;}
    if(k == 0) abc();
}
$('.prev-caurosel').on('click',function(){
    count = count == 0?0:(count-1)
    abc2(k = 1);
})
$('.next-caurosel').on('click',function(){
    count = count == (tot-1)?(tot-1):(count+1)
    abc2(k = 1);
})

$('.vlk-vid-upload,.vlinnercircle').hover(
    function(){
        $('.vlano-holder').css({marginLeft:'5px',width:'110px'})
    },
    function(){
        $('.vlano-holder').css({marginLeft:'0px',width:'0px'})
    }
)
$('.vlk-vid-upload1,.vlinnercircle1').hover(
    function(){
        $('.vlano-holder1').css({marginLeft:'5px',width:'110px'})
    },
    function(){
        $('.vlano-holder1').css({marginLeft:'0px',width:'0px'})
    }
)
$('.vlk-vid-upload').on('click',function(){
    $('.vlinnercircle')[0].click()
})
$('.vlinnercircle').on('click',function(){
    $('.vlano-holder').css({marginLeft:'0px',width:'0px'})
})
$('.vlinnercircle1').on('click',function(){
    $('.vlano-holder1').css({marginLeft:'0px',width:'0px'})
})

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
}

function move(){
    $('.video-caurosel .circle-temp1').css({transform:`translate(${getRandomInt(-40,40)}px,${getRandomInt(-40,40)}px)`})
    $('.video-caurosel .circle-temp').css({transform:`translate(${getRandomInt(-40,40)}px,${getRandomInt(-40,40)}px)`})
    $('.video-caurosel .circle-temp2').css({transform:`translate(${getRandomInt(-40,40)}px,${getRandomInt(-40,40)}px)`})
    $('.video-caurosel .circle-temp3').css({transform:`translate(${getRandomInt(-40,40)}px,${getRandomInt(-40,40)}px)`})
    $('.video-caurosel .circle-temp4').css({transform:`translate(${getRandomInt(-40,40)}px,${getRandomInt(-40,40)}px)`})

    setTimeout(()=>{move()},1800)
}
move();