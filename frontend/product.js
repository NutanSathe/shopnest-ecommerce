const productDetails =
    document.getElementById("product-details");


const params =
    new URLSearchParams(window.location.search);


const productId =
    params.get("id");


// ===============================
// LOAD PRODUCT
// ===============================

async function loadProduct() {

    try {

        const response =
            await fetch("/api/products");


        if (!response.ok) {

            throw new Error(
                "Failed to load products"
            );

        }


        const products =
            await response.json();


        const product =
            products.find(
                product =>
                    product.id == productId
            );


        if (!product) {

            productDetails.innerHTML = `

                <div class="product-not-found">

                    <h2>
                        Product not found
                    </h2>

                    <a href="/">
                        <button>
                            Back to Products
                        </button>
                    </a>

                </div>

            `;

            return;
        }


        productDetails.innerHTML = `

            <div class="product-detail-card">

                <div class="product-detail-image">

                    <img
                        src="${product.image_url}"
                        alt="${product.name}"
                    >

                </div>


                <div class="product-detail-info">

                    <p class="product-label">
                        PRODUCT
                    </p>


                    <h2>
                        ${product.name}
                    </h2>


                    <p class="product-description">
                        ${product.description}
                    </p>


                    <p class="product-detail-price">
                        ₹${Number(product.price).toFixed(2)}
                    </p>


                    <p class="product-stock">
                        <strong>Stock:</strong>
                        ${product.stock} available
                    </p>


                    <button
                        class="add-cart-btn"
                        onclick="addToCart(${product.id})"
                    >
                        🛒 Add to Cart
                    </button>


                    <br>


                    <a
                        href="/"
                        class="back-shopping"
                    >
                        ← Continue Shopping
                    </a>

                </div>

            </div>

        `;

    } catch (error) {

        console.error(error);


        productDetails.innerHTML = `

            <div class="product-not-found">

                <h2>
                    Unable to load product details.
                </h2>

                <a href="/">
                    <button>
                        Back to Products
                    </button>
                </a>

            </div>

        `;

    }

}


// ===============================
// ADD TO CART
// ===============================

async function addToCart(productId) {

    // Login required
    const user =
        JSON.parse(localStorage.getItem("user"));


    if (!user) {

        alert(
            "Please login first to add products to your cart."
        );

        window.location.href =
            "login.html";

        return;
    }


    try {

        const response =
            await fetch("/api/products");


        const products =
            await response.json();


        const product =
            products.find(
                product =>
                    product.id == productId
            );


        if (!product) {

            return;

        }


        const cart =
            JSON.parse(
                localStorage.getItem("cart")
            ) || [];


        cart.push(product);


        localStorage.setItem(
            "cart",
            JSON.stringify(cart)
        );


        alert("Product added to cart!");


        window.location.href =
            "cart.html";

    } catch (error) {

        console.error(error);

        alert(
            "Unable to add product to cart."
        );

    }

}


// ===============================

loadProduct();