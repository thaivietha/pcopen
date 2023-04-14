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
                        <div class="tabs-nav flex">
                            <span @click="toLogin">登录</span>
                            <span class="active">注册</span>
                        </div>
                        <Form ref="loginForm" :model="loginForm" :rules="rules" :label-width="100">
                            <FormItem prop="account" label="手机号">
                                <i-input v-model="loginForm.account" class="input" placeholder="登录手机号" clearable
                                         @on-enter="loginSubmit">
                                </i-input>
                            </FormItem>
                            <FormItem prop="imgCaptcha" label="图形验证码">
                                <i-input v-model="loginForm.imgCaptcha" class="input" placeholder="图形验证码"
                                          @on-enter="loginSubmit">
                                    <img :src="loginForm.captchaUrl"
                                         slot="append" class="captcha" @click="getCaptcha" title="重新获取"/>
                                </i-input>
                            </FormItem>
                            <FormItem prop="captcha" label="短信验证码">
                                <i-input v-model="loginForm.captcha" class="input" placeholder="短信验证码"
                                          @on-enter="loginSubmit">
                                    <div slot="append" @click="sendEms" class="send-code">
                                        {{ sendCode.msg }}
                                    </div>
                                </i-input>
                            </FormItem>
                            <FormItem prop="password" label="设置密码">
                                <i-input v-model="loginForm.password" class="input" type="password" placeholder="登录密码"
                                         clearable @on-enter="loginSubmit">

                                </i-input>
                            </FormItem>
                            <FormItem prop="passwdCheck" label="确认密码">
                                <i-input v-model="loginForm.passwdCheck" class="input" type="password"
                                         placeholder="确认登录密码 "
                                         clearable @on-enter="loginSubmit">

                                </i-input>
                            </FormItem>
                            <FormItem>
                                <Button :loading="processing" class="login-btn" type="primary" @click="loginSubmit">立即注册
                                </Button>
                            </FormItem>

                        </Form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import accountApi from '../../api/account';
import store from '../../store';
import account from '../../util/account';
import util from "../../util/util";
import sesttings from "@/util/settings";

