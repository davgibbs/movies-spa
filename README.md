# movies-spa   [![Build Status](https://travis-ci.org/davgibbs/movies-spa.svg?branch=master)](https://travis-ci.org/davgibbs/movies-spa)
A small website to keep track of movies you have watched and rated.

The website is a Single Page Application that allows the user to add, edit and delete movies from the database. Each movie has an assocated image, genre and rating. Technologies such as Django, Django REST framework, AngularJS and Twitter Bootstrap are used.

Most of the Movie information was taken from http://www.imdb.com

## Developer Information
Need a virtualenv set up with requirement.txt dependencies installed. Then as with all Django projects, run the "migrate" command to create the database. After the "runserver" to see the base page. When developing it may be useful to run "gulp" in the root directory to re-fresh the page when and changes to static files are made. All AngularJS code is in the Django "static" directory.
