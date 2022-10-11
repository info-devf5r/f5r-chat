

var cur = 'l';$('#login').css({backgroundPosition:"100%"});

$('#login').on('click',function(){
    if(cur == 'l'){return;}cur ='l';
    $('#login').css({backgroundPosition:"100%"});
    $('#signup').css({backgroundPosition:"0%"});
    $('.lsmain').css({transform:'translateX(0%)'});
    $('.l,.s').css({transform:'scale(0.7)',borderRadius:'100px'});
    $('.cover-up').css({backgroundImage:'radial-gradient(circle at 0px 0px,  transparent 0, transparent 20px,rgba(150,150,150) 20px)'});
    setTimeout(
        function(){
            $('.l,.s').css({transform:'scale(0.9)',borderRadius:'40px'});
        },450);
    
});

$('#signup').on('click',function(){
    if(cur=='s'){return;}cur = 's';
    $('#signup').css({backgroundPosition:"100%"});
    $('#login').css({backgroundPosition:"0%"});
    $('.lsmain').css({transform:'translateX(-50%)'});
    $('.l,.s').css({transform:'scale(0.7)',borderRadius:'100px'});
    $('.cover-up').css({backgroundImage:'radial-gradient(circle at 0px 0px,  transparent 0, transparent 20px,rgba(180,180,180) 20px)'});
    setTimeout(
        function(){
            $('.l,.s').css({transform:'scale(0.9)',borderRadius:'40px'});
        },450);
    
});

$("input").on('focus',function(){
    $(this).prev().css({transform:'rotateZ(360deg) scale(1.1)' })
})
$("input").on('focusout',function(){
    $(this).prev().css({transform:'rotateZ(0deg) scale(1)'})
})


$('.ssub').on('click',function(){
    var ok = true;
    var i,k = $('.icon2');
    for(i=0;i<k.length;i++){
        if($(k[i]).css('display') != 'none'){
            $(k[i]).parent().css({animation:'anim3 ease-in-out 0.2s infinite'});
            ok = false;
        }
    }
    setTimeout(function(){
        $('.icon2').parent().css({animation:''});
        for(i=0;i<k.length;i++){
            if($(k[i]).css('display') != 'none'){
                $(k[i]).next().css({visibility:'visible'});
            }
        }
        setTimeout(function(){$('.icon2').next().css({visibility:'hidden'});},2000);
    },1500);
    if(ok){
        var arr = [$('#user'),$('#email'),$('#cpass'),$('#pass')];
        for(i = 0;i<arr.length;i++){
            if(arr[i].val() == ''){
                ok = false;
                break;
            }
        }
        if(ok){
            var k =$(this);
            var res = {'username':arr[0].val(),'email':arr[1].val(),'password':arr[2].val()};
            k.css({width:k.height()});
            k.text('');
            setTimeout(function(){
                k.append('<div class="loading-spinner"/>');
            },400);
            axios.post('https://watch-party-latest.herokuapp.com/users',{...res})
                .then((res)=>{
                    console.log(res.data)
                    document.cookie = "vid-token="+res.data.token+";";
                    document.cookie = "id="+res.data.user._id+";";
                    setTimeout(function(){
                        k.html('');
                    },400);
                    setTimeout(function(){
                        k.css({transform:'scale(23)'});
                        setTimeout(function(){
                            var ur = new URL(window.location.href);var k = ur.search.split('=')[1];
                            window.location.href = ur.origin + k;
                        },500);
                    },1000)
                })
                .catch(err=>{
                    setTimeout(function(){
                        k.html('');
                        k.css({width:'30%'});
                        setTimeout(function(){
                            k.html('Sign In');
                        },300)
                    },400)
                })
        }
        else{setTimeout(function(){$('.ssub').css({animation:'0.2s ease-in-out anim4 infinite'});},400);}
    }else{setTimeout(function(){$('.ssub').css({animation:'0.2s ease-in-out anim4 infinite'});},400);}
    setTimeout(function(){$('.ssub').css({animation:''});},900)
});

$('.lsub').on('click',function(){
    if($(this).text() == '') return;
    if($('#lemail').val().trim()=='' || $('#lpass').val().trim() == ''){
        setTimeout(function(){$('.lsub').css({animation:'0.2s ease-in-out anim4 infinite'});},500);
        setTimeout(function(){$('.lsub').css({animation:''});},1000);
        return;
    }
    var k =$(this);
    k.css({width:k.height()});
    k.text('');
    setTimeout(function(){
        k.html('<div class="loading-spinner"/>');
    },400);
    axios.post('https://watch-party-latest.herokuapp.com/users/login',{email:$('#lemail').val().trim(),password:$('#lpass').val().trim()})
        .then((res)=>{
            localStorage.setItem('id',res.data.user._id);
            localStorage.setItem('vid-token',res.data.token);
            setTimeout(function(){
                k.html('');
            },400)
            setTimeout(function(){
                k.css({transform:'scale(23)'});
                setTimeout(function(){
                    var ur = new URL(window.location.href);
                    var k = ur.search.split('=')[1];
                    window.location.href = ur.origin + (k?k:'');
                },500);
            },1000)
        })
        .catch(err=>{
            $(".wrong-message").css({left:'2%',transform:'scale(1.0)'})
            setTimeout(function(){
                k.html('');
                k.css({width:'30%'});
                setTimeout(function(){
                    k.html('Sign In');
                },300)
            },400)
            setTimeout(()=>{
                $(".wrong-message").css({left:'-50%',transform:'scale(0.5)'})
            },5000)
        })
    
});

