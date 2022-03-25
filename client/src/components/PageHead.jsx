import styled from 'styled-components'

const PageTitleContainer = styled.div`
  width: 100%;
  min-height: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #3A54D6FF
`

const PageTitle = styled.h1`
  font-family: "Montserrat", sans-serif;
  font-size: 30px;
  font-weight: 600;
  color: #fff;
  text-transform: uppercase;
  text-align: center;
`

const PageHead = ({children}) => {
   return (
      <PageTitleContainer>
         <PageTitle>
            {children}
         </PageTitle>
      </PageTitleContainer>
   )
}

export default PageHead