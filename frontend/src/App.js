import React, { Component } from 'react';
import './App.css';
import Posts from './Posts';
import NewUser from './NewUser';

export default class App extends Component {
  state = { currentuser: null, email: '', password: '', showRegister: false };
  onSignout = () => {
    this.setState(() => ({ currentuser: null }));
  }

  onLogin = async ({ email, password }) => {
    const resp = await fetch(`/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const currentUser = await resp.text();
    if (currentUser !== 'NOT_OK') {
      const newUser = currentUser;
      this.setState(({ currentuser }) => ({ currentuser: newUser }));
    } else {
      alert('wrong login info');
    }

  };

  onSignUp = () => {
    this.setState(() => ({ showRegister: true }));
  }

  onSignIn = () => {
    this.setState(() => ({ showRegister: false }));
  }

  submitClicked = () => {
    const { email, password } = this.state;
    this.onLogin({ email, password });
  };

  passwordChange = e => this.setState({ password: e.currentTarget.value });

  emailChange = e => this.setState({ email: e.currentTarget.value });


  addUser = async ({ email, password }) => {
    const resp = await fetch(`/user`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const text = await resp.text();
    const user = { text, email, password };
    if (text !== 'NOT_OK') {
      this.setState(({ currentuser }) => ({ currentuser: user }));
    }

  };

  render() {
    const { currentuser, email, password, showRegister } = this.state;
    return (
      <div>
        {currentuser != null ? (
          <div className="Block">
            <button onClick={this.onSignout}>Sign Out</button>
            <Posts useremail={email} />
          </div>
        ) : (
            <div className="Block">
              {showRegister ? (
                <div className="Block">
                  <h3>Sign Up</h3>
                  <NewUser addUser={this.addUser} />
                </div>
              ) : (
                  <div className="Block">
                    <h3>User Sign In</h3>
                    <div>
                      <div>
                        <label>
                          Email:
            <input type="email" value={email} onChange={this.emailChange} />
                        </label>
                        <label>
                          Password:
            <input type="password" value={password} onChange={this.passwordChange} />
                        </label>
                      </div>
                      <div>
                        <button onClick={this.submitClicked}>Submit</button>
                        <button onClick={this.onSignUp}>Sign Up</button>
                      </div>
                    </div>
                  </div>
                )}
            </div>
          )}
      </div>);
  }
};



