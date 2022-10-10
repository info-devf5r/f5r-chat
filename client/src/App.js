import React, { Component } from 'react';
import Chat from "./chat";
import Home from './Home'
import { BrowserRouter, Route, Switch } from 'react-router-dom'

class App extends Component {
  render() {
    return (
      <BrowserRouter>        
                <Switch>
                  <Route path='/' component={Home} exact={true}/>
                  <Route path="/:names" component={Chat} exact={true} />
                </Switch>
      </BrowserRouter>
    );
  }
}

export default App;