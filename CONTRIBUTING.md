## Contributing

Dear contributor, we are glad that you want to improve our product. Our products have high quality requirements, all the changes should satisfy those as well.

To submit a PR follow these minimum requirements:

  - Make sure your code is compliant with our code linters: `gulp lint`
  - Check that tests are passing: `polymer test`
  - [Submit a pull request](https://www.digitalocean.com/community/tutorials/how-to-create-a-pull-request-on-github) with detailed title and description
  - Wait for response from one of Vaadin components team members

We will review the PR and make a decision on it.

### Advanced requirements

Advanced requirements affect the PR handling time. The more requirements are met, the sooner PR will be merged. Otherwise, we will take care of those missing parts in case of PR approvement.

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

  - Live Demo with a code example demonstarting the feature
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
    - theming parts / state attributes are exposed
    - documented
    - covered with visual tests (optional)

  - I18n compatible

  - RTL (optional)

