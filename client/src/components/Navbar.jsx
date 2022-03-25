import styled from 'styled-components'
import { sm } from '../responsive'
import { FaUserAlt, FaSearch, FaWarehouse, FaClipboardList } from 'react-icons/fa'
import { BsFillCartFill, BsBagCheck } from 'react-icons/bs'
import { MdClose, MdAdminPanelSettings } from 'react-icons/md'
import { BiUser } from 'react-icons/bi'
import { FiUsers } from 'react-icons/fi'
import { useState, useEffect, useRef } from 'react'
import { categoryItems } from '../data';
import closeByClickOutside from '../utils/closeByClickOutside'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { openAuthModal } from '../redux/authModalSlice'
import { fullDeleteProduct, clearCart } from '../redux/cartSlice'
import { logout } from '../redux/apiCalls'

const Container = styled.header`
  position: fixed;
  width: 100%;
  color: #ffff;
  background: #000;
  z-index: 999
`;

const Wrapper = styled.div`
  margin: 0 auto;
  display: flex;
  font-size: 20px;
  align-items: center;
  justify-content: space-between;
  max-width: 1100px;
`;

const Left = styled.div`
  display: flex;
  width: 103px;
  cursor: pointer;
`;

const Center = styled.div`
  cursor: default;
`;

const Right = styled.div`
  display: flex;
  justify-content: center;
`

const Logo = styled.h1`
  color: #fff;
  font-size: 26px;
  ${sm({ fontSize: '22px' })}
  font-weight: 900;
  text-transform: uppercase;
`

const ToggleMenuButton = styled.div`
  box-sizing: content-box;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 23px;
  height: 20px;
  padding: 15px;
  font-size: 20px;
  position: relative;
  transition: 0.2s;
  background: none;
  color: #ffff;
  border: none;
  cursor: pointer;
  &:hover {
    background: #0077ff
  }
  ${({isOpen}) => isOpen && `
    background: #0077ff
  `}
`;

const Hamburger = styled.span`
  width: 23px;
  height: 1.5px;
  background: #fff;
  border-radius: 10px;
  transition: all .5s ease-in-out;
  
  &::before, &::after {
    content: '';
    width: 23px;
    height: 1.5px;
    position: absolute;
    border-radius: 15px;
    background: #fff;
    transition: all .5s ease-in-out
  }
  &::before {
    transform: translateY(-7px);
  }
  &::after {
    transform: translateY(7px);
  }

  ${({ isOpen }) => isOpen && `
    transform: translateX(-50px);
    background: transparent;
    box-shadow: none;
    
    &::before {
      transform: rotate(45deg) translate(35px, -35px);
    }
    &::after {
      transform: rotate(-45deg) translate(35px, 35px);
    }
  `}
`

const HeaderButton = styled.button`
  display: none;
  position: relative;
  background: none;
  border: none;
  padding: 0;

  ${({ isVisible }) => isVisible && `
    display: inline-block
  `};

  ${sm({ display: 'inline-block' })}
`

const HeaderButtonInner = styled.div`
  cursor: pointer;
  font-size: 20px;
  color: #ffff;
  padding: 15px;
  line-height: 0;
`

const CartCount = styled.div`
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  top: 6px;
  right: 2px;
  background-color: #27a6ff;
  -webkit-border-radius: 50%;
  border-radius: 50%;
  width: 16px;
  height: 16px;
  text-align: center;
  font-size: 10px;
  padding: 4px 0;
  color: #FFFFFF;
`

const Popup = styled.div`
  display: ${(props) => props.isOpen ? 'block' : 'none'};
  position: absolute;
  z-index: 990;
  top: 100%;
  right: 0;
  width: 180px;
  box-shadow: 0 4px 13px 3px rgba(0, 0, 0, 0.15)
`

const PopupItem = styled.div`
  display: flex;
  align-items: center;
  padding: 12px 15px;
  background: #fff;
  color: #545454;

  &:hover {
    background: #eeeeee
  }
`

const PopupItemIcon = styled.div`
  font-size: 18px;
  margin-right: 10px;
  color: ${props => props.color}
`

