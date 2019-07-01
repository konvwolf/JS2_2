const image = "https://placeimg.com/200/150/any";
const cartImage = "https://placeimg.com/100/80/any";

const items = ['Notebook', 'Display', 'Keyboard', 'Mouse', 'Phones', 'Router', 'USB-camera', 'Gamepad'];
const prices = [1000, 200, 20, 10, 25, 30, 18, 24];
const ids = [1, 2, 3, 4, 5, 6, 7, 8];
const userCart = [];

function fetchData() {
	let arr = [];
	for (let i = 0; i < items.length; i++) {
		arr.push({
			title: items[i],
			price: prices[i],
			img: image,
			id: ids[i]
		});
	}
	return arr
}

class ProductList {
	constructor() {
		this.products = []
		this._init()
	}
	_init() {
		this.fetchProducts()
		this.render()
	}
	fetchProducts() {
		this.products = fetchData()
	}
	render() {
		const block = document.querySelector('.products')
		this.products.forEach(product => {
			const prod = new Product(product)
			block.insertAdjacentHTML('beforeend', prod.render())
		})
	}
}

class Product {
	constructor(product) {
		this.title = product.title
		this.price = product.price
		this.img = product.img
		this.productID = product.id
	}
	render() {
		return `<div class="product-item">
                        <img src="${this.img}" alt="Some img">
                        <div class="desc">
                            <h3>${this.title}</h3>
                            <p>${this.price} $</p>
                            <button class="buy-btn" 
                            data-name="${this.title}"
                            data-image="${this.img}"
							data-price="${this.price}"
							data-id="${this.productID}">Купить</button>
                        </div>
					</div>`
	}
}

class Listeners {
	constructor() {
		this.allProducts = document.querySelector('.products')
		this.cart = document.querySelector('.btn-cart')
		this.cartBody = document.querySelector('.cart-block')
		this._init()
	}

	_init() {
		this.listenerForCart();
		this.listenerForCartBody();
		this.listenerForDelButton()
	}

	listenerForCart() {
		this.allProducts.addEventListener('click', (evt) => {
			if (evt.target.classList.contains('buy-btn')) {
				let add = new CartProducts(evt.target)
			}
		})
	}

	listenerForCartBody() {
		this.cart.addEventListener('click', () => {
			document.querySelector('.cart-block').classList.toggle('invisible')
		})
	}

	TODO:listenerForDelButton() {
		this.cartBody.addEventListener('click', (evt) => {
			if (evt.target.classList.contains('del-btn')) {
				let remove = new CartProducts(evt.target)
				console.log(evt.target)
			}
		})
	}
}

//CART

class CartProducts {
	constructor(event) {
		this.find = userCart.find(element => element.id === event.dataset['id'])
		this._init(event)
	}

	_init(event) {
		this.addProductToCart(event)
	}

	addProductToCart(event) {
		if (!this.find) {
			userCart.push({
				name: event.dataset['name'],
				id: event.dataset['id'],
				img: cartImage,
				price: +event.dataset['price'],
				quantity: 1
			})
		} else {
			this.find.quantity++
		}

		this.render()
	}

	TODO:deleteProductFromCart(delButton) {
		if (this.find.id === delButton.dataset['id'] && this.find.quantity > 1) {
			this.find.quantity--
		} else {
			userCart.splice(userCart.indexOf(this.find), 1);
			document.querySelector(`.cart-item[data-id="${delButton.dataset['id']}"]`).remove();
		}
		this.render()
	}

	render() {
		this.cartList = new Cart();
		document.querySelector('.cart-block').innerHTML = this.cartList.render()
	}
}

class Cart {
	constructor() {
		this.allProducts = '';
		this.totalPrice = 0;
	}

	render() {
		for (this.item of userCart) {
			this.allProducts += `<div class="cart-item" data-id="${this.item.id}">
                            <div class="product-bio">
                                <img src="${this.item.img}" alt="Some image">
                                <div class="product-desc">
                                    <p class="product-title">${this.item.name}</p>
                                    <p class="product-quantity">Quantity: ${this.item.quantity}</p>
                                    <p class="product-single-price">$${this.item.price} each</p>
                                </div>
                            </div>
                            <div class="right-block">
                                <p class="product-price">${this.item.quantity * this.item.price}</p>
                                <button class="del-btn" data-id="${this.item.id}">&times;</button>
                            </div>
						</div>`
			this.totalPrice += this.item.quantity * this.item.price;
		}

		this.cartTotals = `<div class="cart-totals">
							<div class="cart-total-sign">Your totals:</div>
							<div class="cart-total-price">$ ${this.totalPrice}</div>
							</div>`;

		return this.allProducts + this.cartTotals
	}
}

let productList = new ProductList();
let listenToClicks = new Listeners();