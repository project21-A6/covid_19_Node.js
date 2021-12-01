const mysql = require('mysql');  // mysql 모듈 로드
var cron = require('node-cron'); //node-cron 모듈 로드

const conn = {  // mysql 접속 설정
    host: '127.0.0.1',
    port: '3306',
    user: 'root',
    password: '1234',
    database: 'project'
};

var connection = mysql.createConnection(conn); // DB 커넥션 생성

connection.connect();   // DB 접속

const ServiceKey = 'AyVKbrD9aJmUDeMcNxMuZPIvs78VlFkBtxOvWSzXB2htFBN%2F%2B%2BMSz%2BhbkGMM%2BwrxqGL6xQ3CLC2J%2FeeU77y1iA%3D%3D'; 
const pageNo = 1; 
const numOfRows = 100;

let request = require('request'); 

let options = { 
    'method': 'GET', 
    'url': 'http://openapi.data.go.kr/openapi/service/rest/Covid19/getCovid19SidoInfStateJson?serviceKey=' + ServiceKey + 
    '&pageNo=' + pageNo + 
    '&numOfRows=' + numOfRows, 
    'headers': { 'Accept':'application/json' } 
}; 

cron.schedule('* * * * *', () => {  // 1분 간격
    TruncateQuery = "TRUNCATE covid";
    connection.query(TruncateQuery, function (err, results, fields) { // testQuery 실행
    
    if (err) {
        console.log(err);
        }
            console.log(results);
    });
 
    request(options, function (error, response, body) { 
        if (error) { throw new Error(error); } 
        let info = JSON.parse(body); 

        for (i in info['response']['body']['items']['item']) { 
            var item = info['response']['body']['items']['item'][i];
            
            // console.log(item)
            var InsertQuery = "INSERT INTO `covid` (`gubun`,`defCnt`,`localOccCnt`,`seq`,`stdDay`) " +
                " VALUES ( ?, ?, ?, ?, ? );";
                
            var param = [item.gubun, item.defCnt, item.localOccCnt, item.seq, item.stdDay];

            connection.query(InsertQuery, param, function (err, results, fields) { // testQuery 실행
                if (err) {
                    console.log(err);
                }
                console.log(results);
            });
        }

        UpdateQuery = "UPDATE covid SET stdDay=REPLACE(`stdDay`, '년', '-'), stdDay=REPLACE(`stdDay`, '월', '-'), stdDay=REPLACE(`stdDay`, '일', '-'), stdDay=REPLACE(`stdDay`, '시', ' '), stdDay=REPLACE(`stdDay`, ' ', '');";
        connection.query(UpdateQuery, function (err, results, fields) { // testQuery 실행
        
        if (err) {
            console.log(err);
            }
                console.log(results);
        });
        
    })
});
