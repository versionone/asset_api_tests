import {test, assetApiPost} from '../lib/asset-api-helper';
import documenter from '../lib/documenter';
import {projectRolesQueryByMember} from '../lib/projectroles-api-helper';

const types = ['yaml', 'json'];

for(const type of types) {
  const doc = documenter();
  doc.exampleName(`bulk/execute_Member_AssignToScopeWithRole_subquery`);
  const title = 'Execute Member.AssignToScopeWithRole operation using a subquery';
  doc.title(title);
  doc.type(type);
  doc.description("Demonstrates how to use a subquery to assign a single scope to a member along with a scope-specific role the member will have for assigned scope.");
  test(`${title} (${type})`, async t => {
      const setupCommand = `
from: Member
filter:
- Name='memberForSubqueryScope'
execute: Delete
---
from: Scope
filter:
- Name='Subquery project for Member.AssignToScopeWithRole'
execute: Delete
---
AssetType: Scope
Name: Subquery project for Member.AssignToScopeWithRole
Parent: Scope:0
BeginDate: ${new Date().toJSON()}
---
AssetType: Member
Name: memberForSubqueryScope
Password: memberForSubqueryScope
Nickname: memberForSubqueryScope
Username: memberForSubqueryScope
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
  Scope:
    from: Scope
    where:
     Name: Subquery project for Member.AssignToScopeWithRole
  Role:
    from: Role
    where:
     Name: Role.Name'Project Lead
  IsOwner: true
`,
            json: `
{
  "from": "${memberOidToken}",
  "execute": {
    "op": "AssignToScopeWithRole",
    "args": {
      "Scope": {
        "from": "Scope",
        "where": {
          "Name": "Subquery project for Member.AssignToScopeWithRole"
        }
      },
      "Role": {
        "from": "Role",
        "where": {
          "Name": "Role.Name'Project Lead"
        }
      },
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
            "name": "memberForSubqueryScope",
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
                "name": "Subquery project for Member.AssignToScopeWithRole"
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

        doc.request({ payload, responseObject: res,
          requestObservations: [
          "Notice that in the `args` property, the values for the `Scope` and the `Role` properties are specified as subqueries. This makes it easier to create scripts which manipulate members and their project roles in the system using commonly shared values instead of having to separately query for oids first and then construct an HTTP request.",
          "Note that when using subqueries, only the very first query result will be used as the property value. This means you may need to use sorting to get the correct value if your subquery has a chance of returning more than one asset."
        ],
          responseObservations : [
          "Notice that the `assetsOperatedOn.oidTokens` array property contains a single member token. This is because in this example we invoked the `Member.AssignToScopeWithRole` operation once on the member for a single scope."
        ]});
        doc.emit();
    });
}