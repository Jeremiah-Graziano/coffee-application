const Menu = class {
    addOns = {
        flavors: [
            {
                flavor: 'vanilla',
                display: 'Vanilla',
                price: 50
            },
            {
                flavor: 'caramel',
                display: 'Caramel',
                price: 65
            },

            {
                flavor: 'hazelnut',
                display: 'Hazelnut',
                price: 50
            },

            {
                flavor: 'white-chocolate',
                display: 'White chocolate',
                price: 50
            },
        ],
        shot: 100,
        milk: {
            whole: 0,
            soy: 100,
            oat: 75,
            almond: 100
        }
    };

    products = [
        {
            id: 'latte',
            name: 'Latte',
            description: 'Quality latte with locally sourced beans.',
            types: ['hot', 'iced'], 
            sizes: [
                {
                    size: 'small',
                    price: 450,
                    shots: 1,
                    milk: 'whole'
                },
                {
                    size: 'medium',
                    price: 485,
                    shots: 2,
                    milk: 'whole'
                },
                {
                    size: 'large',
                    price: 500,
                    shots: 2,
                    milk: 'whole'
                },
            ]
        },
        {
            id: 'mocha',
            name: 'Mocha',
            description: 'Quality latte with locally sourced beans.',
            types: ['hot', 'iced'], 
            sizes: [
                {
                    size: 'small',
                    price: 450,
                    shots: 1,
                    milk: 'whole'
                },
                {
                    size: 'medium',
                    price: 485,
                    shots: 2,
                    milk: 'whole'
                },
                {
                    size: 'large',
                    price: 500,
                    shots: 2,
                    milk: 'whole'
                },
            ],
        },
        {
            id: 'carmel-machiatto',
            name: 'Carmel Machiatto',
            description: 'Quality latte with locally sourced beans.',
            types: ['hot', 'iced'], 
            sizes: [
                {
                    size: 'small',
                    flavors: ['caramel', 'vanilla'],
                    price: 450,
                    shots: 1,
                    milk: 'whole'
                },
                {
                    size: 'medium',
                    flavors: ['caramel', 'vanilla'],
                    price: 485,
                    shots: 2,
                    milk: 'whole'
                },
                {
                    size: 'large',
                    flavors: ['caramel', 'vanilla'],
                    price: 500,
                    shots: 2,
                    milk: 'whole'
                },
            ],
        },
        {
            id: 'doppio',
            name: 'Doppio',
            description: 'Quality latte with locally sourced beans.',
            types: ['hot'], 
            sizes: [
                {
                    size: 'small',
                    price: 450,
                    shots: 1,
                },
            ]
        },
        {
            id: 'frappe',
            name: 'Frappuccino',
            description: 'Quality latte with locally sourced beans.',
            types: ['iced'], 
            sizes: [
                {
                    size: 'small',
                    price: 450,
                    shots: 1,
                },
            ]
        },
    ];

    findMany(type, size) {
        return this.products
            .filter((product) => product.types.includes(type))
            .filter((product) => product.sizes.find((size) => size.size == size))
            .map((product) => product.name)
            .map((name) => name.toUpperCase());
    }

    get(id) {
       return this.products.find((product) => product.id === id);
    };

    // Criteria is an optional object.
    // It contains optional properties for 1) type (hot or iced);
    // {type: 'hot'}
    // {type: 'iced'}
    find(criteria) {
        if (!criteria || typeof criteria !== 'object' || !criteria.hasOwnProperty('type') || criteria.type === 'all') {
            return this.products;
        }
        
        return this.products.filter(product => product.types.includes(criteria.type));
    };
};

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
    if (typeof n === "number") {
      this.set(this.qty + n);
    }
    return this.get();
  }

  decrement(n) {
    n = parseInt(n);
    if (typeof n === "number") {
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
    if (typeof n === "number") {
      this.qty = n;
      if (this.key) {
        localStorage.setItem(this.key, this.qty);
      }
    }
    return this.get();
  }

  get() {
    return this.qty;
  }
}

class Controls {
  constructor(qty, node) {
    this.qty = qty;
    this.node = node;

    // Synchronize the counter and display to 1 during initialization.
    if (this.qty.get() === 0) {
      this.qty.set(1);
    }

    this.set(this.qty.get());
  }

  increment() {
    const v = this.qty.increment(1);
    this.node.value = v;
  }

  decrement() {
    const v = this.qty.decrement(1);
    this.node.value = v;
  }

  set(n) {
    const v = this.qty.set(n);
    this.node.value = v;
  }
}

class Cart {
  // the products held in the cart
  products = [];

  constructor() {
    const savedProducts = localStorage.getItem('cart') || '[]';
    this.products = JSON.parse(savedProducts);
  }

