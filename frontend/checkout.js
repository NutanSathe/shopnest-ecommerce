const checkoutItems =
    document.getElementById("checkout-items");

const checkoutTotal =
    document.getElementById("checkout-total");

const checkoutForm =
    document.getElementById("checkout-form");

const nameInput =
    document.getElementById("name");

const emailInput =
    document.getElementById("email");


// ===============================
// CHECK LOGGED-IN USER
// ===============================

const user =
    JSON.parse(localStorage.getItem("user"));

if (!user) {

    alert("Please login before checkout.");

    window.location.href = "login.html";
}


// ===============================
// SHOW LOGGED-IN USER DETAILS
// ===============================

if (user) {

    nameInput.value = user.name;
    emailInput.value = user.email;

}


// ===============================
// LOAD CHECKOUT
// ===============================

function loadCheckout() {

    const cart =
        JSON.parse(localStorage.getItem("cart")) || [];


    checkoutItems.innerHTML = "";


    if (cart.length === 0) {

        checkoutItems.innerHTML =
            "<p>Your cart is empty.</p>";

        checkoutTotal.textContent = "";

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
            "product-card";


        item.innerHTML = `

            <h3>
                ${product.name}
            </h3>

            <p>
                Price:
                ₹${Number(product.price).toFixed(2)}
            </p>

            <p>
                Quantity:
                ${product.quantity}
            </p>

            <p>
                <strong>
                    Subtotal:
                    ₹${productTotal.toFixed(2)}
                </strong>
            </p>

        `;


        checkoutItems.appendChild(item);

    });


    checkoutTotal.textContent =
        "Total: ₹" + total.toFixed(2);

}


// ===============================
// PLACE ORDER
// ===============================

checkoutForm.addEventListener(
    "submit",
    async function(event) {

        event.preventDefault();


        const currentUser =
            JSON.parse(localStorage.getItem("user"));


        if (!currentUser) {

            alert("Please login before placing an order.");

            window.location.href =
                "login.html";

            return;
        }


        const cart =
            JSON.parse(localStorage.getItem("cart")) || [];


        if (cart.length === 0) {

            alert("Your cart is empty.");

            window.location.href =
                "cart.html";

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


        const items =
            Object.values(groupedCart)
                .map(product => {

                    return {

                        productId:
                            product.id,

                        quantity:
                            product.quantity,

                        price:
                            Number(product.price)

                    };

                });


        let totalAmount = 0;


        items.forEach(item => {

            totalAmount +=
                item.price *
                item.quantity;

        });


        try {

            const response =
                await fetch(
                    "/api/orders",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body:
                            JSON.stringify({

                                userId:
                                    currentUser.id,

                                items:
                                    items,

                                totalAmount:
                                    totalAmount

                            })
                    }
                );


            const data =
                await response.json();


            if (response.ok) {

                localStorage.removeItem("cart");


                localStorage.setItem(
                    "lastOrderId",
                    data.orderId
                );


                window.location.href =
                    "order-success.html";

            } else {

                alert(data.message);

            }

        } catch (error) {

            console.error(error);

            alert(
                "Something went wrong while placing the order."
            );

        }

    }
);


// ===============================
// START
// ===============================

loadCheckout();