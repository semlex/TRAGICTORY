import styled from 'styled-components'
import Input from './Input'
import Select from './Select'
import { categoriesTitles } from '../data'
import { md } from '../responsive'
import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage'
import app from '../firebase'
import { publicRequest, userRequest } from '../utils/requests'

const AddProductForm = styled.form`
  margin: 0 auto 0 0;
  padding: 10px 0;
  max-width: 400px;
`

const Label = styled.label`
  font-family: 'Monstreratt', sans-serif;
  display: block;
  margin: 8px 0;
  font-size: 18px;
  font-weight: 500;
`

const File = styled(Input)`
  width: auto;
  padding: 5px;
  margin: 0;
  border: none
`

const SelectWrapper = styled.div`
  font-family: 'Monstreratt', sans-serif;
  margin: 7px 0;
`

const TextArea = styled.textarea`
  display: flex;
  width: 100%;
  height: 75px;
  font-family: 'Montserrat',sans-serif;
  font-size: 14px;
  font-weight: 500;
  padding: 10px 20px;
  border-radius: 10px;
  border: 1px solid #c5c5c5;

  &[data-error="true"] {
    border: 1px solid #ff0000;
    background: #f7ecec;
  }
`

const Button = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: 0.35s;
  min-width: 150px;
  ${md({ width: "100%" })}
  color: #fff;
  font-family: 'Montserrat', sans-serif;
  font-weight: 400;
  font-size: 15px;
  border: 2px solid transparent;
  padding: 10px;
  margin: 15px 0;
  border-radius: 50px;
  background: #0077ff;
  
  &:hover {
    background: #fff;
    border: 2px solid #0077ff;
    color: #0077ff;
  }
`

const ProductForm = ({ type }) => {
   const { id } = useParams()

   const [file, setFile] = useState(null)
   const [title, setTitle] = useState('')
   const [category, setCategory] = useState('')
   const [brand, setBrand] = useState('')
   const [size, setSize] = useState('')
   const [desc, setDesc] = useState('')
   const [price, setPrice] = useState('')
   const [countInStock, setCountInStock] = useState('')
   const [product, setProduct] = useState({})

   const navigate = useNavigate()

   useEffect(() => {
      const getProduct = async () => {
         await publicRequest.get(`/products/${id}`).then((res) => {
            const fetchedProduct = res.data
            setProduct(fetchedProduct)
            setTitle(fetchedProduct.title)
            setCategory(categoriesTitles.find(item => item.value === fetchedProduct.category))
            setBrand(fetchedProduct.brand)
            setSize(fetchedProduct.size)
            setDesc(fetchedProduct.desc)
            setPrice(fetchedProduct.price)
            setCountInStock(fetchedProduct.countInStock)
         }).catch((err) => {})
      }
      if (type === 'edit') {
         getProduct()
      }
   }, [id, type])

   const handleSubmit = async (e) => {
      e.preventDefault()

      if ((!file && type === 'add') || !title || !category || !brand || !size || !desc || !price || !countInStock) {
         if ((!file && type === 'add')) {
            e.target.querySelector('#file').setAttribute('data-error', 'true')
         }
         if (!title) {
            e.target.querySelector('#title').setAttribute('data-error', 'true')
         }
         if (!category) {
            document.querySelector('#category').setAttribute('data-error', 'true')
         }
         if (!brand) {
            e.target.querySelector('#brand').setAttribute('data-error', 'true')
         }
         if (!size) {
            e.target.querySelector('#size').setAttribute('data-error', 'true')
         }
         if (!desc) {
            e.target.querySelector('#desc').setAttribute('data-error', 'true')
         }
         if (!price) {
            e.target.querySelector('#price').setAttribute('data-error', 'true')
         }
         if (!countInStock) {
            e.target.querySelector('#count_in_stock').setAttribute('data-error', 'true')
         }
      } else {
         if (type === 'add' || (type === 'edit' && file)) {
            const fileName = new Date().getTime() + file.name
            const storage = getStorage(app)
            const storageRef = ref(storage, fileName)
            const uploadTask = uploadBytesResumable(storageRef, file)

            uploadTask.on(
               'state_changed',
               (snapshot) => {
                  const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                  console.log(progress)
               },
               (error) => {
               },
               () => {
                  getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
                     const newProduct = {
                        title,
                        category: category.value,
                        brand,
                        size,
                        desc,
                        price,
                        countInStock,
                        img: downloadURL
                     }

                     if (type === 'add') {
                        await userRequest.post('/products/create', newProduct)
                           .then((res) => {
                              navigate('/edit/products')
                           }).catch((err) => {
                              console.log(err)
                           })
                     } else if (type === 'edit') {
                        await userRequest.put(`/products/update/${product._id}`, newProduct)
                           .then((res) => {
                              navigate('/edit/products')
                           }).catch((err) => {
                              console.log(err)
                           })
                     }
                  })
               }
            )
         } else {
            const newProduct = {
               title,
               category: category.value,
               brand,
               size,
               desc,
               price,
               countInStock
            }

            await userRequest.put(`/products/update/${product._id}`, newProduct)
               .then((res) => {
                  navigate('/edit/products')
               }).catch((err) => {
                  console.log(err)
               })
         }
      }
   }

   return (
      <AddProductForm onSubmit={handleSubmit}>
         <Label htmlFor={'file'}>
            Фото
         </Label>
         <File
            type={'file'}
            id={'file'}
            onChange={(e) => setFile(e.target.files[0])}
         />
         <Label htmlFor={'title'}>
            Название
         </Label>
         <Input
            type={'text'}
            id={'title'}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
         />
         <Label htmlFor={'category'}>
            Категория
         </Label>
         <SelectWrapper>
            <Select
               id={'category'}
               placeholder={'Категория'}
               selected={category}
               setSelected={setCategory}
               options={categoriesTitles}
            />
         </SelectWrapper>
         <Label htmlFor={'brand'}>
            Бренд
         </Label>
         <Input
            type={'text'}
            id={'brand'}
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
         />
         <Label htmlFor={'size'}>
            Размер
         </Label>
         <Input
            type={'text'}
            id={'size'}
            value={size}
            onChange={(e) => setSize(e.target.value)}
         />
         <Label htmlFor={'count_in_stock'}>
            В наличии, шт.
         </Label>
         <Input
            type={'number'}
            id={'count_in_stock'}
            value={countInStock}
            min={0}
            max={100000}
            onChange={(e) => setCountInStock(e.target.value)}
         />
         <Label htmlFor={'price'}>
            Цена, руб.
         </Label>
         <Input
            type={'number'}
            id={'price'}
            min={0}
            value={price}
            onChange={(e) => setPrice(e.target.value)}
         />
         <Label htmlFor={'desc'}>
            Описание
         </Label>
         <TextArea
            type={'text'}
            id={'desc'}
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
         />
         {type === 'add' &&
            <Button type={'submit'}>
            Добавить
            </Button>
         }
         {type === 'edit' &&
         <Button type={'submit'}>
            Сохранить
         </Button>
         }
      </AddProductForm>
   )
}

export default ProductForm