import styled from 'styled-components'

const Container = styled.div`
  max-width: 550px;
  padding: 12px 20px;
  border-radius: 10px;
  ${(props) => props.isOpen ? 'block' : 'none'};
  color: ${(props) => props.type === 'error' ? '#721c24' : props.type === 'warning' ? '#856404' : '#155724'};
  background: ${(props) => props.type === 'error' ? '#f8d7da' : props.type === 'warning' ? '#fff3cd' : '#d4edda'};
  border: ${(props) => props.type === 'error' ? '#f5c6cb' : props.type === 'warning' ? '#ffeeba' : '#c3e6cb'}
`

const Alert = ({ type, children }) => {
   return (
      <Container type={type}>
         { children }
      </Container>
   )
}

export default Alert