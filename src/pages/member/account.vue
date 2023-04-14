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
    <div>
        <div class="account-user">
            <div class="user-left">
                <img v-if="userInfo.avatar"
                     :src="$utils.mediaUrl(userInfo.avatar)"
                     alt="">
                <img v-else
                     src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAAEsCAMAAABOo35HAAAAkFBMVEUAAAD19vjs7Pjz8/fx8/j09vn09fj09fj09/jz9ff19/n19ff09Pfz9Pff5+/09vnh6e/h6O/f5+/f5+/19vng6O7u8vX09vjf5+7g6O/h6O/f5+/g6O/f5e/h6O/g6e/39/r09vjh6O/Q2+jO2ufw8/bq7/Pk6vHt8fXZ4uzV3+rn7PLd5e7T3unP2+jg5+/Z/6sBAAAAIXRSTlMA3xBAIJ/vkL+Af3BgUIDv799AIM+gMLCQv3Bg31DPr19EW4HuAAAKwUlEQVR42uza23KbMBAGYB0sEJYZbpj4NmsN2BAY3v/tSkvT1h0ngZiVVqDvEf7ZE7IZCYeX/JSl6qw55wn8lnBeaq3S7JTLA4vY4WTUmcMMXKssf2H7JHKjOCxWnjMp2I4Iac4cnsDPRrIdEDLVsAqdbrvEXoxOYE3abHOKCZkmgICrrXWkkCoBNInK2WZMSaFKtlFfU/c5wFXgl6swGhwqT+Hux6monEoCLS+pwQsd3LQXpgRv+IkFRBwT8IqfQulG71H9xI8hxEUiqiku6quRTFQBzK6cAymE45IayOE0R5dQQBLFM5XSsLpXHBktsgTCSPWiSIG4lExcktgOJLwX6ZcVnUEfQllNuGQL7bSsJn7X4oH0EqS1Fg3Z2+ojhWFz7bkF36WCeXAIZrL7b8U8uBZ8V+TMsSME7OutuIcXhrmUYJ/Z9cWwbHDF0e4rLRnsaP9XIZkDr7ARhj0U1+CspRizmp9WzGp+WjErj2kFfoo+kjIkQb4yfEWxSezBuZ0Ys5rrGLNa4Biz8peWgU17ZSuSsHGSreawiXeGzxSH+H7l/n1L7CArgFLEj5z5VDwa3B4QOexGHhfhkpUYh/t8XMRXmfnS+JWzgIkDy8nY2tXAmpQilAurqq9d17a9HfVt0wzXugLH0hCeGm7XrrcP9N31Bi5J6p/P9dDbT7RdDc5wQfmTsLr09kttV4EjKVvsBG7UjZ3JWXlJok04RrVA4yYuLiie7mNUCzUVOJAuLCxwYLDf4GR2SWrnaN3ab2nfAF1J7Bwd7LcNgC6j9E1YtfYJbQXICkHnxKp7+5S+BmSKzHS/2KddAJkkMt3HrOinpWnc7mNWIaSVUyisMasg0uLCf2GNWQWSVub995wxq1DSKoTne7S2q6oBU+b3taHq7ar6ChAVwmthtXZlLWDKfBbWYFc3AKJC+FuFb/aXgMZW5uvGev94DqkRC+GrsDo7CakRja/Csn+E04jc0x/XGoukAUSSfUQDntr+FVBpaQ/vWHeFtYnSUoDnvrACKq2UPSQSQHNfWCGVViGc3w2VRVUBHsMeKQFPZ1FdAI92Pt5bi6oHRHJL433kfMRzwNNZZAPgKZz+KfJhFwbdhwrw3Cy6G+BR7H8J4LladD/IO5vlVIEgCiuEK5ax3KR03UNQ/nn/t7vGJHfkogSY7lP05Nu6+2q65whMz4XkOARe/Ie2VCRICKxCqpM+mppWBKzCNAGQkhyHALUXDqQsLUmLQlQVPu/vajr8f7lU2xswbIfv5tIjSZInfXTJoiPoECZIVk6S7IQfvluKBEBBksTWVUCCDMUsLUGLDgHqZGECgUQJMQd1/JC1wbQsP2TZpkWS+CGLAkjL8qLBE4WQlOVFdLBJ60SSgGTlJMsJckrAiwRPtLaRVJQqAdCSMAGiv/vwiIbo+yzPlkTx4eHfBztEf/fgsfKNyH4QIoj+FxY31oj8TvpfhX1in5IKov4l6xcviNma6l/ff/GK2AzpWdNS9Gfngx1o9FOb9FDXsm7bYUzSKP+Y7ZsTZuxMvw4VVuEtOxACk3RRWIVEmOFPqj/ttryAZkZ2c6nOhUVHzAhzxcdR7tiDBiHqPeh0x+tqSwjUHqG7Z4saYq71cOY9G9Ts1u7SUrgVXolWMWGw/3l0boVXTkBZw6MKmqZ5f8j1h8HwnhKKePVGMM7PNL2P4JmykmCsoQPy2yFP84y1hAItKy1mi7J0fBUEZL36QzjsSCgryklYnRKQw4qgnDumnH2dCcqKsBirypnEEBK4rPScv7ORl9AqBMtKS2NMzubKGIPUBZWVleZGzuXqBu7uFKCss/lHzuUKqwsmKzP35DyuwLpAsrKL6ZInbqoa6wqpCxBK09L0aJ1sJa3pcUlJmoP03x2rqktbzHdVPHCF2BnX0rIyY+EpxaQyzxCtRWFZdllxLK7+skLX4pvsnD8zTFtPVVVXZhjZ+X8nkiK9mB+pagdV6MUVy72wyMwoqsJBFXZxRWKvwkozlrYY0eqbfKBXgbbFjchLVluCI6mGfTVFZXrgS3Er8/o+M5Op8qJ5LCofMAUtxVeRD0NKM4/2aqyuk+YmKamLq6fP4luGrb3Al93pxSwAgVIMmT9mW4wrCVsv7J9JpmYxZMQL+we4mVkQvLbW3IfCzmZRsLb5mOnQwEJd8dqKWM7eL9cVq60tw7DuRbvitLV3HkC9dFeMto6OhzMVuOKz5TbWQYcrrgTxxjBJcon5SsTWiWMUzdJy+yNScmfLMVZ5Sf8HJW2Fs8arKHRlLuRMwDS4pzSLpyRH1nNHQunZCPkCxGnesDFVGyHblribM8ZO20bI1eRDlpmui2/uPE1+6uhNvQ3LvW3F04a6qm5Yzm1rM3lcsMaExdS2womX9SlNWDxpKxg74tyTInQpxHjK8HzlqcG5EHcjr2XwpwgdCvE45todv4pwdiGuranB8ODNTugSTaOxlxT5EEddo2k44qZf37r73B5/GHGxmnfdfW6Pj366ONPL7j5zae1H37it/WGD+9I6DF0z6vnCmhwfooELbH1fWBPjg90L+7n0FyysaUvLJtJ+Lv0FC+sveWeU4yAMA1GHpEBE+8cFiARU2vvfbzfiw9WSFGz48rwjWDPjMSDB0lK4kH0IIiyZtAIV6KcJRFgiaY1UYsARlqRrPalE08IIS9C1+Gd9pYg3fBV+MuvjnSPe8lWokVagCj2OsFKaTtFTDY8S75lFcEMXGUHiPbPq2jsz4LgwpVnZG7g9gMR7ZtEJi4kwLvxDKyyWFki8Z96Hwgr0lQjjwhNVKxJdk1YyhFJYTIRxIftQLCyWFooLj3zoGjokguzCjHIVMo1DaKQbs7JjMS973zfUWLTCYnoUF6ZVKyzGo7jwW2gFOskDojhk3oIHpNX6gFAcMrXQagOdJmJEVj20IgkY7d86G/p0ZzxGvtdCK5CIDqBlZYqh1ZGMxiFEVvk8dIGEeIxhrcXuLqZDyPeUKhVLbESAfE9pvmJCxpvv75ldwntS0dlfhvthRdLRjObzfbcOHWkJrf1hrbubUMtgfhn+W4cDXaCzvgxTqlR3VX8wP6x5/z5HH1u2mwOf0hxYel62m8Nnd3jRZSLKsCLdwMPqM+WNn/JJqO6mhmtWHhaH+w0EZ39YLtBNhNbwsFZehPfgrQ/L0408bQ9roFuJVk/D3/brKMdCEIYCaMOfPwQhGEDQpPtf5MT4EufNMzOaUWyBs4SbXloQl6PhYl25YXVwuQ4L1cENJBZJwi0sFsjBTRwWx8I3rYmHO9jSOpNVS+tMVi2tB7LaBCzECBlohQVQGrIwPbLXG9jX0vowGchGMD/mrYA/tKW4rcHMEttnXiU4oD1c29Oem2D5r3YCnhHYVVEFOKHuKp6/GOrdik7AszSb4eo1PM4wOVAfH6vVyGC4KIzVypA/IoiMFYe1OJEZqxdJ9uZSEsih+tBbSg2k3UVPrYF092KfgDJKcSlJs4EbIYnERT+qhaEQF4+oFuZkGSuO6vG3awqsolokjwdVcyz8xliFmSnHM6qFGCfMyPPr3ztje9zVhmqXvr+OyhaR1CrdmZeymnn9Puh7+qhccUmthuCvDcqHAQomtLsoMF/qSP2gw/yvSsY51BHUNmJynvC0aEMyUKchSevjsWmyYaw1pjdGp1E66/0Uo8IXFWP0s3VyTAONlL4AuMw2E5vcuJkAAAAASUVORK5CYII="
                     alt="">
                <div class="info-box">
                    <div class="name flex">
                        <p>{{ userInfo.nickname }}</p>
                        <span>{{ userInfo.level_name }}</span>
                    </div>
                    <div class="info flex">
                        <span>手机号：</span>
                        <template v-if="userInfo.mobile">
                            <span>{{ userInfo.mobile }}</span>
                            <p @click="setPhoneNumber">修改</p>
                        </template>
                        <template v-else>
                            <span style="color:#FF3C29">未设置</span>
                            <p @click="bindPhoneNumber">设置</p>
                        </template>

                    </div>
                    <div class="info flex">
                        <span>密码设置：</span>
                        <template v-if="userInfo.has_password == '1'">
                            <span style="color:#09C15F">已设置</span>
                            <p @click="setPassword('1')">修改</p>
                        </template>
                        <template v-else>
                            <span style="color:#FF3C29">未设置</span>
                            <p @click="setPassword('2')">设置</p>
                        </template>

                    </div>
                </div>

            </div>
            <ul class="user-right flex">
                <li v-for="(item,index) in infoList" :key="index">
                    <router-link :to="item.path"><p>{{ item.num }}</p></router-link>
                    <span>{{ item.name }}</span>
                </li>
            </ul>
        </div>
        <div class="account-order">
            <div class="title flex">
                <h4>快捷入口</h4>
                <!--                <span>查看全部-->
                <!--                <Icon type="ios-arrow-forward"/>-->
                <!--                </span>-->
            </div>
            <ul class="order-list">
                <li v-for="(item,index) in bottomList" :key="index" @click="toQuickEntry(item)">
                    <Badge :count="Number(item.num)">
                        <i class="iconfont" :class="[item.icon]"></i>
                    </Badge>
                    <p>{{ item.name }}</p>
                </li>
            </ul>
        </div>

        <!--设置密码-->
        <setPwd :show="setPwdShow" :type="passwordType" @confirm="submitPwd" @cancel="hideModel"></setPwd>

        <!--更改手机号-->
        <setPhoneNumber :show="setPhoneShow" :defaultPhone="userInfo.mobile" @cancel="hideModel"
                        @confirm="changeMobile"></setPhoneNumber>
        <!--绑定手机号-->
        <bindPhoneNumber ref="bindMobile" @confirm="bindMobile"></bindPhoneNumber>


    </div>
