<template>
	<div id="wrapper">
		<div id="json-editor" class="editor"></div>
	</div>
</template>

<script>
  import ace from 'brace'
  import 'brace/mode/json'
  import 'brace/theme/eclipse'

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
      editor.getSession().setMode('ace/mode/json');
      editor.setTheme('ace/theme/eclipse');
      editor.setValue([
          '{'
          , ' "language": "JSON",'
          , ' "foo": "bar",'
          , ' "trailing": "comma",'
          , '}'
        ].join('\n')
      );
      editor.clearSelection();
    }
  }
</script>

<style>
	#wrapper {
		position: absolute;
		top: 50px;
		bottom: 0;
		left: 0;
		right: 0;
	}

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

	#json-editor {
		top: 0;
		left: 50%;
		bottom: 0;
	}

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