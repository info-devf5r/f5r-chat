import React, { useState,useEffect } from "react";
import { useHistory } from "react-router-dom"; 
import queryString from "query-string";
import io from 'socket.io-client';
import "./Chat.css";
import InfoBar from "../InfoBar/InfoBar";
import Input from "../Input/Input"; 
import Messages from "../Messages/Messages";
import { useAlert } from "react-alert";

// مكونات الجانب الأيمن
//import InfoBarRight from "../rightSideComponents/InfobarRight/InfoBarRight"
//import People from "../rightSideComponents/People/People"; 
import Voice from "../rightSideComponents/Voice/Voice"

import Peer from "peerjs"; 
//import { cred } from "../../config/callcred"; 
const axios = require("axios");

const getAudio = () =>{
     return navigator.mediaDevices.getUserMedia({ audio: true, video: false })
}

function stopBothVideoAndAudio(stream) {
    stream.getTracks().forEach(function(track) {
        if (track.readyState === 'live') {
            track.stop();
        }
    });
}
let cred = null; 

//  خوادم STUN / TURN للقناة الصوتية
const setCredObj = (twilioObj) => {
    cred = {
        config : {
        'iceServers' : [
        {
            url: 'stun:global.stun.twilio.com:3478?transport=udp',
            urls: 'stun:global.stun.twilio.com:3478?transport=udp'
        },
        {
            url: 'turn:numb.viagenie.ca',
            credential: 'muazkh',
            username: 'webrtc@live.com'
        },
        {
            url: 'turn:192.158.29.39:3478?transport=udp',
            credential: 'JZEOEt2V3Qb0y27GRntt2u2PAYA=',
            username: '28224511:1379330808'
        },
        {
            url: 'turn:192.158.29.39:3478?transport=tcp',
            credential: 'JZEOEt2V3Qb0y27GRntt2u2PAYA=',
            username: '28224511:1379330808'
        },
        {
            url: 'turn:turn.bistri.com:80',
            credential: 'homeo',
            username: 'homeo'
        },
        {
            url: 'turn:turn.anyfirewall.com:443?transport=tcp',
            credential: 'webrtc',
            username: 'webrtc'
        },  
        //قم بإزالة العناصر الثلاثة أدناه إذا كنت تعمل محليًا بدون twilio
        {
            url: 'turn:global.turn.twilio.com:3478?transport=udp',
            username : twilioObj.username,
            urls: 'turn:global.turn.twilio.com:3478?transport=udp',
            credential: twilioObj.cred
        },
        {
            url: 'turn:global.turn.twilio.com:3478?transport=tcp',
            username: twilioObj.username,
            urls: 'turn:global.turn.twilio.com:3478?transport=tcp',
            credential: twilioObj.cred
        },
        {
            url: 'turn:global.turn.twilio.com:443?transport=tcp',
            username:twilioObj.username,
            urls: 'turn:global.turn.twilio.com:443?transport=tcp',
            credential: twilioObj.cred
        }
        ]} 
    };
}

let socket = null, peer = null, peers = [], myStream = null, receivedCalls = [];  

