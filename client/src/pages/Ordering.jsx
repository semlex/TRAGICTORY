import styled from 'styled-components'
import { useState, useEffect } from 'react'
import { useIMask } from 'react-imask'
import CartItems from '../components/CartItems'
import PageHead from '../components/PageHead'
import Input from '../components/Input'
import { userRequest } from '../utils/requests'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { clearCart } from '../redux/cartSlice'
import Alert from '../components/Alert'

const Container = styled.div`
  max-width: 1100px;
  padding: 10px;
  margin: 0 auto;
`

const OrderingForm = styled.form`
  margin: 0 auto;
  padding: 15px 0;
  max-width: 850px;
`

const Label = styled.label`
  font-family: 'Monstreratt', sans-serif;
  display: block;
  margin: 15px 0;
  font-size: 20px;
  font-weight: 400;
`

const Radio = styled.div`
  display: flex;
  align-items: center;
  margin: 8px 0;
`

const RadioInput = styled.input`
  cursor: pointer;
  margin-right: 8px;
`

const RadioLabel = styled.label`
  cursor: pointer;
  font-family: 'Monstreratt', sans-serif;
  font-size: 15px;
  line-height: 1.5
`

const Card = styled.div`
  display: flex;
  flex-flow: row wrap;
  justify-content: space-between;
  max-height: ${(props) => props.isOpen ? 'auto' : '0'};
  transition: 0.35s;
  background: #020946;
  max-width: 315px;
  border-radius: 15px;
  overflow: hidden;
  padding: ${(props) => props.isOpen ? '5px 15px' : '0 15px'};
`

const CardInput = styled(Input)`
  text-transform: uppercase;
  margin: 15px 0;
  padding: 10px;
  
  &::placeholder {
    text-transform: none
  }
`

