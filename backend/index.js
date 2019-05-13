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
  if (pw === pw2) {
    resp.status(200).send(user);
  }
  else {
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

// read all posts sorted
app.get('/post', async (_, resp) => {
  const allPostsDoc = await postsCollection.orderBy('date', 'desc').get();
  resp.status(200).json(allPostsDoc.docs.map(doc => ({ id: doc.id, ...doc.data() })));
});

// delete a post
app.delete('/post/:id', async (req, res) => {
  const id = req.params['id'];
  const e = req.body.em;
  const snapShot = await postsCollection.doc(id).get();
  const em2 = snapShot.data().email;
  if (e === em2) {
    await postsCollection.doc(id).delete();
    res.status(200).send('DELETED');
  } else {
    res.status(200).send('NOT_DELETED');
  }
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
