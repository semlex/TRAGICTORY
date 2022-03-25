import styled from 'styled-components'
import CategoryItem from './CategoryItem';
import {categoryItems} from '../data';

const Container = styled.div`
  margin: 0 auto;
  width: 100%;
  max-width: 1100px;
  padding: 10px 10px;
`

const Row = styled.div`
  display: flex;
  justify-content: flex-start;
  flex-flow: row wrap;
  margin: 0 -10px;
`

const Categories = () => {
   return (
      <Container>
         <Row>
            {categoryItems.map((item, i) => (
               <CategoryItem item={item} key={item.id} />
            ))}
         </Row>
      </Container>
   )
}

export default Categories