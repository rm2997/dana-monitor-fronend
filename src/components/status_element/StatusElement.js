import * as React from 'react';
import Checkbox from '@mui/material/Checkbox';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined';
import { Box } from '@mui/material';

export default function StatusElement({label,value}) {  
  return (    
    <Box sx={{margin:'1px                             auto',color:value?'green':'red'}} >
      <Checkbox 
      readOnly
      color={value?'success':'error'}
      size='large'
      checked={value} 
      label={label} 
      icon={value?<CheckOutlinedIcon />: <CloseOutlinedIcon />} 
      checkedIcon={<CheckOutlinedIcon />} />
      {label}
    </Box>
    
  );
}
