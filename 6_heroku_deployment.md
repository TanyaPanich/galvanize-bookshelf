#### [⇐ Previous](5_user_authorization.md) | [Next ⇒](README.md)

# Heroku Deployment

In this assignment, you'll deploy your database-driven application to Heroku.

Refer to the steps below. I also made a little video going through the process:
https://vimeo.com/207720558

## Pre-deployment

First, complete the following pre-deployment steps.
1. Create a Heroku app called `USERNAME-galvanize-bookshelf` where `USERNAME` is your GitHub username in lowercase form.
heroku create tpanich-galvanize-bookshelf
1. Generate a cryptographic key for the JWT signature and set it to the `JWT_KEY` config variable of the new Heroku app.
First, create JWT_KEY:
bash -c 'echo "JWT_KEY="$(openssl rand -base64 64)'
Second, set it:
heroku config:set JWT_KEY=lalalala
1. Update the `package.json` file with a dependency to a specific Node.js version.
1. Enable the Heroku PostgreSQL add-on for the new Heroku app.
heroku addons:create heroku-postgresql:hobby-dev
1. Update the `knexfile.js` file with the `production` database connection information.
production: {
  client: 'pg',
  connection: process.env.DATABASE_URL
}
1. Update the `package.json` file with a `heroku-postbuild` script to migrate the production database.
"scripts": {
  "heroku-postbuild": "knex migrate:latest",
1. Remember that you have two choices for specifying what script to run to start your server: procfile (https://devcenter.heroku.com/articles/getting-started-with-nodejs#define-a-procfile) or the start script in package.json (if no procfile is found). In this repo nodemon is devDependency which will not be included in the default heroku environment.
1. Add and commit the changes to your local git repository.
1. Push the changes to the `master` branch on GitHub.

## Deployment

Next, complete the following deployment steps.

1. Push the changes to the `master` branch on Heroku.
1. Seed the production database with `npm run knex seed:run` as a one-off Heroku command.
heroku run bash
npm run knex seed:run
exit
1. Visit the Heroku app at `https://USERNAME-galvanize-bookshelf.herokuapp.com/`. (or heroku open)
1. If the application isn't working, check the production logs with `heroku logs`.
in separate terminal while deploying run:
 heroku logs -t
1. Otherwise, celebrate with a beverage of choice!

## Post-deployment

Finally, complete the following post-deployment steps.

1. Add `https://USERNAME-galvanize-bookshelf.herokuapp.com/` to your Github repository's URL.
1. Fix any test errors, including bonus tests, with `npm test`. Note that this at the moment can only be run in your local environment.
1. Fix any linting errors with `npm run lint .`.
1. Submit your solution for grading.

## Bonus

Use the [Heroku Scheduler](https://devcenter.heroku.com/articles/scheduler) add-on to seed the production database with `npm run knex seed:run` every hour.

## Bonus

Once you're satisfied, find a classmate and see if that person would like some help.

#### [⇐ Previous](5_user_authorization.md) | [Next ⇒](README.md)
