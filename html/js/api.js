const base_url = "https://llw.tw/api/v1"
//var base_url = "http://llw.tw:8756"
const reg1 =/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,16}$/;
const reg2 = /^[A-Za-z0-9-_]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;

function Registration() {
    var username = $('#username').val();
    var email = $('#email').val();
    var password1 = $('#password1').val();
    var password2 = $('#password2').val();
    var data = {
        "username": username,
        "email": email,
        "password": password1,
        "re_password": password2
    }
    //console.log(data);

    if (reg1.test(password1)&&(password1==password2)&&(reg2.test(email))){
    }
    else if (!reg1.test(password1)){
        alert("僅支持8-16位密碼，必須含有字母和數字");}
    else if (!reg2.test(email)){
        alert("不是有效的電子信箱格式");}
    else if (password1!=password2){
        alert("兩次密碼輸入不一致");
    }
    $.ajax({
        url: base_url + "/auth/users/",
        method: "POST",
        timeout: 0,
        headers: {
            "Content-Type": "application/json",
        },
        data: JSON.stringify(data),

        success: function (response) {
            alert('成功註冊，接下來將為您轉回註冊前介面。');
            if(document.referrer=="" || document.referrer==document.href){
                window.location.href = "./ChainFunding.html";
            }
            else{
                window.history.back(-1);
            }
        },

        error: function (jqXHR) {
            if(jqXHR.status=='400'){
                alert('該帳戶名已被使用，請更換');
            }
        }
    })

}

function Login() {
    var account = $('#account').val();
    var password = $('#password').val();

    var data = {
        "username": account,
        "password": password,
    }

    $.ajax({
        url: base_url + "/auth/jwt/create/",
        type: 'POST',
        contentType: "application/json",
        data: JSON.stringify(data),
        success: function (response) {
            $('#send_data').html(response);
            document.cookie = "refresh="+response.refresh;
            document.cookie = "access="+response.access;
            alert('成功登入，接下來將為您轉回登入前介面。');
            if(document.referrer=="" || document.referrer==document.href){
                window.location.href = "./ChainFunding.html";
            }
            else{
                window.history.back(-1);
            }

        },
        error: function (jqXHR) {
            if(jqXHR.status=='400'){
                alert('請先輸入您的帳戶和密碼！');
            }
            if(jqXHR.status=='401'){
                alert('您的密碼不正確，或您的帳戶不存在，請重新輸入');
            }
        }
    })
}

function Logout(){
    document.cookie='refresh=; expires=Thu, 01 Jan 1970 00:00:00 UTC;';
    document.cookie='access=; expires=Thu, 01 Jan 1970 00:00:00 UTC;';
    location.reload();
}

function GetWalletBalance(Wtype){
    var walletApi={
        "url":base_url+"/wallet/"+Wtype,
        "method": "GET",
        "timeout": 0,
        "headers": {
          "Authorization": "Bearer "+$.cookie('access')
        },
    };
    var balance;
    $.ajax(walletApi).done(function (response) {
        balance=parseFloat(response.amount).toFixed(3);
        var reg02 = /\B(?=(\d{3})+(?!\d))/g;
        var walletid=Wtype+'-balance';
        document.getElementById(walletid).innerText=balance.toString().replace(reg02, ',');
    });
    
}

function usermenucheck(){
    var ca=document.cookie.split(';'); 
    if(ca.length<=1){   //如果找不到access 即未登入 跳回到登入界面
        window.location.href = "./login.html";
    }
    GetWalletBalance('weth');
    GetWalletBalance('usdt');
    GetWalletBalance('usdc');
}

function newfunding(){//新增集資
    var ca=document.cookie.split(';'); 
    if(ca.length<=1){   //檢查access
        window.location.href = "./login.html";
    }
    var nftId=0;
    var address="12345678";
    var name="abcd";
    var startTime=$('#start-date').val();
    var endTime=$('#end-date').val();
    var token='weth'; //幣種
    var buyPrice= $('#buy-price').val();
    var sellPrice= $('#sell-price').val();
    //var gasPrice= 0.001;手續費自動帶0.1%
    var stopPrice= $('#stop-price').val();
    var lowest_share= $('#lowest-share').val();// 最低參與比例
    
    var data = {
        "nftId": nftId,
        "nftContractAddress": address,
        "nftName": name,
        "startTime": startTime+'T00:00:00+08:00',
        "endTime": endTime+'T23:59:59+08:00',
        "token": token,
        "buyPrice": buyPrice,
        "sellPrice": sellPrice,
        //"gasPrice": gasPrice,
        "stopPrice": stopPrice,
        "lowest_share": lowest_share
    }
    //console.log(data);
    $.ajax({
        url: base_url + "/fundingprojects",
        method: "POST",
        timeout: 0,
        headers: {
            "Authorization": "Bearer "+$.cookie('access')
          },
        contentType: "application/json",
        data: JSON.stringify(data),
        success: function (response) {
            alert(response.status);
        },
        error: function (jqXHR) {
            alert(jqXHR);
        }
    })
}