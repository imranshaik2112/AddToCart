let label = document.getElementById("label");
let shoppingCart = document.getElementById("shopping-cart");

let basket = JSON.parse(localStorage.getItem("data")) || [];

let calculate = () => {
  let carAmount = document.getElementById("carAmount");
  carAmount.innerHTML = basket.map((x) => x.item).reduce((x, y) => x + y, 0);
};

calculate();

let fetchedData = [];

async function fetchData() {
  let res = await fetch("https://fakestoreapi.com/products");
  fetchedData = await res.json();
}

fetchData().then(() => {
  generateCartItems();
  totalAmount();
});

let generateCartItems = () => {
  if (basket.length !== 0) {
    return (shoppingCart.innerHTML = basket
      .map((x) => {
        let { id, item } = x;
        let search = fetchedData.find((y) => y.id === id);
        if (search) {
          return `
            <div class="cart-item flex">
            <i class="bi bi-x" onclick=remove(${id})></i>
              <img src="${search.image}"/>
              <div class=cart-details>
                  <h2 class="cart-title">${search.title.slice(0, 20)}</h2>
                  <p class="price">Price :$${search.price}</p>
                  <div>
                  <i onclick="decrement(${id})" class="bi bi-dash-lg"></i>
                  <span id=${id} class="item">${item}</span>
                  <i onclick="increment(${id})" class="bi bi-plus-lg"></i>
                  </div>
                  <h3>Total Price $${item * search.price}</h3>
              </div>
            </div>
          `;
        } else {
          return "";
        }
      })
      .join(""));
  } else {
    shoppingCart.innerHTML = ``;
    label.innerHTML = `
      <h2>Cart Is Empty</h2>
      <a href="index.html">
        <button class="home-btn">Back To Home</button>
      </a>`;
  }
};

function increment(id) {
  let searchItem = id;
  let search = basket.find((x) => x.id === searchItem);
  if (search === undefined) {
    basket.push({
      id: id,
      item: 1,
    });
  } else {
    search.item += 1;
  }
  generateCartItems();
  update(searchItem);
  localStorage.setItem("data", JSON.stringify(basket));
}
function decrement(id) {
  let searchItem = id;
  let search = basket.find((x) => x.id === searchItem) || [];
  if (search === undefined) {
    return;
  } else if (search.item === 0) {
    return;
  } else {
    search.item -= 1;
  }
  // console.log(basket);
  update(searchItem);
  basket = basket.filter((x) => x.item !== 0);
  generateCartItems();
  localStorage.setItem("data", JSON.stringify(basket));
}

function update(id) {
  let search = basket.find((x) => x.id === id);
  document.getElementById(id).textContent = search.item;
  calculate();
}

let remove = (id) => {
  let selectedItem = id;
  basket = basket.filter((x) => x.id !== selectedItem);
  calculate();
  generateCartItems();
  totalAmount();
  localStorage.setItem("data", JSON.stringify(basket));
};

let totalAmount = () => {
  if (basket.length !== 0) {
    let amount = basket
      .map((x) => {
        let { item, id } = x;
        let search = fetchedData.find((x) => x.id === id) || [];
        return search.price * item;
      })
      .reduce((x, y) => x + y, 0);
    return (label.innerHTML = `
      <h2>Total Bill :<span class="totalAmount"> $${amount.toFixed(
        2
      )}</span></h2>
      <div class="btns">
      <button class="checkout">checkout</button>
      <button class="removeAll" onclick="clearCart()">clearCart</button>
      </div>
      `);
  } else {
    return;
  }
};

totalAmount();

let clearCart = () => {
  basket = [];
  generateCartItems();
  calculate();
  localStorage.setItem("data", JSON.stringify(basket));
};
