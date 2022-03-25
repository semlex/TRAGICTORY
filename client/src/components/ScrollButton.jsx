import { useState, useEffect } from 'react'
import styled from 'styled-components'
import { IoIosArrowUp } from 'react-icons/io'

const Button = styled.button`
  width: 50px;
  height: 50px;
  position: fixed;
  right: 20px;
  bottom: 20px;
  color: #ffffff;
  background: #3a54d6;
  border: none;
  border-radius: 50%;
  padding: 0;
  font-size: 20px;
  display: ${(props) => props.isVisible ? 'inline-block' : 'none'}
`

const ScrollButton = () => {
   const [visible, setVisible] = useState(false)

   const toggleVisible = () => {
      const scrolled = document.documentElement.scrollTop;
      if (scrolled > 1300){
         setVisible(true)
      }
      else if (scrolled <= 1300){
         setVisible(false)
      }
   };

   const scrollToTop = () =>{
      window.scrollTo({
         top: 0,
         behavior: 'smooth'
      });
   };

   useEffect(() => {

      window.addEventListener('scroll', toggleVisible);

      return () => {
         window.removeEventListener('scroll', toggleVisible);
      };
   }, []);

   return (
      <Button isVisible={visible} onClick={scrollToTop}>
         <IoIosArrowUp/>
      </Button>
   )
}

export default ScrollButton