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
import orderApi from '@/api/order'
import Qrious from 'qrious';
/**
 * @Description: 订单相关混入
 * @author  Gao
 * @date 2022/2/10
 */
export default {
    data(){
        return{
            checkPatTime:null,
            mixinsCodeUrl: '',
            mixinsPrice: '',
            loads:false
        }
    },
    methods: {

        getPaymentInfo() {
            orderApi.orderPay({
                order_id: this.$route.query.order_id || '',
                pay_type: this.$route.query.type || '',
            }, {
                hideSuccessTip: true,
                success: (res) => {                    
                    if (res.error != 0) return
                    if(this.$route.query.type == 'alipay'){
                        this.loads = true
                        this.mixinsCodeUrl = res.data
                    }else{
                        this.mixinsCodeUrl = res.data.code_url
                    }
                    this.createdCode()
                },
                fail:()=>{
                    this.loads = false
                    this.$Message.error('请刷新页面')
                    console.log(111)
                }
            })
        },
        createdCode() {
            // 生成二维码
            const element = this.$refs.qrcode;
            let qr = new Qrious({
                element,
                value: this.mixinsCodeUrl,
                background: '#fff',
                backgroundAlpha: 1,
                foregroundAlpha: 1,
                level: 'H',
                size: '180',
            });
            this.h5ImgUrl = qr.toDataURL()
            this.checkPay(2500)

        },
        checkPay(checkTime = 1000) {//轮询检查支付
            clearInterval(this.checkPatTime)
            this.checkPatTime = setInterval(() => {
                orderApi.orderPayCheck({
                    order_id: this.$route.query.order_id || '',
                    pay_type:  this.$route.query.type || this.payType || ''
                }, {
                    hideSuccessTip: true,
                    hideErrorTip: true,
                    success: (res) => {
                        if (res.error != 0) return
                        this.$Message.success('支付成功');
                        clearInterval(this.checkPatTime)
                        this.btLoading = false
                        setTimeout(()=>{
                            this.$router.push({path:'/order/orderDetail',query:{order_id: this.$route.query.order_id || ''}})
                        },1000)
                    }
                })
            }, checkTime)

        },
    },
    beforeDestroy() {
        clearInterval(this.checkPatTime)
    }
}