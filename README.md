# GitHub and Heroku

uwu uwu 

In this lab, we're going to connect GitHub to Heroku and use Heroku to deploy our code.

We'll end up with a web server implemented in NodeJS which will serve files in the `public` folder.
Because we're running NodeJS, this can eventually be _more_ than a web server - it can also serve generated content.

When we're done, we will have a very basic web "application" that can be accessed from the internet.

## Fork this repository

First, `fork` this repository.
You can do this by clicking on the `Fork` button on the upper right of the GitHub page.

Forking a repository creates a clone of the repository that you control.
In fact, this clone shares the same history as the original, even down do the git hashes.
Later, we'll see why this is useful.

Note that _after_ your fork a repository, anything you do is disconnected from the original - any changes you make won't automatically be available to the original repository.

## Create a Heroku account

Heroku is a service that can run code written in different languages.
One of the languages that it supports is Javascript through a server-side application called NodeJS.

Go to https://signup.heroku.com/ and create a new account (if you don't have one already).
Select `Node.js` as your `Primary development language *`.

## Connect Heroku with GitHub

After you're set up, create a new app from the dashboard: https://dashboard.heroku.com/apps .
Give it a name (e.g. `bbys-teals-2019-example`) and click `Create App`.

From the next page (e.g. https://dashboard.heroku.com/apps/bbys-teals-2019-example/deploy/heroku-git), choose `Github` as the `Deployment method` (middle section).

This will reveal options to `Connect to Github` in the third section of the page.
Click `Connect to GitHub`.
Once you do that, you will get a popup where you can let GitHub `Authorize heroku`.

The third section will then contain a text box where you can fill in the `repo name`.

Type in the name of your repo (e.g. `heroku-github`) and click `Connect`.

## Deploy your changes to Heroku

Once GitHub is connected, you can click `Deploy Branch` any time to deploy your GitHub repository.
Or, `Enable Automatic Deploys`.

Click on `Deploy Branch` and wait for Heroku to:
- Receive Code from GitHub
- Build `master`
- Release phase
- Deploy to Heroku

uwu uwu

Click the `Settings` button to bring you to a page like, e.g. https://dashboard.heroku.com/apps/bbys-teals-2019-example/settings.
About halfway down this page in the `Domains` section, you will find a link to your app on the internet, e.g. https://bbys-teals-2019-example.herokuapp.com/.

Clicking on that link will bring you to your new Heroku app.
If you had previously already clicked the `Deploy Branch` button, you should see a demo page.

## Modify files in `public`

Now that you have control of a repository that is deployed to Heroku and available to the internet, go ahead and modify the git repository.

For example, change the files in the `public` folder and then `git add`, `git commit` and `git push` your changes.
The `public` folder is currently configured to serve static files by name.

Once your changes are pushed to GitHub, go back to Heroku and `Deploy Branch` again.
If everything is working properly, you will see your changes in GitHub, but also deployed to your app in Heroku.

Hopefully, you can see how GitHub and Heroku are integrated by now. Try replacing the files in the `public` folder with your minesweeper game!

uwu uwu
