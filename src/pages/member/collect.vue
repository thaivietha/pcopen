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
    <div class="collect-box">
        <div v-if="collectList.length > 0">
            <div class="collect-title">
                我的收藏
            </div>
            <ul class="collect-list">
                <li v-for="(item,index) in collectList " :key="index">
                    <div class="item-top">
                        <div class="img-box">
                            <img :src="$utils.mediaUrl(item.goods.thumb)" alt="">
                        </div>
                        <div class="item-name">{{ item.goods.title || '' }}</div>
                    </div>
                    <div class="item-button">
                        <Button @click="cancelCollect(item)">取消收藏</Button>
                        <Button @click="toDetail(item)">查看商品</Button>
                    </div>
                </li>
            </ul>
            <div class="collect-page">
                <Page :total="Number(total)" @on-change="changePage" :page-size="20"/>
            </div>
        </div>
        <div v-else>
            <EmptyPage msg="暂无收藏～"></EmptyPage>
        </div>
    </div>
</template>

<script>
import userApi from '@/api/user'
import goodsApi from '@/api/goods'

export default {
    name: "collect",
    data() {
        return {
            collectList: [],
            pageNumber: 1,
            total: ''
        }
    },
    created() {
        this.getFavorite()
    },
    methods: {
        toDetail(item) {
            this.$router.push({path: '/goods/detail', query: {id: item.goods.id}})
        },
        changePage(val) {
            document.documentElement.scrollTop = 0
            this.pageNumber = val
            this.getFavorite()
        },
        getFavorite() {
            userApi.getFavorite({
                page: this.pageNumber
            }, {
                hideSuccessTip: true,
                success: (res) => {
                    if (res.error != 0) return
                    this.collectList = res.list
                    this.total = res.total
                }
            })
        },
        cancelCollect(item) {
            goodsApi.favorite({
                goods_id: item.goods_id,
                is_add: 0//是否添加1 是0否
            }, {
                hideSuccessTip: true,
                success: (res) => {
                    if (res.error !== 0) return
                    this.getFavorite()
                    this.$Message.success('取消收藏成功')

                }
            })
        }
    }
}
</script>

<style scoped lang="scss">
.collect-box {
    padding: 0 20px 20px;
    min-height: 650px;
    background: #FFFFFF;
    position: relative;
}

.collect-title {
    height: 60px;
    line-height: 60px;
    font-size: 18px;
    border-bottom: 1px solid #ececec;
}

.collect-list {
    .item-top {
        padding-top: 30px;
        display: flex;
        padding-bottom: 30px;
        border-bottom: 1px dashed #e1e1e1;
        align-items: center;

        .img-box {
            width: 120px;
            min-height: 120px;
            margin-right: 25px;

            img {
                width: 120px;
                height: auto;
            }

        }
    }

    .item-button {
        text-align: right;
        padding: 30px 5px;
        border-bottom: 1px solid #e1e1e1;

        button {
            margin: 0 10px;
        }
    }

}

.collect-page {
    padding: 20px 0 20px;
    text-align: right;

    /deep/ .ivu-page-item-active {
        border-color: $theme-color;

        a {
            color: $theme-color;
        }
    }

    /deep/ .ivu-page-item:hover {
        border-color: $theme-color;

        a {
            color: $theme-color;
        }
    }

    /deep/ .ivu-page-next:hover, .ivu-page-prev:hover {
        border-color: $theme-color;

        a {
            color: $theme-color;
        }
    }
}
</style>