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
        <div class="breadcrumd-css">
            <Breadcrumbs :list="list"></Breadcrumbs>
        </div>
        <div class="order-status">
            <div v-if="isRefundSuc" class="status-name">订单状态：售后完成</div>
            <div v-else class="status-name">订单状态：{{ orderDetail.status_text || '' }}</div>
            <div class="status-bd" v-if="orderStatus > -1">
                <ul class="flex">
                    <li v-for="(item,index) in orderStatusList" :key="index"
                        :class="[orderStatus === index ? 'now' :'']">
                        <div class="line"
                             :class="[orderStatus > index ? 'active' : '',index+1 == orderStatusList.length ? 'small' :'']">
                            <!--  已完成-->
                            <i v-if="orderStatus >= index" class="iconfont icon-yiwancheng1"></i>
                            <!-- 未完成-->
                            <i v-else class="iconfont icon-weiwancheng"></i>
                            <!--                            <div v-else class="iconfont icon-fukuan">-->
                            <div v-if="orderStatus === index" class="arrow">
                                <i class="iconfont" :class="[item.icon]"></i>
                                <div v-if="orderStatus< index" class="arrow-icon"></div>
                            </div>
                            <!--                            </div>-->
                        </div>
                        <div class="info">
                            <div>{{ item.name }}</div>
                            <div class="time">{{ item.time || '' }}</div>
                        </div>
                    </li>
                    <!--                    <li :class="[orderStatus === 0 ? 'now' :'']">-->
                    <!--                        <div class="line " :class="[orderStatus > 0 ? 'active' : '']">-->
                    <!--                            <div v-if="orderStatus > 0" class="iconfont icon-yiwancheng1"></div>-->
                    <!--                            <div v-else class="iconfont icon-fukuan">-->
                    <!--                                <div v-if="orderStatus === 0" class="arrow">-->
                    <!--                                    <i class="iconfont icon-daifahuo"></i>-->
                    <!--                                </div>-->
                    <!--                            </div>-->
                    <!--                        </div>-->

                    <!--                        <div class="info">-->
                    <!--                            <div>待付款</div>-->
                    <!--                            <div class="time">2022-01-20</div>-->
                    <!--                        </div>-->
                    <!--                    </li>-->
                    <!--                    <li :class="[orderStatus === 1 ? 'now' :'']">-->
                    <!--                        <div class="line" :class="[orderStatus > 1 ? 'active' : '']">-->
                    <!--                            <div v-if="orderStatus > 1" class="iconfont icon-yiwancheng1"></div>-->
                    <!--                            <div v-else class="iconfont icon-weiwancheng">-->
                    <!--                                <div v-if="orderStatus === 1" class="arrow">-->
                    <!--                                    <i class="iconfont icon-daifukuan"></i>-->
                    <!--                                </div>-->
                    <!--                            </div>-->
                    <!--                        </div>-->

                    <!--                        <div class="info">-->
                    <!--                            <div>待发货</div>-->
                    <!--                            <div class="time">2022-01-20</div>-->
                    <!--                        </div>-->
                    <!--                    </li>-->
                    <!--                    <li :class="[orderStatus === 2 ? 'now' :'']">-->
                    <!--                        <div class="line" :class="[orderStatus > 2 ? 'active' : '']">-->
                    <!--                            <div v-if="orderStatus > 2" class="iconfont icon-yiwancheng1"></div>-->
                    <!--                            <div v-else class="iconfont icon-weiwancheng">-->
                    <!--                                <div v-if="orderStatus === 2" class="arrow">-->
                    <!--                                    <i class="iconfont icon-daishouhuo"></i>-->
                    <!--                                </div>-->
                    <!--                            </div>-->
                    <!--                        </div>-->

                    <!--                        <div class="info">-->
                    <!--                            <div>待收货</div>-->
                    <!--                            <div class="time"></div>-->
                    <!--                        </div>-->
                    <!--                    </li>-->
                    <!--                    <li :class="[orderStatus === 3 ? 'now' :'']">-->
                    <!--                        <div class="last-icon" :class="[orderStatus === 3 ? 'active' : '']">-->
                    <!--                            <div v-if="orderStatus === 3 " class="iconfont icon-yiwancheng1"></div>-->
                    <!--                            <div v-else class="iconfont icon-weiwancheng"></div>-->
                    <!--                            &lt;!&ndash;                            <div class="iconfont icon-wancheng"></div>&ndash;&gt;-->
                    <!--                        </div>-->
                    <!--                        <div class="info">-->
                    <!--                            <div>已完成</div>-->
                    <!--                            <div class="time"></div>-->
                    <!--                        </div>-->
                    <!--                    </li>-->
                </ul>
            </div>
        </div>

        <!-- 发货信息 -->
        <div class="order-info"
             v-if="orderDetail.status === '30' &&  orderDetail.goods_info && orderDetail.goods_info[0].type === '1' && orderDetail.goods_info[0].auto_deliver === '1' && orderDetail.goods_info[0].auto_deliver_content">

            <div class="common-title">发货信息</div>
            <div class="order-bd">
                <ul>
                    <li class="flex between">
                        <div class="left">{{ orderDetail.goods_info[0].auto_deliver_content }}</div>
                        <input style="visibility: hidden" class="left" id="copyText"
                               :value="orderDetail.goods_info[0].auto_deliver_content"/>
                        <div class="right " @click="handleCopy">复制</div>
                    </li>
                </ul>
            </div>
        </div>
        <!-- 虚拟卡密商品 - 卡密信息且已完成状态显示 -->
        <div v-if="orderDetail.status == '30' &&  orderDetail.goods_info &&  orderDetail.goods_info[0].type == '2'">
            <accountInfo :orderData="orderDetail" :orderGoods="orderDetail.goods_info"></accountInfo>
        </div>
        <div class="order-info">
            <div class="common-title">订单信息</div>
            <div class="order-bd">
                <ul>
                    <li class="flex">
                        <div>订单编号：</div>
                        <div>{{ orderDetail.order_no }}</div>
                    </li>
                    <li class="flex">
                        <div>下单日期：</div>
                        <div>{{ orderDetail.create_time }}</div>
                    </li>
                    <li class="flex">
                        <div>支付时间：</div>
                        <div>{{ orderDetail.pay_time }}</div>
                    </li>
                    <li class="flex">
                        <div>支付方式：</div>
                        <div>{{ orderDetail.pay_type_text }}</div>
                    </li> <!---->
                    <li class="flex">
                        <div>订单金额：</div>
                        <div class="money">￥{{ orderDetail.goods_price }}</div>
                    </li>
                    <li class="flex" v-if="orderDetail.buyer_remark">
                        <div>买家备注：</div>
                        <div>{{ orderDetail.buyer_remark }}</div>
                    </li>
                </ul>
            </div>
        </div>
        <div class="address-info"  v-if=" orderDetail.dispatch_type !=='20' && orderDetail.goods_info && orderDetail.orderGoods[0].type === '0'">
            <div class="common-title">收货信息</div>
            <ul>
                <li class="flex">
                    <div>收货人：</div>
                    <div>{{ orderDetail.buyer_name }}</div>
                </li>
                <li class="flex">
                    <div>联系电话：</div>
                    <div>{{ orderDetail.buyer_mobile }}</div>
                </li>
                <li class="flex">
                    <div>收货地址：</div>
                    <div>{{ orderDetail.address_province }}{{ orderDetail.address_city }}{{
                            orderDetail.address_area
                        }}{{ orderDetail.address_detail }}
                    </div>
                </li>
            </ul>
        </div>
        <div class="goods-info">
            <div class="common-title">商品信息</div>
            <ul class="goods">
                <li class="flex" v-for="(item,index) in orderDetail.orderGoods" :key="index">
                    <div class="goods-img">
                        <img
                            :src="$utils.mediaUrl(item.thumb)">
                    </div>
                    <div class="goods-msg">
                        <p class="line2">{{ item.title }}</p>
                        <div class="info">
                            {{ item.option_title || '默认' }}
                            <span class="cart-num">x{{ item.total }}</span>
                        </div>
                        <div class="price">
                            <span class="money">￥{{ item.price }}</span>
                            <!--                            <del>￥69.00</del>-->
                        </div>
                    </div>
                </li>
            </ul>
            <ul class="info">
                <!--                <li class="price flex" v-for="(item,index) in priceList" :key="index">-->
                <!--                    <div>{{ item.title }} <span style="color: #aaa" v-if="item.desc">{{ item.desc }}</span>:</div>-->
                <!--                    <div v-if="item.price">{{ item.price }}</div>-->
                <!--                </li>-->
                <li class="flex">
                    <div>运费:</div>
                    <div v-if="orderDetail.dispatch_price">¥{{ Number(orderDetail.dispatch_price) }}</div>
                </li>
                <li class="price flex" v-for="(item,key) in orderDetail.extra_price_package_text" :key="key">
                    <div>{{ key }}:</div>
                    <div>-¥{{ item }}</div>
                </li>
            </ul>
        </div>
        <div class="button-box">
            <div>
                共{{ goodsTotal }}件商品，订单总金额为：<span class="money">￥<b>{{ orderDetail.pay_price }}</b></span>
            </div>
            <div class="flex button">
                <Button type="error" v-if="orderDetail.status == 0"
                        :class="orderDetail.is_buy?'disabled':'border-primary theme-primary-color theme-primary-border'"
                        @click.stop="btnClick('payOrder')">去支付
                </Button>
                <!-- 待发货实体商品显示查看物流  （同城配送不显示查看物流）-->
                <Button
                    v-if="((orderDetail.status == 20 && orderDetail.goods_info[0].type === '0') || (orderDetail.status == 11 || orderDetail.status == 30)) && orderDetail.dispatch_type === '10'"
                    @click.stop="btnClick('express')">查看物流
                </Button>
                <Button v-if="orderDetail.status == 20"
                        class="border-primary theme-primary-color theme-primary-border"
                        @click.stop="btnClick('sendOrder')">确认收货
                </Button>
                <Button v-if="canShowAll && orderDetail.refund_type != '1' "
                        class="border-primary theme-primary-color theme-primary-border"
                        @click.stop="btnClick('refundOrder')">申请退款
                </Button>
                <Button v-if="orderDetail.refund_type === '1'" @click="btnClick('refundDetail')">售后详情</Button>
                <!-- 订单状态为已完成并且后台开启订单评价显示 -->
                <Button
                    v-if="orderDetail.status == 30 && is_comment == 1 && orderDetail.comment_status == 0 && orderDetail.activity_type !== '5'"
                    class="border-primary theme-primary-color theme-primary-border"
                    @click.stop="btnClick('comment')">立即评价
                </Button>
            </div>

        </div>
        <Modal v-model="showTake" width="360" class-name="cancelBox">
            <div style="text-align:center;height: 60px;line-height: 60px">
                <p>确认收到所有商品了吗？</p>
            </div>
            <div slot="footer">
                <Button size="large" type="info" long :loading="modal_loading" @click="confirmGoods">确认收货</Button>
            </div>
        </Modal>
    </Container>
