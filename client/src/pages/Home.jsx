import styled from 'styled-components'
import { useState, useEffect } from 'react'
import Slider from '../components/Slider'
import Categories from '../components/Categories'
import Products from '../components/Products'
import { publicRequest } from '../utils/requests'

const ProductsTitle = styled.div`
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 10px;
`

const Home = () => {
   const [products, setProducts] = useState([])

   useEffect(() => {
      const getProducts = async () => {
         await publicRequest.get('/products/popular')
            .then((res) => {
            setProducts(res.data)
            }).catch((err) => {})
      }
      getProducts()
   }, [])

   return (
      <>
         <Slider/>
         <Categories/>
         <ProductsTitle>
            <h1>Популярные товары</h1>
         </ProductsTitle>
         <Products products={products}/>
      </>
   )
}

export default Home