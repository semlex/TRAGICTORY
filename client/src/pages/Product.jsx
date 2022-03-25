import styled from 'styled-components'
import { sm, md } from '../responsive'
import { MdOutlineAddShoppingCart } from 'react-icons/md'
import { FaRegThumbsUp } from 'react-icons/fa'
import { FiCreditCard } from 'react-icons/fi'
import { RiCloseFill } from 'react-icons/ri'
import { IoIosCloseCircle } from 'react-icons/io'
import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { addProduct } from '../redux/cartSlice'
import { Link, useParams } from 'react-router-dom'
import { openAuthModal } from '../redux/authModalSlice'
import { publicRequest, userRequest } from '../utils/requests'
import moment from 'moment'

const Container = styled.div`
  max-width: 1100px;
  padding: 10px;
  margin: 0 auto;
`

const Name = styled.h1`
  padding: 10px 0;
  font-size: 26px;
`

const Row = styled.div`
  padding: 10px 35px;
  ${md({padding: "10px 0"})};
  display: flex;
  flex-flow: row wrap;
`

const ImgContainer = styled.div`
  border: 1px solid #e6e6e6;
  width: 40%;
  ${md({width: "100%"})}
`

const Image = styled.img`
  width: 100%;
  max-height: 350px;
  object-position: center center;
  object-fit: contain
`

const Info = styled.div`
  padding: 0 30px;
  ${md({ padding: "0" })};
  width: 60%;
  ${md({width: "100%"})}
`

const Price = styled.div`
  font-family: "Montserrat", sans-serif;
  color: #3a54d6;
  font-size: 30px;
  padding-top: 10px;
  font-weight: 600;
`

const OutOfStock = styled.div`
  display: flex;
  font-size: 25px;
  font-weight: 600;
  margin: 30px 0;
  align-items: center;
  color: #811a1a;
  
  span {
    font-family: 'Monstreratt', sans-serif;
  }
  
  svg {
    margin-right: 5px;
    font-size: 18px;
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
  margin: 30px 0;
  border-radius: 50px;
  background: #0077ff;
  
  &:hover {
    background: #fff;
    border: 2px solid #0077ff;
    color: #0077ff;
  }
`

const ToCartButton = styled(Button)`
  background: #feb312;
  color: #fff;
  padding: 10px 30px;

  &:hover {
    background: #feb312;
    border: 2px solid #feb312;
    color: #3a54d6;
  }
  
`

const ButtonIcon = styled.div`
  display: inline-block;
  line-height: 1;
  font-size: 20px;
  margin-right: 5px;
`

const ButtonText = styled.span``

const Availability = styled.div`
  font-family: "Montserrat", sans-serif;
  font-size: 14px;
  font-weight: 600;
`

const Services = styled.div`
  display: flex;
  flex-flow: row wrap;
  margin: 25px 0 0 0;
  padding: 5px 0;
  border-bottom: 1px solid #e6e6e6;
`

const Service = styled.div`
  display: flex;
  align-items: center;
  margin: 5px 0;
  flex: 1 0 200px
`

const ServiceIcon = styled.div`
  display: inline-block;
  margin-right: 10px;
  font-size: 25px;
  color: #0099b9;
`

const ServiceText = styled.span`
  font-family: "Montserrat", sans-serif;
  font-size: 14px;
  font-weight: 600;
`

const Desc = styled.div`
  width: 40%;
  ${md({width: "100%"})}
`

const DescTitle = styled.h2`
  font-family: "Montserrat", sans-serif;
  font-weight: 600;
  font-size: 18px;
  margin: 15px 0;
`

const DescText = styled.div`
  font-family: "Montserrat", sans-serif;
  font-size: 14px;
  font-weight: 400;
`

const Feedbacks = styled.div`
  padding: 30px 35px;
  font-size: 14px;
  ${md({padding: "30px 0"})}
  margin-top: 20px;
`

const FeedbacksTitle = styled.h2`
  font-size: 18px;
  font-weight: 700;
  margin: 15px 0;
`

const FeedbackList = styled.div`
   
`

const Feedback = styled.div`
  padding: 10px 0;
  position: relative;
  border-top: 1px solid #c5c5c5;

  &:last-child {
    border-bottom: 1px solid #c5c5c5;
  }
`

const FeedbackDelete = styled.button`
  display: ${(props) => props.isVisible ? 'inline-block' : 'none'};
  cursor: pointer;
  background: transparent;
  border: none;
  position: absolute;
  top: 0;
  right: 0;
  font-size: 14px;
  line-height: 0;
  padding: 10px;
`

const FeedbackName = styled.div`
  font-family: 'Montserrat', sans-serif;
  color: #3a54d6;
  font-weight: 600;
  margin-bottom: 15px;
`

const FeedbackText = styled.div`
  font-family: 'Montserrat', sans-serif;
  font-weight: 400;
  margin-bottom: 10px;
  overflow-wrap: break-word
`

const FeedbackDate = styled.div`
  font-family: 'Montserrat', sans-serif;
  font-weight: 600;
`

const AddFeedbackForm = styled.form`
  padding: 0 50px;
  ${md({padding: '0 15px'})}
`

const WriteFeedback = styled.textarea`
  display: flex;
  width: 100%;
  height: 100px;
  font-size: 14px;
  padding: 10px;
  border-radius: 10px;
  border: 1px solid #c5c5c5;
`

const FeedbackButton = styled.div`
  display: flex;
  justify-content: right;
  text-align: right;
`

const Authorize = styled.div`
  font-family: 'Monstreratt', sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: 25px;
  padding: 20px;
  ${sm({padding: '15px 0'})};
  color: #111111;
`

