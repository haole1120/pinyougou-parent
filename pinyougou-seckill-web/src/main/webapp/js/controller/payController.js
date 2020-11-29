app.controller('payController', function ($scope, $location, payService) {

    $scope.createNative = function () {
        payService.createNative().success(
            function (response) {
                //显示订单号和金额
                $scope.money = (response.total_fee / 100).toFixed(2);
                $scope.out_trade_no = response.out_trade_no;

                //因公众账号签名过期，暂时设置code_url
                if (response.code_url == null) {
                    response.code_url = "www.baidu.com"
                }


                //生成二维码
                var qr = new QRious({
                    element: document.getElementById('qrious'),
                    size: 250,
                    level: 'H',
                    value: response.code_url
                });

                queryPayStatus();//调用查询

            }
        );
    }

    //调用查询
    queryPayStatus = function () {
        payService.queryPayStatus($scope.out_trade_no).success(
            function (response) {
                if (response.success) {
                    alert(response.message);
                    location.href = "paysuccess.html#?money=" + $scope.money;
                } else {
                    if (response.message == '二维码超时') {
                        //$scope.createNative();//重新生成二维码
                        alert("二维码超时");
                    } else {
                        location.href = "payfail.html";
                    }
                }
            }
        );
    }

    $scope.getMoney = function () {
        return $location.search()['money'];
    }

});

