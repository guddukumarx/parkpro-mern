import EmailTemplate from '../models/EmailTemplate.js';
import { createAuditLog } from '../services/auditService.js';

// @desc    Get all email templates
// @route   GET /api/admin/email-templates
// @access  Private (admin)
export const getAllTemplates = async (req, res) => {
  try {
    const templates = await EmailTemplate.find();
    // Convert to key-value object for frontend
    const templateObj = templates.reduce((acc, t) => {
      acc[t.name] = { subject: t.subject, body: t.body };
      return acc;
    }, {});
    res.json({ success: true, data: templateObj });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single template by name
// @route   GET /api/admin/email-templates/:name
// @access  Private (admin)
export const getTemplateByName = async (req, res) => {
  try {
    const template = await EmailTemplate.findOne({ name: req.params.name });
    if (!template) {
      return res.status(404).json({ success: false, message: 'Template not found' });
    }
    res.json({ success: true, data: template });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create a new template
// @route   POST /api/admin/email-templates
// @access  Private (admin)
export const createTemplate = async (req, res) => {
  try {
    const { name, subject, body, description, variables } = req.body;
    const existing = await EmailTemplate.findOne({ name });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Template already exists' });
    }
    const template = await EmailTemplate.create({
      name,
      subject,
      body,
      description,
      variables,
    });
    await createAuditLog({
      user: req.user._id,
      action: 'CREATE',
      entity: 'EmailTemplate',
      entityId: template._id,
      changes: template.toObject(),
      ip: req.clientIp,
      userAgent: req.userAgent,
      details: `Email template created: ${name}`,
    });
    res.status(201).json({ success: true, data: template });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update a template
// @route   PUT /api/admin/email-templates/:name
// @access  Private (admin)
export const updateTemplate = async (req, res) => {
  try {
    const template = await EmailTemplate.findOne({ name: req.params.name });
    if (!template) {
      return res.status(404).json({ success: false, message: 'Template not found' });
    }
    const oldData = template.toObject();
    const { subject, body, description, variables } = req.body;
    if (subject !== undefined) template.subject = subject;
    if (body !== undefined) template.body = body;
    if (description !== undefined) template.description = description;
    if (variables !== undefined) template.variables = variables;
    await template.save();

    await createAuditLog({
      user: req.user._id,
      action: 'UPDATE',
      entity: 'EmailTemplate',
      entityId: template._id,
      changes: { old: oldData, new: template.toObject() },
      ip: req.clientIp,
      userAgent: req.userAgent,
      details: `Email template updated: ${template.name}`,
    });
    res.json({ success: true, data: template });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete a template
// @route   DELETE /api/admin/email-templates/:name
// @access  Private (admin)
export const deleteTemplate = async (req, res) => {
  try {
    const template = await EmailTemplate.findOneAndDelete({ name: req.params.name });
    if (!template) {
      return res.status(404).json({ success: false, message: 'Template not found' });
    }
    await createAuditLog({
      user: req.user._id,
      action: 'DELETE',
      entity: 'EmailTemplate',
      entityId: template._id,
      ip: req.clientIp,
      userAgent: req.userAgent,
      details: `Email template deleted: ${template.name}`,
    });
    res.json({ success: true, message: 'Template deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};