let responseData;
document.getElementsByTagName('textarea')[0].placeholder=`POST /playserver/vod/playVOD?country=CN&ver=81050300 HTTP/1.1
Content-Length: 100
Content-Type: application/x-www-form-urlencoded; charset=UTF-8
User-Agent: Dalvik/2.1.0 (Linux; U; Android 11;)
Host: video.cn
Accept-Encoding: gzip

androidVer=11&memory=7498&data=%7B%22spVolumeId%22%3A%22MP202101151638057830004113000000%22%2C
`
function sendRequest() {
    const requestText = document.getElementById("requestText").value;

    // 显示responseStatus
    var responseStatus = document.getElementById("responseStatus");
    responseStatus.innerText = "请求已发送，请等待响应...";
    responseStatus.className = "f-r";

    fetch('http://127.0.0.1:3000/send-request', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({ requestText })
    })
    .then(response => {
    if (response.ok) {
        // 请求成功
        setTimeout(function() {
        document.getElementById('responseStatus').innerText = '请求成功';
        }, 100);
        // 设置定时器，在2秒后隐藏responseStatus并清空文本
        setTimeout(function() {
            if(response.ok) {
                responseStatus.innerText = "处理完成了，点击“下载结果”吧！";
            }else {
                responseStatus.innerText = "出错了，点击“发起请求”重试吧！";
            }
            responseStatus.className = "f-r";
        }, 500);
    } else {
        // 请求失败
        document.getElementById('resText').classList.add('hidden');
        document.getElementsByTagName('p')[0].classList.add('mt-30');
        setTimeout(function() {
            document.getElementById('responseStatus').innerText = '请求失败';
        }, 100);
    }
    try { 	// try catch for Firebase JS Client library https://codegeex.cn
        return response.json();
    }catch(e) { 	// catch any error that occurs while json parsing
        return response.text(); 	// return response body as text
    }
    })
    .then(data => {
        responseData = data;
        console.log(data); // print out response data if there is any.
        document.getElementById('resText').classList.remove('hidden');
        document.getElementsByTagName('p')[0].classList.remove('mt-30');
        try {
            document.getElementById('resText').value = JSON.stringify(responseData)
        }catch(e) {
            document.getElementById('resText').value = responseData;
        }
        // console.log(data);
    })
    .catch(error => console.error(error));
}

function downloadResult() {
    if (responseData) {
    // const blob = new Blob([JSON.stringify(responseData)], { type: 'application/json' });
    // const url = URL.createObjectURL(blob);
    // const link = document.createElement('a');
    // link.href = url;
    // link.download = 'data.json';
    // document.body.appendChild(link);
    // link.click();
    // document.body.removeChild(link);
        let res = '';
        try {
            res = JSON.stringify(responseData);
        }catch(e){
            res = responseData;
        }
        const dash_blob = new Blob([res], { type: 'text/plain' });
        saveAs(dash_blob,"info.txt");
    } else {
        // 请求成功
        setTimeout(function() {
        document.getElementById('responseStatus').innerText = '您还没有发起请求，请先点击“发起请求”!';
        }, 500);
        setTimeout(function() {
        document.getElementById('responseStatus').innerText = '';
        }, 2000);
    }
}