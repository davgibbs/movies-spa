# movies-spa   [![Build Status](https://travis-ci.org/davgibbs/movies-spa.svg?branch=master)](https://travis-ci.org/davgibbs/movies-spa)
A small website to keep track of movies you have watched and rated.

The website is a Single-Page Application that allows the authenticated user to add, edit and delete their movies from the database. Non-authenticated users can only view the movies. Each movie has an associated image, genre and rating. Technologies such as Django, Django REST framework, AngularJS and Twitter Bootstrap are used.

Most of the Movie information was taken from http://www.imdb.com

![Movies Gallery Image](https://github.com/davgibbs/movies-spa/blob/master/apps/movies/static/movies/images/david-loggedin.png)

## Developer Information
Need a virtualenv set up with requirements.txt dependencies installed:
```bash
    $ virtualenv -python=/usr/bin/python3.5 py35
    $ source py35/bin/activate
    $ pip install -r requirements.txt
```
Then as with all Django projects, run the "migrate" command to create the database. Also create a superuser with your own username and password:
```bash
    $ python manage.py migrate
    $ python manage.py createsuperuser
    $ python manage.py runserver
```
After the "runserver" to see the base page above (with no movies added yet). You will need to add 'Movie Genres' using the Django admin ('/admin/') before adding your first movie using the front-end.

When developing it may be useful to run "gulp" in the root directory to re-fresh the page when and changes to static files are made. All AngularJS code is in the Django "static" directory.
