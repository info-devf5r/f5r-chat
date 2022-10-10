# Lite Chat

![Frame](https://user-images.githubusercontent.com/99620863/177199682-a2091c25-cc69-46b7-a056-5a2528b1dec7.svg)      
  
Deployed at https://lite-chat-react.herokuapp.com/  
Server repo: https://github.com/nancy-sun/litechat-server
  
## Description
Lite Chat is an anonymous n-to-n chat application for text and voice chat, where users could create a temporary chatroom or join an existing chatroom. Type in the message input box to sent text messages to the room, enter the voice channel on left side bar to start talking. Works in web browsers without any additional downloads or plugins.  
User's text messages are sent through websocket TCP connection, and voices are sent through peer to peer UDP connection. 

## Installation  
Clone source code locally:
```
$ git clone https://github.com/nancy-sun/litechat
```
Install dependencies:
```
$ npm install
```
Start running:
```
$ npm start
```
  

**Environment variable example for `.env` file:**  

- poke api to generate random user names:
```REACT_APP_POKE_API = https://pokeapi.co/api/v2/pokemon```  
- `REACT_APP_ROOM_URL` = server url of the application
- `REACT_APP_SERVER_URL` = the server url with route `/room`  
- `REACT_APP_STUN_URL` = STUN server URL
- `REACT_APP_TURN_URL` = TURN server URL
- `REACT_APP_TURN_USERNAME` = TURN server username
- `REACT_APP_TURN_CREDENTIAL` = TURN server credential
  
*STUN server could be self-built with server url, or any public STUN servers.*  
*TURN server URL, USERNAME, CREDENTIAL could be a public one or registered one.*

*Note that when running locally, the server url should be* `http://localhost:PORT`  


## Tools/Methods  

**Tech Stack**
* React
* Sass
* Node.js / Express.js
* MongoDB - Mongoose
* Redux
* figma (for prototype)

**Resources/Tools/Methods**
* [Socket.io & Socket.io client](https://socket.io/docs/v4/client-api/)
* [cors](https://www.npmjs.com/package/cors)
* [axios](https://axios-http.com/docs/api_intro)
* [WebRTC](https://webrtc.org/getting-started/overview), [simple-peer](https://www.npmjs.com/package/simple-peer)
* [React Bootstrap](https://react-bootstrap.github.io/)
* [animation.css](https://animate.style/)
* [PokeAPI](https://pokeapi.co/)
* [STUN & TRUN server](https://www.metered.ca/tools/openrelay/#overview)
  
## Prototype  

**Presentation Slides:** https://www.figma.com/file/mbzZFUtxbesXNTo0EptXWp/capstone-presentation

**Design/prototype resources**
* [UI](https://www.figma.com/community/file/818668544591341056)
* [logo](https://www.figma.com/community/file/1088206555564423933)
* [iconmonstr](https://iconmonstr.com/)
* [figma streamline plugin](https://streamline.canny.io/)
* [screen size mockup](https://www.figma.com/community/file/1103958429333309485)
  
![litechatPrototype](https://user-images.githubusercontent.com/99620863/181903772-a6928890-fb69-4f5e-a166-6f97ca27547d.svg)

## Author  
[@Nancy](https://github.com/nancy-sun)   
