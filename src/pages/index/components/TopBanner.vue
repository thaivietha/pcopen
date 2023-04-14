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
    <div class="top-banner clearfix">
        <div class="site-category"
             @mouseleave="evtSideLeave">
            <!-- 一级菜单 -->
            <div class="top-side-left">
                <ul class="side-left">
                    <li class="side-item"
                        @mouseenter="evtSideEnter(item.children,item.id)"
                        v-for="(item,index) in categoryList" :key="index">
                        {{ item.name }}
                        <Icon class="side-icon" type="ios-arrow-forward"/>
                    </li>
                </ul>
            </div>
            <!-- 二级菜单-->
            <div class="site-category-detail"
                 v-show="goodsStatus">
                <ul class="category-items" v-for="(children,index) in filterCurrGoods" :key="index">
                    <li class="category-goods" v-for="(item,i) in children" :key="i">
                        <div class="goods-link" @click="toCategory(item)">
                            <img :src="$utils.mediaUrl(item.thumb)" alt=""/>
                            <div class="text-name">
                                {{ item.name }}
                            </div>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
        <!--banner-->

        <Swiper :banners="homeBanner"></Swiper>
    </div>
</template>

<script>
import Swiper from './Swiper.vue'

export default {
    props: {
        homeBanner: {
            type: Array,
            default: () => []
        },
        categoryList: {
            type: Array,
            default: () => []
        }
    },
    data() {
        return {
            currGoods: [],
            goodsStatus: false,
            level1MenuId:'',//一级菜单id
        }
    },

    computed: {
        filterCurrGoods: function () {
            let filterGoods = [[], [], [], [], []]
            this.currGoods.forEach(function (item, index) {
                let goodsIndex = Math.floor(index / 6)
                filterGoods[goodsIndex].push(item)
            })
            return filterGoods
        }
    },
    methods: {
        toCategory(item) {//此方法 router.push 有个bug 不能在history里增加记录 暂时先手动添加
            history.pushState({menuId:this.level1MenuId, children: item.id}, "index", "index")
            this.$router.push({path: '/categories/list', query: {menuId:this.level1MenuId, children: item.id}})
        },
        evtSideEnter(children, level1Id) {
            this.level1MenuId = level1Id
            this.currGoods = children
            this.goodsStatus = true
        },
        evtSideLeave() {
            this.goodsStatus = false
        }
    },
    components: {
        Swiper
    }
}
</script>

<style scoped lang="scss">
.top-banner {
    position: relative;
    width: 1226px;
    height: auto;
    margin: 0 auto 40px;
}

.site-category {
    position: absolute;
    left: 0;
    top: 0;
    width: 309px;
    height: 450px;
    padding: 25px 0;
    background: rgba(48, 48, 48, 0.4);
    z-index: 10;
}

.side-left {
    margin: 0;
    width: 100%;
    height: 400px;
    overflow: hidden;
    list-style: none;

    .side-item {
        padding: 0 30px;
        width: 100%;
        height: 50px;
        line-height: 50px;
        font-size: 16px;
        color: #fff;
        text-align: left;
        cursor: pointer;
        position: relative;
        display: flex;
        align-items: center;
        justify-content: space-between;

        &:hover {
            background: $theme-BgColor;
        }

        .side-icon {
            right: 30px;
            position: absolute;
            font-size: 18px;
        }
    }
}

.site-category-detail {
    position: absolute;
    display: flex;
    flex-flow: row nowrap;
    justify-content: flex-start;
    left: 309px;
    top: 0;
    z-index: 10;
    border: 1px solid #e0e0e0;
    box-shadow: 3px 8px 16px rgba(0, 0, 0, 0.18);

    .category-items {
        width: auto;
        height: 450px;
        margin: 0;
        padding: 0;
        list-style: none;
        background: #fff;
    }

    .category-goods {
        display: flex;
        flex-flow: row nowrap;
        justify-content: flex-start;
        align-items: center;
        width: 223px;
        height: 73.5px;
        padding: 0 20px 0 20px;
        box-sizing: border-box;
        background: #fff;
        cursor: pointer;

        .goods-link {
            display: flex;
            flex-flow: row nowrap;
            justify-content: flex-start;
            align-items: center;
            width: 170px;

            &:hover {
                color: $theme-color;
            }

            img {
                width: 50px;
                height: 50px;
            }
        }

        .text-name {
            padding-left: 10px;
            font-size: 14px;
        }
    }
}
</style>
