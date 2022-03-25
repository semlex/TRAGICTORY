import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ScrollButton from './components/ScrollButton'
import Modal from './components/Modal'
import Auth from './components/Auth'
import ScrollToTop from './components/ScrollToTop'
import Home from './pages/Home'
import AddProduct from './pages/AddProduct'
import EditProduct from './pages/EditProduct'
import ProductsList from './pages/ProductsList'
import Search from './pages/Search'
import Product from './pages/Product'
import Cart from './pages/Cart'
import Ordering from './pages/Ordering'
import Orders from './pages/Orders'
import OrdersEdit from './pages/OrdersEdit'
import UsersList from './pages/UsersList'
import Order from './pages/Order'
import AccountSettings from './pages/AccountSettings'
import { useSelector } from 'react-redux'
import styled from 'styled-components'
import {
   BrowserRouter as Router,
   Routes,
   Route,
   Navigate
} from 'react-router-dom'
import ProductsListEdit from "./pages/ProductsListEdit";

const Content = styled.div`
  padding-top: 50px;
`

const Main = styled.div`
   min-height: calc(100vh - 255px)
`

const App = () => {
   const user = useSelector((state) => state.user.currentUser)

   return (
      <Router>
         <Navbar/>
         <Content>
            <Main>
               <ScrollToTop>
                  <Routes>
                     <Route exact path={'/'} element={<Home/>}/>
                     <Route exact path={'/cart'} element={<Cart/>}/>
                     <Route exact path={'/orders'} element={user ?  <Orders /> : <Navigate to='/' />}/>
                     <Route path={'/order/:id'} element={<Order/>}/>
                     <Route exact path={'/cart/ordering'} element={user ?  <Ordering /> : <Navigate to='/cart' />}/>
                     <Route exact path='/account' element={user ?  <AccountSettings /> : <Navigate to='/' />}/>
                     <Route exact path='/edit/users' element={user && user.isAdmin ?  <UsersList /> : <Navigate to='/' />}/>
                     <Route exact path='/edit/orders' element={user && user.isAdmin ?  <OrdersEdit /> : <Navigate to='/' />}/>
                     <Route exact path='/edit/products' element={user && user.isAdmin ?  <ProductsListEdit /> : <Navigate to='/' />}/>
                     <Route exact path='/add/product' element={user && user.isAdmin ?  <AddProduct /> : <Navigate to='/' />}/>
                     <Route exact path='/edit/product/:id' element={user && user.isAdmin ?  <EditProduct /> : <Navigate to='/' />}/>
                     <Route path={'/products/:category'} element={<ProductsList/>}/>
                     <Route path={'/product/:id'} element={<Product/>}/>
                     <Route path={'/search/:term'} element={<Search/>}/>
                     <Route path={'*'} element={<Navigate to='/'/>} />
                  </Routes>
               </ScrollToTop>
            </Main>
            <Footer/>
         </Content>
         <ScrollButton/>
         <Modal>
            <Auth/>
         </Modal>
      </Router>
   )
}

export default App;