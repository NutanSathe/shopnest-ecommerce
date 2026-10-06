const express = require("express");
const path = require("path");
const bcrypt = require("bcryptjs");
const pool = require("./db");

const app = express();

const PORT = 3004;

app.use(express.json());

// Serve frontend files
app.use(express.static(path.join(__dirname, "../frontend")));


// Home page
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/index.html"));
});


// Test database
app.get("/test-db", async (req, res) => {

    try {

        const result = await pool.query("SELECT NOW()");

        res.json({
            message: "PostgreSQL connected successfully!",
            time: result.rows[0].now
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Database connection failed"
        });
    }
});


// ===============================
// REGISTER USER
// ===============================

app.post("/api/register", async (req, res) => {

    const { name, email, password } = req.body;

    try {

        const existingUser = await pool.query(
            "SELECT * FROM users WHERE email = $1",
            [email]
        );

        if (existingUser.rows.length > 0) {

            return res.status(400).json({
                message: "Email already registered."
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await pool.query(
            "INSERT INTO users (name, email, password) VALUES ($1, $2, $3)",
            [name, email, hashedPassword]
        );

        res.status(201).json({
            message: "Registration successful!"
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Registration failed."
        });
    }
});


// ===============================
// LOGIN USER
// ===============================

app.post("/api/login", async (req, res) => {

    const { email, password } = req.body;

    try {

        const result = await pool.query(
            "SELECT * FROM users WHERE email = $1",
            [email]
        );

        if (result.rows.length === 0) {

            return res.status(401).json({
                message: "Invalid email or password."
            });
        }

        const user = result.rows[0];

        const passwordMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!passwordMatch) {

            return res.status(401).json({
                message: "Invalid email or password."
            });
        }

        res.json({
            message: "Login successful!",
            user: {
                id: user.id,
                name: user.name,
                email: user.email
            }
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Login failed."
        });
    }
});


// ===============================
// GET ALL PRODUCTS
// ===============================

app.get("/api/products", async (req, res) => {

    try {

        const result = await pool.query(
            "SELECT * FROM products ORDER BY id"
        );

        res.json(result.rows);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Failed to fetch products"
        });
    }
});


// ===============================
// CREATE ORDER
// ===============================

app.post("/api/orders", async (req, res) => {

    const { userId, items, totalAmount } = req.body;

    if (!userId || !items || items.length === 0) {

        return res.status(400).json({
            message: "Invalid order data."
        });
    }

    const client = await pool.connect();

    try {

        // Start transaction
        await client.query("BEGIN");


        // Create order
        const orderResult = await client.query(
            `INSERT INTO orders
            (user_id, total_amount, status)
            VALUES ($1, $2, $3)
            RETURNING id`,
            [userId, totalAmount, "Pending"]
        );

        const orderId = orderResult.rows[0].id;


        // Add products to order_items
        for (const item of items) {

            await client.query(
                `INSERT INTO order_items
                (order_id, product_id, quantity, price)
                VALUES ($1, $2, $3, $4)`,
                [
                    orderId,
                    item.productId,
                    item.quantity,
                    item.price
                ]
            );
        }


        // Finish transaction
        await client.query("COMMIT");


        res.status(201).json({

            message: "Order placed successfully!",

            orderId: orderId

        });

    } catch (error) {

        // Cancel transaction if something fails
        await client.query("ROLLBACK");

        console.error(error);

        res.status(500).json({
            message: "Failed to place order."
        });

    } finally {

        client.release();

    }
});


app.listen(PORT, () => {

    console.log(
        `Server running on http://localhost:${PORT}`
    );

});