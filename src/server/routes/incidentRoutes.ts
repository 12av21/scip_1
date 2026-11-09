// SCIP Backend - Incident Lifecycle & Human Review Routes

import { Router, Response } from 'express';
import { db } from '../../database/scipDatabase.js';
import { authenticate, AuthenticatedRequest, requirePermission } from '../middleware/auth.js';

const router = Router();

// GET /api/incidents
router.get('/', authenticate, (req: AuthenticatedRequest, res: Response): void => {
  const { status, category, priority } = req.query;

  const incidents = db.getIncidents({
    status: status ? String(status) : undefined,
    category: category ? String(category) : undefined,
    priority: priority ? String(priority) : undefined
  });

  res.json({
    success: true,
    data: incidents,
    meta: {
      total: incidents.length
    }
  });
});

// GET /api/incidents/:id
router.get('/:id', authenticate, (req: AuthenticatedRequest, res: Response): void => {
  const incident = db.getIncidentById(req.params.id);
  if (!incident) {
    res.status(404).json({
      success: false,
      message: `Incident ${req.params.id} not found.`
    });
    return;
  }

  // Fetch all linked reports
  const allReports = db.getReports();
  const linkedReports = allReports.filter(r => incident.reportIds.includes(r.id));

  res.json({
    success: true,
    data: {
      incident,
      linkedReports
    }
  });
});

// POST /api/incidents/from-cluster
router.post(
  '/from-cluster',
  authenticate,
  requirePermission('incident.create'),
  (req: AuthenticatedRequest, res: Response): void => {
    try {
      const { cluster } = req.body;
      if (!cluster || !cluster.reportIds || cluster.reportIds.length === 0) {
        res.status(400).json({
          success: false,
          message: 'Valid cluster data with report IDs is required.'
        });
        return;
      }

      const newIncident = db.createIncidentFromCluster(cluster, req.user!);
      res.status(201).json({
        success: true,
        message: 'Potential incident created from cluster observation.',
        data: newIncident
      });
    } catch (err: any) {
      res.status(500).json({
        success: false,
        message: 'Failed to create incident from cluster.',
        errors: [err.message]
      });
    }
  }
);

// POST /api/incidents/:id/review (Human Review Workflow)
router.post(
  '/:id/review',
  authenticate,
  requirePermission('incident.update'),
  (req: AuthenticatedRequest, res: Response): void => {
    try {
      const { action, notes, departmentId, officerId } = req.body;

      if (!action || (action !== 'confirm' && action !== 'dismiss')) {
        res.status(400).json({
          success: false,
          message: 'Action must be "confirm" or "dismiss".'
        });
        return;
      }

      if (!notes) {
        res.status(400).json({
          success: false,
          message: 'Review notes are required for administrative accountability.'
        });
        return;
      }

      const updatedIncident = db.reviewIncident(
        req.params.id,
        action,
        req.user!,
        notes,
        departmentId,
        officerId
      );

      res.json({
        success: true,
        message: `Incident ${req.params.id} has been ${action === 'confirm' ? 'confirmed' : 'dismissed'} by human review.`,
        data: updatedIncident
      });
    } catch (err: any) {
      res.status(400).json({
        success: false,
        message: err.message,
        errors: [err.message]
      });
    }
  }
);

// POST /api/incidents/:id/resolve
router.post(
  '/:id/resolve',
  authenticate,
  requirePermission('incident.resolve'),
  (req: AuthenticatedRequest, res: Response): void => {
    try {
      const { actionTaken, preventiveMeasures, costEstimate } = req.body;

      if (!actionTaken || actionTaken.length < 5) {
        res.status(400).json({
          success: false,
          message: 'Action taken description is required to document resolution.'
        });
        return;
      }

      const resolved = db.resolveIncident(req.params.id, req.user!, {
        actionTaken,
        preventiveMeasures,
        costEstimate: Number(costEstimate) || undefined
      });

      res.json({
        success: true,
        message: `Incident ${req.params.id} has been marked resolved.`,
        data: resolved
      });
    } catch (err: any) {
      res.status(400).json({
        success: false,
        message: err.message,
        errors: [err.message]
      });
    }
  }
);

