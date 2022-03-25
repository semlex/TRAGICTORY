import { initializeApp } from 'firebase/app'

const firebaseConfig = {
   apiKey: 'AIzaSyBFxDxgT3_knwOqzYSDuZGxMAJTaG-I6QU',
   authDomain: 'tragictory-58e92.firebaseapp.com',
   projectId: 'tragictory-58e92',
   storageBucket: 'tragictory-58e92.appspot.com',
   messagingSenderId: '990220574478',
   appId: '1:990220574478:web:7b8e4a20c13f3e64cf015f'
}

const app = initializeApp(firebaseConfig)

export default app