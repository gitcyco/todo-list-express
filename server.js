// import express and assign to 'express' function
const express = require("express");

// create app by calling express() function
const app = express();

// import MongoClient
const MongoClient = require("mongodb").MongoClient;

// set default port
const PORT = 2121;

// import our configuration from .env
require("dotenv").config();

// initialize global variables
let db,
  dbConnectionStr = process.env.DB_STRING,
  dbName = "todo";

// Connect to db, using dbConnectionStr env variable
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
  // MongoClient.connect returns a promise, so supply
  // a .then callback
  .then((client) => {
    // log success
    console.log(`Connected to ${dbName} Database`);
    // assign our database to db variable
    db = client.db(dbName);
  });

// use ejs as our view engine
app.set("view engine", "ejs");

// setup the public folder to be served up by default
app.use(express.static("public"));

// setup urlencoded middleware with extended flag set
app.use(express.urlencoded({ extended: true }));

// put express.json into our middleware pipeline
app.use(express.json());

// base get root path route, use an async callback
app.get("/", async (request, response) => {
  // get an array of the todoItems from the database
  const todoItems = await db.collection("todos").find().toArray();
  // get the count of items that have 'completed' set to false
  const itemsLeft = await db.collection("todos").countDocuments({ completed: false });
  // respond with the ejs template, inserting todoItems and itemsLeft
  response.render("index.ejs", { items: todoItems, left: itemsLeft });
  // db.collection('todos').find().toArray()
  // .then(data => {
  //     db.collection('todos').countDocuments({completed: false})
  //     .then(itemsLeft => {
  //         response.render('index.ejs', { items: data, left: itemsLeft })
  //     })
  // })
  // .catch(error => console.error(error))
});

// setup route for /addTodo post requests
app.post("/addTodo", (request, response) => {
  // in the database collection "todos"
  db.collection("todos")
    // insert a new document using the request data for todoItem, and set completed to false
    .insertOne({ thing: request.body.todoItem, completed: false })
    // if successful, then
    .then((result) => {
      // log success
      console.log("Todo Added");
      // then redirect to root /
      response.redirect("/");
    })
    // log any errors
    .catch((error) => console.error(error));
});

// setup the /markComplete route, allowing us to tag items as complete in the db
app.put("/markComplete", (request, response) => {
  // in the database collection "todos"
  db.collection("todos")
    // perform an updateOne query
    .updateOne(
      // filter on the 'itemFromJS' data
      { thing: request.body.itemFromJS },
      {
        // modify 'completed', setting it to true
        $set: {
          completed: true,
        },
      },
      {
        // sort in descending order
        sort: { _id: -1 },
        // do not create a new document if none are found
        upsert: false,
      }
    )
    // on success, log and return a response
    .then((result) => {
      // log success
      console.log("Marked Complete");
      // send back a json response of success
      response.json("Marked Complete");
    })
    // log any errors
    .catch((error) => console.error(error));
});

// setup the /markUnComplete route, allowing us to tag items as incomplete in the db
app.put("/markUnComplete", (request, response) => {
  // in the database collection "todos"
  db.collection("todos")
    // perform an updateOne query
    .updateOne(
      // filter on the 'itemFromJS' data
      { thing: request.body.itemFromJS },
      {
        // modify 'completed', setting it to false
        $set: {
          completed: false,
        },
      },
      {
        // sort in descending order
        sort: { _id: -1 },
        // do not create a new document if none are found
        upsert: false,
      }
    )
    // on success, log and return a response
    .then((result) => {
      // log success
      console.log("Marked Incomplete");
      // send back a json response of success
      response.json("Marked Incomplete");
    })
    // log any errors
    .catch((error) => console.error(error));
});

// setup the /deleteItem route, allowing us to delete an item in the db
app.delete("/deleteItem", (request, response) => {
  // in the database collection "todos"
  db.collection("todos")
    // perform a 'deleteOne' query, filtering on the data from itemFromJS
    .deleteOne({ thing: request.body.itemFromJS })
    // on success, log and return a response
    .then((result) => {
      // log success
      console.log("Todo Deleted");
      // send back a json response of success
      response.json("Todo Deleted");
    })
    // log any errors
    .catch((error) => console.error(error));
});

// start the server, preferring the PORT value from .env, and log if everything starts up correctly
app.listen(process.env.PORT || PORT, () => {
  // log the server details
  console.log(`Server running on port ${PORT}`);
});
