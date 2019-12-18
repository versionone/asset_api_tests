import {axios} from './api-helper';

const projectRolesQueryByProject = async (query : string) =>
    axios.get(`/api/ProjectRoles/ByProject?${query}`, { timeout: 180000 });

const projectRolesQueryByMember = async (query : string) =>
    axios.get(`/api/ProjectRoles/ByMember?${query}`, { timeout: 180000 });

export { 
    projectRolesQueryByProject,
    projectRolesQueryByMember
}