const Chat = ({ location })=> { 

    const [ name, setName ] = useState('');
    const [ room, setRoom ] = useState(''); 
    const [ messageToSend, setMessage ] = useState('');   // لإرسال الرسالة
    const [ messages, setMessages ] = useState([]); //  للرسالة المستلمة
    const [ usersOnline, setUsersOnline ] = useState([]);

    const [ join,setJoin ] = useState(0); 
    const [ usersInVoice, setUsersInVoice ] = useState([]); 
    const history = useHistory();
    const alert = useAlert();
    //const ENDPOINT = process.env.REACT_APP_API_ENDPOINT_LOCAL;   // the express server 
    const ENDPOINT = "https://f5r-2.herokuapp.com"; // خادمي المنشور
    
    useEffect(() => {
        const { name, room } = queryString.parse(location.search); 
        socket = io(ENDPOINT, { transport : ['websocket'] });
        setName(name.trim().toLowerCase()); 
        setRoom(room.trim().toLowerCase());
         
        const connectNow = () => {
            socket.emit('join',{name,room},(result)=>{
                console.log(`You are ${name} with id ${socket.id}`); 
                setCredObj(result); 
                //console.log(cred); 
            });
        }
        
        const checkRoomExists = async() =>{
            let result = await axios.get(`https://f5r-2.herokuapp.com/checkRoomExists/${room}`); 
            if(result.data && result.data.exists){
                connectNow(); 
            } else {
                alert.error("هذه الغرفة غير موجودة أو منتهية الصلاحية");
                history.push("/");
            }
        }

        checkRoomExists();

        return () => { //تركيب المكون
            socket.emit('leave-voice',{name,room},() => {});
            socket.emit('disconnect');
            socket.off(); 
        }
    },[ENDPOINT,location.search,history,alert]); //[ENDPOINT,location.search]);  

    
    useEffect(()=>{
        socket.on('message',(messageReceived)=>{
            setMessages((messages)=>[...messages,messageReceived]); 
        });
        socket.on('usersinvoice-before-join',({users})=>{
            //console.log(users); 
            setUsersInVoice((usersInVoice) => users); 
        });       
        socket.on('users-online',({users})=>{
            setUsersOnline((usersOnline) => users); 
        }); 
        socket.on('add-in-voice',(user)=>{
            console.log(`New user in voice: ${user.name}`); 
            setUsersInVoice( usersInVoice =>[...usersInVoice,user]);     
        });
        socket.on('remove-from-voice',(user)=>{
            setUsersInVoice( usersInVoice =>usersInVoice.filter((x) => x.id !== user.id )); 
        });
    },[]); // للرسالة المستلمة

    const onReceiveAudioStream = (stream) =>{ 
        console.log("receiving an audio stream"); 
        const audio = document.createElement('audio');
        audio.srcObject = stream
        audio.addEventListener('loadedmetadata', () => {
            audio.play()
        })
    }
  
    useEffect(()=>{
        
        if(join) {
            getAudio()
            .then((mystream)=>{
                myStream = mystream; 
                //peer = new Peer(socket.id);

                peer = new Peer(socket.id, cred);  
                console.log("Peer:", peer);
                
                //استمع 
                peer.on('call', (call)=>{
                    console.log("call receiving")
                    call.answer(mystream); 
                    call.on('stream', (stream)=>{
                        onReceiveAudioStream(stream); 
                        receivedCalls.push(stream); 
                    });
                });
                //console.log(usersInVoice); 
                peer.on('open',()=>{
                    console.log("connected to peerserver");

                    // لن اتصل بنفسي
                    const otherUsersInVoice = (usersInVoice).filter((x) => x.id !== socket.id);  
                    
                    peers = (otherUsersInVoice).map((u) => {  // usersInVoice يؤثر على هذا
                        //اتصل بالجميع الموجودين بالفعل 
                        var mediaConnection = peer.call(u.id, mystream); 
                        console.log(`Calling ${u.id} ${u.name}`);
                        //console.log(mediaConnection); 
    
                        const audio = document.createElement('audio');
                        mediaConnection.on('stream', (stream)=>{
                            console.log(`${u.name} picked up call`)
                            audio.srcObject = stream
                            audio.addEventListener('loadedmetadata', () => {
                                audio.play()
                            })
                        });

                        // إذا قام أي شخص بإغلاق اتصال الوسائط
                        mediaConnection.on('close',()=>{
                            audio.remove();
                        })
                        return mediaConnection; 
                    }); 
                }) 
                
            })
            .catch((error)=>{
                console.log("Error while getting audio",error); 
            })
        } 
        
        return ()=> {

            //أغلق صوتي
            if(myStream) stopBothVideoAndAudio(myStream); 
            //أغلق المكالمات التي تلقيتها
            receivedCalls.forEach((stream) => stopBothVideoAndAudio(stream));
            
            if(peer) {  
                peer.disconnect();
                myStream = null; 
                console.log("disconnected"); 

                // أغلق الاتصالات التي اتصلت بها
                if(peers) { 
                    peers.forEach((x)=>{
                        x.close();  
                    })
                    peers = []; 
                }
            }
        }

    },[join]); 
    

    //تحتاج وظيفة لإرسال الرسائل
    const sendMessage = (event) => { 
        event.preventDefault(); // يمنع من تحديث المتصفح ، إرسال النموذج يعيد تحميل الصفحة
        if(messageToSend) {
            socket.emit('user-message',messageToSend,()=>setMessage('')); 
        }
    }
    
    const joinVoice = ()=> {
        socket.emit('join-voice',{name,room},() => {});
        console.log('voice joined'); 
    }
    const leaveVoice = ()=>{
        socket.emit('leave-voice',{name,room},() => {});
        console.log('voice left')
    }
    
     
    return (
        <div className="outerContainer bgprime">
            <div className="container bgsec">
                <InfoBar room={room}/> 
                <Messages messages={messages} name={name}/>
                <Input setMessage={setMessage} sendMessage={sendMessage} messageToSend={messageToSend} /> 
                <Voice usersInVoice={usersInVoice} joinVoice={joinVoice} leaveVoice={leaveVoice} join={join} setJoin={setJoin}/> 
            </div>
        </div>
        
    ); 
}

export default Chat; 

/*
location is a prop that react router gives , i.e web page location uri 
*/
/*
 queryString helps us extract the parameters after /chat
 i.e a?b&&c?d converts to object { a:b, c:d } because if queryString
*/