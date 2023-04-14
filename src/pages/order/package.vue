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
        <div class="packagePage">
            <div class="goods-info">
                <div class="common-title">商品信息</div>
                <ul class="goods">
                    <li class="flex" v-for="(item,index) in orderGoods" :key="index">
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
            <div class="common-title">物流信息</div>
            <div class="info">
                <ul>
                    <li class="flex">
                        <div>物流名称：</div>
                        <div>{{ packageInfo.express_name }}</div>
                    </li>
                    <li class="flex">
                        <div>物流单号：</div>
                        <div>{{ packageInfo.express_sn }}</div>
                    </li>
                </ul>
            </div>
            <div class="content">
                <div v-if="!packageInfo.express" class="no-list">暂无物流信息</div>
                <div v-else class="ex-content">
                    <div class="flex ex-list">
                        <div class="ex-time">
                            <div class="ex-time-date"></div>
                            <div class="ex-time-desc"></div>
                        </div>
                        <div class="flex1 ex-status-info">
                            <div class="ex-desc">[收货地址]{{packageInfo.address}}</div>
                        </div>
                        <div class="ex-circle">
                            <div class="flex align-center ex-status-icon">
                                <image :src="$utils.staticMedia('order/address.png')" class="ex-status-img" />
                            </div>
                            <div class="ex-line"></div>
                        </div>
                    </div>
                    <div class="flex ex-list"
                          :class="{ 'on': index=== 0 }"
                          v-for="(item,index) in packageInfo.expressList"
                          :key="index">
                        <div class="ex-time">
                            <div class="ex-time-date">{{item.short_date}}</div>
                            <div class="ex-time-desc">{{item.time}}</div>
                        </div>
                        <div class="flex1 ex-status-info">
                            <rich-text class="ex-desc" :nodes="item.step" @click="callPhone(item.step)"></rich-text>
                        </div>
                        <div class="ex-circle">
                            <div class="flex align-center ex-status-icon">
                                <image :src="$utils.staticMedia('order/revice_goods.png')"
                                       class="ex-status-img"
                                       v-if="index === expressList.length - 1"/>
                                <div class="ex-circle-point" :class="{'on' : index === 0 }" v-else></div>
                            </div>
                            <div class="ex-line" v-if="index !== expressList.length - 1"></div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    </Container>
</template>

<script>
import orderApi from '@/api/order'

export default {
    name: "package",
    data() {
        return {
            packageInfo: {},
            orderGoods: [],
            list: [{
                name: '首页',
                path: '/'
            }, {
                name: '我的订单',
                path: '/member/order'
            }, {
                name: '查看物流',
            }],
        }
    },

    created() {
        this.getData()
    },
    methods: {
        getData() {
            if (!this.$route.query.package_id) return
            orderApi.getExpress({
                package_id: this.$route.query.package_id,
                order_id: this.$route.query.order_id
            }, {
                hideSuccessTip: true,
                success: (res) => {
                    if (res.error != 0) return
                    this.packageInfo = res
                    this.orderGoods = res.order_goods
                }
            })
        }
    }
}
</script>

<style scoped lang="scss">
.packagePage {
    padding:0 20px 20px;
    background-color: #ffffff;

    .common-title {
        padding: 18px 22px;
        font-size: 18px;
        color: #282828;
        background-color: #FFFFFF;
        border-bottom: 1px dashed #cecece;
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
    .info{
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
                &.between{

                    justify-content: space-between;
                    .right{
                        cursor: pointer;
                        color: $theme-color;
                    }
                }
            }

        }
    }
    .no-list{
        padding-top: 20px;
        text-align: center;
    }
}


/* 物流信息样式 */
.express-container {
    box-sizing: border-box;
    margin: 16px auto;
    width: 702px;
    overflow: hidden;

    border-radius: 12px;
    background: #ffffff;

    .no-list {
        overflow: hidden;
        margin: 100px auto;
        font-size: 28px;
        line-height: 40px;
        text-align: center;
        //color: $uni-text-color;
    }

    .ex-info {
        padding: 0 24px;

        .ex-title {
            height: 96px;
            border-bottom: 1px solid #e6e7eb;

            .ex-name,
            .ex-sn {
                font-size: 28px;
                line-height: 40px;
                //color: $uni-text-color;
                word-break: break-word;
                margin-right: 10px;
            }

            .ex-name {
                margin-right: 10px;
            }
        }
    }

    .ex-content {
        padding: 30px 32px 0;
        overflow: hidden;

        .ex-list {
            position: relative;
            margin-bottom: 60px;
            //color: $uni-text-color-grey;
            &.on {
                //color: $uni-text-color;
            }

            .ex-time {
                width: 86px;
                margin-right: 80px;
                text-align: right;

                .ex-time-date {
                    font-size: 28px;
                    line-height: 40px;
                }

                .ex-time-desc {
                    font-size: 16px;
                }
            }

            .ex-desc {
                font-size: 24px;
                line-height: 34px;
            }

            .ex-circle {
                display: flex;
                flex-direction: column;
                justify-content: flex-start;
                align-items: center;

                position: absolute;
                top: 4px;
                left: 110px;
                height: calc(100% + 60px);
                width: 40px;

                .ex-status-icon {
                    width: 40px;
                    height: 40px;
                    background-color: #fff;
                    justify-content: center;

                    .ex-status-img {
                        width: 100%;
                        height: 100%;
                    }
                }

                &-point {
                    height: 16px;
                    width: 16px;
                    //background-color: $uni-border-color;
                    border-radius: 50%;

                    &.on {
                        //background-color: $uni-color-primary;
                    }
                }

                .ex-line {
                    width: 1px;
                    height: calc(100% - 40px);
                    //background-color: $uni-border-color;
                }
            }
        }
    }
}
</style>