module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		jshint: {
			files: ['./app.js','./controllers/**/*.js','./models/*.js', './lib/db/*.js'],
			options: {
			   // options here to override JSHint defaults
					//asi:true,
					forin:false,
					laxbreak:true,
					eqeqeq:true,
					eqnull:true,
					expr:true,
					sub:true,
					//onevar:false,
					curly:true,
					loopfunc:true,
					node:true,
					'-W065': true,// parseInt传入参数问题
					'-W061':true,
					'-W116':true,// 比较符号== 和=== 的使用严格
					//'-W099':true,// 混合空格和tab
					//'-W082':true,// block中定义function
					'-W086':true,// switch中不使用break
			}
		},
		esformatter: {
			options:{
				indent:{value:'    '},
				preset: 'jquery'
			},
			src: ['./app.js','./controllers/**/*.js','./models/*.js', './lib/db/*.js']
		}
	});

	grunt.loadNpmTasks('grunt-contrib-jshint');
	//grunt.loadNpmTasks('grunt-contrib-qunit');
	grunt.loadNpmTasks('grunt-esformatter');
	//grunt.registerTask('test', ['jshint', 'qunit']);
	grunt.registerTask('format',['esformatter']);
	grunt.registerTask('default', [ 'esformatter','jshint']);

};
