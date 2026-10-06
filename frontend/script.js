const productsContainer = document.getElementById("products");
const cartCount = document.getElementById("cart-count");
const authArea = document.getElementById("auth-area");

let products = [];


// ===============================
// LOAD PRODUCTS
// ===============================

async function loadProducts() {

    try {

        const response = await fetch("/api/products");

        if (!response.ok) {
            throw new Error("Failed to load products");
        }

        products = await response.json();

        productsContainer.innerHTML = "";

        products.forEach(product => {

            const productCard =
                document.createElement("div");

            productCard.className = "product-card";

            productCard.innerHTML = `

                <img
                    src="${product.image_url}"
                    alt="${product.name}"
                >

                <h3>
                    <a href="product.html?id=${product.id}">
                        ${product.name}
                    </a>
                </h3>

                <p>
                    ${product.description}
                </p>

                <p>
                    <strong>
                        ₹${Number(product.price).toFixed(2)}
                    </strong>
                </p>

                <p>
                    Stock: ${product.stock}
                </p>

                <button
                    onclick="event.stopPropagation(); addToCart(${product.id})"
                >
                    Add to Cart
                </button>
            `;


            productCard.onclick = function(event) {

                if (
                    event.target.tagName !== "BUTTON" &&
                    event.target.tagName !== "A"
                ) {

                    window.location.href =
                        `product.html?id=${product.id}`;
                }

            };


            productsContainer.appendChild(productCard);

        });

    } catch (error) {

        console.error(
            "Error loading products:",
            error
        );

        productsContainer.innerHTML =
            "<p>Unable to load products.</p>";
    }
}


// ===============================
// CHECK LOGIN
// ===============================

function isLoggedIn() {

    const user =
        JSON.parse(localStorage.getItem("user"));

    return !!user;
}


// ===============================
// ADD TO CART
// ===============================

function addToCart(productId) {

    // Login required
    if (!isLoggedIn()) {

        alert("Please login first to add products to your cart.");

        window.location.href =
            "login.html";

        return;
    }


    const cart =
        JSON.parse(localStorage.getItem("cart")) || [];


    const product =
        products.find(
            product => product.id === productId
        );


    if (product) {

        cart.push(product);

        localStorage.setItem(
            "cart",
            JSON.stringify(cart)
        );

        updateCartCount();

        alert("Product added to cart!");
    }
}


// ===============================
// CART COUNT
// ===============================

function updateCartCount() {

    const cart =
        JSON.parse(localStorage.getItem("cart")) || [];

    cartCount.textContent =
        cart.length;
}


// ===============================
// LOGIN / LOGOUT AREA
// ===============================

function updateAuthArea() {

    const user =
        JSON.parse(localStorage.getItem("user"));


    if (user) {

        authArea.innerHTML = `

            <span>
                Hi, ${user.name}
            </span>

            <button onclick="logout()">
                Logout
            </button>

        `;

    } else {

        authArea.innerHTML = `

            <a href="login.html">
                Login
            </a>

            <a href="register.html">
                Register
            </a>

        `;
    }
}


// ===============================
// LOGOUT
// ===============================

function logout() {

    localStorage.removeItem("user");

    window.location.href = "/";
}


// ===============================
// START
// ===============================

loadProducts();

updateCartCount();

updateAuthArea();