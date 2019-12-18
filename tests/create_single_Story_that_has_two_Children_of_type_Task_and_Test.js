"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const asset_api_helper_1 = require("../lib/asset-api-helper");
const commands = [
    {
        type: 'yaml',
        payload: `
AssetType: Story
Name: My Awesome Story with Children
Description: Oh, trust me it's awesome
Scope: Scope:0
Children:
- AssetType: Test
  Name: What good is a Task?
  Description: A test is always the first thing to think of
- AssetType: Task
  Name: If it has no Test?
  Description: But if you don't do the work, it never gets done
`
    },
    {
        type: 'json',
        payload: `
{
  "AssetType": "Story",
  "Name": "My Awesome Story with Children",
  "Description": "Oh, trust me it's awesome",
  "Scope": "Scope:0",
  "Children": [
    {
      "AssetType": "Test",
      "Name": "What good is a Task?",
      "Description": "A test is always the first thing to think of"
    },
    {
      "AssetType": "Task",
      "Name": "If it has no Test?",
      "Description": "But if you don't do the work, it never gets done"
    }
  ]
}
`
    }
];
for (const command of commands) {
    asset_api_helper_1.test(`Create single Story that has two Children, of type Task and Test (${command.type})`, async (t) => {
        const res = await asset_api_helper_1.assetApiPost(command.payload, command.type);
        t.is(res.status, 200, "Expected 200 OK");
        t.is(res.data.assetsCreated.count, 3, "Expected 3 Assets to be created");
        const [storyOidToken, testOidToken, taskOidToken] = res.data.assetsCreated.oidTokens;
        const query = `
from: ${storyOidToken}
select:
- Name
- Description
- from: Children
  select:
  - Name
  - Description
  - ID
`;
        const verifyExpectation = [
            [
                {
                    "_oid": storyOidToken,
                    "Name": "My Awesome Story with Children",
                    "Description": "Oh, trust me it's awesome",
                    "Children": [
                        {
                            "_oid": testOidToken,
                            "Name": "What good is a Task?",
                            "Description": "A test is always the first thing to think of",
                            "ID": {
                                "_oid": testOidToken
                            }
                        },
                        {
                            "_oid": taskOidToken,
                            "Name": "If it has no Test?",
                            "Description": "But if you don't do the work, it never gets done",
                            "ID": {
                                "_oid": taskOidToken
                            }
                        }
                    ]
                }
            ]
        ];
        const verfication = await asset_api_helper_1.assetApiPost(query);
        t.deepEqual(verfication.data.queryResult.results, verifyExpectation);
    });
}
//# sourceMappingURL=create_single_Story_that_has_two_Children_of_type_Task_and_Test.js.map