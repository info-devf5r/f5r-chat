
// FUNCTIONS ==================================================================

function joinRoom(room, user1) {
    if (room === '' && user === '' ) {
      alert('Please type a room ID and a user ID')
    } else if (room === '') {
        alert('Please type a room ID')
    } else if (user === '') {
      alert('Please type a user ID')
    } else {
      roomId = room
      user = user1
      console.log(`room ${room}`)
      showVideoConference()
    }
  }
  

  function update_overlay(id){

    var details = voiceInformations.get(id)
    console.log('update overlay',details)

    if (hasFullScreen){

    }

    const imgMic = $('<img>')
    imgMic.attr('id' , `overlay-mic-${details.id}`)
    imgMic.attr('src' , '/assets/mic-closed.png')
    imgMic.attr('style' ,'padding-left : 5px;' ) 

    const imgDeaf = $('<img>')
    imgDeaf.attr('id' , `overlay-deaf-${details.id}`)
    imgDeaf.attr('src' , '/assets/deaf_deaf.png')
    imgDeaf.attr('style' ,'padding-left : 5px;' )   

    if ($(`#overlay-mic-${details.id}`)){
        $(`#overlay-mic-${details.id}`).remove()
    }  
    if ($(`#overlay-deaf-${details.id}`)){
        $(`#overlay-deaf-${details.id}`).remove()
    } 

    if (details.mic && details.deaf){
        $($(`#${details.id}`).children()[0]).append(imgMic)
        $($(`#${details.id}`).children()[0]).append(imgDeaf)
    } 
    else if (details.mic && !details.deaf){
        $($(`#${details.id}`).children()[0]).append(imgMic)
    } 
    else if (!details.mic && details.deaf){
        $($(`#${details.id}`).children()[0]).append(imgDeaf)
     }  
     
   }
  
   async function showVideoConference() {
    
    roomSelectionContainer.attr('style' , 'display: none')
    videoChatContainer.attr('style','display: block')
    chat.attr('style','display: block')
    asidenav.attr('style','display: flex')
   
    //set local video

    //detect if user has connected mic & video
    let hasMic = false
    let hasCam = false
    let check = ["audioinput" , "videoinput"]

   await navigator.mediaDevices.enumerateDevices()
    .then((devices) =>{      
        devices.forEach((device) =>{
            if (device.kind == check[0]){
                hasMic = true
            }
            if (device.kind == check[1]){
                hasCam = true
            }
        })
    })

    var mediaConstraints = {
        video: hasCam,
        audio: hasMic,
    };

    console.log(mediaConstraints)

    await navigator.mediaDevices.getUserMedia( mediaConstraints )
        .then( function ( stream ) {   
            
            localStream = stream;      
            localVideoComponent.srcObject = stream 
            localVideoComponent.play()
            socketId = socket.id;
            socket.emit('join', user , roomId)
            localStream.getTracks()[0].enabled  = false // set mic muted

            let det = {
                "id":socketId,
                "mic":true,
                "deaf":false
            } 
            voiceInformations.set(socketId , det)
            socket.emit('voiceInfos' , socketId , voiceInformations.get(socketId))     
            console.log(socketId, voiceInformations.get(socketId))  
        })
        .catch(error =>{
            console.log(error)
        })

        // User Profile init
    $("#Username").html(user)
    $("#room-id").html(roomId)

    $('#aside-navigation').attr('style' , 'display:flex')
    $('#header-img').attr('style' , 'display:none')

  }


function changeItem(new_item , old_item){
    
    new_item.attr('style' ,'border-top : 1px solid #158171')
    new_item.attr('style' ,'border-bottom : 1px solid #ffffff')
    new_item.attr('style' ,'color : #ffffff')
   

    old_item.attr('style' ,'border-style:none')
    old_item.attr('style' ,'color:#158171')   
}

