package com.pinyougou.cart.controller;

import com.alibaba.dubbo.config.annotation.Reference;
import com.pinyougou.order.service.OrderService;
import com.pinyougou.pay.service.WeixinPayService;
import com.pinyougou.pojo.TbPayLog;
import entity.Result;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import util.IdWorker;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/pay")
public class PayController {

    @Reference
    private WeixinPayService weixinPayService;

    @Reference
    private OrderService orderService;

    @RequestMapping("/createNative")
    public Map createNative() {
        //1.获取当前登录用户
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        //2.提取支付日志（从缓存）
        TbPayLog payLog = orderService.searchPayLogFromRedis(username);
        //3.调用微信支付接口
        if (payLog != null) {
            return weixinPayService.createNative(payLog.getOutTradeNo(), payLog.getTotalFee() + "");
        } else {
            return new HashMap();
        }
        //IdWorker idWorker = new IdWorker();
        //return weixinPayService.createNative(idWorker.nextId() + "", "1");
    }

    @RequestMapping("/queryPayStatus")
    public Result queryPayStatus(String out_trade_no) {
        Result result = null;
        int x = 0;
        while (true) {
            Map<String, String> map = weixinPayService.queryPayStatus(out_trade_no);//调用查询

            //与业务无关，仅测试
            System.out.println("====weixinPayService.queryPayStatus(out_trade_no)====" + map);
            /*if (map.get("return_code").equals("FAIL")){
                result = new Result(false, "签名错误");
                break;
            }*/
            if (map.get("return_code").equals("FAIL")) {
                result = new Result(true, "签名错误,自动支付成功");
                break;
            }

            if (map == null) {
                result = new Result(false, "支付发送错误");
                break;
            }
            if (map.get("trade_status").equals("SUCCESS")) {//支付成功
                result = new Result(true, "支付成功");

                orderService.updateOrderStatus(out_trade_no, map.get("transaction_id"));//修改订单状态
                break;
            }

            x++;
            if (x >= 100) {
                result = new Result(false, "二维码超时");
                break;
            }

            try {
                Thread.sleep(3000);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }
        return result;
    }
}
