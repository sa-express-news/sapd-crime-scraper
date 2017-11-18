# SAEN San Antonio Police Department Call Scraper #

This is a still-in-progress scraper to download every call recorded by the San Antonio Police Department in its [database of historical calls](http://www.sanantonio.gov/SAPD/Calls), which stretches back to 2011. It programmatically generates requests for each day, pushing every call into a database that can then be dumped to CSV or used for other purposes.

## Getting Started ##

### Building the Database ###

This application uses a PostgreSQL database to store complaints. Running the application test suite also requires you to set up a separate test database. This repo contains a shell script to populate the databases. Here's how to get everything working:

1. If your shell user doesn't yet have a PostgreSQL role, get to the `psql` command prompt and create one for it:

`su - postgres` 
`psql`
(or `sudo -u postgres psql postgres`)
`CREATE ROLE yourname WITH CREATEDB LOGIN ENCRYPTED PASSWORD 'goodpassword';`
`\q`

2. Navigate to this project's root directory and run the `create_db.sh` script:

`./create_db.sh`

You should see the results of a SQL database creation script. (You can ignore the warnings about privileges for "public").

### Environment Variables ###

This scraper relies on environment variables to operate the database, test suite and other utilities like the ability to email new complaints out once per day. To set up the environment variables on your machine, create a `.env` file in the project's root directory formatted like so:

```
DB_HOST=your_database_host
DB_PORT=your_database_port
DB=sapd
TEST_DB=sapd_test
DB_USER=your_db_user
DB_PASS=your_db_password
```
