import styled from 'styled-components'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addProduct, deleteProduct, fullDeleteProduct } from '../redux/cartSlice'
import { AiOutlineSearch } from 'react-icons/ai'
import { HiMinusSm, HiPlusSm } from 'react-icons/hi'
import { RiCloseFill } from 'react-icons/ri'
import { md, sm } from '../responsive'
import { Link, useNavigate } from 'react-router-dom'
import { openAuthModal } from '../redux/authModalSlice'

const CartItemsWrapper = styled.div`
  padding: 30px 0;
`

const CartItem = styled.div`
  display: flex;
  ${sm({
   alignItems: "center",
   flexWrap: "wrap"
})}
  border-top: 1px solid #e6e6e6;
`

const ImgContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 175px;
  height: 200px;
  ${sm({
   padding: "5px",
   width: "50%",
})}
  padding: 20px 15px;
`

const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
`

const CartItemDetails = styled.div`
  display: flex;
  flex-flow: row wrap;
  width: 100%;
  ${sm({ width: "50%" })}
  position: relative;
`

const CartItemContent = styled.div`
  width: 40%;
  flex: 1;
  ${md({ width: '50%' })}
  ${sm({
   display: 'none'
})}
  padding: 20px 30px;
  display: flex;
  align-items: center;
`

const CartItemContentMobile = styled.div`
  width: 100%;
  padding: 10px 20px;
  display: none;
  ${sm({ display: "block" })}
`

const NameContainer = styled.div``

const CartItemName = styled(Link)`
  color: #333333;
  cursor: pointer;
  transition: 0.35s;
  border-bottom: 1px solid transparent;

  &:hover {
    border-bottom: 1px solid #999999;
  }
`

const CartItemPrices = styled.div`
  width: 40%;
  flex: 1;
  padding: ${(props) => props.place === 'cart' ? '10px' : '0 120px 0 0'};
  ${md({ 
    width: '50%',
    padding: '3px'
  })}
  ${sm({
   order: '2',
   padding: '5px', 
   flexDirection: 'column',
   width: '100%'
})}
  display: flex;
  justify-content: ${(props) => props.place === 'cart' ? 'center' : 'right'};
  align-items: center;
`

const PricePerOne = styled.div`
  font-family: "Montserrat", sans-serif;
  white-space: nowrap;
  font-size: 18px;
  font-weight: 600;
  color: #999999;
`

const Count = styled.div`
  margin: 0 10px;
  font-size: 18px;
  font-weight: 400;
`

const CountControl = styled.div`
  display: flex;
  width: 100px;
  cursor: default;
  margin: 0 5px;
  ${sm({ margin: "5px 0" })}
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  border: 1px solid #b1b1b1;
  border-radius: 50px;
  
  svg {
    cursor: pointer;
    color: #B1B1B1FF;
    font-size: 20px;
  }
  
  &:hover {
    border-color: #111111;
  }
  
  svg:hover {
    color: #3a54d6;
  }
`

const CountControlNumber = styled.span`
  color: #111111FF;
  margin: 0 7px;
`

const TotalPrice = styled.div`
  font-family: "Montserrat", sans-serif;
  white-space: nowrap;
  font-size: 18px;
  font-weight: 600;
  color: #3a54d6;
`

const CartItemDelete = styled.div`
  width: 20%;
  display: flex;
  justify-content: center;
  align-items: center;
  ${md({
   position: "absolute",
   right: "0",
   top: "0",
   width: "auto"
})}
  ${sm({
   position: "relative",
   order: "1",
   width: "100%",
   padding: "15px"
})}
  cursor: pointer;
  font-size: 14px;
  font-weight: 400;
  padding: 20px 15px;
`

const DeleteText = styled.div`
  font-family: "Montserrat", sans-serif;
  font-size: 14px;
`

const DeleteBtn = styled.div`
  display: flex;
  align-items: center;
  border: none;
  background: transparent;
  transition: 0.35s;

  &:hover {
    color: #3a54d6;
  }
`

const CartTotalPrice = styled.div`
  border-top: 1px solid #e6e6e6;
  border-bottom: 1px solid #e6e6e6;
`

