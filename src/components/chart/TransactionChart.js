import * as React from 'react';
import Box from '@mui/material/Box';
import { ResponsiveChartContainer } from '@mui/x-charts/ResponsiveChartContainer';
import { LinePlot, MarkPlot } from '@mui/x-charts/LineChart';
import { ChartsXAxis } from '@mui/x-charts/ChartsXAxis';
import { ChartsLegend, ChartsTooltip, ChartsYAxis } from '@mui/x-charts';
import { Card,  IconButton,  Typography } from '@mui/material';
import PlayCircleOutlineSharpIcon from '@mui/icons-material/PlayCircleOutlineSharp';
import PauseCircleOutlineSharpIcon from '@mui/icons-material/PauseCircleOutlineSharp';
import LoopSharpIcon from '@mui/icons-material/LoopSharp';


export default  function TransactionChart( {dataSet,handelFetch,chartLable,handlePlaying,isPlaying} ) {  
  const chartSeries = [
    { type: 'line', dataKey: `to${chartLable}`,label:`To ${chartLable}`, color: '#55C306' },
    { type: 'line', dataKey: `from${chartLable}`,label:`From ${chartLable}`, color: '#F1244F' },  
  ];
    return (
      <Card  sx={{ width: '100%',display:'inline-flex'} } >
        <Box sx={{ width: '100%'}}>
        <Typography variant="h6" gutterBottom sx={{textAlign:'center',margin:'10px auto'}}  >
             {chartLable} Transaction Status
        </Typography>
        <Box sx={{margin:'10px'}}>
          <IconButton onClick={handelFetch} color='primary'>
            <LoopSharpIcon/>
          </IconButton>
          <IconButton onClick={handlePlaying} color='primary'>
            {isPlaying?<PauseCircleOutlineSharpIcon/>:<PlayCircleOutlineSharpIcon/>}
          </IconButton> 
        </Box>
          <ResponsiveChartContainer
            series={chartSeries}
            dataset={dataSet?dataSet.transactions:[]}            
            xAxis={[
              {
                scaleType: 'band',
                dataKey: 'time',                
              },
            ]}
            height={400}            
          >          
          <ChartsLegend />
            <LinePlot  />
            <MarkPlot  />
            <ChartsTooltip />
            <ChartsXAxis  label='Time' />
            <ChartsYAxis label='Count' />
          </ResponsiveChartContainer>
        </Box>
      </Card>
    );
}
