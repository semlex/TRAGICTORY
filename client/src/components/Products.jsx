import styled from 'styled-components'
import Product from './Product'

const Container = styled.div`
  display: flex;
  flex-flow: row wrap;
  align-items: stretch;
  margin: 0 auto;
  max-width: 1100px;
  min-height: 327px;
  padding: 20px 10px
`

const Products = ({ products }) => {
   return (
      <Container>
         {products.map((item, i) => (
            <Product item={item} key={i} />
         ))}
      </Container>
   )
}

export default Products