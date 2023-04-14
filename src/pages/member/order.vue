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
    <div class="order-box">
        <div class="member-order">
            <ul class="order-nav flex">
                <li v-for="(nav,index) in navList" @click="selectNav(nav,index)"
                    :class="[index == activeIndex ? 'active' : '']" :key="index">
                    {{ nav.name }}
                    <span v-show="nav.num">({{ nav.num }})</span>
                </li>
            </ul>
            <div class="order-list" v-if="orderList.length > 0">
                <ul v-if="activeIndex != 5">
                    <li class="item" v-for="(item,idnex) in orderList" :key="idnex">
                        <div class="item-top flex">
                            {{ item.create_time }}
                            <p v-if="item.buyer_name">
                                收件人：{{ item.buyer_name }}
                            </p>
                            <p v-if="item.order_no">订单号:{{ item.order_no }}</p>
                            <p v-if=" item.pay_type != '0'">支付方式:{{ item.pay_type | payTypeFilter }}</p>
                        </div>
                        <div class="item-goods" @click="toDetail(item)">
                            <div>
                                <div class="flex goodsItem" v-for="(goods,i ) in item.orderGoods" :key="i">
                                    <img :src="$utils.mediaUrl(goods.thumb)" alt="">
                                    <div class="goods">
                                        <p class="name">{{ goods.title }}</p>
                                        <span class="type">{{ goods.option_title || '默认' }}</span>
                                        <div class="flex">
                                            <span class="price">¥{{ goods.price_unit }}</span>
                                            <span class="total">x {{ goods.total }}</span>
                                        </div>

                                    </div>
                                </div>
                            </div>
                            <div class="status">
                                <span class="success" v-if="item.refund_finish && item.refund_finish=='1'">售后完成</span>
                                <span v-else>
                                    <span v-if="item.status == 0" class="status uni-color-primary">待付款</span>
                                    <span v-if="item.status == 10" class="status">
                                        <span class="primary" v-if="isLoadGroups(item)">待成团</span>
                                        <span class="orange" v-else>待发货</span>
                                    </span>
                                    <span v-if="item.status == 11" class="status orange">部分发货</span>
                                    <span v-if="item.status == 20 && item.dispatch_type !='20'"
                                          class="status blue">待收货</span>
                                    <span v-if="item.status == 20 && item.dispatch_type==='20'"
                                          class="status blue">{{
                                            item.orderGoods[0].type == '0' ? '待自提' : '待核销'
                                        }}</span>
                                    <span v-if="item.status == 30" class="status success">已完成</span>
                                    <span v-if="item.status == -1" class="status">已关闭</span>
                                </span>
                            </div>
                        </div>
                        <div class="item-button">
                            <div class="price flex">
                                共{{ item.orderGoods.length }}件商品，总金额
                                <p>￥{{ item.pay_price }}</p>
                            </div>
                            <div class="button flex">
                                <!-- 操作按钮 -->
                                <div class="card-btn flex" v-if="showFooterBtn(item)">
                                    <div v-if="item.refund_finish && item.refund_finish=='1'">
                                        <Button @click.stop="btnClick('deleteOrder', item)">删除订单</Button>
                                    </div>
                                    <div v-else>
                                        <Button v-if="item.status == 0" @click.stop="orderCancel(item)">
                                            取消订单
                                        </Button>
                                        <Button type="error" v-if="item.status == 0"
                                                :class="item.is_buy?'disabled':'border-primary theme-primary-color theme-primary-border'"
                                                @click.stop="btnClick('payOrder', item)">去支付
                                        </Button>
                                        <!-- 待发货实体商品显示查看物流  （同城配送不显示查看物流）-->
                                        <Button
                                            v-if="((item.status == 20 && item.orderGoods[0].type === '0') || (item.status == 11 || item.status == 30)) && item.dispatch_type === '10'"
                                            @click.stop="btnClick('express', item)">查看物流
                                        </Button>
                                        <Button v-if="item.status == 20"
                                                class="border-primary theme-primary-color theme-primary-border"
                                                @click.stop="btnClick('sendOrder', item)">确认收货
                                        </Button>
                                        <Button v-if="item.status == 30 || item.status == -1"
                                                @click.stop="orderDelete(item)">删除订单
                                        </Button>
                                        <!-- 订单状态为已完成并且后台开启订单评价显示 -->
                                        <Button
                                            v-if="item.status == 30 && is_comment == 1 && item.comment_status == 0 && item.activity_type !== '5'"
                                            class="border-primary theme-primary-color theme-primary-border"
                                            @click.stop="btnClick('comment', item)">评价
                                        </Button>
                                    </div>
                                    <!--                                    <Button  >查看详情</Button>-->
                                </div>


                                <!--                                <Button>取消订单</Button>-->
                                <!--                                <Button type="error">立即支付</Button>-->
                            </div>
                        </div>
                    </li>
                </ul>
                <ul v-else>
                    <li class="item" v-for="(item,idnex) in orderList" :key="idnex">
                        <div class="item-top flex">
                            {{ item.create_time }}
                            <p v-if="item.order_no">订单号:{{ item.order_no }}</p>
                            <!--<p v-if=" item.pay_type != '0'">支付方式:{{ item.pay_type | payTypeFilter }}</p>-->
                        </div>
                        <div class="item-goods" @click="toDetail(item)">
                            <div>
                                <div class="flex goodsItem" v-for="(goods,i ) in item.order_goods" :key="i">
                                    <img :src="$utils.mediaUrl(goods.thumb)" alt="">
                                    <div class="goods">
                                        <p class="name">{{ goods.title }}</p>
                                        <span class="type">{{ goods.option_title || '默认' }}</span>
                                        <div class="flex">
                                            <span class="price">¥{{ goods.price }}</span>
                                        </div>

                                    </div>
                                </div>
                            </div>
                            <div class="status">
                                <span
                                    v-if="item.status == -1"
                                    class=""
                                >售后失败</span
                                >
                                <span
                                    v-if="item.status >= 0 && item.status <= 9"
                                    class="blue"

                                >申请售后中</span
                                >
                                <span
                                    v-if="item.status == 10 || item.status == 11"
                                    class="success"
                                >售后完成</span
                                >
                            </div>
                        </div>
                        <div class="item-button">
                            <div class="price flex" v-if="item.order_goods">
                                共{{ item.order_goods.length }}件商品，总金额
                                <p>￥{{ item.price }}</p>
                            </div>
                            <div class="button flex">
                                <!-- 操作按钮 -->
                                <div class="card-btn flex">
                                    <Button v-if="item.status >= 0 && item.status <= 9"
                                            @click.stop="orderCancelRefund(item)">
                                        取消售后
                                    </Button>
                                </div>

                            </div>
                        </div>
                    </li>
                </ul>
                <!--                加载更多-->
                <!--                <Icon v-if="getData_loading" type="ios-loading" size=18 class="demo-spin-icon-load"></Icon>-->
                <div class="order-page">
                    <Page :total="Number(total)" @on-change="changePage" :page-size="20"/>
                </div>
            </div>
            <div v-else>
                <EmptyPage></EmptyPage>
            </div>
        </div>
        <Modal v-model="showCancel" width="360" class-name="cancelBox">
            <div style="text-align:center;height: 60px;line-height: 60px">
                <p>确认取消订单吗？</p>
            </div>
            <div slot="footer">
                <Button type="error" size="large" long :loading="modal_loading" @click="del">取消订单</Button>
            </div>
        </Modal>
        <Modal v-model="showDelete" width="360" class-name="cancelBox">
            <div style="text-align:center;height: 60px;line-height: 60px">
                <p>确认删除订单吗？</p>
            </div>
            <div slot="footer">
                <Button type="error" size="large" long :loading="modal_loading" @click="del">删除订单</Button>
            </div>
        </Modal>
        <Modal v-model="showTake" width="360" class-name="cancelBox">
            <div style="text-align:center;height: 60px;line-height: 60px">
                <p>确认收到所有商品了吗？</p>
            </div>
            <div slot="footer">
                <Button size="large" type="info" long :loading="modal_loading" @click="confirmGoods">确认收货</Button>
            </div>
        </Modal>
        <Modal v-model="showRefunCacel" width="360" class-name="cancelBox">
            <div style="text-align:center;height: 60px;line-height: 60px">
                <p>您将取消申请售后，确定继续吗？</p>
            </div>
            <div slot="footer">
                <Button size="large" type="info" long :loading="modal_loading" @click="refundCancel">取消售后</Button>
            </div>
        </Modal>
    </div>
