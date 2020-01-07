## Set up the `heroku-github` project

Set up a copy of the `heroku-github` project as described in `README.md`.
The only difference is that you will deploy the `postgres` branch.

You can either fork a new project, OR update your existing forked project with the `postgres` branch.

## Set up pgewb

- Make sure you're logged in to Heroku
- Go to https://elements.heroku.com/buttons/sosedoff/pgweb
  - Click on the `Deploy on Heroku` button
- Pick a name for your new app e.g. `bbys-teals-2019-example-pgweb`
  - Click on the `Deploy app` button
  - This will also create a database
- `Manage` your app
  - Go to the `Settings` tab
  - Click `Reveal Config Vars` to reveal the username and password you'll need to log in to pgweb
  - Click on `Open App` (upper right) to launch pgweb
    - provide username (`admin`) and password
- Go back to Heroku and click on the pgweb app's `Resources` tab to find the `Heroku Postgres` database and what it is attached as
  - Click on `Attached as DATABASE` to reveal an option to `Attach to another app`
  - Attach to a version of the `heroku-github` project from the `postgres` branch

## Populating example data sources

After pgweb is set up and the database is connected to both apps, you will need to re-deploy the `heroku-github` app.
When deployment is done, view the app and navigate to the `/listdb` endpoint.
Click on one of the sample databases to load it.

Once the database is loaded, it can be viewed with pgweb.
  
## Heroku free plan limits

Heroku postgres is the only database available unless a credit card is associated with your account.

The free Heroku postgres database is limited to 10,000 rows across all tables.

## Links

### References

- https://elements.heroku.com/buttons/sosedoff/pgweb
- https://node-postgres.com/api/client
- https://devcenter.heroku.com/articles/heroku-postgresql#sharing-heroku-postgres-between-applications

### Data sources

- https://github.com/catherinedevlin/opensourceshakespeare
  - http://www.opensourceshakespeare.org/views/plays/playmenu.php?WorkID=macbeth
- https://github.com/pthom/northwind_psql