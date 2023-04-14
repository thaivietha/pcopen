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

        <Container ref="categories">

            <!-- swiper-->
            <TopBanner :homeBanner="homeBanner" :categoryList="categoryList"></TopBanner>

            <template>
                <Seckill v-if="seckillActivityInfo" :seckillActivityInfo="seckillActivityInfo"
                         style="padding-top: 40px"></Seckill>
            </template>
            <!--goods-->
            <template v-for="(goodsGroups ,index) in pcGoodsGroups">
                <GoodsBox :goodsGroups="goodsGroups" :key="index"></GoodsBox>
            </template>
        </Container>

</template>
<script>
import account from "../../util/account";
import TopBanner from './components/TopBanner'
import GoodsBox from '@/components/goods/GoodsBox'
import Seckill from '@/components/seckill/Seckill'
import indexApi from "../../api/main"

export default {
    components: {TopBanner, Seckill, GoodsBox},
    data() {
        return {
            count: {
                app_total: '-',
                site_total: '-',
                user_total: '-',
            },
            indexData: [],
            homeBanner: [],//轮播
            pcGoodsGroups: [],//商品组
            seckillActivityInfo: null,//秒杀活动
            categoryList: [],//分类列表
        }
    },
    created() {
        this.getIndexApi()
    },
    methods: {
        getIndexApi() {
            indexApi.getCount({
                hideSuccessTip: true,
                success: (res) => {
                    if (res.error !== 0) return
                    this.indexData = res.data
                    this.homeBanner = res.data.homeAdvertise || []//轮播
                    this.pcGoodsGroups = res.data.pcGoodsGroups || []//商品组
                    this.seckillActivityInfo = res.data.seckillActivityInfo || null //秒杀活动

                }
            })
            indexApi.getCategory({
                hideSuccessTip: true,
                success: (res) => {
                    if (res.error !== 0) return
                    this.categoryList = res.list

                }
            })
        }
    },
    computed: {
        account() {
            return account.getSession() || {};
        }
    },
    mounted() {
        history.pushState(null, null, document.URL);
    }
};
</script>
