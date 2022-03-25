import styled from 'styled-components'
import ProductForm from '../components/ProductForm'

const Container = styled.div`
  max-width: 1100px;
  padding: 10px;
  margin: 0 auto;
`

const Title = styled.h1`
  font-family: 'Monstreratt', sans-serif;
   margin: 10px 0;
`

const EditProduct = () => {
   return (
      <Container>
         <Title>
            Редактировать товар
         </Title>
         <ProductForm type={'edit'}/>
      </Container>
   )
}

export default EditProduct