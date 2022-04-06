import styled from 'styled-components'
import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import DataTable from 'react-data-table-component'
import PageHead from '../components/PageHead'
import { userRequest } from '../utils/requests'
import { IoIosCloseCircle } from 'react-icons/io'
import { logout } from '../redux/apiCalls'
import { updateSuccess } from '../redux/userSlice'

const Container = styled.div`
  max-width: 1100px;
  padding: 20px 10px;
  margin: 0 auto;
`

const Checkbox = styled.input``

const Button = styled.button`
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 7px 10px;
  font-family: 'Montserrat', sans-serif;
  color: #fff;
  background: #dc3545;
  border: #dc3545;
  border-radius: 5px;
  
  &:hover {
    background-color: #c82333;
    border-color: #bd2130
  }
  
  svg {
    margin-top: 1px;
    margin-left: 5px;
  }
`

const UsersList = () => {
   const user = useSelector(state => state.user.currentUser)

   const [users, setUsers] = useState([])

   const dispatch = useDispatch()

   const makeAdmin = async (updatingUser) => {
      await userRequest.put(`/users/make-admin/${updatingUser._id}`, { isAdmin: !updatingUser.isAdmin })
         .then((res) => {
            getUsers()
            if (user.userId === updatingUser._id) {
               dispatch(updateSuccess(res.data))
            }
         }).catch((err) => {
            console.log(err)
         })
   }

   const deleteUser = async (id) => {
      await userRequest.delete(`/users/delete/${id}`)
         .then((res) => {
            getUsers()
            if (user.userId === id) {
               logout(dispatch)
            }
         }).catch((err) => {
            console.log(err)
         })
   }

   const getUsers = async () => {
      await userRequest.get('/users').then((res) => {
         setUsers(res.data)
      }).catch((err) => {})
   };

   useEffect(() => {
      getUsers()
   }, [])

   const columns = [
      {
         name: 'ID',
         selector: row => row._id,
      },
      {
         name: 'Email',
         selector: row => row.email,
      },
      {
         name: 'Фамилия',
         selector: row => row.surname,
      },
      {
         name: 'Имя',
         selector: row => row.name,
      },
      {
         name: 'Админ',
         selector: row => row.isAdmin,
         cell: row => (<Checkbox
            type={'checkbox'}
            checked={row.isAdmin}
            onChange={() => makeAdmin(row)}
         />)
      },
      {
         name: 'Действия',
         selector: row => row.action,
         cell: row => (<Button onClick={() => deleteUser(row._id)}>
            Удалить <IoIosCloseCircle/>
         </Button>)
      }
   ]

   const customStyles = {
      headCells: {
         style: {
            fontSize: '15px'
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
            Пользователи
         </PageHead>
         <Container>
            <DataTable
               pagination
               columns={columns}
               data={users}
               customStyles={customStyles}
               paginationComponentOptions={ { rowsPerPageText: 'Строк' } }
            />
            {/*<TableWrapper>*/}
            {/*   <Table>*/}
            {/*      <Thead>*/}
            {/*         <Tr>*/}
            {/*            <Th>ID</Th>*/}
            {/*            <Th>Email</Th>*/}
            {/*            <Th>Фамилия</Th>*/}
            {/*            <Th>Имя</Th>*/}
            {/*            <Th>Админ</Th>*/}
            {/*            <Th>Действия</Th>*/}
            {/*         </Tr>*/}
            {/*      </Thead>*/}
            {/*      <Tbody>*/}
            {/*         {users.map((item, i) => (*/}
            {/*            <Tr key={i}>*/}
            {/*               <Td>{item._id}</Td>*/}
            {/*               <Td>{item.email}</Td>*/}
            {/*               <Td>{item.surname}</Td>*/}
            {/*               <Td>{item.name}</Td>*/}
            {/*               <Td>*/}
            {/*                  <Checkbox*/}
            {/*                     type={'checkbox'}*/}
            {/*                     checked={item.isAdmin}*/}
            {/*                     onChange={() => makeAdmin(item)}*/}
            {/*                  />*/}
            {/*               </Td>*/}
            {/*               <Td>*/}
            {/*                  <Button onClick={() => deleteUser(item._id)}>*/}
            {/*                     Удалить <IoIosCloseCircle/>*/}
            {/*                  </Button>*/}
            {/*               </Td>*/}
            {/*            </Tr>*/}
            {/*         ))}*/}
            {/*      </Tbody>*/}
            {/*   </Table>*/}
            {/*</TableWrapper>*/}
         </Container>
      </>
   )
}

export default UsersList