export default {
    name: 'register',
    data() {

        const accountCheck = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请输入手机号'));
            } else if (!(/^1[3456789]\d{9}$/.test(value))) {
                callback(new Error('请输入正确的手机号!'));
            } else {
                callback();
            }
        };
        const validatePassCheck = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请确认输入密码'));
            } else if (value !== this.loginForm.password) {
                callback(new Error('两次输入的密码不一致!'));
            } else {
                callback();
            }
        };
        return {
            processing: false,
            sendCode: {
                msg: "获取验证码",
                seconds: 60,
                temp: null
            },
            loginForm: {
                account: '',
                password: '',
                passwdCheck: '',
                captcha: '',//短信验证码
                imgCaptcha: '',//图片验证码
                captchaUrl: '',
            },
            rules: {
                account: [
                    {validator: accountCheck, required: true, trigger: 'blur'},
                ],
                captcha: [{required: true, message: '请输入验证码', trigger: 'blur'}],
                imgCaptcha: [{required: true, message: '请输入验证码', trigger: 'blur'}],
                password: [
                    {required: true, message: '请设置密码', trigger: 'blur'},
                    {
                        type: 'string',
                        min: 8,
                        max: 20,
                        message: '密码长度必须是8-20位',
                        trigger: 'blur'
                    }
                ],
                passwdCheck: [
                    {validator: validatePassCheck, required: true, trigger: 'blur'}
                ]
            }
        };
    },
    methods: {
        sendEms() {//发送短信
            this.$refs.loginForm.validateField('account', result => {
                if (!result && !this.sendCode.start) {
                    accountApi.sendSms({
                        mobile: this.loginForm.account,
                        verify_code: this.loginForm.imgCaptcha,
                        type: 'user_reg',//user_reg 用户注册 retrieve_pwd找回密码 change_bind修改手机号 login_code验证码登录 bind绑定手机号
                    }, {
                        success: (res) => {
                            if (res.error !== 0) return
                            this.sendCode.start = true
                            this.sendCode.msg = this.sendCode.seconds--
                            clearInterval(this.sendCode.temp)
                            this.sendCode.temp = setInterval(() => {
                                if (this.sendCode.msg <= 0) {
                                    clearInterval(this.sendCode.temp)
                                    this.sendCode.start = false
                                    this.sendCode.msg = '获取验证码'
                                } else {
                                    this.sendCode.msg--
                                }
                            }, 1000)
                        }
                    })
                }
            })
        },
        toLogin() {
            this.$router.replace('/account/login')
        },
        // 注册
        register() {
            this.$router.replace('/account/register')
            // this.$Modal.info({
            //     title: '注册账号',
            //     content: '这个按钮是为了对称显示好看，关了吧！',
            //     okText: '好的',
            // });
        },

        // 忘记密码
        forgetPassword() {
            this.$Modal.warning({
                title: '忘记密码？',
                content: '请联系系统管理员进行找回',
                okText: '知道了',
            });
        },

        // 提交登录
        loginSubmit() {
            this.$refs.loginForm.validate((valid) => {
                if (!valid) {
                    return;
                }
                // 锁定按钮
                this.processing = true;
                accountApi.checkSmsCode({
                    mobile: this.loginForm.account,
                    code: this.loginForm.captcha,
                    type: 'user_reg',//user_reg 用户注册 retrieve_pwd找回密码 change_bind修改手机号 login_code验证码登录 bind绑定手机号
                }, {
                    hideSuccessTip: true,
                    success: res => {
                        if (res.error !== 0) return
                        this.submit()//注册
                    },
                    fail: () => {
                        this.processing = false;
                    }
                })


            });
        },
        submit() {
            // 调用接口执行登录
            accountApi.register({
                mobile: this.loginForm.account,
                code: this.loginForm.captcha,
                verify_code: this.loginForm.imgCaptcha,
                password: this.loginForm.password,
            }, {
                success: (result) => {
                    if (result.error !== 0) return
                    setTimeout(() => {
                        this.$router.replace('/account/login');
                    }, 1500);
                },
                successTip: '注册成功',
                fail: (result) => {
                    this.processing = false;

                    // session-id无效，重新获取
                    if (result.error === 124126) {
                        account.checkSessionId(true);
                    }

                    // 图形验证码无效重新获取
                    this.getCaptcha()
                },
            })
        },
        // 获取图形验证码
        getCaptcha() {
            // 先设置为loading
            this.loginForm.captchaUrl =  require('/static/images/loading-padding.gif')
            setTimeout(() => {
                let sessionId = account.getSessionId();
                if (!sessionId) {
                    return
                }
                this.loginForm.captchaUrl = util.formatUrl('/member/index/get-capture', {
                    'Session-Id': sessionId,
                    'Client-Type': sesttings.clientType,
                    'v': +new Date()
                })
            }, 500);
        }
    },
    mounted() {
        // 登录提示
        let tips = store.getters.getAccountLoginTip;
        if (tips) {
            this.$Message.warning(tips);
        }

        // 检测session-id
        account.checkSessionId(false);

        // 获取图形验证码
        this.getCaptcha()
    },
    destroyed() {
        clearInterval(this.sendCode.temp)
    }
};
</script>
<style lang="scss" scoped>
.content {
    background-color: #f9f9f9;

}
</style>
<style lang="scss" scoped>

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

        /deep/ .login-container {

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
        padding-bottom: 0px;
        padding-top: 30px;
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

        /deep/ .ivu-form-item-label {
            height: 45px;
            line-height: 25px;
        }

        /deep/ .tabs-nav {
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

            .send-code {
                width: 100px;
                cursor: pointer;
                line-height: 43px;
                font-size: 14px;
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

        /deep/ .ivu-checkbox-focus {
            box-shadow: none;
        }
    }
}
</style>
