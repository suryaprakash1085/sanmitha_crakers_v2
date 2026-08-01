import db from "../db";

export interface RoleRow {
  id: string;
  name: string;
  description: string;
  permissions: string | object;
}

export interface AssignmentRow {
  email: string;
  role_id: string;
}

export const RoleAccessModel = {
  async getRoles(): Promise<RoleRow[]> {
    const rows = await db("admin_roles").select("*").orderBy("created_at", "asc");
    return rows.map((r) => ({
      ...r,
      permissions: typeof r.permissions === "string" ? JSON.parse(r.permissions) : r.permissions,
    }));
  },

  async upsertRole(role: { id: string; name: string; description: string; permissions: object }): Promise<void> {
    const exists = await db("admin_roles").where({ id: role.id }).first();
    const permJson = JSON.stringify(role.permissions);
    if (exists) {
      await db("admin_roles").where({ id: role.id }).update({
        name: role.name,
        description: role.description,
        permissions: permJson,
        updated_at: db.fn.now(),
      });
    } else {
      await db("admin_roles").insert({
        id: role.id,
        name: role.name,
        description: role.description,
        permissions: permJson,
      });
    }
  },

  async deleteRole(id: string): Promise<void> {
    await db("admin_role_assignments").where({ role_id: id }).delete();
    await db("admin_roles").where({ id }).delete();
  },

  async replaceAllRoles(roles: { id: string; name: string; description: string; permissions: object }[]): Promise<void> {
    await db.transaction(async (trx) => {
      // Keep only roles in the new list; remove orphaned assignments first
      const newIds = roles.map((r) => r.id);
      await trx("admin_role_assignments").whereNotIn("role_id", newIds).delete();
      await trx("admin_roles").whereNotIn("id", newIds).delete();
      for (const role of roles) {
        const exists = await trx("admin_roles").where({ id: role.id }).first();
        const permJson = JSON.stringify(role.permissions);
        if (exists) {
          await trx("admin_roles").where({ id: role.id }).update({
            name: role.name,
            description: role.description,
            permissions: permJson,
            updated_at: db.fn.now(),
          });
        } else {
          await trx("admin_roles").insert({
            id: role.id,
            name: role.name,
            description: role.description,
            permissions: permJson,
          });
        }
      }
    });
  },

  async getAssignments(): Promise<AssignmentRow[]> {
    return db("admin_role_assignments").select("email", "role_id");
  },

  async replaceAllAssignments(assignments: { email: string; roleId: string }[]): Promise<void> {
    await db.transaction(async (trx) => {
      await trx("admin_role_assignments").delete();
      if (assignments.length > 0) {
        await trx("admin_role_assignments").insert(
          assignments.map((a) => ({ email: a.email, role_id: a.roleId }))
        );
      }
    });
  },
};
