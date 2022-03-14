import { Component } from "react";
import { ApolloClient, InMemoryCache, gql } from "@apollo/client";
import { addBasket } from "./ProductSlice";
import store from "../../store";
import './Product.scss'

const client = new ApolloClient({
    uri: 'http://localhost:4000',
    cache: new InMemoryCache()
});

class Product extends Component {
    
    constructor(props){
        super(props)
        this.state = {
            gallery: [],
            attributes: [{
                items: []
            }],
            activeSize0: null,
            activeSize1: null,
            activeSize2: null,
            prices: [{
                amount: '',
                currency: {
                    symbol: ''
                }
            }],
            description: '',
            inStock: true,
            activeCurrency: 0
        }
        this.dispatch = store.dispatch

        this.addBasketItem = this.addBasketItem.bind(this)
        this.changeActiveSize = this.changeActiveSize.bind(this)
    }

    componentDidMount(){
        this.getProduct()
        this.unsubscribe = store.subscribe(() => {
            this.setState({activeCurrency: store.getState().changingValue.activeCurrency})
        })
    }

    componentDidUpdate(){
        this.basketInfo = {
            id: this.state.id,
            brand: this.state.brand,
            name: this.state.name,
            price: this.state.prices,
            photo: this.state.gallery[0],
            size: this.state.attributes,
            activeSizes: [this.state.activeSize0, this.state.activeSize1, this.state.activeSize2],
            counter: 1
        }
    }

    componentWillUnmount(){
        this.unsubscribe()
    }

    cutTegs(str) {
        const regex = /( |<([^>]+)>)/ig
        const result = str.replace(regex, " ")

        return result
    }

    addBasketItem(){
        this.dispatch(addBasket(this.basketInfo))
    }

    changeActiveSize(numberActiveSizeItem, numberActiveSize){
        this.setState({[numberActiveSize]: numberActiveSizeItem})
    }

    getPrice() {
        return this.state.prices[store.getState().changingValue.activeCurrency]?.currency.symbol + this.state.prices[store.getState().changingValue.activeCurrency]?.amount
    }

    checkInStock(i, j) {
        return this.state.inStock ? this.changeActiveSize(j, `activeSize${i}`) : null
    }

    getStyle(item, listElement) {
        return item.type === 'swatch' ? {background: `${listElement.value}`} : null
    }

    getSizeActive(i, j){
        return this.state[`activeSize${i}`] === j ? 'size-active' : !this.state.inStock ? 'outStock' : null
    }

    getSize(item, listElement){
        return item.type === 'swatch' ? null : listElement.value
    }


    getProduct(){
        const id = window.location.pathname.slice(9)
        client
        .query({
            query: gql`
            query product {
                product(id: "${id}"){
                  id
                  name
                  inStock
                  gallery
                  description
                  category
                  attributes {
                    id
                    name
                    type
                    items {
                      displayValue
                      value
                      id
                    }
                  }
                  prices{
                    currency {
                      label
                      symbol
                    }
                    amount
                  }
                  brand
                }
              } 
            `
        }).then(res => this.setState(res.data.product))
    }

    render(){
        return(
            <div className="pdp">
                <div className="all-photos">
                    {this.state.gallery.map((item, i) => {
                        return (
                        <img key={i} onClick={() => {this.setState({activePhoto: item})}} src={item} alt="product" />
                        )
                    })}
                </div>
                <div className="main-photo">
                    <img src={this.state.activePhoto || this.state.gallery[0]} alt="main" />
                </div>
                <div className="pdp-information">
                    <div className="brand">{this.state.brand}</div>
                    <div className="name">{this.state.name}</div>
                    <div className="size">
                        {this.state.attributes.map((item, i) => {
                            return (
                                <>
                                    <p key={i}>{item.name}</p>
                                    <ul key={item.id}>
                                        {item.items.map((listElement, j) => {
                                            return (
                                                <li key={listElement.id} onClick={() => this.checkInStock(i, j)} style={this.getStyle(item, listElement)} className={this.getSizeActive(i, j)}>
                                                    {this.getSize(item, listElement)}
                                                </li>
                                            )
                                        })}
                                    </ul>
                                </>
                            )
                        })}
                    </div>
                    <div className="pdp-price">
                        price:
                        <span>{this.getPrice()}</span>
                    </div>

                    <button disabled={this.state.id === 'apple-airtag' ? false : this.state.inStock === true && this.state.activeSize0 !== null ? false : true} onClick={this.addBasketItem} className="add-to-cart">add to cart</button>

                    <div className="pdp-descr">
                        {this.cutTegs(this.state.description)}
                    </div>
                </div>
            </div>
        )
    }
}

export default Product