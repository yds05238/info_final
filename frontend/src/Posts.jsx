import React, { Component } from 'react';
import './App.css';
import Post from './Post';
import PostAdder from './PostAdder';

export default class Posts extends Component {
  constructor(props) {
    super(props);
    this.state = {
      posts: null,
      postsToday: null,
      postsSorted: null,
      email: this.props.useremail
    };
  };

  componentDidMount() {
    fetch('/post')
      .then(resp => resp.json())
      .then(posts => this.setState({ posts }));
    fetch('/post/today')
      .then(resp => resp.json())
      .then(postsToday => this.setState({ postsToday }));
    fetch('/post/sorted')
      .then(resp => resp.json())
      .then(postsSorted => this.setState({ postsSorted }));
  }

  addPost = async ({ email, date, content }) => {
    /*const em = this.state.email;*/
    const resp = await fetch(`/post`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, date, content })
    });
    const id = await resp.text();
    const post = { id, email, date, content };
    this.setState(prevState => ({ posts: [post, ...prevState.posts] }));
  };

  editPost = async ({ id, email, content }) => {
    const newContent = prompt('Change the content of the post', content);
    const resp = await fetch(`/post/${id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, newContent })
    });
    const text = await resp.text();
    if (text === 'UPDATED') {
      this.setState(prevState => ({
        posts: prevState.posts.map(p => (p.id === id ? { ...p, content: newContent } : p))
      }))
    } else {
      alert('Can only edit own posts');
    }
  };

  deletePost = async ({ id, email }) => {
    /*const resp = await fetch(`/post/${id}`, { method: 'DELETE' });*/
    const resp = await fetch(`/posts/${id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    const text = await resp.text();
    if (text === 'DELETED') {
      this.setState(prevState => ({ posts: prevState.posts.filter(p => p.id !== id) }));
    } else {
      alert('Can only delete own posts');
    }
  };

  render() {
    const { posts, postsToday, postsSorted, email } = this.state;
    console.log({ postsSorted });
    const e1 = this.state.email;
    return (
      <div>
        <h1>{email}</h1>
        <h2>{e1}</h2>
        {posts != null ? (
          <div className="Block">
            <h3>All Posts (not sorted)</h3>
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
                    editPost={this.editPost}
                    deletePost={this.deletePost}
                  />
                ))}
            </div>
          </div>
        ) : (
            <div>Loading all posts (not sorted)...</div>
          )}
        {postsToday != null ? (
          <div className="Block">
            <h3>Today Posts (not sorted)</h3>
            <div>
              {postsToday.length === 0 && <div>No posts added today.</div>}
              {postsToday.length > 0 &&
                postsToday.map(({ id, email, date, content }) => (
                  <Post
                    key={id}
                    id={id}
                    email={email}
                    date={date}
                    content={content}
                    editPost={() => { }}
                    deletePost={() => { }}
                  />
                ))}
            </div>
          </div>
        ) : (
            <div>Loading today posts (not sorted)...</div>
          )}
        {postsSorted != null ? (
          <div className="Block">
            <h3>All Posts (sorted)</h3>
            <div>
              {postsSorted.length === 0 && <div>No sorted posts.</div>}
              {postsSorted.length > 0 &&
                postsSorted.map(({ id, email, date, content }) => (
                  <Post
                    key={id}
                    id={id}
                    email={email}
                    date={date}
                    content={content}
                    editPost={() => { }}
                    deletePost={() => { }}
                  />
                ))}
            </div>
          </div>
        ) : (
            <div>Loading sorted posts...</div>
          )}
        <div className="Block">
          <h3>Post Adder</h3>
          <PostAdder addPost={this.addPost} useremail={email} />
        </div>
      </div>
    );
  }
}
