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
            <div class="boxs-content">
                <ul class="box-list">
<!--                    <li class="box-item box-item-promo">-->
<!--                        &lt;!&ndash;主推图&ndash;&gt;-->
<!--                        <a :href="goods[0].sourceUrl" target="_blank">-->
<!--                            <img :src="goods[0].imgUrl" alt=""/>-->
<!--                        </a>-->
<!--                    </li>-->
                    <!--正常商品-->
                    <template v-if="goodsList.length >0">
                    <li class="box-item" v-for="(item,index) in goodsList" @click="toDetail(item)" :key="index">
                        <a>
                            <img :src="$utils.mediaUrl(item.thumb)" alt=""/>
                        </a>
                        <div class="goodsInfo">
                            <p class="item-price">
                                ¥{{ item |getSeckillPrice | formatMoney }}
                                <span v-if="item.oldPrice" class="item-old-price"> ¥{{ item.oldPrice }}</span>
                            </p>
                            <h3 class="item-title">{{ item.title }}</h3>
                        </div>

                    </li>
                    </template>
                    <template v-else>
                        <EmptyPage></EmptyPage>
                    </template>
                </ul>
            </div>

</template>

<script>
export default {
    props:{
      goodsList:{
          type:Array,
          default:()=>{
              return []
          }
      }
    },
    data() {
        return {
        }
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
    methods:{
        toDetail(item) {
            this.$router.push('/goods/detail?id=' + item.id)
        },
    }
}
</script>

<style scoped lang="scss">
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
        &:nth-child(1) {
            margin-left: 0px;
        }
        &:nth-child(5n) {
            margin-left: 13px;
        }
        &:nth-child(5n + 1) {
            margin-left: 0px;
        }
        //
        //&:nth-child(5) {
        //    margin-left: 0px;
        //}

        &:hover {
            transform: translateY(-1px);
            box-shadow: 5px 5px 20px #ccc;
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
