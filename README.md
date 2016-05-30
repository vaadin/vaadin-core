![Bower version](https://img.shields.io/bower/v/vaadin-core-elements.svg) [![Gitter](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/vaadin/vaadin-core-elements?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge)

# Vaadin Core Elements

[Vaadin elements](https://vaadin.com/elements) are an evolving set of open sourced custom HTML elements, which seamlessly extend the [Polymer Element Catalog](https://elements.polymer-project.org) with high-quality user interface components commonly needed in modern mobile and desktop business web applications.

Vaadin Core Elements is a bundle that contains all the free elements, licensed under the Apache License 2.0.

## Learn more

See the list of elements, demos and documentation, instructions how to get started, video tutorials, application demos and more by visiting:

### [vaadin.com/elements ›](https://vaadin.com/elements)

---

## Roadmap

This is a high level view of the upcoming releases for Vaadin Core Elements. The nearest releases are more likely to include what is stated here, but further plans have a higher risk of changing.

Individual elements of the Core Elements bundle are released separately, and you can track their progress from their relevant milestones (TBA). The bundle version is released once all individual element milestones for it are finished.

You can see more detailed roadmaps of each element from their respective GitHub repositories.

#### Version 1.0
- [`<vaadin-grid>`](https://github.com/vaadin/vaadin-grid) 1.0
- [`<vaadin-combo-box>`](https://github.com/vaadin/vaadin-combo-box) 1.0
- [`<vaadin-date-picker>`](https://github.com/vaadin/vaadin-date-picker) 1.0
- [`<vaadin-upload>`](https://github.com/vaadin/vaadin-upload) 1.0
- [`<vaadin-icons>`](https://github.com/vaadin/vaadin-icons) 1.0

#### Next up
- [`<vaadin-combo-box>`](https://github.com/vaadin/vaadin-combo-box) 1.x
 - More customization options for the input element
 - Dropdown item templates
- [`<vaadin-date-picker>`](https://github.com/vaadin/vaadin-date-picker) 1.x
 - More customization options for the input element
 - Keyboard input
- New elements in planning: `<vaadin-context-menu>`, `<vaadin-form-layout>`, `<vaadin-details>`

##### Version labels

On top of the common version numbering (major.minor.patch) Vaadin uses labels to indicate the maturity of a version.

*Examples: `1.0.0-alpha2`, `1.0.0-beta4`, `1.0.0-rc1`*

- **Alpha**: A snapshot mainly to gather feedback from users. All features and implementation details are still subject to change.

- **Beta**: Feature-complete release of the upcoming version. The API should no longer change, but small improvements can be made. No changes in functionality are to be expected.

- **RC**: Also known as "release candidate". Only bug fixes can be expected to happen before the stable version.

All of the maturity tags can be suffixed with a number, so for example "rc2" is the second release candidate of a certain version.

## Contributing

We would absolutely love to get the community involved, and we welcome any form of contributions – comments and questions on different communication channels, issues and pull request in the repositories, and anything that you build and share using our elements.

### Get in touch with the team

The chat and the forum category are dedicated channels for this project, while the Twitter, Facebook and G+ pages are common for all Vaadin related discussion (including the Java framework).

- [Chat](https://gitter.im/vaadin/vaadin-core-elements)
- [Forum](https://vaadin.com/forum/#!/category/9848927)
- [Twitter](https://twitter.com/vaadin)
- [Facebook](https://www.facebook.com/vaadin/)
- [G+](https://plus.google.com/communities/108116678608923665301)

### Some ways to help:

- **Test the elements and provide feedback**: We would love to hear your feedback on anything related to the elements, like features, API and design. The best way to start is by [trying them out](https://vaadin.com/docs/-/part/elements/elements-getting-started.html). And to get a quick response, either drop a question/comment on the chat or open an issue in GitHub.
- **Report bugs**: File issues for the elements in their respective GitHub projects. You can find links to them from https://vaadin.com/elements
- **Send pull requests**: If you want to contribute code, check out the development instructions below.

We encourage you to read the [contribution instructions by GitHub](https://guides.github.com/activities/contributing-to-open-source/#contributing) also.

## Development

Each element has it's own GitHub repository, where development is done. The vaadin-core-element project is just a top-level bundle without actual production code.

Familiarize yourself with the code and try to follow the same syntax conventions to make it easier for us to accept your pull requests.

The following instructions are common for all Vaadin core elements. **Replace `vaadin-combo-box` with any other element in the following examples**. Check the element readmes for any special development notes.

### Getting the code

1. Clone the element project from GitHub:
  
  ```shell
  $ git clone https://github.com/vaadin/vaadin-combo-box.git
  ```

2. Install [Node](https://nodejs.org/en/download/). It comes bundled with [npm](https://npmjs.com), which is needed to install other tooling.

3. Install [Bower](http://bower.io) using [npm](https://npmjs.com): 
  
  ```shell
  $ npm install -g bower
  ```
  
  > If you encounter permission issues when running `npm` see the article about [fixing npm permissions](https://docs.npmjs.com/getting-started/fixing-npm-permissions) on npmjs.com

4. Use Bower to install the dependencies of the element:
  
  ```shell
  $ cd vaadin-combo-box
  $ bower install
  ```

### Running demos

1. Install [polyserve](https://github.com/PolymerLabs/polyserve) using [npm](https://npmjs.com):
  
  ```shell
  $ npm install -g polyserve
  ```

2. Start a local server in the project root directory:
  
  ```shell
  $ cd vaadin-combo-box
  $ polyserve
  ```

3. Open the following URLs in your browser:
  - Demo: http://localhost:8080/components/vaadin-combo-box/demo/
  - Generated API documentation:  http://localhost:8080/components/vaadin-combo-box/

### Running tests

Install [Web Component Tester](https://github.com/Polymer/web-component-tester) using [npm](https://npmjs.com):
```shell
$ npm install -g web-component-tester
```

Tests can be run with the `wct` task from the element directory:

```shell
$ cd vaadin-combo-box
$ wct
```

You can also run and debug the tests manually:
```shell
$ cd vaadin-combo-box
$ polyserve
```
- Open http://localhost:8080/components/vaadin-combo-box/test/ in your browser.

You should include new tests in your pull requests if you add features to the elements or if you are fixing a bug.

### Documentation

We follow the same [style guide](http://polymerelements.github.io/style-guide/) as Polymer.

### Contributor License Agreement

When you send a pull request to any of our repositories, you get an automated comment response about the CLA. It will notify you if you haven’t signed the CLA yet, and in that case instructions how to do it. You need to do this once per earch repository. Before we can accept any of your code contributions, you need to sign the CLA.

## License

Apache License 2.0
