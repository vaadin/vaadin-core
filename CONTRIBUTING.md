## Contributing

Dear contributor, we are glad that you want to improve our product. Our products have high quality requirements, all the changes should satisfy those as well.

Each Vaadin component has it's own GitHub repository, where development is done. The `vaadin-core` project is just a top-level bundle without actual production code.
Familiarize yourself with the code and try to follow the same syntax conventions to make it easier for us to accept your pull requests.

The following instructions are common for all Vaadin components.

### Submitting a Pull Request

To submit a PR follow these minimum requirements:

  - Make sure your code is compliant with our code linters: `gulp lint`
  - Check that tests are passing: `polymer test`
  - [Submit a pull request](https://www.digitalocean.com/community/tutorials/how-to-create-a-pull-request-on-github) with detailed title and description
  - Wait for response from one of Vaadin components team members

We will review the PR and make a decision on it.

### Advanced requirements

Advanced requirements affect the PR handling time. The more requirements are met, the sooner PR will be merged.
Otherwise, we will take care of those missing parts in case of PR approvement.

  - Minimal API to fulfill the requirements of the idea

  - 100% coverage with automated tests
    - Should pass on each supported platform (desktop/mobile):
      - Chrome (latest, any platform)
      - Firefox (latest, any platform)
      - Safari (latest, any platform)
      - Edge (latest, any platform)
      - IE11 (any platform)
      - iOS Safari (9, latest, any platform)
      - Chrome on Android (latest, any platform)

  - Live Demo with a code example demonstrating the feature
    - Not required for a bug fix

  - Documented
    - visual parts
    - elements
    - events
    - attributes exposed for styling
    - public properties and methods

  - Accessible

  - Visuals are themable:
    - **Supports both lumo and material themes**
    - themable parts / state attributes are exposed
    - documented
    - covered with visual tests (optional)

  - I18n compatible

  - RTL (optional)

### Converting from HTML Imports to ES modules

Vaadin components use HTML Imports in the mainline codebase. In order to use a Vaadin component
as ES module, the codebase has to be converted first.

Follow these steps to perform the ES modules conversion of a Vaadin component.

```shell
# Install global dependencies
$ npm install -g polymer-modulizer magi-cli yarn polymer-cli

# Commit any changes, make sure your local repository is clean
$ git status

$ magi p3-convert --out . --import-style=name

# Install component dependencies from npm using yarn
$ yarn install --flat

# Run development server
$ polymer serve --npm
```

- Open http://localhost:8081/components/@vaadin/vaadin-combo-box/test/ for the tests

Note: replace `vaadin-combo-box` with the actual component in the above example.

When done, return back to the HTML Imports codebase using git:

```shell
$ git reset --hard HEAD^ && git clean -df
```

### Contributing to ES module components

To contribute into Polymer 3 Vaadin components, make your changes
on the mainline Polymer 2 codebase, then open a pull request targeting
the master branch.

Note: unlike the official Polymer Elements, the converted Polymer 3 compatible
Vaadin components are only published on npm, not pushed to GitHub repositories.

### Contributor License Agreement

When you send a pull request to any of our repositories, you get an automated comment response about the CLA.
It will notify you if you haven’t signed the CLA yet, and in that case instructions how to do it.
You need to do this once per each repository. Before we can accept any of your code contributions, you need to sign the CLA.
