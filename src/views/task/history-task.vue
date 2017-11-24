<template>
	<section>
		<!--工具条-->
		<el-col :span="24" >
			<el-form :inline="true" :model="filters" size="medium">
				<el-form-item style="width: 140px;">
					<el-select v-model="filters.key" @change="filters.value=null">
						<el-option label="任务ID" value="taskId"/>
						<el-option label="任务名称" value="taskName"/>
						<el-option label="开始时间" value="startedAt"/>
					</el-select>
				</el-form-item>
				<el-form-item>
					<el-input v-model="filters.value" v-if="filters.key=='taskId'" placeholder="请输入任务ID"></el-input>
					<el-input v-model="filters.value" v-if="filters.key=='taskName'" placeholder="请输入任务名称"></el-input>
					<el-date-picker
						v-model="filters.value" v-if="filters.key=='startedAt'"
						type="datetimerange"
						range-separator="至"
						start-placeholder="开始"
						end-placeholder="结束">
					</el-date-picker>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" plain @click="getUsers">查询</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="dataList" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
			<el-table-column prop="taskId" label="任务ID" width="70">
			</el-table-column>
			<el-table-column prop="taskName" label="任务名称" width="100"/>
			<el-table-column prop="startedAt" label="开始时间" width="155"/>
			<el-table-column prop="stoppedAt" label="结束时间" width="155"/>
			<el-table-column prop="runTime" label="运行时长" width="155"/>
			<el-table-column prop="runStatus" label="运行状态" min-width="70">
				<template slot-scope="scope">
					<el-tag type="warning" size="small">运行中</el-tag>
				</template>
			</el-table-column>
			<el-table-column label="操作" width="240">
				<template slot-scope="scope">
					<el-button size="small" @click="handleEdit(scope.$index, scope.row)" plain type="primary">日志</el-button>
					<el-button size="small" @click="handleEdit(scope.$index, scope.row)" plain type="danger">停止</el-button>
				</template>
			</el-table-column>
		</el-table>

		<!--分页-->
		<el-col :span="24" style="padding: 10px 0px">
			<el-pagination layout="total, sizes, prev, pager, next"
										 @current-change="handleCurrentChange"
										 :page-size="20"
										 :total="total"
										 style="float:right; margin-right:-5px">
			</el-pagination>
		</el-col>

		<!--查看-->
		<el-dialog title="查看任务" :visible.sync="viewVisible" :close-on-click-modal="false" width="900px" top="20px">
			<el-tabs type="card" style="margin: -30px 0 -30px 0;">
				<el-tab-pane label="任务信息">
					<el-form :model="editForm" label-width="100px" size="medium" :rules="addFormRules" ref="addForm" style="width:500px;">
						<el-form-item label="任务名称" prop="taskName">
							<el-input v-model="editForm.taskName"></el-input>
						</el-form-item>
						<el-form-item label="算法平台" prop="algoPlatform">
							<el-select v-model="editForm.algoPlatform" placeholder="请选择">
								<el-option
									v-for="item in config['algoPlatform']"
									:key="item.value"
									:label="item.label"
									:value="item.value">
								</el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="算法类型" prop="algoType">
							<el-select v-model="editForm.algoType" multiple placeholder="请选择">
								<el-option
									v-for="item in config['algoType']"
									:key="item.value"
									:label="item.label"
									:value="item.value">
								</el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="任务功能" prop="taskType">
							<el-select v-model="editForm.taskType" placeholder="请选择">
								<el-option
									v-for="item in config['taskType']"
									:key="item.value"
									:label="item.label"
									:value="item.value">
								</el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="存储类型" prop="storeType">
							<el-select v-model="editForm.storeType" placeholder="请选择">
								<el-option
									v-for="item in config['storeType']"
									:key="item.value"
									:label="item.label"
									:value="item.value">
								</el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="服务器IP" prop="serverIp">
							<el-select v-model="editForm.serverIp" placeholder="请选择">
								<el-option
									v-for="item in config['serverIp']"
									:key="item.value"
									:label="item.label"
									:value="item.value">
								</el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="运行命令">
							<el-input type="textarea" v-model="editForm.command" autosize></el-input>
						</el-form-item>
						<el-form-item label="任务文件" prop="filePath">
							<el-upload
								:data="filters"
								:multiple="false"
								:limit="1"
								class="upload-demo"
								ref="upload"
								action="https://jsonplaceholder.typicode.com/posts/"
								:file-list="fileList">
								<el-button slot="trigger" type="primary" size="small" plain>选择文件</el-button>
								<span class="el-upload__tip" style="margin-left: 10px">只能上传zip文件，且不超过10M</span>
							</el-upload>
						</el-form-item>
					</el-form>
				</el-tab-pane>
				<el-tab-pane label="任务代码">
					<editor v-model="editForm.algoCode" theme="monokai" lang="python" height="410px"></editor>
				</el-tab-pane>
			</el-tabs>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="editFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="editSubmit" :loading="editLoading">保存</el-button>
			</div>
		</el-dialog>

		<!--新增-->
		<el-dialog title="新增任务" :visible.sync="addVisible" :close-on-click-modal="false" width="900px" top="20px">
			<el-tabs type="card" style="margin: -30px 0 -30px 0;">
				<el-tab-pane label="任务信息">
					<el-form :model="editForm" label-width="100px" size="medium" :rules="addFormRules" ref="addForm" style="width:500px;">
						<el-form-item label="任务名称" prop="taskName">
							<el-input v-model="editForm.taskName"></el-input>
						</el-form-item>
						<el-form-item label="算法平台" prop="algoPlatform">
							<el-select v-model="editForm.algoPlatform" placeholder="请选择">
								<el-option
									v-for="item in config['algoPlatform']"
									:key="item.value"
									:label="item.label"
									:value="item.value">
								</el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="算法类型" prop="algoType">
							<el-select v-model="editForm.algoType" multiple placeholder="请选择">
								<el-option
									v-for="item in config['algoPlatform']"
									:key="item.value"
									:label="item.label"
									:value="item.value">
								</el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="任务功能" prop="taskType">
							<el-select v-model="editForm.taskType" placeholder="请选择">
								<el-option
									v-for="item in config['algoPlatform']"
									:key="item.value"
									:label="item.label"
									:value="item.value">
								</el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="存储类型" prop="storeType">
							<el-select v-model="editForm.storeType" placeholder="请选择">
								<el-option
									v-for="item in config['algoPlatform']"
									:key="item.value"
									:label="item.label"
									:value="item.value">
								</el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="服务器IP" prop="serverIp">
							<el-select v-model="editForm.serverIp" placeholder="请选择">
								<el-option
									v-for="item in config['algoPlatform']"
									:key="item.value"
									:label="item.label"
									:value="item.value">
								</el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="运行命令">
							<el-input type="textarea" v-model="editForm.command" autosize></el-input>
						</el-form-item>
						<el-form-item label="任务文件" prop="filePath">
							<el-upload
								:data="filters"
								:multiple="false"
								:limit="1"
								class="upload-demo"
								ref="upload"
								action="https://jsonplaceholder.typicode.com/posts/"
								:file-list="fileList">
								<el-button slot="trigger" type="primary" size="small" plain>选择文件</el-button>
								<span class="el-upload__tip" style="margin-left: 10px">只能上传zip文件，且不超过10M</span>
							</el-upload>
						</el-form-item>
					</el-form>
				</el-tab-pane>
				<el-tab-pane label="任务代码">
					<editor v-model="editForm.algoCode" theme="monokai" lang="python" height="410px"></editor>
				</el-tab-pane>
			</el-tabs>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="editFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="editSubmit" :loading="editLoading">保存</el-button>
			</div>
		</el-dialog>

		<!--编辑-->
		<el-dialog title="编辑任务" :visible.sync="editVisible" :close-on-click-modal="false" width="900px" top="20px">
			<el-tabs type="card" style="margin: -30px 0 -30px 0;">
				<el-tab-pane label="任务信息">
					<el-form :model="editForm" label-width="100px" size="medium" :rules="addFormRules" ref="addForm" style="width:500px;">
						<el-form-item label="任务名称" prop="taskName">
							<el-input v-model="editForm.taskName"></el-input>
						</el-form-item>
						<el-form-item label="算法平台" prop="algoPlatform">
							<el-select v-model="editForm.algoPlatform" placeholder="请选择">
								<el-option
									v-for="item in config['algoPlatform']"
									:key="item.value"
									:label="item.label"
									:value="item.value">
								</el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="算法类型" prop="algoType">
							<el-select v-model="editForm.algoType" multiple placeholder="请选择" style="width: 100%">
								<el-option
									v-for="item in config['algoType']"
									:key="item.value"
									:label="item.label"
									:value="item.value">
								</el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="任务功能" prop="taskType">
							<el-select v-model="editForm.taskType" placeholder="请选择">
								<el-option
									v-for="item in config['taskType']"
									:key="item.value"
									:label="item.label"
									:value="item.value">
								</el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="存储类型" prop="storeType">
							<el-select v-model="editForm.storeType" placeholder="请选择">
								<el-option
									v-for="item in config['storeType']"
									:key="item.value"
									:label="item.label"
									:value="item.value">
								</el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="服务器IP" prop="serverIp">
							<el-select v-model="editForm.serverIp" placeholder="请选择">
								<el-option
									v-for="item in config['serverIp']"
									:key="item.key"
									:label="item.value"
									:value="item.value">
								</el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="运行命令">
							<el-input type="textarea" v-model="editForm.command" autosize></el-input>
						</el-form-item>
						<el-form-item label="任务文件" prop="filePath">
							<el-upload
								:data="filters"
								:multiple="false"
								:limit="1"
								class="upload-demo"
								ref="upload"
								action="https://jsonplaceholder.typicode.com/posts/"
								:file-list="fileList">
								<el-button slot="trigger" type="primary" size="small" plain>选择文件</el-button>
								<span class="el-upload__tip" style="margin-left: 10px">只能上传zip文件，且不超过10M</span>
							</el-upload>
						</el-form-item>
					</el-form>
				</el-tab-pane>
				<el-tab-pane label="任务代码">
					<editor v-model="editForm.algoCode" theme="monokai" lang="python" height="410px"></editor>
				</el-tab-pane>
			</el-tabs>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="editFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="editSubmit" :loading="editLoading">保存</el-button>
			</div>
		</el-dialog>
	</section>

