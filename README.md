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
    npm run build -- --environment API_URL:https://www.mydomain.ch/,PORTAL_TYPE:expert

with API_URL and PORTAL_TYPE according to your installation.

Paste `<div class="rohberg-expertsearch-svelte-app" />` in one of your pages to see the expert search.

## Contribute

- Issue Tracker: https://github.com/rohberg/rohberg.expertsearch/issues
- Source Code: https://github.com/rohberg/rohberg.expertsearch


## License

The project is licensed under the GPLv2.