const PopupItemText = styled.span`
  font-size: 15px;
`

const AdminPopup = styled(Popup)`
  left: 0
`

const CartPopup = styled(Popup)`
  width: 310px;
  line-height: 1;
`

const CartPopupHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 22px;
  background: #ebebeb;
`

const CartPopupTitle = styled.h2`
  font-size: 18px;
  font-weight: 500;
  color: #111111;
  line-height: 1;
`

const CartPopupClean = styled.div`
  font-size: 13px;
  cursor: pointer;
  color: #999999;
  border-bottom: 1px solid transparent;
  transition: 0.35s;
  padding-bottom: 1px;
  line-height: 1;
  
  &:hover {
    border-bottom: 1px solid rgba(58, 84, 214, 0.4);
    color: #3a54d6;
  }
`

const CartPopupMain = styled.div`
  max-height: 260px;
  overflow-y: auto;
`

const CartPopupItem = styled.div`
  display: flex;
  padding: 15px;
  background: #fff;
  border-bottom: 1px solid #e6e6e6;
  border-top: 1px solid #e6e6e6;
  
  &:not(:first-child) {
    border-top: none;
  }
`

const CartPopupItemImage = styled.div`
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

const CartPopupItemContent = styled.div`
   text-align: left
`

const CartPopupItemTitle = styled(Link)`
  font-size: 14px;
  line-height: 18px;
  color: #333333;
  transition: 0.35s;
  border-bottom: 1px solid transparent;
  
  &:hover {
    border-bottom: 1px solid #bbbbbb;
  }
`

const CartPopupItemBottom = styled.div`
  display: flex;
  align-items: center;
  margin-top: 10px;
`

const CartPopupItemPrice = styled.div`
  font-family: 'Monstreratt', sans-serif;
  color: #3a54d6;
  font-size: 16px;
  font-weight: 600;
`

const CartPopupItemQty = styled.div`
  font-size: 12px;
  color: #111111;
  margin: 0 15px;
  padding-bottom: 2px;
`

const CartPopupFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background: #3a54d6;
  color: #fff;
`

const CartPopupTotal = styled.div`
  font-family: 'Montserrat', sans-serif;
  font-size: 16px;
  font-weight: 600;
`

const CartPopupCheckout = styled(Link)`
  font-family: 'Montserrat', sans-serif;
  font-size: 14px;
  font-weight: 600;
  padding: 14px 27px;
  border-radius: 50px;
  background: #fff;
  transition: 0.1s;
  color: #000;
  
  &:hover {
    color: #3a54d6;
  }
`

const SearchPanel = styled.form`
  display: inline-block;
  ${sm({ display: 'none' })}
`

const SearchInput = styled.input`
  width: 0;
  padding: 13px 0;
  color: #fff;
  background: #252525;
  border: none;
  font-size: 16px;
  line-height: 0;
  transition: width 0.5s;

  &::placeholder {
    color: #555555;
  }

  ${({isOpen}) => isOpen && `
    width: 300px;
    padding: 13px
  `}
`

const SearchButton = styled.button`
  font-size: 20px;
  background: none;
  color: #ffff;
  border: none;
  cursor: pointer;
  transition: 0.2s;
  padding: 15px;
  line-height: 0;
  
  ${sm({ display: 'none' })}

  &:hover {
    background: #0077ff
  }
`

const CategoriesWrapper = styled.div`
  max-width: 1100px;
  margin: 0 auto;
  position: relative
`

const HeaderCategories = styled.div`
  display: ${(props) => props.isOpen ? 'flex' : 'none'};
  flex-direction: column;
  position: absolute;
  z-index: 999;
  overflow: auto;
  max-height: calc(-60px + 100vh);
  left: 0;
  top: 100%;
  padding: 15px 80px 15px 30px;
  ${sm({ padding: '15px' })}
  ${sm({ width: '100%' })}
  background: #0077ff;
`

const HeaderCategory = styled.div`
  cursor: pointer;
  color: white;
  font-family: 'Montserrat', sans-serif;
  font-size: 14px;
  letter-spacing: .07em;
  font-weight: 600;
  margin-bottom: 16.5px;
  ${sm({ padding: '0 15px' })}
  text-transform: uppercase;
