//控制层
app.controller('seckillGoodsController', function ($scope, $location, $interval, seckillGoodsService) {
    //读取列表数据绑定到表单中
    $scope.findList = function () {
        seckillGoodsService.findList().success(
            function (response) {
                $scope.list = response;
            }
        );
    }

    //查询商品
    $scope.findOne = function () {
        //接收参数id
        var id = $location.search()['id'];
        seckillGoodsService.findOne(id).success(
            function (response) {
                $scope.entity = response;

                //倒计时开始
                //获取结束时间到当前日期的秒数
                allsecond = Math.floor((new Date($scope.entity.endTime).getTime() - new Date().getTime()) / 1000);

                time = $interval(function () {
                    allsecond = allsecond - 1;
                    $scope.timeString = convertTimeString(allsecond);
                    if (allsecond <= 0) {
                        $interval.cancel(time);
                    }
                }, 1000);
            }
        );
    }

    //转换为 天小时分钟秒格式 XXX天10:20:33
    convertTimeString = function (allsecond) {
        var days = Math.floor(allsecond / (60 * 60 * 24));//天数
        var hours = Math.floor((allsecond - days * 60 * 60 * 24) / (60 * 60));//小时数
        var minutes = Math.floor((allsecond - days * 60 * 60 * 24 - hours * 60 * 60) / 60);//分钟数
        var seconds = allsecond - days * 60 * 60 * 24 - hours * 60 * 60 - minutes * 60;//秒数
        var timeString = "";
        if (days > 0) {
            timeString = days + "天";
        }
        if (hours < 10) {
            hours = "0" + hours;
        }
        if (minutes < 10) {
            minutes = "0" + minutes;
        }
        if (seconds < 10) {
            seconds = "0" + seconds;
        }

        return timeString + hours + ":" + minutes + ":" + seconds;
    }

    //提交订单
    $scope.submitOrder = function () {
        seckillGoodsService.submitOrder($scope.entity.id).success(
            function (response) {
                if (response.success) {//如果下单成功
                    alert("抢购成功，请在5分钟之内完成支付")
                    location.href = "pay.html";//跳转到支付页面
                } else {
                    alert(response.message);
                }
            }
        );

    }

});
