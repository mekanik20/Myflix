const mongoose = require('mongoose');
const Models = require('./models.js');

const Movies = Models.Movie;
const Users = Models.User;
const Genres = Models.Genre;
const Directors = Models.Director;

mongoose.connect('mongodb://localhost:27017/myFlixDB', {useNewUrlParser: true, useUnifiedTopology: true});

const bodyParser = require('body-parser');
const express = require('express');
  const app = express();
  app.use(bodyParser.json());

const morgan = require('morgan');

//GET requests

app.get('/', (req, res) => {
    res.send('Welcome to MyFlix.');
});

app.get('/movies', (req, res) => {
    res.send('Successful GET request returning all movies to user.');
});

app.get('/movies/:title', (req, res) => {
    res.send('Successful GET request returning a specific movie to user.')
});

app.get('/genre/:genre', (req, res) => {
    res.send('Successful GET request returning a specific genre to user.')
});

app.get('/movies/:title/director', (req, res) => {
    res.send('Successful GET request returning a director to user.');
});

//Get all users

app.get('/users', (req, res) => {
  Users.find()
    .then((users) => {
      res.status(201).json(users);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

//Get a user by username

app.get('/users/:Username', (req, res) => {
  Users.findOne({ Username: req.params.Username })
    .then((user) => {
      res.json(user);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

//POST requests

app.post('/users', (req, res) => {
  Users.findOne({ Username: req.body.Username})
    .then((user) => {
      if (user) {
        return res.status(400).send(req.body.Username + 'already exists');
      } else {
        Users
          .create({
              Username: req.body.Username,
              Password: req.body.Password,
              Email: req.body.Email,
              Birthday: req.body.Birthday
          })
          .then((user) =>{res.status(201).json(user) })
        .catch((error) => {
          console.error(error);
          res.status(500).send('Error: ' + error);
        })
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send('Error: ' + error);
    });
});

//Add a movie to a user's favorite movies

app.post('/users/:Username/Movies/:MovieID', (req,res) => {
    Users.findOneAndUpdate({ Username: req.params.Username}, {
      $push: { FavoriteMovies: req.params.MovieID }
    },
    { new: true }, (err, updatedUser) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error: ' + err);
    } else {
      res.json(updatedUser);
    }
  });
});

//PUT request, Update a user's info by username

app.put('/users/:Username', (req, res) => {
  Users.findOneAndUpdate({ Username: req.params.Username}, 
   { $set:
    {
        Username: req.body.Username,
        Password: req.body.Password,
        Email: req.body.Email,
        Birthday: req.body.Birthday
    }
  },
  { new:true }, 
  (err, updatedUser) => {
      if(err) {
        console.error(err);
        res.status(500).send('Error: ' + err);
      } else {
          res.json(updatedUser);
      }
  });
});

//Delete a user by username

app.delete('/users/:Username', (req, res) => {
  Users.findOneAndRemove({ Username: req.params.Username})
    .then((user) => {
      if (!user) {
        res.status(400).send(req.params.Username + 'was not found');
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

//Remove a movie from a user's favorite movies list

app.post('/users/:Username/Movies/:MovieID', (req,res) => {
    Users.findOneAndUpdate({ Username: req.params.Username}, {
      $pull: { FavoriteMovies: req.params.MovieID }
    },
    { new: true }, (err, updatedUser) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error: ' + err);
    } else {
      res.json(updatedUser);
    }
  });
});

//Middleware

app.use(morgan('common'));

app.use(express.static('public'));

// Error-handling

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong...')
})

app.listen(8080, () => {
    console.log('Your app is listening on port 8080.');
});

//add favorite movie to users

db.users.update(
    { Username: "JeepGuy" },
    { $push: { FavoriteMovies: ObjectId("60aea0209da56eb7f8cf3a3c") } }
  )

db.users.update(
    { Username: "rebelwithacause" },
    { $push: { FavoriteMovies: ObjectId("60aea0209da56eb7f8cf3a3d") } }
  )

db.users.update(
    { Username: "iamchonky" },
    { $push: { FavoriteMovies: ObjectId("60aea0209da56eb7f8cf3a41") } }
  )

db.users.update(
    { Username: "petey" },
    { $push: { FavoriteMovies: ObjectId("60aea0209da56eb7f8cf3a3e") } }
  )

db.users.update(
    { Username: "devastation" },
    { $push: { FavoriteMovies: ObjectId("60aea0209da56eb7f8cf3a40") } }
  )

  db.users.update({}, {$set : {"FavoriteMovies":[]}}, {upsert:false, multi:true})
  db.movies.update({}, {$set : {"DirectorBio": []}}, {upsert:false, multi:true})
