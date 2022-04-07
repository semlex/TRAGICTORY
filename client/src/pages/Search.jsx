import styled from 'styled-components'
import { md, sm } from '../responsive'
import { useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { publicRequest } from '../utils/requests'
import PaginatedProducts from '../components/PaginatedProducts'
import Select from '../components/Select'
import Empty from '../components/Empty'
import Dropdown from '../components/Dropdown'
import { Range } from 'rc-slider'
import { sorting, categoriesTitles } from '../data'

const Title = styled.div`
  max-width: 1100px;
  margin: 0 auto;
  padding: 20px 10px;
  h1 {
    font-family: 'Montserrat', sans-serif;
    font-size: 30px;
    ${md({ fontSize: '22px' })};
    ${sm({ fontSize: '18px' })};
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

const Search = () => {
   const { term } = useParams()

   const [category, setCategory] = useState('')
   const [size, setSize] = useState('')
   const [brand, setBrand] = useState('')
   const [sort, setSort] = useState('')
   const [minPrice, setMinPrice] = useState(0)
   const [maxPrice, setMaxPrice] = useState(0)
   const [categories, setCategories] = useState([])
   const [filters, setFilters] = useState({ sizes: [], brands: [], min_price: 0, max_price: 0 })
   const [products, setProducts] = useState([])

   useEffect(() => {
      const getProducts = async () => {
         await publicRequest.get(`/products?search=${term}`).then((res) => {
            setProducts(res.data.products)
            setCategories(res.data.categories.map((item) => ({
               title: categoriesTitles.find((elem) => elem.value === item).title,
               value: item
            })))
         }).catch((err) => {})
      }
      getProducts()
   }, [term])

   useEffect(() => {
      const getFilters = async () => {
         await publicRequest.get(
            category
               ? `/products/filters?search=${term}&category=${category.value}`
               : `/products/filters?search=${term}`
         ).then((res) => {
            setFilters(res.data)
            if (size && !res.data.sizes.includes(size)) {
               setSize('')
            }
            if (brand && !res.data.brands.includes(brand)) {
               setBrand('')
            }
            setMinPrice(res.data.min_price)
            setMaxPrice(res.data.max_price)
         }).catch((err) => {})
      }
      getFilters()
   }, [term, category])

   const changePriceRange = (range) => {
      setMinPrice(range[0])
      setMaxPrice(range[1])
   }

   return (
      <>
         <Title>
            <h1>Вы искали: {term}</h1>
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
                              placeholder={'Категория'}
                              selected={category}
                              setSelected={setCategory}
                              options={categories}
                           />
                        </Filter>
                        {category &&
                        <Filter>
                           <Select
                              placeholder={'Размер'}
                              selected={size}
                              setSelected={setSize}
                              options={filters.sizes}
                           />
                        </Filter>}
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
                  category={category.value}
                  products={products}
                  filters={
                     {
                        size: size.value,
                        brand: brand.value,
                        minPrice,
                        maxPrice,
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

export default Search