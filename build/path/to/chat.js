var socket = window.socket;

console.log('chat socket',socket);
$.fn.textWidth = function(text, font) {
  if (!$.fn.textWidth.fakeEl) $.fn.textWidth.fakeEl = $('<span>').hide().appendTo(document.body);
  $.fn.textWidth.fakeEl.text(text || this.val() || this.text()).css('font', font || this.css('font'));
  return $.fn.textWidth.fakeEl.width();
};
var inp = $("#inp");
$(".chat-input textarea").on('input change',function(){
    var maxrows = 4;
    var p = $(".chat-input textarea");
    var wi = p.width();
    var arr = p.val().split('\n');
    var rows = arr.length;
    for(var i = 0;i<arr.length;i++){
      var wid = $('<p>'+arr[i]+'</p>').textWidth();
      if(wid-(wi*parseInt(wid/wi))>3)
        rows+=parseInt(wid/wi);
    }
    if(rows>maxrows) p.attr('rows',4);
    else p.attr('rows',rows);
    if(rows == 1)
      $(".ch-o-bt").not('.video .ch-o-bt').css({bottom:31.1+p.height()+'px'});
    else
      $(".ch-o-bt").not('.video .ch-o-bt').css({bottom:25+p.height()+'px'});
  });
  socket.on('rec-chat',function(data){
    var d=new Date();
    var own = '<div class = "message-owner" style = "color:'+data.color+'">'+data.owner+'</div>'
    
    var k = '<div class = "message-other" style = "transform:translateX(0%)" >'+
      own+
      data.msg+'<div class="message-time">'+addZero(d.getHours())+':'+addZero(d.getMinutes())+'</div></div>';
      
    
    if($('.chat-date').last().text() != 'Today'){
      $('.ch-o-bt').append('<div class = "chat-date">Today</div>') 
    }
    $('.ch-o-bt').append(k);
    $('.rchat-holder .ch-o-bt').scrollTop($('.rchat-holder .ch-o-bt')[0].scrollHeight)
    
    $('.video .ch-o-bt').scrollTop($('.rchat-holder .ch-o-bt')[0].scrollHeight)
  })
  function addZero(num){
    if(num/10<1){
      return '0'+num;
    }
    return num;
  }
  function titleCase(str) {
    return str.toLowerCase().split(' ').map(function(word) {
      return word.replace(word[0], word[0].toUpperCase());
    }).join(' ');
  }
  $('.chat-send').on('click',function(){  
    if(inp.val().trim() == ''){
      return;
    }
    var txt = inp.val().trim();
    txt = txt.replaceAll('\n','<br/>');
    var d = new Date();
    var k = '<div class = "message-mine" style = "transform:translateX(0%)">'+txt+'<div class="message-time">'+addZero(d.getHours())+':'+addZero(d.getMinutes())+'</div></div>';
    socket.emit('send-chat',{msg:txt,owner:titleCase(window.user.user.username),roomID:window.user.room,id:window.user.user._id});
    
    if($('.chat-date').last().text() != 'Today'){
     $('.ch-o-bt').append('<div class = "chat-date">Today</div>') 
    }
    $('.ch-o-bt').append(k);
    var b = $('.ch-o-bt')
    $('.rchat-holder .ch-o-bt').scrollTop($('.rchat-holder .ch-o-bt')[0].scrollHeight)
    $('.video .ch-o-bt').scrollTop($('.rchat-holder .ch-o-bt')[0].scrollHeight)
    

    inp.val('')
    $('textarea').attr('rows',1);
    $(".ch-o-bt").not('.video .ch-o-bt').css({bottom:31.1+$('textarea').height()+'px'});
  })

  $('.chat-send').css({height:$('.chat-send').width()+'px'})