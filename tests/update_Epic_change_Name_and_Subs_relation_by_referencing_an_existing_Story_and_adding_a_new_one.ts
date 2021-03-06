import {test, assetApiPost} from '../lib/asset-api-helper';

const types = ['yaml', 'json'];

for(const type of types) {
    test(`Update Epic, changing its Name and Subs relation, referencing an existing Story and adding a new one (${type})`, async t => {
        const setupCommand = `
AssetType: Story
Name: I am not related to any Epic
Scope: Scope:0
---
AssetType: Epic
Name: I have no Subs yet
Scope: Scope:0
`
        let res = await assetApiPost(setupCommand);
        t.is(res.status, 200, "Expected 200 OK");
        t.is(res.data.assetsCreated.count, 2, "Expected 2 Assets to be created");
        const [story1OidToken, epicOidToken] = res.data.assetsCreated.oidTokens;

        const commands = {
            yaml: `
from: ${epicOidToken}
update:
 Name: I should now be related to ${story1OidToken} and another new Story via the Subs relation
 Subs:
 - ${story1OidToken}
 - AssetType: Story
   Name: I am a brand new Story, related to ${epicOidToken}
`,
            json: `
{
  "from": "${epicOidToken}",
  "update": {
    "Name": "I should now be related to ${story1OidToken} and another new Story via the Subs relation",
    "Subs": [
      "${story1OidToken}",
      {
        "AssetType": "Story",
        "Name": "I am a brand new Story, related to ${epicOidToken}"
      }
    ]
  }
}
`
        };

        const payload = commands[type];

        res = await assetApiPost(payload, type);
        t.is(res.status, 200, "Expected 200 OK");
        t.is(res.data.assetsModified.count, 1, "Expected 1 Assets to be modified");
        t.is(res.data.assetsCreated.count, 1, "Expected 1 Asset to be created");
        const [storyNewOidToken] = res.data.assetsCreated.oidTokens;

        const query = `
from: ${epicOidToken}
select:
- Name
- from: Subs
  select:
  - Name
`;

        const verifyExpectation = [[
            {
              "_oid": `${epicOidToken}`,
              "Name": `I should now be related to ${story1OidToken} and another new Story via the Subs relation`,
              "Subs": [
                {
                  "_oid": `${story1OidToken}`,
                  "Name": "I am not related to any Epic"
                },
                {
                  "_oid": `${storyNewOidToken}`,
                  "Name": `I am a brand new Story, related to ${epicOidToken}`
                }
              ]
            }
        ]];

        const verfication = await assetApiPost(query);
        t.deepEqual(verfication.data.queryResult.results, verifyExpectation);
    });
}