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
        <Breadcrumbs :list="getBreadcrumbs"></Breadcrumbs>
        <div class="categories-box">
            <div class="categories-top" @mouseleave="showVisibleList = false">
                <ul class="fixedList">
                    <li @click="changeNav(item,index)" v-for="(item,index) in categoryList"
                        :class="[search.menuId === item.id ? 'active' : '']" :key="index">{{ item.name }}
                    </li>
                </ul>
                <div class="more" @mouseenter="showVisibleList = true">
                    <i style="font-size: 18px;color: #81878E" class="iconfont icon-fenlei3"></i>
                    <span>更多分类</span>
                </div>
                <div class="visibleList" v-if="showVisibleList" @mouseenter="showVisibleList = true"
                     @mouseleave="showVisibleList = false">
                    <ul class="fixedList" style="flex-wrap: wrap;width: 1200px;">
                        <li @click="changeNav(item,index)" v-for="(item,index) in categoryList"
                            :class="[search.menuId === item.id ? 'active' : '']" :key="index">{{ item.name }}
                        </li>
                    </ul>
                </div>

            </div>
            <div class="categories-item">
                <p class="type">分类:</p>
                <ul>
                    <li @click="changeNavItem('',)" :class="[search.childrenId == '' ? 'active' : '']" class="noselect">
                        全部
                    </li>
                    <li @click="changeNavItem(item.id)" v-for="(item,index) in getChildrenList" class="noselect"
                        :class="[search.childrenId == item.id ? 'active' : '']"
                        :key="index">{{ item.name }}
                    </li>
                </ul>
            </div>
            <div class="categories-item">
                <p class="type">排序:</p>
                <ul>
                    <li class="noselect" @click="changeTypeItem('默认')"
                        :class="[activatedName === '默认' ? 'active' : '']">默认
                    </li>
                    <li class="noselect" @click="changeTypeItem('价格')"
                        :class="[activatedName === '价格' ? 'active' : '']">
                        价格
                        <i v-show="priceStatus === 0" class="price-icon price-icon--default"></i>
                        <i v-show="priceStatus === 1" class="price-icon price-icon--up"></i>
                        <i v-show="priceStatus === 2" class="price-icon price-icon--down"></i>
                    </li>
                    <li class="noselect" @click="changeTypeItem('销量')"
                        :class="[activatedName === '销量' ? 'active' : '']">销量
                        <i v-show="timeStatus === 0" class="price-icon price-icon--default"></i>
                        <i v-show="timeStatus === 1" class="price-icon price-icon--up"></i>
                        <i v-show="timeStatus === 2" class="price-icon price-icon--down"></i>
                    </li>
                </ul>
            </div>
        </div>
        <div ref="boxs-container" style="padding-top: 20px;padding-bottom: 40px">
            <GoodsList :goodsList="goodsList"></GoodsList>
        </div>
    </Container>
</template>

<script>
import GoodsList from '@/components/goods/GoodsList'
import indexApi from '@/api/main'
import commonApi from '@/api/common'

