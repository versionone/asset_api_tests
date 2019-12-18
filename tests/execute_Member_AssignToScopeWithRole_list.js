"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const asset_api_helper_1 = require("../lib/asset-api-helper");
const documenter_1 = require("../lib/documenter");
const projectroles_api_helper_1 = require("../lib/projectroles-api-helper");
const types = ['yaml', 'json'];
for (const type of types) {
    const doc = documenter_1.default();
    doc.exampleName(`bulk/execute_Member_AssignToScopeWithRole_list`);
    const title = 'Execute Member.AssignToScopeWithRole operation for list of scopes';
    doc.title(title);
    doc.type(type);
    doc.description("Demonstrates how to assign multiple scopes to a member along with scope-specific roles the member will have for each of the assigned scopes.");
    asset_api_helper_1.test(`${title} (${type})`, async (t) => {
        const setupCommand = `
from: Member
filter:
- Name='memberForScope1'
execute: Delete
---
from: Scope
filter:
- Name='Project 1 for Member.AssignToScopeWithRole','Project 2 for Member.AssignToScopeWithRole'
execute: Delete
---
AssetType: Scope
Name: Project 1 for Member.AssignToScopeWithRole
Parent: Scope:0
BeginDate: ${new Date().toJSON()}
---
AssetType: Scope
Name: Project 2 for Member.AssignToScopeWithRole
Parent: Scope:0
BeginDate: ${new Date().toJSON()}
---
AssetType: Member
Name: memberForScope1
Password: memberForScope1
Nickname: memberForScope1
Username: memberForScope1
DefaultRole: Role.Name'Observer
`;
        let res = await asset_api_helper_1.assetApiPost(setupCommand);
        t.is(res.status, 200, "Expected 200 OK");
        t.is(res.data.assetsCreated.count, 3, "Expected 3 Assets to be created");
        const [scope1OidToken, scope2OidToken, member1OidToken] = res.data.assetsCreated.oidTokens;
        doc.setup(res, setupCommand);
        const roleObserverOidToken = 'Role:8';
        const roleCustomerOidToken = 'Role:7';
        const roleProjectLeadOidToken = 'Role:3';
        const commands = {
            yaml: `
from: ${member1OidToken}
execute:
 op: AssignToScopeWithRole
 list:
 - Scope: ${scope1OidToken}
   Role: ${roleProjectLeadOidToken}
   IsOwner: true
 - Scope: ${scope2OidToken}
   Role: ${roleCustomerOidToken}
   IsOwner: false
`,
            json: `
{
  "from": "${member1OidToken}",
  "execute": {
    "op": "AssignToScopeWithRole",
    "list": [
      {
        "Scope": "${scope1OidToken}",
        "Role": "${roleProjectLeadOidToken}",
        "IsOwner": true
      },
      {
        "Scope": "${scope2OidToken}",
        "Role": "${roleCustomerOidToken}",
        "IsOwner": false
      }
    ]
  }
}
`
        };
        const payload = commands[type];
        res = await asset_api_helper_1.assetApiPost(payload, type);
        t.is(res.status, 200, "Expected 200 OK");
        t.is(res.data.assetsOperatedOn.count, 2, "Expected 2 Assets to be operated upon");
        const query = `where=ID="${member1OidToken}"`;
        const verifyExpectation = {
            "member": {
                "oidToken": `${member1OidToken}`,
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
                        "oidToken": `${scope1OidToken}`,
                        "name": "Project 1 for Member.AssignToScopeWithRole"
                    },
                    "role": {
                        "oidToken": `${roleProjectLeadOidToken}`,
                        "name": "Project Lead"
                    }
                },
                {
                    "isOwner": false,
                    "project": {
                        "oidToken": `${scope2OidToken}`,
                        "name": "Project 2 for Member.AssignToScopeWithRole"
                    },
                    "role": {
                        "oidToken": `${roleCustomerOidToken}`,
                        "name": "Customer"
                    }
                }
            ]
        };
        const verificationResult = await projectroles_api_helper_1.projectRolesQueryByMember(query);
        const projectRoles = verificationResult.data.assets[0].projectRoles;
        t.is(projectRoles.length, 2, "Expected 2 projectRoles");
        t.deepEqual(projectRoles, verifyExpectation.projectRoles);
        doc.request({ payload, responseObject: res, responseObservations: [
                "Notice that the `assetsOperatedOn.oidTokens` array property contains the same token twice. This is because in this example we invoked the `Member.AssignToScopeWithRole` operation on the same member, passing different scope oids each time."
            ] });
        doc.emit();
    });
}
//# sourceMappingURL=execute_Member_AssignToScopeWithRole_list.js.map