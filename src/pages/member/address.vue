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
    <div class="address-box">
        <div class="address-title">
            地址管理
        </div>
        <ul class="address-lsit">
            <li v-for="(item,index) in addressList" :key="index">
                <div class="name line1">{{ item.name }}</div>
                <div class="phone">{{ item.mobile }}</div>
                <div class="text line4">{{ item.province }}{{ item.city }}{{ item.area }}{{ item.address }}</div>
                <div class="edit-box">
                    <span v-if="item.is_default != '1'" @click="editAddressDefault(item)">设为默认地址</span>
                    <span @click="editAddress(item)">修改</span>
                    <span @click="deleteAddress(item)">删除</span>
                </div>
                <div v-if="item.is_default == '1'" class="default">默认</div>
            </li>
            <li class="address-add flex" @click="editAddress">
                <div>
                    添加新地址
                </div>
            </li>
        </ul>

        <Modal
            v-model="modalShow"
            :title="addTitle"
            @on-ok="ok"
            :loading="true"
            width="700"
            footer-hide
            class-name="diy-modal"
            @on-cancel="cancel">
            <div v-if="modalShow1" class="add-box">
                <Form ref="form" :model="model" :rules="rules" inline>
                    <div class="flex" style="justify-content: space-between">
                        <FormItem
                            style="width: 320px"
                            prop="name"
                        >
                            <Input
                                v-model="model.name"
                                class="width-430"
                                placeholder="姓名"
                            />
                        </FormItem>

                        <FormItem
                            style="width: 320px"
                            prop="mobile"
                        >
                            <Input
                                v-model="model.mobile"
                                class="width-430"
                                placeholder="手机号"
                            />
                        </FormItem>
                    </div>
                    <FormItem
                        prop="selectedAddress"
                        style="width: 660px"
                    >

                        <Cascader
                            placeholder="请选择省/市/区"
                            class="width-330"
                            :data="addressData"
                            v-model="model.selectedAddress"
                        ></Cascader>
                    </FormItem>
                    <FormItem
                        style="width: 660px"
                        prop="detail"
                    >
                        <Input v-model="model.detail" type="textarea" :rows="4" placeholder="请输入详细地址"/>
                    </FormItem>
                    <Checkbox v-model="model.single">设为默认</Checkbox>
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
import userApi from '@/api/user'
import {
    mapMutations,
} from 'vuex'
import commonApi from '@/api/common'

