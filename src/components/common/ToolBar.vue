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
    <div class="common-toolbar">
        <ul>
            <template v-for="(item,index)  in toolList">
                <li v-if="(item.name == '联系客服' && commonData.serviceInfo.status == '1') || item.name != '联系客服' " @mouseleave="mouseleave(item)" :key="index"
                    @mouseenter="mouseenter(item)">
                    <div v-if="item.path">
                        <router-link :to="item.path">
                            <i :class="[item.icon]"></i>
                            <span>{{ item.name }}</span>
                        </router-link>
                    </div>
                    <div v-else>
                        <i :class="[item.icon]"></i>
                        <span>{{ item.name }}</span>
                    </div>

                </li>
            </template>
            <li @click="backTop" v-show="showBack" style="margin-top: 10px">
                <i :class="[topInfo.icon]"></i>
                <span> {{ topInfo.name }} </span>
            </li>

        </ul>
        <!--        联系客服-->
        <div class="service-code" v-if="showServiceCode &&  commonData.serviceInfo.status =='1' ">
        <!--<div class="service-code" >-->
            <p class="line" v-if="commonData.serviceInfo.name">{{ commonData.serviceInfo.name || '' }}</p>
            <!--            客服姓名-->
            <span class="line"
                  v-if="commonData.serviceInfo.service_name_show == '1' && commonData.serviceInfo.service_name">{{ commonData.serviceInfo.service_name || '' }}</span>
            <!--            QQ客服-->
            <div class="qq" v-if="commonData.serviceInfo.qq_show == '1' && commonData.serviceInfo.qq_number ">
                <i class="bg"></i>
               <div>
                   <span class="line" style="display: block">{{ commonData.serviceInfo.qq_title || '' }} </span>
                   <span class="line">{{ commonData.serviceInfo.qq_number || '' }} </span>
               </div>
            </div>
            <!--            微信客服-->
            <div class="wechat" v-if="commonData.serviceInfo.wechat_show == '1'">
                <div class="flex" v-if="commonData.serviceInfo.wechat_title">
                    <i class="bg"></i>
                    <p class="line">{{ commonData.serviceInfo.wechat_title }}</p>
                </div>
                <img v-if="commonData.serviceInfo.wechat_qrcode"
                    :src="$utils.mediaUrl(commonData.serviceInfo.wechat_qrcode)"
                    alt="">
            </div>
            <!--            服务热线-->
            <div class="service" v-if="commonData.serviceInfo.service_phone_show == '1' ">
                <p class="line" v-if="commonData.serviceInfo.service_phone_title"> {{ commonData.serviceInfo.service_phone_title }}</p>
                <span class="line" v-if=" commonData.serviceInfo.service_phone_number">{{ commonData.serviceInfo.service_phone_number }}</span>
            </div>
        </div>
        <!--        手机购买-->
        <div class="h5-code" v-if="showH5code">
            <img ref="qrcode"
                 :src="h5ImgUrl"
                 alt="">
            <div class="msg">
                <span>扫码进入手机商城</span>
                <!--                <span>这是提示2</span>-->
            </div>
        </div>
    </div>
</template>

<script>
import {mapState} from 'vuex'
import Qrious from 'qrious';

export default {
    name: "ToolBar",
    data() {
        return {
            toolList: [
                {name: '手机购买', icon: 'iconfont icon-shouji', type: 1},
                {name: '个人中心', icon: 'iconfont icon-gerenziliao1', type: 2, path: '/member'},
                {name: '联系客服', icon: 'iconfont icon-yingyong-kefufuwu', type: 3,},
                {name: '购物车', icon: 'iconfont icon-xingouwuche1', type: 4, path: '/shoppingCart/index'}
            ],
            topInfo: {name: '回到顶部', icon: 'iconfont icon-huojian', type: 5},
            showBack: false,
            showH5code: false,
            showServiceCode: false,
            h5ImgUrl: ''
        }
    },
    computed: {
        ...mapState('common', {
            commonData: state => state.commonData,
        }),
    },
    methods: {
        createdCode() {
            // 生成二维码
            const element = this.$refs.qrcode;
            let qr = new Qrious({
                element,
                value: `${location.origin}/h5`,
                background: '#fff',
                backgroundAlpha: 0.8,
                foregroundAlpha: 0.8,
                level: 'H',
                size: '100',
            });
            this.h5ImgUrl = qr.toDataURL()
        },
        mouseleave(item) {
            switch (item.type) {
                case 1 :
                    this.showH5code = false
                    break;
                case 3 :
                    this.showServiceCode = false
                    break;

            }
        },
        mouseenter(item) {
            switch (item.type) {
                case 1 :
                    this.createdCode()
                    this.showH5code = true
                    break;
                case 3 :
                    this.showServiceCode = true
                    break;

            }
        },
        handleScroll() {
//获取滚动时的高度
            let scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
            if (scrollTop < 1000 && this.showBack) {
                this.showBack = false
            }
            if (scrollTop >= 1000 && !this.showBack) {
                this.showBack = true
            }
        },
        backTop() {
            window.pageYOffset = 0
            document.body.scrollTop = 0
            document.documentElement.scrollTop = 0
        }
    },
    mounted() {
        window.addEventListener("scroll", this.handleScroll);
    },
    destroyed() {
        document.removeEventListener('scroll', this.handleScroll)
    },
}
</script>

