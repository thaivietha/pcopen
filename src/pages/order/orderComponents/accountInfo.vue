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
        <!-- 卡密商品支付完成 -->
        <div class="order-info">
            <div class="common-title">卡密信息</div>
            <div class="order-bd" v-for="(item,index) in virtual" :key="index">
                <ul class="account-cont" v-if="item.config.length>0">
                    <li class="" v-for="(val, i) in item.config" :key="i">
                        <div class="contLi" :class="{'flex-column': item.is_wrap}">
                            <span class="liTit">{{ val.key }}：</span>
                            <span class="liCont"
                                  @click="toAccountLink(val.type,item,i)">{{ item.data[`value${i + 1}`] }}</span>
                        </div>
                        <div class="textBtn flex-end theme-primary-color" :class="{'is_active':val.ischeck}"
                             @click="copyLink(item.data,index,i)">复制
                        </div>
                    </li>
                    <li class="item-title" v-if="item.use_address == 1">{{ item.use_address_title }}</li>
                    <li class="content" v-if="item.use_address == 1">
                        <div class="contLi">
                            <span class="liLink"
                                  @click="toAccountLink('-1',item.use_address_address,'-1')">{{
                                    item.use_address_address
                                }}</span>
                        </div>
                        <div class="textBtn flex-end  theme-primary-color" :class="{'is_active':item.ischeck}"
                             @click="copyLink(item.use_address_address,index,'-1')">复制
                        </div>
                    </li>
                    <li class="item-title" v-if="item.use_description == 1">{{ item.use_description_title }}</li>
                    <li class="content" v-if="item.use_description == 1">
                        <span class="liTit">{{ item.use_description_remark }}</span>
                    </li>
                </ul>
            </div>
        </div>
        <textarea id="input"></textarea>
        <!-- 卡密商品待付款和付款完成 显示接收地址 -->
        <!--<div class="account-info" v-if="(orderData.status == '30' || orderData.status == '0') && orderGoods[0].type == '2' && orderData.virtual_account_mailer_setting == '1'">-->
        <!--    <div class="email flex-between">-->
        <!--        <span>接收邮箱地址</span>-->
        <!--        <span>{{orderData.to_mailer || '-'}}</span>-->
        <!--    </div>-->
        <!--</div>-->
        <!--<div class="order-info">-->
        <!--    <div class="common-title">订单信息</div>-->
        <!--    <div class="order-bd">-->
        <!--        <ul>-->
        <!--            <li class="flex">-->
        <!--                <div>订单编号：</div>-->
        <!--                <div>{{ orderDetail.order_no }}</div>-->
        <!--            </li>-->
        <!--            <li class="flex">-->
        <!--                <div>下单日期：</div>-->
        <!--                <div>{{ orderDetail.create_time }}</div>-->
        <!--            </li>-->
        <!--            <li class="flex">-->
        <!--                <div>支付时间：</div>-->
        <!--                <div>{{ orderDetail.pay_time }}</div>-->
        <!--            </li>-->
        <!--            <li class="flex">-->
        <!--                <div>支付方式：</div>-->
        <!--                <div>{{ orderDetail.pay_type_text }}</div>-->
        <!--            </li> &lt;!&ndash;&ndash;&gt;-->
        <!--            <li class="flex">-->
        <!--                <div>订单金额：</div>-->
        <!--                <div class="money">￥{{ orderDetail.goods_price }}</div>-->
        <!--            </li>-->
        <!--            <li class="flex" v-if="orderDetail.buyer_remark">-->
        <!--                <div>买家备注：</div>-->
        <!--                <div>{{ orderDetail.buyer_remark }}</div>-->
        <!--            </li>-->
        <!--        </ul>-->
        <!--    </div>-->
        <!--</div>-->
    </div>
</template>

<script>
export default {
    name: "AccountInfo",
    props: {
        orderData: {
            type: Object,
            default: () => {
            }
        },
        orderGoods: {
            type: Array,
            default: () => []
        },
    },
    data() {
        return {
            virtual: []
        }
    },
    watch: {
        orderData: {
            handler(e) {
                if (e && e.virtual_account_data) {
                    this.isCheck()
                }
            },
            immediate: true
        }
    },
    methods: {
        // 补充复制后颜色变浅
        isCheck() {
            this.virtual = this.orderData?.virtual_account_data || [];
            if (this.virtual.length > 0) {
                this.virtual.forEach((item) => {
                    this.$set(item, 'ischeck', false)
                    let config = JSON.parse(item.config), data = JSON.parse(item.data)
                    if (config.length > 0) {
                        config.forEach((secItem, index) => {
                            this.$set(secItem, 'ischeck', false)
                            if (data[`value${index + 1}`].length > 28) {
                                this.$set(item, 'is_wrap', true)
                            }
                        })
                    }
                    item.config = config
                    item.data = data
                })
            }
        },
        /*
     * 单个复制按钮
     * index 属于第几个卡密
     * i 哪个字段复制
     * val 复制内容
     * */
        copyLink (val,index,i) {
            let value = '';
            if(i != '-1') {
                value = val[`value${i+1}`]
            }else {
                value = val
            }
            var input = document.getElementById("input");
            input.value = value; // 修改文本框的内容
            input.select(); // 选中文本
            document.execCommand("copy"); // 执行浏览器复制命令
            this.$Message.success('复制成功')
            i == '-1' ? this.virtual[index].ischeck = true : this.virtual[index].config[i].ischeck = true
            setTimeout(()=>{
                i == '-1' ? this.virtual[index].ischeck = false : this.virtual[index].config[i].ischeck = false
            },500)
        },
    }
}
</script>

<style scoped lang="scss">
#input {position: absolute;top: 0;left: 0;opacity: 0;z-index: -10;}
.common-title {
    padding: 18px 22px;
    font-size: 18px;
    color: #282828;
    background-color: #FFFFFF;
    border-bottom: 1px dashed #cecece;
}

.order-info {
    margin-top: 14px;

    .order-bd {
        background-color: #FFFFFF;

        ul {
            padding: 2px 22px 22px;
            font-size: 16px;
            color: #282828;

            li {
                margin-top: 20px;
                display: flex;
                align-items: center;
                justify-content: space-between;
                .money {
                    color: $theme-color;
                }

                > div:nth-child(1) {
                    flex-shrink: 0;
                }

                &.between {

                    justify-content: space-between;

                    .right {
                        cursor: pointer;
                        color: $theme-color;
                    }
                }
            }

        }
    }
}
.textBtn {
    font-size: 14px;
    line-height: 16px;
    color: #FF3C29;
    align-items: flex-end;
    cursor: pointer;
    &.is_active {
        color: rgba(255,60,41,.5);
    }
}
.item-title {
    font-weight: 900;
    font-size: 16px;
    line-height: 17px;
    margin-top: 16px;
    &:first-child {
        margin-top: 0;
    }
}
</style>