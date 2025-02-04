import { menuArray } from './data.js';

const menuContainer = document.getElementById('menu-container');
const orderContainer = document.getElementById('order-list');

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
            const itemPrice = e.target.dataset.price;

            const listItem = document.createElement('li');
            listItem.textContent = `${itemName} - $${itemPrice}`;

            orderContainer.appendChild(listItem);
        });
    });
}

renderMenuItems(menuArray);
