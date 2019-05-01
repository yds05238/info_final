const admin = require('firebase-admin');
const serviceAccount = require('./service-account.json');
const express = require('express');
const bodyParser = require('body-parser');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://ecommerceweb-7acd7.firebaseio.com"
});

const db = admin.firestore();

const app = express();
const port = 8080;
app.use(bodyParser.json());

app.get('/', (_, resp) => resp.send('Hello World!'));

const postsCollection = db.collection('posts');
const usersCollection = db.collection('users');


// create a user
app.post('/user', async (req, resp) => {
  const user = req.body;
  const em = user.email;
  const snapShot = await usersCollection.doc(em).get();
  if (snapShot.exists) {
    resp.status(200).send('NOT_OK');
  } else {
    const addDoc = await usersCollection.doc(em).set(user);
    resp.status(200).send(addDoc.id);
  }
});


// login a user
app.post('/users', async (req, resp) => {
  const user = req.body;
  const em = user.email;
  const pw = user.password;
  const snapShot = await usersCollection.doc(em).get();
  const pw2 = snapShot.data().password;
  console.log(pw2);
  console.log(pw);
  if (pw === pw2) {
    console.log("pw match");
    resp.status(200).send(user);
  }
  else {
    console.log("pw doesn't match");
    resp.status(200).send('NOT_OK');
  }

});


// read all users
app.get('/user', async (_, resp) => {
  const allUsersDoc = await usersCollection.get();
  resp.status(200).json(allUsersDoc.docs.map(doc => ({ id: doc.id, ...doc.data() })));
});

// update a user
app.post('/user/:id', async (req, res) => {
  const id = req.params['id'];
  const newUser = req.body;
  await usersCollection.doc(id).update(newUser);
  res.status(200).send('UPDATED');
});

// delete a user
app.delete('/user/:id', async (req, res) => {
  const id = req.params['id'];
  await usersCollection.doc(id).delete();
  res.status(200).send('DELETED');
});

// create a post
app.post('/post', async (req, resp) => {
  const post = req.body;
  const addedDoc = await postsCollection.add(post);
  resp.status(200).send(addedDoc.id);
});

// read all posts
app.get('/post', async (_, resp) => {
  const allPostsDoc = await postsCollection.get();
  resp.status(200).json(allPostsDoc.docs.map(doc => ({ id: doc.id, ...doc.data() })));
});

// 2019-04-17
app.get('/post/today', async (_, resp) => {
  const today = new Date();
  const todayString = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
  const todayPostsDoc = await postsCollection.where('date', '==', todayString).get();
  resp.status(200).json(todayPostsDoc.docs.map(doc => ({ id: doc.id, ...doc.data() })));
});


// sorted posts
app.get('/post/sorted', async (_, resp) => {
  const sortedPosts = await postsCollection.orderBy('date', 'desc').get();
  resp.status(200).json(sortedPosts.docs.map(doc => ({ id: doc.id, ...doc.data() })));
});

// update a post
app.post('/post/:id', async (req, res) => {
  const id = req.params['id'];
  const post = req.body;
  console.log(post);
  const em = post.email;
  const newcontent = post.newContent;
  const newPost = { content: newcontent };
  const snapShot = await postsCollection.doc(id).get();
  const em2 = snapShot.data().email;
  if (em === em2) {
    console.log("email match");
    await postsCollection.doc(id).update(newPost);
    res.status(200).send('UPDATED')
  } else {
    console.log("email mismatch");
    res.status(200).send('NOT_OK');
  }
  /*
  const id = req.params['id'];
  const newPost = req.body;
  await postsCollection.doc(id).update(newPost);
  res.status(200).send('UPDATED');*/
});

// delete a post
app.post('/posts/:id', async (req, res) => {
  /*
  const id = req.params['id'];
  await postsCollection.doc(id).delete();
  res.status(200).send('DELETED');*/
  const id = req.params['id'];
  const post = req.body;
  console.log(post);
  const em = post.email;
  const snapShot = await postsCollection.doc(id).get();
  const em2 = snapShot.data().email;
  if (em === em2) {
    console.log(em);
    console.log(em2);
    console.log("email match");
    await postsCollection.doc(id).delete();
    res.status(200).send('DELETED');
  } else {
    console.log("email mismatch");
    res.status(200).send('NOT_OK');
  }
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
