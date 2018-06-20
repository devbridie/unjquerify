# unjQuerify
UnjQuerify is a project that can assist developers in migrating code from jQuery to vanilla DOM APIs.

**In**:
```javascript
$("#submit").click(function() {
    $("#output").text("The button was clicked!");
    $(".post").hide();
});
```

**Output**:
```javascript
document.getElementById("submit").addEventListener("click", function () {
    document.getElementById("output").textContent = "The button was clicked!";
    document.getElementsByClassName("post").map((_element) => _element.style.display = "none");
});
```

## Built With
* [`babel`](https://babeljs.io/) to build an AST and to transform nodes.

## Usage

### CLI
* Ensure that `npm` is available.
* Use `npm install` to install dependencies.
* Run unjQuerify with the provided example script: `npm --silent start sample/simple.js`.
* Verify that the console shows the transformed script.

### As dependency
* **As the plugin is not yet published**, clone this repository.
* Ensure that `npm` is available.
* Run `npm build` in unjQuerify.
* Run `npm install path/to/unjquerify` in your dependant package.
* unjQuerify's plugins are exported in `unjquerify/build/src/all-plugins`.

## Contributing
Contributions are always welcome. Please see this [project's issue tracker](https://github.com/devbridie/unjquerify/issues).

Some useful resources are the following: 
* [Babel Plugin Handbook](https://github.com/jamiebuilds/babel-handbook/blob/master/translations/en/plugin-handbook.md#babel-plugin-handbook)
* [AST Explorer](https://astexplorer.net/#/gist/02b98eb0c96ef8d4762fb5a87a71b849/4ce7c810fc6e6aa48684a656f8b1b06b581e9b02)
* [You Don't Need jQuery](https://github.com/nefe/You-Dont-Need-jQuery)
* [jQuery API Documentation](http://api.jquery.com/)

Before submitting a pull request, please verify that your changes pass linting (run with `npm run lint`). Please include tests for new features.