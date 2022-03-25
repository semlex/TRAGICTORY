import styled from 'styled-components'

const Input = styled.input`
  font-family: 'Montserrat', sans-serif;
  border-radius: 10px;
  color: #111111;
  transition: border-color 0.35s;
  width: 100%;
  font-size: 14px;
  font-weight: 500;
  padding: 10px 20px;
  margin: 5px 0;
  border: 1px solid #d8d8d8;
  
  &:focus {
    border-color: #999999;
  }

  &[data-error="true"], &:invalid {
    border: 1px solid #ff0000;
    background: #f7ecec;
    
    &:focus {
      border-color: #999999;
    }
  }
  
  &:disabled{
    background-color: #e4e4e4;
  }
`

export default Input