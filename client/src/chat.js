import React from "react";
import io from "socket.io-client";


class Chat extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            username: this.props.match.params.names.split('-')[1],
            message: '',
            messages: [],
            text: '',
            room: this.props.match.params.names.split('-')[0]
        };

        // const ws = new window.WebSocket('ws://' + window.location.host) || {}
        this.socket = io(window.location.host);
        this.socket.emit('joinRoom', this.state.room)
        this.socket.on('message',message =>{
            if(message){
                addMessage(message);
            }
        })
        // this.socket.on('message', function(data){
        //     addMessage(data);
        // });

        const addMessage = data => {
            this.setState({messages: [...this.state.messages, data]});
        };

        this.sendMessage = ev => {
            ev.preventDefault();
            this.socket.emit('chatMessage', {
                room: this.state.room,
                author: this.state.username,
                message: this.state.message
            })
            this.setState({message: ''});

        }
        // this.speak = (textToSpeak) => {
        //     // Create a new instance of SpeechSynthesisUtterance
        //     var newUtterance = new SpeechSynthesisUtterance();
         
        //     // Set the text
        //     newUtterance.text = 'hello world';
         
        //     // Add this text to the utterance queue
        //     window.speechSynthesis.speak(newUtterance);

        //  }
         this.newRecognition = new window.webkitSpeechRecognition() || new window.SpeechRecognition();
        //  this.newRecognition.continuous = true;
         this.newRecognition.interimResults = true;

         this.start=()=>{
             // start recognition
            this.newRecognition.start();
         }
        this.s = '';
         this.stop=()=>{
            // stop recognition
            this.newRecognition.stop();  
                this.socket.emit('chatMessage', {
                room: this.state.room,
                author: this.state.username,
                message: this.newRecognition.onresult()
            })
         }
         this.newRecognition.onresult = function(event){
            // console.log(event)
            if(event && event.results){
                if(event.results[0][0].transcript !== undefined){
                    this.s = event.results[0][0].transcript
                }
            }
           return this.s
       } 
    }
    render(){
        return (
            <div className="container">
                <div className="row">
                    <div className="col-4">
                        <div className="card">
                            <div className="card-body">
        <div className="card-title">Chat in the room {this.props.match.params.name}</div>
                                <hr/>
                                <div className="messages">
                                    {this.state.messages.map((message,index) => {
                                        return (
                                            <div key={index}>{message.author}: {message.message}</div>
                                        )
                                    })}
                                </div>

                            </div>
                            <div className="card-footer">
                                <input type="text" placeholder="Username" value={this.state.username} onChange={ev => this.setState({username: ev.target.value})} className="form-control"/>
                                <br/>
                                <input type="text" placeholder="Message" className="form-control" value={this.state.message} onChange={ev => this.setState({message: ev.target.value})}/>
                                <br/>
                                <button onClick={this.sendMessage} className="btn btn-primary form-control">Send</button>
                            </div>
                            {/* <button onClick={this.speak}>Voice</button> */}
                            {this.state.username === 'Ani' && 
                                <>
                                <button className="btn btn-info form-control" onClick={this.start}>Start to speak</button>
                                <button className="btn btn-danger form-control" onClick={this.stop}> Stop</button>
                                </>
                            }
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Chat;