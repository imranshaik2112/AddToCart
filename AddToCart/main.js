let content = document.querySelector(".content");
let cartBtn = document.querySelector(".btn");

let basket = JSON.parse(localStorage.getItem("data")) || [];

async function fetchData() {
  let res = await fetch("https://fakestoreapi.com/products");

  let data = await res.json();

  console.log(data);

  content.innerHTML = data
    .map((item) => {
      let { id, image, title, description, price } = item;
      let search = basket.find((y) => y.id === id) || [];
      return `<div class="card" style="width: 18rem" id=product-id-${id}>
        <img
          src="${image}"
          class="card-img-top"
          alt="jacket"
          height="200px"
        />
        <div class="card-body">
          <h5 class="card-title">${title.slice(0, 20)}</h5>
          <p class="card-text">
            ${description.slice(0, 60)}
          </p>
          <p class="price">Price :$${price}</p>
          <i onclick="decrement(${id})" class="bi bi-dash-lg"></i>
          <span id=${id} class="item">${
        search.item === undefined ? 0 : search.item
      }</span>
          <i onclick="increment(${id})" class="bi bi-plus-lg"></i>
          <a href="#" class="btn btn-warning" onclick="buyNow(${id})">Buy Now</a>
        </div>
      </div>`;
    })
    .join("");
}
fetchData();

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
  console.log(basket);
  update(searchItem);
  localStorage.setItem("data", JSON.stringify(basket));
}
function decrement(id) {
  let searchItem = id;
  let search = basket.find((x) => x.id === searchItem);
  if (search === undefined) {
    return;
  } else if (search.item === 0) {
    return;
  } else {
    search.item -= 1;
  }
  console.log(basket);
  update(searchItem);
  basket = basket.filter((x) => x.item !== 0);
  console.log(basket);
  localStorage.setItem("data", JSON.stringify(basket));
}

function update(id) {
  let search = basket.find((x) => x.id === id);
  document.getElementById(id).textContent = search.item;
  calculate();
}

let calculate = () => {
  let carAmount = document.getElementById("carAmount");
  carAmount.innerHTML = basket.map((x) => x.item).reduce((x, y) => x + y, 0);
};

calculate();


let buyNow=(id)=>{
  alert("successfully buyed",id)
  console.log(id);
}
