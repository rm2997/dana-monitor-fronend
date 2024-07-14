import axios from 'axios';


export async function loadApiData(){        
  try {
    const {data}=  await axios.get(`${process.env.REACT_APP_API_URL}/GetDanaStatus`)
    .then(result=>result);
    return data;    
  } catch (error) {
    console.log('error getting data from API',error);
  }
    
}
