var express = require('express');
const db = require('../db');
var router = express.Router();
router.get('/getItems', async (req, res) => {
    try {
      console.log("working");
      const [rows] = await db.promise().query('SELECT item,category FROM category ORDER BY item');
      res.status(200).json(rows);
    } catch (error) {
      console.error('Error fetching items:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  router.post('/getCategoryVendor', async (req, res) => {
    const { item } = req.body;
  
    if (!item) {
      return res.status(400).json({ message: 'Item is required' });
    }
    try {
      const [rows] = await db.promise().query('SELECT category FROM category WHERE item = ?', [item]);
      res.status(200).json(rows);
    } catch (error) {
      console.error('Error fetching category:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  router.post('/add', async (req, res) => {
    console.log("Processing request...");
    const arr = req.body.arr; 
    console.log(arr);
    const date = req.body.date;
  
    try {
      for (let item of arr) {  
        const { item: itemName, category, quantity, amount, totalAmount } = item;
        const purchaseQuantity = Number(quantity) || 0;
        const amountkg = Number(amount) || 0;
        const total = Number(totalAmount) || 0;
        
        console.log(itemName, purchaseQuantity, amountkg, total, date);
  
        // Fetch current quantity for the item
        const [rows] = await db.promise().query(
          `SELECT COALESCE(quantity, 0) as quantity FROM current WHERE item = ? ORDER BY date DESC LIMIT 1`, 
          [itemName]
        );
  
        const currentQuantity = rows.length > 0 ? rows[0].quantity : 0;
        const finalQuantity = currentQuantity + purchaseQuantity;
  
        // Insert into purchase table
        await db.promise().query(
          `INSERT INTO purchase (item, category, quantity, amountkg, amount, date) VALUES (?, ?, ?, ?, ?, ?)`,
          [itemName, category, purchaseQuantity, amountkg, total, date]
        );
  
        // Check if the item exists in the current table
        if (currentQuantity === 0) {
          // Insert a new record into the current table
          await db.promise().query(
            `INSERT INTO current (item, category, quantity) VALUES (?, ?, ?)`,
            [itemName, category, finalQuantity]
          );
        } else {
          // Update the existing record in the current table
          await db.promise().query(
            `UPDATE current SET quantity = ? WHERE item = ?`,
            [finalQuantity, itemName]
          );
        }
  
        // Insert into closingstock table
        await db.promise().query(
          `INSERT INTO closingstock (item, quantity, date, category) VALUES (?, ?, ?, ?)`,
          [itemName, finalQuantity, date, category]
        );
      }
  
      res.send("Items inserted");
    } catch (error) {
      console.error("Error processing request:", error);
      res.status(500).send("An error occurred");
    }
  });
    
  module.exports=router;