</template>

<script>
import orderApi from '@/api/order'
import accountInfo from './orderComponents/accountInfo'
export default {
    name: "orderDetial",
    components:{accountInfo},
    data() {
        return {
            orderDetail: {},
            showTake: false,
            modal_loading: false,
            is_comment: 0,
            list: [{
                name: '首页',
                path: '/'
            }, {
                name: '个人中心',
                path: '/member'
            }, {
                name: '我的订单',
                path: '/member/order'
            }, {
                name: '订单详情',
            }],
            orderStatusList: [{
                icon: 'icon-daifukuan',
                name: '待付款',
                steps: 0,
                time: '2022-01-02'
            }, {
                icon: 'icon-daifahuo',
                name: '待发货',
                steps: 1,
                time: '2022-01-02'
            }, {
                icon: 'icon-daishouhuo',
                name: '待收货',
                steps: 2
            }, {
                icon: 'icon-yiwancheng',
                name: '已完成',
                steps: 3
            }],
            orderStatus: 0,//0待付款 1 待发货 2 待收货 3 已完成
        }
    },
    created() {
        this.getData()

    },
    mounted() {
        if (window.history && window.history.pushState) {
            // 向历史记录中插入了当前页
            window.addEventListener('popstate', this.goBack, false);
        }
    },
    methods: {
        btnClick(type) {
            switch (type) {
                // 去支付
                case 'payOrder':
                    this.$router.push({path: '/order/payment', query: {order_id: this.orderDetail.id}})
                    break;
                // 查看物流
                case 'express':
                    this.$router.push({
                        path: '/order/package',
                        query: {
                            package_id: this.orderDetail.orderGoods[0].package_id,
                            order_id: this.orderDetail.orderGoods[0].order_id
                        }
                    })
                    break;
                // 确认收货
                case 'sendOrder':
                    this.showTake = true

                    break;
                case 'refundOrder':
                    this.$router.push({path: '/order/refund', query: {order_id: this.orderDetail.id}})
                    break;
                case 'refundDetail':
                    this.$router.push({path: '/order/refundDetail', query: {order_id: this.orderDetail.id}})
                    break;
                // 评价
                case 'comment':
                    if(this.orderDetail.goods_info.length >1){//评价列表
                        this.$router.push({path:'/order/commentList',query:{order_id:this.$route.query.order_id}})
                    }else{//评价页
                        this.$router.push({path:'/order/comment',query:{id:this.orderDetail.goods_info[0].order_goods_id}})
                    }
                    break;
            }
        },
        confirmGoods() {
            this.modal_loading = true;
            orderApi.orderFinish({id: this.$route.query.order_id}, {
                hideSuccessTip: true,
                success: (res) => {
                    if (res.error != 0) return
                    this.showTake = false;
                    this.modal_loading = false
                    this.$Message.success('确认收货成功');
                    this.getData()
                },
                fail: () => {
                    this.showTake = false;
                    this.modal_loading = false
                }

            })
            setTimeout(() => {
                this.modal_loading = false
            }, 3000)
        },
        handleCopy() {
            if (!this.orderDetail.goods_info[0].auto_deliver_content) {
                return
            }
            var copyText = document.getElementById('copyText')
            copyText.select(); // 选择对象
            document.execCommand("Copy"); // 执行浏览器复制命令
            this.$Message.success('复制成功');

        },
        getData() {
            orderApi.orderDetail({order_id: this.$route.query.order_id}, {
                hideSuccessTip: true,
                success: (res) => {
                    if (res.error != 0) return
                    this.orderDetail = res
                    this.is_comment = res.comment_setting.order_comment;

                    this.setOrderStatus()
                }
            })
        },
        setOrderStatus() {
            // orderStatus: 2,//0待付款 1 待发货 2 待收货 3 已完成
            // status -1 已关闭 0代付款 10代发货 20 待收货 30完成
            switch (this.orderDetail.status) {
                case '10':
                    this.orderStatus = 1
                    break;
                case '0':
                    this.orderStatus = 0
                    break;
                case '20':
                    this.orderStatus = 2
                    break;
                case '30':
                    this.orderStatus = 3
                    break;
                default:
                    this.orderStatus = -1
                    break;
            }
        },
        goBack() {
            // history.pushState(null, null, `/member/order`);
            this.$router.push('/member/order')
        },
        // 判断订单状态
        checkOrderSts({status}) {
            let flag = true
            // 状态为30时检测维权时间是否在范围内
            if (status === '30') {
                flag = this.allowFinish
            } else if (status == '-1') {
                flag = false
            } else {
                let pass = ['10', '11', '20']
                flag = pass.indexOf(status) > -1
            }
            return flag
        },

    },
    computed: {
        isRefundSuc(){
            let status = false
            if(this.orderDetail){
                status = (this.orderDetail.refund_status =='10' || this.orderDetail.refund_status == '11') || false
            }
        return status
        },
        goodsTotal() {
            if (this.orderDetail.orderGoods) return this.orderDetail.orderGoods.length
            return '1'
        },
        // 订单完成时时检测维权时间是否在范围内
        allowFinish() {
            return this.orderDetail.refund_setting?.refund_time_status === 1
        },
        // 是否显示申请维权 (同城配送 待收货状态 不能维权)
        canShowAll() {
            return (
                this.checkOrderSts(this.orderDetail) &&
                this.hasIntersect &&
                !(this.orderDetail.status === '20' && this.orderDetail.dispatch_type === '30')
            )
        },

        // 判断是否有维权项
        hasIntersect() {
            let obj = {
                exchange: '1',
                refund: '1',
                return: '1'
            }
            this.orderDetail.orderGoods.forEach(v => {
                Object.keys(obj).forEach(key => {
                    if (v.refund_rule[key] != '1') {
                        delete obj[key]
                    }
                })
            })

            return Object.keys(obj).length > 0
        },
        orderCoupon() {
            let coupon = this.orderDetail?.activity_return_data?.coupon || []
            return coupon
        },
        couponPrice() {
            if (this.orderDetail?.extra_price_package?.coupon) {
                return this.orderDetail.extra_price_package.coupon
            }
            return 0
        },
        // 价格规格
        priceRules() {
            let priceRules = {}
            if (this.orderDetail?.extra_price_package) {
                for (let key in this.orderDetail.extra_price_package) {
                    this.orderDetail.extra_discount_rules_package.forEach(
                        (item) => {
                            if (item[key]) {
                                priceRules = {
                                    ...priceRules,
                                    [key]: item[key],
                                }
                            }
                        }
                    )
                }
            }
            return priceRules
        },
        balance_text() {
            return (this.$store.state.setting?.systemSetting?.balance_text || '余额')
        },
        credit_text() {
            return (this.$store.state.setting?.systemSetting?.credit_text || '积分')
        },
        seckillPrice() {
            return this.orderDetail.extra_price_package?.seckill
        },
        price() {
            return this.orderDetail?.extra_price_package || {}
        },
        priceList() {
            let result = []
            let goodsInfo = this.orderDetail.goods_info;
            let goods_type
            /* --------单商户------------------------ */
            let {pay_credit} = this.orderDetail
            let priceText = `￥${parseFloat(this.orderDetail.goods_price).toFixed(2)}`
            if (pay_credit) {
                priceText = `${this.orderDetail.pay_credit}${this.credit_text}+${priceText}`
            }
            if (goodsInfo && goodsInfo.length > 0) {
                goods_type = goodsInfo[0].type
            }
            result = [
                {
                    title: '商品小计',
                    price: priceText,
                    show: this.orderDetail && (this.orderDetail.goods_price || pay_credit)
                },
                {
                    title: '拼团优惠',
                    price: `-￥${parseFloat(this.price?.groups).toFixed(2)}`,
                    show: this.price?.groups > 0
                },
                {
                    title: '团长优惠',
                    price: `-￥${parseFloat(this.price?.groups_leader).toFixed(2)}`,
                    show: this.price?.groups_leader > 0
                },
                {
                    title: '会员优惠',
                    price: `-￥${this.price?.member_price}`,
                    show: this.price && this.price.member_price
                },
                {
                    title: '优惠券',
                    price: `-￥${this.price?.coupon}`,
                    desc: `（满￥${this?.priceRules?.coupon?.enough}${this?.priceRules?.coupon?.coupon_sale_type == 1 ? '减￥' : '享'}${this?.priceRules?.coupon?.discount_price}${this?.priceRules?.coupon?.coupon_sale_type == 1 ? '' : '折'}）`,
                    show: this.price && this.price.coupon
                },
                {
                    title: '商城优惠',
                    price: `-￥${this.price?.full_deduct}`,
                    desc: `（单笔满￥${this?.priceRules?.full_deduct?.enough}立减￥${this?.priceRules?.full_deduct?.deduct}）`,
                    show: this.price && this.price.full_deduct
                },
                {
                    title: '满减/折',
                    price: `-￥${this.price?.full_reduce}`,
                    desc: ``,
                    show: this.price && this.price.full_reduce
                },
                {
                    title: `${this.credit_text}抵扣`, // 积分抵扣
                    price: `-￥${this.orderDetail?.max_deduction_credit_money}`,
                    show: this.orderDetail?.max_deduction_credit > 0 && this.confirmData?.deduct_credit == 1
                },
                {
                    title: `${this.balance_text}抵扣`, // 余额抵扣
                    price: `-￥${this.orderDetail?.max_deduction_balance}`,
                    show: this.orderDetail?.max_deduction_balance > 0 && this.confirmData?.deduct_balance == 1
                },
                {
                    title: this?.presellData?.presell_type == 0 ? '定金抵扣优惠' : '预售优惠',
                    price: `-￥${this?.presellData?.actual_deduct}`,
                    show: this?.presellData && this?.presellData?.title
                },
                {
                    title: '秒杀优惠',
                    price: `-￥${this?.seckillPrice}`,
                    show: this?.seckillPrice > 0
                },
                {
                    title: this.giftSetting?.card_title,
                    price: `-￥${this.price?.gift_card}`,
                    show: this.price && this.price.gift_card
                },
                {
                    title: '运费',
                    price: `￥${parseFloat(this.orderDetail?.dispatch_price) || 0}`,
                    desc: this.orderDetail?.dispatch_type == '30' ? ` （${this.dispatchName[30] ? this.dispatchName[30] : '同城配送'}）` : '',
                    show: goods_type == 0 && this.orderDetail?.dispatch_type != '20'
                },
                {
                    title: '合计',
                    price: `￥${parseFloat(Number(this.orderDetail.pay_price) + Number(this.presellData?.front_money || 0)).toFixed(2)}`,
                    show: this?.presellData && this?.presellData?.presell_type == 0
                },
            ];

            result = result.filter(item => item.show);
            return result
        }
    },
    beforeDestroy() {
        window.removeEventListener('popstate', this.goBack, false)
    }
}
</script>

