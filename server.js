const express = require("express");
const cors = require("cors");
const moment = require("moment");

const app = express();

app.use(express.json());
app.use(cors());

//Use this array as your (in-memory) data store.
const bookings = require("./bookings.json");

app.get("/", function (request, response) {
  response.send("Hotel booking server.  Ask for /bookings, etc.");
});

// TODO add your routes and helper functions here

// *******Get all bookings*****

app.get("/bookings", (req, res) => {
  res.json(bookings);
});

// **** Create new booking *****

app.post("/bookings", (req, res) => {
  let newBooking = {
    id: bookings.length + 1, // temp solution for now to match with other id, I can use uuid for bigger pros
    title: req.body.title,
    firstName: req.body.firstName,
    surname: req.body.surname,
    email: req.body.email,
    roomId: req.body.roomId,
    checkInDate: req.body.checkInDate,
    //checkInDate: moment().format("L"),
    checkOutDate: req.body.checkOutDate,
  };

  if (
    newBooking.title.length > 0 &&
    newBooking.firstName.length > 0 &&
    newBooking.surname.length > 0 &&
    newBooking.email.length > 0 &&
    typeof newBooking.roomId == "number" &&
    newBooking.checkInDate.length > 0 &&
    newBooking.checkOutDate.length > 0
  ) {
    bookings.push(newBooking);
    res.json(bookings);
  } else {
    res.status(400).send("Please fill all required properties to book a place");
  }

  //----could not make these methods work----- :(

  // let bookKeys = Object.keys(newBooking);
  // let checkKeys = bookKeys.filter((p) => p.length > 0);
  // let emptyProps = bookKeys.find((p) => p.length < 0);

  // if (emptyProp) {
  //   res.status(400).send("Please fill all required properties to book a place");
  // } else {
  //   bookings.push(newBooking);
  //   res.json(bookings);
  // }
});

// ******** Get one by id *******

app.get("/bookings/:id", (req, res) => {
  const id = Number(req.params.id);
  if (bookings.map((booking) => booking.id).includes(id)) {
    const selectedBooking = bookings.find((booking) => booking.id === id);
    res.json(selectedBooking);
  } else {
    res
      .status(404)
      .send(`Please enter id number between 1 and ${bookings.length}`);
  }
});

// ******** Delete one by id *******

app.delete("/bookings/:id", (req, res) => {
  const id = Number(req.params.id);
  if (bookings.map((booking) => booking.id).includes(id)) {
    const selectedBooking = bookings.filter((booking) => booking.id !== id);
    res.json({ msg: `Boking with id number ${id} deleted`, selectedBooking });
  } else {
    res
      .status(404)
      .send(`Please enter id number between 1 and ${bookings.length}`);
  }
});

// Search booking with time span

app.get("/bookings", (req, res) => {
  // let startTime = req.body.checkInDate
  // let endTime = req.body.checkOutDate
  let date = req.query.date;
  let matchedBookings = bookings.map(
    (book) => book.checkInDate <= date && book.checkOutDate >= date
  );
  if (matchedBookings !== undefined) {
    res.json(matchedBookings);
  } else res.send("No bookings found matching the chosen timespan");
});

// const port = process.env.PORT || 7070

const listener = app.listen(process.env.PORT || 7070, function () {
  console.log("Your app is listening on port " + listener.address().port);
});
