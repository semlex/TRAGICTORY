import styled from 'styled-components'
import { useParams } from 'react-router-dom'
import PaginatedProducts from '../components/PaginatedProducts'
import {categoryItems, sorting} from '../data'
import Select from '../components/Select'
import Dropdown from '../components/Dropdown'
import { Range } from 'rc-slider'
import 'rc-slider/assets/index.css'
import { md, sm } from '../responsive'
import { useEffect, useState } from 'react'
import { publicRequest } from '../utils/requests'
import Empty from "../components/Empty";

const Title = styled.div`
  max-width: 1100px;
  margin: 0 auto;
  padding: 20px 10px;
  h1 {
    text-transform: uppercase;
    font-family: 'Montserrat', sans-serif;
  }
`

const Filters = styled.div`
  width: 100%;
  max-width: 100vw;
  background: #f2fbfe
`

const FiltersWrapper = styled.div`
  max-width: 1100px;
  margin: 0 auto;
  padding: 20px 10px
`

const FiltersRow = styled.div`
  display: flex;
  flex-flow: row wrap;
  margin: 0 -10px
`

const Filter = styled.div`
  width: 16%;
  padding: 5px 10px;
  ${md({ width: '30%' })}
  ${sm({ width: '50%' })}
`

const Sorting = styled(Filter)`
  width: 22%;
  ${md({ width: '100%' })}
  margin-left: auto;
`

const FilterPrice = styled(Filter)`
  width: 20%;
  ${md({ width: '40%' })}
  ${sm({ width: '100%' })}
`

const RangeForm = styled.form`
  width: 100%;
  padding: 0 15px;
`

const PriceInput = styled.input`
  color: #333;
  border-radius: 2px;
  background-color: white;
  border: 1px solid #ccc;
`

const PriceInputLabel = styled.label`
  font-size: 15px;
  text-transform: uppercase;
`

const Min = styled(PriceInput)`
   width: 100%;
`

const Max = styled(PriceInput)`
   width: 100%;
`

const ProductsList = () => {
   const { category } = useParams()

   const [size, setSize] = useState('')
   const [brand, setBrand] = useState('')
   const [sort, setSort] = useState('')
   const [minPrice, setMinPrice] = useState(0)
   const [maxPrice, setMaxPrice] = useState(0)
   const [filters, setFilters] = useState({ sizes: [], brands: [], min_price: 0, max_price: 0 })
   const [products, setProducts] = useState([])

   useEffect(() => {
      const getProducts = async () => {
         await publicRequest.get(
            category
               ? `/products?category=${category}`
               : '/products'
         ).then((res) => {
            setProducts(res.data.products)
         }).catch((err) => {})
      }
      getProducts()
   }, [category])

   useEffect(() => {
      const getFilters = async () => {
         await publicRequest.get(
            category
               ? `/products/filters?category=${category}`
               : '/products/filters'
         ).then((res) => {
            setFilters(res.data)
            setMinPrice(res.data.min_price)
            setMaxPrice(res.data.max_price)
         }).catch((err) => {})
      };
      getFilters()
   }, [category])

   const changePriceRange = (range) => {
      setMinPrice(range[0])
      setMaxPrice(range[1])
   }

   return (
      <>
         <Title>
            <h1>
               {categoryItems.find(e => e.category === category).name}
            </h1>
         </Title>
         {products.length === 0 &&
         <Empty>
            Ничего не найдено
         </Empty>
         }
         {products.length > 0 &&
            <>
               <Filters>
                  <FiltersWrapper>
                     <FiltersRow>
                        <Filter>
                           <Select
                              placeholder={'Размер'}
                              selected={size}
                              setSelected={setSize}
                              options={filters.sizes}
                           />
                        </Filter>
                        <Filter>
                           <Select
                              placeholder={'Бренд'}
                              selected={brand}
                              setSelected={setBrand}
                              options={filters.brands}
                           />
                        </Filter>
                        <FilterPrice>
                           <Dropdown placeholder={'Цена'}>
                              <RangeForm>
                                 <Range
                                    min={filters.min_price}
                                    max={filters.max_price}
                                    defaultValue={[filters.min_price, filters.max_price]}
                                    value={[minPrice, maxPrice]}
                                    step={100}
                                    onChange={changePriceRange}
                                 />
                                 <PriceInputLabel htmlFor={'min_price'}>
                                    От
                                 </PriceInputLabel>
                                 <Min
                                    id={'min_price'}
                                    type='text'
                                    value={minPrice}
                                    onChange={(e) => setMinPrice(+e.target.value)}
                                 />
                                 <PriceInputLabel htmlFor={'max_price'}>
                                    До
                                 </PriceInputLabel>
                                 <Max
                                    id={'max_price'}
                                    type='text'
                                    value={maxPrice}
                                    onChange={(e) => setMaxPrice(+e.target.value)}
                                 />
                              </RangeForm>
                           </Dropdown>
                        </FilterPrice>
                        <Sorting>
                           <Select
                              placeholder={'Сортировка'}
                              selected={sort}
                              setSelected={setSort}
                              options={sorting}
                           />
                        </Sorting>
                     </FiltersRow>
                  </FiltersWrapper>
               </Filters>
               <PaginatedProducts
                  products={products.filter(item => item.countInStock > 0)}
                  category={category}
                  filters={
                     {
                        size: size.value,
                        brand: brand.value,
                        minPrice,
                        maxPrice
                     }
                  }
                  sort={sort.value}
                  itemsPerPage={20}
               />
            </>
         }
      </>
   )
}

export default ProductsList