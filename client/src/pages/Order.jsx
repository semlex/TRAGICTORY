import styled from 'styled-components'
import { useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { userRequest } from '../utils/requests'
import { sm, md } from '../responsive'
import CartItems from '../components/CartItems'
import moment from 'moment'

const Container = styled.div`
  max-width: 1100px;
  padding: 38px 10px;
  margin: 0 auto;
`

const Title = styled.h1`
  font-size: 25px;
  ${md({ fontSize: '22px' })};
  ${sm({ fontSize: '18px' })};
  font-family: 'Montserrat', sans-serif;
`

const OrderInfo = styled.div`
  margin: 0 auto;
  padding: 15px 0;
  max-width: 850px;
`

const InfoTitle = styled.h3`
  font-family: 'Monstreratt',sans-serif;
  margin: 15px 0;
  font-size: 20px;
  font-weight: 400;
`

const InfoText = styled.p`
  font-family: 'Monstreratt',sans-serif;
  margin: 5px 0;
  font-size: 15px;
`

const Order = () => {
   const { id } = useParams()
   const [order, setOrder] = useState({})

   useEffect(() => {
      const getProduct = async () => {
         await userRequest.get(`/orders/${id}`).then((res) => {
            setOrder(res.data)
         }).catch((err) => {})
      }
      getProduct()
   }, [id])

   return (
      <Container>
         <Title>
            Заказ {order._id} ({moment(order.createdAt).format('DD.MM.YYYY HH:mm')})
         </Title>
         {order.products &&
         <CartItems
            products={order.products.map((item) => ({
               _id: item.product,
               img: item.img,
               title: item.title,
               price: item.price,
               quantity: item.quantity
            }))}
            total={order.amount}
            place={'order'}
         />}
         {order &&
         <OrderInfo>
            <InfoTitle>
               Получатель
            </InfoTitle>
            <InfoText>
               {order.fullName}
            </InfoText>
            <InfoTitle>
               Тел.номер
            </InfoTitle>
            <InfoText>
               {order.phone}
            </InfoText>
            <InfoTitle>
               Город
            </InfoTitle>
            <InfoText>
               {order.city}
            </InfoText>
            <InfoTitle>
               Адрес
            </InfoTitle>
            <InfoText>
               {order.address}
            </InfoText>
            <InfoTitle>
               Способ оплаты
            </InfoTitle>
            {order.paymentMethod === 'ondelivery' && <InfoText>При получении</InfoText>}
            {order.paymentMethod === 'card' && <InfoText>Картой онлайн ({moment(order.paidAt).format('DD.MM.YYYY HH:mm')})</InfoText>}
            <InfoTitle>
               Статус доставки
            </InfoTitle>
            {order.isDelivered && <InfoText>Доставлен {moment(order.deliveredAt).format('DD.MM.YYYY HH:mm')}</InfoText>}
            {!order.isDelivered && <InfoText>Отправлен</InfoText>}
         </OrderInfo>}
      </Container>
   )
}

export default Order