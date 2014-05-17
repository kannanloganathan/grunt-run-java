 /*
 * grunt-run-java
 * https://github.com/kannanloganathan/grunt-run-java
 *
 * Copyright (c) 2014 Kannan Loganathan (kannan.loganathan@gmail.com)
 * Licensed under the MIT license.
 */

'use strict';
var exec = require('child_process').exec;

module.exports = function(grunt) {
  // Please see the Grunt documentation for more information regarding task
  // creation: http://gruntjs.com/creating-tasks
  grunt.registerMultiTask('run_java', 'The Grunt Plugin for running java, javac, jar, signjar and other java related commands from within Grunt', function() {

    var prop, execString,
        data = this.data,
        execOptions = this.data.execOptions || {},
        done = this.async(),
        //if stdout, stderr, stdin, failOnError are not set, set as true, by default.
        options = this.options ({stdout: true, stderr: true, stdin: true, failOnError: true}),
        //jCmd can be set as "command" OR "cmd" OR "string" OR if nothing, set the variable as false
        jCmd =  data.command || data.cmd || ((grunt.util.kindOf(data) === "string") ? data : undefined);

    // If the command is a function, get the return value. 
    execString = grunt.template.process(typeof jCmd === 'function' ? jCmd.apply(grunt, arguments) : jCmd);
    if (execString === undefined) {
      grunt.log.warn("The command attribute is required");
      done(false);
      return false;
    }

    function setOptions(optionData, propDelimiter, paramDelimiter){
      if (optionData){
        execString += propDelimiter;
        if (optionData instanceof Array){
          execString += optionData[0];
          for (var i = 1; i < optionData.length ; i++){
            execString += paramDelimiter + optionData[i];
          }
        }else if (optionData !== ""){
           execString += optionData;
        }
      }
    }
    
    //if signjar
    if (execString.indexOf("jarsigner") !== -1){
      if (data.jarOptions){
        for (prop in data.jarOptions){
          execString += " -" + prop;
          setOptions(data.jarOptions[prop]," ",":");
        }
      }
      if (data.jarName){
        execString += " " + data.jarName;
      }
      if (data.alias){
        execString += " " + data.alias;
      }
    }
    //if jar 
    else if (execString.indexOf("jar") !== -1){
      setOptions(data.jarOptions," -","");
      if (data.jarOptions.indexOf("f") > data.jarOptions.indexOf("m")){
        if (data.jarName){
          execString += " " + data.jarName;
        }
        if (data.manifestName){
          execString += " " + data.manifestName;
        }
      }
      else{
        if (data.manifestName){
          execString += " " + data.manifestName;
        }
        if (data.jarName){
          execString += " " + data.jarName;
        }
      }
      if (data.dir){
        execString += " -C " + data.dir;
      }
      setOptions(data.files," "," ");
    }

    //if java or javac
    else if (execString.indexOf("java") !== -1){
      if (data.javaOptions){
        for (prop in data.javaOptions){
          execString += " -" + prop;
          if (//java Options
            prop === "cp" || prop === "classpath" || 
            //javac options
            prop === "encoding" || prop === "source" || prop === "sourcepath" || prop === "target" || prop === "bootclasspath" || 
            prop === "extdirs" || prop === "endorseddirs" || prop === "processor" || prop === "processorpath" || prop === "d" || 
            prop === "s" || prop === "encoding" || prop === "Xmaxerrors" || prop === "Xmaxwarns" || prop === "Xstdout"){
            //Space delimiter
            setOptions(data.javaOptions[prop]," ",":");    
          }
          else if (// java options
            prop === "agentlib" || prop === "agentpath" || prop === "ea" || prop === "enableassertions" || prop === "da" ||
            prop === "disableassertions" || prop === "javaagent" || prop === "verbose" || prop === "version" || prop === "Xbootclasspath" ||
            prop === "Xbootclasspath/p" || prop === "-Xbootclasspath/a" || prop === "Xcheck" || prop === "Xloggc" || 
            prop === "Xrunhprof" || prop === "XX" || prop === "splash" ||
            //javac options
            prop === "g" || prop === "Xbootclasspath/" || prop === "Xlint"){
            // : delimiter
            setOptions(data.javaOptions[prop],":",":");      
          }
          else if (//java options
            prop === "D" || prop === "Xms" || prop === "Xmx" || prop === "Xss" ||
            //javac options
            prop === "d"){
            // No Delimiter
            setOptions(data.javaOptions[prop],"",":");
          }
          else {
            grunt.log.warn("The option \"" + prop + "\" is not supported. Please report an issue on github, if this is a valid option");

          }
        }
      }

      if (jCmd === "java"){
        if (data.className){
          execString += " " + data.className;
        }
        if (data.jarName){
          execString += " -jar " + data.jarName;
        }
        if (data.javaArgs){
          execString += (data.javaArgs !== "" ? (" " + data.javaArgs) : "");
        }
      }
      if (jCmd === "javac"){
        setOptions(data.sourceFiles," "," ");
      }
    }
    else {
        grunt.log.warn("The command \"" + jCmd + "\" is not supported. Only javac, java, jar, jarsigner are currently supported. Please report an issue on github, if this is a valid option required");
        done(false);
        return false;
    }

    var javaprocess = exec(execString, execOptions, function (err, stdout, stderr) {
      if (typeof options.callback === 'function') {
        options.callback.call(this, err, stdout, stderr, done);
      } else {
          if (err && options.failOnError) {
            grunt.fail.warn(err);
          } 
          done();
      } 
    }.bind(this));

    grunt.verbose.writeln('Command:', execString);
    grunt.verbose.writeln('execOptions:', execOptions);

    if (options.stdout || grunt.option('verbose')) {
      javaprocess.stdout.on ('data', function(data){
        grunt.log.ok (data);
      });
    }

    if (options.stderr || grunt.option('verbose')) {
      javaprocess.stderr.on ('data', function(data){
        grunt.log.ok  (data);
      });
    }

    if (options.stdin) {
      process.stdin.resume();
      process.stdin.setEncoding('utf8');
      process.stdin.pipe(javaprocess.stdin);
    }
  });
};
