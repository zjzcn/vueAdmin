import Login from './views/Login.vue'
import NotFound from './views/404.vue'
import Home from './views/Home.vue'
import Main from './views/Main.vue'

import TrainData from './views/data/train-data.vue'
import StopWord from './views/data/stop-word.vue'
import DictData from './views/data/dict-data.vue'

import TrainTask from './views/task/train-task.vue'

import Table from './views/nav1/Table.vue'
import Form from './views/nav1/Form.vue'
import user from './views/nav1/user.vue'

import Page6 from './views/nav3/Page6.vue'
import echarts from './views/charts/echarts.vue'
import lnglat_cut from './views/map/lnglat_cut.vue'


let routes = [
  {
    path: '/login',
    component: Login,
    name: '',
    hidden: true
  },
  {
    path: '/404',
    component: NotFound,
    name: '',
    hidden: true
  },
  //{ path: '/main', component: Main },
  {
    path: '/',
    component: Home,
    name: '数据管理',
    icon: 'fa fa-database',//图标样式class
    children: [
      { path: '/main', component: Main, name: '主页', hidden: true },
      { path: '/train-data', component: TrainData, name: '训练数据管理', icon: 'fa fa-file' },
      { path: '/dict-data', component: DictData, name: '词典管理', icon: 'fa fa-file' },
      { path: '/stop-word', component: StopWord, name: '停用词管理', icon: 'fa fa-file' },
      { path: '/table', component: Table, name: '预料库管理', icon: 'fa fa-file' }
    ]
  },
  {
    path: '/',
    component: Home,
    name: '任务管理',
    icon: 'fa fa-hourglass-2',
    children: [
      { path: '/train-task', component: TrainTask, name: '任务管理', icon: 'fa fa-file' },
      { path: '/train-task', component: TrainTask, name: '历史任务', icon: 'fa fa-file' },
      { path: '/user', component: user, name: '告警配置', icon: 'fa fa-file' },
    ]
  },
  {
    path: '/',
    component: Home,
    name: '模型管理',
    icon: 'fa fa-cube',
    children: [
      { path: '/page6', component: Page6, name: '模型管理', icon: 'fa fa-file' },
      { path: '/page6', component: Page6, name: '模型版本管理', icon: 'fa fa-file' },
      { path: '/page6', component: Page6, name: '模型评估', icon: 'fa fa-file' },
      { path: '/page6', component: Page6, name: '模型使用', icon: 'fa fa-file' }
    ]
  },
  {
    path: '/',
    component: Home,
    name: '系统管理',
    icon: 'fa fa-gear',
    children: [
      { path: '/echarts', component: echarts, name: '配置管理', icon: 'fa fa-file' },
      { path: '/lnglat_cut', component: lnglat_cut, name: '用户管理', icon: 'fa fa-file' },
      { path: '/lnglat_cut', component: lnglat_cut, name: '用户组管理', icon: 'fa fa-file' },
      { path: '/lnglat_cut', component: lnglat_cut, name: '角色管理', icon: 'fa fa-file' },
      { path: '/lnglat_cut', component: lnglat_cut, name: '权限管理', icon: 'fa fa-file' }
    ]
  },
  {
    path: '*',
    hidden: true,
    redirect: { path: '/404' }
  }
];

export default routes;