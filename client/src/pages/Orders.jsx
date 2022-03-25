import styled from 'styled-components'
import DataTable from 'react-data-table-component'
import PageHead from '../components/PageHead'
import Empty from '../components/Empty'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { userRequest } from '../utils/requests'
import moment from 'moment'


const Container = styled.div`
  max-width: 1100px;
  padding: 20px 10px;
  margin: 0 auto;
`

const Title = styled.h2`
  font-family: 'Monstreratt', sans-serif;
  margin: 15px 0;
  font-size: 24px;
  font-weight: 400;
  color: #111111;
`

const OrderLink = styled(Link)`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

const Orders = () => {
   const user = useSelector(state => state.user.currentUser)
   const [orders, setOrders] = useState([])

   useEffect(() => {
      const getOrders = async () => {
         await userRequest.get(`orders/user/${user.userId}`).then((res) => {
            setOrders(res.data)
         }).catch((err) => {})
      }
      getOrders()
   }, [user])

   const columns = [
      {
         name: 'ID',
         selector: row => row._id,
         cell: row => (<OrderLink to={`/order/${row._id}`}>{row._id}</OrderLink>),
         grow: 1.6
      },
      {
         name: 'Дата',
         sortable: true,
         selector: row => row.createdAt,
         cell: row => moment(row.createdAt).format('DD.MM.YYYY HH:mm')
      },
      {
         name: 'Город',
         selector: row => row.city,
      },
      {
         name: 'Адрес',
         selector: row => row.address,
         grow: 1.5
      },
      {
         name: 'Оплата',
         selector: row => row.paymentMethod,
         cell: row => row.paymentMethod === 'ondelivery' ? 'При получении' : 'Картой онлайн'
      },
      {
         name: 'Сумма',
         sortable: true,
         selector: row => row.amount,
         cell: row => Intl.NumberFormat('ru-RU', {
            style: 'currency',
            currency: 'RUB',
            minimumFractionDigits: 0
         }).format(row.amount)
      },
      {
         name: 'Доставлен',
         selector: row => row.isDelivered,
         cell: row => row.isDelivered ? moment(row.deliveredAt).format('DD.MM.YYYY HH:mm') : 'Нет'
      }
   ]

   const customStyles = {
      headCells: {
         style: {
            fontSize: '16px',
            paddingLeft: '8px',
            paddingRight: '8px',
         },
      },
      cells: {
         style: {
            fontSize: '15px',
            paddingLeft: '8px',
            paddingRight: '8px',
         },
      },
   }

   return (
      <>
         <PageHead>
            Заказы
         </PageHead>
         <Container>
            <Title>
               Мои заказы:
            </Title>
            {orders.length === 0 && <Empty>У вас пока нет заказов</Empty>}
            {orders.length > 0 &&
               <DataTable
                  pagination
                  columns={columns}
                  data={orders}
                  customStyles={customStyles}
                  paginationComponentOptions={ { rowsPerPageText: 'Строк' } }
               />
            }
         </Container>
      </>
   )
}

export default Orders