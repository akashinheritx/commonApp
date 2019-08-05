var http = require('http');
var urlencode = require('urlencode');
// var msg = urlencode('hello js');

var username = 'info@businessecosys.com';
// var username = 'info@commonapp.com';
//var hash = '56788c26992f71dc207bf6cc7f9b5c8106ec12306955585fca77f133e2d74e97'; // The hash key could be found under Help->All Documentation->Your hash key. Alternatively you can use your Textlocal password in plain text.
var hash = 'aa211d4bf4c347bffc46b045ebe6b69a19f9863107e484e7184ce0239486cdfc';
var sender = 'DRCOWS';
// var sender = 'COMMONAPP';

// username=info@businessecosys.com&hash=f4da7aee3f3df520b531ea800f2813c186045acfcb6a7c953721dd051072461b&sender=DRCOWS&numbers=8154993956&message=Dear%20Mooer%2C%20Your%20DearCows%20message%20Dear%20Mooer%2C%20Your%20account%20has%20been%20inactivated.%20Call%20on%201800-300-283-07%20for%20more%20information.
exports.sendMessage = function (toNumber, message) {
   
      try {
        var msg = urlencode(message);
        
        var data = 'username=' + username + '&hash=' + hash + '&sender=' + sender + '&numbers=' + toNumber + '&message=' + msg;
        var options = {
            host: 'api.textlocal.in', path: '/send?' + data
        };
        return new Promise((resolve, reject) => {
            return http.request(options, function (response) {
                var str = '';//another chunk of data has been recieved, so append it to `str`
                response.on('data', function (chunk) {
                    str += chunk;
                });//the whole response has been recieved, so we just print it out here
                response.on('end', function () {
                    let data = JSON.parse(str);

                    if (data.errors) {
                        reject(data);
                    }
                    else {
                        resolve(data);
                    }
                    // return str;
                });
                response.on('error', function () {
                    reject(str);
                    // return str;
                });
            }).end();
        })

    } catch (err) {
        throw Error(err);
    }
}


callback = function (response) {

    var str = '';//another chunk of data has been recieved, so append it to `str`
    response.on('data', function (chunk) {
        str += chunk;
    });//the whole response has been recieved, so we just print it out here
    response.on('end', function () {
        console.log(str);
        return str;
    });
}//console.log('hello js'))
// http.request(options, callback).end();//url encode instalation need to use $ npm install urlencode