const Button = styled.button`
  cursor: pointer;
  border-radius: 50px;
  background: #3a54d6;
  margin: 15px 0;
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

const Ordering  = () => {
   const cart = useSelector(state => state.cart)

   const [isError, setIsError] = useState(false)
   const [error, setError] = useState('')
   const [isDone, setIsDone] = useState(false)

   const [city, setCity] = useState('')
   const [address, setAddress] = useState('')
   const [fullName, setFullName] = useState('')
   const [paymentMethod, setPaymentMethod] = useState('ondelivery')

   const [ phoneOpts, setPhoneOpts ] = useState({ mask: '+{7} (000) 000-00-00' })
   const { ref: phoneRef, value: phone } = useIMask(phoneOpts)
   const [ cardNumOpts, setCardNumOpts ] = useState({ mask: '0000 0000 0000 0000' })
   const { ref: cardNumRef, value: cardNum } = useIMask(cardNumOpts)
   const [ expirationOpts, setExpirationOpts ] = useState({ mask: '00/00' })
   const { ref: expirationRef, value: expiration } = useIMask(expirationOpts)
   const [ cardholderOpts, setCardholderOpts ] = useState({ mask: /^[a-zA-z]+/ })
   const { ref: cardholderRef, value: cardholder } = useIMask(cardholderOpts)
   const [ CVVOpts, setCVVOpts ] = useState({ mask: /^\d{0,4}$/ })
   const { ref: CVVRef, value: CVV } = useIMask(CVVOpts)

   const dispatch = useDispatch()

   const navigate = useNavigate()

   useEffect(() => {
      if (cart.products.length === 0 && !isDone) {
         navigate('/cart')
      }
   }, [navigate, isDone, cart.products])

   // eslint-disable-next-line
   const checkout = YooMoneyCheckout(892740)

   const createOrder = (e) => {
      e.preventDefault()

      if (!city || !address || !fullName ||
         !phone.match(/^\+7\s\(\d{3}\)\s\d{3}-\d{2}-\d{2}$/) ||
         (paymentMethod === 'card' && (!cardNum.match(/^\d{4}\s\d{4}\s\d{4}\s\d{4}$/) ||
            !expiration.match(/^\d{2}\/\d{2}/) ||
            !cardholder.match(/^[a-zA-z]+\s[a-zA-z]+/) ||
            !CVV.match(/^\d{3,4}/)))) {
         if (!city) {
            e.target.querySelector('#city').setAttribute('data-error', 'true')
         }
         if (!address) {
            e.target.querySelector('#address').setAttribute('data-error', 'true')
         }
         if (!fullName) {
            e.target.querySelector('#full_name').setAttribute('data-error', 'true')
         }
         if (!phone.match(/^\+7\s\(\d{3}\)\s\d{3}-\d{2}-\d{2}$/)) {
            e.target.querySelector('#phone').setAttribute('data-error', 'true')
         }
         if (paymentMethod === 'card') {
            if (!cardNum.match(/^\d{4}\s\d{4}\s\d{4}\s\d{4}$/)) {
               e.target.querySelector('#card_num').setAttribute('data-error', 'true')
            }
            if (!expiration.match(/^\d{2}\/\d{2}/)) {
               e.target.querySelector('#expiration').setAttribute('data-error', 'true')
            }
            if (!cardholder.match(/^[a-zA-z]+\s[a-zA-z]+/)) {
               e.target.querySelector('#cardholder').setAttribute('data-error', 'true')
            }
            if (!CVV.match(/^\d{3,4}/)) {
               e.target.querySelector('#CVV').setAttribute('data-error', 'true')
            }
         }
      } else {
         e.target.querySelectorAll('input:not(radio)').forEach((elem) => {
            elem.setAttribute('data-error', 'false')
         })

         const makeOrderRequest = async (paymentToken = '') => {
            await userRequest.post('/orders/create', {
               products: cart.products.map((item) => ({
                  product: item._id,
                  quantity: item.quantity,
                  img: item.img,
                  price: item.price,
                  title: item.title
               })),
               amount: cart.total,
               fullName,
               paymentMethod,
               paymentToken,
               phone,
               city,
               address
            }).then((res) => {
               if (res.status === 200) {
                  setIsDone(true)
                  setIsError(false)
                  setError('')
                  dispatch(clearCart())
                  navigate('/orders')
               }
            }).catch((err) => {
               if (err.response && err.response.data && err.response.data.message === 'Product out of stock')
               {
                  setError('outOfStock')
               } else {
                  setError('')
               }
               setIsError(true)
            })
         }

         if (paymentMethod === 'card') {
            checkout.tokenize({
               number: cardNum,
               cvc: CVV,
               month: expiration.split('/')[0],
               year: expiration.split('/')[1]
            }).then(async res => {
               if (res.status === 'success') {
                  const { paymentToken } = res.data.response
                  await makeOrderRequest(paymentToken)
               }
               if (res.status === 'error') {
                  setError('card')
                  setIsError(true)
               }
            })
         } else {
            makeOrderRequest()
         }
      }
   }

   return (
      <>
         <PageHead>
            Оформление заказа
         </PageHead>
         <Container>
            <CartItems
               products={cart.products}
               total={cart.total}
               place={'order'}
            />
            <OrderingForm onSubmit={createOrder}>
               <Label htmlFor={'city'}>
                  Город доставки
               </Label>
               <Input
                  type={'text'}
                  id={'city'}
                  value={city}
                  placeholder={'Введите ваш город'}
                  onChange={(e) => setCity(e.target.value)}
               />
               <Label htmlFor={'address'}>
                  Адрес доставки
               </Label>
               <Input
                  type={'text'}
                  id={'address'}
                  value={address}
                  placeholder={'Введите адрес доставки'}
                  onChange={(e) => setAddress(e.target.value)}
               />
               <Label htmlFor={'full_name'}>
                  ФИО получателя
               </Label>
               <Input
                  type={'text'}
                  id={'full_name'}
                  value={fullName}
                  placeholder={'Введите ФИО получателя'}
                  onChange={(e) => setFullName(e.target.value)}
               />
               <Label htmlFor={'phone'}>
                  Тел.номер получателя
               </Label>
               <Input
                  type={'tel'}
                  id={'phone'}
                  ref={phoneRef}
                  placeholder={'Введите тел.номер получателя'}
               />
               <Label>
                  Способ оплаты:
               </Label>
               <Radio>
                  <RadioInput
                     type={'radio'}
                     id={'ondelivery'}
                     value={'ondelivery'}
                     checked={paymentMethod === 'ondelivery'}
                     onChange={() => setPaymentMethod('ondelivery')}
                  />
                  <RadioLabel htmlFor={'ondelivery'}>
                     Оплата при получении
                  </RadioLabel>
               </Radio>
               <Radio>
                  <RadioInput
                     type={'radio'}
                     id={'card'}
                     value={'ondelivery'}
                     checked={paymentMethod === 'card'}
                     onChange={() => setPaymentMethod('card')}
                  />
                  <RadioLabel htmlFor={'card'}>
                     Картой онлайн
                  </RadioLabel>
               </Radio>
               <Card isOpen={paymentMethod === 'card'}>
                  <CardInput
                     type={'text'}
                     id={'card_num'}
                     ref={cardNumRef}
                     placeholder={'Номер карты'}
                     style={{maxWidth: '185px'}}
                  />
                  <CardInput
                     type={'text'}
                     id={'expiration'}
                     ref={expirationRef}
                     placeholder={'Дата'}
                     style={{maxWidth: '75px'}}
                  />
                  <CardInput
                     type={'text'}
                     id={'cardholder'}
                     ref={cardholderRef}
                     placeholder={'Владелец карты'}
                     style={{maxWidth: '185px'}}
                  />
                  <CardInput
                     type={'text'}
                     id={'CVV'}
                     ref={CVVRef}
                     placeholder={'CVV'}
                     style={{maxWidth: '75px'}}
                  />
               </Card>
               <Button type={'submit'}>
                  Оформить заказ
               </Button>
               {isError && ((error === 'card' && <Alert type={'error'}>Неправильные данные карты</Alert>) ||
                  (error === 'outOfStock' && <Alert type={'error'}>Товара нет в наличии</Alert>) ||
                  (<Alert type={'error'}>Произошла ошибка...</Alert>))}
            </OrderingForm>
         </Container>
      </>
   )
}

export default Ordering