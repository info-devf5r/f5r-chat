var circle = $('.progress-ring__circle')[0];
var radius = circle.r.baseVal.value;
var circumference = radius * 2 * Math.PI;

circle.style.strokeDasharray = `${circumference} ${circumference}`;
circle.style.strokeDashoffset = `${circumference}`;
$('.fa-check').fadeOut(10);
function setProgress(percent) {
  const offset = circumference - percent / 100 * circumference;
  circle.style.strokeDashoffset = offset;
  if(percent < 50){ r = 220+35*percent/50; g = 20+195*percent/50; b = 60}
  else{ r = 255-160*(percent-50)/50; g = 215+10*(percent-50)/50; b = 60-50*(percent-50)/50 }
  $('.innercircle').css({backgroundColor:`rgb(${r},${g},${b})`})
  if(percent >= 100){
    $('.k-vid-upload').fadeOut(500,function(){$('.fa-check').fadeIn(2000)})
    setTimeout(function () { 
      $('.fa-check').fadeOut(500,function(){$('.k-vid-upload').fadeIn(1500);setProgress(0)})
     },3500)
  }
}

$('.innercircle').css({backgroundColor:'rgb(255,0,60)'})
setProgress($('.slider').val());

$('.slider').on('input change', function(e) {
  if ($('.slider').val() < 101 && $('.slider').val() > -1) {
    setProgress($('.slider').val());
  }  
})

$('.innercircle').on('change',function(e){
  const files = $('.innercircle')[0].files;
  if(files) {
    if(files[0].type.includes('video')){
      $('.videoflname').html(files[0].name+`<i class="fas fa-times-circle cancelfile"></i>`)
      $('.cancelfile').on('click',function(){
        console.log('closing running')
        $('#vidfile').val('');
        $('.videoflname').html('')
      })
    }
    else{
      var k = $(".wr-message").html();
      $('.wr-message').html("Please Upload a video file there");
      $('.wr-message').css({animation:'anim111 ease-in-out 5s'})
        setTimeout(function(){
          $('.wr-message').css({animation:''})
          $('.wr-message').html(k);
        },5000)
      $('#vidfile').val('');
    }
  }  
  else console.log('files not there')
})


$('.innercircle1').on('change',function(e){
  const files = $('.innercircle1')[0].files;
  if(files) {
    if(files[0].type.includes('image')){
      $('.poster').html(files[0].name+`<i class="fas fa-times-circle cancelfile"></i>`)
      $('.cancelfile').on('click',function(){
        console.log('closing running')
        $('#imgfile').val('');
        $('.poster').html('')
      })
    }
    else{
      var k = $(".wr-message").html();
      $('.wr-message').html("Please Upload an image file there");
      $('.wr-message').css({animation:'anim111 ease-in-out 5s'})
        setTimeout(function(){
          $('.wr-message').css({animation:''})
          $('.wr-message').html(k);
        },5000)
      $('#vidfile').val('');
    }
  }  
  else console.log('files not there')
})

$('.k-vid-upload').on('click',function(){
  $('.innercircle')[0].click();
})

$('.fa-image').on('click',function(){
  $('.innercircle1')[0].click();
})
$('.cloudCancel').fadeOut(10);

var url = ["https://api.cloudinary.com/v1_1/earthy/image/upload","https://api.cloudinary.com/v1_1/earthy/video/upload"];

const CancelToken = axios.CancelToken;
const source = CancelToken.source();

  $('.cloudCancel').on('click',async(e) => {
    source.cancel('Operation canceled by user....');
    setProgress(0);
    $('.cloudCancel').fadeOut(200,function(){$('.cloudSubmit').fadeIn(200)});
  })
  $('.cloudSubmit').on("click", async(e) => {
    e.preventDefault();
    var name = $('.video-name').val();
    var desc = $('.video-desc').val();
    if(desc)
      desc = desc.trim().replaceAll('\n','<br>');
    if(name.trim() == '')
      return;
    const imgfile = $('.innercircle1')[0].files[0];
    const vidfile = $('.innercircle')[0].files[0]
    
    if(!vidfile) return;
    $('.cloudSubmit').fadeOut(200,function(){$('.cloudCancel').fadeIn(200)});

    var formData;
    file = [imgfile,vidfile]
    var tot = (imgfile?imgfile.size:0)+vidfile.size;
    var comp = 0;
    for(var i = 0;i<2;i++){
      if(!file[i]) continue
      formData = new FormData();
      formData.append("file", file[i]);
      formData.append("upload_preset", "rzmgazma");
    
      await axios.request(
        {
            url:url[i], 
            method: "POST",
            data: formData,
            cancelToken:source.token,
            onUploadProgress:(e)=>{
                var comp1,tot1;
                if(i == 0){
                  comp = e.loaded;comp1 = comp; }
                else {comp1 = e.loaded + comp;}
                // console.log(comp1,tot)
                setProgress(comp1/tot*100);
            }
        })
        .then((res) => {
            console.log(res.data)
            if(i == 0){
              $('.message').html('<i class="fas fa-check-circle corr"></i>Image File Uploaded Successfully!!') 
              imgfile.url = res.data.url
            } 
            else{ 
              $('.cloudCancel').fadeOut(200,function(){$('.cloudSubmit').fadeIn(200)});
              $('.video-name').val('');
              $('.video-desc').val('');
              $('#vidfile').val('');$('#imgfile').val('');
              $('.videoflname').html('')
              $('.poster').html('')
              $('.message').html('<i class="fas fa-check-circle corr"></i>Video File Uploaded Successfully!!')  
              axios.post('https://watch-party-latest.herokuapp.com/video/upload',{name,desc,video:res.data.url,poster:imgfile?imgfile.url:''},{
                  headers:{
                    Authorization: 'Bearer '+window.user.token
                  }
              })
              .then(res => {
                console.log(res.data);
                window.addVideo(res.data);
              })
              .catch(err => {
                console.log(err);
              })
            }
            $('.message').css({animation:'anim111 ease-in-out 5s'})
            setTimeout(function(){
              $('.message').css({animation:''})
            },5000)
        })
        .catch(err=>{
          if(i == 0)
            $('.wr-message').html('<i class="fas fa-times-circle wro"></i>Error in uploading Image file...')  
          else 
            $('.wr-message').html('<i class="fas fa-times-circle wro"></i>Error in uploading Video file...')  
          $('.cloudCancel').fadeOut(200,function(){$('.cloudSubmit').fadeIn(200)});
          $('.wr-message').css({animation:'anim111 ease-in-out 5s'})
          setTimeout(function(){
            $('.wr-message').css({animation:''})
          },5000)
        })
    }
  });