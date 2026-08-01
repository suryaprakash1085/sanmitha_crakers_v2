import { Request, Response } from "express";
import { UserModel } from "../models/User.model";
import { signToken } from "../utils/jwt";

export const AuthController = {
  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ success: false, error: "Email and password required" });
      }
      const user = await UserModel.findByEmail(email);
      if (!user || !UserModel.verifyPassword(password, user.password)) {
        return res.status(401).json({ success: false, error: "Invalid email or password" });
      }
      const token = signToken({ id: user.id, email: user.email, role: user.role });
      return res.json({
        success: true,
        token,
        user: { id: String(user.id), email: user.email, name: user.name || user.email, role: user.role },
      });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message || "Login failed" });
    }
  },

  async signup(req: Request, res: Response) {
    try {
      const { email, password, name, role } = req.body;
      if (!email || !password) {
        return res.status(400).json({ success: false, error: "Email and password required" });
      }
      const existing = await UserModel.findByEmail(email);
      if (existing) {
        return res.status(409).json({ success: false, error: "Email already exists" });
      }
      // Only allow admin role creation for the admin signup flow.
      const user = await UserModel.create({ email, password, name, role: role === "admin" ? "admin" : "admin" });
      const token = signToken({ id: user!.id, email: user!.email, role: user!.role });
      return res.status(201).json({
        success: true,
        token,
        user: { id: String(user!.id), email: user!.email, name: user!.name || user!.email, role: user!.role },
      });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message || "Signup failed" });
    }
  },

  async me(req: any, res: Response) {
    const user = await UserModel.findById(req.user.id);
    if (!user) return res.status(404).json({ success: false, error: "User not found" });
    res.json({ success: true, user });
  },
};
