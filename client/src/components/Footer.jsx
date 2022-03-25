import styled from 'styled-components'
import { sm, md } from '../responsive'
import { AiFillFacebook, AiOutlineInstagram, AiOutlineWhatsApp, AiOutlineMail } from 'react-icons/ai'
import { BsTelephoneFill } from 'react-icons/bs'
import { FaTelegramPlane } from 'react-icons/fa'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { openAuthModal } from '../redux/authModalSlice'


const Container = styled.div`
  width: 100%;
  background: #222222;
  color: #fff;
`

const Wrapper = styled.div`
  display: flex;
  flex-flow: row wrap;
  justify-content: flex-start;
  margin: 0 auto;
  max-width: 1100px;
  padding: 20px 10px;
  
  & > div {
    flex: 0 0 auto;
    padding: 0 15px;
  }

  ${sm({ flexDirection: 'column' })}
`

const Left = styled.div`
  width: 35%;
  ${md({ width: '45%' })}
  ${sm({ width: '100%' })}
`

const Center = styled.div`
  width: 40%;
  ${md({ width: '55%' })}
  ${sm({ display: 'none' })}
`

const Right = styled.div`
  display: flex;
  flex-flow: row wrap;
  width: 25%;
  ${md({ width: '100%' })}
  ${md({ marginTop: '15px' })}
  ${sm({ justifyContent: 'center' })}
`

const Logo = styled.h1`
  cursor: pointer;
  font-size: 24px;
  font-weight: 900;
  text-transform: uppercase;
  margin-bottom: 5px;
  ${sm({ textAlign: 'center' })}
`

const Desc = styled.p`
  margin: 12px 0;
  font-size: 12px;
  color: #555555;
  ${sm({ textAlign: 'center' })}
`

const Title = styled.h3`
  width: 100%;
  font-size: 20px;
  font-weight: 300;
  margin-bottom: 5px;
  ${sm({ textAlign: 'center' })}
`

const SocialNetworks = styled.div`
  display: flex;
  margin: -10px -5px;
  ${sm({ justifyContent: 'center' })}
`

const NetworkIcon = styled.div`
  color: #fff;
  font-size: 30px;
  padding: 0 5px;
`

const Links = styled.div`
   margin: 17px 0;
`

const LinkText = styled.div`
  cursor: pointer;
  font-size: 14px;
  color: #555555!important;
  transition: 0.35s;
  margin: 5px 0;
  
  &:hover {
    color: #fff!important;
  }
`

const Contact = styled.div`
  width: 100%;
  margin: 10px 0;
  display: flex;
  align-items: center;
  svg {
    font-size: 22px;
    margin-right: 10px;
  }
  ${sm({ justifyContent: 'center' })}
`

const Phone = styled.a`
  font-size: 15px;
  font-weight: 300;
  color: #fff;
`

const Mail = styled.a `
  font-size: 15px;
  font-weight: 300;
  color: #fff;
`

const Payment = styled.img`
  width: 100%;
  max-width: 266px;
`

const Footer = () => {
   const user = useSelector(state => state.user.currentUser)

   const navigate = useNavigate()
   const dispatch = useDispatch()

   const checkAuth = (e, path) => {
      e.preventDefault()

      if (user) {
         navigate(path)
      }
      else {
         dispatch(openAuthModal({status: 'login'}))
      }
   }

   return (
      <Container>
         <Wrapper>
            <Left>
               <Logo>Tragictory</Logo>
               <Desc>
                  Интернет-скейтшоп Tragictory – продажа коплектующих для скейтборда.
               </Desc>
               <Title>Соцсети</Title>
               <SocialNetworks>
                  <NetworkIcon>
                     <AiFillFacebook/>
                  </NetworkIcon>
                  <NetworkIcon>
                     <AiOutlineInstagram/>
                  </NetworkIcon>
                  <NetworkIcon>
                     <AiOutlineWhatsApp/>
                  </NetworkIcon>
                  <NetworkIcon>
                     <FaTelegramPlane/>
                  </NetworkIcon>
               </SocialNetworks>
            </Left>
            <Center>
               <Title>Полезные ссылки</Title>
               <Links>
                  <Link to={'/'}>
                     <LinkText>
                        Домашняя страница
                     </LinkText>
                  </Link>
                  <Link to={'/cart'}>
                     <LinkText>
                        Корзина
                     </LinkText>
                  </Link>
                  <Link
                     to={'/account'}
                     onClick={(e) => checkAuth(e, '/account')}
                  >
                     <LinkText>
                        Аккаунт
                     </LinkText>
                  </Link>
                  <Link
                     to={'/orders'}
                     onClick={(e) => checkAuth(e, '/orders')}
                  >
                     <LinkText>
                        Заказы
                     </LinkText>
                  </Link>
               </Links>
            </Center>
            <Right>
               <Title>
                  Связаться с нами
               </Title>
               <Contact>
                  <BsTelephoneFill/>
                  <Phone href={'tel:+78001004169'}>
                     8 953 253 00-47
                  </Phone>
               </Contact>
               <Contact>
                  <AiOutlineMail/>
                  <Mail href={'mailto:alexpskov60@gmail.com'}>
                     alexpskov60@gmail.com
                  </Mail>
               </Contact>
               <Payment src='https://www.skvot.com/img/payment-icons-footer.png'/>
            </Right>
         </Wrapper>
      </Container>
   )
}

export default Footer