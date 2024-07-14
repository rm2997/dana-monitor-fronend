import mssql from 'mssql';


const config={
    user:'sa',
    password:'isc@123456',
    server:'10.0.2.15',
    database:'DanaMonitor',
}

const loadSqlData=async()=>{
    try{
        const cnn=await mssql.connect(config);
        const query='SELECT * FROM tbl_msgCounts';
        const result=await cnn.request().query(query);
        console.log(result);
        return result;
    }catch(err){
        throw err;
    }
}
export default loadSqlData;