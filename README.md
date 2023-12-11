# .github

This repository is for GitHub Actions workflows shared amongst all the project repositories in the organization.

## pa11y-ci workflow
This repository is a standalone GitHub Action that automates the process of running Pa11y accessibility tests on other Project Portal repositories. Pa11y helps ensure that your web pages are accessible to everyone, including those with disabilities. 

This GitHub Action integration is designed to be imported into other repositories to perform Pa11y accessibility checks on pull requests in those repositories. Please refer [here](https://github.com/thepolicylab-projectportals/example-content/blob/main/.github/workflows/pa11y-ci.yml) to see how the Github Action is integrated into the Example Content Project Portal project. The same is done for all other Project Portal sites.

The `on: pull_request` trigger ensures that the Pa11y checks are executed whenever a pull request is opened or updated. The integration utilizes the Pa11y Accessibility Test GitHub Action, providing a seamless and automated way to validate the accessibility of web applications during the pull request review process.

