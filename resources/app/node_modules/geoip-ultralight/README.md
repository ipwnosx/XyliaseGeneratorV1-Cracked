# geoip-ultralight

An even lighter alternative to geoip-lite and libGeoIP wrappers. It provides
country data for IP addresses based on the GeoLite data from MaxMind. It does
not provide city, state or region data. Forked from geoip-lite.

[![Build Status](https://travis-ci.org/danielstjules/geoip-ultralight.svg?branch=master)](https://travis-ci.org/danielstjules/geoip-ultralight)

## Why

Unlike other geoip libraries for node, geoip-lite and geoip-ultralight don't
require compiling `libGeoIP`; they're JavaScript implementations. While neither
offer the full functionality of `geoip`, they're significantly faster.

`geoip-lite` is fairly light already, boasting 6 microsecond lookups for IPv4
addresses, and 30 microsecond lookups for IPv6 on a Macbook Pro. However, it
ships over 60MB of data for handling city/region names, and thus introduces
significant memory overhead. If all you want is country data, and not
city/regions, then that's a lot of RAM for unused functionality.

Instead, `geoip-ultralight` includes under 2MB of data, and has negligible
memory consumption. If all you need is to identify countries, this will work
perfectly with your Digital Ocean or AWS micro instances.

## Installation

It can be installed via `npm` using:

``` bash
npm install --save geoip-ultralight
```

## Usage

``` javascript
var geoip = require('geoip-ultralight');

// Unlike geoip-lite's lookup() call, geoip-ultralight exposes
// a lookupCountry() function to avoid confusion
var ip = "207.97.227.239";
geoip.lookupCountry(ip); // => "US"
```

## API

geoip-ultralight is completely synchronous. There are no callbacks involved.
All blocking file IO is done at startup time, so runtime calls are executed
quickly in memory. Startup may take up to 200ms while reading and indexing
files into memory.

### lookupCountry

The function accepts IP addresses in dotted quad notation, IPv6 colon notation,
as well as 32bit unsigned integers (treated as IPv4). Note that any square
brackets should be removed from IPv6 addresses beforehand.

``` javascript
var country = geoip.lookupCountry(ip);
```
If the IP address was found, `lookupCountry` returns a
[2 letter ISO-3166-1](http://www.maxmind.com/app/iso3166)
country code. Otherwise it returns null.

### pretty

Given a 32bit unsigned integer, `pretty` will return a human readable string
equivalent.

``` javascript
geoip.pretty(ip);
```

The function returns a string if the format was recognized, otherwise it returns
the original input.

### startWatchingDataUpdate

When invoked, the server will watch the data directory for changes and reload
the in-memory geo data as necessary.

```javascript
geoip.startWatchingDataUpdate();
```

This can be used along with `npm run-script updatedb` to periodically update
geo data on a running server.

### stopWatchingDataUpdate

Stops the server from watching the data dir for updates.

```javascript
geoip.stopWatchingDataUpdate();
```

## Built-in Updater

The package contains an update script that can pull geo data from MaxMind and
handle the necessary conversions into a compatible format.

```shell
npm run-script updatedb
```
