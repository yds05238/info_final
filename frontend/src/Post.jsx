import React from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import CardActions from '@material-ui/core/CardActions';

/*
 <div>
      <div>Email: {email}</div>
      <div>Date: {date}</div>
      <div>
        <div>Content</div>
        <div>{content}</div>
      </div>
      <div>
        <button onClick={() => deletePost(id)}>Delete</button>
      </div>
    </div>
*/

export default function Post({ id, email, date, content, deletePost }) {
  return (
    <Card className="card">
      <CardContent>Email: {email}</CardContent>
      <CardContent>Date: {date}</CardContent>
      <CardContent>
        <div>Content</div>
        <div>{content}</div>
      </CardContent>
      <CardActions>
        <Button onClick={() => deletePost(id)}>Delete</Button>
      </CardActions>
    </Card>
  )
}
