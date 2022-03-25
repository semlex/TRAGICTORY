import styled from 'styled-components'
import { sm, md } from '../responsive'
import { Link } from 'react-router-dom'

const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
`

const Container = styled.div`
  cursor: pointer;
  flex: 0 0 auto;
  width: 33.33333%;
  padding: 10px 10px;
  ${md({ width: '50%' })}
  ${sm({ width: '100%' })}
`

const Content = styled.div`
  height: 250px;
  ${sm({ height: '180px' })}
  position: relative;
  overflow: hidden;
  &:hover {
    ${Image} {
      transform: scale(1.2);
    }
  }
`
const Text = styled.div`
  position: absolute;
  bottom: 35px;
  color: #ffffff;
  font-size: 35px;
  font-weight: 700;
  text-align: center;
  width: 100%;
  text-transform: uppercase;
`

const CategoryItem = ({ item }) => {
   return (
      <Container>
         <Link to={`/products/${item.category}`}>
            <Content>
               <Image src={item.img}/>
               <Text>
                  {item.name}
               </Text>
            </Content>
         </Link>
      </Container>
   )
}

export default CategoryItem