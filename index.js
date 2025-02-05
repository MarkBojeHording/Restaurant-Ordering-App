import { menuArray } from './data.js';

const menuContainer = document.getElementById('menu-container');
const orderContainer = document.getElementById('order-list');
const orderSection = document.getElementById("order-section");
const totalPriceContainer = document.getElementById("total-price");

let orderItems = {}; // Store order items

// ✅ Load Saved Orders from Local Storage
function loadSavedOrders() {
    const savedOrders = localStorage.getItem("orderItems");
    if (savedOrders) {
        orderItems = JSON.parse(savedOrders);
        updateOrderList();
    }
}

// ✅ Save Orders to Local Storage
function saveOrders() {
    localStorage.setItem("orderItems", JSON.stringify(orderItems));
}

// ✅ Render Menu Items
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

    // ✅ Attach Event Listeners to Buttons
    document.querySelectorAll(".btn-order").forEach(button => {
        button.addEventListener("click", function (e) {
            const itemName = e.target.dataset.name;
            const itemPrice = parseFloat(e.target.dataset.price);
            addToOrder(itemName, itemPrice);
        });
    });
}

// ✅ Add Items to Order
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
      listItem.classList.add("order-item"); // Add class for styling
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

loadSavedOrders();

renderMenuItems(menuArray);
