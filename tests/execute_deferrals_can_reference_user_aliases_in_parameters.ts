import {test, assetApiPost} from '../lib/asset-api-helper';

const targetScope = "Scope:0";

const commands = [
    {
      type: 'yaml',
      payload: `
from: Member
filter:
- Name='memberAlias1','memberAlias2'
execute: Delete
---
"@memberAlias1": 
 AssetType: Member
 Name: memberAlias1
 Password: memberAlias1
 Nickname: memberAlias1
 Username: memberAlias1
 DefaultRole: Role.Name'Observer
---
"@memberAlias2":
 AssetType: Member
 Name: memberAlias2
 Password: memberAlias2
 Nickname: memberAlias2
 Username: memberAlias2
 DefaultRole: Role.Name'Observer
---
"@deferred":
 from: ${targetScope}
 execute:
  op: AssignMemberWithRole
  list:
  - Member: "@memberAlias1"
    Role: Role:3
    IsOwner: false
  - Member: "@memberAlias2"   
    Role: Role:2
    IsOwner: true
`},
    {
     type: 'json',
     payload: `
[
  {
    "from": "Member",
    "filter": [
      "Name='memberAlias1','memberAlias2'"
    ],
    "execute": "Delete"
  },
  {
    "@memberAlias1": {
      "AssetType": "Member",
      "Name": "memberAlias1",
      "Password": "memberAlias1",
      "Nickname": "memberAlias1",
      "Username": "memberAlias1",
      "DefaultRole": "Role.Name'Observer"
    }
  },
  {
    "@memberAlias2": {
      "AssetType": "Member",
      "Name": "memberAlias2",
      "Password": "memberAlias2",
      "Nickname": "memberAlias2",
      "Username": "memberAlias2",
      "DefaultRole": "Role.Name'Observer"
    }
  },
  {
    "@deferred": {
      "from": "Scope:0",
      "execute": {
        "op": "AssignMemberWithRole",
        "list": [
          {
            "Member": "@memberAlias1",
            "Role": "Role:3",
            "IsOwner": false
          },
          {
            "Member": "@memberAlias2",
            "Role": "Role:2",
            "IsOwner": true
          }
        ]
      }
    }
  }
]`
}];

for(const command of commands) {
    test(`Execute deferrals can reference user-supplied aliases in parameters (${command.type})`, async t => {

        let res = await assetApiPost(command.payload, command.type);
        t.is(res.status, 200, "Expected 200 OK");
        t.is(res.data.assetsCreated.count, 2, "Expected 2 Assets to be created");
        const assetsOperatedOnCount = res.data.assetsOperatedOn.count;        
        t.true(assetsOperatedOnCount > 0, "Expected to operate on some Assets");
        let opIndex1 = 0;
        let opIndex2 = 1;
        t.true(assetsOperatedOnCount === 2 || assetsOperatedOnCount === 4, "Expected to operate on exactly 2 or 4 Member assets. Maybe you have a stray member named memberAlias1 or memberAlias2 hanging around?");
        if (assetsOperatedOnCount === 4) {
          opIndex1 = 2;
          opIndex2 = 3;
        }
        t.is(res.data.assetsOperatedOn.oidTokens[opIndex1], targetScope);
        t.is(res.data.assetsOperatedOn.oidTokens[opIndex2], targetScope);
    });
}