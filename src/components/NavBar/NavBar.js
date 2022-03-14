import { Component } from "react";
import { ApolloClient, InMemoryCache, gql } from "@apollo/client";
import {Link} from 'react-router-dom'
import Logo from "./Logo.svg";
import Arrow from "./Arrow.svg";
import Basket from "./Basket.svg";
import store from "../../store";
import { activeChangingValue } from "./changingValueSlice";
import {incCounter, decCounter, removeBasket} from '../Product/ProductSlice'
import "./NavBar.scss";

const client = new ApolloClient({
  uri: "http://localhost:4000",
  cache: new InMemoryCache(),
});

class NavBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      categories: [],
      activeBtn: 0,
      currencies: [],
      activeCurrency: "$",
      showCurrencyList: false,
      showBag: false,
      basketItems: [],
      numberOfActiveCurrency: 0
    };
    this.dispatch = store.dispatch
  }


  componentDidMount() {
    this.getCategories();
    this.getCurrencies();
    this.unsubscribe = store.subscribe(() => {
      this.setState({
        basketItems: store.getState().addBasket.basket,
        numberOfActiveCurrency: store.getState().changingValue.activeCurrency
      })
    })
  }

  componentDidUpdate(){
    console.log(store.getState().addBasket.basket)
    this.getTotalPrice()
  }

  componentWillUnmount(){
    this.unsubscribe()
  }

  getCategories() {
    client
      .query({
        query: gql`
          query nameCategories {
            categories {
              name
            }
          }
        `,
      })
      .then((res) => this.setState({ categories: res.data.categories }));
  }

  getCurrencies() {
    client
      .query({
        query: gql`
          query currencies {
            currencies {
              label
              symbol
            }
          }
        `,
      })
      .then((res) => this.setState({ currencies: res.data.currencies }));
  }

  changeCurrency(item, i) {
    this.setState({
      showCurrencyList: !this.state.showCurrencyList,
      activeCurrency: item,
    });
    this.dispatch(activeChangingValue(i))
  }

  showBag(){
    this.setState({showBag: !this.state.showBag})
    !this.state.showBag ? document.body.style.overflow = 'hidden' : document.body.style.overflow = 'scroll'
  }

  getSize(i, j) {
    if(this.state.basketItems[i].size[j].id === 'Color'){
      return null
    } else {
      return this.state.basketItems[i].size[j].items[this.state.basketItems[i].activeSizes[j]].value
    }
  }

  getColor(i, j) {
    if(this.state.basketItems[i].size[j].id === 'Color') {
      return this.state.basketItems[i].size[j].items[this.state.basketItems[i].activeSizes[j]].value
    }
  }

  getCounter(i) {
    return store.getState().addBasket.basket[i]?.counter
  }

  getPrice(basketItem){
    return basketItem.price[this.state.numberOfActiveCurrency].currency.symbol + basketItem.price[this.state.numberOfActiveCurrency].amount
  }

  getTotalPrice(){
    let totalPrice = 0
    let totalPriceSymbol = ''

    store.getState().addBasket.basket.forEach((item) => {
      totalPrice += item.price[store.getState().changingValue.activeCurrency].amount * item.counter
      totalPriceSymbol = item.price[store.getState().changingValue.activeCurrency].currency.symbol
    })

    return totalPriceSymbol + Math.floor(totalPrice)
  }

  getLengthBasket(){
    return store.getState().addBasket.basket.length
  }

  getStyleLengthBasket() {
    return this.getLengthBasket() ? {background: 'black'} : {background: 'transparent'}
  }

  removeCartItem(i){
    if(this.state.basketItems[i].counter < 2) {
        this.dispatch(removeBasket({id: this.state.basketItems[i].id}))
    } else {
        this.dispatch(decCounter(i))
    }
}

  render() {

    return (
      <>
        <nav className="active-basket">
          <div className="categories">
            {this.state.categories.map((item, i) => {
              return (
                <Link key={i} to={i === 0 ? '/' : i === 1 ? '/clothes' : '/tech'}>
                  <div
                    onClick={() => this.setState({ activeBtn: i })}
                    key={i}
                    className={`categories-item ${
                      this.state.activeBtn === i ? "categories-item-active" : null
                    }`}
                  >
                    {item.name}
                  </div>
                </Link>
              );
            })}
          </div>

          <div className="logo">
            <button>
              <img src={Logo} alt="logo" />
            </button>
          </div>
          <div className="currency">
            <button
              onClick={() =>
                this.setState({ showCurrencyList: !this.state.showCurrencyList })
              }
              className="currency-btn"
            >
              <div className="currency-value">{this.state.activeCurrency}</div>
              <div className="currency-arrow">
                <img src={Arrow} alt="Arrow" />
              </div>
            </button>
            <ul
              className={`currency-list ${
                this.state.showCurrencyList ? "active-currency-list" : null
              }`}
            >
              {this.state.currencies.map((item, i) => {
                return (
                  <li
                    onClick={() => {
                      this.changeCurrency(item.symbol, i);
                    }}
                    key={i}
                    className="currency-list-item"
                  >
                    {item.symbol + ` ${item.label}`}
                  </li>
                );
              })}
            </ul>
          </div>
          
          <div className="basket">
            <button onClick={() => this.showBag()} className="basket-btn">
              <img src={Basket} alt="Basket" />
              <div style={this.getStyleLengthBasket()} className="basket-counter">
                {this.getLengthBasket() || null}
              </div>
            </button>
            <div className={`my-bag ${this.state.showBag ? 'active-my-bag': null}`}>
              <div className="my-bag-counter">My Bag, 
              <span>
                {this.getLengthBasket()} items
              </span>
              </div>
              {this.state.basketItems.map((basketItem, i) => {
                if (i > 2) {
                  return null
                } else {
                  return (
                    <div key={i} className="bag-item">
                      <div className="bag-item-info">
                        <div className="bag-item-brand">
                          {basketItem.brand}
                        </div>
                        <div className="bag-item-name">
                          {basketItem.name}
                        </div>
                        <div className="bag-item-price">
                          {this.getPrice(basketItem)}
                        </div>
                        {this.state.basketItems[i].activeSizes.map((size, j) => {
                          if(size !== null) {
                            return (
                              <ul key={j} className="bag-item-sizes">
                                <li style={{background: this.getColor(i, j)}} className="bag-item-size">{this.getSize(i, j)}</li>
                              </ul>
                            )
                          }
                        })}
                      </div>
                      <div className="my-bag-items-btns">
                        <button onClick={() => this.dispatch(incCounter(i))} className="counter-inc">+</button>
                        <div className="counter">{this.getCounter(i)}</div>
                        <button onClick={() => this.removeCartItem(i)} className="counter-dec">-</button>
                      </div>
                      <div className="bag-item-photo">
                        <img src={basketItem.photo} alt="bagItemPhoto" />
                      </div>
                    </div>
                  )
                }
              })}
              <div className="total-price">
                  Total
                  <span>{this.getTotalPrice()}</span>
                </div>
                <div className="total-basket-btns">
                <Link to='/cart'><button onClick={() => this.showBag()} className="total-basket-btn">
                  View bag
                </button>
                </Link>
                  <button className="total-basket-btn check-out">check out</button>
                </div>
            </div>
          </div>
        </nav>
        {this.state.showBag ? <div onClick={() => this.showBag()} className="pop-up"></div>: null}
      </>
    );
  }
}

export default NavBar;