  addProduct(name, qty, shots, flavors, size, price) {
    this.products.push({
        name,
        qty,
        shots,
        flavors,
        size,
        price
    });
    this.save();
  }

  removeProduct(index) {
    this.products = this.products.filter((_, i) => index !== i);
    this.save();
  }

  // Empties the shopping cart
  empty() {
    this.products = [];
    this.save();
  }

  // Returns the sum quantity of all products in the cart.
  getQuantity() {
    return this.products.length;
  }

  getPrice() {
    return Object.values(this.products).reduce(
      (acc, product) => acc + parseFloat(product.price), 0);
  }

  addEventListeners(...events) {
    events.map((event) => this.listeners.push(event));
  }

  save() {
    localStorage.setItem('cart', JSON.stringify(this.products));
  }
};

const cart = new Cart;

const markActive = (items, active) => {
    items.forEach((node) => {
        if (!node.isEqualNode(active)) {
            node.classList.remove('active');
        } else {
            active.classList.add('active');
        }   
    });
};

const emptyChildren = (parent) => {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    };
};

// App config
const maxShots = 4;
const DEFAULT_SIZE = 'medium';

const menu = new Menu;
const buttons = document.querySelectorAll('button.filter');
buttons.forEach(button => {
    button.addEventListener('click', () => {
        const drinks = document.getElementById('drinks');
        emptyChildren(drinks);
        drinks.classList.add('justify-content-center');
        markActive(buttons, button);

        const products = menu.find({type: button.dataset.type});
        products.map((product) => {
            const li = document.createElement('li');
            li.innerText = product.name;
            li.classList.add('col-sm-4', 'col-md-4');
            li.addEventListener('click', () => {
                modal.show(product, menu)
                // emptyChildren(document.getElementById('cart-modal'));
            });
            drinks.appendChild(li);
        });
    });
});

document.querySelector("button[data-type='all']").click();

 const formatPrice = (price) => `$${(price/100).toFixed(2)}`;
    