const CartTotalPriceContent = styled.div`
  font-family: "Montserrat", sans-serif;
  font-size: 18px;
  font-weight: 600;
  padding: 15px 0;
  margin-left: 70%;
  ${md({
   marginLeft: "0",
   textAlign: "right"
})}
`

const CartTotalPriceNum = styled.span`
  font-family: inherit;
  color: #feb312;
  margin-left: 3px;
`

const Checkout = styled.div`
   padding: 10px 20px;
`

const CheckoutButton = styled.button`
  cursor: pointer;
  border-radius: 50px;
  background: #3a54d6;
  margin: 10px 0;
  padding: 10px 30px;
  color: #FFFFFF;
  font-family: "Montserrat", sans-serif;
  font-weight: 400;
  font-size: 15px;
  text-align: center;
  border: 2px solid transparent;
  transition: 0.35s;

  &:hover {
    background: #fff;
    border: 2px solid #0077ff;
    color: #0077ff;
  }
`

const CartItems = ({ products, total, place }) => {
   const user = useSelector(state => state.user.currentUser)

   const dispatch = useDispatch()

   const navigate = useNavigate()

   const addOne = product => {
      dispatch(
         addProduct({
            _id: product._id,
            price: product.price
         })
      )
   }

   const deleteOne = product => {
      dispatch(
         deleteProduct({
            _id: product._id,
            price: product.price
         })
      )
   }

   const fullDeleteOne = id => {
      dispatch(
         fullDeleteProduct({
            _id: id
         })
      )
   }

   const toOrdering = () => {
      if (user) {
         navigate('/cart/ordering')
      }
      else {
         dispatch(openAuthModal({status: 'login'}))
      }
   }

   return (
      <>
         <CartItemsWrapper>
            {products.map((item, i) => (
               <CartItem key={i}>
                  <ImgContainer>
                     <Image src={item.img}/>
                  </ImgContainer>
                  <CartItemDetails>
                     <CartItemContent>
                        <NameContainer>
                           <CartItemName to={`/product/${item._id}`}>
                              {item.title}
                           </CartItemName>
                        </NameContainer>
                     </CartItemContent>
                     <CartItemPrices>
                        <PricePerOne>
                           {Intl.NumberFormat('ru-RU', {
                              style: 'currency',
                              currency: 'RUB',
                              minimumFractionDigits: 0
                           }).format(item.price)}
                        </PricePerOne>
                        {place === 'order' &&
                        <Count>
                           {item.quantity} шт.
                        </Count>}
                        {place === 'cart' &&
                        <CountControl>
                           <HiMinusSm
                              onClick={() => deleteOne(item)}
                           />
                           <CountControlNumber>
                              {item.quantity}
                           </CountControlNumber>
                           <HiPlusSm
                              onClick={() => addOne(item)}
                           />
                        </CountControl>}
                        <TotalPrice>
                           {Intl.NumberFormat('ru-RU', {
                              style: 'currency',
                              currency: 'RUB',
                              minimumFractionDigits: 0
                           }).format(item.price * item.quantity)}
                        </TotalPrice>
                     </CartItemPrices>
                     {place === 'cart' &&
                     <CartItemDelete onClick={() => fullDeleteOne(item._id)}>
                        <DeleteBtn>
                           <DeleteText>
                              Удалить
                           </DeleteText>
                           <RiCloseFill/>
                        </DeleteBtn>
                     </CartItemDelete>}
                  </CartItemDetails>
                  <CartItemContentMobile>
                     <NameContainer>
                        <CartItemName to={`/product/${item._id}`}>
                           {item.title}
                        </CartItemName>
                     </NameContainer>
                  </CartItemContentMobile>
               </CartItem>
            ))}
         </CartItemsWrapper>
         <CartTotalPrice>
            <CartTotalPriceContent>
               Итого:
               <CartTotalPriceNum>
                  {Intl.NumberFormat('ru-RU', {
                     style: 'currency',
                     currency: 'RUB',
                     minimumFractionDigits: 0
                  }).format(total)}
               </CartTotalPriceNum>
            </CartTotalPriceContent>
         </CartTotalPrice>
         {place === 'cart' &&
         <Checkout>
            <CheckoutButton onClick={toOrdering}>
               Оформить заказ
            </CheckoutButton>
         </Checkout>}
      </>
   )
}

export default CartItems