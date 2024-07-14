import MainArea from './components/main_area/MainArea'
import DrawerMenu from './components/drawer_menu/DrawerMenu'
import TransactionChart from './components/chart/TransactionChart';
import MyPieChart from './components/chart/MyPieChart';
import {loadApiData} from './lib/loadApiData'  
import {useEffect, useState } from 'react';
import MyProgressChart from './components/chart/MyProgressChart';
import {  Card, Typography } from '@mui/material';
import StatusElement from './components/status_element/StatusElement';
import FirstLoading from './components/progress/FirstLoading';
import ResponseTimeChart from './components/chart/ResponseTimeChart';

let timer=null;
function  App() {    
  const [myChartData,setMyChartData]=useState(null);
  const [playing,setPlaying]=useState(false);

  useEffect(()=>{   
       fetchData();
  },[]);
  
  useEffect(()=>{    
    if (playing)
      timer=setInterval(() => {
        fetchData();        
      }, 30000);
    else
      clearTimeout(timer);
   
  },[playing])
  
  function fetchData(){
    console.log(`var: ${process.env.REACT_APP_API_URL}`);
    setMyChartData(null)
    loadApiData()
    .then((result)=>{
      setMyChartData(result);
    });     
  }
  function handelPlaying(newPlaying){
    setPlaying(newPlaying);    
  }
    console.log(myChartData?myChartData.responseTimes:[]);
    return (
      <MainArea>        
        <DrawerMenu DanaName={myChartData?myChartData.danaStatus.BankName + myChartData.danaStatus.GateWayName :'Disconnected'} >
          <div style={{margin:'5px',display:'flex',flexDirection:'row'}}>
            <div style={{width:'70%',margin:'5px'}}>
              <TransactionChart dataSet={myChartData} 
              handelFetch={fetchData} handlePlaying={()=>handelPlaying(!playing)} isPlaying={playing} chartLable={'Host'} />
            </div>          
            <div style={{width:'30%',margin:'5px'}}>
              <ResponseTimeChart dataSet={myChartData?myChartData.responseTimes:[]}/>
            </div>          
          </div>
          
          <div style={{display:'flex',flexDirection:'row'}}>
            <div style={{width:'35%',margin:'5px'}}>
              <MyPieChart dataSet={myChartData}/>
            </div>
            <Card style={{width:'25%',margin:'5px'}}>
              <Typography variant="h6" gutterBottom sx={{textAlign:'center',margin:'1px'}}>
                Overall Status
              </Typography>
              <StatusElement label={'Gate Status'} value={myChartData?myChartData.danaStatus.GateStatus:false}/>
              <StatusElement label={'Host Ping'} value={myChartData?myChartData.danaStatus.PingStatus:false}/>
              <StatusElement label={'Host Telnet'} value={myChartData?myChartData.danaStatus.PortStatus:false}/>            
              <StatusElement 
                label={`Thread Count: ${myChartData?myChartData.danaStatus.ThreadCount?myChartData.danaStatus.ThreadCount:0:0}`} 
                value={myChartData?myChartData.danaStatus.ThreadCount?true:false:false}/>
            </Card>
            <Card style={{width:'40%',margin:'10px'}} >
              <MyProgressChart value={myChartData?myChartData.danaStatus.CpuUsage:100} labelName='Cpu Usage'/>
              <MyProgressChart value={myChartData?myChartData.danaStatus.MemoryUsage:100} labelName='Memory Usage'/>
              <MyProgressChart value={myChartData?myChartData.danaStatus.DiskSpace:100} labelName='Disk Usage'/>
              
            </Card>
          </div>
        </DrawerMenu>
        {!myChartData?<FirstLoading/>:<></>}
      </MainArea>
    );
}

export default App;