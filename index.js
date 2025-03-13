const express = require('express');
const { resolve } = require('path');
const dotenv=require('dotenv')
dotenv.config()
const app = express();
const port = process.env.PORT;
const connection=require('./bd/database');
const userRouter = require('./routes/user.route');
const {authenticate, adminauth}=require('./middleware/authentication')

app.use(express.static('static'));
app.use(express.json())

app.get('/', (req, res) => {
  res.sendFile(resolve(__dirname, 'pages/index.html'));
});

app.use('/user', userRouter)


app.get('/admin-dashboard', authenticate, adminauth, (req, res) => {
    res.json({ message: "Welcome to the admin dashboard!" });
});

app.get('/profile', authenticate, (req, res) => {
    res.json({ message: `Welcome, ${req.user.name}!`, user: req.user });
});

app.listen(port, async() => {
  try {
    await connection
    console.log(`app listening at http://localhost:${port}`)
    console.log(process.env.JWT_SECRET_KEY)
  } catch (error) {
    console.log(error)
  }
});
