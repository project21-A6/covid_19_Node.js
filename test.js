const mysql = require('mysql');  // mysql 모듈 로드
const conn = {  // mysql 접속 설정
    host: '127.0.0.1',
    port: '3306',
    user: 'root',
    password: '1234',
    database: 'project'
};

var connection = mysql.createConnection(conn); // DB 커넥션 생성
connection.connect();   // DB 접속

const ServiceKey = 'AyVKbrD9aJmUDeMcNxMuZPIvs78VlFkBtxOvWSzXB2htFBN%2F%2B%2BMSz%2BhbkGMM%2BwrxqGL6xQ3CLC2J%2FeeU77y1iA%3D%3D'; 
const pageNo = 1;

let request = require('request'); 
let options = { 
    'method': 'GET', 
    'url': 'http://openapi.data.go.kr/openapi/service/rest/Covid19/getCovid19SidoInfStateJson?serviceKey=' + ServiceKey + 
    '&pageNo=' + pageNo + 
    '&numOfRows=', 
    'headers': { 'Accept':'application/json' } 
}; 

request(options, function (error, response, body) { 
    if (error) { throw new Error(error); } 
    let info = JSON.parse(body); 

    for (i in info['response']['body']['items']['item']) { 
        var item = info['response']['body']['items']['item'][i];
        
        // console.log(item)
        var testQuery = "INSERT INTO `covid` (`gubun`,`defCnt`,`localOccCnt`,`seq`,`stdDay`) " +
            " VALUES ( ?, ?, ?, ?, ? )";
            
        var param = [item.gubun, item.defCnt, item.localOccCnt, item.seq, item.stdDay];

        connection.query(testQuery, param, function (err, results, fields) { // testQuery 실행
            if (err) {
                console.log(err);
            }
            console.log(results);
        });
    } 
    connection.end(); // DB 접속 종료
});