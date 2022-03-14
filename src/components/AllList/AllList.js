import { ApolloClient, InMemoryCache, gql } from "@apollo/client";
import { Component } from "react";
import { Link } from 'react-router-dom'
import ProductCard from '../ProductCard/ProductCard'
import './ProductList.scss'

const client = new ApolloClient({
    uri: 'http://localhost:4000',
    cache: new InMemoryCache()
});

class AllList extends Component {

    state = {
        elements: []
    }

    componentDidMount() {
        this.getProducts()
    }

    getProducts() {
        client
        .query({
            query: gql`
            query categories {
                category {
                  products {
                    id
                    name
                    inStock
                    gallery
                    description
                    category
                    prices {
                      currency {
                        label
                        symbol
                      }
                      amount
                    }
                    brand
                  }
                }
              }
            `,
        })
        .then(result => this.setState({elements: result.data.category.products}));
    }



    render () {
        return (
            <>
                <div className="category">
                    Category name
                </div>
                <div className="store-product-list">
                    {this.state.elements.map((item) => {
                    
                    const props = {
                        ...item,
                        key: item.id
                    }

                    return (
                        <Link key={item.id} to={`/product/${item.id}`}>
                            <ProductCard {...props}/>
                        </Link>
                    )
                    })}
                </div>
            </>
        )
    }
}

export default AllList