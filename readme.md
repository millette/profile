# A dat profile site

Implements <https://github.com/beakerbrowser/beaker/wiki/Protocol:-Profile-Sites> thru [profile.json](profile.json).

## Access to this profile

### Direct access
Using the key ```26620b74b6878c872ff243a151974aad5d52349bda12a02c19098421fce8bef4```:

*  <dat://26620b74b6878c872ff243a151974aad5d52349bda12a02c19098421fce8bef4/>

### Shortname
A shortname is provided by <https://hashbase.io>, ```profile-millette.hashbase.io```:

*  <dat://profile-millette.hashbase.io/>
*  <https://profile-millette.hashbase.io/>

## Protocols
This profile is available over two protocols, dat and https.

### https
Good old https provides access to any web browser but you're not permitted to use any of the dat APIs.

### dat
Dat can be accessed with the dat cli and with the Beaker Browser.

With Beaker, you get the full interactive experience, having full access to the dat APIs.

## Access Matrix

```
            protocol
URL       | https           | dat
---       | -----           | ---
shortname | https-shortname | dat-shortname
key       | N/A             | dat-key
```

### https-shortname (any browser)
Offer to redirect to dat-shortname if typeof beaker === 'object' && typeof DatArchive === 'undefined'.

Over https, the browser (even Beaker) doesn't provide the dat APIs. This means we can't write to the dat, even if we are the owner.

We can't read from the dat either, but we can use window.fetch() to read the same files over https. We can't enumerate the files, however.

### dat-shortname (beaker browser)
This should be the canonical URL.

### dat-key (beaker browser)
Offer to redirect to dat-shortname (since typeof DatArchive === 'object').

## Utilities

### Using Beaker?
```js
navigator.appVersion.indexOf('BeakerBrowser/') !== -1
```

### Using dat?
```js
typeof DatArchive !== 'undefined'
```
