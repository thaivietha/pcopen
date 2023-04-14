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
    <Container>
        <!--面包屑-->
        <Breadcrumbs :list="list"></Breadcrumbs>
        <div class="body">
            <!-- 地址列表-->
            <div class="address-box" v-if="goodsType && goodsType === '0' && confirmData.dispatch_type != '20'">
                <div class="address-title">收货地址</div>
                <div class="line">
                    <img
                        src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAABLAAAAAECAYAAACeNca/AAAAAXNSR0IArs4c6QAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAEsKADAAQAAAABAAAABAAAAAAdekyeAAABbUlEQVR4Ae2asW3DMBBFSWqGACkzRHprgyCbZASPEHiRjJC4TlYIkD4zWIyPd8WXzcZKw+KpkSCIBPHw+HWimNP5eHj5nae6vNv1pqPW4/fhfr5sW98e51TK9n5TPeanz6t+Ga+Thq9zwAd8cAL4oBzIB3zAB+qHRH0W04B6soHAB3xYvRj4fnMc5AP5sJoYrD8YjoHfF8XGNy2nvZ23Hqcy7bttS+7f7z7cubnUbnvGG6zg20DgAz4EAXxQEOQDPuCDEsAHpUE+4AM+KAF8UBrkAz7ggxLAB6UxQD4U272Sct7puG66Pq/O/bzefVy2aX//0z/6td1Xz19X/TJeJw1f54AP+OAE8EE5kA/4gA/UD/b3lPrMZgL1ZMsDfIhYxAd8CBUcBN+bxoF8CCnIB58WY9cPhd0r4esAq4kxktWJ3W2Bg914DQQ+4IMGBD7gAz4oAXxQGuQDPuCDEsAHpUE+4AM+KAF8UBqj58MfRyl5tp+pqv4AAAAASUVORK5CYII=">
                </div>
                <ul class="address-lsit">
                    <li v-for="(item,index) in addressList" @click="changeAddress(item)"
                        :class="[selectedAddressId == item.id ? 'selected' : '']"
                        :key="index">
                        <div class="name line1">{{ item.name }}</div>
                        <div class="phone">{{ item.mobile }}</div>
                        <div class="text line4">{{ item.province }}{{ item.city }}{{ item.area }}{{
                                item.address
                            }}
                        </div>
                        <div v-if="item.is_default == '1'" class="default">默认</div>
                        <i v-if="selectedAddressId == item.id " class="iconfont icon-a-chenggongde21"></i>
                    </li>
                    <li class="address-add flex" @click="editAddress">
                        <div>
                            添加新地址
                        </div>
                    </li>
                </ul>
            </div>
            <!-- 订单商品信息-->
            <div class="order-box">
                <div class="order-title">订单信息</div>
                <div class="order-info">
                    <ul class="list">
                        <li class="item flex" v-for="(goodsItem,index) in orderInfo.goods_info" :key="index">
                            <div class="left">
                                <div class="pictrue">
                                    <img
                                        :src="$utils.mediaUrl(goodsItem.thumb)">
                                </div>
                                <div class="text">
                                    <div class="name line2">{{ goodsItem.title }}</div>
                                    <div class="type line2">
                                        {{ goodsItem.option_title || '默认' }}
                                    </div>
                                </div>
                            </div>
                            <div class="right flex">
                                <span class="money">¥{{ goodsItem.price_unit }}</span>
                                <span class="num">x{{ goodsItem.total }}</span>
                                <span class="total">¥{{ computedPrice(goodsItem.price_unit, goodsItem.total) }}</span>
                            </div>
                        </li>
                    </ul>
                    <div class="coupon-box"
                         v-if="orderCoupon.length > 0">
                        <div class="coupon-title flex">
                            <div>使用优惠券</div>
                            <div class="coupon-price" v-if="couponPrice > 0">
                                -¥{{ couponPrice }}
                            </div>
                            <div class="coupon-price" v-else>
                                不使用优惠券
                            </div>
                        </div>
                        <ul class="coupon-list flex">
                            <li v-for="(item,index) in orderInfo.activity_return_data.coupon"
                                @click="changeCoupon(item,index)" :key="index"
                                class="item flex">
                                <template v-if="item.coupon_sale_type == '1'">
                                    <div class="name">满减券</div>
                                    <div class="money">满{{ Number(item.enough) }}减{{ Number(item.discount_price) }}
                                    </div>
                                </template>
                                <template v-else>
                                    <div class="name">折扣券</div>
                                    <div class="money">满{{ Number(item.enough) }}享{{ Number(item.discount_price) }}折
                                    </div>
                                </template>

                                <i v-if="couponId == item.id " class="iconfont icon-a-chenggongde21"></i>
                            </li>
                        </ul>
                    </div>
                    <div class="coupon-box">
                        <div class="coupon-title flex">
                            <div>积分抵扣</div>
                            <div class="coupon-point noselect" v-if="orderInfo.max_deduction_credit > 0">
                                <Checkbox @on-change="changeCredit" :value="confirmData.deduct_credit == 1">
                                    {{ Number(orderInfo.max_deduction_credit) }}{{ credit_text }}可抵扣
                                    <span>{{ orderInfo.max_deduction_credit_money }}</span></Checkbox>
                            </div>
                            <div class="coupon-point" v-else><span>无可使用积分</span></div>
                        </div>
                    </div>
                    <div class="coupon-box">
                        <div class="coupon-title flex">
                            <div>余额抵扣</div>
                            <div class="coupon-point noselect" v-if="orderInfo.max_deduction_balance > 0">
                                <Checkbox @on-change="changeBalance" :value="confirmData.deduct_balance == 1">
                                    {{ balance_text }}可抵扣
                                    <span>{{ orderInfo.max_deduction_balance }}</span></Checkbox>
                            </div>
                            <div v-else class="coupon-point"><span>无可使用余额</span></div>
                        </div>
                    </div>
                    <div class="coupon-box  order-remarks flex">
                        <div class="remarks-title">买家留言</div>
                        <textarea v-model="buyerRemark" placeholder="填写内容与商家协商并确认，限150字内~" maxlength="150"
                                  class="textarea"></textarea></div>
                </div>
            </div>
            <!--订单价格明细-->

            <div class="price-box">

                <div class="price flex" v-for="(item,index) in priceList" :key="index">
                    <div>{{ item.title }} <span style="color: #aaa" v-if="item.desc">{{ item.desc }}</span></div>
                    <div class="money" v-if="item.price">{{ item.price }}</div>
                </div>

            </div>
            <!--总价格-->

            <div class="price-amount">
                应付总额：<span class="money">¥{{ orderInfo.pay_price }}</span>
            </div>
            <!--总价格-->
            <div class="submit-box">
                <Button @click="payment" class="submit" type="error">提交订单</Button>
            </div>
        </div>
        <Address :show="AddressShow" @confirm="addressConfirm" @cancel="editAddress"></Address>
    </Container>
