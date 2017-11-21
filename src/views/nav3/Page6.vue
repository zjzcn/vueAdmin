<template>
	<div id="wrapper">
		<div id="json-editor" class="editor"></div>
	</div>
</template>

<script>
  import ace from 'brace'
  import 'brace/mode/python'
  import 'brace/theme/monokai'

  export default {
    data() {
      return {
        text1: 'function a() {};'
      }
    },
    methods: {

    },
    mounted() {
      var editor = ace.edit('json-editor');
      editor.getSession().setMode('ace/mode/python');
      editor.setTheme('ace/theme/monokai');
      editor.setValue(
        "import tensorflow as tf \n\
        import numpy as np \n\
				hello = tf.constant('Hello, TensorFlow!') \n\
				session = tf.Session()\n\
				print(session.run(hello)) \n\
				print(np.version.version) \n\
				print()\n\
				".split('\n')
        .join('\n')
      );
      editor.clearSelection();
    }
  }
</script>

<style>
	/*#wrapper {*/
		/*position: absolute;*/
		/*top: 50px;*/
		/*bottom: 0;*/
		/*left: 0;*/
		/*right: 0;*/
	/*}*/

	div.editor {
		position: absolute;
		width: 50%;
		height: 50%;
	}

	#javascript-editor {
		left: 0;
		top: 0;
	}

	#coffee-editor {
		left: 0;
		bottom: 0;
	}

	/*#json-editor {*/
		/*top: 0;*/
		/*left: 220px;*/
		/*bottom: 0;*/
	/*}*/

	#lua-editor {
		left: 50%;
		bottom: 0;
	}

	h1 {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		margin: auto;
		background-color: #272822;
		color: antiquewhite;
		border: 2px solid black;
		text-align: center;
	}
</style>