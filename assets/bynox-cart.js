// @ts-nocheck
document.addEventListener('DOMContentLoaded', () => {

  const productForms = document.querySelectorAll(
    'form[action="/cart/add"]'
  );

  const cartDrawer = document.getElementById('bynoxCartDrawer');

  const cartOverlay = document.getElementById('bynoxCartOverlay');

  const cartCount = document.getElementById('bynoxCartCount');

window.openCartDrawer = function() {

    if (cartDrawer) {
      cartDrawer.classList.add('active');
    }

    if (cartOverlay) {
      cartOverlay.classList.add('active');
    }

  }

  window.updateCartDrawer = async function() {

    try {

      const response = await fetch('/cart.js');

      const cart = await response.json();

const cartContent =
  document.getElementById('bynoxCartContent');

const cartTotal =
  document.querySelector('.bynox-cart-total span');

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
          onclick="bynoxUpdateQuantity('${item.key}', ${item.quantity - 1})"
        >
          −
        </button>

        <span>${item.quantity}</span>

        <button
          onclick="bynoxUpdateQuantity('${item.key}', ${item.quantity + 1})"
        >
          +
        </button>

      </div>

      <button
        class="bynox-remove-item"
        onclick="bynoxRemoveItem('${item.key}')"
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

window.bynoxUpdateQuantity = async function(itemKey, quantity) {

  if (quantity < 1) {
    await bynoxRemoveItem(itemKey);
    return;
  }

  try {

    await fetch('/cart/change.js', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id: itemKey,
        quantity: quantity
      })
    });

    await updateCartDrawer();

  } catch(error) {

    console.error(error);

  }

}

window.bynoxRemoveItem = async function(itemKey) {

  try {

    await fetch('/cart/change.js', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id: itemKey,
        quantity: 0
      })
    });

    await updateCartDrawer();

  } catch(error) {

    console.error(error);

  }

}