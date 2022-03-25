import styled from 'styled-components'
import PageHead from '../components/PageHead'
import {useState, useEffect} from 'react'
import { Link } from 'react-router-dom'
import {userRequest} from "../utils/requests";
import moment from "moment";
import DataTable from "react-data-table-component";
import {IoIosCloseCircle} from "react-icons/io";

const Container = styled.div`
  max-width: 1100px;
  padding: 20px 10px;
  margin: 0 auto;
`

const OrderLink = styled(Link)`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

const Checkbox = styled.input``

const Button = styled.button`
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 11px;
  margin: 0 3px;
  padding: 5px 7px;
  font-family: 'Montserrat', sans-serif;
  color: #fff;
  background: #dc3545;
  border: 1px solid #dc3545;
  border-radius: 5px;
  white-space: nowrap;
  
  &:hover {
    background-color: #c82333;
    border-color: #bd2130
  }
  
  svg {
    margin-top: 1px;
    margin-left: 5px;
  }
`

const OrdersEdit = () => {
   const [orders, setOrders] = useState([])

   const getOrders = async () => {
      await userRequest.get('/orders').then((res) => {
         setOrders(res.data)
      }).catch((err) => {
         console.log(err)
      })
   }

   const deliverOrder = async (order) => {
      await userRequest.put(`/orders/update/${order._id}`, {isDelivered: !order.isDelivered})
         .then((res) => {
            getOrders()
         }).catch((err) => {
            console.log(err)
         })
   }

   const deleteOrder = async (id) => {
      await userRequest.delete(`/orders/delete/${id}`)
         .then((res) => {
            getOrders()
         }).catch((err) => {
            console.log(err)
         })
   }

   useEffect(() => {
      getOrders()
   }, [])

   const columns = [
      {
         name: 'ID',
         selector: row => row._id,
         cell: row => (<OrderLink to={`/order/${row._id}`}>{row._id}</OrderLink>),
         grow: 1.6
      },
      {
         name: 'Имя',
         selector: row => row.fullName,
      },
      {
         name: 'Дата',
         sortable: true,
         selector: row => row.createdAt,
         cell: row => moment(row.createdAt).format('DD.MM.YYYY HH:mm')
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
         name: 'Оплачен',
         selector: row => row.isPaid,
         cell: row => row.isPaid ? 'Да' : 'Нет'
      },
      {
         name: 'Доставлен',
         selector: row => row.isDelivered,
         cell: row => (<Checkbox
            type={'checkbox'}
            checked={row.isDelivered}
            onChange={() => deliverOrder(row)}
         />)
      },
      {
         name: 'Действия',
         selector: row => row.action,
         cell: row => (<>
            <Button onClick={() => deleteOrder(row._id)}>
               Удалить <IoIosCloseCircle/>
            </Button>
         </>)
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
            Все заказы
         </PageHead>
         <Container>
            <DataTable
               pagination
               columns={columns}
               data={orders}
               customStyles={customStyles}
               paginationComponentOptions={ { rowsPerPageText: 'Строк' } }
            />
         </Container>
      </>
   )
}

export default OrdersEdit