</template>

<script>
import orderApi from '@/api/order'

export default {
    name: "order",
    data() {
        return {

            showCancel: false,
            showRefunCacel: false,

            showDelete: false,
            modal_loading: false,
            getData_loading: false,
            showTake: false,
            is_comment: 0,
            apiStatus: {
                all: 'allOrderList',
                pay: 'payOrderList',
                send: 'sendOrderList',
                pick: 'pickOrderList',
                finish: 'finishOrderList',
                refund: 'refundOrderList'
            },
            activeIndex: 0,
            navList: [
                {
                    name: '全部订单',
                    num: '',
                    type: 'all'
                }, {
                    name: '待付款',
                    num: '',
                    type: 'pay'
                }, {
                    name: '待发货',
                    num: '',
                    type: 'send'
                }, {
                    name: '待收货',
                    num: '',
                    type: 'pick'
                },
                {
                    name: '已完成',
                    num: '',
                    type: 'finish'
                }, {
                    name: '售后',
                    num: '',
                    type: 'refund'
                },
                // {
                //     name: '待评论',
                //     num: '3',
                //     type: '1'
                // },
            ],
            orderList: [],
            pageNumber: 1,
            total: '',
            btnData: {},//点击button时的数据
        }
    },
    created() {
        if (this.$route.params.status) {
            this.activeIndex = this.$route.params.status
        }
        this.getOrderList()
        this.getOrderStatus()
    },

    methods: {
        handleReachBottom() {
            return new Promise(resolve => {
                setTimeout(() => {
                    const last = this.list1[this.list1.length - 1];
                    for (let i = 1; i < 11; i++) {
                        this.list1.push(last + i);
                    }
                    resolve();
                }, 2000);
            });
        },
        btnClick(type, item) {
            this.btnData = item
            switch (type) {
                // 去支付
                case 'payOrder':
                    this.$router.push({path: '/order/payment', query: {order_id: item.id}})
                    break;
                // 查看物流
                case 'express':
                    this.$router.push({
                        path: '/order/package',
                        query: {
                            package_id: this.btnData.orderGoods[0].package_id,
                            order_id: this.btnData.orderGoods[0].order_id
                        }
                    })
                    break;
                // 确认收货
                case 'sendOrder':
                    this.showTake = true
                    break;
                // 评价
                case 'comment'://整单评价现在没做
                    console.log(this.btnData)
                        this.$router.push({path: '/order/commentList', query: {order_id: this.btnData.id}})
                    // if (this.btnData.orderGoods.length > 1) {//评价列表
                    //     this.$router.push({path: '/order/commentList', query: {order_id: this.btnData.id}})
                    // } else {//评价页
                    //     this.$router.push({path: '/order/comment', query: {id: this.btnData.orderGoods[0].order_id}})
                    // }
                    break;

                // case 'comment':
                //     if(this.orderDetail.goods_info.length >1){//评价列表
                //         this.$router.push({path:'/order/commentList',query:{order_id:this.$route.query.order_id}})
                //     }else{//评价页
                //         this.$router.push({path:'/order/comment',query:{id:this.orderDetail.goods_info[0].order_goods_id}})
                //     }
                //     break;

            }
        },
        confirmGoods() {
            this.modal_loading = true;
            orderApi.orderFinish({id: this.btnData.id}, {
                hideSuccessTip: true,
                success: (res) => {
                    this.showTake = false;
                    this.modal_loading = false
                    if (res.error != 0) return
                    this.$Message.success('确认收货成功');
                    this.pageNumber = 1
                    this.getOrderList()
                    this.getOrderStatus()
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
        refundCancel() {
            this.modal_loading = true;
            orderApi.refundCancel({
                order_id: this.btnData.order_id,
                is_edit: 1
            }, {
                hideSuccessTip: true,
                success: (res) => {
                    this.showRefunCacel = false;
                    this.modal_loading = false
                    if (res.error != 0) return
                    this.$Message.success('取消成功');
                    this.pageNumber = 1
                    this.getOrderList()
                    this.getOrderStatus()
                },
                fail: () => {
                    this.showRefunCacel = false;
                    this.modal_loading = false
                }
            })
            setTimeout(() => {
                this.modal_loading = false
            }, 3000)
        },
        del() {
            this.modal_loading = true;
            console.log(this.showCancel)
            if (this.showCancel) {
                orderApi.orderCancel({
                    id: this.btnData.id
                }, {
                    hideSuccessTip: true,
                    success: (res) => {
                        this.showCancel = false;
                        this.modal_loading = false
                        if (res.error != 0) return
                        this.$Message.success('取消成功');
                        this.pageNumber = 1
                        this.getOrderList()
                        this.getOrderStatus()
                    },
                    fail: () => {
                        this.showCancel = false;
                        this.modal_loading = false
                    }
                })

            }
            if (this.showDelete) {
                orderApi.orderDelete({
                    id: this.btnData.id
                }, {
                    hideSuccessTip: true,
                    success: (res) => {
                        this.modal_loading = false
                        this.showDelete = false
                        if (res.error != 0) return
                        this.$Message.success('删除成功');
                        this.pageNumber = 1
                        this.getOrderList()
                        this.getOrderStatus()
                    },
                    fail: () => {
                        this.modal_loading = false
                        this.showDelete = false
                    }
                })
            }
            setTimeout(() => {
                this.modal_loading = false
            }, 3000)
        },
        orderDelete(item) {
            this.btnData = item
            this.showDelete = true
        },
        orderCancel(item) {
            this.btnData = item
            this.showCancel = true
        },
        orderCancelRefund(item) {
            this.btnData = item
            this.showRefunCacel = true
        },
        showFooterBtn(item) {
            let showStaus = ['-1', '0', '10', '11', '20', '30'];
            return (item.refund_finish && item.refund_finish == '1') || showStaus.includes(item.status)
        },
        isLoadGroups(item) {
            return (item.activity_type == '3' && item.groups_team_info?.success == '0') || (item.activity_type == '4' && item.groups_rebate_team_info?.success == '0')
        },
        getOrderStatus() {
            orderApi.orderGetTotal({
                hideSuccessTip: true,
                success: (res) => {
                    if (res.error != 0) return
                    this.navList.forEach(item => {
                        // if(item.type === 'all')item.num = res.wait_pay
                        if (item.type === 'pay') item.num = res.wait_pay
                        if (item.type === 'send') item.num = res.wait_send
                        if (item.type === 'pick') item.num = res.wait_receive
                        // if(item.type === 'finish')item.num = res.wait_receive
                        if (item.type === 'refund') item.num = res.refund
                    })
                }
            })
        },
        changePage(val) {
            document.documentElement.scrollTop = 0
            this.pageNumber = val
            this.getOrderList()
        },
        getOrderList() {
            if (this.getData_loading) return
            this.getData_loading = true
            let api = this.apiStatus[this.navList[this.activeIndex].type]
            orderApi[api]({
                page: this.pageNumber
            }, {
                hideSuccessTip: true,
                success: (res) => {
                    this.getData_loading = false
                    if (res.error != 0) return

                    this.orderList = res.list
                    // if (this.pageNumber > 1) this.orderList = this.orderList.concat(res.list)
                    this.total = res.total
                    this.is_comment = res?.comment_setting?.order_comment || '';
                }
            })
            setTimeout(() => {
                this.getData_loading = false
            }, 3000)
        },
        toDetail(item) {
            console.log(item, 'item')
            if (this.activeIndex != 5) {//订单详情页
                this.$router.push({path: '/order/orderDetail', query: {order_id: item.id}})
            } else {//售后详情页
                this.$router.push({path: '/order/refundDetail', query: {order_id: item.order_id}})

            }
        },
        selectNav(nav, index) {
            if (index == this.activeIndex) return
            this.activeIndex = index
            this.pageNumber = 1
            this.getOrderList()
        },
        handleScroll() {
            //获取滚动时的高度
            let scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
            let boxHeight = document.documentElement.offsetHeight
            let height = document.documentElement.scrollHeight
            let H = height - boxHeight
            if ((scrollTop + 500) > H && !this.modal_loading && (this.orderList.length < this.total)) {
                console.log('请求数据')
                setTimeout(() => {
                    this.getOrderList()
                }, 500)
            }

        },
    },
    filters: {
        payTypeFilter(type) {
            if (type && type !== 0) {
                let val
                switch (type) {
                    case '1':
                        val = '后台确认'
                        break;
                    case '2':
                        val = '余额支付'
                        break;
                    case '3':
                        val = '货到付款'
                        break;
                    case '20':
                        val = '微信支付'
                        break;
                    case '30':
                        val = '支付宝支付'
                        break;
                    default:
                        val = '待付款'
                        break;
                }
                return val
            }
            return '待付款'
        },
    },
    mounted() {
        // window.addEventListener("scroll", this.handleScroll);
    },
    destroyed() {
        // document.removeEventListener('scroll', this.handleScroll)
    },
}
</script>

<style scoped lang="scss">
.demo-spin-icon-load {
    position: relative;
    width: 30px;
    left: 50%;
    bottom: 0px;
    animation: ani-demo-spin 1s linear infinite;
}

/deep/ .cancelBox {
    .ivu-modal {
        top: 350px;
    }
}

.order-box {
    position: relative;
    min-height: 650px;
    background-color: #ffffff;

}

.member-order {
    padding: 20px;
    min-height: 650px;
}

.order-nav {
    height: 41px;
    border-bottom: 1px solid #E9EDEF;
    font-size: 16px;
    line-height: 16px;

    li {
        position: relative;
        cursor: pointer;
        margin-right: 40px;
        display: flex;
        align-items: flex-start;

        &:hover {
            color: $theme-color;
        }

        &.active {
            color: $theme-color;

            &:after {
                content: '';
                width: 100%;
                height: 2px;
                background-color: $theme-BgColor;
                position: absolute;
                left: 0;
                bottom: 0;
            }
        }
    }
}

.order-list {
    background: #FFFFFF;
    overflow: hidden;

    .item {
        border: 1px solid #E9EDEF;
        margin-top: 20px;

        .item-top {
            height: 50px;
            background: #F4F6F8;
            border-radius: 1px 1px 0px 0px;
            align-items: center;
            padding: 0 20px;
            font-size: 14px;
            line-height: 20px;
            color: #636669;

            p {
                margin-left: 10px;
            }
        }

        .item-goods {
            cursor: pointer;
            border-bottom: 1px solid #E9EDEF;
            display: flex;
            align-items: flex-start;
            padding: 20px 20px 0;
            justify-content: space-between;

            .goodsItem {
                margin-bottom: 20px;
            }

            img {
                width: 100px;
                height: 100px;
                margin-right: 20px;
            }

            .goods {
                width: 700px;

                .name {
                    color: #262B30;
                    font-size: 16px;
                    line-height: 22px;
                    margin-bottom: 10px;
                }

                .type {
                    font-size: 14px;
                    line-height: 20px;

                    display: flex;
                    align-items: center;
                    color: #939799;
                    margin-bottom: 10px;

                }

                .price {
                    font-size: 14px;
                    line-height: 20px;

                    display: flex;
                    align-items: center;
                    color: $theme-color;
                    font-weight: 600;
                }

                .total {
                    margin-left: 50px;
                    color: #999;
                    font-size: 14px;
                }
            }

            .status {
                font-weight: 600;
                font-size: 20px;
                line-height: 26px;

                color: $theme-color;

                .primary {
                    color: #ff3c29;
                }

                .orange {
                    color: #FF9900;
                }

                .blue {
                    color: #367BF5;
                }

                .success {
                    color: #09C15F;
                }

            }
        }

        .item-button {
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            align-items: flex-end;
            padding: 20px;

            .price {
                font-weight: 600;
                font-size: 14px;
                line-height: 20px;
                display: flex;
                align-items: center;
                color: #262B30;

                p {
                    color: $theme-color;
                }
            }

            button {
                margin-top: 20px;
                margin-left: 20px;
            }
        }
    }

}

.order-page {
    padding: 20px 0 20px;
    text-align: right;
}
</style>