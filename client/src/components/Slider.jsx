import styled from 'styled-components'
import { useState, useEffect, useRef } from 'react'
import { useSwipeable } from 'react-swipeable'
import {sm, md} from '../responsive'
import { sliderItems } from '../data'

const Container = styled.div`
  width: 100%;
  height: 450px;
  ${sm({ height: '300px' })}
  display: flex;
  position: relative;
  overflow: hidden;
`

const Wrapper = styled.div`
  height: 100%;
  display: flex;
  transition: transform 0.75s ease;
  transform: translateX(${(props) => props.slideIndex * -100}vw);
`

const Dots = styled.ul`
  position: absolute;
  padding: 0;
  bottom: 30px;
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: center;
  list-style: none;
`

const Dot = styled.li`
  ${md({ display: 'none' })}
  cursor: pointer;
  opacity: 0.35;
  background-color: #ffffff;
  width: 15px;
  height: 15px;
  border-radius: 100%;
  margin: 0 5px;
  &:hover {
    opacity: 1;
  }
  ${({ isActive }) => isActive && `
    opacity: 1;
  `}
`

const Slide = styled.div`
  width: 100vw;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #000;
`;

const SlideContent = styled.div`
  width: 1150px;
  height: 100%;
  padding: 10px 15px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
  background-image: url('${(props) => props.img}');
  box-shadow: inset 0px -1px 14px 4px rgba(0, 0, 0, 1)
`

const SlideContentTop = styled.div`
   font-size: 10px;
`

const SlideContentBottom = styled.div`
  font-size: 72px;
  font-weight: 900;
`

const Slider = () => {
   const [slideIndex, setSlideIndex] = useState(0)
   const timeoutRef = useRef(null)

   const prev = () => {
      setSlideIndex(slideIndex > 0 ? slideIndex - 1 : sliderItems.length - 1);
   }

   const next = () => {
      setSlideIndex(slideIndex < sliderItems.length - 1 ? slideIndex + 1 : 0);
   }

   const dotClick = (index) => {
      setSlideIndex(index)
   }

   const handlers = useSwipeable({
      onSwipedLeft: next,
      onSwipedRight: prev,
      trackTouch: true,
      trackMouse: true
   });

   function resetTimeout() {
      if (timeoutRef.current) {
         clearTimeout(timeoutRef.current);
      }
   }

   useEffect(() => {
      resetTimeout();
      timeoutRef.current = setTimeout(
         () => { setSlideIndex(slideIndex < sliderItems.length - 1 ? slideIndex + 1 : 0) },
         4000
      );

      return () => {
         resetTimeout();
      };
   }, [slideIndex]);

   return (
      <div {...handlers}>
         <Container>
            <Wrapper slideIndex={slideIndex}>
               {sliderItems.map((item) => (
                  <Slide key={item.id}>
                     <SlideContent img={item.img}>
                     </SlideContent>
                  </Slide>
               ))}
            </Wrapper>
            <Dots>
               {sliderItems.map((item, i) => (
                  <Dot key={i} onClick={() => dotClick(i)} isActive={i === slideIndex}>
                  </Dot>
               ))}
            </Dots>
         </Container>
      </div>
   )
}

export default Slider