import styled from 'styled-components'
import DataTable from 'react-data-table-component'
import PageHead from '../components/PageHead'
import { userRequest } from '../utils/requests'
import { IoIosCloseCircle } from 'react-icons/io'
import { FaEdit } from 'react-icons/fa'
import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { categoriesTitles } from '../data'

const Container = styled.div`
  max-width: 1100px;
  padding: 10px;
  margin: 0 auto;
`

const Product = styled.div`
  display: flex;
  align-items: center;
`

const ProductImage = styled.div`
  width: 70px;
  height: 80px;
  min-width: 70px;
  margin-right: 10px;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    object-position: center;
  }
`

const ProductContent = styled.div`
   text-align: left
`

const ProductTitle = styled(Link)`
  line-height: 18px;
  color: #333333;
  transition: 0.35s;
  border-bottom: 1px solid transparent;
  
  &:hover {
    border-bottom: 1px solid #bbbbbb;
  }
`

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

const GreenButton = styled(Button)`
  background: #28a745;
  border: 1px solid #28a745;
  border-radius: 5px;

  &:hover {
    background-color: #218838;
    border-color: #1e7e34;
  }
`

const BlueButton = styled(Button)`
  margin: 10px 0 10px auto;
  font-size: 16px;
  padding: 5px 10px;
  background-color: #007bff;
  border: 1px solid #007bff;

  &:hover {
    background-color: #0069d9;
    border-color: #0062cc;
  }
`

const ProductsListEdit = () => {
   const [products, setProducts] = useState([])

   const getProducts = async () => {
      await userRequest.get('/products').then((res) => {
         setProducts(res.data.products)
      }).catch((err) => {})
   }

   const deleteProduct = async (id) => {
      await userRequest.delete(`/products/delete/${id}`)
         .then((res) => {
            getProducts()
         }).catch((err) => {
            console.log(err)
         })
   }

   useEffect(() => {
      getProducts()
   }, [])

   const navigate = useNavigate()

   const columns = [
      {
         name: 'ID',
         selector: row => row._id,
         grow: 4
      },
      {
         name: 'Товар',
         selector: row => row.title,
         grow: 3.9,
         cell: row => (
            <Product>
               <ProductImage>
                  <img src={row.img} alt={'product'}/>
               </ProductImage>
               <ProductContent>
                  <ProductTitle to={`/product/${row._id}`}>
                     {row.title}
                  </ProductTitle>
               </ProductContent>
            </Product>
         )
      },
      {
         name: 'Категория',
         sortable: true,
         selector: row => row.category,
         cell: row => (categoriesTitles.find((elem) => elem.value === row.category).title)
      },
      {
         name: 'Цена',
         sortable: true,
         selector: row => row.price,
         cell: row => Intl.NumberFormat('ru-RU', {
            style: 'currency',
            currency: 'RUB',
            minimumFractionDigits: 0
         }).format(row.price)
      },
      {
         name: 'В наличии',
         sortable: true,
         selector: row => row.countInStock,
         cell: row => `${row.countInStock} шт.`
      },
      {
         name: 'Действия',
         selector: row => row.action,
         grow: 2.5,
         cell: row => (<>
            <GreenButton onClick={() => navigate(`/edit/product/${row._id}`)}>
               Ред. <FaEdit/>
            </GreenButton>
            <Button onClick={() => deleteProduct(row._id)}>
               Удалить <IoIosCloseCircle/>
            </Button>
            </>)
      }
   ]

   const customStyles = {
      headCells: {
         style: {
            fontSize: '16px',
            padding: '0 10px',
         },
      },
      cells: {
         style: {
            fontSize: '15px',
            padding: '10px'
         },
      },
   }

   return (
      <>
         <PageHead>
            Товары
         </PageHead>
         <Container>
            <BlueButton onClick={() => navigate('/add/product')}>
               Добавить товар
            </BlueButton>
            <DataTable
               pagination
               columns={columns}
               data={products}
               customStyles={customStyles}
               paginationComponentOptions={ { rowsPerPageText: 'Строк' } }
            />
         </Container>
      </>
   )
}

export default ProductsListEdit