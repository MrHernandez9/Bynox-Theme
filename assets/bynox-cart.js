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

      const submitBtn = form.querySelector('[type="submit"]');
      const originalLabel = submitBtn ? submitBtn.textContent : null;

      if (submitBtn) {
        submitBtn.textContent = 'Agregando...';
        submitBtn.disabled = true;
      }

      const formData = new FormData(form);

      try {

        const addResponse = await fetch('/cart/add.js', {
          method: 'POST',
          body: formData
        });

        if (!addResponse.ok) {
          const err = await addResponse.json().catch(() => ({}));
          console.error('Cart add error:', err.description || addResponse.status);
          if (submitBtn) {
            submitBtn.textContent = err.description || 'Error al agregar';
            submitBtn.disabled = false;
            setTimeout(() => { submitBtn.textContent = originalLabel; }, 2500);
          }
          return;
        }

        await updateCartDrawer();

        openCartDrawer();

      } catch(error) {

        console.error(error);

      } finally {

        if (submitBtn && submitBtn.disabled) {
          submitBtn.textContent = originalLabel;
          submitBtn.disabled = false;
        }

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
window.bynoxIncreaseQty = function() {

  const input = document.getElementById('bynoxQtyInput');

  if (!input) return;

  input.value = parseInt(input.value || 1) + 1;

}

window.bynoxDecreaseQty = function() {

  const input = document.getElementById('bynoxQtyInput');

  if (!input) return;

  const current = parseInt(input.value || 1);

  if (current > 1) {
    input.value = current - 1;
  }

}