</template>

<script>
import Address from '@/components/address/Address'
import orderApi from '@/api/order'
import userApi from '@/api/user'

export default {
    name: "confirm",
    components: {Address},
    data() {
        return {
            list: [{
                name: '首页',
                path: '/'
            }, {
                name: '商品详情',
                path: ''
            }, {
                name: '提交订单'
            }],
            couponList: new Array(3),
            couponId: 0,
            AddressShow: false,
            addressList: [],
            orderInfo: {},//订单信息
            selectedAddressId: '',//选中的id
            buyerRemark: '',//留言信息
            goodsType: '0', // 商品类型 （0、实体商品 1、虚拟商品）
            confirmData: {
                // changeAddress: false, // 是否切换地址
                dispatch_type: '10', // 快递类型  10:快递  30:同城配送
                address_id: 0, // 地址id  0默认
                buyer_remark: '', // 留言
                goods_info: [],
                appointment_info: '',
                is_original_buy: '',//原价购物
                // invoice_title: '',
                // invoice_is_electronic: '',
                // invoice_is_company: '',
                // invoice_number: '',
                // invoice_address: '',
                select_coupon_id: '', // 优惠券
                deduct_balance: 1, // 是否开启余额抵扣
                deduct_credit: 1, // 是否开启积分抵扣
                // virtual_email: '', //卡密邮箱
                // select_gift_card_id: '', // 礼品卡id
                is_cart: 0
            }
        }
    },
    created() {
        this.getAddress()
        this.list[1].path = `/goods/detail?id=${this.$route.query.goods_id}` //面包屑
        // type 0   1 2 3
        if (this.$route.query?.is_cart) {
            this.confirmData.is_cart = this.$route.query?.is_cart || 0
        } else {
            this.confirmData.goods_info.push({
                goods_id: this.$route.query.goods_id,
                option_id: this.$route.query.option_id,
                total: this.$route.query.total
            })
        }
        // 适配-原价购买
        let is_origin = this.$route.query.is_origin;
        if (is_origin == '1') {
            this.confirmData.is_original_buy = '1'
        }
        if (this.$route.query.type) {
            let type = this.$route.query.type
            if (type === '1' || type === '2') {
                if (this.confirmData.dispatch_type != 20) {
                    // 虚拟商品
                    this.confirmData.dispatch_type = '0';
                }
                this.goodsType = '1'
            }
        }

        this.getConfirmData()
    },
    methods: {
        changeBalance(val) {
            val ? this.confirmData.deduct_balance = '1' : this.confirmData.deduct_balance = '0'
            this.getConfirmData()
        },
        changeCredit(val) {
            val ? this.confirmData.deduct_credit = '1' : this.confirmData.deduct_credit = '0'
            this.getConfirmData()

        },
        computedPrice(arg1, arg2) {
            if (arg1 && arg2) {

                var m = 0, s1 = arg1.toString(), s2 = arg2.toString();
                try {
                    m += s1.split(".")[1].length
                    // eslint-disable-next-line no-empty
                } catch (e) {
                }
                try {
                    m += s2.split(".")[1].length
                    // eslint-disable-next-line no-empty
                } catch (e) {
                }
                return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m);
            }

        },
        changeAddress(item) {
            this.selectedAddressId = item.id
            this.confirmData.address_id = item.id
            this.getConfirmData()
        },
        getAddress() {
            userApi.getAddress({page: 1}, {
                hideSuccessTip: true,
                success: (res) => {
                    if (res.error !== 0) return
                    this.addressList = res.list.list
                }
            })
        },
        getConfirmData() {
            let _this = this
            orderApi.confirm(this.confirmData, {
                hideSuccessTip: true,
                success: (res) => {
                    if (res.error !== 0) return
                    this.orderInfo = res.order
                    this.selectedAddressId = this.orderInfo.address_id || '' //选中的地址ID
                    this.couponId = this.orderInfo.select_coupon_id
                },fail(e) {
                    if(e.error == 230106 ){//库存不足
                       setTimeout(()=>{
                           history.back()
                       },1200)
                    }
                    if(e.error == 230140){//不支持普通快递发货
                        _this.$Message.error('请到手机端购买')
                        setTimeout(()=>{
                            history.back()
                        },1200)

                    }
                }
            })
        },
        changeCoupon(item) {
            if (item.id == this.couponId) {
                this.couponId = '-1'
                this.confirmData.select_coupon_id = '-1'
                this.getConfirmData()
                return
            }
            this.couponId = item.id
            this.confirmData.select_coupon_id = item.id
            this.getConfirmData()
        },
        payment() {
            this.confirmData.buyer_remark = this.buyerRemark
            this.confirmData.address_id = this.selectedAddressId
            this.confirmData.select_coupon_id = this.couponId
            if (this.goodsType && this.goodsType === '0' && this.confirmData.dispatch_type != '20') {
                if (this.confirmData.address_id == '' || this.confirmData.address_id.length == '0') {
                    this.$Message.error('请添加地址');
                    return
                }
            }
            let payParams = {
                dispatch_type: this.dispatch_type,
                ...this.confirmData
            }
            orderApi.create(payParams, {
                hideSuccessTip: true,
                success: (res) => {
                    if (res.error != 0) return
                    this.$store.dispatch('common/getCartCount')
                    if (res.order.pay_price === 0) {
                        this.$router.push({path: '/order/orderDetail', query: {order_id: res.order.id, goods_id: this.$route.query.goods_id}})
                    } else {
                        this.$router.push({path: '/order/payment', query: {order_id: res.order.id, goods_id: this.$route.query.goods_id}})
                    }

                }
            })
        },
        editAddress() {
            this.AddressShow = !this.AddressShow
        },
        addressConfirm(model) {
            userApi.createAddress(model, {
                hideSuccessTip: true,
                success: (res) => {
                    if (res.error !== 0) return
                    this.getAddress()
                }
            })
        },

    },
    computed: {
        orderCoupon() {
            let coupon = this.orderInfo?.activity_return_data?.coupon || []
            return coupon
        },
        couponPrice() {
            if (this.orderInfo?.extra_price_package?.coupon) {
                return this.orderInfo.extra_price_package.coupon
            }
            return 0
        },
        // 价格规格
        priceRules() {
            let priceRules = {}
            if (this.orderInfo?.extra_price_package) {
                for (let key in this.orderInfo.extra_price_package) {
                    this.orderInfo.extra_discount_rules_package.forEach(
                        (item) => {
                            if (item[key]) {
                                priceRules = {
                                    ...priceRules,
                                    [key]: item[key],
                                }
                            }
                        }
                    )
                }
            }
            return priceRules
        },
        balance_text() {
            return (this.$store.state.setting?.systemSetting?.balance_text || '余额')
        },
        credit_text() {
            return (this.$store.state.setting?.systemSetting?.credit_text || '积分')
        },
        seckillPrice() {
            return this.orderInfo.extra_price_package?.seckill
        },
        price() {
            return this.orderInfo?.extra_price_package || {}
        },
        priceList() {
            let result = []
            let goodsInfo = this.orderInfo.goods_info;
            let goods_type
            /* --------单商户------------------------ */
            let {pay_credit} = this.orderInfo
            let priceText = `￥${parseFloat(this.orderInfo.goods_price).toFixed(2)}`
            if (pay_credit) {
                priceText = `${this.orderInfo.pay_credit}${this.credit_text}+${priceText}`
            }
            if (goodsInfo && goodsInfo.length > 0) {
                goods_type = goodsInfo[0].type
            }
            result = [
                {
                    title: '商品小计',
                    price: priceText,
                    show: this.orderInfo && (this.orderInfo.goods_price || pay_credit)
                },
                {
                    title: '拼团优惠',
                    price: `-￥${parseFloat(this.price?.groups).toFixed(2)}`,
                    show: this.price?.groups > 0
                },
                {
                    title: '团长优惠',
                    price: `-￥${parseFloat(this.price?.groups_leader).toFixed(2)}`,
                    show: this.price?.groups_leader > 0
                },
                {
                    title: '会员优惠',
                    price: `-￥${this.price?.member_price}`,
                    show: this.price && this.price.member_price
                },
                {
                    title: '优惠券',
                    price: `-￥${this.price?.coupon}`,
                    desc: `（满￥${this?.priceRules?.coupon?.enough}${this?.priceRules?.coupon?.coupon_sale_type == 1 ? '减￥' : '享'}${this?.priceRules?.coupon?.discount_price}${this?.priceRules?.coupon?.coupon_sale_type == 1 ? '' : '折'}）`,
                    show: this.price && this.price.coupon
                },
                {
                    title: '商城优惠',
                    price: `-￥${this.price?.full_deduct}`,
                    desc: `（单笔满￥${this?.priceRules?.full_deduct?.enough}立减￥${this?.priceRules?.full_deduct?.deduct}）`,
                    show: this.price && this.price.full_deduct
                },
                {
                    title: '满减/折',
                    price: `-￥${this.price?.full_reduce}`,
                    desc: ``,
                    show: this.price && this.price.full_reduce
                },
                {
                    title: `${this.credit_text}抵扣`, // 积分抵扣
                    price: `-￥${this.orderInfo?.max_deduction_credit_money}`,
                    show: this.orderInfo?.max_deduction_credit > 0 && this.confirmData?.deduct_credit == 1
                },
                {
                    title: `${this.balance_text}抵扣`, // 余额抵扣
                    price: `-￥${this.orderInfo?.max_deduction_balance}`,
                    show: this.orderInfo?.max_deduction_balance > 0 && this.confirmData?.deduct_balance == 1
                },
                {
                    title: this?.presellData?.presell_type == 0 ? '定金抵扣优惠' : '预售优惠',
                    price: `-￥${this?.presellData?.actual_deduct}`,
                    show: this?.presellData && this?.presellData?.title
                },
                {
                    title: '秒杀优惠',
                    price: `-￥${this?.seckillPrice}`,
                    show: this?.seckillPrice > 0
                },
                {
                    title: this.giftSetting?.card_title,
                    price: `-￥${this.price?.gift_card}`,
                    show: this.price && this.price.gift_card
                },
                {
                    title: '运费',
                    price: `￥${parseFloat(this.orderInfo?.dispatch_price) || 0}`,
                    desc: this.orderInfo?.dispatch_type == '30' ? ` （${this.dispatchName[30] ? this.dispatchName[30] : '同城配送'}）` : '',
                    show: goods_type == 0 && this.orderInfo?.dispatch_type != '20'
                },
                {
                    title: '合计',
                    price: `￥${parseFloat(Number(this.orderInfo.pay_price) + Number(this.presellData?.front_money || 0)).toFixed(2)}`,
                    show: this?.presellData && this?.presellData?.presell_type == 0
                },
            ];

            result = result.filter(item => item.show);
            return result
        }
    }
}
</script>

