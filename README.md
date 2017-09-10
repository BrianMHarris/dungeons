#'Dungeons' - Working Title

##About
This web app acts as a portal for designers and hobbyists to display their ideas in the form of short, digestible demos.

Over the 11 years I spent in the game industry, I must have had hundreds of ideas for small games, gameply ideas, or simple systems but never had the means to properly prototype them. I chose to start this site to give myself a good place to collect my ideas, and hopefully one day, allow others to share interesting ideas of their own.

In early stages of development, many features are planned such as a submission process, overhaul of general design of the site, and many other small improvements that will make the site more user-friendly.

As for the single demo currently available, it has quite a long way to go but should be playable in the very near future! Tons of updates and optimizations incoming.

##Getting Started
Follow these instructions to get a copy of this project running on your local machine.

###Prerequesites
Dependencies are listed in requirements.txt.

###Installing
- Install Python, PostgreSQL
- Make a virtual environment: mkvirtualenv <name>
- Make the 'dungeons-database' DB: createdb dungeons-database
- Install requirements: pip install -r requirements.txt
- Upgrade the databse to set up DB tables: python manage.py db upgrade

###Testing
In development

##Built With
- [JavaScript]()
- [Python]()
- [Flask](http://flask.pocoo.org/)
- [Flask Modus](https://github.com/rhyselsmore/flask-modus)
- [Flask Login](https://flask-login.readthedocs.io/en/latest/)
- [Flask-WTF](https://flask-wtf.readthedocs.io/en/stable/)
- [Flask-SQLAlchemy](http://flask-sqlalchemy.pocoo.org/2.1/)
- [Bootstrap 3](http://bootstrapdocs.com/v3.0.3/docs/css/)
- HTML5/CSS
- [jQuery](https://jquery.com/)
- [postgres](https://www.postgresql.org/)

##Author
- Brian Harris

##License
This project is licensed under the MIT License.

Copyright 2017 Brian Harris

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
