import {test, assetApiPost} from '../lib/asset-api-helper';

const commands = [
    {
        type: 'yaml',
        payload: `
AssetType: Story
Name: My Story
Scope: System (All Projects)
`
    },
    {
        type: 'json',
        payload: `
{
  "AssetType": "Story",
  "Name": "My Story",
  "Scope": "System (All Projects)"
}
`
    }
];

for(const command of commands) {
    test(`Create single Story with Scope referenced by Name (${command.type})`, async t => {
        const res = await assetApiPost(command.payload, command.type);

        t.is(res.status, 200, "Expected 200 OK");
        t.is(res.data.assetsCreated.count, 1, "Expected 1 Asset to be created");

        const [assetOidToken] = res.data.assetsCreated.oidTokens;

        const query = `
from: ${assetOidToken}
select:
- Name
- Scope.Name
`;

        const verifyExpectation = [[{
            "_oid": assetOidToken,
            "Name": "My Story",
            "Scope.Name": "System (All Projects)"
        }]];

        const verfication = await assetApiPost(query);
        t.deepEqual(verfication.data.queryResult.results, verifyExpectation);
    });
}