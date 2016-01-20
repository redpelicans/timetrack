# timetrack [![Build Status](https://travis-ci.org/redpelicans/timetrack.svg)](https://travis-ci.org/redpelicans/timetrack)

## Context

Timetrack will be the main tool for [redpelicans](http://www.redpelicans.com) to manage our consultants, clients, and produce invoices but it's also a training plateform for our junior consultants to learn how to craft a web application made of ReactJS, a flux implementation (Reflux here), FRP (Kefir), NodeJS, MongoDB and Docker.
 
Beyond librairies or products selected to build timetrack, the target is to find and teach good practices for web application design:
 
* how to design stable, optimized http requests between front and server
* how to draw a clear separation of concern between front and server
* how to minimize requests between client and server
* how to manage relationships between model's entities (Client / Person / Mission)
* how to cache/store data locally
* how to design a reactive client made of stores or streams
* how to build forms effectively
* how to reuse React components
* how to offer good rendering performances
* how to manage css
* how to be responsive 
* which UI toolkit to use with ReactJS
* how to render natively
* and so on ....


It's an open source project, so you are welcome to collaborate, produce code or blogs and challenge us ...

Timetrack is in its early stage (version 0.2), its actually a POC, tomorrow a CRM Lite, after tomorrow a training plate form and after after tomorrow the basement for redpelicans information system and may be one day a market place to match Javascrip client's requirements with redpelicans offer.

* we have a simplistic MongoDB model: Client and Person
* NodeJS offers CRUD http requests for the model
* we use a first version of [Formo](https://github.com/redpelicans/formo) to manage forms
* Reflux stores sounds to be properly organized to be the basement of the upcoming product
* web app begins to be responsive ...

## Next Steps 

* Write tests
* Use Authentification *(DONE)*
* Go live for first version (CRM Lite)  *(DONE)*
* write documentation
* Add features (Missions, Works, Invoices)
* Enrich CRM Lite version
* Extend Formo features
* Be native
* Offer disconnected CRUD functionalities
* continuous deployment

## Setup

    $ npm install -g babel gulp
    $ npm install
    $ npm test

## Launch server

setup `params.js` then launch:

    $ gulp