$('#user').on('focusout',function(){

});
$('.fa-eye').on('click',function(){
    var k = $(this)
    $(this).fadeOut(200,function(){
        k.prev().css({animation:'1s anim1 infinite ease-in-out'});
        k.next().fadeIn(200,function(){
            k.prev().css({animation:''});
            k.prev().attr('type','text');
        })
    });
    
})

$('#email').on('keydown',function(e){
    if(e.key == ' '){
        e.preventDefault();
    }
})
$('#user').on('input change',function(){var e = $(this)
    if(e.val().length>=5){
        e.parent().find('.icon2').fadeOut(200,function(){e.parent().find('.icon1').fadeIn(200)});
    }
    else{
        e.parent().find('.icon1').fadeOut(200,function(){e.parent().find('.icon2').fadeIn(200)});
    }
})
$('#pass').on('input change',function(){var e = $(this)
    if(e.val().length>=8){
        e.parent().find('.icon2').fadeOut(200,function(){e.parent().find('.icon1').fadeIn(200)});
    }
    else{
        e.parent().find('.icon1').fadeOut(200,function(){e.parent().find('.icon2').fadeIn(200)});
    }
    
    var c = $('#cpass');if(c.val() == ''){return;}
    if(c.val()==e.val()){
        c.parent().find('.icon2').fadeOut(200,function(){c.parent().find('.icon1').fadeIn(200)});
    }
    else{
        c.parent().find('.icon1').fadeOut(200,function(){c.parent().find('.icon2').fadeIn(200)});
    }
})
$('#cpass').on('input change',function(){var e = $(this)
    if(e.val()==$('#pass').val()){
        e.parent().find('.icon2').fadeOut(200,function(){e.parent().find('.icon1').fadeIn(200)});
    }
    else{
        e.parent().find('.icon1').fadeOut(200,function(){e.parent().find('.icon2').fadeIn(200)});
    }
})
$('#email').on('input change',function(){
    var e = $('#email')
    var re = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}/igm;
    if(re.test(e.val())){
        e.parent().find('.icon2').fadeOut(200,function(){e.parent().find('.icon1').fadeIn(200)});
    }
    else{
        e.parent().find('.icon1').fadeOut(200,function(){e.parent().find('.icon2').fadeIn(200)});
    }
    e.css({width:'84%'});
})
$('.icon2').hover(function(){$(this).next().css({visibility:'visible'});
},function(){var k = $(this);setTimeout(function(){k.next().css({visibility:'hidden'});},200)})

$('.fa-eye-slash').on('click',function(){
    var k = $(this)
    $(this).fadeOut(200,function(){k.prev().prev().css({animation:'1s anim1 infinite ease-in-out'});
        k.prev().fadeIn(200,function(){
            k.prev().prev().css({animation:''});
            k.prev().prev().attr('type','password');
        })
    });
    
})


var count = 1;
abc();
$($('.ind-changer')[0]).css({transform:'scale(1.5)'})

$('.ind-cover').css({left:'0px'});
var time_out;
function abc(){
    time_out = setTimeout(abc2,4500)
}

function abc2(k = 0){
    $('.temp-cover').css({opacity:'0'});
    $($('.temp')[count]).find('.temp-cover').css({opacity:'1'});
    if(count == 0){$('.ind-cover').css({left:'0px'})}
    else if(count == 1){$('.ind-cover').css({left:'33.5px'})}
    else {$('.ind-cover').css({left:'67px'})}
                                                                
    if(k == 1) clearTimeout(time_out);
    $('.caurosel-container').css({transform:'translateX(-'+count * 33.33+'%)'});
    $('.ind-changer').css({transform:'scale(1)'});
    $($('.ind-changer')[count]).css({transform:'scale(1.5)'});
    count++;
    if(count == 3) {count = 0;}
    abc();
}
 
$('.ind-changer').on('click',function(){
    count = parseInt($(this).attr('count'));
    abc2(1);
})

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
}

var mover = $('.circle-temp1,.circle-temp2,.circle-temp');

const move = () => {
    $('.circle-temp1').css({transform:`translate(${getRandomInt(-40,40)}px,${getRandomInt(-40,40)}px)`})
    $('.circle-temp').css({transform:`translate(${getRandomInt(-40,40)}px,${getRandomInt(-40,40)}px)`})
    $('.circle-temp2').css({transform:`translate(${getRandomInt(-40,40)}px,${getRandomInt(-40,40)}px)`})
    
    setTimeout(()=>{move()},1800)
}
move();


