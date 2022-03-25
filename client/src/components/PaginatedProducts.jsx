import Products from './Products'
import Pagination from './Pagination'
import Empty from './Empty'
import moment from 'moment'
import { useEffect, useState } from 'react'
import { publicRequest } from '../utils/requests'

const PaginatedProducts = ({ products, itemsPerPage, filters, sort, category = '' }) => {
   const [currentItems, setCurrentItems] = useState([])
   const [pageCount, setPageCount] = useState(0)
   const [itemOffset, setItemOffset] = useState(0)
   const [filteredProducts, setFilteredProducts] = useState([])

   useEffect(() => {
      setFilteredProducts(products.filter(item =>
         (item.category === category || !category) &&
         (item.size === filters.size || !filters.size) &&
         (item.brand === filters.brand || !filters.brand) &&
         (item.price >= filters.minPrice && item.price <= filters.maxPrice))
      )
   }, [products, filters])

   useEffect(() => {
      if (sort === 'newest') {
         setFilteredProducts((prev) =>
            [...prev].sort((a, b) => moment(b.createdAt).unix() - moment(a.createdAt).unix())
         )
      } else if (sort === 'asc') {
         setFilteredProducts((prev) =>
            [...prev].sort((a, b) => a.price - b.price)
         )
      } else if (sort === 'desc') {
         setFilteredProducts((prev) =>
            [...prev].sort((a, b) => b.price - a.price)
         )
      }
   }, [sort])

   useEffect(() => {
      const endOffset = itemOffset + itemsPerPage
      setCurrentItems(filteredProducts.slice(itemOffset, endOffset))
      if (Math.ceil(filteredProducts.length / itemsPerPage) > 1) {
         setPageCount(Math.ceil(filteredProducts.length / itemsPerPage))
      }
      else {
         setPageCount(0)
      }
   }, [itemOffset, itemsPerPage, filteredProducts])

   const changePage = ({ selected }) => {
      const newOffset = (selected * itemsPerPage) % products.length
      setItemOffset(newOffset)
   }

   return (
      <>
         {currentItems.length === 0 &&
            <Empty>
               Ничего не найдено
            </Empty>
         }
         {currentItems.length > 0 &&
            <>
               <Products products={currentItems}/>
               <Pagination pageCount={pageCount} changePage={changePage}/>
            </>
         }
      </>
   )
}

export default PaginatedProducts