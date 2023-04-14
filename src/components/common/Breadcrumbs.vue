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
    <div class="breadcrumbs">
        <template v-for="(nav,i) in getList">
            <div :key="i">
                <router-link v-if="(i+1) < getList.length" :to="nav.path">{{ nav.name }}</router-link>
                <span v-else>{{ nav.name }}</span>
                <!--            <a :href="nav.path" :key="i">{{ nav.name }}</a>-->
                <i v-if="(i+1) < getList.length">></i>
            </div>
        </template>
    </div>
</template>

<script>
export default {
    name: "Breadcrumbs",
    props: {
        list: {
            type: Array,
            default: () => []
        }
    },
    computed: {
        getList() {
            if (this.list.length > 0) {
                return this.list
            }
            let route = this.$route
            let arr = [{
                name: '首页',
                path: '/'
            }]
            arr.push({
                name: route.name,
                path: route.path
            })
            console.log(arr)
            return arr
        }
    },

}
</script>

<style scoped lang="scss">
.breadcrumbs {
    display: flex;
    align-items: center;
    height: 62px;
    font-size: 16px;

    a {
        color: #999999;
    }

    span {

    }

    i {
        margin: 0 4px;
        color: #999999;

    }
}
</style>