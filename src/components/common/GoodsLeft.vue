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
	<ul class="goods-left">
		<li class="goods-left-item item-top"
			v-for="goods in leftGoods">
			<a :href="goods.sourceUrl" target="_blank">
				<img :src="goods.imgUrl" alt="" />
			</a>
		</li>
	</ul>
</template>

<script>
export default {
	props: {
		leftGoods: {
			required: true,
			type: Array
		}
	}
}
</script>

<style>
.goods-left {
	float: left;
  width: 234px;
  height: auto;
	.goods-left-item {
		width: 234px;
		height: 300px;
		margin-bottom: 14px;
		cursor: pointer;
		transition: all 0.3s;
		&:hover {
			transform: translateY(-2px);
			box-shadow: 5px 5px 20px #ccc;
		}
		img {
			width: 234px;
			height: 300px;
		}
	}
	.item-bottom {
		margin-top: 14px;
	}
}
</style>
