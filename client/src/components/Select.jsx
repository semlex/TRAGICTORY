import styled from 'styled-components'
import { MdOutlineCheck } from 'react-icons/md'
import Dropdown from './Dropdown'

const Item = styled.div`
  font-family: inherit;
  position: relative;
  cursor: pointer;
  padding: 9px 9px 9px 25px;
  font-size: 14px;

  &:hover {
    background: #ececec;
  }
  
  svg {
    position: absolute;
    bottom: 11px;
    left: 5px;
  }
`

const Select = ({ placeholder, selected, setSelected, options , id }) => {

   const handleClick = (item) => {
      if (selected === item) {
         setSelected('')
      } else {
         setSelected(item)
      }
   }

   return (
      <Dropdown
         id={id}
         placeholder={selected ? selected.title : placeholder}
         isSelectable={true}
      >
         {options.map((item, i) => (
            <Item
               key={i}
               onClick={() => handleClick(item)}
            >
               { item.title }
               { selected === item && <MdOutlineCheck/> }
            </Item>
         ))}
      </Dropdown>
   )
}

export default Select