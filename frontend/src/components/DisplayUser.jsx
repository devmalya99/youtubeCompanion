import { useState, useEffect } from 'react'

import ShowUserDetails from './ShowUserDetails'
import Login from './Login'


function DisplayUser() {
  const [user, setUser] = useState(null)

  // Check for user in localStorage on initial render
  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
  }, [])

  return (
    <>
      
        {/* <ShowUserDetails user={user} /> */}
      
        <Login />
      
     
    </>
  )
}

export default DisplayUser
