import styled from 'styled-components'
import { sm, md } from '../responsive'
import { Link } from 'react-router-dom'

const Container = styled.div`
  flex: 0 0 auto;
  width: 25%;
  ${md({ width: '33.333333%' })}
  ${sm({ width: '100%' })}
  padding: 20px;

  &:hover {
    box-shadow: 0 0 20px 16px rgba(0, 0, 0, 0.2)
  }
`

const Image = styled.img`
  width: 100%;
  height: 175px;
  object-fit: contain;
`

const Title = styled.div`
  color: #111111;
  font-weight: 300;
  max-height: 48px;
  overflow: hidden;
  text-overflow: ellipsis;
`

const Price = styled.div`
  font-family: 'Montserrat', sans-serif;
  color: #3a54d6;
  font-size: 16px;
  font-weight: 600;
`

const Product = ({ item }) => {
   return (
      <Container>
         <Link to={`/product/${item._id}`}>
            <Image src={item.img}/>
            <Title>
               {item.title}
            </Title>
            <Price>
               {Intl.NumberFormat('ru-RU', {
                  style: 'currency',
                  currency: 'RUB',
                  minimumFractionDigits: 0
               }).format(item.price)}
            </Price>
         </Link>
      </Container>
   )
}

export default Product