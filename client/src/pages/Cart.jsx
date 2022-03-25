import styled from 'styled-components'
import PageHead from '../components/PageHead'
import CartItems from '../components/CartItems'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import { AiOutlineSearch } from 'react-icons/ai'
import { md } from '../responsive'
import { Link, useNavigate } from 'react-router-dom'

const Container = styled.div`
  max-width: 1100px;
  padding: 10px;
  margin: 0 auto;
`

const EmptyCart = styled.div`
  font-family: 'Montserrat', sans-serif;
  padding: 15px 0;
  text-align: center;
`

const EmptyCartImg = styled.img`
   
`

const EmptyCartText = styled.p`
  font-family: inherit;
  color: #999999FF;
  line-height: 1.5em;
  ${md({ textAlign: "left" })}
  
  span {
    font-family: inherit;
    color: #000
  }
`

const MainPageLink = styled(Link)`
  font-family: inherit;
  color: #999999;
  border-bottom: 1px #e1e1e1 solid;
  text-decoration-color: #e1e1e1;
  transition: 0.35s;
  
  &:hover {
    border-bottom: 1px solid transparent;
  }
`


const EmptyCartSearch = styled.div`
`

const SearchForm = styled.form`
  font-family: "Montserrat", sans-serif;
  position: relative;
  margin: 50px auto;
  max-width: 500px;
`

const SearchFormLabel = styled.label`
  font-family: inherit;
  color: #999999;
`

const SearchFormInput = styled.input`
  font-family: inherit;
  display: block;
  width: 100%;
  margin: 20px auto;
  padding: 22px 35px;
  border-radius: 50px;
  border: none;
  box-shadow: 0 5px 40px 0 rgba(0, 0, 0, 0.1);
  font-size: 14px;
  transition: 0.35s;
  
  &:focus {
    box-shadow: 0 5px 40px 0 rgba(0, 0, 0, 0.2)
  }
`

const SearchFormButton = styled.button`
  cursor: pointer;
  padding: 15px;
  line-height: 1;
  position: absolute;
  bottom: 2px;
  right: 7px;
  border: none;
  background: transparent;
  font-size: 25px;
  color: #3a54d6;
`

const Cart = () => {
   const cart = useSelector(state => state.cart)

   const [searchTerm, setSearchTerm] = useState('')

   const navigate = useNavigate()

   const search = (e) => {
      e.preventDefault()

      if (searchTerm) {
         navigate(`/search/${searchTerm}`)
      }
   }

   return (
      <>
         <PageHead>
            Корзина
         </PageHead>
         <Container>
            {cart.products.length === 0 &&
               <EmptyCart>
                  <EmptyCartImg src={'https://static.thenounproject.com/png/632851-200.png'}/>
                  <EmptyCartText>
                     К сожалению, ваша корзина пока пуста.
                     <br/>
                     Но есть отличная возможность её наполнить! Например, начните с <MainPageLink to={'/'}>главной страницы.</MainPageLink>
                     <br/>
                     Далее нажмите на странице товара кнопку <span>добавить в корзину</span>, и товары появятся здесь!

                  </EmptyCartText>
                  <EmptyCartSearch>
                     <SearchForm onSubmit={search}>
                        <SearchFormLabel htmlFor={'search'}>
                           Ищете что-то конкретное?
                        </SearchFormLabel>
                        <SearchFormInput
                           type={'text'}
                           id={'search'}
                           value={searchTerm}
                           onChange={(e) => setSearchTerm(e.target.value)}
                           placeholder={'Введите слово для поиска'}
                        />
                        <SearchFormButton type={'submit'}>
                           <AiOutlineSearch/>
                        </SearchFormButton>
                     </SearchForm>
                  </EmptyCartSearch>
               </EmptyCart>
            }
            {cart.products.length > 0 &&
            <CartItems
               products={cart.products}
               total={cart.total}
               place={'cart'}
            />}
         </Container>
      </>
   )
}

export default Cart