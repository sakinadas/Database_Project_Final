# Starbox

A project done for completion of the course TCSS-545 at UW, Tacoma.

This project aims to mimic the user-facing portion of a coffee-house chain.

This project has been implemented in NodeJS, using Express.js as the web framework, and connects to a MySQL instance
in the cloud. The DB connection information can be found under `db/config.json`.

## Folder structure

* `db/`
  * `schema.sql`: This file contains the SQL statements necessary for creating the SQL schema for the project, as well as the SQL statements which insert
  a good number of intial data into this database.
  * `config.json`: This file contains the database configuration used for connecting to the MySQL instance
* `adapters/`: This folder contais JavaScript wrappers for database operations. This is the only place where SQL statements are written in conjunction with
JavaScript code.
* `routes/`: This is where the adapters are bound to RESTful endpoints via ExpressJS to allow for interaction with the database via HTTP requests.
* `public/`: This folder contains an AngularJS application which uses the REST endpoints defined above to compose the UI.

## Installation

### Requirements

You will need to install `nmp` on your machine. Instructions can be found [here](https://www.npmjs.com/get-npm).

### Installing the application

To install the application, download the code or clone this repository. Then, run the following:

````bash
npm install
````

This will fetch all project dependencies.

### Running the server

To run the server, you can run the following:

````bash
npm start
````

This will start the application on port `3000` on your local. Point your browser to http://localhost:3000 to view the application.

## Using the application

Once you start the application, you will see a menu. This menu is a list of all items offered at every location of the fictional *Starbox* chain.

You can either click on an **offering type** or the **offering** itself to get more results. Alternateively, you can search for an offering by
its name, type, tags associated with it, or its ingredients, or a combination of these criteria, via the "Search" page.

The search result page will present you with a list of offerings. Each offering has its own detailed page which will tell you more about what that
offering is, what ingredients it has, what tags are associated with it, and which locations serve that offering.

All of these details are then clickable to help you navigate to similar offerings.

When you click on a location, the location will be expanded to give you more insight into where it is (including a Google map of the location),
as well as a localized menu (including offering sizes and prices) for that location.
