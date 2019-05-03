import React, { Component } from 'react';

export default class PostAdder extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: this.props.useremail,
      content: ''
    };
  };

  /*state = { Email: 'example@gmail.com', content: '' };*/

  /*emailChange = e => this.setState({ email: e.currentTarget.value });*/

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
      <div>
        <div>{email}</div>
        <textarea value={content} onChange={this.contentChange} />
        <div>
          <button onClick={this.submitClicked}>Submit</button>
        </div>
      </div>
    );
  }
}
