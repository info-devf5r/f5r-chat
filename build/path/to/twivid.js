var socket = window.socket

$.fn.textWidth = function(text, font) {
  if (!$.fn.textWidth.fakeEl) $.fn.textWidth.fakeEl = $('<span>').hide().appendTo(document.body);
  $.fn.textWidth.fakeEl.text(text || this.val() || this.text()).css('font', font || this.css('font'));
  return $.fn.textWidth.fakeEl.width();
};

var jQueryPlugin = (window.jQueryPlugin = function (ident, func) {
    return function (arg) {
    if (this.length > 1) {
        this.each(function () {
        var $this = $(this);

        if (!$this.data(ident)) {
            $this.data(ident, func($this, arg));
        }
        });

        return this;
    } else if (this.length === 1) {
        if (!this.data(ident)) {
        this.data(ident, func(this, arg));
        }

        return this.data(ident);
    }
    };
});



  (function () {
    function twitterVideoPlayer($root) {
      const element = $root;
      const video = $root.first(".vid-url-play");
      const video_element = $(video).find("video");
      const video_preview = $(video).find(".video-preview");
      const video_top = $(video).find(".video-top");
      const video_start_btn = $(video).find(".video-start-btn");
      const video_control_btn = $(video).find(".video-control-btn");
      const video_control_play = $(video).find(".video-control-play");
      const video_control_pause = $(video).find(".video-control-pause");
      const video_voice = $(video).find(".video-voice");
      const video_voice_btn = $(video).find(".video-voice-btn");
      const video_voice_on = $(video).find(".video-voice-on");
      const video_voice_off = $(video).find(".video-voice-off");
      const full_screen_btn = $(video).find(".full-screen-btn");
      const full_screen_open = $(video).find(".full-screen-open");
      const full_screen_exit = $(video).find(".full-screen-exit");
      const video_voice_slider = $(video).find(".video-voice-slider-range");
      const video_voice_rail = $(video).find(".video-voice-slider-rail");
      const video_voice_buffer = $(video).find(".video-voice-slider-buffer");
      const video_slider = $(video).find(".video-slider-container");
      const video_slider_rail = $(video).find(".video-slider-rail");
      const video_slider_buffered = $(video).find(".video-slider-buffered");
      const video_slider_buffer = $(video).find(".video-slider-buffer");
      const video_slider_tooltip = $(video).find(".video-slider-tooltip");
      const video_count_time = $(video).find(".video-count-time");
      const video_count_fulltime = $(video).find(".video-count-fulltime");
      const video_loading = $(video).find(".video-loading");
      const video_reset = $(video).find(".video-reset");
      const video_reset_btn = $(video).find(".video-reset-btn");
      const video_contextMenu = $(video).find(".video-contextMenu");

      const video_playback_rate = $(video).find(".video-playback-rate");
      const video_playback_speed = $(video).find(".video-playback-speed");
      const video_playback_box = $(video).find(".video-playback-box");

    
        
      function capture() {
        var canvas = document.getElementById('canvas');
        canvas.width = $("video").width();
        canvas.height = $("video").height();
        canvas.getContext('2d').drawImage(vid, 0, 0, $("video").width(),$("video").height());
        var dataURL = canvas.toDataURL();console.log(dataURL)
        return dataURL;
      }
      $('.anim').css({height:$('.anim').width()})

      function showq(){
        $(".anim").addClass("anime");
        setTimeout( function(){$(".anim").removeClass("anime"); }, 600);
      }

      var vid = $(video_element).get(0);
      function ch(src){
        $(".anim-img").attr("src" , "/static-img/"+src);
        // console.log($(".anim-img").get(0),src)
      }
      $('.video').hover(hov,ohov);
      var tio = null;
      $(".video").mousemove(hov);
      var ch_bt = 0.5;ch_ht = 100;
      function hov(){
        if(tio != null){clearTimeout(tio);}
        $('.video-slider').css({marginBottom:"-7px"});
        $('.row').css({transform:"translateY(0px)"});
        $('.video .chat-output').css({bottom:ch_bt+'%',height:ch_ht+'%'});
        if($(window).width()<800){
          $('.video-slider').css({marginBottom:"-58px"});
        }
        tio = setTimeout( ohov , 3000);
      }

      function ohov(){
        if(vid.paused){return;}
        $('.row').css({transform:"translateY(58px)"});
        $('.video .chat-output').css({bottom:'-10%',height:'110%'});
        $('.video-slider').css({marginBottom:"-58px"});
        
      }
      var request_sent = false;
      $(vid).on("loadedmetadata",LoadMetaData)
      function LoadMetaData(){
        request_sent = true;
        console.log("request running... client side")
        socket.emit('request',{id:window.user.user._id,roomID:window.user.room});
      }
      socket.on('begin',function(data){
        console.log('begin running...',data.paused);
        vid.currentTime = data.cur;
        vid.playbackRate = data.playbackRate;
        if(data.paused){pause();}
        else{$(vid).on("canplay",function(){console.log("canplay....");play();});}
        if(data.cur!=0){$(video_preview).hide();}
      });

      socket.on('req',function(){
        sendData();
      })
      function sendData(){
        var data = {cur:vid.currentTime,playbackRate:vid.playbackRate,paused:vid.paused,ended:vid.ended}
        $('.video-incoming').css({visibility:'visible'});
        if(!vid.paused){
          pause();
          data.cur = vid.currentTime
        }
        socket.emit('vid',{...data,roomID:window.user.room});
      }
      socket.on('play',function(){
        $(video_preview).hide();
        $('.video-incoming').css({visibility:'hidden'});
        play(1);
        showq();
      })
      socket.on('pause',function(){
        $('.video-incoming').css({visibility:'hidden'});
        pause(1);
        showq();
      })
      function play(k=0) {
        if(k == 0)
          socket.emit('play',{roomID:window.user.room});
        ch("play.png");
        vid.play();
        video_control_play.hide();
        video_control_pause.show();
      }
      function pause(k=0) {
        if(k == 0)
          socket.emit('pause',{roomID:window.user.room});
        ch("pause.png");
        hov();
        vid.pause();
        video_control_pause.hide();
        video_control_play.show();
      }
      function loading() {
        if (vid.readyState >= 3 ) {
          video_loading.hide();
          // play();
          // $(".video")
          if(qualch){
            play();qualch = false;
          }
        } else {
          if(!cur_click){
            video_loading.show();
          }
          if(qualch){
            pause();
          }
        }
      }
      $(".video_player_controls").hover(hov);
      
//paste chat code here      
      
      $(window).on('keydown',function(e){
        if(e.which == '37'||e.which == '39'){
          e.preventDefault();
        }
      })
      $(document).keydown(function(e){
        var tag = e.target.id;
        // if(tag == 'inp'&&e.which == 13&&inp.val().trim()!=''){
        //   inp.val("");
        // }
        if(e.which<32||e.which>39||tag == 'inp'||tag == 'textarea'){
          return;
        }
        if(e.which == '32'){if(vid.paused){play();$(video_preview).fadeOut(300);}else{pause();}showq();}
        if(e.which == '37'){replay(5.5);socket.emit('rf',{sk:'-',roomID:window.user.room})}
        if(e.which == '39'){forward(5.5);socket.emit('rf',{sk:'+',roomID:window.user.room})}
      })
      socket.on('rf',function(data){
        if(data.sk == '-'){
          replay(5.5);
        }
        else{
          forward(5.5);
        }
      })
      function replay(time){
        vid.currentTime -= 5.5;ch('replay5.png');showq();
      }
      function forward(time){
        vid.currentTime += 5.5;ch('forward5.png');showq();
      }
      $(vid).on("progress", function () {
        loading();
      });
      function voiceOn() {
        vid.muted = true;
        $(video_voice_on).hide();
        $(video_voice_off).show();
      }
      function voiceOff() {
        vid.muted = false;
        $(video_voice_on).show();
        $(video_voice_off).hide();
      }
      function Fullscreen(element) {
        ch_bt = -4.5;ch_ht = 105.5;
        if (element.requestFullscreen) element.requestFullscreen();
        else if (element.mozRequestFullScreen) element.mozRequestFullScreen();
        else if (element.webkitRequestFullscreen)
          element.webkitRequestFullscreen();
        else if (element.msRequestFullscreen) element.msRequestFullscreen();
        full_screen_open.hide();
        full_screen_exit.show();
      }
      function exitFullscreen() {
        ch_bt = 0.5;ch_ht = 100;
        if (document.exitFullscreen) document.exitFullscreen();
        else if (document.mozCancelFullScreen) document.mozCancelFullScreen();
        else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
        else if (document.msExitFullscreen) document.msExitFullscreen();
        full_screen_open.show();
        full_screen_exit.hide();
      }
      document.addEventListener('fullscreenchange', function(){
        if(IsFullScreen()){ch_bt = -4.5;ch_ht = 105.5;full_screen_open.hide();
          full_screen_exit.show();}
        else{ch_bt = 0.5;ch_ht = 100;full_screen_open.show();
          full_screen_exit.hide();}  
      });
      function IsFullScreen() {
        var full_screen_element =
          document.fullscreenElement ||
          document.webkitFullscreenElement ||
          document.mozFullScreenElement ||
          document.msFullscreenElement ||
          null;
        if (full_screen_element === null) return false;
        else return true;
      }
      function updateplayer() {
        if(!request_sent){LoadMetaData()}
        loading();if(qualch){return}
        var percentage = (vid.currentTime / vid.duration) * 100;
        if(vid.buffered.length>0){
          var per = (vid.buffered.end(0)/vid.duration)*100;
          video_slider_buffered.css({width:per+1 +"%"});
        }
        if(vid.duration-vid.currentTime>1){
          video_reset.css("display", "none");
        }
        video_slider_rail.css({ width: percentage + "%" });
        
        video_slider_buffer.css({ left: percentage - 1 + "%" });

        video_count_time.text(getFormatedTime(vid.currentTime));
        video_count_fulltime.text(getFormatedTime(vid.duration));
        // socket.emit('update',{cur:vid.currentTime});
      }
      socket.on('skip',function(data){
        skip(data.cur);
      }) 
      function skip(cur = 0) {
        if(cur == 0){
          var mouseX = event.pageX - video_slider.offset().left,
            width = video_slider.outerWidth();
          vid.currentTime = (mouseX / width) * vid.duration;
          socket.emit('skip',{cur:vid.currentTime,roomID:window.user.room});
        }
        else{
          vid.currentTime = cur;
        }
        updateplayer();
      }

      function getFormatedTime(k) {
        var seconds = Math.round(k);
        var minutes = Math.floor(seconds / 60);
  
        if (minutes > 0) {
          seconds -= minutes * 60;
        }
        if (seconds.toString().length === 1) {
          seconds = "0" + seconds;
        }
        if (minutes.toString().length === 1) {
          minutes = "0" + minutes;
        }
        return minutes + ":" + seconds;
      }
      
      video_slider.mousemove(tooltip);

      function tooltip() {
        var mouseX = event.pageX - video_slider.offset().left,
        width = video_slider.outerWidth();
        var cur = (mouseX / width) * vid.duration;
        if(cur<0||cur>vid.duration){
            return;
        }
        video_slider_tooltip.html(getFormatedTime(cur));
        video_slider_tooltip.css({left:Math.min(mouseX,video_slider.width()-video_slider_tooltip.width()-10)});
        video_slider_tooltip.show();
      }
      
      video_slider.hover(function(){},function(){video_slider_tooltip.hide()});

      video_start_btn.click(function () {
        $(video_preview).hide();
        play();
      });
      
      video_control_btn.click(function () {
        if (vid.paused) {
          play();
        } else {
          pause();
        }
        return false;
      });
      video_top.click(function () {
        if (vid.paused) {
          play();
        } else {
          pause();
        }
        showq();
        return false;
      });
      video_voice_btn.on('focus',function(){
        this.blur();
      })
      video_voice_btn.click(function (e) {
        
        if (vid.muted === false) {
          voiceOn();
        } else {
          voiceOff();
        }
      });
      full_screen_btn.click(function () {
        if (IsFullScreen()) exitFullscreen();
        else Fullscreen(video[0]);
      });
      full_screen_btn.on('focus',function(){
        this.blur();
      })
      video_top.dblclick(function () {
        if (IsFullScreen()) exitFullscreen();
        else Fullscreen(video[0]);
      });

      video_voice_slider.on("input change", function () {
        var range = (localStorage[this.id] = $(this).val());
        // console.log('range....',range);
        video_voice_buffer.css("width", range * 100 + "%");
        console.log(video_voice_buffer.css('width'),video_voice_buffer[0])
        vid.volume = range;
        video_voice_slider.attr("value", range);
        if (range == 0) {
          voiceOn();
        } else {
          voiceOff();
        }
      });
      video_voice_slider.each(function () {
        if (typeof localStorage[this.id] !== "undefined") {
          $(this).val(localStorage[this.id]);
        }
      });
      video_voice_slider.keyup(function () {
          var range = (localStorage[this.id] = $(this).val());
          video_voice_buffer.css("width", range * 100 + "%");
          vid.volume = range;
          video_voice_slider.attr("value", range);
          if (range == 0) {
            voiceOn();
          } else {
            voiceOff();
          }
        })
        .keyup();

      video_slider.click(function () {
        skip();
      });

      updateplayer();
      if(vid.buffered.length>0){
        video_count_fulltime.text(getFormatedTime(vid.duration));
      }

      var qualch = false;
      $(vid).on("timeupdate", function () {
          updateplayer();
      });

      $(video_slider_buffer).on("input change", function () {
        updateplayer();
      });

      var cur_click = false;
      $(video_slider_buffer).on("mousedown", function () {
        cur_click = true;
      });

      $(document).on("mousemove", function () {
        if(cur_click == true){
          tooltip();
          skip();
        }
      });
      $(document).on("mouseup", function () {
        
        cur_click = false;
        
        video_slider_tooltip.hide();
        updateplayer();
      });
      video_voice.hover(
        function () {
          video_slider.hide();
        },
        function () {
          video_slider.show();
        }
      );
      video_playback_rate.hover(
        function () {
          video_playback_box.show();
          video_slider.hide();
        },
        function () {
          video_playback_box.hide();
          video_slider.show();
        }
      );
      const video_playback = $(video).find(".video-playback");

      video_playback.click(function(){
        
          try{
            vid.playbackRate = parseFloat($(this).text());
            video_playback_speed.text($(this).text()+"x");
          }
          catch(err){
            console.log(err);
            vid.playbackRate = 1;video_playback_speed.text("Normal");  
          }
          socket.emit('plbck',{pb:vid.playbackRate,text:video_playback_speed.text(),roomID:window.user.room});
      });
      socket.on('plbck',function(data){vid.playbackRate = data.pb;video_playback_speed.text(data.text);});
      // const video_pixel_rate = $(video).find(".video-pixel-rate");
      // const video_pixel_speed = $(video).find(".video-pixel-speed");
      // const video_pixel_box = $(video).find(".video-pixel-box");
      // const video_pixel = $(video).find(".video-pixel");
      // video_pixel.click(function(){
      //     console.log()
      //     var t = $(this).text()
      //     if(t == video_pixel_speed.text()){return;}
      //     var ele = $('#org-video-src');
      //     var org_src = ele.attr('def');
      //     if(t=="High"){
      //       ele.attr("src",org_src);
      //     }else if(t == "Medium"){
      //       ele.attr("src",org_src.replace('upload/','upload/q_50/'));
      //     }else{
      //       ele.attr("src",org_src.replace('upload/','upload/q_25/'));
      //     }
      //     var cur = vid.currentTime;
      //     var plrt = vid.playbackRate;
      //     qualch = true;
      //     video_pixel_speed.text($(this).text());
      //     vid.load();
          
      //     vid.currentTime = cur;
      //     vid.playbackRate = plrt;
    
      // });
      const video_pip = $(video).find(".video-pip");
      if ('pictureInPictureEnabled' in document) {
        // video_pip.disabled = false;
      
        video_pip.on('click', () => {
          vid
            .requestPictureInPicture()
            .catch(error => {
             console.log(error)
            });
        });
      }

      $(vid).on("pause",function(){pause(1);})
      $(vid).on("play",function(){play(1);})
    
      // video_pixel_rate.hover(
      //   function () {
      //     video_pixel_box.show();
      //     video_slider.hide();
      //   },
      //   function () {
      //     video_pixel_box.hide();
      //     video_slider.show();
      //   }
      // );
      socket.on('end',function(){
        if(vid.ended){}
        else{
          vid.currentTime = vid.duration;
          updateplayer();
          ended = true;
        }
      })
      var ended = false;
      $(vid).on("ended", function () {
        video_reset.css("display", "flex");
        if(!ended){
          socket.emit('end',{roomID:window.user.room});
        }
        else{ended = false;}
      });
      video_reset_btn.click(function () {
        play();
        video_reset.css("display", "none");
      });
      var cht = false;
      $('.video-chat').on('click',function(){
        if(cht){
          $('.vchat-holder').css({right:'-40%'});
          video_top.css({transform:'translateX(0%)'})
          cht = false;$('#chat-on').hide(400);$('#chat-off').show(400);
        }
        else{
          $('.vchat-holder').css({right:'0%'});
          video_top.css({transform:'translateX(-35%)'});
          cht = true;$('#chat-off').hide(400);$('#chat-on').show(400);
        }
        
      })
      
    }
  
    $.fn.twitterVideoPlayer = jQueryPlugin(
      "twitterVideoPlayer",
      twitterVideoPlayer
    );
  })();
  
  $(".video").twitterVideoPlayer();

$(".video-start-btn").click(function (){
    console.log($(window).width(),$(window).height());
});