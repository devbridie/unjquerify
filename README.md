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