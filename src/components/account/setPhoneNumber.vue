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
        <Modal
            v-model="modalShow"
            title="更换绑定手机号"
            @on-ok="ok"
            :loading="true"
            width="500"
            :mask-closable="false"
            footer-hide
            class-name="diy-modal"
            @on-cancel="cancel">
            <div v-if="modalShow1 && step == 1" class="add-box">
                <Form ref="modelStep1" :model="modelStep1" :rules="rules2" class="form" :label-width="100">
                    <FormItem prop="mobile" label="手机号">
                        <i-input v-model="modelStep1.mobile" class="input" :disabled="modelStep1.mobile != ''"
                                 placeholder="原手机号"
                        >
                        </i-input>
                    </FormItem>
                    <FormItem prop="imgCaptcha" label="图形验证码">
                        <i-input v-model="modelStep1.imgCaptcha" class="input" placeholder="图形验证码"
                        >
                            <img :src="modelStep1.captchaUrl"
                                 slot="append" class="captcha" @click="getCaptcha" title="重新获取"/>
                        </i-input>
                    </FormItem>
                    <FormItem prop="captcha" label="短信验证码">
                        <i-input v-model="modelStep1.captcha" class="input" type="password" placeholder="短信验证码"
                        >
                            <div slot="append" @click="sendEmsStep1" class="send-code">
                                {{ sendCode.msg }}
                            </div>
                        </i-input>
                    </FormItem>

                </Form>
                <div class="form-footer">
                    <Button @click="next" type="error">下一步</Button>
                </div>
            </div>
            <div v-show="modalShow1 && step == 2" class="add-box">
                <Form ref="model" :model="model" :rules="rules" class="form" :label-width="100">
                    <FormItem prop="account" label="手机号">
                        <i-input v-model="model.account" class="input" placeholder="登录手机号" clearable
                        >
                        </i-input>
                    </FormItem>
                    <FormItem prop="imgCaptcha" label="图形验证码">
                        <i-input v-model="model.imgCaptcha" class="input" placeholder="图形验证码"
                        >
                            <img :src="model.captchaUrl"
                                 slot="append" class="captcha" @click="getCaptcha" title="重新获取"/>
                        </i-input>
                    </FormItem>
                    <FormItem prop="captcha" label="短信验证码">
                        <i-input v-model="model.captcha" class="input" type="password" placeholder="短信验证码"
                        >
                            <div slot="append" @click="sendEms" class="send-code">
                                {{ sendCode.msg }}
                            </div>
                        </i-input>
                    </FormItem>

                </Form>
                <div class="form-footer">
                    <Button @click="cancel">取消</Button>
                    <Button @click="ok" type="error">确认</Button>
                </div>
            </div>
        </Modal>

    </div>
</template>

<script>
import accountApi from '@/api/account'
import account from '@/util/account'
import util from '@/util/util'
import sesttings from '@/util/settings'
import userApi from '@/api/user'