const modal = {
    show: (product, menu, options) => {
        let defaultSize = product.sizes.find((size) => size.size === DEFAULT_SIZE);
        if (!defaultSize) {
            defaultSize = product.sizes[0];
        }

        options = options || {};
        options.size = options.size || defaultSize.size;
        options.shots = options.shots || defaultSize.shots;
        options.flavors = options.flavors || defaultSize.flavors || [];

        const modalOuter = document.getElementById('modal')
        modalOuter.style.display = 'block';
        const modalBody = document.getElementById('modal-body');
        modalBody.classList.remove('cart-modal');
        emptyChildren(modalBody);

        const img = document.createElement('img');
        img.setAttribute('src', './cup-coffee-vector_527939-124.avif');
        img.classList.add('product-img');
        modalBody.appendChild(img);
        
        const detail = document.createElement('div');
        detail.classList.add('product-detail');
        const h3 = document.createElement('h3');
        h3.innerText = product.name;
        const p = document.createElement('p');
        p.innerText = `Quality ${product.name} with locally sourced ingredients`;
        detail.appendChild(h3);
        detail.appendChild(p);
        modalBody.appendChild(detail);

        const adjustments = document.createElement('div');
        adjustments.classList.add('adjustments');
        const sizeHeader = document.createElement('h4');
        adjustments.appendChild(sizeHeader);
        const sizes = document.createElement('ul');
        sizes.classList.add('sizes');
        const flavorsList = document.createElement('ul');

        const sizeList = [];
        const syrupList = [];
        const hasDefaultSize = product.sizes.some((size) => size.size === DEFAULT_SIZE);
        product.sizes.forEach((size, index) => {
            const listItem = document.createElement('li');
            const img = document.createElement('img');
            img.classList.add('size-img')
            img.setAttribute('src', './images.png');
            const span = document.createElement('span');
            span.innerText = size.size;
            listItem.appendChild(img);
            listItem.appendChild(span);
            sizes.appendChild(listItem);
            sizeList.push(listItem);
            listItem.addEventListener('click', () => {
                options.size = size.size;
                return modal.show(product, menu, options);
            });

            if (size.size === options.size) {
                markActive(sizeList, listItem)
            }
        });

        menu.addOns.flavors.forEach(flavor => {
            flavorsList.classList.add('flavors');
            const flavorItem = document.createElement('li');
            syrupList.push(flavorItem);
            flavorItem.addEventListener('click', () => {
               flavorItem.classList.toggle('active');
               if (flavorItem.classList.contains('active')) {
                    options.flavors.push(flavor.flavor);
               } else {
                    options.flavors = options.flavors.filter(selectedFlavor => selectedFlavor !== flavor.flavor);
               }
               modal.show(product, menu, options);
            });
            flavorItem.innerText = flavor.display;
            flavorsList.appendChild(flavorItem);
            if (options.flavors.includes(flavor.flavor)) {
                flavorItem.classList.add('active');
            }
        });
  
        shotsArr = [];
        const shots = document.createElement('ul');
        shots.classList.add('flavors');
        shotqty = document.createElement('h4');
        shotqty.innerText = 'Shots';
        for (let i = 1; i <= maxShots; i++) { 
            const shot = document.createElement('li');
            shot.innerText = i;
            shot.addEventListener('click', () => {
                options.shots = i;
                modal.show(product, menu, options);
            });

            if (i === options.shots) {
                shot.classList.add('active');
            }

            shots.appendChild(shot);
            shotsArr.push(shot);
        };

        const flavorPrice = options.flavors.reduce((acc, flavor) => {
            return acc + menu.addOns.flavors.find(f => f.flavor === flavor).price
        }, 0);

        const shotPrice = options.shots * 50;
        const sizePrice = defaultSize.price;
        const productPrice = flavorPrice + shotPrice + sizePrice; 
        const formattedPrice = formatPrice(productPrice);
        console.log(flavorPrice, shotPrice, sizePrice);
        console.log(options.shots);
        console.log(options.flavors.join(' '));
        
        const priceBackground = document.createElement('div');
        const addToBag = document.createElement('button');
        priceBackground.classList.add('price-background');
        addToBag.classList.add('addToBag');
        addToBag.innerText = `Add to bag ${formattedPrice}`;
        addToBag.addEventListener('click', () => {
            cart.addProduct(product.name, 1, options.shots, options.flavors, options.size, productPrice);
            modal.hide();
        });
        priceBackground.appendChild(addToBag);

        const flavorTitle = document.createElement('h4');
        flavorTitle.innerText = 'Flavors';
        adjustments.appendChild(sizes);
        adjustments.appendChild(flavorTitle);
        adjustments.appendChild(flavorsList);
        adjustments.appendChild(shotqty);
        adjustments.appendChild(shots);
        adjustments.appendChild(priceBackground);
        modalBody.appendChild(adjustments); 
    },

    showCart: () => {
        const modalOuter = document.getElementById('modal');
        modalOuter.style.display = 'block';
        const modalBody = document.getElementById('modal-body');
        emptyChildren(modalBody);
        modalBody.classList.add('cart-modal');
        
        const cartList = document.createElement('ul');

        cart.products.forEach(product => {
            const cartItems = document.createElement('li');
            const drinkImg = document.createElement('img');
            drinkImg.setAttribute('src', './real latte.webp');
            drinkImg.setAttribute('id', 'cart-img');
            const drinkSizes = document.createElement('div');
            
            const size = document.createElement('p');
            size.innerText = product.size;
            const drink = document.createElement('p');
            drink.innerText = product.name;
            drinkSizes.appendChild(size);
            drinkSizes.appendChild(drink);
            
            const shotsFlavors = document.createElement('div');
            const shots = document.createElement('p');
            shots.innerText = product.shots;
            const flavors = document.createElement('p');
            flavors.innerText = product.flavors.join(' ');
            shotsFlavors.appendChild(shots);
            shotsFlavors.appendChild(flavors);
            
            const price = document.createElement('p');
            price.innerText = formatPrice(product.price);
            cartItems.appendChild(drinkImg);
            cartItems.appendChild(drinkSizes);
            cartItems.appendChild(shotsFlavors);
            cartItems.appendChild(price);
            cartList.appendChild(cartItems);
            modalBody.appendChild(cartList);
            modalOuter.appendChild(modalBody);
        });

        const cartTotal = document.createElement('div');
        const totalPrice = document.createElement('p');
        totalPrice.innerText = `Todays Total: ${formatPrice(cart.getPrice())}`;
        cartTotal.appendChild(totalPrice);
        modalBody.appendChild(cartTotal);

//         return Object.values(this.products).reduce(
//       (acc, product) => acc + product.qty.get(), 0);
    },
    hide: () => document.getElementById('modal').style.display = 'none'
};

document.getElementById('closeModal').addEventListener('click', modal.hide);
// document.getElementById('closeCartModal').addEventListener('click', modal.hide);
document.querySelector("button[data-type='bag']").addEventListener('click', modal.showCart);

document.addEventListener('keydown', (event) => {
    if (event.key === 'Esc' || event.key === 'Enter') {
        event.preventDefault();
        modal.hide();
    };
});

const sizes = document.querySelectorAll('.sizes');
sizes.forEach(e => e.addEventListener('click', () => {markActive(sizes, e)}));

document.addEventListener('visibilitychange', modal.showCart);


menu.products.map(product => console.log(product.sizes.map(size => size.shots)))

const practice = []
menu.products.forEach(product => practice.push(product.name))
console.log(practice)




