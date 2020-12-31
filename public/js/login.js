import axios from 'axios';

export const logIn = async (email, password) => {
  try {
    const res = await axios({
      method: 'POST',
      url: 'http://127.0.0.1:3000/api/v1/users/login', // `${req.protocol}://${req.get('host')}
      data : { email, password}
    })

    if (res.data.status === 'success') {
      console.log(res.data)
    }
  } catch (error) {
    console.log(error.response.data.message) 
  }
}

export const logout = async () => {
  try {
    const res = await axios({
      method: 'GET',
      url: 'http://127.0.0.1:3000/api/v1/users/logout',
    });
  
    if (res.data.status === 'success') {
      console.log(res.data)
    }
  } catch (error) {
    console.log(error.response.data.message) 
  }
}