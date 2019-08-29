<h1 align="center">:scissors: vue-prune</h1>
<p align="center">Find unused Vue components in your code</p>
<p align="center">
	<a href="https://kbrsh.github.io/license"><img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="License"></a>
</p>

### Usage

`npm install -g vue-prune`

Currently you will have to run the script directly from the directory you wish to analyse, for example:

`cd ~/dev/my-vue-project/src && vue-prune`

If you're running this in a standard Vue project, you'll want to be inside the `src` directory otherwise it'll try and go into your `node_modules` and explode.
