const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const doesExist = (username) => {
  // Filter the users array for any user with the same username
  let userswithsamename = users.filter((user) => {
    return user.username === username;
  });
  // Return true if any user with the same username is found, otherwise false
  if (userswithsamename.length > 0) {
    return true;
  } else {
    return false;
  }
};
public_users.post("/register", (req, res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  // Check if both username and password are provided
  if (username && password) {
    // Check if the user does not already exist
    if (!doesExist(username)) {
      // Add the new user to the users array
      users.push({ username: username, password: password });
      return res
        .status(200)
        .json({ message: "User successfully registered. Now you can login" });
    } else {
      return res.status(404).json({ message: "User already exists!" });
    }
  }
  // Return error if username or password is missing
  return res.status(404).json({ message: "Unable to register user." });
  return res.status(300).json({ message: "Yet to be implemented" });
});

// Get the book list available in the shop
public_users.get("/", async function (req, res) {
  const getBooks = () => {
    return new Promise((resolve, reject) => {
      let success = true;
      if (success) {
        resolve(books);
      } else {
        reject(new Error("Error retrieving books"));
      }
    });
  };
  getBooks()
    .then((result) => {
      res.status(200).json({
        message: "Books retrieved successfully",
        books: result,
      });
    })
    .catch((error) => {
      res.status(500).json({
        message: "Error retrieving books",
        error: error.message,
      });
    });
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  const getBook = () => {
    return new Promise((resolve, reject) => {
      let success = true;
      if (success) {
        resolve(books[isbn]);
      } else {
        reject(new Error("Error retrieving book"));
      }
    });
  };
  getBook()
    .then((result) => {
      res.status(200).json({
        message: "Book retrieved successfully",
        book: result,
      });
    })
    .catch((error) => {
      res.status(500).json({
        message: "Error retrieving book",
        error: error.message,
      });
    });
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  const author = req.params.author;
  const getBook = () => {
    return new Promise((resolve, reject) => {
      let success = true;
      if (success) {
        resolve( Object.values(books).filter((book) => book.author === author));
      } else {
        reject(new Error("Error retrieving book"));
      }
    });
  };
  getBook()
    .then((result) => {
      if(result.length === 0) {
        return res.status(404).json({ message: "Book not found" });
      }
      res.status(200).json({
        message: "Book retrieved successfully",
        book: result
      });
    })
    .catch((error) => {
      res.status(500).json({
        message: "Error retrieving book",
        error: error.message,
      });
    });
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  //Write your code here
  const title = req.params.title;
  const getBook = () => {
    return new Promise((resolve, reject) => {
      let success = true;
      if (success) {
        resolve( Object.values(books).filter((book) => book.title === title));
      } else {
        reject(new Error("Error retrieving book"));
      }
    });
  };
  getBook()
    .then((result) => {
      if(result.length === 0) {
        return res.status(404).json({ message: "Book not found" });
      }
      res.status(200).json({
        message: "Book retrieved successfully",
        book: result
      });
    })
    .catch((error) => {
      res.status(500).json({
        message: "Error retrieving book",
        error: error.message,
      });
    });
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];

  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }

  return res.status(200).json({
    message: "Reviews retrieved successfully",
    reviews: book.reviews,
  });
});

module.exports.general = public_users;
