import { Component } from "react";
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import AllList from "../AllList/AllList";
import NavBar from "../NavBar/NavBar";
import ClothesList from "../ClothesList/ClothesList";
import TechList from "../TechList/TechList";
import Product from "../Product/Product"
import Cart from "../Cart/Cart";
import "./Store.scss";

class Store extends Component {
  render() {
    return (
      <Router>
        <div className="store">
        <NavBar/>
          <Routes>
              <Route path='/' element={<AllList/>}/>
              <Route path="/cart" element={<Cart/>}/>
              <Route path='/clothes' element={<ClothesList/>} />
              <Route path='/tech' element={<TechList/>}/>
              <Route path="/product/:id" element={<Product/>}/>              
          </Routes>
        </div>
      </Router>
    );
  }
}

export default Store;
