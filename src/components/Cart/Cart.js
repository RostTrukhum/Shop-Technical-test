import { Component } from "react";
import {incCounter, decCounter, removeBasket} from '../Product/ProductSlice'
import store from "../../store";
import './Cart.scss'

class Cart extends Component {
    constructor(props) {
        super(props)
        this.state = {
            cartItems: [],
            numberOfActiveCurrency: 0
        }

        this.dispatch = store.dispatch
    }

    componentDidMount(){
        this.setState({
            cartItems: store.getState().addBasket.basket,
            numberOfActiveCurrency: store.getState().changingValue.activeCurrency
        })
        this.unsubscribe = store.subscribe(() => {
            this.setState({
              cartItems: store.getState().addBasket.basket,
              numberOfActiveCurrency: store.getState().changingValue.activeCurrency
            })
          })
    }

    componentWillUnmount(){
        this.unsubscribe()
    }

    getSize(i, j) {
        if(this.state.cartItems[i].size[j].id === 'Color'){
          return null
        } else {
          return this.state.cartItems[i].size[j].items[this.state.cartItems[i].activeSizes[j]].value
        }
      }
    
    getColor(i, j) {
        if(this.state.cartItems[i].size[j].id === 'Color') {
            return this.state.cartItems[i].size[j].items[this.state.cartItems[i].activeSizes[j]].value
        }
    }
    getCounter(i) {
        return store.getState().addBasket.basket[i]?.counter
    }

    getPrice(cartItem){
        return cartItem.price[this.state.numberOfActiveCurrency].currency.symbol + cartItem.price[this.state.numberOfActiveCurrency].amount
    }

    removeCartItem(i){
        if(this.state.cartItems[i].counter < 2) {
            this.dispatch(removeBasket({id: this.state.cartItems[i].id}))
        } else {
            this.dispatch(decCounter(i))
        }
    }

    render() {
        return (
            <div className="cart">
                <div className="cart-header">Cart</div>
                <div className="cart-items">
                    {this.state.cartItems.map((item, i) => {
                        return (
                            <>
                                <hr />
                                <div key={i} className="cart-item">
                                    <div className="cart-item-info">
                                        <div className="cart-item-brand">
                                            {item.brand}
                                        </div>
                                        <div className="cart-item-name">
                                            {item.name}
                                        </div>
                                        <div className="cart-item-price">
                                            {this.getPrice(item)}
                                        </div>
                                        {item.activeSizes.map((size, j) => {
                                        if(size !== null) {
                                            return (
                                            <ul key={j} className="cart-item-sizes">
                                                <li style={{background: this.getColor(i, j)}} className="cart-item-size">{this.getSize(i, j)}</li>
                                            </ul>
                                            )
                                        }
                                        })}
                                        </div>
                                    <div className="cart-item-btns">
                                        <button onClick={() => this.dispatch(incCounter(i))} className="cart-item-counter-inc">+</button>
                                        <div className="cart-item-counter">{this.getCounter(i)}</div>
                                        <button onClick={() => this.removeCartItem(i)} className="cart-item-counter-dec">-</button>
                                    </div>
                                    <div className="cart-item-photo">
                                        <img src={item.photo} alt="cart item photo" />
                                    </div>
                                </div>
                            </>
                        )
                    })}
                </div>
            </div>
        )
    }

}

export default Cart