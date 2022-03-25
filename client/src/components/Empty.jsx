import styled from 'styled-components'

const EmptyContainer = styled.div`
  width: 100%;
  height: 250px;
  display: flex;
  justify-content: center;
  align-items: center;
`

const EmptyText = styled.div`
  font-family: 'Monstreratt', sans-serif;
  font-size: 23px;
  color: #6c6c6c;
`

const Empty = ({ children }) => {
   return (
      <EmptyContainer>
         <EmptyText>
            {children}
         </EmptyText>
      </EmptyContainer>
   )
}

export default Empty