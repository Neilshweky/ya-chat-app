const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8080" 

const checkError = async (res) => {
  console.log(res.status)
  if(!res.ok) {
    let error_string = await res.json()
                                .then(err => err.message)
                                .catch(() => 'there was an error')
    let error = new Error(error_string)
    error.status = res.status
    throw error;
  }
  return res.json()
}


export { checkError, API_URL } 