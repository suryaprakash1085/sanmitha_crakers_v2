import { Request, Response } from "express";
import nodemailer from "nodemailer";
import { EmailSettingsModel } from "../models/EmailSettings.model";

const toRow = (body: any) => ({
  smtp_host: body.smtpHost,
  smtp_port: Number(body.smtpPort) || 587,
  smtp_user: body.smtpUser,
  smtp_pass: body.smtpPass,
  from_name: body.fromName,
  from_email: body.fromEmail,
  secure: !!body.secure,
});

const toClient = (row: any) =>
  row && {
    smtpHost: row.smtp_host || "",
    smtpPort: row.smtp_port || 587,
    smtpUser: row.smtp_user || "",
    smtpPass: row.smtp_pass || "",
    fromName: row.from_name || "",
    fromEmail: row.from_email || "",
    secure: !!row.secure,
  };

export const EmailSettingsController = {
  // GET /api/email-settings
  async get(_req: Request, res: Response) {
    const row = await EmailSettingsModel.get();
    res.json({ success: true, data: toClient(row) });
  },

  // POST /api/email-settings  (creates the singleton row if it doesn't exist yet)
  async create(req: Request, res: Response) {
    const row = await EmailSettingsModel.create(toRow(req.body));
    res.status(201).json({ success: true, data: toClient(row) });
  },

  // PUT /api/email-settings  (updates the singleton row, creating it if missing)
  async update(req: Request, res: Response) {
    const row = await EmailSettingsModel.update(toRow(req.body));
    res.json({ success: true, data: toClient(row) });
  },

  // POST /api/email-settings/test  (verifies SMTP credentials actually connect)
  async testConnection(req: Request, res: Response) {
    const { smtpHost, smtpPort, smtpUser, smtpPass, secure } = req.body;
    if (!smtpHost || !smtpUser) {
      return res.status(400).json({ success: false, error: "SMTP host and username are required" });
    }
    try {
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: Number(smtpPort) || 587,
        secure: !!secure,
        auth: smtpUser ? { user: smtpUser, pass: smtpPass } : undefined,
        connectionTimeout: 8000,
      });
      await transporter.verify();
      res.json({ success: true, message: `Connected to ${smtpHost}:${smtpPort}` });
    } catch (err: any) {
      res.status(400).json({ success: false, error: err.message || "SMTP connection failed" });
    }
  },

  // POST /api/email-settings/send-test  (actually sends a real test email using the saved SMTP config)
  async sendTestEmail(req: Request, res: Response) {
    const { to } = req.body;
    if (!to?.trim()) {
      return res.status(400).json({ success: false, error: "Recipient email (to) is required" });
    }

    const row = await EmailSettingsModel.get();
    if (!row || !row.smtp_host || !row.smtp_user) {
      return res.status(400).json({ success: false, error: "Please save SMTP settings before sending a test email" });
    }

    try {
      const transporter = nodemailer.createTransport({
        host: row.smtp_host,
        port: row.smtp_port || 587,
        secure: !!row.secure,
        auth: row.smtp_user ? { user: row.smtp_user, pass: row.smtp_pass } : undefined,
        connectionTimeout: 8000,
      });

      const fromName = row.from_name || "Fire Crackers";
      const fromEmail = row.from_email || row.smtp_user;

      const info = await transporter.sendMail({
        from: `"${fromName}" <${fromEmail}>`,
        to: to.trim(),
        subject: "Test Email - SMTP Configuration Working",
        text: `This is a test email sent from your admin panel to confirm your SMTP settings (${row.smtp_host}:${row.smtp_port}) are working correctly.`,
        html: `
          <div style="font-family: sans-serif; padding: 16px;">
            <h2 style="color:#ea580c;">✅ SMTP Test Successful</h2>
            <p>This is a test email sent from your admin panel to confirm your SMTP settings are working correctly.</p>
            <p><b>Host:</b> ${row.smtp_host}:${row.smtp_port}<br/>
            <b>From:</b> ${fromName} &lt;${fromEmail}&gt;</p>
          </div>
        `,
      });

      res.json({ success: true, message: `Test email sent to ${to}`, messageId: info.messageId });
    } catch (err: any) {
      res.status(400).json({ success: false, error: err.message || "Failed to send test email" });
    }
  },
};
