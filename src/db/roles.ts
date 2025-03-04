import { IRole } from "../types/IRole";

export enum ROLES_ENUM {
  EMPLOYEE_ROLE = "employee",
  ADMIN_ROLE = "admin",
  MANAGER_ROLE = "manager"
}

export const DEFAULT_ROLE = ROLES_ENUM.EMPLOYEE_ROLE;

const ROLES: IRole[] = [
  {
    name: ROLES_ENUM.ADMIN_ROLE,
    level: 0,
    permissions: [
      "create_record",
      "read_record",
      "update_record",
      "delete_record"
    ]
  },
  {
    name: ROLES_ENUM.MANAGER_ROLE,
    level: 1,
    permissions: ["create_record", "read_record", "update_record"]
  },
  {
    name: ROLES_ENUM.EMPLOYEE_ROLE,
    level: 2,
    permissions: ["create_record", "read_record"]
  }
];

export const RoleRepository = Object.freeze({
  getRoleByName(name: string) {
    return ROLES.find(role => role.name === name);
  },

  getRoles() {
    return ROLES;
  },
  getPermissionsByRoleName(roleName: string) {
    const role = ROLES.find(r => r.name === roleName);
    return role ? role.permissions : [];
  },
  getRoleLevelByRoleName(roleName: string) {
    const role = ROLES.find(r => r.name === roleName);
    return role ? role.level : 9999;
  }
});
