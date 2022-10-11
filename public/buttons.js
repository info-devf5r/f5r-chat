

// BUTTON LISTENERS ============================================================

// const { get } = require("express/lib/response")

   // BUTTON -> CREATE ROOM
   create_room.on('click', () => {
    connectButton.html('CREATE')
    box.attr('style' , 'visibility : visible')
    roomSelectionContainer.attr('style' , 'marginTop : 5%')
    changeItem(create_room , join_room)
  })

  // BUTTON -> JOIN ROOM
  join_room.on('click', () => {
    connectButton.html('JOIN')
    box.attr('style' , 'visibility : visible')
    roomSelectionContainer.attr('style' , 'marginTop : 5%')
    changeItem(join_room, create_room)
  })


    // BUTTON -> CONNECT
  connectButton.on('click', () => {

    if (connectButton.html() == 'CREATE'){
        socket.emit('create-room' , roomInput.val())
    }
    else if (connectButton.html() == 'JOIN'){
        socket.emit('join-room' , roomInput.val())
    }
    
  })
  
  // BUTTON -> SEND
  sendButton.on('click', (e) => {
    e.preventDefault()
    //Get message text and room
    const message = messageInput.val()

    if (message==="") return
    displayMessage(message)
  })

  // BUTTON -> MIC
  muteButton.on('click', () => {
    if ($(muteButton.children()[0]).attr('src') == `/assets/mic-opened.png`){
        localStream.getTracks()[0].enabled  = false
        $(muteButton.children()[0]).attr('src' , '/assets/mic-closed.png')

        //info other peers if we are on deaf mode
        let details ={
            "id":socketId,
            "mic":true,
            "deaf":false
        }
        voiceInformations.set(socketId,details)
        for (id in channels){
            if (id != socketId && channels[id].readyState =='open')
                channels[id].send("~Mic-~Deaf~"+JSON.stringify(details));
        }
    }
    else{
        localStream.getTracks()[0].enabled  = true
        $(muteButton.children()[0]).attr('src' , '/assets/mic-opened.png')
        $('video').prop('volume', '1.0');
        $(deafButton.children()[0]).attr('src' , '/assets/deaf.png')

        //info other peers if we are on deaf mode
        let details ={
            "id":socketId,
            "mic":false,
            "deaf":false
        }
        voiceInformations.set(socketId,details)
        for (id in channels){
            if (id != socketId && channels[id].readyState =='open')
                channels[id].send("~Mic-~Deaf~"+JSON.stringify(details));
        }

    }
    $(muteButton.children()[0]).attr('style' ,'width : 18px; height: 22px;' ) 
    socket.emit('voiceInfos' , socketId , voiceInformations.get(socketId))
  })

    // BUTTON -> DEAF
    deafButton.on('click', () => {
        
        if ($(deafButton.children()[0]).attr('src') == `/assets/deaf.png`){
           
            $(deafButton.children()[0]).attr('src' , '/assets/deaf_deaf.png')
            $(muteButton.children()[0]).attr('src' , '/assets/mic-closed.png')

            $('video').prop('volume', '0.0');
            localStream.getTracks()[0].enabled  = false
            //info other peers if we are on deaf mode
            let details ={
                "id":socketId,
                "mic":true,
                "deaf":true
            }
            voiceInformations.set(socketId,details)
            for (id in channels){
                if (id != socketId && channels[id].readyState =='open')
                    channels[id].send("~Mic-~Deaf~"+JSON.stringify(details));
            }
        }
        else{
            $('video').prop('volume', '1.0');
            $(deafButton.children()[0]).attr('src' , '/assets/deaf.png')
            
            //info other peers if we are on deaf mode
            let details = {
                "id":socketId,
                "mic":true,
                "deaf":false
            }
            voiceInformations.set(socketId,details)
            for (id in channels){
                if (id != socketId && channels[id].readyState =='open')
                    channels[id].send("~Mic-~Deaf~"+JSON.stringify(details));
            }
        }
        $(deafButton.children()[0]).attr('style' ,'width : 20px; height: 22px;' ) 
        socket.emit('voiceInfos' , socketId , voiceInformations.get(socketId))
      })

   // BUTTON -> camera
   $('#camera').on('click', () => {
       let str = $($('#camera').children()[0]).attr('src')
        if (str == '/assets/camera.png'){
            $($('#camera').children()[0]).attr('src' , '/assets/no_camera.png')
            localStream.getVideoTracks()[0].enabled  = false
            $($('#camera').children()[0]).attr('title' ,'Enable camera')
        }
        if (str == '/assets/no_camera.png'){
            localStream.getVideoTracks()[0].enabled  = true
            $($('#camera').children()[0]).attr('src' , '/assets/camera.png')
            $($('#camera').children()[0]).attr('title' ,'Disable camera')
        }
    })   

  // BUTTON -> EXIT
  exitButton.on('click', () => {
      //console.log(`socket.id = ${socket.id}`)
      if (users.size == 1){ // if user is the only client in the room
        socket.emit("destroy-room")
      }
      else{
        socket.emit("manually-disconnect")// return to room selection stage
      }
      location.reload(); 
  })

