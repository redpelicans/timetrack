# timetrack [![Build Status](https://travis-ci.org/redpelicans/timetrack.svg)](https://travis-ci.org/redpelicans/timetrack)

## Context  

Timetrack will be the main tool for [redpelicans](http://www.redpelicans.com) to manage our consultants, clients, and produce invoices but it's also a training platform for our junior consultants to learn how to craft a web application made of ReactJS, a flux implementation (Redux here), FRP (Kefir), NodeJS, MongoDB and Docker.
 
Beyond librairies or products selected to build timetrack, the target is to find and teach good practices for web application design: 
 
* how to design stable, optimized http requests between front and server
* how to draw a clear separation of concern between front and server
* how to minimize requests between client and server
* how to manage relationships between model's entities (Client / Person / Mission / Agenda / Invoices / ...)
* how to cache/store data locally
* how to design a reactive client made of stores or streams
* how to build forms effectively
* how to reuse React components
* how to offer good rendering performances
* how to manage css
* how to be responsive 
* which UI toolkit to use with ReactJS
* how to render natively
* how to push server side events
* how to crash isomorphic rendering
* and so on ....


It's an open source project, so you are welcome to collaborate, produce code or blogs and challenge us ...

Timetrack is in its early stage, it was a POC, now a CRM Lite and a training platform and after tomorrow the basement for redpelicans information system and may be one day a market place to match Javascript client's requirements with redpelicans offer.

* we have a entity MongoDB model: Client, Person, Agenda, Events, Invoices, ...
* NodeJS offers CRUD http requests and computational services over the model
* we use [Formo](https://github.com/redpelicans/formo) to manage forms
* Redux to manage the event side of our SPA
* web app begins to be responsive ...
* an android version should arrive very soon ...

## Next Steps 

* Write tests (react, redux, server side) *(IN PROGRESS)*
* Use Authentification for web, socketio, isomorphic code and android *(IN PROGRESS)*
* Go live for first version (CRM Lite)  *(DONE)*
* write documentation
* Add features 
* Enrich CRM Lite version
* Extend Formo features
* Be native *(IN PROGRESS)*
* Offer disconnected CRUD functionalities
* continuous deployment (DONE)

## Setup

    $ npm install -g yarn feathers-cli
    $ yarn install
    $ yarn test

## Launch server

setup `params.js` then launch:

    $ gulp
