<template>
	<editor v-model="variable" theme="monokai" lang="python" height="500px"></editor>
</template>

<script>
  import editor from '../../components/ace-editor'
  import 'brace/mode/python'
  import 'brace/theme/monokai'

  export default {
    data() {
      return {
        variable: "# -*- coding: utf-8 -*-\n" +
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
      }
    },
    methods: {

    },
    mounted() {

    },
    components: {
      editor
    }

  }
</script>

<style>

</style>