var Generator = require('yeoman-generator');

module.exports = class extends Generator {

    constructor(args, opts) {
        // Calling the super constructor is important so our generator is correctly set up
        super(args, opts);

        // Next, add your custom code
        this.option('babel'); // This method adds support for a `--babel` flag
    }

    async initPackage() {
        this.answers = await this.prompt([
            {
                type: "input",
                name: "name",
                message: "Your project name",
                default: "vue-demo" // Default to current folder name
            }
        ]);

        const pkgJson = {
            "name": this.answers.name,
            "version": "1.0.0",
            "description": "",
            "main": "index.js",
            "scripts": {
                "test": "mocha --require @babel/register",
                "build": "webpack",
                "coverage": "nyc mocha"
            },
            "author": "",
            "license": "ISC",
            "dependencies": {
            }
        };
        this.destinationRoot(this.answers.name);
        // Extend or create package.json file in destination path
        // this.fs.extendJSON(this.destinationPath(`${answers.name}/package.json`), pkgJson);
        this.fs.extendJSON(this.destinationPath(`package.json`), pkgJson);
        this.npmInstall(['vue'], { 'save-dev': false });
        this.npmInstall(['webpack', 'webpack-cli', "copy-webpack-plugin",
            'vue-loader', "vue-template-compiler",
            "vue-style-loader", "css-loader", "babel-loader"],
            { 'save-dev': true });

        // for UT
        this.npmInstall(["nyc", "mocha", "@babel/core", "@babel/preset-env", "@babel/register",
            "@istanbuljs/nyc-config-babel", "babel-plugin-istanbul"], { 'save-dev': true });
    }

    async copyFiles() {
        // this.fs.copyTpl(
        //     this.templatePath('Hello.vue'),
        //     this.destinationPath('public/index.html'),
        //     { title: 'Templating with Yeoman' }
        // );
        this.fs.copyTpl(
            this.templatePath('Hello.vue'),
            this.destinationPath('src/Hello.vue')
        );
        this.fs.copyTpl(
            this.templatePath('index.html'),
            this.destinationPath('src/index.html'), {
            title: this.answers.name
        }
        );
        this.fs.copyTpl(
            this.templatePath('webpack.config.js'),
            this.destinationPath('webpack.config.js')
        );

        this.fs.copyTpl(
            this.templatePath('main.js'),
            this.destinationPath('src/main.js')
        );

        this.fs.copyTpl(
            this.templatePath('sample-test.js'),
            this.destinationPath('test/sample-test.js')
        );

        this.fs.copyTpl(
            this.templatePath('.babelrc'),
            this.destinationPath('.babelrc')
        );
        this.fs.copyTpl(
            this.templatePath('.nycrc'),
            this.destinationPath('.nycrc')
        );
    }
};