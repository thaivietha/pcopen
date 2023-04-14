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
            <MainHeader></MainHeader>
            <Container>
                <Breadcrumbs :list="BreadcrumbsList"></Breadcrumbs>
                <Layout class="member-container">
                    <Sider class="member-sider" :style="{background: '#fff'}">
                        <ul>
                            <li v-for="(el,index) in siderList"
                                @click="selectType(el)"
                                :key="index">
                                <router-link :class="[activeType == index + 1 ? 'active' : '']" :to="el.path">
                                    {{ el.name }}
                                </router-link>
                            </li>
                        </ul>
                    </Sider>
                    <Content>
                        <div class="member-content">
                            <router-view></router-view>
                        </div>
                    </Content>
                </Layout>
            </Container>

            <MainFooter></MainFooter>
        </Layout>
    </div>
</template>
<script>
import MainHeader from './main-header';
import MainFooter from './main-footer';
import {mapState} from 'vuex'

export default {
    components: {MainHeader, MainFooter},
    data() {
        return {
            siderList: [
                {
                    name: '账户管理',
                    type: '1',
                    path: '/member',
                }, {
                    name: '我的订单',
                    type: '2',
                    path: '/member/order',
                }, {
                    name: '我的优惠券',
                    type: '3',
                    path: '/member/coupon',
                }, {
                    name: '我的收藏',
                    type: '4',
                    path: '/member/collect',
                }, {
                    name: '地址管理',
                    type: '5',
                    path: '/member/address',
                }
            ],
            activeType: '1',
            BreadcrumbsList: [],
        }
    },
    computed: {
        ...mapState('common', {
            commonData: state => state.commonData,
        }),
    },
    methods: {
        selectType(item) {
            this.activeType = item.type
        },

    },
    watch: {
        '$route.path': {
            immediate: true,
            handler() {
                this.BreadcrumbsList = [{
                    name: '首页',
                    path: '/'
                }, {
                    name: '个人中心',
                    path: '/member'
                }]
                this.BreadcrumbsList.push({
                    name: this.$route.name,
                    path: this.$route.path
                })
                this.siderList.forEach(item => {
                    if (item.path === this.$route.path) {
                        this.activeType = item.type
                    }
                })
                // this.breadcrumb = this.getBreadcrumb(this.$route.path)
                // this.currentPage = this.breadcrumb[this.breadcrumb.length - 1]
                // if (this.breadcrumb[0]) {
                //     this.activeName = this.breadcrumb[0]._pageId;
                // }
            }
        }
    }
};
</script>
<style scoped lang="scss">
/deep/ .member-container {
    min-height: calc(100vh - 413px);
    padding-bottom: 60px;
}

/deep/ .member-sider {
    width: 160px !important;
    flex: none !important;
    min-width: 160px !important;

    ul {
        padding-top: 30px;
    }

    li {
        text-align: center;
        cursor: pointer;
        margin-bottom: 30px;
        font-size: 16px;
        line-height: 22px;

        .active {
            color: $theme-color;

        }
    }
}

/deep/ .member-content {
    padding-left: 10px;
}
</style>