</template>

<script>
import userApi from '@/api/user'
import orderApi from '@/api/order'
import setPwd from '@/components/account/setPwd'
import setPhoneNumber from '@/components/account/setPhoneNumber'
import bindPhoneNumber from '@/components/account/bindPhoneNumber'

export default {
    name: "index",
    components: {setPwd, setPhoneNumber, bindPhoneNumber},
    data() {
        return {
            userInfo: {},
            orderStatus: [],
            setPwdShow: false,
            setPhoneShow: false,
            passwordType: '1',
            infoList: [
                {
                    num: '0',
                    name: '我的余额',
                    path: '',
                    type: 'balance'
                },
                {
                    num: '0',
                    name: '我的积分',
                    path: '',
                    type: 'credit'
                },
                {
                    num: '0',
                    name: '我的优惠券',
                    path: '',
                    type: 'coupon_total'
                }
            ],
            bottomList: [{
                num: '0',
                icon: 'icon-icon-daizhifu',
                name: '待支付',
                path: '我的订单',
                query: '1'
            }, {
                num: '0',
                icon: 'icon-icon-daishouhuo',
                name: '待收货',
                path: '我的订单',
                query: '3'

            },
                //     {
                //     num: '10',
                //     icon: 'icon-icon-daipingjia',
                //     name: '待评价',
                //     path: '',
                // },
                {
                    num: '0',
                    icon: 'icon-icon-xihuandeshangpin',
                    name: '喜欢的商品',
                    path: '我的收藏',
                },],

        }
    },
    created() {
        this.getUserInfo()
        this.getOrderStatus()
        this.getFavoriteList()
    },
    methods: {
        bindPhoneNumber() {//绑定手机号
            this.$refs.bindMobile.show()
        },
        setPhoneNumber() {//改手机号
            this.setPhoneShow = true
        },
        changeMobile() {//手机号更改完毕
            this.getUserInfo()
        },
        bindMobile() {//手机号设置完毕
            this.getUserInfo()
        },
        submitPwd(data) {//修改密码
            this.hideModel()
            userApi.setPassword(data, {
                hideSuccessTip: true,
                success: (res) => {
                    if (res.error != 0) return
                    this.$Message.success('修改成功！');
                    this.getUserInfo()
                }
            })
        },
        hideModel() {
            this.setPwdShow = false
            this.setPhoneShow = false
        },
        setPassword(type = '1') {
            //1 修改密码 2 设置密码
            this.setPwdShow = true
            this.passwordType = type
        },
        getFavoriteList() {
            userApi.getFavorite({}, {
                hideSuccessTip: true,
                success: (res) => {
                    if (res.error != 0) return
                    this.bottomList.forEach(item => {
                        if (item.name === '喜欢的商品') item.num = res.total
                    })
                }
            })
        },
        getOrderStatus() {
            orderApi.orderGetTotal({
                hideSuccessTip: true,
                success: (res) => {
                    if (res.error != 0) return
                    this.orderStatus = res
                    this.bottomList.forEach(item => {
                        if (item.name === '待支付') item.num = res.wait_pay
                        if (item.name === '待收货') item.num = res.wait_receive
                    })
                }
            })
        },
        toQuickEntry(item) {
            let params = {}
            if (item.query) {
                params.status = item.query
            }
            this.$router.push({name: item.path, params})
        },
        getUserInfo() {
            userApi.getUerInfo({
                hideSuccessTip: true,
                success: (res) => {
                    if (res.error != 0) return
                    this.userInfo = res.data
                    this.$store.commit('login/setUserInfo', this.userInfo)
                    for (let key in this.infoList) {
                        switch (this.infoList[key].type) {
                            case 'balance':
                                this.infoList[key].num = res.data.balance
                                break;
                            case 'credit':
                                this.infoList[key].num = res.data.credit
                                break;
                            case 'coupon_total':
                                this.infoList[key].num = res.data.coupon_total
                                break;
                        }
                    }
                }
            })
        }
        ,
    }
}
</script>

