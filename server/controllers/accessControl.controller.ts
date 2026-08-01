import { Request, Response } from "express";
import { RoleAccessModel } from "../models/RoleAccess.model";

export const AccessControlController = {
  // ── Roles ──────────────────────────────────────────────────────────────────

  async getRoles(_req: Request, res: Response) {
    try {
      const rows = await RoleAccessModel.getRoles();
      const roles = rows.map((r) => ({
        id: r.id,
        name: r.name,
        description: r.description,
        permissions: typeof r.permissions === "string" ? JSON.parse(r.permissions) : r.permissions,
      }));
      res.json({ success: true, data: roles });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  },

  async replaceRoles(req: Request, res: Response) {
    try {
      const roles = req.body;
      if (!Array.isArray(roles)) {
        return res.status(400).json({ success: false, error: "Expected array of roles" });
      }
      await RoleAccessModel.replaceAllRoles(roles);
      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  },

  // ── Assignments ────────────────────────────────────────────────────────────

  async getAssignments(_req: Request, res: Response) {
    try {
      const rows = await RoleAccessModel.getAssignments();
      const assignments = rows.map((r) => ({ email: r.email, roleId: r.role_id }));
      res.json({ success: true, data: assignments });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  },

  async replaceAssignments(req: Request, res: Response) {
    try {
      const assignments = req.body;
      if (!Array.isArray(assignments)) {
        return res.status(400).json({ success: false, error: "Expected array of assignments" });
      }
      await RoleAccessModel.replaceAllAssignments(assignments);
      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  },
};
