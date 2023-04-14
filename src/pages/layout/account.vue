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
    <div class="layout">
        <Layout>
            <Header class="header">
                <Container>
                    <div class="header-info flex">
                        <div class="flex" @click="toHome">
                            <div class="icon">
                                <img style="width: 200px;height:100px;display: block" :src="$utils.mediaUrl(commonData.logo)">
                            </div>
                            <div class="name">官方商城</div>
                        </div>
                    </div>
                </Container>
            </Header>
            <div class="content">
                <router-view></router-view>
            </div>
            <Footer class="footer">
                <Container>
                    <div class="footer_copyright">
                        <div class="footer_info">
                            <!--自定义导航1-->
                            <a :href="commonData.copyRight.navigation_1_url" v-if="commonData.copyRight.navigation_1">{{commonData.copyRight.navigation_1}}</a>
                            <!-- 自定义导航2-->
                            <a :href="commonData.copyRight.navigation_2_url" v-if="commonData.copyRight.navigation_2">{{commonData.copyRight.navigation_2}}</a>
                        </div>
                        <div class="footer_sites" v-if="commonData.copyRight.copyright_status=='1'"
                             v-html="commonData.copyRight.copyright_info"></div>
                    </div>
                </Container>
            </Footer>
        </Layout>
    </div>
</template>

<script>
// import commonApi from '@/api/common'
import {
    mapState
} from 'vuex'
export default {
    name: "account",
    methods:{
        toHome(){
            this.$router.push('/index')
        }
    },
    computed: {
        ...mapState('common', {
            commonData: state => state.commonData,
        }),
    },
    // mounted() {
    //     commonApi.getBasicInfo({
    //         hideSuccessTip: true,
    //         success: (res) => {
    //             if (res.error !== 0) return
    //             res.data.topMenus.forEach(item => {//url前面加 '/'
    //                 if (item.url.indexOf('/') != 0) {
    //                     item.url = '/' + item.url
    //                 }
    //             })
    //             this.$store.commit('common/setCommonData', res.data)
    //         }
    //     })
    // },
}
</script>

<style scoped lang="scss">
.layout {
    background-color: #f9f9f9;

    .header {
        background-color: #f9f9f9;
        .header-info{
            align-items: center;
            height: 144px;
            justify-content: space-between;
            .flex{
                cursor: pointer;

                align-items: center;
                .name{
                    font-size: 28px;
                    margin-left: 15px;
                    font-weight: bold;
                }
            }
        }
    }

    .footer {
        background-color: #f9f9f9;

        &_ {
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
    .content{
        min-height: calc(100vh - 351px);
    }

}
</style>
