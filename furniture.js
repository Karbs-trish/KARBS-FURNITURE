const products = [
  {
    id: 1,
    name: "Rowan Lounge Chair",
    category: "seating",
    price: 640,
    rating: 4.8,
    description: "Low, comfortable seating with a kiln-dried oak frame."
  },
  {
    id: 2,
    name: "Marlo Nesting Tables",
    category: "tables",
    price: 360,
    rating: 4.6,
    description: "Two compact tables with rounded walnut tops."
  },
  {
    id: 3,
    name: "Cove Media Cabinet",
    category: "storage",
    price: 1180,
    rating: 4.9,
    description: "Sliding doors, cable routing, and generous hidden storage."
  },
  {
    id: 4,
    name: "Luna Floor Lamp",
    category: "lighting",
    price: 245,
    rating: 4.5,
    description: "Warm task lighting with a narrow steel base."
  },
  {
    id: 5,
    name: "Arden Sofa",
    category: "seating",
    price: 1540,
    rating: 4.9,
    description: "Deep cushions and stain-resistant woven upholstery."
  },
  {
    id: 6,
    name: "Pillar Dining Table",
    category: "tables",
    price: 980,
    rating: 4.7,
    description: "A grounded pedestal table that seats six comfortably."
  },
  {
    id: 7,
    name: "Nook Bookcase",
    category: "storage",
    price: 720,
    rating: 4.4,
    description: "Open shelving with two lower drawers for daily clutter."
  },
  {
    id: 8,
    name: "Halo Table Lamp",
    category: "lighting",
    price: 185,
    rating: 4.3,
    description: "A ceramic lamp with a linen shade and soft glow."
  }
];

const productGrid = document.querySelector("#productGrid");
const categoryFilter = document.querySelector("#categoryFilter");
const sortProducts = document.querySelector("#sortProducts");
const cartButton = document.querySelector("#cartButton");
const closeCart = document.querySelector("#closeCart");
const cartPanel = document.querySelector("#cartPanel");
const cartCount = document.querySelector("#cartCount");
const cartItems = document.querySelector("#cartItems");
const cartTotal = document.querySelector("#cartTotal");

let cart = [];

const moneyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0
});

function formatMoney(amount) {
  return moneyFormatter.format(amount);
}

function getVisibleProducts() {
  const selectedCategory = categoryFilter.value;
  const selectedSort = sortProducts.value;

  const filteredProducts = products.filter((product) => {
    return selectedCategory === "all" || product.category === selectedCategory;
  });

  return filteredProducts.sort((first, second) => {
    if (selectedSort === "priceLow") {
      return first.price - second.price;
    }

    if (selectedSort === "priceHigh") {
      return second.price - first.price;
    }

    if (selectedSort === "rating") {
      return second.rating - first.rating;
    }

    return first.id - second.id;
  });
}

function renderProducts() {
  const visibleProducts = getVisibleProducts();

  productGrid.innerHTML = visibleProducts
    .map((product) => {
      return `
        <article class="product-card">
          <div class="product-image" aria-hidden="true">
            <div class="product-shape shape-${product.category}"></div>
          </div>
          <div class="product-body">
            <div class="product-meta">
              <span>${product.category}</span>
              <span>${product.rating.toFixed(1)} stars</span>
            </div>
            <h3>${product.name}</h3>
            <p>${product.description}</p>
            <div class="product-meta">
              <strong>${formatMoney(product.price)}</strong>
            </div>
            <button type="button" data-product-id="${product.id}">Add to cart</button>
          </div>
        </article>
      `;
    })
    .join("");
}

function renderCart() {
  cartCount.textContent = cart.reduce((total, item) => total + item.quantity, 0);

  if (cart.length === 0) {
    cartItems.innerHTML = "<p>Your cart is empty.</p>";
    cartTotal.textContent = formatMoney(0);
    return;
  }

  cartItems.innerHTML = cart
    .map((item) => {
      const product = products.find((entry) => entry.id === item.id);

      return `
        <div class="cart-item">
          <div>
            <strong>${product.name}</strong>
            <p>${item.quantity} x ${formatMoney(product.price)}</p>
          </div>
          <button type="button" data-remove-id="${product.id}">Remove</button>
        </div>
      `;
    })
    .join("");

  const total = cart.reduce((sum, item) => {
    const product = products.find((entry) => entry.id === item.id);
    return sum + product.price * item.quantity;
  }, 0);

  cartTotal.textContent = formatMoney(total);
}

function addToCart(productId) {
  const existingItem = cart.find((item) => item.id === productId);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ id: productId, quantity: 1 });
  }

  renderCart();
}

function removeFromCart(productId) {
  cart = cart.filter((item) => item.id !== productId);
  renderCart();
}

function openCart() {
  cartPanel.classList.add("is-open");
  cartPanel.setAttribute("aria-hidden", "false");
}

function hideCart() {
  cartPanel.classList.remove("is-open");
  cartPanel.setAttribute("aria-hidden", "true");
}

productGrid.addEventListener("click", (event) => {
  const button = event.target.closest("[data-product-id]");

  if (!button) {
    return;
  }

  addToCart(Number(button.dataset.productId));
  openCart();
});

cartItems.addEventListener("click", (event) => {
  const button = event.target.closest("[data-remove-id]");

  if (!button) {
    return;
  }

  removeFromCart(Number(button.dataset.removeId));
});

cartButton.addEventListener("click", openCart);
closeCart.addEventListener("click", hideCart);
categoryFilter.addEventListener("change", renderProducts);
sortProducts.addEventListener("change", renderProducts);

cartPanel.addEventListener("click", (event) => {
  if (event.target === cartPanel) {
    hideCart();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    hideCart();
  }
});

renderProducts();
renderCart();