// BUTTON -> FULLSCREEN-LOGO
fullscreenButton.on('click', () => {

    let usersIds = Array.from( users.keys() );
    if (usersIds.length < 3)
        return;

    if (hasFullScreen)
    {
        $($("#fullscreen").children()[0]).attr('src' , '/assets/fullscreen.png')
        $($("#fullscreen").children()[0]).attr('title' , 'Normalscreen Enabled')
        while (video_div.children[0]) {
            video_div.removeChild(video_div.children[0]);
        }
    
        while (video_div_bottom.children[0]) {
            video_div_bottom.removeChild(video_div_bottom.children[0]);
        }

        while (medium.children()[0]){
            $(medium.children()[0]).remove();
        }

        for (i = 0; i < usersIds.length; i++){
            console.log(eventList.get(usersIds[i]))
        }
        
        for (var i = 0; i < usersIds.length; i++){
            if (eventList.has(usersIds[i]) && usersIds[i] != socketId){
                console.log("reinit stream ",usersIds[i])
                setRemoteStream(eventList.get(usersIds[i]) , usersIds[i])
                socket.emit('get-voice-activity' , usersIds[i])
            }
            
        }
         // remove background
         if (medium.children().length == 0){
            medium.attr('style' , 'visibility = hidden')
            profile.attr('style' , 'border-top = none')
            nav_background.attr('style' , 'border-top = none')
        }
        hasFullScreen = false
    }
    else{
        hasFullScreen = true
        $($("#fullscreen").children()[0]).attr('src' , '/assets/smallscreen.png')
        $($("#fullscreen").children()[0]).attr('title' , 'Fullscreen Enabled')

        while (video_div.children[0]) {
            video_div.removeChild(video_div.children[0]);
        }
        while (video_div_bottom.children[0]) {
            video_div_bottom.removeChild(video_div_bottom.children[0]);
        }
        video_div.setAttribute('style' , 'height : 70%')
        
        let selectedId
        for (i = 0; i < usersIds.length; i++){
            if (eventList.has(usersIds[i]) && usersIds[i] != socketId){
                selectedId = usersIds[i]
                setFullScreenVideo(usersIds , usersIds[i] , true)
                socket.emit('get-voice-activity' , usersIds[i])
                break;
            }
        }
        
        for (i = 0; i < usersIds.length; i++){
            if (eventList.has(usersIds[i]) && usersIds[i] != socketId && selectedId != usersIds[i]){
                UpdateMediumMenuView(usersIds[i] , eventList.get(usersIds[i] , false))
                socket.emit('get-voice-activity' , usersIds[i])
            }
        }

         // set background
        
        if (medium.children().length > 0){
            medium.attr('style' , 'visibility : visible')
            profile.attr('style' , 'border-top : 1px solid #383838')
            nav_background.attr('style' , 'border-top : 1px solid #383838')
        }
    }
})

 //BUTTON -> SCREENSHARE
 screenshare.on('click', async () => {
    await shareScreen()
})

// BUTTON -> USERS-LOGO
InitParticipantsArea.on('click', () => {

    if (userListInput.css('display') === 'none'){
        chat.attr('style' ,'display : none')
        userListInput.attr('style','display:block')
        $(InitChatArea.children()[0]).attr('src' , '/assets/chat-white.png')
        $(InitParticipantsArea.children()[0]).attr('src' , '/assets/users.png')
    }   
})

// BUTTON -> CHAT-LOGO
InitChatArea.on('click', () => {

    if (chat.css('display') === 'none'){
        userListInput.attr('style','display:none')
        chat.attr('style','display=block')
        $(InitChatArea.children()[0]).attr('src' , '/assets/chat.png')
        $(InitParticipantsArea.children()[0]).attr('src' , '/assets/users-white.png')
    }   
   
})

 // BUTTON -> ATTACH FILE
 file.on('click', () => {
    document.getElementById('file-input').click()
    
})

 // BUTTON -> OPEN FILE
selected_file.on('change', e =>{
    var file = e.target.files[0]; 
   // console.log(file)    
    sendFile(file)
    displayFileMessage(file ,socketId)
})

// // BUTTON -> EXIT PHOTO VIEW (JPG | PNG)

$("#exit-img").on("click" , () =>{
         
    $("#fullpage").attr('style' , 'display:none')

    $($("#center-view").children()[0]).remove()

    while ($("#bottomList").children().length > 0)
        $($("#bottomList").children()[0]).remove()
})  

// profile pic button 
$("#profile-user:first-child").on("click" ,function(){
    console.log('nikos')
    if ($('#profile-extra').css('display') == 'none')
        $('#profile-extra').attr('style' , 'display:block')
    else
        $('#profile-extra').attr('style' , 'display:none')
    
})