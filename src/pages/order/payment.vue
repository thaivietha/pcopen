/**
 * 开店星公众版
 * @description 基于Yii2+Vue2.0+uniapp研发，H5+小程序+公众号全渠道覆盖，功能完善开箱即用，框架成熟易扩展二开
 * @author 青岛开店星信息技术有限公司
 * @link https://www.kaidianxing.com
 * @copyright Copyright (c) 2020-2022 Qingdao ShopStar Information Technology Co., Ltd.
 * @copyright 版权归青岛开店星信息技术有限公司所有
 * @warning Unauthorized deletion of copyright information is prohibited.
 * @warning 未经许可禁止私自删除版权信息.
 */ 
<template>
    <Container>
        <Breadcrumbs :list="list"></Breadcrumbs>
        <div class="order-tip">
            <div>订单提交成功！去付款咯~</div>
            <div class="timeout flex" v-if="countDownArr.length > 0 && orderDetail.status == '0'">
                <div>剩余时间：</div>
                <div class="flex">
                    <template v-for="(time,index) in countDownArr">
                        <div v-if="time" :key="index" class="flex">
                            <span>{{ time }}</span>
                        </div>
                    </template>
                </div>
            </div>
        </div>
        <div class="order-detail">
            <div class="item">订单编号：{{ orderDetail.order_no || '' }}</div>
            <div class="item">
                订单价格：<span>{{ orderDetail.pay_price || '' }}元</span></div>
            <div class="item line1" v-if="orderDetail.buyer_name">
                收货信息：{{ orderDetail.buyer_name }} {{ orderDetail.buyer_mobile }} {{ orderDetail.address_province }}
                {{ orderDetail.address_city }} {{ orderDetail.address_area }}
                {{ orderDetail.address_detail }}
            </div>
            <div class="item line1 flex">
                商品名称：<div> <p style="margin-bottom: 10px;" v-for="(item,index) in orderDetail.goods_info" :key="index">{{ item.title }}</p></div>
            </div>
        </div>
        <div class="pay-box">
            <div class="title">选择以下支付方式</div>
            <div class="list  flex">
                <div v-for="(payItem,index) in payList" :key="index" @click="selectPayType(payItem)">
                    <div v-if="payItem.type == 'balance'" class="item  flex"
                         :class="[payType == payItem.type ? 'active' :'']">
                        <i v-if="payType == payItem.type" class="iconfont icon-a-chenggongde21"></i>
                        <img class="icon" src="../../../static/images/order/default.png" alt="">
                        <div>
                            <div class="name">余额支付</div>
                            <div class="balance">余额：{{ uerInfo.balance || '0' }}</div>
                        </div>
                    </div>
                    <div v-if="payItem.type == 'wechat'" class="item  flex"
                         :class="[payType == payItem.type ? 'active' :'']">
                        <i v-if="payType == payItem.type" class="iconfont icon-a-chenggongde21"></i>
                        <img class="icon" src="../../../static/images/order/wechat.png" alt="">
                        <div>
                            <div class="name">微信支付</div>
                        </div>
                    </div>
                    <div v-if="payItem.type == 'alipay'" class="item  flex"
                         :class="[payType == payItem.type ? 'active' :'']">
                        <i v-if="payType == payItem.type" class="iconfont icon-a-chenggongde21"></i>
                        <img class="icon" src="../../../static/images/order/ali.png" alt="">
                        <div>
                            <div class="name">支付宝支付</div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="to-pay flex">
                <Button type="error" :loading="btLoading" @click="pay" class="bnt bg-color">去支付</Button>
            </div>
        </div>
    </Container>
</template>

<script>
import {countDownFun} from '@/util/jsTool'
import orderApi from '@/api/order'
import userApi from '@/api/user'
import mixin from './mixins.js'

