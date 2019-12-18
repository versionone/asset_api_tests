import {test, assetApiPost} from '../lib/asset-api-helper';
import documenter from '../lib/documenter';
import {projectRolesQueryByMember} from '../lib/projectroles-api-helper';

const types = ['yaml', 'json'];

for(const type of types) {
  const doc = documenter();
  doc.exampleName(`bulk/execute_Member_AssignToScopeWithRole_single`);
  const title = 'Execute Member.AssignToScopeWithRole operation for single scope';
  doc.title(title);
  doc.type(type);
  doc.description("Demonstrates how to assign a single scope to a member along with a scope-specific role the member will have for assigned scope.");
  test(`${title} (${type})`, async t => {
      const setupCommand = `
from: Member
filter:
- Name='memberForSoloScope'
execute: Delete
---
from: Scope
filter:
- Name='Solo project for Member.AssignToScopeWithRole'
execute: Delete
---
AssetType: Scope
Name: Solo project for Member.AssignToScopeWithRole
Parent: Scope:0
BeginDate: ${new Date().toJSON()}
---
AssetType: Member
Name: memberForSoloScope
Password: memberForSoloScope
Nickname: memberForSoloScope
Username: memberForSoloScope
DefaultRole: Role.Name'Observer
`;
        let res = await assetApiPost(setupCommand);
        t.is(res.status, 200, "Expected 200 OK");
        t.is(res.data.assetsCreated.count, 2, "Expected 2 Assets to be created");
        const [scopeOidToken, memberOidToken] = res.data.assetsCreated.oidTokens;

        doc.setup(res, setupCommand);

        const roleObserverOidToken = 'Role:8';
        const roleProjectLeadOidToken = 'Role:3';

        const commands = {
            yaml: `
from: ${memberOidToken}
execute:
 op: AssignToScopeWithRole
 args:
  Scope: ${scopeOidToken}
  Role: ${roleProjectLeadOidToken}
  IsOwner: true
`,
            json: `
{
    "from": "${memberOidToken}",
    "execute": {
        "op": "AssignToScopeWithRole",
        "args": {
            "Scope": "${scopeOidToken}",
            "Role": "${roleProjectLeadOidToken}",
            "IsOwner": true
        }
      }
}
`
        };

        const payload = commands[type];

        res = await assetApiPost(payload, type);

        t.is(res.status, 200, "Expected 200 OK");
        t.is(res.data.assetsOperatedOn.count, 1, "Expected 1 Asset to be operated upon");

        const query = `where=ID='${memberOidToken}'`
        const verifyExpectation =
        {
          "member": {
            "oidToken": `${memberOidToken}`,
            "name": "memberForScope1",
            "email": "",
            "defaultRole": {
              "oidToken": `${roleObserverOidToken}`,
              "name": "Observer"
            }
          },
          "projectRoles": [
            {
              "isOwner": true,
              "project": {
                "oidToken": `${scopeOidToken}`,
                "name": "Solo project for Member.AssignToScopeWithRole"
              },
              "role": {
                "oidToken": `${roleProjectLeadOidToken}`,
                "name": "Project Lead"
              }
            }
          ]
        };

        const verificationResult = await projectRolesQueryByMember(query);
        const projectRoles = verificationResult.data.assets[0].projectRoles;
        t.is(projectRoles.length, 1, "Expected 1 projectRole");
        t.deepEqual(projectRoles, verifyExpectation.projectRoles);

        doc.request({ payload, responseObject: res, responseObservations : [
          "Notice that the `assetsOperatedOn.oidTokens` array property contains a single member token. This is because in this example we invoked the `Member.AssignToScopeWithRole` operation once on the member for a single scope."
        ]});
        doc.emit();
    });
}