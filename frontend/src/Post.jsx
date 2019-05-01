import React from 'react';

export default function Post({ id, email, date, content, editPost, deletePost }) {
  return (
    <div>
      <div>Email: {email}</div>
      <div>Date: {date}</div>
      <div>
        <div>Content</div>
        <div>{content}</div>
      </div>
      <div>
        <button onClick={() => editPost(id, content)}>Edit</button>
        <button onClick={() => deletePost(id)}>Delete</button>
      </div>
    </div>
  )
}