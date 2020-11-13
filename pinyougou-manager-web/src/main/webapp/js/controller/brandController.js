app.controller('brandController', function ($scope, $http, brandService) {
    //查询品牌列表
    $scope.findAll = function () {
        brandService.findAll().success(
            function (response) {
                $scope.list = response;

            }
        );

    }

    //分页控件配置
    $scope.paginationConf = {
        currentPage: 1,
        totalItems: 10,
        itemsPerPage: 10,
        perPageOptions: [10, 20, 30, 40, 50],
        onChange: function () {
            //$scope.findPage($scope.paginationConf.currentPage,$scope.paginationConf.itemsPerPage);//太长，封装进方法reloadList
            $scope.reloadList();//重新加载
        }
    };

    //刷新列表
    $scope.reloadList = function () {
        $scope.search($scope.paginationConf.currentPage, $scope.paginationConf.itemsPerPage);
    }

    //分页
    $scope.findPage = function (page, rows) {
        brandService.findPage(page, rows).success(
            function (response) {
                $scope.list = response.rows;//显示当前页数据
                $scope.paginationConf.totalItems = response.total;//更新总记录数

            }
        )
    }

    //新增
    $scope.save = function () {
        var object = null;
        if ($scope.entity.id != null) {
            object = brandService.update($scope.entity);
        } else {
            object = brandService.add($scope.entity);
        }
        object.success(
            function (response) {
                if (response.success) {
                    $scope.reloadList();
                } else {
                    alert(response.message);
                }
            }
        )

    }

    //查询实体
    $scope.findOne = function (id) {
        brandService.findOne(id).success(
            function (response) {
                $scope.entity = response;
            }
        )
    }

    $scope.selectIds = [];//用户勾选的ID集合

    //用户勾选复选框
    $scope.updateSelection = function ($event, id) {
        if ($event.target.checked) {
            $scope.selectIds.push(id);//push方法向集合添加元素

        } else {
            var index = $scope.selectIds.indexOf(id);//查找值的位置
            $scope.selectIds.splice(index, 1);//参数1：移除的位置 参数2：移除的个数
        }
    }

    //删除
    $scope.dele = function () {

        brandService.dele($scope.selectIds).success(
            function (response) {
                if (response.success) {
                    $scope.reloadList();
                } else {
                    alert(response.message);
                }
            }
        );

    }

    $scope.searchEntity = {};//初始化，不然因为其为null，报400
    //条件查询
    $scope.search = function (page, rows) {
        brandService.search(page,rows,$scope.searchEntity).success(
            function (response) {
                $scope.list = response.rows;//显示当前页数据
                $scope.paginationConf.totalItems = response.total;//更新总记录数

            }
        )
    }


});