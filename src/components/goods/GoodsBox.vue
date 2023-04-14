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
    <div class="boxs-container" ref="boxs-container">
        <div class="top-kv boxs-kv" v-if="goodsGroups.top_advertise_img">
            <GoodsKv :src="goodsGroups.top_advertise_img" :href="goodsGroups.top_advertise_img_url"></GoodsKv>
        </div>
        <div class="boxs">
            <div class="boxs-top" v-if="showTitle">
                <div class="flex">
                    <h3 class="top-title">{{ goodsGroups.name }}</h3>
                    <a v-if="goodsList.length > 8" class="top-more" @click="toGroupGoods">
                        <span class="top-sub" > 查看更多 </span>
                        <Icon type="ios-arrow-forward"/>
                    </a>
                </div>
            </div>
            <div class="boxs-content">
                <ul class="box-list">
                    <li class="box-item box-item-promo">
                        <!--主推图-->
                        <a :href="goodsGroups.main_img_url">
                            <img :src="$utils.mediaUrl(goodsGroups.main_img)" alt=""/>
                        </a>
                    </li>
                    <!--正常商品-->
                    <template v-for="(item,index) in goodsList">
                        <li v-if="(minisize && index <= 7) || !minisize " class="box-item" :key="index">
                            <a @click="toDetail(item)">
                                <!--                            <a :href="'/goods/detail?id=' + item.id || ''">-->
                                <img :src="$utils.mediaUrl(item.thumb)" alt=""/>
                            </a>
                            <div class="goodsInfo">
                                <p class="item-price">
                                    ¥{{ item | getSeckillPrice | formatMoney }}
                                    <span v-if="item.oldPrice" class="item-old-price"> ¥{{ item.oldPrice }}</span>
                                </p>
                                <h3 class="item-title">{{ item.title }}</h3>
                            </div>

                        </li>
                    </template>

                </ul>
            </div>
        </div>
        <div class="bottom-kv boxs-kv" v-if="goodsGroups.bottom_advertise_img">
            <GoodsKv :src="goodsGroups.bottom_advertise_img" :href="goodsGroups.bottom_advertise_img_url"></GoodsKv>
        </div>
    </div>
</template>

<script>
import GoodsKv from '@/components/common/GoodsKv'
import commonApi from '@/api/common'

export default {
    props: {
        showTitle: {
            type: Boolean,
            default: true
        },
        goodsGroups: {
            type: Object,
            default: () => {
            }
        },
        minisize: {//默认最多显示8个
            type: Boolean,
            default: true
        }
    },
    components: {
        GoodsKv
    },
    data() {
        return {
            ifGetData: false,
            goodsList: [],
        }
    },

    methods: {
        toGroupGoods(){
            this.$router.push('/goodsArea?id=' + this.goodsGroups.id )
        },
        toDetail(item) {
            this.$router.push('/goods/detail?id=' + item.id)
        },
        getGoodsList() {
            if(this.goodsGroups.goods_ids.length > 0){
                commonApi.getGoodsList({
                    id: this.goodsGroups.goods_ids,
                    get_activity: 1
                }, {
                    hideSuccessTip: true,
                    success: (res) => {
                        if (res.error !== 0) return
                        this.goodsList = res.list


                    }
                })
            }

        },
        handleScroll() {
            // console.log(this.$refs['boxs-container'].offsetTop-this.$refs['boxs-container'].clientHeight - document.documentElement.scrollTop,'顶部')
//获取滚动时的高度
            if(!this.$refs['boxs-container']) return
            let top = this.$refs['boxs-container'].offsetTop - this.$refs['boxs-container'].clientHeight
            let scrolltop = document.documentElement.scrollTop
            if (top - scrolltop < 300 && !this.ifGetData) {//底部触发距离
                if (this.goodsGroups.goods_ids) {
                    this.ifGetData = true
                    this.getGoodsList()
                }
            }
        },
    },
    filters:{
        getSeckillPrice(item){
            if(item.activities && item.activities.seckill){
                if(item.has_option == '0') {
                    let min_price = item.activities?.seckill.activity_price || 0
                    return `${parseFloat(min_price)}`
                } else {
                    return parseFloat(item?.activities?.seckill.price_range?.min_price || 0)
                }
            }else {
                return  item.price
            }
        },
        getOldPrice(item){
            if(item.has_option=='1') {
                let max_price = item.max_price ||0
                return `${parseFloat(max_price)}`
            } else {
                return parseFloat(item?.price || 0)
            }
        },
        formatMoney(money) {
            if (typeof money === 'number' || (typeof money === 'string' && money.trim() !== '')) {
                if (money >= 10000) {
                    return parseFloat(money / 10000) + '万'
                } else {
                    return parseFloat(money)
                }
            } else {
                return 0
            }
        },
    },
    mounted() {
        let top = this.$refs['boxs-container'].offsetTop - this.$refs['boxs-container'].clientHeight
        if (top < 300 && !this.ifGetData) {//底部触发距离
            if (this.goodsGroups.goods_ids) {
                this.ifGetData = true
                this.getGoodsList()
            }
        }
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

.bottom-kv {
    margin-bottom: 40px;
}
</style>