<style scoped lang="scss">
.common-title {
    padding: 18px 22px;
    font-size: 18px;
    color: #282828;
    background-color: #FFFFFF;
    border-bottom: 1px dashed #cecece;
}

.breadcrumd-css {
    margin: 10px 0;
    padding: 0 10px;
    background-color: #fff;

}

.order-status {
    background-color: #FFFFFF;
    padding: 0 0 24px;

    .status-name {
        padding: 26px 22px 0px;
        font-size: 18px;
        //font-weight: bold;
    }

    .status-bd {
        overflow: hidden;
        padding: 27px 0 70px;
        font-size: 16px;

        li:nth-child(1) {
            margin-left: 111px
        }

        li {
            position: relative;

            &.now {
                .info {
                    color: $theme-color;
                }
            }

            .line {
                //position: absolute;
                //top: 50%;
                position: relative;
                left: 16px;
                width: 310px;
                height: 4px;
                background: #c7c7c7;
                //transform: translateY(-50%);
                //background-color: $theme-color;
                &.small {
                    width: 10px !important;
                }

                .iconfont {
                    color: #cccccc;
                    position: absolute;
                    left: -3px;
                    top: -10px;
                    z-index: 10;
                    background-color: #FFFFFF;
                    font-size: 18px;

                    &.icon-weiwancheng {
                        padding: 0 3px;
                        top: -9px;
                        font-size: 12px;
                        border-radius: 50%;
                        border: 1px solid #cccccc;
                        color: #FFFFFF;
                    }
                }

                &.active {
                    background: $theme-BgColor;

                    .iconfont {
                        color: $theme-color;
                    }
                }

                .arrow {
                    position: absolute;
                    top: -10px;
                    z-index: 20;
                    left: -5px;
                    width: 35px;
                    height: 35px;
                    border-radius: 50%;
                    display: flex;
                    background-color: #FFFFFF;
                    align-items: center;
                    justify-content: center;
                    color: red;
                    border: 3px solid $theme-color;
                    transform: translate(-8px, -6px);

                    .arrow-icon {
                        &:after {
                            content: '';
                            display: block;
                            position: absolute;
                            right: -80px;
                            top: 7px;
                            width: 80px;
                            height: 16px;
                            background: $theme-BgColor;
                        }

                        &:before {
                            content: "";
                            position: absolute;
                            top: 7px;
                            right: -96px;
                            border: 8px solid transparent;
                            border-left-color: $theme-BgColor;
                        }
                    }

                    i {

                        position: static;
                        font-size: 18px;
                        height: 16px;
                        display: block;
                        line-height: 16px;
                        color: red;

                    }
                }
            }

            .info {
                width: 100px;
                position: absolute;
                top: 30px;
                left: -30px;
                white-space: nowrap;
                font-size: 16px;
                text-align: center;

                .time {
                    margin-top: 4px;
                    font-size: 14px;
                    color: #9a9a9a;
                }
            }

            .last-icon {
                color: #cccccc;
                position: absolute;
                left: 5px;
                top: -9px;
                z-index: 10;
                background-color: #ffffff;

                .icon-weiwancheng {
                    padding: 0 3px;
                    font-size: 12px;
                    border-radius: 50%;
                    border: 1px solid #cccccc;
                    color: #FFFFFF;
                }

            }
        }

    }
}

