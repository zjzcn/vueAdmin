<template>
	<el-row class="container">
		<el-col :span="24" class="header">
			<el-col :span="10" class="logo" :class="collapsed?'logo-collapse-width':'logo-width'">
				<i class="fa fa-connectdevelop"></i>
				{{collapsed?sysShortName:sysName}}
			</el-col>
			<el-col :span="10">
				<div class="tools" @click.prevent="collapse">
					<i class="fa fa-align-justify"></i>
				</div>
			</el-col>
			<el-col :span="4" class="userinfo">
				<el-dropdown trigger="click">
					<span class="el-dropdown-link userinfo-inner">{{sysUserName}}<i class="el-icon-caret-bottom el-icon--right"></i></span>
					<el-dropdown-menu slot="dropdown">
						<el-dropdown-item>我的消息</el-dropdown-item>
						<el-dropdown-item>设置</el-dropdown-item>
						<el-dropdown-item divided @click.native="logout">退出登录</el-dropdown-item>
					</el-dropdown-menu>
				</el-dropdown>
			</el-col>
		</el-col>
		<el-col :span="24" class="main">
			<aside class="sidebar" :class="collapsed?'sidebar-collapse-width':'sidebar-width'">
				<!--导航菜单-->
				<el-menu :default-active="$route.path" class="el-menu-vertical-demo" @open="handleopen" @close="handleclose" @select="handleselect"
					 unique-opened router :collapse="collapsed">
					<template v-for="(item,index) in $router.options.routes" v-if="!item.hidden">
						<el-submenu :index="index+''" v-if="!item.leaf">
							<template slot="title">
								<i :class="item.iconCls"></i>
								<span slot="title">{{item.name}}</span>
							</template>
							<el-menu-item v-for="child in item.children" :index="child.path" :key="child.path" v-if="!child.hidden">{{child.name}}</el-menu-item>
						</el-submenu>
						<el-menu-item v-if="item.leaf&&item.children.length>0" :index="item.children[0].path">
							<i :class="item.iconCls"></i>
							<span slot="title">{{item.children[0].name}}</span>
						</el-menu-item>
					</template>
				</el-menu>
			</aside>
			<section class="content-container">
				<div class="grid-content bg-purple-light">
					<el-col :span="24" class="breadcrumb-container">
						<el-breadcrumb separator="/">
							<el-breadcrumb-item v-for="item in $route.matched" :key="item.path">
								{{ item.name }}
							</el-breadcrumb-item>
						</el-breadcrumb>
					</el-col>
					<el-col :span="24" class="content-wrapper">
						<transition name="fade" mode="out-in">
							<router-view></router-view>
						</transition>
					</el-col>
				</div>
			</section>
		</el-col>
	</el-row>
</template>

<script>
	export default {
		data() {
			return {
				sysName:'MapStudio',
				sysShortName:'',
				collapsed:false,
				sysUserName: '',
				sysUserAvatar: '',
				form: {
					name: '',
					region: '',
					date1: '',
					date2: '',
					delivery: false,
					type: [],
					resource: '',
					desc: ''
				}
			}
		},
		methods: {
			onSubmit() {
				console.log('submit!');
			},
			handleopen() {
				//console.log('handleopen');
			},
			handleclose() {
				//console.log('handleclose');
			},
			handleselect: function (a, b) {
			},
			//退出登录
			logout: function () {
				var _this = this;
				this.$confirm('确认退出吗?', '提示', {
					//type: 'warning'
				}).then(() => {
					sessionStorage.removeItem('user');
					_this.$router.push('/login');
				}).catch(() => {

				});


			},
			//折叠导航栏
			collapse(){
				this.collapsed=!this.collapsed;
			}
		},
		mounted() {
			var user = sessionStorage.getItem('user');
			if (user) {
				user = JSON.parse(user);
				this.sysUserName = user.name || '';
				this.sysUserAvatar = user.avatar || '';
			}

		}
	}

</script>

<style scoped lang="scss">
	@import '../styles/vars.scss';
	
	.container {
		position: absolute;
		top: 0px;
		bottom: 0px;
		width: 100%;
		.header {
			height: 50px;
			line-height: 50px;
			background: $color-primary;
			color:#fff;
			.logo {
				height:50px;
				font-size: 22px;
				padding-left:10px;
				padding-right:20px;
				border-color: rgba(238,241,146,0.3);
				border-right-width: 1px;
				border-right-style: solid;
				i {
					font-size: 32px;
					margin: 9px 10px 9px 0px;
					float: left;
				}
				.txt {
					color:#fff;
				}
			}
			.logo-width{
				width:210px;
			}
			.logo-collapse-width{
				width:64px
			}
			.tools{
				padding: 0px 23px;
				width:14px;
				cursor: pointer;
			}

			.userinfo {
				text-align: right;
				padding-right: 35px;
				float: right;
				.userinfo-inner {
					cursor: pointer;
					color:#fff;
				}
			}
		}
		.main {
			display: flex;
			// background: #324057;
			position: absolute;
			top: 50px;
			bottom: 0px;
			overflow: hidden;
			.sidebar {
				overflow-y: auto;
				overflow-x: hidden;
				&::-webkit-scrollbar {
					width: 6px;
					background-color: #cfd5de;
				}
				&::-webkit-scrollbar-thumb {
					background: #8b939e;
				}
				.el-menu{
					height: 100%;
				}
			}

			.sidebar-width {
				width: 210px;
			}
			.sidebar-collapse-width {
				overflow-y: visible;
				overflow-x: visible;
				width: 64px;
			}

			.content-container {
				background: #fff;
				flex:1;
				overflow-y: auto;
				overflow-x: hidden;
				&::-webkit-scrollbar {
					width: 6px;
					background-color: #cfd5de;
				}
				&::-webkit-scrollbar-thumb {
					background: #8b939e;
				}
				.el-menu{
					height: 100%;
				}
				.breadcrumb-container {
					box-shadow: 0 1px 2px 0 rgba(0,0,0,.1);
					padding: 15px;
					.title {
						width: 200px;
						float: left;
						color: #475669;
					}
				}
				.content-wrapper {
					margin-top: 1px;
					padding: 15px;
					box-sizing: border-box;
				}
			}
		}
	}

</style>