const cartItemsContainer =
    document.getElementById("cart-items");

const cartTotal =
    document.getElementById("cart-total");


// ===============================
// CHECK LOGIN
// ===============================

const user =
    JSON.parse(localStorage.getItem("user"));


if (!user) {

    alert("Please login first to view your cart.");

    window.location.href =
        "login.html";
}


// ===============================
// LOAD CART
// ===============================

function loadCart() {

    const cart =
        JSON.parse(localStorage.getItem("cart")) || [];


    cartItemsContainer.innerHTML = "";


    if (cart.length === 0) {

        cartItemsContainer.innerHTML = `

            <div class="empty-cart">

                <h2>
                    🛒 Your Cart is Empty
                </h2>

                <p>
                    Add some products to your cart
                    and come back here.
                </p>

                <a href="/">
                    <button>
                        Start Shopping
                    </button>
                </a>

            </div>

        `;

        cartTotal.textContent = "";

        return;
    }


    const groupedCart = {};


    cart.forEach(product => {

        if (groupedCart[product.id]) {

            groupedCart[product.id].quantity++;

        } else {

            groupedCart[product.id] = {

                ...product,

                quantity: 1

            };

        }

    });


    let total = 0;


    Object.values(groupedCart).forEach(product => {

        const productTotal =
            Number(product.price) *
            product.quantity;


        total += productTotal;


        const item =
            document.createElement("div");


        item.className =
            "cart-product";


        item.innerHTML = `

            <img
                src="${product.image_url}"
                alt="${product.name}"
            >


            <div class="cart-product-info">

                <h3>
                    ${product.name}
                </h3>


                <p>
                    ${product.description}
                </p>


                <p class="cart-price">
                    ₹${Number(product.price).toFixed(2)}
                </p>


                <div class="quantity-control">

                    <button
                        onclick="decreaseQuantity(${product.id})"
                    >
                        −
                    </button>


                    <span>
                        ${product.quantity}
                    </span>


                    <button
                        onclick="increaseQuantity(${product.id})"
                    >
                        +
                    </button>

                </div>


                <p class="subtotal">

                    Subtotal:
                    <strong>
                        ₹${productTotal.toFixed(2)}
                    </strong>

                </p>


                <button
                    class="remove-btn"
                    onclick="removeFromCart(${product.id})"
                >
                    Remove
                </button>

            </div>

        `;


        cartItemsContainer.appendChild(item);

    });


    cartTotal.textContent =
        "Total: ₹" + total.toFixed(2);

}


// ===============================
// INCREASE QUANTITY
// ===============================

function increaseQuantity(productId) {

    const cart =
        JSON.parse(localStorage.getItem("cart")) || [];


    const product =
        cart.find(
            product =>
                product.id === productId
        );


    if (product) {

        cart.push(product);

    }


    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );


    loadCart();

}


// ===============================
// DECREASE QUANTITY
// ===============================

function decreaseQuantity(productId) {

    const cart =
        JSON.parse(localStorage.getItem("cart")) || [];


    const index =
        cart.findIndex(
            product =>
                product.id === productId
        );


    if (index !== -1) {

        cart.splice(index, 1);

    }


    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );


    loadCart();

}


// ===============================
// REMOVE PRODUCT
// ===============================

function removeFromCart(productId) {

    let cart =
        JSON.parse(localStorage.getItem("cart")) || [];


    cart =
        cart.filter(
            product =>
                product.id !== productId
        );


    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );


    loadCart();

}


// ===============================
// CHECKOUT
// ===============================

const checkoutButton =
    document.getElementById("checkout-btn");


checkoutButton.addEventListener(
    "click",
    function() {

        const currentUser =
            JSON.parse(
                localStorage.getItem("user")
            );


        if (!currentUser) {

            alert(
                "Please login first before checkout."
            );

            window.location.href =
                "login.html";

            return;

        }


        const cart =
            JSON.parse(
                localStorage.getItem("cart")
            ) || [];


        if (cart.length === 0) {

            alert(
                "Your cart is empty."
            );

            return;

        }


        window.location.href =
            "checkout.html";

    }
);


// ===============================
// START
// ===============================

if (user) {

    loadCart();

}