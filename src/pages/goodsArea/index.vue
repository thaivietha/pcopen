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
        <!-- 面包屑-->
        <Breadcrumbs :list="breadcrumbsList"></Breadcrumbs>
        <!--商品-->
        <!--        <GoodsBox :show-title="false" :minisize="false" :goodsGroups="goodsInfo"></GoodsBox>-->
        <ul class="box-list" ref="boxs-container">
            <li class="box-item box-item-promo">
                <!--主推图-->
                <a :href="goodsInfo.main_img_url">
                    <img :src="$utils.mediaUrl(goodsInfo.main_img)" alt=""/>
                </a>
            </li>
            <!--正常商品-->
            <template v-for="(item,index) in goodsList">
                <li class="box-item" :key="index">
                    <a @click="toDetail(item)">
                        <!--                            <a :href="'/goods/detail?id=' + item.id || ''">-->
                        <img :src="$utils.mediaUrl(item.thumb)" alt=""/>
                    </a>
                    <div class="goodsInfo">
                        <p class="item-price">
                            ¥{{ item.price }}
                            <span v-if="item.oldPrice" class="item-old-price"> ¥{{ item.oldPrice }}</span>
                        </p>
                        <h3 class="item-title">{{ item.title }}</h3>
                    </div>

                </li>
            </template>

        </ul>
    </Container>
</template>

<script>
import goodsApi from '@/api/goods'
import commonApi from '@/api/common'

export default {

    data() {
        return {
            ifGetData: false,
            temp: null,
            breadcrumbsList: [{
                name: '首页',
                path: '/'
            }, {
                name: '商品组',
                path: '/goodsArea/index'
            }],
            pageNum: 1,//当前页
            total: '',
            goodsIds: [],//请求id
            goodsInfo: {},
            goodsList: [],

        }
    },
    created() {
        this.getGoodsIds(this.$route.query.id)
    },
    methods: {
        toDetail(item) {
            this.$router.push('/goods/detail?id=' + item.id)
        },
        getGoodsIds(id) {
            goodsApi.getGroupGoods({
                goods_group_id: id,
                pageNum: this.pageNum,
                pageSize: 10
            }, {
                hideSuccessTip: true,
                success: (res) => {
                    this.ifGetData = false
                    if (res.error !== 0) return
                    this.goodsIds = res.data.goodsGroup.goods_ids || []
                    this.goodsInfo = res.data.goodsGroup
                    this.getGoodsList()
                    this.total = res.data.count
                    this.UpdateBasic(`${this.goodsInfo.name || ''} - ${this.channelTitle}`)

                }
            })
        },
        getGoodsList() {
            if (this.goodsIds.length <= 0) return
            commonApi.getGoodsList({
                id: this.goodsIds.join(',')
            }, {
                hideSuccessTip: true,
                success: (res) => {
                    this.goodsList = this.goodsList.concat(res.list)
                }
            })
        },
        handleScroll() {
//获取滚动时的高度
            if (!this.$refs['boxs-container']) return
            let top = this.$refs['boxs-container'].offsetTop - this.$refs['boxs-container'].clientHeight
            let scrolltop = document.documentElement.scrollTop
            if (top - scrolltop < 300 && !this.ifGetData) {//底部触发距离
                if (this.goodsList.length < this.total) {
                    this.ifGetData = true
                    setTimeout(() => {
                        this.pageNum++
                        this.getGoodsIds(this.$route.query.id)
                    }, 200)

                }
            }
        },
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

.boxs-container {
    width: 100%;
    height: auto;

}

.boxs {
    position: relative;
    width: 1200px;
    height: auto;
    padding-bottom: 26px;
    margin: 0 auto;
}

.top-kv {
    padding-bottom: 40px;
}

.boxs-top {
    width: 100%;
    padding-bottom: 20px;

    > .flex {
        width: 100%;
        justify-content: space-between;
        height: 28px;
        align-items: flex-end;
    }

    .top-title {
        font-weight: 600;
        font-size: 20px;
        line-height: 28px;
        //color: #212121;
    }

    .top-more {
        display: flex;
        align-items: center;
        color: #81878E;
        font-size: 16px;
        cursor: pointer;

        &:hover {
            color: $theme-color;
        }

        i {
            margin-left: 6px;
            font-size: 18px;

        }

    }

}

.boxs-content {
    display: flex;
    align-items: center;
}

.box-list {
    display: flex;
    flex-flow: row wrap;
    justify-content: flex-start;
    width: 100%;
    height: 100%;

    .box-item {
        position: relative;
        margin: 0 0 14px 14px;
        width: 229px;
        overflow: hidden;
        height: 400px;
        background: #fff;
        transition: all 0.3s;

        &:nth-child(4n) {
            margin-left: 13px;
        }

        &:nth-child(5) {
            margin-left: 0px;
        }

        &:nth-child(10n) {
            margin-left: 0px;
        }

        &:nth-child(10n + 5) {
            margin-left: 0px;
        }

        &:hover {
            transform: translateY(-1px);
            box-shadow: 5px 5px 20px #ccc;
        }

        &.box-item-promo { //主推图尺寸
            margin-left: 0px;
            width: 472px;
            height: 400px;

            img {
                display: block;
                width: 472px;
                height: 400px;
                margin: 0 auto;
            }
        }

        img {
            display: block;
            width: 229px;
            height: 280px;
            margin: 0 auto;
        }

        .goodsInfo {
            height: 120px;
            padding: 20px 10px 0;

            .item-title {
                font-size: 16px;
                line-height: 22px;
                text-align: left;
                font-weight: normal;
                overflow: hidden;
                text-overflow: ellipsis;
                display: -webkit-box;
                -webkit-box-orient: vertical;
                -webkit-line-clamp: 2;
            }

            .item-price {
                margin-bottom: 8px;
                color: $price-color;
                font-size: 20px;
                line-height: 28px;
                font-weight: 600;
            }

            .item-old-price {
                font-weight: normal;
                margin-left: 10px;
                color: #AAB3BD;
                font-size: 14px;
                line-height: 20px;
                text-decoration: line-through;
            }
        }

    }

}

</style>
