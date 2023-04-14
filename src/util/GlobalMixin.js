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
import * as utils from './jsTool.js'
import store from '@/store'
export default {
    install(Vue) {
        Vue.mixin({
            computed: {
                $utils() {
                    return utils
                },
                pcTitle() {
                    if (!this.$store) return
                    if (this.$store.state.common.commonData) {
                        return this.$store.state.common.commonData.markget_info.site_title || '商城'
                    }
                    return '商城'
                },
                channelTitle() {//站点网页标题
                    if (!this.$store) return

                    if (this.$store.state.setting.systemSetting) {
                        return this.$store.state.setting.systemSetting.share.title
                    }
                    return '商城'
                },
            },
            methods: {
                checkLoginStatus() {
                    return new Promise(resolve => {
                        if (!this.$store.state.login.isLogin) {//未登录
                            this.$router.push('/account/login')
                            return
                        }
                        resolve()
                    })
                },
                setWebTitle() {//设置网站title
                    if (!this.$route) return
                    if (this.$route.path === '/index') {
                        let markget_info = store.state.common.commonData.markget_info
                        this.UpdateBasic(this.pcTitle,markget_info.site_keywords,markget_info.site_description);

                        let iconUrl = this.$utils.mediaUrl(markget_info.site_logo)
                        let $favicon = document.querySelector('link[rel="icon"]');
                        if ($favicon !== null) {
                            $favicon.href = iconUrl;
                        } else {
                            $favicon = document.createElement("link");
                            $favicon.rel = "icon";
                            $favicon.href = iconUrl;
                            document.head.appendChild($favicon);
                        }
                        // 设置图标地址
                    } else if ( this.$route.path != '/goods/detail' && this.$route.path != '/goodsArea') {
                        this.UpdateBasic(`${this.$route.name || ''} - ${this.channelTitle}`)
                    }
                },
                UpdateBasic(Title, Keywords, Description) {
                    let _headDom = '', _title = '', _meta = '';
                    _headDom = document.getElementsByTagName('head')[0]; //获取head节点
                    _title = _headDom.getElementsByTagName("title")[0];  //获取head节点下的title节点
                    _meta = _headDom.getElementsByTagName("meta"); //获取head节点下的meta节点，它一般是一个数组
                    _title.innerText = Title;
                    for (let index = 0; index < _meta.length; index++) {
                        switch (_meta[index].name) {
                            case 'keywords':
                                if (Keywords) _meta[index].content = Keywords;
                                break;
                            case 'description':
                                if (Description) _meta[index].content = Description;
                                break;
                            default:
                                break;
                        }
                    }
                }
            },
            mounted() {
                this.$nextTick(() => {
                    this.setWebTitle()
                })
            }

        })
    },


}