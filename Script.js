const foods = [
  {
    id: 1,
    name: "Classic Burger",
    category: "Burger",
    price: 120,
    emoji: "🍔",
    description: "Juicy burger with fresh veggies.",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58bd?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 2,
    name: "Cheese Pizza",
    category: "Pizza",
    price: 250,
    emoji: "🍕",
    description: "Cheesy pizza with delicious toppings.",
    image: "https://images.unsplash.com/photo- pizza?auto=format&fit=crop&w=600&q=80".replace(" ", "")
  },
  {
    id: 3,
    name: "Chocolate Cake",
    category: "Dessert",
    price: 150,
    emoji: "🍰",
    description: "Soft chocolate cake for sweet cravings.",
    image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 4,
    name: "French Fries",
    category: "Burger",
    price: 90,
    emoji: "🍟",
    description: "Crispy golden fries, served hot.",
    image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 5,
    name: "Cold Coffee",
    category: "Drinks",
    price: 100,
    emoji: "🥤",
    description: "Chilled creamy coffee for your day.",
    image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 6,
    name: "Veg Pizza",
    category: "Pizza",
    price: 220,
    emoji: "🍕",
    description: "Fresh vegetables with melted cheese.",
    image: "https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 7,
    name: "Ice Cream",
    category: "Dessert",
    price: 80,
    emoji: "🍨",
    description: "A cool and creamy sweet treat.",
    image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 8,
    name: "Fresh Juice",
    category: "Drinks",
    price: 70,
    emoji: "🧃",
    description: "Refreshing fruit drink.",
    image: "https://images.unsplash.com/photo-1600271886742-f049cd451bba?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 9,
    name: "Double Cheese Burger",
    category: "Burger",
    price: 180,
    emoji: "🍔",
    description: "Double cheese and a flavourful patty.",
    image: "https://images.unsplash.com/photo-1553979459-d2229ba7433a?auto=format&fit=crop&w=600&q=80"
  }
];

let cart = {};
let currentCategory = "All";
let lastOrder = null;
let toastTimer;

function renderMenu() {
  const list = document.getElementById("food-list");
  const search = document.getElementById("search").value.toLowerCase().trim();

  const filtered = foods.filter(food => {
    const matchesCategory =
      currentCategory === "All" || food.category === currentCategory;

    const matchesSearch =
      food.name.toLowerCase().includes(search) ||
      food.category.toLowerCase().includes(search) ||
      food.description.toLowerCase().includes(search);

    return matchesCategory && matchesSearch;
  });

  if (filtered.length === 0) {
    list.innerHTML = '<p>No food found. Try another search.</p>';
    return;
  }

  list.innerHTML = filtered.map(food => `
    <article class="food-card">
      <img
        src="${food.image}"
        alt="${food.name}"
        loading="lazy"
        onerror="this.onerror=null;this.src='https://placehold.co/600x400/fff0e5/ff6b35?text=Food';"
      >
      <div class="food-info">
        <h3>${food.emoji} ${food.name}</h3>
        <p>${food.description}</p>
        <div class="food-bottom">
          <span class="price">₹${food.price}</span>
          <button class="add-button" onclick="addToCart(${food.id})">
            + Add
          </button>
        </div>
      </div>
    </article>
  `).join("");
}

function setCategory(category, button) {
  currentCategory = category;

  document.querySelectorAll(".category").forEach(item => {
    item.classList.remove("active");
  });

  button.classList.add("active");
  renderMenu();
}

function addToCart(id) {
  const food = foods.find(item => item.id === id);
  if (!food) return;

  if (!cart[id]) {
    cart[id] = { ...food, quantity: 0 };
  }

  cart[id].quantity++;
  renderCart();
  showToast(food.name + " added to cart!");
}

function changeQuantity(id, change) {
  if (!cart[id]) return;

  cart[id].quantity += change;

  if (cart[id].quantity <= 0) {
    delete cart[id];
  }

  renderCart();
}

function getSubtotal() {
  return Object.values(cart).reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
}

