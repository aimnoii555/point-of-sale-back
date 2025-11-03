import { useState } from 'react';
import ResponseError from './utils/ResponseError'
import axios from 'axios';
import config from './config';
import { useNavigate } from 'react-router-dom'


function App() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const navigate = useNavigate()


  const handleSignIn = async (e) => {
    e.preventDefault()
    try {
      const payload = {
        username,
        password
      }
      const res = await axios.post(config.path + '/admin/signin', payload)

      if (res.data.status) {
        navigate('/home')
        localStorage.setItem(config.token_name, res.data.token)
      } else {
        ResponseError('Invalid username or password')
      }
    } catch (error) {
      if (error.response.status === 401) {
        ResponseError('Invalid username or password')
      } else {
        ResponseError(error.message)
      }
    }
  }

  return (
    <div className="container-fluid mt-5">
      <div className='card w-50 mx-auto'>
        <div className='card-header'>
          <h3>Admin</h3>
        </div>
        <div className='card-body'>
          <form onSubmit={handleSignIn}>
            <div>Username</div>
            <div><input onChange={(e) => setUsername(e.target.value)} type='text' className='form-control' required></input></div>
            <div className='mt-3'>
              <div>Password</div>
              <div><input onChange={(e) => setPassword(e.target.value)} type='password' className='form-control' required></input></div>
            </div>
            <div className='mt-4'>
              <button type='submit' className='btn btn-primary'>Sign In</button>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
}

export default App;