const AuthorizeLink = styled.a`
  cursor: pointer;
  color: #0066CCFF;
  font-family: inherit;
`

const Product = () => {
   const { id } = useParams()
   const [product, setProduct] = useState({})
   const [comment, setComment] = useState('')
   const [isAddedToCart, setIsAddedToCart] = useState(false)

   const user = useSelector(state => state.user).currentUser

   const dispatch = useDispatch()

   useEffect(() => {
      const getProduct = async () => {
         await publicRequest.get(`/products/${id}`).then((res) => {
            setProduct(res.data)
         }).catch((err) => {})
      }
      getProduct()
   }, [id])

   const addToCart = () => {
      dispatch(
         addProduct({
            _id: product._id,
            title: product.title,
            img: product.img,
            price: product.price,
            size: product.size,
            countInStock: product.countInStock
         })
      )

      setIsAddedToCart(true)
   }

   const addFeedback = async (e) => {
      e.preventDefault()
      try {
         const feedback = {
            name: user.name,
            comment
         }
         setComment('')
         await userRequest.post(`/products/feedback/${id}`, feedback)
            .then((res) => {
               setProduct({...product,
                  feedbacks: [...product.feedbacks, res.data]
               })
            })
      } catch(err) {}
   }

   const deleteFeedback = async (feedbackId) => {
      try {
         await userRequest.post(`products/feedback/delete/${id}`, { feedbackId })
            .then((res) => {
               setProduct({
                  ...product,
                  feedbacks: [...product.feedbacks.filter(elem => elem._id !== feedbackId)]
               })
            })
      } catch(err) {}
   }

   return (
      <Container>
         <Name>
            {product.title}
         </Name>
         <Row>
            <ImgContainer>
               <Image src={product.img}/>
            </ImgContainer>
            <Info>
               <Price>
                  {Intl.NumberFormat('ru-RU', {
                     style: 'currency',
                     currency: 'RUB',
                     minimumFractionDigits: 0
                  }).format(product.price)}
               </Price>
               {product.countInStock <= 0 &&
               <OutOfStock>
                  <IoIosCloseCircle/>
                  <span>Товара нет в наличии</span>
               </OutOfStock>}
               {!isAddedToCart && product.countInStock > 0 &&
                  <Button onClick={addToCart}>
                     <ButtonIcon>
                        <MdOutlineAddShoppingCart/>
                     </ButtonIcon>
                     <ButtonText>
                        В корзину
                     </ButtonText>
                  </Button>
               }
               {isAddedToCart && product.countInStock > 0 &&
                  <Link to={'/cart'}>
                     <ToCartButton>
                        <ButtonText>
                           Перейти в корзину
                        </ButtonText>
                     </ToCartButton>
                  </Link>
               }
               {product.countInStock > 0 &&
                  <Availability>
                     Товар в наличии и готов к отправке. Передача в курьерские службы в течение 1 рабочего дня.
                  </Availability>
               }
               <Services>
                  <Service>
                     <ServiceIcon>
                        <FaRegThumbsUp/>
                     </ServiceIcon>
                     <ServiceText>
                        100% гарантия подлинности товара
                     </ServiceText>
                  </Service>
                  <Service>
                     <ServiceIcon>
                        <FiCreditCard/>
                     </ServiceIcon>
                     <ServiceText>
                        Скидки по дисконтной карте
                     </ServiceText>
                  </Service>
               </Services>
            </Info>
            <Desc>
               <DescTitle>
                  Описание товара
               </DescTitle>
               <DescText>
                  {product.desc}
               </DescText>
            </Desc>
         </Row>
         <Feedbacks>
            <FeedbacksTitle>
               Отзывы о товаре
            </FeedbacksTitle>
            <FeedbackList>
               {product.feedbacks && product.feedbacks.length > 0 &&
               product.feedbacks.map((item, i) => (
                  <Feedback key={i}>
                     <FeedbackName>
                        {item.name}
                     </FeedbackName>
                     <FeedbackDelete
                        isVisible={user && user.isAdmin}
                        onClick={() => deleteFeedback(item._id)}
                     >
                        <RiCloseFill/>
                     </FeedbackDelete>
                     <FeedbackText>
                        {item.comment}
                     </FeedbackText>
                     <FeedbackDate>
                        {
                           moment(item.createdAt).format('DD.MM.YYYY HH:mm')
                        }
                     </FeedbackDate>
                  </Feedback>
               ))}
               {(!product.feedbacks || product.feedbacks.length === 0) &&
               <FeedbackText>
                  Отзывы отсутствуют, но ты можешь быть первым ;)
               </FeedbackText>
               }
            </FeedbackList>
            {user &&
               <>
                  <FeedbacksTitle>
                     Пожалуйста, оставьте ваш отзыв
                  </FeedbacksTitle>
                  <AddFeedbackForm
                     onSubmit={addFeedback}
                  >
                     <WriteFeedback
                        placeholder={'Напишите, что вы думаете о этом товаре'}
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                     />
                     <FeedbackButton>
                        <Button type={'submit'}>
                           <ButtonText>
                              Добавить
                           </ButtonText>
                        </Button>
                     </FeedbackButton>
                  </AddFeedbackForm>
               </>}
            {!user &&
            <Authorize>
               Отзывы могут оставлять только <AuthorizeLink
                  onClick={() => dispatch(openAuthModal({status: 'register'}))}
               >
                  зарегистрированные
            </AuthorizeLink> пользователи
               <br/>
               <AuthorizeLink
                  onClick={() => dispatch(openAuthModal({status: 'login'}))}
               >
                  Авторизоваться и оставить отзыв
               </AuthorizeLink>
            </Authorize>}
         </Feedbacks>
      </Container>
   )
}

export default Product