import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import ShowVideoDetails from './components/ShowVideoDetails'
import Login from './components/Login'
import DisplayUser from './components/DisplayUser'
import CommentsSection from './components/CommentsSection'

function App() {
  const [count, setCount] = useState(0)
  const oauthToken="sfsdfsdfsf"

  return (
    <>
     <DisplayUser/>
      <ShowVideoDetails/>
      <CommentsSection oauthToken={oauthToken}/>
    </>
  )
}

export default App
