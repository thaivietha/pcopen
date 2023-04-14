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
    <Header class="header">
        <div class="header_main">
            <div class="header_topNav">
                <Container>
                    <div class="header_topLeft">
                        <div class="header_welcome">
                            <template v-if="ifLogin">
                                <div class="flex header_collection" @click="collection">
                                    <i class="iconfont icon-shoucang"></i>
                                    <span> 收藏本站</span>
                                </div>
                                <!--                                {{ userInfo }}-->
                            </template>
                            <template v-else>
                                欢迎
                                <router-link to="/account/login">登录</router-link>
                                {{pcTitle || '商城'}}
                            </template>

                        </div>
                    </div>
                    <div class="header_topRight navHover">
                        <div class="header_user" v-if="ifLogin">
                            <router-link to="/member" class="navHover">{{ userInfo.nickname || '' }}</router-link>
                        </div>
                        <div class="header_user" v-if="ifLogin">
                            <a class="navHover" @click="logOut">退出登录</a>
                        </div>
                        <template v-else>
                            <div class="header_user">
                                <router-link  to="/account/login" class="navHover">请登录</router-link>
                            </div>
                            <div class="header_user">
                                <router-link to="/account/register" class="navHover">注册有礼</router-link>
                            </div>
                        </template>
                        <router-link to="/member/order" class="navHover">我的订单
                        </router-link>
                        <div class="header_cart">
                            <router-link to="/shoppingCart/index" class="navHover">
                                <i class="iconfont icon-shuju-jiagou"></i>
                                购物车({{ commonData.cart_count || '0' }})
                            </router-link>

                        </div>
                    </div>
                </Container>
            </div>
            <div class="header_btNav">
                <Container>
                    <div class="flex">
                        <div class="header_logo">
                            <router-link to="/index">
                                <img style="width: 100px;height: 50px;" alt=""
                                     :src="$utils.mediaUrl(commonData.logo)">
                            </router-link>
                        </div>
                        <div class="header_navItem">
                            <ul class="flex">
                                <li class="" v-for="(item,index) in commonData.topMenus" :key="index">
                                    <a v-if="index < 5" @click="toPages(item)">{{ item.name }}</a>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div class="header_search">
                        <Input placeholder="搜索商品" v-model="searchVal"  @on-enter="toSearch">
                            <i class="iconfont icon-sousuo" slot="prefix"></i>
                            <!--                            <Icon type="ios-contact" slot="prefix" />-->
                            <Button slot="suffix" @click="toSearch">
                                搜索
                            </Button>
                            <!--                            <Icon type="ios-search" slot="suffix" />-->
                        </Input>
                    </div>
                </Container>
            </div>
        </div>
    </Header>
</template>

<script>
// import menu from '../../util/menu';
// import store from '../../store';
// import account from '../../util/account';
// import accountApi from '../../api/account';
import {
    mapState
} from 'vuex'

export default {
    name: 'main-header',
    computed: {
        ...mapState('login', {
            userInfo: state => state.userInfo,
            login: state => state.login,
        }),
        ...mapState('common', {
            commonData: state => state.commonData,
        }),
        ifLogin() {
            return this.$store.state.login.isLogin
        },

    },
    watch: {},
    data() {
        return {
            topNavList: [],
            searchVal:''
        };
    },
    methods: {
        toPages(item) {
            location.href = item.url || ''
        },
        toSearch(){
            // searchVal
            this.$router.push({path: '/categories/list', query: {search:this.searchVal}})
        },
        logOut(){
            this.$store.commit('login/setLogin', false)
            this.$store.commit('login/setUserInfo')
            localStorage.removeItem('userSessionId')
            localStorage.removeItem('userLogin')
            this.$router.replace('/account/login')
        },
        collection() {
            let url = window.origin
            console.log(url, 'url')
            try {
                window.external.addFavorite(url, '开店星商城');
            } catch (e) {
                this.$Message.error("抱歉，您所使用的浏览器无法完成此操作。请使用快捷键Ctrl+D进行添加！");
            }
        },
    },
};
</script>

<style scoped lang="scss">
.navHover:hover {
    cursor: pointer;
    color: #ffffff;

}

.header_welcome {
    a {
        color: #b4b4b4;
    }
}

.header {
    &_ {
        &main {
            width: 100%;
            margin: 0 auto;
        }

        &topNav {

            color: #b4b4b4;
            font-size: 14px;
            background-color: $navBg-color;

            /deep/ .container {
                height: 50px;
                display: flex;
                align-items: center;
                justify-content: space-between;
            }
        }

        &welcome {
        }

        &collection {
            cursor: pointer;
            transition: color .2s ease;

            &:hover {
                color: $theme-color;
            }

            span {
                font-size: 14px;
                height: 14px;
                line-height: 14px;
                display: inline-block;
                margin-left: 3px;
            }

            i {
                font-size: 14px;
                height: 14px;
                line-height: 14px;
                display: inline-block;
            }
        }

        &topRight {
            display: flex;
            align-items: center;

            a {
                margin-right: 20px;
                color: #b4b4b4;
            }
        }

        &cart {
            width: 134px;
            height: 50px;
            background-color: #4F4F4F;
            display: flex;
            align-items: center;
            justify-content: center;

            a {
                margin: 0;
            }
        }

        &btNav {
            background-color: #ffffff;
            /deep/ .container {
                height: 94px;
                display: flex;
                align-items: center;
                justify-content: space-between;
                > div {
                    align-items: center;
                }
            }
        }

        &logo {
            width: 100px;
            height: 50px;
            img {
                background-color: #eeeeee;
                width: 100px;
                height: 50px;
            }
        }

        &navItem {
            padding-left: 20px;

            a {
                font-size: 18px;
                margin:0 10px;
                white-space: nowrap;

                &:hover {
                    color: $theme-color;
                }
            }

        }

        &search {
            /deep/ .ivu-input-wrapper-default {
                width: 447px;

                .ivu-btn:focus {
                    box-shadow: none;
                }

                .ivu-input {
                    height: 54px;
                    font-size: 16px;
                    border-color: $theme-BgColor;
                    color: #212121;
                }

                .ivu-input-with-prefix {
                    padding-left: 40px;
                }

                .ivu-input-with-suffix {
                    padding-right: 100px;
                    right: -1px;
                }

                .ivu-input-prefix {
                    width: 50px;
                    line-height: 54px;

                    i {
                        line-height: 54px;
                        font-size: 22px;

                    }
                }

                .ivu-input-suffix {
                    width: 80px;

                    button {
                        margin-top: 1px;
                        width: 80px;
                        height: 52px;
                        border: none;
                        background-color: $theme-BgColor;
                        color: #ffffff;
                        font-size: 16px;
                        font-weight: 600;
                        border-radius: 2px;
                    }
                }
            }
        }

    }
}


</style>
