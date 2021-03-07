# rohberg.expertsearch

This is a Plone Classic add-on.

See the awsome Plone CMS at https://plone.org.

## Installation

Install rohberg.expertsearch by adding it to your buildout::

    [buildout]

    ...

    eggs =
        rohberg.expertsearch


and then running ``bin/buildout``

Compile Svelte code:

    cd rohberg.expertsearch/svelte_src/my-svelte-app
    npm install
    npm run build -- --environment API_URL:https://devplone.zhkath.ch/relaunch-fachstellen/spitalseelsorge/,PORTAL_TYPE:zhkathauthor

with API_URL and PORTAL_TYPE according to your installation.

Paste `<div class="my-svelte-app expertsearch" />` in one of your pages to see the expert search.

## Contribute

- Issue Tracker: https://github.com/collective/rohberg.expertsearch/issues
- Source Code: https://github.com/collective/rohberg.expertsearch
- Documentation: https://docs.plone.org/foo/bar


## License

The project is licensed under the GPLv2.