let Model = {
    id: '',
    name: '',
    mobile: '',
    selectedAddress: [],
    detail: '',
    single: false
}
export default {
    name: "address",
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
            addTitle: '新增地址',
            addressData: [],
            addressList: [],
            model: {
                id: '',
                name: '',
                mobile: '',
                selectedAddress: [],
                detail: '',
                single: false
            },
            location: '', // 位置
            rules: {
                name: [
                    {required: true, message: '请输入收件人姓名'},
                ],
                mobile: [
                    {validator: accountCheck, required: true, trigger: 'blur'},
                ],
                selectedAddress: [{required: true, message: '所属区域必选'}],
                detail: [{required: true, message: '详细地址必填'}],
            },
        }
    },
    created() {
        this.getUserAddressList()
        this.initForm()
        this.getAddress()
    },
    methods: {
        ...mapMutations('common', ['setAddress']),
        deleteAddress(item) {
            userApi.deleteAddress({
                id: item.id
            }, {
                hideSuccessTip: true,
                success: (res) => {
                    if (res.error != 0) return
                    this.$Message.success('删除成功');
                    this.getUserAddressList()

                }
            })
        },
        getUserAddressList() {
            userApi.getAddress({pageSize: 99}, {
                hideSuccessTip: true,
                success: (res) => {
                    if (res.error != 0) return
                    this.addressList = res.list.list
                }
            })
        },

        ok() {
            this.$refs['form'].validate((valid) => {
                if (valid) {
                    let model = this.dataMap('add', this.model)
                    let apiName = 'createAddress'
                    if (this.addTitle == '编辑收货地址') apiName = 'saveAddress'
                    userApi[apiName](model, {
                        hideSuccessTip: true,
                        success: (res) => {
                            this.modalShow = false
                            this.initForm()
                            if (res.error != 0) return
                            this.$Message.success('保存成功');
                            this.getUserAddressList()
                        }
                    })

                }

            })
        },
        cancel() {
            this.modalShow = false
            this.$nextTick(() => {
                this.initForm()
            })
        },
        initForm() {
            this.model = JSON.parse(JSON.stringify(Model))
            setTimeout(() => {
                this.modalShow1 = false
            }, 200)
        },
        editAddress(item) {
            item.id ? this.addTitle = '编辑收货地址' : this.addTitle = '新增收货地址'
            this.modalShow1 = true
            this.modalShow = true
            let model = this.dataMap('edit', item)//后台数据转为当前表单需要数据
            this.model = model
        },
        editAddressDefault(item) {
            let obj = JSON.parse(JSON.stringify(item))
            obj.is_default = 1
            userApi.saveAddress(obj, {
                hideSuccessTip: true,
                success: (res) => {
                    if (res.error != 0) return
                    this.$Message.success('修改成功');
                    this.getUserAddressList()
                }
            })
        },
        dataMap(type = 'edit', obj) {//数据格式转换
            if (type == 'edit') {//编辑
                return {
                    name: obj.name,
                    mobile: obj.mobile,
                    selectedAddress: [obj.province, obj.city, obj.area],
                    detail: obj.address,
                    single: obj.is_default == '1' ? true : false,
                    id: obj.id || ''
                }
            }
            if (type == 'add') {
                return {//远程需要的数据
                    address: obj.detail,
                    area: obj.selectedAddress[2],
                    city: obj.selectedAddress[1],
                    id: obj.id || '',
                    is_default: obj.single ? '1' : '0',
                    mobile: obj.mobile,
                    name: obj.name,
                    province: obj.selectedAddress[0]
                }
            }
        },
        getAddress() {
            commonApi.getAddress({
                hideSuccessTip: true,
                success: (res) => {
                    if (res.error != 0) return
                    this.formatAddress(res.list)//利用引用关系改变数据结构
                    this.addressData = res.list
                    this.$store.commit('common/setAddress', this.addressList)


                }
            })
        },
        // 地址库数据格式化
        formatAddress(data) {
            data.forEach(item => {
                item.id = item.code_id // 传的是adcode
                item.value = item.name
                item.label = item.name
                item.children = item.child || []
                delete item.child
                /*添加国外选项无子集省市区处理 长度等于0 -wyn*/
                if (item.children.length > 0) {
                    Object.assign(item, {
                        expand: false,
                        expand_left: false, //左边是否展开
                        expand_right: false, //右边是否展开
                        add: false, //是否已经添加
                        all_add: false, //子城市是否全部添加
                        show: true //是否显示
                    })
                    this.formatAddress(item.children)
                }
            })
        },
    },

}
</script>

<style scoped lang="scss">
.address-box {
    padding: 0 20px 20px;
    min-height: 650px;
    background: #FFFFFF;
    position: relative;

    .address-title {
        height: 60px;
        line-height: 60px;
        font-size: 18px;
        border-bottom: 1px solid #ececec;
    }

    .address-lsit {
        display: flex;
        align-items: center;
        flex-wrap: wrap;

        li {
            flex-shrink: 0;
            position: relative;
            width: 250px;
            min-height: 200px;
            margin-top: 30px;
            margin-right: 30px;
            padding: 22px 27px;
            border: 1px solid #eeeeee;

            &:hover {
                border: 1px solid $theme-color;

                .edit-box {
                    visibility: inherit;
                }
            }

            .name {
                font-size: 16px;
            }

            .phone {
                margin-top: 14px;
                margin-bottom: 4px;
                font-size: 12px;
            }

            .text {
                color: #999;
                font-size: 14px;
                height: 82px;
            }

            .edit-box {
                position: absolute;
                right: 14px;
                bottom: 12px;
                color: #e93323;
                visibility: hidden;

                span {
                    margin-left: 5px;
                    cursor: pointer;

                    &:hover {
                        color: $theme-color;
                    }
                }
            }

            .default {
                position: absolute;
                right: 0;
                top: 0;
                width: 56px;
                height: 23px;
                line-height: 23px;
                text-align: center;
                color: #fff;
                background: #e93323;
            }
        }


        .address-add {
            display: flex;
            align-items: center;
            justify-content: center;
            background-image: url("../../../static/images/member/add.png");
            background-size: 27px 27px;
            background-repeat: no-repeat;
            background-position: center 70px;

            div {
                color: #c8c8c8;
                font-size: 14px;
                margin-top: 30px;
            }
        }
    }

}

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
</style>