`

const MobileSearch = styled.form`
  display: none;
  width: 100%;
  ${sm({ display: 'block' })}
`

const MobileInput = styled.input`
  width: 100%;
  padding: 5px;
  font-size: 20px;
  outline: none;
  border: none;
  background: #FFF;
  color: #000;
  text-align: left;
  margin-bottom: 11px;
`

const Navbar = () => {
   const user = useSelector(state => state.user.currentUser)
   const cart = useSelector(state => state.cart)

   const [menuOpened, setMenuOpened] = useState(false)
   const [searchOpened, setSearchOpened] = useState(false)
   const [userPopupOpened, setUserPopupOpened] = useState(false)
   const [adminPopupOpened, setAdminPopupOpened] = useState(false)
   const [cartPopupOpened, setCartPopupOpened] = useState(false)
   const [disableMenuBtn, setDisableMenuBtn] = useState(false)
   const [disableSearchBtn, setDisableSearchBtn] = useState(false)
   const [disableUserPopupBtn, setDisableUserPopupBtn] = useState(false)
   const [disableAdminPopupBtn, setDisableAdminPopupBtn] = useState(false)
   const [disableCartPopupBtn, setDisableCartPopupBtn] = useState(false)
   const [searchTerm, setSearchTerm] = useState('')

   const headerMenuRef = useRef()
   const searchPanelRef = useRef()
   const userPopupRef = useRef()
   const adminPopupRef = useRef()
   const cartPopupRef = useRef()

   const dispatch = useDispatch()

   const navigate = useNavigate()

   useEffect(() => {

      document.addEventListener('mousedown', (e) => {
         if (menuOpened) {
            closeByClickOutside(e, headerMenuRef, setMenuOpened, menuOpened)
            setDisableMenuBtn(true)
         }
         else {
            setDisableMenuBtn(false)
         }
      })

      return () => {
         document.removeEventListener('mousedown', closeByClickOutside)
      }
   }, [menuOpened])

   useEffect(() => {

      document.addEventListener('mousedown', (e) => {
         if (searchOpened) {
            closeByClickOutside(e, searchPanelRef, setSearchOpened, searchOpened)
            setDisableSearchBtn(true)
         }
         else {
            setDisableSearchBtn(false)
         }
      })

      return () => {
         document.removeEventListener('mousedown', closeByClickOutside)
      }
   }, [searchOpened])

   useEffect(() => {

      document.addEventListener('mousedown', (e) => {
         if (userPopupOpened) {
            closeByClickOutside(e, userPopupRef, setUserPopupOpened, userPopupOpened)
            setDisableUserPopupBtn(true)
         }
         else {
            setDisableUserPopupBtn(false)
         }
      })

      return () => {
         document.removeEventListener('mousedown', closeByClickOutside)
      }
   }, [userPopupOpened])

   useEffect(() => {

      document.addEventListener('mousedown', (e) => {
         if (adminPopupOpened) {
            closeByClickOutside(e, adminPopupRef, setAdminPopupOpened, adminPopupOpened)
            setDisableAdminPopupBtn(true)
         }
         else {
            setDisableAdminPopupBtn(false)
         }
      })

      return () => {
         document.removeEventListener('mousedown', closeByClickOutside)
      }
   }, [adminPopupOpened])

   useEffect(() => {

      document.addEventListener('mousedown', (e) => {
         if (cartPopupOpened) {
            closeByClickOutside(e, cartPopupRef, setCartPopupOpened, cartPopupOpened)
            setDisableCartPopupBtn(true)
         }
         else {
            setDisableCartPopupBtn(false)
         }
      })

      return () => {
         document.removeEventListener('mousedown', closeByClickOutside)
      }
   }, [cartPopupOpened])

   const clickOnMenu = () => {
      if (!disableMenuBtn) {
         setMenuOpened(!menuOpened)
      }
   }

   const clickOnAdmin = () => {
      if (!disableAdminPopupBtn) {
         setAdminPopupOpened(!adminPopupOpened)
      }
   }

   const clickOnUser = () => {
      if (!user) {
         dispatch(openAuthModal({status: 'login'}))
      }
      else {
         if (!disableUserPopupBtn) {
            setUserPopupOpened(true)
         }
      }
   }

   const clickOnCart = () => {
      if (!disableCartPopupBtn) {
         setCartPopupOpened(!cartPopupOpened)
      }
   }

   const clickOnSearch = () => {
      if (!disableSearchBtn) {
         setSearchOpened(!searchOpened)
      }
   }

   const search = (e) => {
      e.preventDefault()

      if (searchTerm) {
         navigate(`/search/${searchTerm}`)
         setSearchTerm('')
         setSearchOpened(false)
         setMenuOpened(false)
      }
   }

   const logoutClick = () => {
      logout(dispatch)
      setUserPopupOpened(false)
   }

   return (
      <>
         <Container>
            <Wrapper>
               <Left>
                  <ToggleMenuButton
                     onClick={clickOnMenu}
                     isOpen={menuOpened}>
                     <Hamburger isOpen={menuOpened}/>
                  </ToggleMenuButton>
                  <HeaderButton
                     isVisible={user && user.isAdmin}
                     onClick={clickOnAdmin}
                  >
                     <HeaderButtonInner>
                        <MdAdminPanelSettings/>
                     </HeaderButtonInner>
                     <AdminPopup
                        isOpen={adminPopupOpened}
                        ref={adminPopupRef}
                     >
                        <Link
                           to={'/edit/users'}
                           onClick={() => setAdminPopupOpened(false)}
                        >
                           <PopupItem>
                              <PopupItemIcon color={'#0058c5'}>
                                 <FiUsers/>
                              </PopupItemIcon>
                              <PopupItemText>
                                 Пользователи
                              </PopupItemText>
                           </PopupItem>
                        </Link>
                        <Link
                           to={'/edit/products'}
                           onClick={() => setAdminPopupOpened(false)}
                        >
                           <PopupItem>
                              <PopupItemIcon color={'#5e4900'}>
                                 <FaWarehouse/>
                              </PopupItemIcon>
                              <PopupItemText>
                                 Товары
                              </PopupItemText>
                           </PopupItem>
                        </Link>
                        <Link
                           to={'/edit/orders'}
                           onClick={() => setAdminPopupOpened(false)}
                        >
                           <PopupItem>
                              <PopupItemIcon color={'#efbe00'}>
                                 <FaClipboardList/>
                              </PopupItemIcon>
                              <PopupItemText>
                                 Заказы
                              </PopupItemText>
                           </PopupItem>
                        </Link>
                     </AdminPopup>
                  </HeaderButton>
               </Left>
               <Center>
                  <Link to={'/'}>
                     <Logo>
                        Tragictory
                     </Logo>
                  </Link>
               </Center>
               <Right>
                  <HeaderButton
                     isVisible={!searchOpened}
                     onClick={clickOnUser}
                  >
                     <HeaderButtonInner>
                        <FaUserAlt/>
                     </HeaderButtonInner>
                     <Popup
                        isOpen={userPopupOpened}
                        ref={userPopupRef}
                     >
                        <Link
                           to={'/account'}
                           onClick={() => setUserPopupOpened(false)}
                        >
                           <PopupItem>
                              <PopupItemIcon color={'#0077ff'}>
                                 <BiUser/>
                              </PopupItemIcon>
                              <PopupItemText>
                                 Аккаунт
                              </PopupItemText>
                           </PopupItem>
                        </Link>
                        <Link
                           to={'/orders'}
                           onClick={() => setUserPopupOpened(false)}
                        >
                           <PopupItem>
                              <PopupItemIcon color={'#ebbd34'}>
                                 <BsBagCheck/>
                              </PopupItemIcon>
                              <PopupItemText>
                                 Заказы
                              </PopupItemText>
                           </PopupItem>
                        </Link>
                        <PopupItem onClick={logoutClick}>
                           <PopupItemIcon color={'#eb4934'}>
                              <BsBagCheck/>
                           </PopupItemIcon>
                           <PopupItemText>
                              Выход
                           </PopupItemText>
                        </PopupItem>
                     </Popup>
                  </HeaderButton>
                  <HeaderButton isVisible={!searchOpened}>
                     <HeaderButtonInner onClick={clickOnCart}>
                        <CartCount>
                           { cart.quantity }
                        </CartCount>
                        <BsFillCartFill />
                     </HeaderButtonInner>
                     <CartPopup
                        isOpen={cartPopupOpened}
                        ref={cartPopupRef}>
                        {cart.quantity === 0 &&
                           <CartPopupHeader>
                              <CartPopupTitle>
                                 Моя корзина пуста
                              </CartPopupTitle>
                           </CartPopupHeader>
                        }
                        {cart.quantity > 0 &&
                           <>
                              <CartPopupHeader>
                                 <CartPopupTitle>
                                    Моя корзина ({ cart.quantity })
                                 </CartPopupTitle>
                                 <CartPopupClean onClick={() => dispatch(clearCart())}>
                                    Очистить корзину
                                 </CartPopupClean>
                              </CartPopupHeader>
                              <CartPopupMain>
                                 {cart.products.map((item, i) => (
                                    <CartPopupItem key={i}>
                                       <CartPopupItemImage>
                                          <img src={item.img} alt={'product'}/>
                                       </CartPopupItemImage>
                                       <CartPopupItemContent>
                                          <CartPopupItemTitle
                                             to={`/product/${item._id}`}
                                             onClick={() => setCartPopupOpened(false)}
                                          >
                                             {item.title}
                                          </CartPopupItemTitle>
                                          <CartPopupItemBottom>
                                             <CartPopupItemPrice>
                                                {Intl.NumberFormat('ru-RU', {
                                                   style: 'currency',
                                                   currency: 'RUB',
                                                   minimumFractionDigits: 0
                                                }).format(item.price)}
                                             </CartPopupItemPrice>
                                             <CartPopupItemQty>
                                                {item.quantity} шт.
                                             </CartPopupItemQty>
                                             <CartPopupClean
                                                onClick={() => dispatch(fullDeleteProduct({_id: item._id}))}
                                             >
                                                Удалить
                                             </CartPopupClean>
                                          </CartPopupItemBottom>
                                       </CartPopupItemContent>
                                    </CartPopupItem>
                                 ))}
                              </CartPopupMain>
                              <CartPopupFooter>
                                 <CartPopupTotal>
                                    Всего: {Intl.NumberFormat('ru-RU', {
                                    style: 'currency',
                                    currency: 'RUB',
                                    minimumFractionDigits: 0
                                 }).format(cart.total)}
                                 </CartPopupTotal>
                                 <CartPopupCheckout
                                    to={'/cart'}
                                    onClick={() => setCartPopupOpened(false)}
                                 >
                                    Оформить
                                 </CartPopupCheckout>
                              </CartPopupFooter>
                           </>
                        }
                     </CartPopup>
                  </HeaderButton>
                  <SearchPanel
                     ref={searchPanelRef}
                     onSubmit={search}>
                     <SearchInput
                        type={'text'}
                        value={searchTerm}
                        placeholder={'Введите слово для поиска'}
                        isOpen={searchOpened}
                        onChange={(e) => setSearchTerm(e.target.value)}/>
                  </SearchPanel>
                  <SearchButton onClick={clickOnSearch}>
                     {!searchOpened && <FaSearch/>}
                     {searchOpened && <MdClose/>}
                  </SearchButton>
               </Right>
            </Wrapper>
            <CategoriesWrapper ref={headerMenuRef}>
               <HeaderCategories isOpen={menuOpened}>
                  <MobileSearch onSubmit={search}>
                     <MobileInput
                        type={'text'}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder={'Поиск'}/>
                  </MobileSearch>
                  {categoryItems.map((item, i) => (
                     <Link
                        key={i}
                        onClick={() => setMenuOpened(false)}
                        to={`/products/${item.category}`}
                     >
                        <HeaderCategory>
                           {item.name}
                        </HeaderCategory>
                     </Link>
                  ))}
               </HeaderCategories>
            </CategoriesWrapper>
         </Container>
      </>
   )
}

export default Navbar