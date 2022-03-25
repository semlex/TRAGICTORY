import styled from 'styled-components'
import Input from '../components/Input'
import PageHead from '../components/PageHead'
import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { update } from '../redux/apiCalls'
import Alert from '../components/Alert'

const Container = styled.div`
  max-width: 600px;
  padding: 35px 10px;
  margin: 0 auto;
`

const SettingsTitle = styled.h2`
  font-size: 24px;
  font-weight: 600;
  margin: 10px 0;
`

const SettingsForm = styled.form``

const Button = styled.button`
  cursor: pointer;
  border-radius: 50px;
  background: #3a54d6;
  margin: 12px 0;
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

const AccountSettings = () => {
   const user = useSelector(state => state.user.currentUser)
   const { isError, errorPlace, error } = useSelector((state) => state.user)
   const [isInfoSuccess, setIsInfoSuccess] = useState(false)
   const [isPasswordSuccess, setIsPasswordSuccess] = useState(false)

   const [surname, setSurname] = useState(user.surname)
   const [name, setName] = useState(user.name)
   const [oldPassword, setOldPassword] = useState('')
   const [password, setPassword] = useState('')
   const [confirmPassword, setConfirmPassword] = useState('')

   const dispatch = useDispatch()

   const changeUserInfo = (e) => {
      e.preventDefault()
      if (!name || !surname) {
         if (!name) {
            e.target.querySelector('#name').setAttribute('data-error', 'true')
         }
         if (!surname) {
            e.target.querySelector('#surname').setAttribute('data-error', 'true')
         }
      } else {
         update(dispatch, user.userId, { surname, name })
            .then((res) => {
               setIsInfoSuccess(true)
               setTimeout(() => setIsInfoSuccess(false), 3000)
            })
      }
   }

   const changePassword = (e) => {
      e.preventDefault()

      if (!oldPassword || !password || !confirmPassword || password !== confirmPassword) {
         if (!oldPassword) {
            e.target.querySelector('#old_password').setAttribute('data-error', 'true')
         }
         if (!password) {
            e.target.querySelector('#password').setAttribute('data-error', 'true')
         }
         if (!confirmPassword) {
            e.target.querySelector('#confirm_password').setAttribute('data-error', 'true')
         }
         if (password !== confirmPassword) {
            e.target.querySelector('#password').setAttribute('data-error', 'true')
            e.target.querySelector('#confirm_password').setAttribute('data-error', 'true')
         }
      } else {
         update(dispatch, user.userId, { oldPassword, password, confirmPassword })
            .then((res) => {
               setIsPasswordSuccess(true)
               setTimeout(() => setIsPasswordSuccess(false), 3000)
            })

         if (password === confirmPassword) {
            e.target.querySelector('#password').setAttribute('data-error', 'false')
            e.target.querySelector('#confirm_password').setAttribute('data-error', 'false')
         }
      }
   }

   return (
      <>
         <PageHead>
            Аккаунт
         </PageHead>
         <Container>
            <SettingsTitle>
               Персональные данные
            </SettingsTitle>
            <SettingsForm onSubmit={changeUserInfo}>
               <Input
                  type={'email'}
                  disabled
                  readonly
                  maxLength={'64'}
                  placeholder={'Email адрес'}
                  value={user.email}
               />
               <Input
                  type={'text'}
                  id={'surname'}
                  placeholder={'Фамилия'}
                  value={surname}
                  maxLength={'64'}
                  onChange={(e) => setSurname(e.target.value)}
               />
               <Input
                  type={'text'}
                  id={'name'}
                  placeholder={'Имя'}
                  value={name}
                  maxLength={'64'}
                  onChange={(e) => setName(e.target.value)}
               />
               <Button type={'submit'}>
                  Сохранить
               </Button>
               {isError && errorPlace === 'updateInfo' &&
                  <Alert type={'error'}>Произошла ошибка...</Alert>
               }
               {isInfoSuccess &&
                  <Alert type={'success'}>Данные были успешно обновлены</Alert>
               }
            </SettingsForm>
            <SettingsTitle>
               Смена пароля
            </SettingsTitle>
            <SettingsForm onSubmit={changePassword}>
               <Input
                  type={'password'}
                  value={oldPassword}
                  placeholder={'Старый пароль'}
                  id={'old_password'}
                  minLength={'6'}
                  maxLength={'64'}
                  onChange={(e) => setOldPassword(e.target.value)}
               />
               <Input
                  type={'password'}
                  value={password}
                  placeholder={'Новый пароль'}
                  id={'password'}
                  minLength={'6'}
                  maxLength={'64'}
                  onChange={(e) => setPassword(e.target.value)}
               />
               <Input
                  type={'password'}
                  value={confirmPassword}
                  placeholder={'Подтверждение нового пароля'}
                  id={'confirm_password'}
                  minLength={'6'}
                  maxLength={'64'}
                  onChange={(e) => setConfirmPassword(e.target.value)}
               />
               <Button type={'submit'}>
                  Сохранить
               </Button>
               {isError && errorPlace === 'updatePassword' && (
                  (
                     error.data.message === 'Wrong old password' &&
                     <Alert type={'error'}>Неправильный старый пароль</Alert>
                  ) ||
                  (
                     error.data.message === 'Passwords don\'t match' &&
                     <Alert type={'error'}>Пароли не совпадают</Alert>
                  ) ||
                  <Alert type={'error'}>Произошла ошибка...</Alert>
               )
               }
               {isPasswordSuccess &&
                  <Alert type={'success'}>Пароль был успешно изменен</Alert>
               }
            </SettingsForm>
         </Container>
      </>
   )
}

export default AccountSettings