export default {
    name: "categories",
    components: {GoodsList},
    data() {
        return {
            showVisibleList: false,
            categoryList: [],//分类列表
            goodsList: [],//商品列表
            searchIndex: 0,
            searchIitemIndex: -1,
            activatedName: '默认',
            priceStatus: 0,//0 正常 1正序 2 逆序
            timeStatus: 0,//0 正常 1正序 2 逆序
            pageNumber: 1,
            search: {
                menuId: '',//一级菜单id
                childrenId: '',//二级菜单id
                category_id: '',
                sort: '', //价格 销量
                by: '',//正序 逆序
                ifGetData: false,//
                total: '',//
                searchTitle: '',
                title: ''
            }
        }
    },
    created() {
        this.search.menuId = this.$route.query.menuId || ''
        this.search.childrenId = this.$route.query.children || ''
        this.search.title = this.$route.query.search || ''
        if(this.search.childrenId === "") {
            this.search.category_id = this.search.menuId
        }else {
            this.search.category_id = this.search.childrenId
        }
        this.getCategoryList()
        this.getGoodsList()

    },

    methods: {
        getCategoryList() {
            indexApi.getCategory({
                hideSuccessTip: true,
                success: (res) => {
                    if (res.error !== 0) return
                    this.categoryList = res.list

                }
            })
        },
        changeNav(item) {//一级菜单点击
            this.search.menuId = item.id
            this.search.category_id = item.id
            this.search.childrenId = ''
            this.pageNumber = 1
            this.getGoodsList(item.id)
        },
        changeNavItem(id) {//二级菜单点击
            if (id == this.childrenId) return
            console.log(id, 888)
            this.search.childrenId = id
            if(id === "") {
                this.search.category_id = this.search.menuId
            }else {
                this.search.category_id = id
            }
            this.search.pageNumber = 1
            this.getGoodsList(id)
        },
        changeTypeItem(name) {
            this.activatedName = name
            switch (name) {
                case '默认':
                    this.priceStatus = 0
                    this.timeStatus = 0
                    this.search.sort = ''
                    this.search.by = ''
                    break;
                case '价格':
                    this.timeStatus = 0
                    this.search.sort = 'price'
                    this.priceStatus + 1 >= 3 ? this.priceStatus = 1 : this.priceStatus++
                    if(  this.priceStatus % 2 ===0){
                        this.search.by = 'asc'
                    }else{
                        this.search.by = 'desc'
                        break;
                    }
                    break;
                case '销量':
                    this.priceStatus = 0
                    this.search.sort = 'sales'
                    this.timeStatus + 1 >= 3 ? this.timeStatus = 1 : this.timeStatus++
                    if(  this.timeStatus % 2 ===0){
                        this.search.by = 'asc'
                    }else{
                        this.search.by = 'desc'
                        break;
                    }
                    break;
            }
            this.pageNumber = 1
            this.getGoodsList()

        },
        getGoodsList(id) {
            commonApi.getGoodsList({
                title: this.search.title,
                // parent_category_id: this.search.menuId,
                // category_id: this.search.childrenId,
                category_id: this.search.category_id,
                sort: this.search.sort,
                by: this.search.by,//排序方式 asc desc
                page: this.pageNumber,
                get_activity: 1
            }, {
                hideSuccessTip: true,
                success: (res) => {
                    this.ifGetData = false
                    this.total = res.total
                    if (this.pageNumber == 1) this.goodsList = res.list
                    if (this.pageNumber > 1) this.goodsList = this.goodsList.concat(res.list)
                }
            })
        },
        handleScroll() {
//获取滚动时的高度
            if (!this.$refs['boxs-container']) return
            console.log(this.$refs['boxs-container'].offsetHeight)
            let top = this.$refs['boxs-container'].offsetTop
            let scrolltop = document.documentElement.scrollTop

            if (top - scrolltop < 200 && !this.ifGetData) {//底部触发距离
                if (this.goodsList.length < this.total && !this.ifGetData) {
                    this.ifGetData = true
                    setTimeout(() => {
                        this.pageNumber++
                        this.getGoodsList()
                    }, 200)

                }
            }
        },
    },
    mounted() {
        window.addEventListener("scroll", this.handleScroll);
    },
    watch: {
        $route(to) {
            console.log(to)
            if ((to.query.search == '' || to.query.search) && to.query.search != this.search.title) {
                this.search.title = to.query.search || ''
                this.getGoodsList()
            }
        }
    },
    destroyed() {
        document.removeEventListener('scroll', this.handleScroll)
    },
    computed: {
        getChildrenList() {
            let list = []
            if (this.search.menuId != '') {
                this.categoryList.forEach(item => {
                    if (item.id == this.search.menuId) {
                        list = item.children
                    }
                })
            }
            return list
        },
        crumbsName() {
            if (this.$route.query.keyword) {
                return this.$route.query.keyword
            } else {
                return '全部分类'
            }
        },
        getBreadcrumbs() {
            return [{
                name: '首页',
                path: '/'
            }, {
                name: this.crumbsName,
                path: '/categories/list'
            }]
        },

    },
}
</script>

<style scoped lang="scss">
.categories-box {
    min-height: 176px;
    background-color: #ffffff;
    padding: 0 20px;

    .categories-top {
        height: 62px;
        border-bottom: 1px solid #E9EDEF;
        position: relative;

        .fixedList {
            width: 1050px;
            overflow: hidden;
            display: flex;
            align-items: center;
            line-height: 62px;

            li {
                flex-shrink: 0;
                position: relative;
                margin-right: 40px;
                font-size: 16px;
                cursor: pointer;

                &:hover {
                    color: $theme-color;
                }

                &.active {
                    color: $theme-color;

                    &:after {
                        content: '';
                        width: 100%;
                        position: absolute;
                        left: 0;
                        bottom: 1px;
                        height: 2px;
                        background-color: $theme-color;
                    }

                }
            }
        }

        .visibleList {
            background-color: #FFFFFF;
            box-shadow: 5px 5px 20px #ccc;
            width: 1200px;
            position: absolute;
            left: -20px;
            padding: 20px;
            z-index: 100;
        }

        .more {
            display: flex;
            align-items: center;
            position: absolute;
            right: 0;
            top: 20px;
            cursor: pointer;
            color: #81878E;

            &:hover {
                color: $theme-color;

            }

            span {
                margin-left: 8px;
                font-size: 16px;
            }

            i {
                font-size: 16px;
            }

            &:before {
                content: '';
                height: 24px;
                width: 1px;
                position: absolute;
                left: -22px;
                background-color: #E9EDEF;
            }
        }
    }

    .categories-item {
        min-height: 57px;
        line-height: 57px;
        font-size: 16px;
        display: flex;
        align-items: center;

        .type {
            display: block;
            color: #81878E;
            width: 48px;
            white-space: nowrap;
        }

        ul {
            display: flex;
            width: 100%;
            align-items: center;
            font-size: 16px;
            flex-wrap: wrap;
            li {
                flex-shrink: 0;
                margin-left: 30px;
                cursor: pointer;
                display: flex;
                align-items: center;

                &:hover {
                    color: $theme-color;
                }

                &.active {
                    color: $theme-color;
                }

                .price-icon {
                    margin-left: 4px;
                    display: inline-block;
                    width: 11px;
                    height: 14px;
                    background-repeat: no-repeat;
                    background-size: 100% 100%;

                    &-- {
                        &default {
                            background-image: url("../../../static/images/categories/Frame1571.png");
                        }

                        &up {
                            background-image: url("../../../static/images/categories/FA1D3895E45A.png");
                            transform: rotate(180deg);
                        }

                        &down {
                            background-image: url("../../../static/images/categories/FA1D3895E45A.png");

                        }
                    }
                }
            }
        }
    }
}

</style>