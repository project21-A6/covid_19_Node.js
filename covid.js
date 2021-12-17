const mysql = require('mysql'); 
var d = new Date();

const conn = { 
	host: '127.0.0.1',
	port: '3306',
	user: 'root',
	password: '1234',
	database: 'project'
};

var connection = mysql.createConnection(conn); 

connection.connect();

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

    request(options, function (error, response, body) { 
        if (error) { throw new Error(error); } 
        let info = JSON.parse(body); 

        for (i in info['response']['body']['items']['item']) { 
            var item = info['response']['body']['items']['item'][i];
            
            var ReplaceQuery = "REPLACE INTO `covid` (`gubun`,`defCnt`,`localOccCnt`,`seq`,`stdDay`) " +
                " VALUES ( ?, ?, ?, ?, ? );";
                
            var param = [item.gubun, item.defCnt, item.localOccCnt, item.seq, item.stdDay];

            console.log("'"+item.gubun+"' 항목이 삽입되었습니다.");

            connection.query(ReplaceQuery, param, function (err, results, fields) { // testQuery 실행
                if (err) {
                    console.log(err);
                }
            });
        }

        UpdateQuery = "UPDATE covid SET stdDay=REPLACE(`stdDay`, '년', '-'), stdDay=REPLACE(`stdDay`, '월', '-'), stdDay=REPLACE(`stdDay`, '일', '-'), stdDay=REPLACE(`stdDay`, '시', ' '), stdDay=REPLACE(`stdDay`, ' ', '');";
        connection.query(UpdateQuery, function (err, results, fields) { // testQuery 실행
        
        if (err) {
                console.log(err);
            }
            console.log(d.getFullYear()+"년 "+(d.getMonth() + 1)+"월 "+d.getDate()+"일 "+d.getHours()+"시 "+d.getMinutes()+"분 "+d.getSeconds()+"초에 갱신되었습니다.");
        });
    });