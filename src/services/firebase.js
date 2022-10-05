import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'

// const config = {
//   apiKey: 'AIzaSyADubq8Pf-_nC6cM52PGZJLAJ_yT4UkWto',
//   authDomain: 'reactzzaria-12649.firebaseapp.com',
//   databaseURL: 'https://reactzzaria-12649.firebaseio.com',
//   projectId: 'reactzzaria-12649',
//   storageBucket: 'reactzzaria-12649.appspot.com',
//   messagingSenderId: '190402590347'
// }

const config = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID,
  measurementId: process.env.REACT_APP_MEASUREMENT_ID
}

firebase.initializeApp(config)

export const db = firebase.firestore()
export default firebase
