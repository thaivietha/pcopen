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
                        v-if="addressList.length > 0"
                    >

                        <Cascader
                            placeholder="请选择省/市/区"
                            class="width-330"
                            :data="addressList"
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
import commonApi from '@/api/common'
import {
    mapMutations,
} from 'vuex'

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
    props: {
        show: Boolean,
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
            addressList: [],//地址列表
            modalShow: false,
            modalShow1: false,
            addTitle: '新增地址',
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

        this.initForm()
        this.getAddress()
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
        getAddress() {
            commonApi.getAddress({
                hideSuccessTip: true,
                success: (res) => {
                    if (res.error != 0) return
                    this.formatAddress(res.list)//利用引用关系改变数据结构
                    this.addressList = res.list
                    this.$store.commit('common/setAddress',  this.addressList)


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
        ...mapMutations('common', ['setAddress']),
        ok() {
            this.$refs['form'].validate((valid) => {
                if (valid) {
                    this.modalShow = false
                    let model = this.dataMap('add', this.model)
                    // console.log(model)
                    this.$emit('confirm', model)
                    this.initForm()
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
        editAddress(item) {
            item.id ? this.addTitle = '编辑收货地址' : this.addTitle = '新增收货地址'
            this.modalShow1 = true
            this.modalShow = true
        }
    },

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
</style>