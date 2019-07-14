const { Customer, validate } = require("../models/customer");
const express = require("express");
// const mongoose = require("mongoose");
const router = express.Router();

router.get("/", async (req, res) => {
  const customer = await Customer.find().sort("name");
  res.send(customer);
});

router.get("/:id", async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    res.send(customer);
  } catch (err) {
    console.error(err.message);
    return res.status(404).send("The customer with the given id was not found");
  }
});

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let customer = new Customer({
    isGold: req.body.isGold,
    name: req.body.name,
    phone: req.body.phone
  });
  customer = await customer.save();
  res.send(customer);
});

router.put("/:id", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  try {
    const customer = await Customer.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        isGold: req.body.isGold === true ? true : false,
        phone: req.body.phone
      },
      { new: true }
    );
    res.send(customer);
  } catch (err) {
    console.error(err.message);
    res.status(404).send("The customer with the given id was not found");
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const customer = await Customer.findByIdAndRemove(req.params.id);
    res.send(customer);
  } catch (err) {
    console.error(err.message);
    res.status(404).send("The customer with the given id was not found");
  }
});

module.exports = router;
