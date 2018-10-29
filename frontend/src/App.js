import React, { Component } from 'react';
import NavBar from './NavBar/NavBar';
import {Route, withRouter} from 'react-router-dom'
import Questions from './Questions/Questions';
import Question from './Question/Question';
import Callback from './Callback';
import NewQuestion from './NewQuestion/NewQuestions';
import SecuredRoute from './SecuredRoute/SecuredRoute';
import auth0Client from './Auth';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      checkingSession: true,
    }
  }
  async componentDidMount() {
    if (this.props.location.pathname === '/callback') {
      this.setState({
        checkingSession: false
      });
      return;
    }
    try {
      await auth0Client.silentAuth();
      this.forceUpdate();
    } catch (err) {
      if (err.error === 'login_required') return;
      console.log(err.error);
    }
    this.setState({
      checkingSession: false
    });
  }
  render() {
    return (
      <div>
        <NavBar/>
        <Route exact path ='/' component={Questions} />
        <Route exact path ='/question/:questionId' component={Question} />
        <Route exact path ='/callback' component={Callback} />
        <SecuredRoute
          path ='/new-question'
          component={NewQuestion}
          checkingSession={this.state.checkingSession}
        />
      </div>
    );
  }
}

export default withRouter(App);