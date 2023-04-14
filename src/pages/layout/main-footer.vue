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
    <Footer class="footer">
        <div class="footer_main">
            <div class="footer_serveList">
                <div @click="toNav(item.url)" class="footer_serveItem" v-for="(item,index) in commonData.bottomMenus"
                     :key="index">
                    <img :src="$utils.mediaUrl(item.img)" alt="">
                   <span> {{ item.name }}</span>
                </div>
            </div>
            <div class="footer_copyright">
                <div class="footer_info">
                    <!--自定义导航1-->
                    <a @click="toNav(commonData.copyRight.navigation_1_url)"
                       v-if="commonData.copyRight.navigation_1">{{ commonData.copyRight.navigation_1 }}</a>
                    <!-- 自定义导航2-->
                    <a @click="toNav(commonData.copyRight.navigation_2_url)"
                       v-if="commonData.copyRight.navigation_2">{{ commonData.copyRight.navigation_2 }}</a>
                </div>
                <div class="copyright" ref="copyright" v-if="commonData.copyRight.copyright_status=='1'"
                     v-html="commonData.copyRight.copyright_info"></div>

            </div>
        </div>
    </Footer>
</template>

<script>
import {mapState} from 'vuex'

export default {
    name: "main-footer",
    data() {
        return {
        }
    },
    mounted() {
    },
    methods: {
        toNav(url) {
            if (url) {
                this.$router.push(url)
            }
        }
    },
    computed: {
        ...mapState('common', {
            commonData: state => state.commonData,
        }),
    }
}
</script>

<style scoped lang="scss">
.footer {
    &_ {
        &main {
            width: 1200px;
            margin: 0 auto;
        }

        &serveList {
            display: flex;
            align-items: center;
            justify-content: center;
            border-bottom: 1px solid #C9CDD4;
            height: 96px;
        }

        &serveItem {
            display: flex;
            align-items: center;
            width: 235px;
            justify-content: center;
            color: #4E5969;
            font-size: 14px;
            position: relative;

            &:after {
                content: '';
                height: 20px;
                width: 1px;
                background-color: #C9CDD4;
                position: absolute;
                right: 0;
            }

            &:last-child {
                &:after {
                    content: '';
                    display: none;
                }
            }

            img {
                margin-right: 14px;
                width: 36px;
                height: 36px;
            }
        }

        &copyright {
            text-align: center;
            padding-top: 30px;
            color: #AAB3BD;
        }

        &info {
            margin-bottom: 10px;

            a {
                color: #AAB3BD;
                font-size: 14px;
                margin: 0 15px;
            }
        }

    }
}
.footer_serveItem{
    span{
        cursor: pointer;
        &:hover{
        color: $theme-color;
    }
    }
}

</style>