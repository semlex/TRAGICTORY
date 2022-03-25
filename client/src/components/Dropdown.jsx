import styled from 'styled-components'
import { useState, useEffect, useRef } from 'react'
import closeByClickOutside from '../utils/closeByClickOutside'

const Container = styled.div`
  position:relative;
  font-family: inherit;

  &[data-error="true"] > div:first-child {
    border: 1px solid #ff0000;
    background: #f7ecec;
  }
`

const Control = styled.div`
  font-family: inherit;
  cursor: pointer;
  position: relative;
  padding: 8px 12px;
  background: #fff;
  border: 1px solid #A4A4A4;
  border-radius: 1px;
  ${({ isActive }) => isActive && `
    border-color: #7799D0
  `};

  &::after {
    content: '';
    display: block;
    position: absolute;
    top: 50%;
    margin-top: -2px;
    right: 10px;
    width: 0;
    height: 0;
    border-left: 5px solid transparent;
    border-right: 5px solid transparent;
    border-top: 5px solid #bfbfbf;
    border-top-color: rgb(191, 191, 191);
    transition: all .4s;
    ${({ isActive }) => isActive && `
       border-top-color: #107ba3
    `}
  }
`

const ContentWrapper = styled.div`
  display: none;
  overflow-y: auto;
  padding: 10px 0;
  width: 100%;
  position: absolute;
  font-family: inherit;
  background: #fff;
  z-index: 99;
  top: 110%;
  left: 0;
  border: 1px solid #ddd;
  box-shadow: 2px 3px 3px rgba(0,0,0,.11);

  ${({ isOpen }) => isOpen && `
    display: block
  `}
`

const Content = styled.div`
  max-height: 300px;
  overflow-y: auto;
  font-family: inherit;
`

const Dropdown = ({ placeholder, children, id, isSelectable=false }) => {
   const [isActive, setIsActive] = useState(false)
   const ref = useRef()

   useEffect(() => {

      document.addEventListener('mousedown', (e) => closeByClickOutside(e, ref, setIsActive, isActive))

      return () => {
         document.removeEventListener('mousedown', closeByClickOutside)
      }
   }, [isActive])

   return (
      <Container
         id={id}
         ref={ref}
      >
         <Control
            isActive={isActive}
            onClick={() => setIsActive(!isActive)}
         >
            {placeholder}
         </Control>
         <ContentWrapper isOpen={isActive}>
            <Content onClick={() => {
               if (isSelectable) {
                  setIsActive(!isActive)
            }}}>
               {children}
            </Content>
         </ContentWrapper>
      </Container>
   )
}

export default Dropdown