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
            <div class="status-name">订单状态：{{ statusText.title }}</div>
            <div class="status-bd" v-if="orderStatus > -1">
                <ul class="flex">
                    <li v-for="(item,index) in orderStatusList" :key="index"
                        :class="[orderStatus === index ? 'now' :'']">
                        <div class="line"
                             :class="[orderStatus > index ? 'active' : '',index+1 == orderStatusList.length ? 'small' :'']">
                            <!--  已完成-->
                            <i v-if="orderStatus >= index" style="font-size: 22px"
                               class="iconfont  icon-yiwancheng1"></i>
                            <!-- 未完成-->
                            <i v-else class="iconfont step">{{ index + 1 }}</i>
                            <!--                            <div v-else class="iconfont icon-fukuan">-->
                            <div v-if="orderStatus === index" class="arrow">
                                <i class="iconfont active">{{ index + 1 }}</i>
                                <div v-if="orderStatus< index" class="arrow-icon"></div>
                            </div>
                            <!--                            </div>-->
                        </div>
                        <div class="info">
                            <div>{{ item.name }}</div>
                            <div class="time">{{ item.time || '' }}</div>
                        </div>
                    </li>

                </ul>
            </div>
        </div>
        <div class="goods-info">
            <div class="common-title">商品信息</div>
            <ul class="goods">
                <li class="flex" v-for="(item,index) in goods_info" :key="index">
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
        </div>
        <div class="order-info">
            <div class="common-title">售后信息</div>
            <div class="order-bd">
                <ul>
                    <li class="flex">
                        <div>售后订单编号：</div>
                        <div>{{ refund_info.refund_no }}</div>
                    </li>
                    <li class="flex">
                        <div>申请退款日期：</div>
                        <div>{{ refund_info.create_time }}</div>
                    </li>
                    <li class="flex">
                        <div>退款说明：</div>
                        <div>{{ refund_info.content }}</div>
                    </li>
                    <li class="flex">
                        <div>处理方式：</div>
                        <div>{{ refund_info.refund_type_text }}</div>
                    </li> <!---->
                    <li class="flex">
                        <div>退款金额：</div>
                        <div class="money">￥{{ refund_info.price }}</div>
                    </li>

                </ul>
            </div>
        </div>
        <div class="button-box">
            <Button v-if="canCancel" @click.stop="btnClick">取消售后
            </Button>
        </div>
        <refundCancel ref="model" @confirm="confirm"></refundCancel>
    </Container>
</template>

<script>
import orderApi from '@/api/order'
import refundCancel from '@/components/order/refundCancel'

export default {
    name: "regundDetial",
    components: {refundCancel},
    data() {
        return {
            orderDetail: {},
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
                name: '售后详情',
            }],
            orderStatusList: [{
                icon: 'icon-daifukuan',
                name: '客户申请维权',
                steps: 0,
                time: '2022-01-02'
            }, {
                icon: 'icon-daifahuo',
                name: '处理维权',
                steps: 1,
                time: '2022-01-02'
            }, {
                icon: 'icon-daishouhuo',
                name: '退款完成',
                steps: 2
            }],
            orderStatus: 0,
            goods_info: [],
            refund_info: {}
        }
    },
    created() {
        this.getData()

    },
    methods: {
        btnClick() {
            this.$refs.model.show(this.$route.query.order_id)
        },
        confirm() {
            setTimeout(() => {
                this.back()
            })
        },
        getData() {
            orderApi.refundDetail({order_id: this.$route.query.order_id, is_edit: 1}, {
                hideSuccessTip: true,
                success: (res) => {
                    if (res.error != 0) return
                    this.goods_info = res.goods_info
                    this.refund_info = res.refund
                    this.setOrderStatus()
                }
            })
        },
        setOrderStatus() {
            let key = Number(this.refund_info.status)
            switch (key) {
                case 0:
                case 1:
                    this.orderStatus = 1
                    break;
                case 10:
                case 11:
                    this.orderStatus = 2
                    break;
                default:
                    this.orderStatus = -1

            }
        },
        back() {
            this.$router.back()
        },
    },
    computed: {
        canCancel() {
            return this.refund_info.status >= 0 && this.refund_info.status < 10
        },
        statusText() {
            let textObj = {
                title: '',
                label: '',
            }
            if (this.refund_info.status === -1) {
                textObj = {
                    title: '商家已拒绝',
                    label: '',
                }
            }
            if (this.refund_info.status === 0) {
                textObj = {
                    title: '发起申请',
                    label: '等待商家处理',
                }
            }

            if (this.refund_info.status === 1) {
                textObj = {
                    title: '商家通过审核',
                    label: '',
                }
            }
            if (this.refund_info.status == 10) {
                textObj = {
                    title: '退款成功',
                    label: '商家已同意退款，款项已原路返回',
                }
            }
            if (this.refund_info.status == 11) {
                textObj = {
                    title: '退款成功',
                    label: '商家已同意退款',
                }
            }
            return textObj
        },
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
                width: 460px;
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
                    top: -13px;
                    z-index: 10;
                    background-color: #FFFFFF;
                    font-size: 18px;

                    &.step {
                        width: 26px;
                        height: 26px;
                        text-align: center;
                        line-height: 26px;
                        font-size: 16px;
                        border: 1px solid #c7c7c7;
                        border-radius: 50%;
                        top: -12px;

                    }

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
    justify-content: flex-end;

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