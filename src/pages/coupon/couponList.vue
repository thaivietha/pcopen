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
        <Breadcrumbs></Breadcrumbs>
        <div style="padding:0 0 20px 0;background: #FFFFFF">
            <div v-if="couponList.length > 0" style="min-height: 650px;background-color: #FFFFFF">
                <ul class="coupon-list" v-if="couponList.length > 0">
                    <template v-for="(item,index) in couponList">
                        <!--                可领取-->
                        <li class="coupon-item" v-if="activeIndex === 0"
                            :style="{'background-image':`url(${backgroundImage1})`}"
                            :key="index">
                            <i class="c-type" v-if="item.coupon_sale_type == '1'">满减券</i>
                            <i class="c-type" v-else>折扣券</i>
                            <span class="c-time">{{ item.time_content }}</span>
                            <div class="item-left flex">
                                <p class="c-price" v-if="item.coupon_sale_type == '1'">{{
                                        Number(item.discount_price)
                                    }}</p>
                                <p class="c-discount" v-else>{{ Number(item.discount_price) }}折</p>
                                <div>
                                    <p class="c-name">{{ item.title }}</p>
                                    <span class="c-oldPrice"> 满{{ Number(item.enough) }}可用</span>
                                </div>
                            </div>
                            <div class="item-right" @click="getCoupon(item)">
                                <p class="status-1">立即领取</p>
                            </div>
                        </li>
                    </template>
                </ul>
            </div>
            <div v-else>
                <EmptyPage></EmptyPage>
            </div>
        </div>
        <div class="bottom-page">
            <Page :total="Number(total)" @on-change="changePage" :page-size="20"/>
        </div>
    </Container>
</template>

<script>
import userApi from '@/api/user'

export default {
    name: "couponList",
    data() {
        return {
            couponList: [],
            activeIndex: 0,
            pageNumber: 1,
            backgroundImage1: require('/static/images/member/Frame1679.png'),//可领取
            backgroundImage2: require('/static/images/member/Frame1680.png'),//不可领取
            total: '',
        }
    },
    created() {
        this.getCouponList()
    },
    methods: {
        changePage(val) {
            document.documentElement.scrollTop = 0
            this.pageNumber = val
            this.getCouponList()
        },
        getCoupon(item) {
            userApi.getCoupon({id: item.id}, {
                hideSuccessTip: true,
                hideErrorTip: true,
                success: (res) => {
                    if (res.error !== 0) return
                    this.$Message.success('领取成功');
                    this.pageNumber = 1
                    this.getCouponList()
                },
                fail: (err) => {
                    if (err.error == '243216') {
                        this.$Message.warning('优惠券需付费领取，请到手机端购买')
                        return
                    } else {
                        this.$Message.warning(err.message)
                    }
                }
            })
        },
        getCouponList() {
            userApi.getCouponList({
                page: this.pageNumber,
                pagesize: 20,
            }, {
                hideSuccessTip: true,
                success: (res) => {
                    if (res.error != 0) return
                    this.couponList = res.list
                    this.total = res.total
                }
            })
        },
        selectNav(nav, index) {
            if (index == this.activeIndex) return
            this.activeIndex = index
            this.getCouponList()

        },
    }
}
</script>

<style scoped lang="scss">

.coupon-list {
    display: flex;
    align-items: flex-start;
    flex-wrap: wrap;
    background: #ffffff;
    padding: 30px 0;

    .coupon-item {
        position: relative;
        box-shadow: 0px 0px 20px rgba(129, 129, 129, 0.25);
        background-repeat: no-repeat;
        background-size: 275px 124px;
        /* Inside auto layout */
        width: 275px;
        height: 124px;
        flex: none;
        order: 2;
        flex-grow: 0;
        margin-bottom: 20px;
        margin-left: 20px;
        display: flex;
        align-items: center;
        justify-content: space-between;

        .c-type {
            position: absolute;
            min-width: 57px;
            padding: 0 8px;
            height: 22px;
            line-height: 22px;
            text-align: center;
            font-size: 14px;
            color: $theme-color;
            left: 14px;
            top: 0px;
            background: #FFE9EA;
        }

        .c-time {
            display: block;
            color: #86909C;
            position: absolute;
            left: 14px;
            font-size: 12px;
            bottom: 10px;
        }

        .item-left {
            font-weight: 600;
            height: 100%;
            align-items: center;
            padding-left: 14px;

            .c-price {
                font-size: 28px;
                color: $theme-color;
                padding-right: 14px;

                &:before {
                    content: '¥';
                    font-size: 14px;
                    position: relative;
                    top: -1px;
                    display: inline-block;
                    width: 14px;
                    text-align: center;

                }
            }

            .c-discount {
                font-size: 28px;
                color: $theme-color;
                padding-right: 14px;
            }

            .c-name {
                font-weight: 500;
                font-size: 16px;
            }

            .c-oldPrice {
                font-weight: 500;
                font-size: 14px;
                line-height: 20px;
                color: #86909C;
            }
        }

        .item-right {
            padding-right: 12px;
            font-size: 16px;
            font-weight: 500;
            display: flex;
            justify-content: center;
            align-items: center;
            writing-mode: vertical-lr;
            letter-spacing: 8px;
            cursor: pointer;
            padding: 10px 14px 10px 10px;
            height: 100%;

            p {
                margin-top: 6px;
                color: #FAFDFF;
            }
        }

    }
}

.bottom-page {
    background-color: #FFFFFF;
    padding: 20px;
    display: flex;
    justify-content: flex-end;
}
</style>