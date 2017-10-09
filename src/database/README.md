# Database Structure #

This project's database is implemented in PostgreSQL.

## Tables ##

### Calls ###

Contains information on calls to the San Antonio Police Department, including date of call, type of call, location and school/council district.


| PRIMARY id(int) | UNIQUE incidentNumber (varchar) | category (varchar) | problemType (varchar) | responseDate (timestamp) | address (varchar) | hoa (varchar) | schoolDistrict (varchar) | councilDistrict (int) | zipcode (int)

| ---    | ---    | ---   | ---   | ---  | ---    | ---   | ---   | ---   | ---   | 
| 1  | SAPD-2017-0937329  | Other Calls | Disturbance | 8/29/2017 12:00:04 AM | 2400 N St Mary's St. | The Tobin Hill Community Association | San Antonio ISD | 1 | 78212 
