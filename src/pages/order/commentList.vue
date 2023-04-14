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
        <div style="background: #ffffff">
            <div class="goods-info">
                <ul class="goods">
                    <li class="flex title">
                        <div>商品信息</div>
                        <div>购买件数</div>
                        <div>实付款</div>
                        <div>操作</div>
                    </li>
                    <div class="goosItem">
                        <li class="flex" v-for="(item,index) in goods_info" :key="index">
                            <div class="flex" style="justify-content: flex-start">
                                <div class="goods-img ">
                                    <img :src="$utils.mediaUrl(item.thumb)">
                                </div>
                                <div style="text-align: left" class="goods-msg">
                                    <p class="line2">{{ item.title }}</p>
                                    <p class="info"> {{ item.option_title || '默认' }}</p>
                                </div>
                            </div>
                            <div class="goods-msg">
                                <span class="cart-num">{{ item.total }}</span>
                            </div>
                            <div>￥{{ item.price }}</div>
                            <div >
                                <span v-if="item.comment_status == '0'" @click="toComment(item)" class="comment">去评价</span>
                                <span v-else  style="color: #cccccc">已评价</span>
                            </div>
                        </li>
                    </div>
                </ul>
            </div>
        </div>
    </Container>

</template>

<script>
import orderApi from '@/api/order'

export default {
    name: "refund",
    data() {
        return {
            list: [{
                name: '首页',
                path: '/'
            }, {
                name: '我的订单',
                path: '/member/order'
            }, {
                name: '商品评价',
            }],
            goods_info: []
        }
    },
    created() {
        this.getCommentData()
    },

    methods: {
        toComment(item){
            if(this.goods_info.length == 1){//如果只有一个商品 评论完直接返回两级 跳过此页
                this.$router.push({path:'/order/comment',query:{id:item.id,back:1}})
                return
            }
            this.$router.push({path:'/order/comment',query:{id:item.id}})
        },
        getCommentData() {
            if (!this.$route.query.order_id) return
            orderApi.getCommentList({
                page: 1,
                pagesize: 999,
                order_id: this.$route.query.order_id
            }, {
                hideSuccessTip: true,
                success: (res) => {
                    if (res.error != 0) return
                    this.goods_info = res.list
                }
            })
        },
    },
    computed: {},
    mounted() {
    },
}
</script>

<style scoped lang="scss">

.common-title {
    padding: 18px 22px;
    font-size: 18px;
    color: #282828;
    background-color: #FFFFFF;
    border-bottom: 1px dashed #cecece;
}

.goods-info {
    background-color: #FFFFFF;

    ul {
        padding: 2px 22px 22px;
        font-size: 16px;
        color: #282828;
        padding-top: 20px;

        .goosItem {
            li > div {
                padding: 10px 0;
                border-left: 1px solid #ececec;
            }
        }

        li {
            border: 1px solid #ececec;

            &.title {
                line-height: 36px;
                font-size: 14px;
                font-weight: bold;
                background-color: #ececec;

                > div {
                    justify-content: center;
                }
            }

            > div {
                text-align: center;
                flex-shrink: 0;
                display: flex;
                justify-content: center;
                align-items: center;

            }

            > div:nth-child(1) {
                width: 455px;
            }

            > div:nth-child(2) {
                width: 190px;
            }

            > div:nth-child(3) {
                flex: 1;
            }

            > div:nth-child(4) {
                flex: 1;
            }

            .goods-img {
                margin-left: 20px;
                margin-right: 20px;

                img {
                    min-width: 86px;
                    height: 86px;
                    display: block;
                }
            }

            .goods-msg {
                > p {
                    font-size: 16px;
                    color: #282828;
                    margin-bottom: 10px;
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
            .comment{
                cursor: pointer;
                &:hover{
                    color: $theme-color;
                }
            }
        }
    }

    > .info {
        border-top: 1px dashed #cecece;
    }

}

</style>