<style scoped lang="scss">
.account-user {
    background-color: #ffffff;
    margin-bottom: 10px;
    height: 208px;
    align-items: center;
    display: flex;

    .user-left {
        flex-shrink: 0;
        width: 398px;
        padding-left: 40px;
        position: relative;
        display: flex;
        align-items: center;

        &:after {
            content: '';
            width: 1px;
            height: 52px;
            background-color: #E9EDEF;
            position: absolute;
            right: 0;
            top: 50%;
            transform: translateY(-50%);
        }

        img {
            width: 90px;
            height: 90px;
            /* global/border */
            border: 3px solid #E9EDEF;
            border-radius: 50%;
            overflow: hidden;
        }

        .info-box {
            margin-left: 20px;

            .name {
                margin-bottom: 14px;
                align-items: center;

                p {
                    font-size: 16px;
                    line-height: 22px;
                    font-weight: 600;
                }

                span {
                    margin-left: 10px;
                    font-size: 12px;
                    line-height: 18px;
                    color: #ffffff;
                    text-align: center;
                    min-width: 42px;
                    padding: 0 5px;
                    height: 18px;
                    left: 0px;
                    top: 0px;
                    background: $theme-BgColor;
                    border-radius: 9px;
                }
            }

            .info {
                font-size: 14px;
                line-height: 20px;
                margin-bottom: 10px;

                span {
                    color: #939799;

                }

                p {
                    cursor: pointer;
                    margin-left: 10px;
                    color: #262B30;

                }
            }
        }
    }

    .user-right {
        width: 630px;
        justify-content: space-around;
        text-align: center;

        li {
            min-width: 150px;
        }

        p {
            margin-bottom: 14px;
            font-size: 24px;
            line-height: 34px;
        }

        span {
            font-weight: 500;
            font-size: 14px;
            line-height: 20px;
        }
    }
}

.account-order {
    background-color: #ffffff;
    width: 100%;
    padding: 20px 20px 0;

    .title {
        align-items: center;
        justify-content: space-between;
        padding-bottom: 20px;
        border-bottom: 1px solid #E9EDEF;

        h4 {
            font-size: 16px;
            line-height: 16px;
            font-weight: normal;
        }

        span {
            color: #81878E;
            font-size: 16px;
            line-height: 16px;
            cursor: pointer;

            &:hover {
                color: $theme-color;
            }

            i {
                font-size: 18px;
                line-height: 16px;
            }
        }
    }

    .order-list {
        display: flex;
        align-items: center;
        justify-content: space-around;
        height: 154px;

        li {
            text-align: center;
            //cursor: pointer;

            i {
                font-size: 36px;
                margin-bottom: 14px;
            }

            p {
                color: #56595B;
                font-size: 14px;
            }
        }
    }

}
</style>