import styled from 'styled-components'
import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { openAuthModal } from '../redux/authModalSlice'
import { login, register } from '../redux/apiCalls'
import Input from '../components/Input'
import Alert from '../components/Alert'

const Container = styled.div``

const Title = styled.h1`
  font-family: 'Montserrat', sans-serif;
  font-size: 24px;
  font-weight: 600;
`

const AuthForm = styled.form`
   margin: 20px 0;
`

const Link = styled.a`
  font-family: 'Montserrat', sans-serif;
  color: #0066CCFF;
  font-size: 14px;
  text-decoration: underline;
  cursor: pointer;
  transition: 0.35s;
  
  &:hover {
    color: #111111;
  }
`

const Button = styled.button`
  cursor: pointer;
  border-radius: 50px;
  background: #3a54d6;
  margin: 10px 0;
  padding: 10px 30px;
  color: #FFFFFF;
  font-family: 'Montserrat', sans-serif;
  font-weight: 400;
  font-size: 15px;
  text-align: center;
  border: 2px solid transparent;
  transition: 0.35s;

  &:hover {
    background: #fff;
    border: 2px solid #0077ff;
    color: #0077ff;
  }
`

const Auth = () => {
   const [email, setEmail] = useState('')
   const [password, setPassword] = useState('')
   const [name, setName] = useState('')
   const [surname, setSurname] = useState('')
   const [confirmPassword, setConfirmPassword] = useState('')

   const status = useSelector(state => state.authModal).status
   const { isError, errorPlace, error } = useSelector((state) => state.user)

   const dispatch = useDispatch()

   const changeStatus = status => {
      dispatch(
         openAuthModal({
            status
         })
      )
   }

   const submitLogin = (e) => {
      e.preventDefault()
      if (!email || !password) {
         if (!email) {
            e.target.querySelector('input[type="email"]').setAttribute('data-error', 'true')
         }
         if (!password) {
            e.target.querySelector('input[type="password"]').setAttribute('data-error', 'true')
         }
      } else {
         login(dispatch, { email, password })
      }
   }

   const registerSubmit = (e) => {
      e.preventDefault()

      if (!email || !password || !name || !surname || !confirmPassword || password !== confirmPassword) {
         if (!email) {
            e.target.querySelector('input[type="email"]').setAttribute('data-error', 'true')
         }
         if (!password) {
            e.target.querySelector('#password').setAttribute('data-error', 'true')
         }
         if (!name) {
            e.target.querySelector('#name').setAttribute('data-error', 'true')
         }
         if (!surname) {
            e.target.querySelector('#surname').setAttribute('data-error', 'true')
         }
         if (!confirmPassword) {
            e.target.querySelector('#confirm_password').setAttribute('data-error', 'true')
         }
         if (password !== confirmPassword) {
            e.target.querySelector('#password').setAttribute('data-error', 'true')
            e.target.querySelector('#confirm_password').setAttribute('data-error', 'true')
         }
      } else {
         register(dispatch, {
            email,
            password,
            name,
            surname,
            confirmPassword
         })

         if (password === confirmPassword) {
            e.target.querySelector('#password').setAttribute('data-error', 'false')
            e.target.querySelector('#confirm_password').setAttribute('data-error', 'false')
         }
      }
   }

   return (
      <Container>
         {status === 'login' &&
            <>
               <Title>
                  ??????????????????????:
               </Title>
               <AuthForm
                  autocomplete={'on'}
                  onSubmit={submitLogin}
               >
                  <Input
                     type={'email'}
                     placeholder={'Email ??????????'}
                     value={email}
                     maxLength={'64'}
                     onChange={(e) => setEmail(e.target.value)}
                  />
                  <Input
                     type={'password'}
                     placeholder={'????????????'}
                     value={password}
                     minLength={'6'}
                     maxLength={'64'}
                     onChange={(e) => setPassword(e.target.value)}
                  />
                  <Button type={'submit'}>
                     ??????????
                  </Button>
                  {
                     isError && errorPlace === 'login' && (
                        (
                           (error.data && error.data.message === 'Wrong email or password') &&
                           <Alert type={'error'}>???????????????? ?????????? ?????? ????????????</Alert>
                        ) ||
                        (<Alert type={'error'}>?????????????????? ????????????...</Alert>)
                     )
                  }
               </AuthForm>
               <Title>
                  ?????? ?????????????????
               </Title>
               <Link onClick={() => changeStatus('register')}>
                  ????????????????????????????????????
               </Link>
            </>
         }
         {status === 'register' &&
            <>
               <Title>
                  ??????????????????????
               </Title>
               <AuthForm
                  onSubmit={registerSubmit}
               >
                  <Input
                     type={'email'}
                     placeholder={'Email ??????????'}
                     value={email}
                     maxLength={'64'}
                     onChange={(e) => setEmail(e.target.value)}
                  />
                  <Input
                     type={'text'}
                     placeholder={'??????????????'}
                     value={surname}
                     id={'surname'}
                     maxLength={'64'}
                     onChange={(e) => setSurname(e.target.value)}
                  />
                  <Input
                     type={'text'}
                     placeholder={'??????'}
                     value={name}
                     id={'name'}
                     maxLength={'64'}
                     onChange={(e) => setName(e.target.value)}
                  />
                  <Input
                     type={'password'}
                     placeholder={'????????????'}
                     value={password}
                     id={'password'}
                     minLength={'6'}
                     maxLength={'64'}
                     onChange={(e) => setPassword(e.target.value)}
                  />
                  <Input
                     type={'password'}
                     placeholder={'?????????????????? ????????????'}
                     value={confirmPassword}
                     id={'confirm_password'}
                     minLength={'6'}
                     maxLength={'64'}
                     onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  <Button type={'submit'}>
                     ????????????????????????????????????
                  </Button>
                  {
                     isError && errorPlace === 'register' && (
                        (
                           error.data && error.data.message === 'User already exists' &&
                           <Alert type={'error'}>???????????????????????? ?? ?????????? email ?????? ????????????????????</Alert>
                        ) ||
                        (
                           error.data && error.data.message === 'Passwords does not match' &&
                           <Alert type={'error'}>???????????? ???? ??????????????????</Alert>
                        ) ||
                        (<Alert type={'error'}>?????????????????? ????????????...</Alert>)
                     )
                  }
               </AuthForm>
               <Title>
                  ?????? ???????? ???????????????
               </Title>
               <Link onClick={() => changeStatus('login')}>
                  ??????????????????????
               </Link>
            </>
         }
      </Container>
   )
}

export default Auth