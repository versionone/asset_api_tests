import {test, assetApiPost} from '../lib/asset-api-helper';

const commands = [
  {
    type: 'yaml',
    payload: `
"@scope":
 AssetType: Scope
 Name: Scope for Regression Test
 Parent: Scope:0
 BeginDate: 12/31/2019
---
"@plan":
 AssetType: RegressionPlan
 Name: Plan
 Scope: "@scope"
---
"@suite":
 AssetType: RegressionSuite
 RegressionPlan: "@plan"
 Name: Regression Suite
---
AssetType: RegressionTest
Name: Regression Test 1
Scope: "@scope"
RegressionSuites: "@suite"
---
AssetType: RegressionTest
Name: Regression Test 2
Scope: "@scope"
RegressionSuites: "@suite"
---
"@test-set":
 AssetType: TestSet
 Name: New TestSet
 Scope: "@scope"
 RegressionSuite: "@suite"
---
"@copy":
 from: "@test-set"
 execute: CopyAcceptanceTestsFromRegressionSuite
---
from: "@test-set"
select:
 - Name
 - Scope
 - from: RegressionSuite
   select:
   - RegressionPlan
 - from: Children:Test
   select:
   - Name
   - GeneratedFrom
   - Status
`},
  {
    type: 'json',
    payload: `
[
  {
    "@scope": {
      "AssetType": "Scope",
      "Name": "Scope for Regression Test",
      "Parent": "Scope:0",
      "BeginDate": "12/31/2019"
    }
  },
  {
    "@plan": {
      "AssetType": "RegressionPlan",
      "Name": "Plan",
      "Scope": "@scope"
    }
  },
  {
    "@suite": {
      "AssetType": "RegressionSuite",
      "RegressionPlan": "@plan",
      "Name": "Regression Suite"
    }
  },
  {
    "AssetType": "RegressionTest",
    "Name": "Regression Test 1",
    "Scope": "@scope",
    "RegressionSuites": "@suite"
  },
  {
    "AssetType": "RegressionTest",
    "Name": "Regression Test 2",
    "Scope": "@scope",
    "RegressionSuites": "@suite"
  },
  {
    "@test-set": {
      "AssetType": "TestSet",
      "Name": "New TestSet",
      "Scope": "@scope",
      "RegressionSuite": "@suite"
    }
  },
  {
    "@copy": {
      "from": "@test-set",
      "execute": "CopyAcceptanceTestsFromRegressionSuite"
    }
  },
  {
    "from": "@test-set",
    "select": [
      "Name",
      "Scope",
      {
        "from": "RegressionSuite",
        "select": [
          "RegressionPlan"
        ]
      },
      {
        "from": "Children:Test",
        "select": [
          "Name",
          "GeneratedFrom",
          "Status"
        ]
      }
    ]
  }
]
`
  }];

for(const command of commands) {
    test(`Example compound request to generate RegressionPlan down to TestSet and Tests (${command.type})`, async t => {
      const res = await assetApiPost(command.payload, command.type);
      t.is(res.status, 200, "Expected 200 OK");
      t.is(res.data.assetsCreated.count, 6, "Expected 6 Assets to be created");
      const [scopeOidToken, regressionPlanOidToken, regressionSuiteOidToken,
            regressionTest1OidToken, regressionTest2OidToken, testSetOidToken] = res.data.assetsCreated.oidTokens;

      t.is(res.data.assetsModified.count, 0, "Expected 0 Assets to be modified");
      t.is(res.data.assetsOperatedOn.count, 1, "Expected 1 Asset to be operated on");
      t.is(res.data.assetsOperatedOn.oidTokens[0], testSetOidToken, `Expected ${testSetOidToken} to be operated on`);
      t.is(res.data.commandFailures.count, 0, "Expected 0 command failures to occur");

      t.is(res.data.queryResult.count, 1, "Expected 1 query result set");
      const resultSet = res.data.queryResult.results[0];
      const testSet = resultSet[0];
      t.is(testSet._oid, testSetOidToken);
      t.is(testSet.Name, "New TestSet");
      t.is(testSet.Scope._oid, scopeOidToken);
      t.is(testSet.RegressionSuite.length, 1, "Expected 1 RegressionSuite reference on the TestSet");

      const regressionSuite = testSet.RegressionSuite[0];
      t.is(regressionSuite._oid, regressionSuiteOidToken);
      t.is(regressionSuite.RegressionPlan._oid, regressionPlanOidToken);

      const children = testSet["Children:Test"];
      t.is(children.length, 2, "Expected 2 Children:Test results on the TestSet");

      const test1 = children[0];
      t.is(test1.Name, "Regression Test 1");
      t.is(test1.GeneratedFrom._oid, regressionTest1OidToken);

      const test2 = children[1];
      t.is(test2.Name, "Regression Test 2");
      t.is(test2.GeneratedFrom._oid, regressionTest2OidToken);
    });
}