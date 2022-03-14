import { Component } from "react";
import { ApolloClient, InMemoryCache, gql } from "@apollo/client";
import { Link } from 'react-router-dom'
import ProductCard from '../ProductCard/ProductCard'

const client = new ApolloClient({
    uri: 'http://localhost:4000',
    cache: new InMemoryCache()
});

class ClothesList extends Component {
    state = {
        elements: []
    }

    componentDidMount(){
        this.getProducts()
    }

    filterElements(data){
        const filteredElements = data.filter(data => data.category === 'clothes')
        this.setState({elements: filteredElements})
    }

    getProducts(){
        client
        .query({
            query: gql`
            query category {
                category {
                  name
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
                  }
                }
              }
            `
        }).then(res => this.filterElements(res.data.category.products))
    }

    render(){
        return(
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

export default ClothesList