.order-info {
    margin-top: 14px;

    .order-bd {
        background-color: #FFFFFF;

        ul {
            padding: 2px 22px 22px;
            font-size: 16px;
            color: #282828;

            li {
                margin-top: 20px;

                .money {
                    color: $theme-color;
                }

                > div:nth-child(1) {
                    flex-shrink: 0;
                }

                &.between {

                    justify-content: space-between;

                    .right {
                        cursor: pointer;
                        color: $theme-color;
                    }
                }
            }

        }
    }
}

.address-info {
    margin-top: 14px;
    background-color: #FFFFFF;

    ul {
        padding: 2px 22px 22px;
        font-size: 16px;
        color: #282828;

        li {
            margin-top: 20px;

            .money {
                color: $theme-color;
            }
        }
    }

}

.goods-info {
    margin-top: 14px;
    background-color: #FFFFFF;

    ul {
        padding: 2px 22px 22px;
        font-size: 16px;
        color: #282828;

        li {
            margin-top: 20px;

            .goods-img {
                width: 86px;
                height: 86px;

                img {
                    width: 100%;
                    height: 100%;
                }
            }

            .goods-msg {
                margin-left: 26px;
                margin-right: 56px;

                > p {
                    font-size: 16px;
                    color: #282828;
                }

                .info {
                    font-size: 12px;
                    color: #aaa;
                    margin-top: 4px;

                    .cart-num {
                        color: $theme-color;
                    }
                }
            }

            .price {
                margin-top: 10px;
                font-size: 14px;
                color: #919191;

                del {
                    margin-left: 12px;
                    font-size: 14px;
                    color: #919191;
                    position: relative;
                    top: 1px
                }
            }

            .money {
                color: $theme-color;
            }
        }
    }

    > .info {
        border-top: 1px dashed #cecece;
    }

}

.button-box {
    border-top: 1px dashed #cecece;
    background-color: #FFFFFF;
    padding: 28px 22px;
    font-size: 16px;
    display: flex;
    justify-content: space-between;

    .money {
        font-size: 22px;
        color: $theme-color;
    }

    .button {
        font-size: 22px;

        button {
            width: 110px;
            height: 40px;
            margin-left: 15px;
        }
    }
}

</style>