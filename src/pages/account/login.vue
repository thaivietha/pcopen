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
    <div class="account-login">
        <div class="login-body">
            <div class="login-container">
                <div class="login-box">
                    <div class="login-form">
                        <div class="wechat-login" v-if="qrcodeLogin" @click="wechatLogin">
                            <i class="iconfont icon-Frame"></i>
                        </div>
                        <div class="tabs-nav flex">
                            <span class="active">登录</span>
                            <span @click="register">注册</span>
                        </div>
                        <Form ref="loginForm" :model="loginForm" :rules="rules" :label-width="0">
                            <FormItem prop="account">
                                <i-input v-model="loginForm.account" class="input" placeholder="登录账号" clearable
                                         @on-enter="loginSubmit">
                                    <Icon type="ios-person-outline" slot="prefix"></Icon>
                                </i-input>
                            </FormItem>
                            <FormItem prop="password">
                                <i-input v-model="loginForm.password" class="input" type="password" placeholder="登录密码"
                                         clearable @on-enter="loginSubmit">
                                    <Icon type="ios-lock-outline" slot="prefix"></Icon>
                                </i-input>
                            </FormItem>
                            <Button :loading="processing" class="login-btn" type="primary" @click="loginSubmit">登录
                            </Button>
                            <div class="form-bottom">
                                <Checkbox v-model="RememberPwd">记住密码</Checkbox>
                                <a @click="forgetPassword">忘记密码？</a>
                            </div>
                        </Form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import accountApi from '../../api/account';
import account from '../../util/account';
import userApi from '@/api/user'

export default {
    name: 'login',
    data() {
        return {
            processing: false,
            RememberPwd: true,//记住密码
            loginForm: {
                account: '',
                password: '',

            },
            rules: {
                account: [
                    {required: true, message: '请输入登录账号', trigger: 'blur'},
                ],
                password: [
                    {required: true, message: '请输入登录密码', trigger: 'blur'},
                    {
                        type: 'string',
                        min: 8,
                        max: 20,
                        message: '密码长度必须是8-20位',
                        trigger: 'blur'
                    }
                ]
            }
        };
    },
    created() {

        let RememberInfo = localStorage.getItem('remember')
        if (RememberInfo) {
            RememberInfo = JSON.parse(RememberInfo)
            this.loginForm.account = window.atob(RememberInfo.account)
            this.loginForm.password = window.atob(RememberInfo.password)
        }
        this.getLoginStatus()
    },
    methods: {
        wechatLogin() {

            userApi.getWxCode({
                redirectUrl: `${location.origin}/pc/account/login`
            }, {
                hideSuccessTip: true,
                success: (res) => {
                    if (res.error != 0) return
                    window.location.href = res.data.url
                }
            })
        },
        getLoginStatus() {
            userApi.getLoginStatus({
                hideSuccessTip: true,
                success: (res) => {
                    if (res.error != 0) return
                    if (res.member_id) {
                        this.$store.commit('login/setLogin', true)
                        this.$Message.success('登录成功')
                        userApi.getUerInfo({
                            hideSuccessTip: true,
                            success: (info) => {
                                if (res.error != 0) return
                                this.$store.commit('login/setUserInfo', info.data)
                                setTimeout(() => {
                                    this.$router.replace('/index')
                                }, 1200)
                            }
                        })

                    }

                }
            })
        },
        // 注册
        register() {
            this.$router.replace('/account/register')
        },
        // 忘记密码
        forgetPassword() {
            this.$router.replace('/account/forgetPassword')
        },
        // 提交登录
        loginSubmit() {
            this.$refs.loginForm.validate((valid) => {
                if (!valid) {
                    return;
                }
                // 锁定按钮
                this.processing = true;

                // 调用接口执行登录
                accountApi.login({
                    mobile: this.loginForm.account,
                    password: this.loginForm.password,
                    type: 'wap'
                }, {
                    successTip: '登录成功',
                    success: (result) => {
                        console.log(result, '登录情况')
                        accountApi.userInfo({}, {
                            hideSuccessTip: true,
                            success: (info) => {
                                // 执行登录
                                if (info.error !== 0) return
                                if (this.RememberPwd) {//记住密码
                                    let accountInfo = {
                                        account: window.btoa(this.loginForm.account),
                                        password: window.btoa(this.loginForm.password)
                                    }
                                    localStorage.setItem('remember', JSON.stringify(accountInfo))
                                } else {//
                                    localStorage.removeItem('remember')
                                }


                                account.login(info.data);
                                this.$store.commit('login/setUserInfo', info.data)
                                this.$store.commit('login/setLogin', true)
                                this.processing = false;
                                setTimeout(() => {
                                    this.$router.replace('/');
                                }, 800);
                            }
                        })
                    },
                    fail: () => {
                        this.processing = false;
                    },
                });
            });
        },

    },

    computed: {
        qrcodeLogin() {
            let login = true
            if (this.$store.state.common.commonData.qrcode_login_status == '0') {
                login = false
            }
            return login
        },
    },
    mounted() {
        // 登录提示
        let tips = this.$store.getters.getAccountLoginTip;
        if (tips) {
            this.$Message.warning(tips);
        }
        // 检测session-id
        account.checkSessionId(false);

    }
};
</script>

