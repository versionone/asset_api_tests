# VersionOne api/asset Tests (Tombstoned)
Contains documentation, examples, and automated tests for the VersionOne api/asset endpoint (Bulk API)

## Requirements

* [VersionOne Enterprise](https://community.versionone.com/Release-Notes-and-Downloads) >= 19.2
* Node.js

## Setup

First, type:

```
npm install
```
## Documentation

See [docs](docs) for a comprehensive guide on how to use the API.

## Running tests

If you have VersionOne installed at `http://localhost/VersionOne.Web` and you want to execute all tests, you can just type:

```
npm test
```

If you have a different URL against which you'd like to run the tests, then type:

```
V1_URL=http://host/instance npm test
```

To run just a single test, but at the default location, type:

```
npm test -- tests/test_file_name.js
```

Finally, if you want to run a single test at a custom location, type:

```
V1_URL=http://host/instance npm test -- tests/test_file_name.js
```
