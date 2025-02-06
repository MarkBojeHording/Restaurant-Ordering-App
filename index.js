import { menuArray } from './data.js';

const menuContainer = document.getElementById('menu-container');
const orderContainer = document.getElementById('order-list');
const orderSection = document.getElementById("order-section");
const totalPriceContainer = document.getElementById("total-price");
const orderBtn = document.getElementById("complete-order-btn");

let orderItems = {};

function loadSavedOrders() {
    const savedOrders = localStorage.getItem("orderItems");
    if (savedOrders) {
        orderItems = JSON.parse(savedOrders);
        updateOrderList();
    }
}

function saveOrders() {
    localStorage.setItem("orderItems", JSON.stringify(orderItems));
}

function renderMenuItems(menus) {
    const menuHtmlArray = menus.map(menu => `
        <div class="menu-item">
            <span class="menu-emoji">${menu.emoji}</span>
            <div class="menu-details">
                <p class="menu-name">${menu.name}</p>
                <p class="menu-ingredients">${menu.ingredients.join(', ')}</p>
                <p class="menu-price">$${menu.price}</p>
            </div>
            <button class="btn-order" data-name="${menu.name}" data-price="${menu.price}">&plus;</button>
        </div>
    `);

    menuContainer.innerHTML = menuHtmlArray.join('');

    document.querySelectorAll(".btn-order").forEach(button => {
        button.addEventListener("click", function (e) {
            const itemName = e.target.dataset.name;
            const itemPrice = parseFloat(e.target.dataset.price);
            addToOrder(itemName, itemPrice);
        });
    });
}

function addToOrder(itemName, itemPrice) {
    if (orderItems[itemName]) {
        orderItems[itemName].quantity++;
        orderItems[itemName].totalPrice += itemPrice;
    } else {
        orderItems[itemName] = {
            name: itemName,
            unitPrice: itemPrice,
            quantity: 1,
            totalPrice: itemPrice
        };
    }

    updateOrderList();
    saveOrders();
}

function removeFromOrder(itemName) {
    if (orderItems[itemName]) {
        orderItems[itemName].quantity--;
        orderItems[itemName].totalPrice -= orderItems[itemName].unitPrice;

        if (orderItems[itemName].quantity === 0) {
            delete orderItems[itemName];
        }
    }

    updateOrderList();
    saveOrders();
}

function updateOrderList() {
    orderContainer.innerHTML = "";
    let totalPrice = 0;

    for (const item in orderItems) {
        const listItem = document.createElement("li");
        listItem.classList.add("order-item");
        listItem.innerHTML = `
            <span class="order-name">${orderItems[item].quantity} ${orderItems[item].name}</span>
            <button class="remove-btn" data-name="${item}">Remove</button>
            <span class="order-price">$${orderItems[item].totalPrice.toFixed(2)}</span>
        `;

        orderContainer.appendChild(listItem);
        totalPrice += orderItems[item].totalPrice;
    }

    document.getElementById("total-price").innerHTML = `Total: <span class="total-price">$${totalPrice.toFixed(2)}</span>`;

    if (Object.keys(orderItems).length > 0) {
        orderSection.style.display = "block";
    } else {
        orderSection.style.display = "none";
    }

    document.querySelectorAll(".remove-btn").forEach(button => {
        button.addEventListener("click", function (e) {
            removeFromOrder(e.target.dataset.name);
        });
    });
}

function showPaymentModal() {
    localStorage.setItem("modalOpen", "true");
    if (document.getElementById("payment-modal")) return;

    const modal = document.createElement("div");
    modal.setAttribute("id", "payment-modal");
    modal.classList.add("modal");

    modal.innerHTML = `
        <div class="modal-content">
            <span class="close-btn"></span>
            <form id="payment-form">
            <div id="card-details">Enter Card Details</div> <!-- Move the ID to a separate div -->

            <label for="card-name"></label>
            <input type="text" id="card" placeholder="Enter Your Name" required>

            <label for="card-number"></label>
            <input type="text" id="card" name="card-number" inputmode="numeric"
                pattern="[0-9\\s]{13,19}" maxlength="19" placeholder="Enter Card Number"
                required aria-label="Credit Card Number">

            <label for="cvv"></label>
            <input type="text" id="card" name="cvv" inputmode="numeric" pattern="[0-9]{3,4}"
                maxlength="4" placeholder="Enter CVV" required aria-label="CVV">

            <button type="submit" id="submit-payment">Pay</button>
        </form>
      </div>
    `;

    document.body.appendChild(modal);

    document.querySelector(".close-btn").addEventListener("click", function () {
        modal.remove();
    });

    window.addEventListener("click", function (e) {
        if (e.target === modal) {
            modal.remove();
        }
    });
    document.addEventListener("submit", function (e) {
      if (e.target.id === "payment-form") {
          e.preventDefault();

          // Hide the order section
          document.getElementById("order-section").style.display = "none";

          // Remove any existing success message
          let successMessage = document.getElementById("success-message");
          if (successMessage) {
              successMessage.remove();
          }

          // ✅ Create the success message
          successMessage = document.createElement("div");
          successMessage.setAttribute("id", "success-message");
          successMessage.innerHTML = `
              <h2 style="color: black; text-align: center;">Thanks, Mark! Your order is on its way! 🍔</h2>
          `;

          // ✅ Append to the main container
          document.body.appendChild(successMessage);

          // ✅ Ensure the message is displayed
          successMessage.style.display = "block";

          // ✅ Remove modal and clear order
          localStorage.removeItem("modalOpen");
          document.getElementById("payment-modal").remove();
          orderItems = {};
          saveOrders();
      }
  });

  document.addEventListener("submit", function (e) {
    if (e.target.id === "payment-form") {
        e.preventDefault();

        // Hide the order section
        document.getElementById("order-section").style.display = "none";

        // Remove any existing success message
        let successMessage = document.getElementById("success-message");
        if (successMessage) {
            successMessage.remove();
        }

        // ✅ Create the success message
        successMessage = document.createElement("div");
        successMessage.setAttribute("id", "success-message");
        successMessage.innerHTML = `
            <h2>Thanks, Mark! Your order is on its way!</h2>
        `;

        // ✅ Append to main container
        document.body.appendChild(successMessage);

        // ✅ Ensure it's displayed inside the box
        successMessage.style.display = "flex";

        // ✅ Remove modal and clear order
        localStorage.removeItem("modalOpen");
        document.getElementById("payment-modal").remove();
        orderItems = {};
        saveOrders();
    }
  });
}

orderBtn.addEventListener("click", showPaymentModal);

loadSavedOrders();
renderMenuItems(menuArray);
