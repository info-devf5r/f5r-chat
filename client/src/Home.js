import React from 'react';
export default class Home extends React.Component{
  constructor(props){
      super(props)
      this.state = {
          username: '',
          room: ''
      }
    }
    handleChange=(e)=>{
      e.persist()
      this.setState({
        [e.target.name]: e.target.value
      })
    }
    handleSubmit = e =>{
      e.preventDefault()
      this.props.history.push(`/${this.state.room}-${this.state.username}`)
    }
    render(){
      // console.log(this.props)
      return (
        <>
        <div className="container">
                <div className="row">
                    <div className="col-4">
                        <div className="card">
                            <div className="card-body">
                              <h2>DCT Chat App</h2>
                            </div>
                            <div className="card-footer">
                              <form onSubmit={this.handleSubmit}>
                              <label>Username</label>
                                <input type="text" placeholder="Username" value={this.state.username} name="username" onChange={this.handleChange} className="form-control"/>
                                <br/>
                                <br/>
                                <label>Room</label>
                                <input type="text" placeholder="Room Name" value={this.state.room} name="room" onChange={this.handleChange} className="form-control"/>
                                <br/>
                                <br/>
                                <button type="submit" className="btn btn-primary form-control">Submit</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
      );
    }
}