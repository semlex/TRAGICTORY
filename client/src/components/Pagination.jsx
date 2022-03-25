import styled from 'styled-components'
import { MdArrowBackIos, MdArrowForwardIos } from 'react-icons/md'
import ReactPaginate from 'react-paginate'
import {sm} from '../responsive'

const ReactPaginateStyled = styled(ReactPaginate)`
  display: flex;
  width: 100%;
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 10px 20px 10px;
  ${sm({ justifyContent: 'center' })}
  
  li {
    max-width: 50px;
    flex: 1;
    height: 45px;
    margin: 0 1px;
    cursor: pointer;
    transition: 0.1s;
    line-height: 0;
    font-weight: 700;
    color: #111111;
    font-size: 12px
  }

  li a {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    font-family: 'Monstreratt', sans-serif;
  }

  li.selected {
    background: #0077ff;
    box-shadow: 0 5px 20px rgba(58, 84, 214, 0.55);
    color: #fff
  }

  li:hover {
    background: #0077ff;
    box-shadow: 0 5px 20px rgba(58, 84, 214, 0.55);
    color: #fff!important;
  }

  li.previous, & li.next {
    color: #282828;
  }

  li.disabled {
    pointer-events: none;
    cursor: default;
    opacity: 0.5;
  }
`

const Pagination = ({ pageCount, changePage }) => {

   return (
      <ReactPaginateStyled
         breakLabel='...'
         onPageChange={changePage}
         previousLabel={<MdArrowBackIos/>}
         nextLabel={<MdArrowForwardIos/>}
         pageRangeDisplayed={7}
         marginPagesDisplayed={1}
         pageCount={pageCount}
         renderOnZeroPageCount={null}
      />
   )
}

export default Pagination