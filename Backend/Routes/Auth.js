const express = require('express')
const User = require('../models/User')
const Order = require('../models/Orders')
const router = express.Router()
const bcrypt = require('bcryptjs')
const fs = require('fs');
const mongoose = require('mongoose');
const { io } = require('../index');


router.post('/login', async (req, res) => {
  let success = false
  const { username, password } = req.body;
  try {
    let user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ success, error: "Try Logging in with correct credentials" });
    }

    let name = user.name;

    const pwdCompare = await bcrypt.compare(password, user.password);
    if (!pwdCompare) {
      // console.log("WRONG")
      return res.status(400).json({ success, error: "Try Logging in with correct credentials" });
    }
    success = true;
    res.json({ success, name })


  } catch (error) {
    console.error(error.message)
    res.send("Server Error")
  }
})

router.post('/foodData', async (req, res) => {
  try {
    // console.log("Hi")
    const foodcategory = mongoose.connection.collection('Categories');
    const fooditem = mongoose.connection.collection('food_items');
    const foodData =await fooditem.find({}).toArray()
    const foodCategory =await foodcategory.find({}).toArray()
    // console.log(foodData, foodCategory)
    res.send([foodData, foodCategory])
  } catch (error) {
    console.error("Hi",error)
    res.send("Server Error")

  }
})

router.post('/markPaid/:tableId', async (req, res) => {
  const tableId = req.params.tableId;
  try {
    const result = await Order.findOneAndDelete({ Table: tableId });
    if (result) {
      res.json({ success: true, message: `Total price is ${result.Total}` });
    } else {
      res.status(404).json({ success: false, message: 'Order not found.' });
    }
  } catch (error) {
    console.error('Error deleting order:', error);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
});

router.get('/tables', async (req, res) => {
  try {
    const orders = await Order.find({});
    const tablesWithTotalPrice = orders.map(order => {
      return {
        ...order.toObject(),
        total_price: order.Total // Use the Total field, or default to 0 if it's not set
      };
    });
    console.log(orders)
    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).send({ error: error.message });
  }
});


router.post('/orderData', async (req, res) => {
  // console.log("#####################",req.body)
  const {order_data,Table,Total } = req.body;
  // console.log(order_data, Table,Total)
  try {
    let existingOrder = await Order.findOne({ Table });

    if (!existingOrder) {
      existingOrder = await Order.create({
        Table,
        order_data,
        Total
      });
    } 
    else {
      const newTotal = existingOrder.Total + Total;

      await Order.findOneAndUpdate(
        { Table },
        { 
          $push: { order_data: { $each: order_data } },
          Total: newTotal 
        },
      )

      existingOrder = await Order.findOne({ Table });
    }

    
    const filteredOrderData = existingOrder.order_data.map(item => {
      const { img, ...rest } = item;
      return rest;
    });

    // Emit the filtered data
    io.emit('orderUpdate', { Table, order_data: filteredOrderData });

    res.json({ success: true });
  } catch (error) {
    console.error('Error processing order data:', error.message);
    res.status(500).send({ error: 'Internal server error' });
  }
});

router.post('/addFoodItem', async (req, res) => {

  const { CategoryName, name, img, options, description } = req.body;
  // console.log(CategoryName, name, img, options, description)

  try {
    // if (!Array.isArray(options) || options.some(opt => !opt.full && !opt.half)) {
    //   return res.status(400).json({ error: 'Options should be an array of objects with either full or half property, but not both' });
    // }
    const foodcategoryCollection = mongoose.connection.collection('Categories');

    const categoryExists = await foodcategoryCollection.findOne({ CategoryName });
    if (!categoryExists) {
      await foodcategoryCollection.insertOne({ CategoryName });
    }

    const imageData = await fs.readFileSync(img);

    const img64 = await imageData.toString('base64');

    const fooditemCollection = mongoose.connection.collection('food_items');
    const newFoodItem = {
      CategoryName,
      name,
      img: img64,
      options,
      description
    };

    const result = await fooditemCollection.insertOne(newFoodItem);
    res.json(result);
  } catch (error) {
    console.error('Error adding food item:', error.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router