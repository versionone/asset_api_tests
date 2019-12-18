# How do I run these tests?
You can run these end-to-end functional tests by cloning this repo and then doing the following:

```
cd automation
npm install
LIFECYCLE_URL=http://yourhost/instance npm test -- lifecycle/feature_tests/asset_api
```