</template>

<script>
  import util from '../../common/js/util'
  import { getUserListPage, removeUser, batchRemoveUser, editUser, addUser, getConfig } from '../../api/api';

  import editor from '../../components/ace-editor'
  import 'brace/mode/python'
  import 'brace/theme/monokai'

  export default {
    data() {
      return {
        config: {},
        filters: {
          key: 'taskId',
          value: null
        },
        dataList: [{
          taskId: 13,
          taskName: '菜品分类',
          startedAt: "2017-10-10 10:22:23",
          stoppedAt: "--",
          runTime: "--",
          runStatus: "运行中"
        }, {
          taskId: 14,
          taskName: '菜品分类',
          startedAt: "2017-10-10 10:22:23",
          stoppedAt: "2017-10-10 10:22:23",
					runTime: "10h",
          runStatus: "成功"
        }],
        fileList: [],
        users: [],
        total: 0,
        page: 1,
        listLoading: false,
        sels: [],//列表选中列

        viewVisible: false,//编辑界面是否显示

        editVisible: false,//编辑界面是否显示
        editLoading: false,
        editFormRules: {
          name: [
            { required: true, message: '请输入姓名', trigger: 'blur' }
          ]
        },
        //编辑界面数据
        editForm: {
          id: 0,
          name: '',
          sex: -1,
          age: 0,
          birth: '',
          addr: '',
          algoCode: "# -*- coding: utf-8 -*-\n" +
          "import random\n" +
          "import numpy as np\n" +
          "from collections import deque\n" +
          "\n" +
          "from keras.models import Sequential\n" +
          "from keras.layers import Dense, Flatten, Conv2D\n" +
          "from keras.optimizers import Adam\n" +
          "from keras import backend as K\n" +
          "\n" +
          "\n" +
          "class Agent:\n" +
          "    def __init__(self, batch_size, action_size, input_rows, input_cols, input_channels):\n" +
          "        self.batch_size = batch_size\n" +
          "        self.action_size = action_size\n" +
          "        self.input_rows = input_rows\n" +
          "        self.input_cols = input_cols\n" +
          "        self.input_channels = input_channels\n" +
          "        self.memory = deque(maxlen=2000)\n" +
          "        self.gamma = 0.95    # discount rate\n" +
          "        self.epsilon = 1.0  # exploration rate\n" +
          "        self.epsilon_min = 0.01\n" +
          "        self.epsilon_decay = 0.995\n" +
          "        self.learning_rate = 0.01\n" +
          "        self.model = self._build_model()\n" +
          "\n" +
          "    def _build_model(self):\n" +
          "        if K.image_data_format() == 'channels_first':\n" +
          "            input_shape = (self.input_channels, self.input_rows, self.input_cols)\n" +
          "        else:\n" +
          "            input_shape = (self.input_rows, self.input_cols, self.input_channels)\n" +
          "\n" +
          "        model = Sequential()\n" +
          "        # Conv2D Param Count: (3[宽] * 3[高] * 3[通道数] + 1[bias]) * 32[filter数] = 320\n" +
          "        model.add(Conv2D(filters=32,\n" +
          "                         kernel_size=(3, 3),\n" +
          "                         activation='relu',\n" +
          "                         input_shape=input_shape))\n" +
          "        # Conv2D Param Count: (3 * 3 * 32 + 1) * 64 = 18496\n" +
          "        model.add(Conv2D(filters=64,\n" +
          "                         kernel_size=(3, 3),\n" +
          "                         activation='relu'))\n" +
          "        model.add(Conv2D(filters=64,\n" +
          "                         kernel_size=(3, 3),\n" +
          "                         activation='relu'))\n" +
          "        model.add(Flatten())\n" +
          "        model.add(Dense(128, activation='relu'))\n" +
          "        model.add(Dense(self.action_size, activation='linear'))\n" +
          "        print('input shape:', input_shape)\n" +
          "        model.summary()\n" +
          "\n" +
          "        model.compile(loss='mse',\n" +
          "                      optimizer=Adam(lr=self.learning_rate))\n" +
          "        return model\n" +
          "\n" +
          "    def remember(self, state, action, reward, next_state, done):\n" +
          "        self.memory.append((state, action, reward, next_state, done))\n" +
          "\n" +
          "    def action(self, state):\n" +
          "        if np.random.rand() <= self.epsilon:\n" +
          "            return random.randrange(self.action_size)\n" +
          "        else:\n" +
          "            act_values = self.model.predict(state)\n" +
          "            return np.argmax(act_values[0])  # returns action\n" +
          "\n" +
          "    def repeat(self):\n" +
          "        minibatch = random.sample(self.memory, self.batch_size)\n" +
          "        for state, action, reward, next_state, done in minibatch:\n" +
          "            target = self.model.predict(state)\n" +
          "            if done:\n" +
          "                target[0][action] = reward\n" +
          "            else:\n" +
          "                next_target = self.model.predict(next_state)\n" +
          "                target[0][action] = reward + self.gamma * np.amax(next_target[0])\n" +
          "            self.model.fit(state, target, epochs=1, verbose=0)\n" +
          "        if self.epsilon > self.epsilon_min:\n" +
          "            self.epsilon *= self.epsilon_decay\n" +
          "\n" +
          "    def load(self, name):\n" +
          "        self.model.load_weights(name)\n" +
          "\n" +
          "    def save(self, name):\n" +
          "        self.model.save_weights(name)\n"
        },

        addVisible: false,//新增界面是否显示
        addLoading: false,
        addFormRules: {
          taskName: [
            { required: true, message: '请输入任务名称', trigger: 'blur' }
          ]
        },
        //新增界面数据
        addForm: {
          name: '',
          sex: -1,
          age: 0,
          birth: '',
          addr: ''

        },

        codeVisible: false

      }
    },

    mounted() {
      this.getUsers();
      this.config = getConfig();
      console.log(this.config)
    },

    methods: {
      //性别显示转换
      formatSex: function (row, column) {
        return row.sex == 1 ? '男' : row.sex == 0 ? '女' : '未知';
      },
      handleCurrentChange(val) {
        this.page = val;
        this.getUsers();
      },
      //获取用户列表
      getUsers() {
        let para = {
          page: this.page,
          name: this.filters.name
        };
        this.listLoading = true;
        //NProgress.start();
        getUserListPage(para).then((res) => {
          this.total = res.data.total;
          this.users = res.data.users;
          this.listLoading = false;
          //NProgress.done();
        });
      },
      //删除
      handleDel: function (index, row) {
        this.$confirm('确认删除该记录吗?', '提示', {
          type: 'warning'
        }).then(() => {
          this.listLoading = true;
          //NProgress.start();
          let para = { id: row.id };
          removeUser(para).then((res) => {
            this.listLoading = false;
            this.$notify({
							title: '提示',
              message: '删除成功',
              type: 'success'
            });
            this.getUsers();
          });
        }).catch(() => {

        });
      },
      //显示编辑界面
      handleView: function (index, row) {
        this.viewVisible = true;
//        this.editForm = Object.assign({}, row);
      },

      //显示编辑界面
      handleEdit: function (index, row) {
        this.editVisible = true;
//        this.editForm = Object.assign({}, row);
      },

      //显示新增界面
      handleAdd: function () {
        this.addVisible = true;
        this.addForm = {
          name: '',
          sex: -1,
          age: 0,
          birth: '',
          addr: ''
        };
      },
      //编辑
      editSubmit: function () {
        this.$refs.editForm.validate((valid) => {
          if (valid) {
            this.$confirm('确认提交吗？', '提示', {}).then(() => {
              this.editLoading = true;
              //NProgress.start();
              let para = Object.assign({}, this.editForm);
              para.birth = (!para.birth || para.birth == '') ? '' : util.formatDate.format(new Date(para.birth), 'yyyy-MM-dd');
              editUser(para).then((res) => {
                this.editLoading = false;
                //NProgress.done();
                this.$message({
                  message: '提交成功',
                  type: 'success'
                });
                this.$refs['editForm'].resetFields();
                this.editFormVisible = false;
                this.getUsers();
              });
            });
          }
        });
      },
      //新增
      addSubmit: function () {
        this.$refs.addForm.validate((valid) => {
          if (valid) {
            this.$confirm('确认提交吗？', '提示', {}).then(() => {
              this.addLoading = true;
              //NProgress.start();
              let para = Object.assign({}, this.addForm);
              para.birth = (!para.birth || para.birth == '') ? '' : util.formatDate.format(new Date(para.birth), 'yyyy-MM-dd');
              addUser(para).then((res) => {
                this.addLoading = false;
                //NProgress.done();
                this.$message({
                  message: '提交成功',
                  type: 'success'
                });
                this.$refs['addForm'].resetFields();
                this.addFormVisible = false;
                this.getUsers();
              });
            });
          }
        });
      },
      selsChange: function (sels) {
        this.sels = sels;
      },
      //批量删除
      batchRemove: function () {
        var ids = this.sels.map(item => item.id).toString();
        this.$confirm('确认删除选中记录吗？', '提示', {
          type: 'warning'
        }).then(() => {
          this.listLoading = true;
          //NProgress.start();
          let para = { ids: ids };
          batchRemoveUser(para).then((res) => {
            this.listLoading = false;
            //NProgress.done();
            this.$message({
              message: '删除成功',
              type: 'success'
            });
            this.getUsers();
          });
        }).catch(() => {

        });
      }
    },

    components: {
      editor
    }

  }

</script>

<style scoped>

</style>