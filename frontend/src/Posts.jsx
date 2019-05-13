import React, { Component } from 'react';
import './App.css';
import Post from './Post';
import PostAdder from './PostAdder';

export default class Posts extends Component {
  constructor(props) {
    super(props);
    this.state = {
      posts: null,
      email: this.props.useremail
    };
  };

  componentDidMount() {
    fetch('/post')
      .then(resp => resp.json())
      .then(posts => this.setState({ posts }));
  }

  addPost = async ({ email, date, content }) => {
    const resp = await fetch(`/post`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, date, content })
    });
    const id = await resp.text();
    const post = { id, email, date, content };
    this.setState(prevState => ({ posts: [post, ...prevState.posts] }));
  };

  deletePost = async id => {
    const em = this.state.email;
    const resp = await fetch(`/post/${id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ em })
    })
    const text = await resp.text();
    if (text === 'DELETED') {
      this.setState(prevState => ({ posts: prevState.posts.filter(p => p.id !== id) }));
    } else {
      alert('Can only delete own posts');
    }

  };

  render() {
    const { posts, email } = this.state;
    const e1 = this.state.email;
    return (
      <div>
        <h1>{email}</h1>
        <h2>{e1}</h2>
        {posts != null ? (
          <div className="Block">
            <h3>All Posts Sorted by Date</h3>
            <div>
              {posts.length === 0 && <div>No posts available.</div>}
              {posts.length > 0 &&
                posts.map(({ id, email, date, content }) => (
                  <Post
                    key={id}
                    id={id}
                    email={email}
                    date={date}
                    content={content}
                    deletePost={this.deletePost}
                  />
                ))}
            </div>
          </div>
        ) : (
            <div>Loading all posts (not sorted)...</div>
          )}
        <div className="Block">
          <h3>Post Adder</h3>
          <PostAdder addPost={this.addPost} useremail={email} />
        </div>
      </div>
    );
  }
}
