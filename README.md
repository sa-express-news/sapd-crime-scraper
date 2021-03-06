# SAEN San Antonio Police Department Call Scraper #

__STOP: Before you go any further, are you looking for a historical list of every call for service to the San Antonio police? Depending on who you are and what you want it for, we will probably give you this data! Scraping it from the SAPD site is incredibly time consuming, and we would rather you not tax their servers. Please reach out to us at datateam@express-news.net and we can probably save you the trouble!__

This scraper downloads every call for service recorded by the San Antonio Police Department in its [database of historical calls](http://www.sanantonio.gov/SAPD/Calls), which stretches back to 2011. It programmatically generates requests for each day, pushing every call into a PostgreSQL database that can then be dumped to CSV or used for other purposes.

## Getting Started ##

This scraper is not meant to be used as a command-line tool for extracting data for specific date ranges. As such, it does not take command line arguments. There are two NPM scripts provided in this repository:

- A script to scrape every call in the SAPD online database, excluding the current month and the previous month
- A script to scrape every call in the previous month.

The first script is meant to be used upon downloading this repository to get you up to date. The second can be automated with a `cron` job set to run near the end of every month.

(It takes a while for SAPD to update their online application, and it will throw errors if you attempt to access data that hasn't yet been added. You're generally safe grabbing the previous month's calls around the 20th, but you can always check their web form and see if it allows you to select those dates - that means the data has been updated).

For more information on why this scraper *is not and should not be used as a command-line tool*, see the ["How it Works"](#how-it-works) section below.

### Installation ###

Clone this repository to your machine:

`git clone https://github.com/sa-express-news/sapd-crime-scraper.git sapd-scraper/`

Enter the directory and install dependencies:

`cd sapd-scraper/`

`npm install`

### Building the Database ###

This application uses a PostgreSQL database to store complaints. Running the application test suite also requires you to set up a separate test database. This repo contains a shell script to populate the databases. Here's how to get everything working:

1. If your shell user doesn't yet have a PostgreSQL role, get to the `psql` command prompt and create one for it:

`su - postgres` 

`psql` (or `sudo -u postgres psql postgres`)

`CREATE ROLE yourname WITH CREATEDB LOGIN ENCRYPTED PASSWORD 'goodpassword';`

`\q`

2. Navigate to this project's root directory and run the `create_db.sh` script:

`./create_db.sh`

You should see the results of a SQL database creation script. (You can ignore the warnings about privileges for "public").

### Environment Variables ###

This scraper relies on environment variables to operate the database and test suite. To set up the environment variables on your machine, create a `.env` file in the project's root directory formatted like so:

```
DB_HOST=your_database_host
DB_PORT=your_database_port
DB=sapd
TEST_DB=sapd_test
DB_USER=your_db_user
DB_PASS=your_db_password
```
Do not check the `.env` file into version control.

## Running the Scraper ##

Before running the scraper, please see the note at the top of this README. We would rather not slam the San Antonio Police Department's servers with thousands of network requests. If you're just looking for a giant CSV of call data email us at `datateam@express-news.net` and we can probably send you ours.

To scrape all calls for the previous month:

`npm run start`

As mentioned above, this will throw an error if you run it before the SAPD web app has been updated. You're usually safe by the 20th of a given month to scrape the month prior.

On a basic home internet connection and not-great laptop, this process took about five minutes to complete.

To scrape all calls from 1/1/2011, excluding the current and previous month:

`npm run full-scrape`

On a basic home internet connection and not-great laptop, this process took about thirteen hours(!!!) to complete and consumed ~600MB of memory throughout the process. Seriously, try not to do it.

## How it Works ##

The [SAPD web application for historical calls for police service](http://www.sanantonio.gov/SAPD/Calls) leaves much to be desired. Users can select date ranges of a month at most, and querying by different school districts, city council districts or call type must be done one by one. It would probably a reasonably fast citizen a few hours to, say, compare the number of calls per council district in a six-month period.

Using the form triggers three HTTP requests to the SAPD server:

- A GET request to load the search form, which contains hidden fields tied to a user's session state.
- A POST request to send search parameters (and the session state).
- A GET request to the results page, which checks for the presence of a cookie that is tied to the session state and serves the requested data.

There's a big issue with sending those requests programmatically that, despite plenty of testing, we are not currently able to solve: Asking for more than a single day's worth of data will trigger a server error.

Therefore, if `n` is the number of days we want call data for, and `d` is the number of council districts we want the data for, fetching that data with the scraper will require `3nd` network requests.

This is an extremely expensive process even *before* factoring in database upserts for the hundreds of calls fetched with every request. That's why we designed this scraper to just get the data as easily as possible. From there, just query the database for what you need or dump it to a CSV and use a pivot table.

## Running Tests ##

There are two NPM test scripts included in this repository.

`npm run test` will test all code except the actual scraping function, setting up mock servers when necessary to avoid actual network tests.

`npm run test-full` does the above while also testing the code that actually pings the SAPD server. It runs three "sample scrapes" and asserts that the number of calls added to the test database matches the number one gets when running those same queries using the actual web form.

If you plan on automating monthly scrapes, we recommend also automating a monthly full test and sending the results to yourself a day or two before your scheduled scrape. This will ensure everything's working properly before getting another month's worth of data.

## Troubleshooting/Contributing ##

Run into errors scraping calls? Figure out a way to scrape multiple days' worth of data at once programmatically? Shoot us a note at `datateam@express-news.net`.