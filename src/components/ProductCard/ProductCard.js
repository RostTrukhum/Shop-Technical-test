import { Component } from "react";
import Basket from "./Basket.svg";
import store from "../../store";
import "./Product.scss";

class ProductCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      entered: false,
      activeCurrency: 0
    };
    this.props = props;
    this.mouseEnter = this.mouseEnter.bind(this);
    this.mouseLeave = this.mouseLeave.bind(this);
  }

  componentDidMount(){
    this.unsubscribe = store.subscribe(() => {
      this.setState({activeCurrency: store.getState().changingValue.activeCurrency})
    })
  }

  componentWillUnmount(){
    this.unsubscribe()
  }

  mouseEnter() {
    this.setState({ entered: true });
  }

  mouseLeave() {
    this.setState({ entered: false });
  }

  getPrice(){
    return this.props.prices[store.getState().changingValue.activeCurrency].currency.symbol + this.props.prices[store.getState().changingValue.activeCurrency].amount
  }

  checkMouseEntered(){
    if(this.state.entered) {
      return (
        <button className="add-basket">
          <img src={Basket} alt="add-asket" />
        </button>
      )
    }
  }

  checkClss(){
    return `product ${this.state.entered ? "entered" : null} ${
      this.props.inStock ? null : "out-of-stock"
    }`
  }

  render() {
    return (
      <>
        <div
          onMouseEnter={this.mouseEnter}
          onMouseLeave={this.mouseLeave}
          className={this.checkClss()}
        >
          <div className="product-img">
            <img src={this.props.gallery[0]} alt="ProductCard" />
            {this.checkMouseEntered()}
          </div>
          <div className="product-name">{this.props.name}</div>
          <div className="product-price">
            {this.getPrice()}
          </div>
        </div>
      </>
    );
  }
}

export default ProductCard;
