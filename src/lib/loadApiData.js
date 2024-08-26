import axios from 'axios';


export async function loadApiData(){        
  try {  
    const apiAddress=`${process.env.REACT_APP_API_URL}/GetDanaStatus`;
    console.log(`address is : ${apiAddress}`);    
    const {data}=  await axios.get(apiAddress)
    .then(result=>result);
    return data;    
  } catch (error) {
    console.log('error getting data from API',error);
  }
    
}
