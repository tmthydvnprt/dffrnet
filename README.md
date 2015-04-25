site_template
=============

Description
-----------

blank site template with master branch and gh-pages orphan branch

###Branches

* `master` branch is root of developement 
* `gh-pages` branch is for web access

Setup
-----

This repo was created with the instructions from [Creating Project Pages manually](https://help.github.com/articles/creating-project-pages-manually/).

After cloning blank repo run

    $ git checkout --orphan gh-pages
    $ # Creates our branch, without any parents (it's an orphan!)
    $ # Switched to a new branch 'gh-pages'

    $ git rm -rf .
    $ # Remove all files from the old working tree
    $ # rm '.gitignore'

    $ echo "My Page" > index.html
    $ git add index.html
    $ git commit -a -m "First pages commit"
    
then push back with

    $ git push origin gh-pages

or sync back with GitHub app

Using the Template
------------------

Duplicate the template following the instructions from [Duplicating a repository](https://help.github.com/articles/duplicating-a-repository/).

Create new duplicate repo with all bracnhes

    $ git clone --bare https://github.com/exampleuser/old-repository.git
    $ # Make a bare clone of the repository

    $ cd old-repository.git
    $ git push --mirror https://github.com/exampleuser/new-repository.git
    $ # Mirror-push to the new repository

    $ cd ..
    $ rm -rf old-repository.git
    $ # Remove our temporary local repository
