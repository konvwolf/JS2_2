const image = "https://placeimg.com/200/150/tech";
const cartImage = "https://placeimg.com/100/80/tech";
const items = ['Notebook', 'Display', 'Keyboard', 'Mouse', 'Phones', 'Router', 'USB-camera', 'Gamepad'];
const prices = [1000, 200, 20, 10, 25, 30, 18, 24];
const ids = [1, 2, 3, 4, 5, 6, 7, 8];
const userCart = [];

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
		for (let i = 0; i < items.length; i++) {
			this.products.push({
				title: items[i],
				price: prices[i],
				img: image,
				id: ids[i]
			});
		}
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

/**
 * Класс, вешающий обработчики событий на кнопки "Купить", "Корзина" и "х". Обработчики
 * на кнопках "Купить" и "х" вызывают класс @CartActions
 * @listenerForCart - обработчик событий на кнопку "Купить"
 * @listenerForCartBody - обработчик событий на кнопку "Корзина"
 * @listenerForDelButton - обработчик на кнопку "х" (удалить товар из корзины)
 *
 * @class Listeners
 */
class Listeners {
	constructor() {
		this.allProducts = document.querySelector('.products')
		this.cart = document.querySelector('.btn-cart')
		this.cartBody = document.querySelector('.cart-block')
		this._init()
	}

	_init() {
		this.listenerForCart()
		this.listenerForCartBody()
		this.listenerForDelButton()
	}

	listenerForCart() {
		this.allProducts.addEventListener('click', (evt) => {
			if (evt.target.classList.contains('buy-btn')) {
				let add = new CartActions(evt.target)
			}
		})
	}

	listenerForCartBody() {
		this.cart.addEventListener('click', () => {
			document.querySelector('.cart-block').classList.toggle('invisible')
		})
	}

	listenerForDelButton() {
		this.cartBody.addEventListener('click', (evt) => {
			if (evt.target.classList.contains('del-btn')) {
				let remove = new CartActions(evt.target)
			}
		})
	}
}

//CART

/**
 * Класс действий над корзиной: добавление товаров, подсчет количества, вывод нарастающего
 * итога. Переменная @buy используется для проверки, нажата ли кнопка "Купить", переменная
 * @delete - нажата ли кнопка "х" (удалить товар из корзины). Если buy возвращает true, то
 * вызывается метод @addProductToCart (добавляет товар в корзину и считает количество). Если
 * delete возвращает true, то вызывается метод @deleteProductFromCart (удалят товар из корзины
 * и пересчитывает количество). Метод @render вызывает класс @Cart
 *
 * @class CartActions
 */
class CartActions {
	constructor(event) {
		this.find = userCart.find(element => element.id === event.dataset['id'])
		this.buy = event.classList.contains('buy-btn')
		this.delete = event.classList.contains('del-btn')
		this._init(event)
	}

	_init(event) {
		if (this.buy) {
			this.addProductToCart(event)
		}

		if (this.delete) {
			this.deleteProductFromCart(event)
		}
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

	deleteProductFromCart(event) {
		if (this.find.quantity > 1) {
			this.find.quantity--
		} else {
			userCart.splice(userCart.indexOf(this.find), 1)
			document.querySelector(`.cart-item[data-id="${event.dataset['id']}"]`).remove()
		}
		this.render()
	}

	render() {
		this.cartList = new Cart()
		document.querySelector('.cart-block').innerHTML = this.cartList.render()
	}
}

/**
 * Класс отрисовывает корзину с товарами, считает подитог по каждому добавленному товару
 * и нарастающий итог 
 *
 * @class Cart
 */
class Cart {
	constructor() {
		this.allProducts = ''
		this.totalPrice = 0
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
									<p class="product-price">Subtotal: $ ${this.item.quantity * this.item.price}</p>
                                </div>
                            </div>
                            <div class="right-block">
                                <button class="del-btn" data-id="${this.item.id}">&times;</button>
                            </div>
						</div>`
			this.totalPrice += this.item.quantity * this.item.price;
		}

		this.cartTotals = `<div class="cart-totals">
							<div class="cart-total-sign">Total:</div>
							<div class="cart-total-price">$ ${this.totalPrice}</div>
							</div>`;

		return this.allProducts + this.cartTotals
	}
}

let productList = new ProductList();
let listenToClicks = new Listeners();