function UpdateMediumMenuView(id , event , dlt){

    if (dlt){
        $(`#${id}`).remove()
        return 
    }

    // set background
        
    if (medium.children().length > 0){
        medium.attr('style' , 'visibility : visible')
        profile.attr('style' , 'border-top : 1px solid #383838')
        nav_background.attr('style' , 'border-top : 1px solid #383838')
    }

    eventList.set(id , event) // add the stream to a list for re-initalization if this is needed 

    const listitem = $('<li>')
    const video = document.createElement('video')
    const hover_div = $('<div>')
    const logo = $('<img>')
    
    const overlayDiv = $("<div>")
    const topText = $("<p>")

    logo.attr('src' ,'/assets/client.png')

    overlayDiv.attr('id' , 'overlayDiv_mediumnav')
    topText.attr('id' , 'topText_mediumnav')

    medium.append(listitem)

    listitem.attr('id' , id)
    hover_div.attr('class' , "hover-item")
    hover_div.attr('id' , id+"-hover")
    video.id = 'screens'
    video.className= 'screens'

    topText.html(users.get(id))
    overlayDiv.append(logo)
    overlayDiv.append(topText)
    listitem.append(overlayDiv)
    listitem.append(hover_div)
    listitem.append(video)

    topText.attr('style' , 'font-size : '+(6 - medium.children.length+15) + 'px') 
    
    video.onmouseenter  = function(){
        $(`#${id}-hover`).attr('style' , 'visibility = visible')
        overlayDiv.attr('style' , {
            left : '10%',
            bottom : '10%'
        })
        if (medium.children.length > 3){
            //console.log(window.screen.width)
            if (window.screen.width < 1480)
                topText.attr('style' , 'font-size : '+(6 - medium.children.length+10) + 'px') 
            else
                topText.attr('style' , 'font-size : '+(6 - medium.children.length+15) + 'px')
        }
        else
            topText.attr('style' , 'font-size : '+(6 - medium.children.length+15) + 'px')
        
        topText.html(`Enable fullscreen for ${users.get(id)}`)
    }
    listitem.on('mouseleave',function(){
        document.getElementById(`${id}-hover`).style.visibility = 'hidden'
        overlayDiv.attr('style' , {
            left: '',
            bottom: '2%'
        })

        topText.html(`${users.get(id)}`)
        topText.attr('style' , 'font-size : '+(6 - medium.children.length+15) + 'px')
    })

    listitem.on('click' , function(){
        setFullScreenVideo(Array.from(users.keys()) , id , false)
    })
    
    //console.log(event.stream)
    video.srcObject = event.stream;
    video.play();
    video.autoplay = true
    
}


function setFullScreenVideo(usersIds , id , israndomised){
    let selectedId
    for (i = 0; i < usersIds.length; i++){
        if (eventList.has(usersIds[i]) && usersIds[i] != socketId && usersIds[i] == id){
            
            /* if we want to change the fullscreen vvideo we need to remove it from
               bottom bar (medium) , remove current fullscreen video from video-chat-container 
               and reinit them to the correct divs  */ 
            if (!israndomised){
                UpdateMediumMenuView(id , eventList.get(id) ,true)
                selectedId = video_div.children[0].id
                video_div.removeChild(video_div.children[0])            
                setRemoteStream(eventList.get(usersIds[i]) , usersIds[i])
                socket.emit('get-voice-activity' , usersIds[i])

                UpdateMediumMenuView(selectedId , eventList.get(selectedId) ,false)
                socket.emit('get-voice-activity' , selectedId)

                console.log(`change video view bettween ${selectedId} and ${id} `)
            }
            else
                setRemoteStream(eventList.get(usersIds[i]) , usersIds[i])
        
            break;
        }
    }    
}


function calculateDelay(startTime){
    var latency =  Date.now() - startTime;
    document.getElementById("latency").innerHTML = `${latency} ms`
}


async function shareScreen(){
    await navigator.mediaDevices.getDisplayMedia({cursor: true})
        .then(stream => {
            const screenTrack = stream.getTracks()[0]
            //socket.emit('change-stream' , roomId , socketId , screenTrack)
            //localVideoComponent.srcObject = stream 
            // senders.find(sender => 
            //     sender.track.kind === 'video').replaceTrack(screenTrack
    
            //localStream = stream
            senders.find(s => {
                if (s.track.kind === 'video'){
                    s.replaceTrack(screenTrack)
                    screenshare.attr('style' ,'visibility : hidden' )
                }
                //console.log(s)
            })
            
            screenTrack.onended = function () {
                senders.find(s => {
                    if (s.track.kind === 'video')
                        s.replaceTrack(localStream.getVideoTracks()[0])
                })
                //senders.find(s => s.track.kind === 'video').replaceTrack(localStream.getVideoTracks()[1])
                screenshare.attr('style' ,'visibility:visible' )
                localVideoComponent.srcObject = localStream 
                localVideoComponent.play()
                }
            })
}