<style scoped lang="scss">
.common-toolbar {
    position: fixed;
    width: 70px;
    right: 0;
    bottom: 160px;
    z-index: 100;
    box-shadow: 0px 0px 20px rgba(176, 176, 176, 0.25);

    ul {
        li {
            display: block;
            width: 70px;
            height: 76px;
            background-color: #FFFFFF;
            text-align: center;
            cursor: pointer;
            position: relative;
            padding-top: 10px;


            &:after {
                position: absolute;
                left: 50%;
                transform: translateX(-50%);
                bottom: 0;
                content: '';
                width: 26px;
                height: 1px;
                display: block;
                margin: 0 auto;
                background-color: #E9EDEF;
            }

            &:hover {
                span {
                    color: $theme-color;
                }

                i {
                    color: $theme-color;
                }

            }

            &:nth-child(4):after {
                display: none;
            }

            &:nth-child(5):after {
                display: none;
            }

            i {
                color: #81878E;
                font-size: 36px;
                display: block;
                height: 25px;
                line-height: 25px;
                margin-bottom: 12px;

            }

            span {
                font-size: 12px;
                line-height: 16px;
                color: #81878E;

            }

        }
    }

    .h5-code {
        box-shadow: 0px 0px 20px rgba(176, 176, 176, 0.25);
        width: 150px;
        position: absolute;
        background-color: #FFFFFF;
        left: -160px;
        top: 0;
        text-align: center;
        padding: 20px 10px 0px;
        font-size: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;

        img {
            width: 110px;
            height: 110px;

        }

        .msg {
            padding-top: 10px;
            color: #81878E;

            span {
                display: block;
                padding-bottom: 14px;
            }
        }
    }

    .service-code {
        box-shadow: 0px 0px 20px rgba(176, 176, 176, 0.25);
        width: 150px;
        position: absolute;
        background-color: #FFFFFF;
        left: -160px;
        top: 0;
        text-align: center;
        padding: 0 10px 20px;
        font-size: 12px;

        > p {
            line-height: 60px;
            height: 60px;
            border-bottom: 1px solid #E9EDEF;
            color: #1D2129;
        }

        > span {
            color: #81878E;
            display: block;
            line-height: 60px;
            height: 60px;
            border-bottom: 1px solid #E9EDEF;
        }

        .qq {
            height: 70px;
            border-bottom: 1px solid #E9EDEF;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #81878E;
            span{
                line-height: 25px;
            }
            .bg {
                margin-right: 8px;
                display: block;
                width: 22px;
                height: 22px;
                background-image: url("../../../static/images/toolBar/QQ.png");
                background-size: 100% 100%;
                background-repeat: no-repeat;
            }
        }

        .wechat {
            border-bottom: 1px solid #E9EDEF;

            .flex {
                align-items: center;
                justify-content: center;
                color: #81878E;
                height: 52px;
            }

            .bg {
                margin-right: 8px;
                width: 22px;
                height: 22px;
                background-image: url("../../../static/images/toolBar/wechat.png");
                background-size: 100% 100%;
                background-repeat: no-repeat;
            }

            img {
                width: 110px;
                height: 110px;
                margin-bottom: 20px;
                margin-left: 10px;
            }
        }

        .service {
            padding-top: 22px;
            color: #81878E;

            p {
                margin-bottom: 14px;
            }
        }
    }
}
</style>