// GET /api/incidents/:id/inspections
router.get(
  '/:id/inspections',
  authenticate,
  requirePermission('inspection.read'),
  (req: AuthenticatedRequest, res: Response): void => {
    const list = db.getInspections(req.params.id);
    res.json({
      success: true,
      data: list
    });
  }
);

// POST /api/incidents/:id/inspection - Field Officer submits inspection report
router.post(
  '/:id/inspection',
  authenticate,
  requirePermission('inspection.create'),
  (req: AuthenticatedRequest, res: Response): void => {
    try {
      const {
        verifiedStatus,
        observations,
        checklist,
        evidencePhotos,
        recommendedAction,
        inspectionDate
      } = req.body;

      if (!observations || !verifiedStatus) {
        res.status(400).json({
          success: false,
          message: 'Observations and verified status are mandatory.'
        });
        return;
      }

      const inspection = db.createInspection(
        {
          incidentId: req.params.id,
          officerId: req.user!.id,
          officerName: req.user!.name,
          verifiedStatus,
          observations,
          checklist: checklist || {
            physicalVerification: true,
            safetyHazardAssessed: true,
            structuralDamageChecked: false,
            utilityImpactVerified: false
          },
          evidencePhotos: Array.isArray(evidencePhotos) ? evidencePhotos : [],
          recommendedAction: recommendedAction || '',
          inspectionDate: inspectionDate || new Date().toISOString()
        },
        req.user!
      );

      res.status(201).json({
        success: true,
        message: 'Field inspection report submitted successfully.',
        data: inspection
      });
    } catch (err: any) {
      res.status(400).json({
        success: false,
        message: err.message
      });
    }
  }
);

// POST /api/incidents/:id/verify-inspection - Department Desk Officer approves/disputes
router.post(
  '/:id/verify-inspection',
  authenticate,
  requirePermission('inspection.verify'),
  (req: AuthenticatedRequest, res: Response): void => {
    try {
      const { inspectionId, departmentRemarks, isApproved } = req.body;
      if (!inspectionId || !departmentRemarks) {
        res.status(400).json({
          success: false,
          message: 'Inspection ID and official department remarks are required.'
        });
        return;
      }

      const verified = db.verifyInspection(
        inspectionId,
        departmentRemarks,
        req.user!,
        Boolean(isApproved)
      );

      res.json({
        success: true,
        message: `Inspection ${inspectionId} has been ${isApproved ? 'approved' : 'rejected'}.`,
        data: verified
      });
    } catch (err: any) {
      res.status(400).json({
        success: false,
        message: err.message
      });
    }
  }
);

// POST /api/incidents/:id/assign - Department Officer assigns field officer
router.post(
  '/:id/assign',
  authenticate,
  requirePermission('incident.assign'),
  (req: AuthenticatedRequest, res: Response): void => {
    try {
      const { departmentId, officerId, officerName, notes } = req.body;
      if (!officerId || !officerName) {
        res.status(400).json({
          success: false,
          message: 'Officer ID and name are required for assignment.'
        });
        return;
      }

      const updated = db.assignIncidentOfficer(
        req.params.id,
        departmentId || req.user?.departmentId || 'DEP-WTR',
        officerId,
        officerName,
        req.user!,
        notes || ''
      );

      res.json({
        success: true,
        message: `Field officer ${officerName} assigned to incident.`,
        data: updated
      });
    } catch (err: any) {
      res.status(400).json({
        success: false,
        message: err.message
      });
    }
  }
);

// POST /api/incidents/:id/escalate - Escalate incident to Critical P1
router.post(
  '/:id/escalate',
  authenticate,
  requirePermission('incident.escalate'),
  (req: AuthenticatedRequest, res: Response): void => {
    try {
      const { reason } = req.body;
      if (!reason) {
        res.status(400).json({
          success: false,
          message: 'Official reason for incident escalation is mandatory.'
        });
        return;
      }

      const escalated = db.escalateIncident(req.params.id, req.user!, reason);
      res.json({
        success: true,
        message: `Incident ${req.params.id} escalated to P1_CRITICAL priority.`,
        data: escalated
      });
    } catch (err: any) {
      res.status(400).json({
        success: false,
        message: err.message
      });
    }
  }
);

export default router;