<style lang="scss" scoped>
.content {
    background-color: #f9f9f9;

}

.account-login {
    flex: 1 1 auto;
    display: flex;
    flex-direction: column;
    background: url("../../../static/images/loginBg.b6c6dcd.jpg") no-repeat;
    background-size: cover;
    height: 608px;
    position: relative;
    margin-bottom: 40px;

    .login-body {
        flex: 1 1 auto;
        display: flex;
        flex-direction: column;

        .login-container {

            flex: 1 1 auto;
            display: flex;
            flex-direction: column;
            justify-content: space-around;
            padding: 20px 0;

            &:after {
                display: none;
            }
        }
    }

    .login-box {
        width: 450px;
        //height: 427px;
        background-color: #fff;
        text-align: center;
        margin: 0 auto;
        padding-bottom: 40px;
        padding-top: 70px;
        position: absolute;
        right: 200px;
        box-shadow: 0 10px 20px rgba(0, 0, 0, 0.04);
        display: flex;
        user-select: none;

        .wechat-login {
            cursor: pointer;
            position: absolute;
            right: 8px;
            top: 8px;
            width: 45px;
            height: 45px;

            i {
                display: block;
                height: 45px;
                line-height: 45px;
                position: absolute;
                right: 0;
                top: 0;
                font-size: 45px;

            }
        }
    }

    .login-form {
        height: 100%;
        overflow: hidden;
        background-color: #fff;
        padding: 0px 45px 0;
        flex: 1;

        .tabs-nav {
            cursor: pointer;
            margin-bottom: 20px;

            span {
                display: block;
                padding: 0 0 4px;
                margin: 0 20px 0 0;
                height: 41px;
                line-height: 41px;
                color: #bbbbbb;
                font-size: 22px;

                &.active {
                    color: #333;
                    position: relative;

                    &:after {
                        content: '';
                        position: absolute;
                        width: 100%;
                        left: 0;
                        bottom: 0;
                        height: 3px;
                        background-color: $theme-color;
                        border-radius: 2px;
                    }
                }
            }
        }

        .title {
            margin-bottom: 35px;
        }

        /deep/ .ivu-form-item {
            margin-bottom: 26px;
        }

        .input {
            /deep/ .ivu-input {
                height: 45px;
                line-height: 45px;
                font-size: 14px;
            }

            /deep/ .ivu-icon {
                line-height: 45px;
                font-size: 18px;
            }

            /deep/ .ivu-input-icon-clear {
                &:before {
                    content: "\F178";
                    font-size: 20px;
                }
            }

            /deep/ .ivu-form-item-error-tip {
                top: 4px;
            }

            /deep/ .ivu-input-group-append {
                padding: 0;
            }

            .captcha {
                height: 42px;
                display: block;
                border: 0;
                cursor: pointer;
            }
        }

        .login-btn {
            height: 45px;
            //line-height: 38px;
            //font-size: 14px;
            width: 100%;
            //border: 0;
            //-webkit-border-radius: 4px;
            //-moz-border-radius: 4px;
            //border-radius: 4px;
            margin-bottom: 18px;
            //margin-top: 2px;
            //cursor: pointer;
        }
    }

    .form-bottom {
        display: flex;
        align-items: center;
        justify-content: space-between;

        .ivu-checkbox-focus {
            box-shadow: none;
        }
    }
}
</style>
