site_template
=============

Description
-----------

blank site template with master branch and gh-pages orphan branch

###Branches

* `master` branch is root of developement 
* `gh-pages` branch is for web access

This repo was created with the instructions from [Creating Project Pages manually](https://help.github.com/articles/creating-project-pages-manually/)

after cloning blank repo run:

    $ git checkout --orphan gh-pages
    $ # Creates our branch, without any parents (it's an orphan!)
    $ # Switched to a new branch 'gh-pages'

    $ git rm -rf .
    $ # Remove all files from the old working tree
    $ # rm '.gitignore'

    $ echo "My Page" > index.html
    $ git add index.html
    $ git commit -a -m "First pages commit"
    
then push back with :

    $ git push origin gh-pages

or sync back with GitHub app
