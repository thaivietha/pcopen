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
        <Modal v-model="showRefunCacel" width="360" class-name="cancelBox">
            <div style="text-align:center;height: 60px;line-height: 60px">
                <p>您将取消申请售后，确定继续吗？</p>
            </div>
            <div slot="footer">
                <Button size="large" type="info" long :loading="modal_loading" @click="refundCancel">取消售后</Button>
            </div>
        </Modal>
    </div>
</template>

<script>
import orderApi from '@/api/order'

export default {
    name: "refundCancel",
    data() {
        return {
            showRefunCacel: false,
            modal_loading: false,
            order_id: '',
        }
    },
    methods: {
        show(order_id) {
            this.order_id = order_id
            this.showRefunCacel = !this.showRefunCacel
        },
        refundCancel() {
            this.modal_loading = true;
            orderApi.refundCancel({
                order_id: this.order_id,
                is_edit: 1
            }, {
                hideSuccessTip: true,
                success: (res) => {
                    this.showRefunCacel = false;
                    this.modal_loading = false
                    this.$emit('confirm')
                    if (res.error != 0) return
                    this.$Message.success('取消成功');

                },
                fail:()=>{
                    this.showRefunCacel = false;
                    this.modal_loading = false
                }

            })
            setTimeout(() => {
                this.modal_loading = false
            }, 3000)
        },
    }
}
</script>

<style scoped lang="scss">
/deep/ .cancelBox {
    .ivu-modal {
        top: 350px;
    }
}

</style>