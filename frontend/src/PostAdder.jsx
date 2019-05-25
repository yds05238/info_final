import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import { CardHeader } from '@material-ui/core';

/*
<div>
        <div>{email}</div>
        <textarea value={content} onChange={this.contentChange} />
        <div>
          <button onClick={this.submitClicked}>Submit</button>
        </div>
      </div>

*/


export default class PostAdder extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: this.props.useremail,
      content: ''
    };
  };

  contentChange = e => this.setState({ content: e.currentTarget.value });

  submitClicked = () => {
    const d = new Date();
    const date = `${d.getFullYear()}-${1 + d.getMonth()}-${d.getDate()}`;
    const { addPost } = this.props;
    const { email, content } = this.state;
    addPost({ email, date, content });
  };

  render() {
    const { email, content } = this.state;
    return (
      <Card className="card">
        <CardHeader title="Adder" />
        <CardContent>
          <div>{email}</div>
          <textarea value={content} onChange={this.contentChange} />
        </CardContent>
        <CardActions>
          <Button onClick={this.submitClicked}>Submit</Button>
        </CardActions>
      </Card>
    );
  }
}