let Model = {
    account: '',
    password: '',
    passwdCheck: '',
    captcha: '',//短信验证码
    imgCaptcha: '',//图片验证码
    captchaUrl: '',
}
let step1 = {
    mobile: '',//手机号
    captcha: '',//短信验证码
    imgCaptcha: '',//图片验证码
    captchaUrl: ''
}
export default {
    name: "setPwd",
    props: {
        show: Boolean,
        defaultPhone: {
            type: String,
            default: () => {
                return ''
            }
        }
    },
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
        return {
            modalShow: false,
            modalShow1: false,
            step: 1,//步骤
            sendCode: {
                msg: "获取验证码",
                seconds: 60,
                temp: null
            },
            modelStep1: {
                mobile: '',//手机号
                captcha: '',//短信验证码
                imgCaptcha: '',//图片验证码
                captchaUrl: ''
            },
            model: {
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
                captcha: [{required: true, message: '请输入短信验证码', trigger: 'blur'}],
                imgCaptcha: [{required: true, message: '请输入图形验证码', trigger: 'blur'}],

            },
            rules2: {
                mobile: [
                    {validator: accountCheck, required: true, trigger: 'blur'},
                ],
                captcha: [{required: true, message: '请输入短信验证码', trigger: 'blur'}],
                imgCaptcha: [{required: true, message: '请输入图形验证码', trigger: 'blur'}],
            },
        }
    },
    created() {
        this.initForm()
    },
    watch: {
        show(val) {
            if (val) {
                this.modalShow1 = true
                this.modalShow = true
                // 获取图形验证码
                this.getCaptcha()
                if (this.defaultPhone) {
                    this.modelStep1.mobile = this.defaultPhone
                }
            }
        }
    },

    methods: {
        next() {
            this.$refs['modelStep1'].validate((valid) => {
                if(valid){
                    this.checkSmsCode()

                }
            })
        },
        checkSmsCode() {
            accountApi.checkSmsCode({
                mobile: this.step == 1 ? this.modelStep1.mobile : this.model.account,
                code: this.step == 1 ? this.modelStep1.captcha : this.model.captcha,
                type: 'bind'//user_reg 用户注册 retrieve_pwd找回密码 change_bind修改手机号 login_code验证码登录 bind绑定手机号
            }, {
                hideSuccessTip: true,
                success: res => {
                    if (res.error !== 0) return
                    if (this.step == 1) {//去下一步 重置验证码
                        this.step = 2
                        this.getCaptcha()
                        clearInterval(this.sendCode.temp)
                        this.sendCode = {
                            msg: "获取验证码",
                            seconds: 60,
                            temp: null
                        }
                        this.$refs.model.resetFields()
                    } else if (this.step == 2) this.submit()//更改手机号
                },
            })
        },
        ok() {
            this.$refs['model'].validate((valid) => {
                if (valid) {
                    // 换绑手机号
                    if(this.model.account == this.modelStep1.mobile ){
                        this.$Message.error('该账号已存在')
                        return
                    }
                    userApi.changeBind({
                        mobile: this.model.account,
                        verify_code: this.model.imgCaptcha,
                        code: this.model.captcha,
                        old_mobile:this.modelStep1.mobile,
                        old_code:this.modelStep1.captcha,
                    }, {
                        hideSuccessTip: true,
                        success: (res) => {
                            if(res.error != 0) return
                            this.modalShow = false
                            this.$emit('confirm')
                            this.initForm()
                        }
                    })
                }
            })
        },
        cancel() {
            this.modalShow = false
            this.$nextTick(() => {
                this.initForm()
                this.$emit('cancel')
            })
        },
        initForm() {
            this.model = JSON.parse(JSON.stringify(Model))
            this.modelStep1 = JSON.parse(JSON.stringify(step1))
            setTimeout(() => {
                this.modalShow1 = false
                this.step = 1
            }, 200)
        },
        sendEms() {//发送短信

            this.$refs.model.validateField('account', result => {
                if (!result && !this.sendCode.start) {
                    accountApi.sendSms({
                        mobile: this.model.account,
                        verify_code: this.model.imgCaptcha,
                        type: 'bind',//user_reg 用户注册 retrieve_pwd找回密码 change_bind修改手机号 login_code验证码登录 bind绑定手机号
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
        sendEmsStep1() {//第一步发送短信
            this.$refs.modelStep1.validateField('mobile', result => {
                if (!result && !this.sendCode.start) {
                    if (this.modelStep1.imgCaptcha == '') {
                        this.$Message.error('请输入图形验证码')
                        return
                    }
                    accountApi.sendSms({
                        mobile: this.modelStep1.mobile,
                        verify_code: this.modelStep1.imgCaptcha,
                        type: 'bind',//user_reg 用户注册 retrieve_pwd找回密码 change_bind修改手机号 login_code验证码登录 bind绑定手机号
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
        // 获取图形验证码
        getCaptcha() {
            // 先设置为loading
            this.model.captchaUrl = require('/static/images/loading-padding.gif')
            this.modelStep1.captchaUrl = require('/static/images/loading-padding.gif')
            setTimeout(() => {
                let sessionId = account.getSessionId();
                if (!sessionId) {
                    return
                }
                this.model.captchaUrl = util.formatUrl('/member/index/get-capture', {
                    'Session-Id': sessionId,
                    'Client-Type': sesttings.clientType,
                    'v': +new Date()
                })
                this.modelStep1.captchaUrl = this.model.captchaUrl
            }, 500);
        },
    },

    beforeDestroy() {
        clearInterval(this.sendCode.temp)
    }
}
</script>

<style scoped lang="scss">
.form-footer {
    display: flex;
    align-items: center;
    justify-content: flex-end;

    button {
        margin-left: 20px;
    }
}

/deep/ .ivu-modal {
    top: 300px;
}

.form {
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

</style>