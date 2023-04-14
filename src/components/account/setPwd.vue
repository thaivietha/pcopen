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
            :title="type == '1'  ? '修改密码' : '设置密码'"
            @on-ok="ok"
            :loading="true"
            width="450"
            footer-hide
            :mask-closable="false"
            class-name="diy-modal"
            @on-cancel="cancel">
            <div v-if="modalShow1" class="add-box">
                <Form ref="loginForm" :model="model" class="form" :rules="rules" :label-width="80">
                    <FormItem prop="old_password" label="原密码" v-if="type == 1">
                        <i-input v-model="model.old_password" class="input" type="password" placeholder="确认登录密码"
                                 clearable>

                        </i-input>
                    </FormItem>
                    <FormItem prop="password" label="新密码">
                        <i-input v-model="model.password" class="input" type="password" placeholder="确认登录密码"
                                 clearable>

                        </i-input>
                    </FormItem>
                    <FormItem prop="confirm_password" label="确认密码">
                        <i-input v-model="model.confirm_password" class="input" type="password"
                                 placeholder="登录密码"
                                 clearable>

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
let Model = {
    password: '',
    confirm_password: '',
    old_password: '',
}
export default {
    name: "setPwd",
    props: {
        show: Boolean,
        type: String,// 1修改密码  2设置密码
    },
    data() {
        const validatePassCheck = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请再次输入密码'));
            } else if (value !== this.model.password) {
                callback(new Error('两次输入的密码不一致!'));
            } else {
                callback();
            }
        };
        return {
            modalShow: false,
            modalShow1: false,
            model: {
                password: '',
                confirm_password: '',
                old_password: '',
            },
            rules: {
                old_password: [
                    {required: true, message: '请输入原密码', trigger: 'blur'},
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
                ],
                confirm_password: [
                    {validator: validatePassCheck, required: true, trigger: 'blur'}
                ]

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
            }
        }
    },
    methods: {
        ok() {
            this.$refs['loginForm'].validate((valid) => {
                if (valid) {
                    this.modalShow = false
                    if(this.type == 2)delete this.model.old_password
                    this.$emit('confirm', this.model)
                    this.initForm()
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
            setTimeout(() => {
                this.modalShow1 = false
            }, 200)
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
/deep/ .ivu-modal {
    top: 300px;
}

</style>