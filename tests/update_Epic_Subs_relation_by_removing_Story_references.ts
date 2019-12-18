import {test, assetApiPost} from '../lib/asset-api-helper';

const types = ['yaml', 'json'];

for(const type of types) {
    test(`Update Epic, changing its Subs relation by removing Story references (${type})`, async t => {
        const setupCommand = `
AssetType: Epic
Name: I have two Subs
Scope: Scope:0
Subs:
 - AssetType: Story
 - AssetType: Story
`
        let res = await assetApiPost(setupCommand);
        t.is(res.status, 200, "Expected 200 OK");
        t.is(res.data.assetsCreated.count, 3, "Expected 3 Assets to be created");
        const [epicOidToken, story1OidToken, story2OidToken] = res.data.assetsCreated.oidTokens;

        const commands = {
            yaml: `
from: ${epicOidToken}
update:
 Name: I have zero Subs
 Subs:
  '${story1OidToken}': remove
  '${story2OidToken}': remove
`,
            json: `
{
  "from": "${epicOidToken}",
  "update": {
    "Name": "I have zero Subs",
    "Subs": {
      "${story1OidToken}": "remove",
      "${story2OidToken}": "remove"
    }
  }
}
`
        };

        const payload = commands[type];

        res = await assetApiPost(payload, type);
        t.is(res.status, 200, "Expected 200 OK");
        t.is(res.data.assetsModified.count, 1, "Expected 1 Assets to be modified");

        const query = `
from: ${epicOidToken}
select:
- Name
- Subs
`;

        const verifyExpectation = [[
            {
              "Name": "I have zero Subs",
              "Subs": [],
              "_oid": `${epicOidToken}`,
            }
        ]];

        const verfication = await assetApiPost(query);
        t.deepEqual(verfication.data.queryResult.results, verifyExpectation);
    });
}