function isImage(url) {
    return /\.(jpg|jpeg|png|webp|avif|gif|svg|JPG|JPEG|PNG)$/.test(url);
  }

  function getPics(event) {
        let filename = event.className
        let file
        let imgGraph
        
        const fullPage = $('#fullpage');
        fullPage.attr('style' , 'display: block')
        //console.log(imgs.length)
        let tpics = Array.from( pics.keys() )

        for (let i = 0; i < tpics.length; i++){
            //console.log(`tpics[i].name ${tpics[i].name}`)
            if (filename == tpics[i].name){
                console.log(tpics[i].name)
                file = tpics[i]
                break;
            }
        }
        if ($("#center-view").children().length > 0){
            imgGraph = $($("#center-view").children[0])
            imgGraph.attr('src' , URL.createObjectURL(file))
            $("#center-view").append(imgGraph)
        }
        else{
            imgGraph = $('<img>')
            imgGraph.attr('src' , URL.createObjectURL(file))
            $("#center-view").append(imgGraph)
        }

        $($("#center-view").children()[0]).attr('class' , filename)

        let list = $("#bottomList")

        for (let i = 0; i < tpics.length; i++){
            console.log(`pic ${tpics[i]}`)
            console.log(`file ${file}`)
            if (filename != tpics[i].name){
                let li = $('<li>')
                let bot_img = $('<img>')
                bot_img.attr('src' , URL.createObjectURL(tpics[i]))

                list.append(li)
                li.append(bot_img)
                bot_img.attr('id' , tpics[i].name)

                li.on('click' , function(){
                    changePhotoView(bot_img.attr('id'))
                })
            }
        }
        let link = $("#link")
        let cc = $("#center-view")
        link.attr('href' , picsNames.get(filename)) 
        link.attr('download' ,`${$(cc.children()[0]).attr('class')}`) 
}


function changePhotoView(id){

    const center = $("#center-view")
    const bottom = $("#bottomList")
    const center_image_elem = center.children()[0]
    console.log('center' , center_image_elem.className)
   // const bottom_image_elem = $(`#${id}`)
    const center_img_blob = picsNames.get(center_image_elem.className)
    const bottom_img_blob = picsNames.get(id)

    //delete each photo from her parent
    
    //center
    $(center.children()[0]).remove()

    //bottom
    for (let i = 0; i< bottom.children().length; i++){
        if ($(bottom.children()[i]).children()[0].id === id){
            $(bottom.children()[i]).remove()
            break;
        }
    }

    //re-init photos

    //center 
    const c_img = $('<img>')
    const link = $('#link')
    c_img.attr('class' , id)
    c_img.attr('src' , bottom_img_blob)

    center.append(c_img)
    link.attr('href' , picsNames.get(c_img.attr('class'))) 
    link.attr('download' ,`${c_img.attr('class')}` ) 

    //bottom
    const b_img = $('<img>')
    const li = $('<li>')
    b_img.attr('id' ,center_image_elem.className)
    b_img.attr('src' ,center_img_blob)
    li.append(b_img)
    bottom.append(li)

    li.on('click' , function(){
        changePhotoView(b_img.attr('id'))
    })
}

function storeImg(file , url){
    pics.set(new File([file] , filename), url)
    picsNames.set(filename, url)    
    
}

function changeColorMode(){
    if ($('#profile-extra').html() == 'Switch to standard background'){
        $('#profile-extra').html('Switch to dynamic background')
    }
    else
    $('#profile-extra').html('Switch to standard background')

    $('.header-img').attr('style' , 'display:none')
    document.body.classList.toggle("light-mode");
}