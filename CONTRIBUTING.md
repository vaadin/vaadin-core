## Proccess of contributing and creating a pull request

Dear contributor, we are glad that you would like to improve our product. We are working hard on implementing the fixes/improvements you are providing.  
Unfortunately we are not able to apply all of the changes right away as all of our products have high quality requirements.  
We are interested in all ideas that you are providing: either it is a small bug fix or a new feature implementation. You are able to submit a PR following these minimum requirements:

  - Make sure your code is compliant with our code linters: `gulp lint`
  - Check that tests are passing: `polymer test`
  - [Submit a pull request](https://www.digitalocean.com/community/tutorials/how-to-create-a-pull-request-on-github) with detailed title and description
  - Wait for response from one of Vaadin components team members

We will review the PR as soon as possible and make a decision on it.  
As for the time before merging it, it depends on the number of advanced requirements provided below. The more requirements are met, the bigger are the chances PR will be merged in the nearest future. Otherwise, we will need to take care of those missing parts, schedule those in our roadmap and probably handle DX/UX testing sessions.

### Advanced requirements:

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

  - Live Demo with a code example demonstarting the feature (inc. webcomponents.org element demo)
    - Not required for a bug fix

  - Documented
    - parts
    - elements
    - events
    - attributes exposed for styling
    - new API's

  - Accessible

  - Visuals are themable:
    - **Supports both lumo and material themes**
    - theming parts / state attributes are exposed
    - documented
    - covered with visual tests (optional)

  - I18n compatible

  - RTL (optional)

