import {test, assetApiPost} from '../lib/asset-api-helper';
import documenter from '../lib/documenter';
import {projectRolesQueryByProject} from '../lib/projectroles-api-helper';

const types = ['yaml', 'json'];

for(const type of types) {
  const doc = documenter();
  doc.exampleName(`bulk/execute_Scope_AssignMemberWithRole_subquery`);
  const title = 'Execute Scope.AssignMemberWithRole operation using a subquery';
  doc.title(title);
  doc.type(type);
  doc.description("Demonstrates how to use a subquery to assign a single Member to a Scope along with a Scope-specific role the Member will have for the target Scope.");
  test(`${title} (${type})`, async t => {
      const setupCommand = `
from: Member
where:
 Name: scopeMember1
execute: Delete
---
AssetType: Scope
Name: Project for Members
Parent: Scope:0
BeginDate: ${new Date().toJSON()}
---
AssetType: Member
Name: scopeMember1
Password: scopeMember1
Nickname: scopeMember1
Username: scopeMember1
DefaultRole: Role.Name'Observer
`
      let res = await assetApiPost(setupCommand);
      t.is(res.status, 200, "Expected 200 OK");
      t.is(res.data.assetsCreated.count, 2, "Expected 2 Assets to be created");
      doc.setup(res, setupCommand);

      const [scopeOidToken, memberOidToken] = res.data.assetsCreated.oidTokens;

      const roleObserverOidToken = 'Role:8';
      const roleProjectLeadOidToken = 'Role:3';

      const commands = {
          yaml: `
from: ${scopeOidToken}
execute:
  op: AssignMemberWithRole
  args:
    Member:
      from: Member
      where:
        Username: scopeMember1
    Role:
      from: Role
      where:
        Name: Role.Name'Project Lead
    IsOwner: true
`,
          json: `
{
  "from": "${scopeOidToken}",
  "execute": {
    "op": "AssignMemberWithRole",
    "args": {
      "Member": {
        "from": "Member",
        "where": {
          "Username": "scopeMember1"
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

      const query = `where=ID='${scopeOidToken}'`
      const verifyExpectation = [
        {
          "isOwner": true,
          "member": {
            "oidToken": "Member:20",
            "name": "Administrator",
            "email": "",
            "defaultRole": {
              "oidToken": "Role:1",
              "name": "System Admin"
            }
          },
          "role": {
            "oidToken": "Role:1",
            "name": "System Admin"
          }
        },
        {
          "isOwner": true,
          "member": {
            "oidToken": `${memberOidToken}`,
            "name": "scopeMember1",
            "email": "",
            "defaultRole": {
              "oidToken": `${roleObserverOidToken}`,
              "name": "Observer"
            }
          },
          "role": {
            "oidToken": `${roleProjectLeadOidToken}`,
            "name": "Project Lead"
          }
        }
      ];

      const verificationResult = await projectRolesQueryByProject(query);
      const matches = verificationResult.data.assets[0].memberRoles.filter(m =>
        ["Member:20", memberOidToken].includes(m.member.oidToken)
      );
      t.is(matches.length, 2, "Expected 2 results");
      // Just force the email to be the same for crying out loud
      verifyExpectation[0].member.email = matches[0].member.email;
      t.deepEqual(matches, verifyExpectation);

      doc.request({ payload, responseObject: res,
        requestObservations: [
          "Notice that in the `args` property, the values for the `Member` and the `Role` properties are specified as subqueries. This makes it easier to create scripts which manipulate members and their project roles in the system using commonly shared values instead of having to separately query for oids first and then construct an HTTP request.",
          "Note that when using subqueries, only the very first query result will be used as the property value. This means you may need to use sorting to get the correct value if your subquery has a chance of returning more than one asset."
        ],
        responseObservations : [
        "Notice that the `assetsOperatedOn.oidTokens` array property contains a single scope token. This is because in this example we invoked the `Scope.AssignMemberWithRole` operation once on the scope for a single member."
      ]});
      doc.emit();
  });
}