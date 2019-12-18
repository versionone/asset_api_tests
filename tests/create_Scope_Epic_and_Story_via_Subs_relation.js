"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const asset_api_helper_1 = require("../lib/asset-api-helper");
const commands = [
    {
        type: 'yaml',
        payload: `
AssetType: Scope
Name: Test - Create Scope, Epic, and Story via Subs relation Scope
Parent: Scope:0
BeginDate: ${new Date().toJSON()}
Workitems:
- AssetType: Epic
  Name: Epic name
  Description: Epic description
  Subs:
  - AssetType: Story
    Name: My own name
    Description: My own description
  - AssetType: Story
  - AssetType: Story
    Name: Story with Children
    Description: Story with Children that has its own Description
    Children:
    - AssetType: Task
      Name: A Task
    - AssetType: Test
      Name: A Test
`
    },
    {
        type: 'json',
        payload: `
{
  "AssetType": "Scope",
  "Name": "Test - Create Scope, Epic, and Story via Subs relation Scope",
  "Parent": "Scope:0",
  "BeginDate": "${new Date().toJSON()}",
  "Workitems": [
    {
      "AssetType": "Epic",
      "Name": "Epic name",
      "Description": "Epic description",
      "Subs": [
        {
          "AssetType": "Story",
          "Name": "My own name",
          "Description": "My own description"
        },
        {
          "AssetType": "Story"
        },
        {
          "AssetType": "Story",
          "Name": "Story with Children",
          "Description": "Story with Children that has its own Description",
          "Children": [
            {
              "AssetType": "Task",
              "Name": "A Task"
            },
            {
              "AssetType": "Test",
              "Name": "A Test"
            }
          ]
        }
      ]
    }
  ]
}`
    }
];
for (const command of commands) {
    asset_api_helper_1.test(`Create Scope, Epic, and Story via Subs relation (${command.type})`, async (t) => {
        let res = await asset_api_helper_1.assetApiPost(command.payload, command.type);
        t.is(res.status, 200, "Expected 200 OK");
        t.is(res.data.assetsCreated.count, 7, "Expected 7 Assets to be created");
        const [scopeOidToken, epicOidToken, story1OidToken, story2OidToken, story3OidToken, taskOidToken, testOidToken] = res.data.assetsCreated.oidTokens;
        const query = `
from: Story
where:
 Scope: ${scopeOidToken}
select:
- Name
- Description
- from: Children
  select:
  - Name
`;
        const verifyExpectation = [[
                {
                    "_oid": `${story1OidToken}`,
                    "Name": "My own name",
                    "Description": "My own description",
                    "Children": []
                },
                {
                    "_oid": `${story2OidToken}`,
                    "Name": "Epic name",
                    "Description": "Epic description",
                    "Children": []
                },
                {
                    "_oid": `${story3OidToken}`,
                    "Name": "Story with Children",
                    "Description": "Story with Children that has its own Description",
                    "Children": [
                        {
                            "_oid": `${taskOidToken}`,
                            "Name": "A Task"
                        },
                        {
                            "_oid": `${testOidToken}`,
                            "Name": "A Test"
                        }
                    ]
                }
            ]];
        const verfication = await asset_api_helper_1.assetApiPost(query);
        t.deepEqual(verfication.data.queryResult.results, verifyExpectation);
    });
}
//# sourceMappingURL=create_Scope_Epic_and_Story_via_Subs_relation.js.map