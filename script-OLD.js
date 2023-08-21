document.querySelector(".plus").addEventListener("click", changeQuantity);
document.querySelector(".minus").addEventListener("click", changeQuantity);

document.getElementById("addToCart").addEventListener("click", addToCart);

const getQuantity = () => {
  return parseInt(document.querySelector(".input-quantity").value);
};

const setQuantity = (quantity) => {
  document.querySelector(".input-quantity").value = quantity;
  setPrice(quantity);
};

const getCartQuantity = () => {
  return parseInt(document.getElementById("cartQty").dataset.value);
};

const incrementCartQuantity = (n) => {
  n = parseInt(n);
  if (!n) {
    n = 0;
  }
  const newQuantity = getCartQuantity() + n;
  document.getElementById("cartQty").dataset.value = newQuantity;
  persistCart(newQuantity);
};

function addToCart() {
  const quantity = getQuantity();
  incrementCartQuantity(quantity);
  // cart.style.display = cartQty > 0 ? "inline-block" : "none"; fix this bug
  // cart.style.display = cartQty > 0 ? "block" : "none";
  if (quantity > 0) {
    displayToast();
    cartAlert.style.display = "none";
    return;
  }
  // display error when user adds qty = 0
  cartAlert.style.display = "block";
}

let displayToast = () => {
  const toast = document.getElementById("toast");
  toast.style.display = "flex";
  let toastMsg = document.getElementById("toastMsg");
  if (getQuantity() > 1) {
    toastMsg.innerText = `${getQuantity()} ITEMS ADDED TO CART!`;
  }
  setTimeout(() => {
    toast.style.display = "none";
  }, 5000);
};

let cartAlert = document.getElementById("cartAlert");

/* TODO 
1. once error message pops up for no items added it needs to disappear when item does get added ***
2. toast pop up needs to disappear after a set time or be able to click out immediately with an x in the corner and have a fade out transition animation.
3.clean up code and make sure its reusable 
*/

// 1. Discount price by 35% if customer has three or more items ***
// 2. Add the item to the cart when the customer clicks 'Add to Cart' ***
// 3. If there are 0 items in the cart, display an error message below
//  the button that says, 'You must select at least one item.'
//  Remove the error when the customer corrects the problem.***
// 4. Display a message in the bottom right corner that tells the customer
//  the product was added to their cart. The message should have an 'x' for
//  the customer to dismiss (close) the message. Otherwise it should
//  fade out after 5 seconds automatically.***
// 5. Persist the number of items in the customer's cart so that if
//  they leave the site and come back, the items are still showing
//  in their cart. (You'll need to read the chapter on local storage)

// let info = prompt("what is your name");
function persistCart(n) {
  localStorage.setItem("x", n);
}

function changeQuantity(e) {
  let qty = getQuantity();
  const plus = e.srcElement.classList.contains("plus");
  if (plus) {
    // q.increment(1);
    qty++;
  } else if (qty > 0) {
    // q.decrement(1);
    qty--;
  }
  setQuantity(qty);
}

const unitPrice = 7;
const priceEl = document.getElementById("price");
const msrpEl = document.getElementById("msrp");
const setPrice = (quantity) => {
  const msrp = quantity * unitPrice;
  let price = msrp;
  if (isDiscounted(quantity)) {
    price = unitPrice * quantity * 0.65;
  }

  priceEl.innerText = formatter.format(price);
  msrpEl.innerText = formatter.format(msrp);
  msrpEl.style.display = isDiscounted(quantity) ? "block" : "none";
};

const isDiscounted = (quantity) => {
  return quantity >= 3;
};

const formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

// when page loads, set quantity = 3
setQuantity(3);
document.getElementById("closeButton").addEventListener("click", () => {
  this.parentNode.display = "none";
});

// cartStorage();
incrementCartQuantity(localStorage.getItem("x"));
// document.location.reload(localStorage.clear("x"));

class Quantity {
  qty = 0;
  constructor(key) {
    this.key = key;
    if (this.key) {
      const initialValue = parseInt(localStorage.getItem(this.key) || "0");
      this.set(initialValue);
    }
  }

  increment(n) {
    n = parseInt(n);
    if (n) {
      this.set(this.qty + n);
    }
    return this.get();
  }

  decrement(n) {
    n = parseInt(n);

    if (n) {
      this.set(this.qty - n);
      let newQty = this.qty - n;
      if (newQty < 0) {
        newQty = 0;
      }
      this.set(newQty);
    }
    return this.get();
  }

  set(n) {
    n = parseInt(n);
    if (n) {
      this.qty = n;
      if (this.key) {
        localStorage.setItem(this.key, this.get());
      }
    }
    return this.get();
  }

  get() {
    return this.qty;
  }
}

// Create a Controls class to handle the logic for managing your +/- controls in the form.
//
// Functionality:
// (1) When the page loads, set the starting quantity to 1
// (2) When the user clicks on +, increment the qty by 1 and update the form input to the new value
// (3) When the user clicks on -, decrement the qty by 1 and update the form input to the new value
// 
// Constraints:
// (1) It uses the Quantity class for storing the current quantity and all logic to change the quantity
// (2) It does not use local storage
// (3) It takes the node for the form input as an argument. The class handles ALL writes to update the form input internally.

class cart {
  constructor(price) {
    this.price = price;
  }
}

// console.log(practice.increment(3));

// const plus = e.srcElement.classList.contains("plus");
// if (plus) {
//   qty++;
// } else if (qty > 0) {
//   qty--;
// }
let input = parseInt(document.querySelector(".input-quantity").value);
let q = new Quantity(input);
// q.persistCart();
q.increment();

// console.log(changeQuantity());
