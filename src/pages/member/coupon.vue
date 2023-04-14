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
    <div style="padding: 20px;background: #FFFFFF">
        <div>
            <ul class="coupon-nav flex">
                <li v-for="(nav,index) in navList" @click="selectNav(nav,index)"
                    :class="[index === activeIndex ? 'active' : '']" :key="index">
                    {{ nav.name }}
                    <span v-show="nav.num">({{ nav.num }})</span>
                </li>
            </ul>
        </div>
       <div v-if="couponList.length > 0" style="min-height: 650px;background-color: #FFFFFF">
           <ul class="coupon-list" >
               <template v-for="(item,index) in couponList">
                   <!--                可领取-->
                   <li class="coupon-item" v-if="activeIndex === 0"
                       :style="{'background-image':`url(${backgroundImage1})`}"
                       :key="index">
                       <i class="c-type" v-if="item.coupon_sale_type == '1'">满减券</i>
                       <i class="c-type" v-else>折扣券</i>
                       <span class="c-time">{{ item.time_content }}</span>
                       <div class="item-left flex">
                           <p class="c-price" v-if="item.coupon_sale_type == '1'">{{ Number(item.discount_price) }}</p>
                           <p class="c-discount" v-else>{{ Number(item.discount_price) }}折</p>
                           <div>
                               <p class="c-name">{{ item.title }}</p>
                               <span class="c-oldPrice"> 满{{ Number(item.enough) }}可用</span>
                           </div>
                       </div>
                       <div class="item-right" @click="toHome">
                           <p class="status-1">去使用</p>
                       </div>
                   </li>
                   <!--                不可领取-->
                   <li class="coupon-item" v-else :key="index" :style="{'background-image':`url(${backgroundImage2})`}">
                       <i class="c-type" v-if="item.coupon_sale_type == '1'">满减券</i>
                       <i class="c-type" v-else>折扣券</i>
                       <span class="c-time">{{ item.time_content }}</span>
                       <div class="item-left flex">
                           <p class="c-price" v-if="item.coupon_sale_type == '1'">{{ Number(item.discount_price) }}</p>
                           <p class="c-discount" v-else>{{ Number(item.discount_price) }}折</p>
                           <div>
                               <p class="c-name">{{ item.title }}</p>
                               <span class="c-oldPrice"> 满{{ Number(item.enough) }}可用</span>
                           </div>
                       </div>
                       <div class="item-right">
                           <p v-if="activeIndex === 1" class="status-0">已使用</p>
                           <p v-if="activeIndex === 2" class="status-0">已过期</p>
                       </div>
                   </li>
               </template>

           </ul>
       </div>
        <div v-else style="height: 650px;position: relative">
            <EmptyPage></EmptyPage>
        </div>
    </div>
</template>

<script>
import userApi from '@/api/user'

export default {
    name: "coupon",
    data() {
        return {
            couponList: [],
            navList: [
                {
                    name: '未使用',
                    status: '1'
                }, {
                    name: '已使用',
                    status: '2'
                }, {
                    name: '已过期',
                    status: '3'
                }
            ],
            activeIndex: 0,
            backgroundImage1: require('/static/images/member/Frame1679.png'),//可领取
            backgroundImage2: require('/static/images/member/Frame1680.png')//不可领取

        }
    },
    created() {
        this.getCouponList()
    },
    methods: {
        toHome(){
          this.$router.replace('/index')
        },
        getCouponList() {
            userApi.getUserCoupon({
                status: this.navList[this.activeIndex].status,
                page: 1,
                pagesize: 100,
            }, {
                hideSuccessTip: true,
                success: (res) => {
                    if (res.error != 0) return
                    this.couponList = res.list
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
.coupon-nav {
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

.coupon-list {
    display: flex;
    align-items: flex-start;
    flex-wrap: wrap;
    background: #ffffff;
    padding: 40px 20px;

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
        margin-right: 20px;
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

</style>