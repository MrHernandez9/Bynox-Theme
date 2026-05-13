// @ts-nocheck
document.addEventListener('DOMContentLoaded', () => {

  const productForms = document.querySelectorAll(
    'form[action="/cart/add"]'
  );

  const cartDrawer = document.getElementById('bynoxCartDrawer');

  const cartOverlay = document.getElementById('bynoxCartOverlay');

  const cartCount = document.getElementById('bynoxCartCount');

  function openCartDrawer() {

    if (cartDrawer) {
      cartDrawer.classList.add('active');
    }

    if (cartOverlay) {
      cartOverlay.classList.add('active');
    }

  }

  async function updateCartDrawer() {

    try {

      const response = await fetch('/cart.js');

      const cart = await response.json();

      const cartContent = document.getElementById('bynoxCartContent');

      const cartTotal = document.querySelector('.bynox-cart-total span');

      if (!cartContent) return;

      if (cart.item_count === 0) {

        cartContent.innerHTML = `
          <div class="bynox-empty-cart">
            Tu carrito está vacío.
          </div>
        `;

      } else {

        cartContent.innerHTML = cart.items.map((item) => `

          <div class="bynox-cart-item">

  <img
    src="${item.image}"
    alt="${item.product_title}"
  >

  <div class="bynox-cart-item-info">

    <h3>${item.product_title}</h3>

    <div class="bynox-cart-price">
      $${(item.final_price / 100).toFixed(2)}
    </div>

    <div class="bynox-cart-controls">

      <div class="bynox-cart-qty-controls">

        <button
          onclick="bynoxUpdateQuantity(${item.variant_id}, ${item.quantity - 1})"
        >
          −
        </button>

        <span>${item.quantity}</span>

        <button
          onclick="bynoxUpdateQuantity(${item.variant_id}, ${item.quantity + 1})"
        >
          +
        </button>

      </div>

      <button
        class="bynox-remove-item"
        onclick="bynoxRemoveItem(${item.variant_id})"
      >
        Eliminar
      </button>

    </div>

  </div>

</div>

        `).join('');

      }

      if (cartTotal) {

        cartTotal.innerHTML = `$${(cart.total_price / 100).toFixed(2)}`;

      }

      if (cartCount) {

        cartCount.innerHTML = cart.item_count;
      }

    } catch(error) {

      console.error(error);

    }

  }

productForms.forEach((form) => {

  if (!(form instanceof HTMLFormElement)) return;

    form.addEventListener('submit', async (event) => {

      event.preventDefault();

      const formData = new FormData(form);

      try {

        await fetch('/cart/add.js', {
          method: 'POST',
          body: formData
        });

        await updateCartDrawer();

        openCartDrawer();

      } catch(error) {

        console.error(error);

      }

    });

  });

});

async function bynoxUpdateQuantity(variantId, quantity) {

  if (quantity < 1) {
    bynoxRemoveItem(variantId);
    return;
  }

  await fetch('/cart/change.js', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      id: variantId,
      quantity
    })
  });

  location.reload();

}

async function bynoxRemoveItem(variantId) {

  await fetch('/cart/change.js', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      id: variantId,
      quantity: 0
    })
  });

  location.reload();

}