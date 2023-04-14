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
            <ToolBar :commonData="commonData"></ToolBar>
            <MainHeader :commonData="commonData"></MainHeader>
            <Layout class="container">
                <Layout class="content">
                    <MainCrumb :commonData="commonData"></MainCrumb>
                    <router-view></router-view>
                </Layout>
            </Layout>
            <MainFooter :commonData="commonData"></MainFooter>
        </Layout>
    </div>
</template>
<script>
import MainHeader from './main-header';
import MainCrumb from './main-crumb';
import MainFooter from './main-footer';
// import commonApi from "../../api/common"

import {
    mapState
} from 'vuex'

export default {
    components: {MainCrumb, MainHeader, MainFooter},
    data() {
        return {}
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
};
</script>