export default {
    name: "payment",
    mixins:[mixin],
    data() {
        return {
            list: [{
                name: '首页',
                path: '/'
            }, {
                name: '提交订单',
                path: ''
            }, {
                name: '确认订单'
            }],
            temp: null,
            checkPatTime: null,
            orderDetail: {},//详情
            goods_info: {},//商品信息
            countDownArr: [],//倒计时
            uerInfo: {},//用户余额信息
            payList: [],//支付列表
            payType: '',// 0 余额 1 微信 2 支付宝
            btLoading: false,//加载


        }
    },
    created() {
        this.getOrderDetail()
        this.getUerInfo()
    },
    mounted() {
        this.getTimeOut()
        if (window.history && window.history.pushState) {
            // 向历史记录中插入了当前页
            window.addEventListener('popstate', this.goBack, false);
        }

    },
    computed: {},
    methods: {
        selectPayType(item) {
            this.payType = item.type
        },
        getUerInfo() {
            userApi.getUerInfo({
                hideSuccessTip: true,
                success: (res) => {
                    if (res.error != 0) return
                    this.uerInfo = res.data
                }
            })
        },
        getOrderDetail() {
            orderApi.orderDetail({
                order_id: this.$route.query.order_id || ''
            }, {
                hideSuccessTip: true,
                success: (res) => {
                    if (res.error != 0) return
                    this.orderDetail = res
                    this.goods_info = res.goods_info[0]
                    this.getPayList()
                    if (res.status == '0') {
                        this.getTimeOut()
                    }
                }
            })
        },
        getPayList() {
            orderApi.orderPayList({
                order_id: this.$route.query.order_id || '',
                activity_type: this.orderDetail.activity_type || '0'
            }, {
                hideSuccessTip: true,
                success: (res) => {
                    if (res.error != 0) return
                    this.payList = [];
                    for (let i in res.payList) {
                        if (res.payList[i].enable == 1 && i != 'delivery') {//没有货到付款
                            this.payList.push({type: i})
                        }
                    }
                }
            })
        },
        goBack() {
            history.pushState(null, null, `/goods/detail?id=${this.$route.query.goods_id}`);
            this.$router.push('/goods/detail?id=' + this.$route.query.goods_id)
        },
        pay() {
            if (this.payType == '') {
                this.$Message.error('请选择支付方式');
                return
            }
            switch (this.payType) {
                case 'balance':
                    this.btLoading = true
                    orderApi.orderPay({
                        order_id: this.$route.query.order_id || '',
                        pay_type: this.payType
                    }, {
                        hideSuccessTip: true,
                        success: (res) => {
                            if (res.error != 0) return
                            this.checkPay()
                        },fail:()=>{
                            this.btLoading = false
                        }
                    })
                    break;
                case 'wechat':
                    this.$router.push({
                        path: '/order/wxPay',
                        query: {
                            order_id: this.$route.query.order_id || '',
                            type: this.payType,
                            price: this.orderDetail.pay_price
                        }
                    })
                    break;
                case 'alipay':
                    this.$router.push({
                        path: '/order/aliPay',
                        query: {
                            order_id: this.$route.query.order_id || '',
                            type: this.payType,
                            price: this.orderDetail.pay_price
                        }
                    })
            }
        },
        getTimeOut() {
            clearInterval(this.temp)
            let notUnit = false //不带时分秒单位
            let endTime = new Date(this.orderDetail.auto_close_time).getTime()//结束时间
            let nowTime = new Date().getTime()//现在时间
            this.endTime = endTime - nowTime
            if (this.endTime <= 0) {
                this.countDownArr = []
                return
            }
            this.countDownArr = countDownFun(this.endTime, notUnit)
            this.temp = setInterval(() => {
                this.endTime -= 1000
                if (this.endTime <= 0) {
                    this.countDownArr = []
                    clearInterval(this.temp)
                    return
                }
                //  this.countDownArr =>[1天,15小时,29分钟,02秒]
                this.countDownArr = countDownFun(this.endTime, notUnit)
            }, 1000)
        },
    },
    beforeDestroy() {
        clearInterval(this.temp)
        window.removeEventListener('popstate', this.goBack, false)
    }
}
</script>

<style scoped lang="scss">
.order-tip {
    padding: 55px 30px 31px;
    font-size: 32px;
    color: #fff;
    width: 1200px;
    height: 159px;
    background: url('../../../static/images/order/orderTip.png') no-repeat;
    background-size: 100% 100%;
    font-weight: 600;

    .timeout {
        font-size: 14px;
        margin-top: 12px;

    }
}

.order-detail {
    width: 100%;
    min-height: 182px;
    background-color: #fff;
    padding: 18px 30px 20px;

    .item {
        margin-top: 12px;
        font-size: 16px;
    }
}

.pay-box {
    width: 100%;
    height: 387px;
    background-color: #fff;
    margin-top: 17px;

    .title {
        height: 57px;
        padding: 0 30px;
        border-bottom: 1px dotted #cecece;
        line-height: 57px;
        font-size: 18px;
    }

    .list {
        padding: 22px 50px 55px 10px;

        .item {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 210px;
            height: 86px;
            border: 1px solid #d4d4d4;
            position: relative;
            cursor: pointer;
            margin-left: 20px;
            position: relative;

            &:hover {
                border: 1px solid #ababab;
            }

            img {
                width: 29px;
                height: 29px;
                margin-right: 10px;
            }

            .name {
                font-size: 16px;
                color: #4e4e4e;
                font-weight: 500;
            }

            .balance {
                font-size: 14px;
                color: #969696;
                margin-top: 6px;

            }

            .iconfont {
                position: absolute;
                right: -1px;
                bottom: -4px;
                color: $theme-color;
            }

            &.active {
                border: 1px solid $theme-color;

            }
        }
    }

    .to-pay {
        margin: 80px 50px 0 0;
        justify-content: flex-end;

        button {
            width: 180px;
            height: 46px;
            font-size: 16px;
        }
    }
}


</style>