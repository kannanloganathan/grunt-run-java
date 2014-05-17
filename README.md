# grunt-run-java

> The Grunt Plugin for running java, javac, jar, signjar and other java related commands from within Grunt

## Getting Started
This plugin requires Grunt `~0.4.4`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-run-java --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-run-java');
```

## The "run_java" task

### Overview
In your project's Gruntfile, add a section named `run_java` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  run_java: {
    options: {
      // Task-specific options go here.
    },
    your_target: {
      // Target-specific details go here.
      execOptions:{
        cwd: "/your/current/working/directory/"
      }, 
      command: "",      //java ,javac, jarsigner, jar
      jarName: "",      //used for java, jar and jarsigner
      className: "",    //used for java
      javaArgs : "",    //used for java
      sourceFiles: [""],//used for javac
      javaOptions: {    //used for java and javac
        "classpath": [""],
         ...
      },
      manifestName: "", //used for jar
      dir: "",          //used for jar
      files: "",        //used for jar
      jarOptions : {    //used for jar and jarsigner
        "keystore": "",
      }, 
      alias: ""         //used for jarsigner
    },
  },
});
```

### Options

#### stdout

Type: `boolean`  
Default: `true`

Show stdout in the Terminal.

#### stderr

Type: `boolean`  
Default: `true`

Show stderr in the Terminal.

#### stdin

Type: `boolean`  
Default: `true`

Forward the terminal's stdin to the command.

#### failOnError

Type: `boolean`  
Default: `true`

Fail task if it encounters an error.


### execOptions

Type: `object`

Specify some options to be passed to the [.exec()](http://nodejs.org/api/child_process.html#child_process_child_process_exec_command_options_callback) method:

- `cwd` String *Current working directory of the child process*
- `env` Object *Environment key-value pairs*
- `setsid` Boolean
- `encoding` String *(Default: 'utf8')*
- `timeout` Number *(Default: 0)*
- `maxBuffer` Number *(Default: 200\*1024)*
- `killSignal` String *(Default: 'SIGTERM')*



### Usage Examples

#### Java Command

Run a java command

```js
grunt.initConfig({
  run_java: {
    options: { //Default is true
      stdout: false,
      stderr: false,
      stdin: false,
      failOnError: false
    }, 
    java_command: {
      execOptions:{
        cwd: "/path/where/java/command/is/run/"
      },    
      command: "java",
      jarName: "your jarfile name", 
      className: "your class name",
      javaOptions: { //java Options
        "classpath": ["1.jar", "2.jar"] 
      },
      javaArgs : "your argument"
    }
  }
});
```

#### Javac Command

Run a javac command

```js
grunt.initConfig({
  run_java: {
    options: { //Default is true
      stdout: false,
      stderr: false,
      stdin: false,
      failOnError: false
    },
    javac_task: {
      execOptions:{
        cwd: "/path/where/javac/command/is/run/"
      }, 
      command: "javac",
      javaOptions: { //javac Options
        "classpath": ["1.jar", "2.jar"]
        "d": "example/bin"
      },
      sourceFiles: ["java/file/location/*.java", "java/file/another/location/*.java"]
    }
  }
});
```

#### Jar Command

Run a jar command

```js
grunt.initConfig({
  run_java: {
    options: { //Default is true
      stdout: false,
      stderr: false,
      stdin: false,
      failOnError: false
    },
    jar_task: {
      execOptions:{
        cwd: ""/path/where/jar/command/is/run/"
      },
      command: "jar",
      jarName: "my.jar",
      jarOptions : "cfm", //{ctxui}[vfm0Me]
      manifestName: "MANIFEST",
      dir: "bin/",
      files: "."
    }
  }
});
``` 

#### jarsigner Command

Run a jarsigner command

```js
grunt.initConfig({
  run_java: {
    options: { //Default is true
      stdout: false,
      stderr: false,
      stdin: false,
      failOnError: false
    },
    sign_task: {
      execOptions:{
        cwd: "/path/where/jarsinger/command/is/run/"
      },
      command: "jarsigner",
      jarName: "my.jar",
      jarOptions : { //jarsigner options
        "keystore": "keystore",
        "signedjar": "mySigned.jar"
      },
      alias: "signFiles"
    }
  }
});
```


#### Run command as a function

You can also supply a function that returns the command:

```js
grunt.initConfig({
	run_java: {
		hello: {
			command: function () {
				return 'jar -cf myapplet.jar -C bin/ .';
			}
		}
	}
});
```
Which can also take arguments:

```js
run_java: {
	hello: {
		command: function (options) {
			return 'jar ' + options;
		}
	}
}

grunt.loadNpmTasks('grunt-run-java');
grunt.registerTask('default', ['run-java:hello']);
```
  


#### Multiple commands

Run multiple commands by placing them in an array which is joined using `&&` or `;`. `&&` means run this only if the previous command succeeded. You can also use `&` to have the commands run concurrently (by executing all commands except the last one in a subshell).

```js
grunt.initConfig({
	shell: {
		multiple: {
			command: [
				'mkdir bin',
				'jar -cf myapplet.jar -C bin/ .',
			].join('&&')
		}
	}
});
```
    
## Release History
_Initial Version_


## License
MIT © [Kannan Loganathan] kannan.loganathan@gmail.com