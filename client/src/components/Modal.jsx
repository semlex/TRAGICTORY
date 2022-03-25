import styled from 'styled-components'
import { AiOutlineClose } from 'react-icons/ai'
import { sm } from '../responsive'
import { useSelector, useDispatch } from 'react-redux'
import { closeAuthModal } from '../redux/authModalSlice'

const Container = styled.div`
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.75);
  position: fixed;
  top: 0;
  left: 0;
  z-index: 9999;
  display: flex;
  justify-content: center;
  align-items: center;
  visibility: hidden;
  opacity: 0;
  pointer-events: none;

  ${({isOpen}) => isOpen && `
    visibility: visible;
    opacity: 1;
    pointer-events: auto
  `}
`

const Content = styled.div`
  position: relative;
  border-radius: 10px;
  background: #fff;
  max-width: 600px;
  padding: 30px 40px;
  ${sm({ padding: '20px 30px' })};
  max-height: calc(100vh - 30px);
  overflow-y: auto;
`

const CloseBtn = styled.button`
  position: absolute;
  top: 5px;
  right: 7px;
  cursor: pointer;
  background: transparent;
  border: none;
  font-size: 18px;
  padding: 10px;
  opacity: 0.45;
  
  &:hover {
    opacity: 1;
  }
`

const Modal = ({ children }) => {
   const isOpen = useSelector(state => state.authModal).isOpen

   const dispatch = useDispatch()

   const close = () => {
      dispatch(
         closeAuthModal()
      )
   }

   return (
      <Container
         isOpen={isOpen}
         onClick={close}>
         <Content onClick={(e) => e.stopPropagation()}>
            <CloseBtn onClick={close}>
               <AiOutlineClose/>
            </CloseBtn>
            {children}
         </Content>
      </Container>
   )
}

export default Modal