<style scoped lang="scss">
.body {
    background-color: #ffffff;
    padding-bottom: 50px;

    .address-box {
        .address-title {
            height: 64px;
            font-size: 18px;
            padding: 0 28px;
            line-height: 64px;
        }

        .line {
            img {
                display: block;
                width: 100%;
                height: 4px;
            }

        }

        .address-lsit {
            padding-left: 50px;
            padding-bottom: 20px;
            border-bottom: 10px solid #F3F5F7;
            display: flex;
            align-items: center;
            flex-wrap: wrap;

            li {
                cursor: pointer;
                flex-shrink: 0;
                position: relative;
                width: 250px;
                height: 180px;
                margin-top: 30px;
                margin-right: 30px;
                padding: 22px 27px;
                border: 1px solid #eeeeee;

                &:hover {
                    border: 1px solid #dddddd;
                }

                &.selected {
                    border: 1px solid red;

                    i {
                        position: absolute;
                        right: -1px;
                        bottom: -4px;
                        color: $theme-color;
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
                background-position: center center;

                div {
                    color: #c8c8c8;
                    font-size: 14px;
                    margin-top: 70px;
                }
            }
        }
    }

    .order-box {
        .order-title {
            height: 64px;
            line-height: 64px;
            padding: 0 28px;
            font-size: 18px;
        }

        .order-info {
            width: 1160px;
            margin: 0 auto;
            border: 1px solid #efefef;
            padding: 26px 32px;

            .list {
                .item {
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 25px;

                    .left {
                        width: 450px;
                        display: flex;

                        .pictrue {
                            width: 62px;
                            height: 62px;

                            img {
                                width: 62px;
                                height: 62px;
                                display: block;
                            }
                        }

                        .text {
                            margin-left: 10px;
                        }

                        .type {
                            margin-top: 4px;
                            color: #919191;
                        }
                    }

                    .right {
                        line-height: 16px;

                        .money {
                            font-size: 16px;
                        }

                        .num {
                            margin-left: 6px
                        }

                        .total {
                            font-size: 16px;
                            font-weight: bold;
                            color: $theme-color;
                            width: 130px;
                            text-align: right;
                        }
                    }
                }
            }

            .coupon-box {
                border-top: 1px solid #efefef;

                .coupon-title {
                    font-size: 18px;
                    margin: 20px 0;
                    justify-content: space-between;
                    align-items: center;

                    .coupon-price {
                        font-size: 16px;
                        font-weight: bold;
                        color: $theme-color;
                    }

                    .coupon-point {
                        font-size: 14px;

                        span {
                            color: $theme-color;

                        }
                    }
                }

                .coupon-list {
                    flex-wrap: wrap;

                    .item {
                        height: 40px;
                        border: 1px solid #e93323;
                        margin: 0 15px 15px 0;
                        position: relative;
                        cursor: pointer;
                        line-height: 40px;

                        .name {
                            min-width: 70px;
                            padding: 0 10px;
                            height: 100%;
                            color: #fff;
                            text-align: center;

                            background-color: #e93323;
                        }

                        .money {
                            padding: 0 10px;
                            min-width: 103px;
                            text-align: center;
                            color: #e93323;
                        }

                        i {
                            color: $theme-BgColor;
                            position: absolute;
                            right: -1px;
                            bottom: -12px;
                        }
                    }
                }
            }

            .order-remarks {
                padding-top: 26px;
                margin-top: 26px;

                .remarks-title {
                    font-size: 18px;
                }

                .textarea {
                    width: 820px;
                    height: 120px;
                    background-color: #f7f7f7;
                    border: 0;
                    outline: none;
                    resize: none;
                    padding: 12px 14px;
                    margin-left: 26px;

                }
            }

        }


    }

    .price-box {
        text-align: right;
        padding: 27px 46px;

        .price {
            justify-content: flex-end;
            margin-bottom: 12px;
            font-size: 14px;
            align-items: center;

            .number {
                color: $theme-color;
            }

            .money {
                width: 120px;
                text-align: right;
                font-size: 16px;
            }
        }
    }

    .price-amount {
        width: 1160px;
        height: 70px;
        line-height: 70px;
        background: #f7f7f7;
        text-align: right;
        padding-right: 22px;
        margin: -12px auto 0;
        color: #212121;

        .money {
            font-size: 20px;
            font-weight: 700;
            margin-left: 4px;
            width: 120px;
            display: inline-block;
            color: $theme-color;
        }
    }

    .submit-box {
        text-align: right;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        margin: 38px 20px 0 0;

        .submit {
            width: 180px;
            height: 46px;
            font-size: 16px;
        }
    }
}

</style>