function renderCart() {
  const container = document.getElementById("cart-items");
  const items = Object.values(cart);
  const count = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = getSubtotal();
  const delivery = subtotal > 0 ? 30 : 0;

  document.getElementById("cart-count").textContent = count;
  document.getElementById("subtotal").textContent = "₹" + subtotal;
  document.getElementById("delivery").textContent = "₹" + delivery;
  document.getElementById("total").textContent = "₹" + (subtotal + delivery);

  if (items.length === 0) {
    container.innerHTML =
      '<p class="empty">Your cart is empty. Add something delicious!</p>';
    return;
  }

  container.innerHTML = items.map(item => `
    <div class="cart-item">
      <div>
        <h4>${item.emoji} ${item.name}</h4>
        <small>₹${item.price} × ${item.quantity} = ₹${item.price * item.quantity}</small>
      </div>
      <div class="quantity-controls">
        <button onclick="changeQuantity(${item.id}, -1)" aria-label="Decrease quantity">−</button>
        <strong>${item.quantity}</strong>
        <button onclick="changeQuantity(${item.id}, 1)" aria-label="Increase quantity">+</button>
      </div>
    </div>
  `).join("");
}

function showCart() {
  document.getElementById("orders").scrollIntoView({ behavior: "smooth" });
}

function placeOrder() {
  const items = Object.values(cart);

  if (items.length === 0) {
    showToast("Please add food before placing an order.");
    return;
  }

  const subtotal = getSubtotal();
  const total = subtotal + 30;
  const orderNumber = "SB" + Date.now().toString().slice(-6);

  lastOrder = {
    orderNumber,
    items: items.map(item => ({ ...item })),
    total
  };

  cart = {};
  renderCart();

  document.getElementById("status-icon").textContent = "✅";
  document.getElementById("status-title").textContent = "Order placed!";
  document.getElementById("status-message").textContent =
    "Demo order " + orderNumber + " • Total ₹" + total +
    ". No payment was collected.";

  document.getElementById("step1").classList.add("done");
  document.getElementById("step2").classList.add("done");
  document.getElementById("step3").classList.remove("done");

  showToast("Demo order placed successfully!");
  document.getElementById("orders").scrollIntoView({ behavior: "smooth" });
}

function resetDemo() {
  cart = {};
  lastOrder = null;
  renderCart();

  document.getElementById("status-icon").textContent = "🍽️";
  document.getElementById("status-title").textContent = "Ready when you are!";
  document.getElementById("status-message").textContent =
    "Add food to your cart and place a demo order to see its status here.";

  document.querySelectorAll(".step").forEach(step => {
    step.classList.remove("done");
  });

  document.getElementById("available").checked = true;
  document.getElementById("cancelled").checked = false;
  updateLogic();

  showToast("Demo has been reset.");
}

function updateLogic() {
  const available = document.getElementById("available").checked;
  const cancelled = document.getElementById("cancelled").checked;

  // Same Boolean rules as food_order.v.
  const request = 1;
  const accepted = request && available && !cancelled ? 1 : 0;
  const isCancelled = request && cancelled ? 1 : 0;

  let status;
  if (isCancelled) {
    status = "11";
  } else if (accepted) {
    status = "01";
  } else {
    status = "00";
  }

  document.getElementById("logic-accepted").textContent = accepted;
  document.getElementById("logic-cancelled").textContent = isCancelled;
  document.getElementById("logic-status").textContent = status;

  const message = document.getElementById("logic-message");

  if (isCancelled) {
    message.textContent = "Order cancelled — status 11.";
    message.style.color = "#c0392b";
  } else if (accepted) {
    message.textContent = "Order accepted — status 01.";
    message.style.color = "#16865b";
  } else {
    message.textContent = "Food unavailable — order not accepted, status 00.";
    message.style.color = "#b56a00";
  }
}

function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.add("show");

  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.classList.remove("show");
  }, 2500);
}

renderMenu();
renderCart();
updateLogic();
