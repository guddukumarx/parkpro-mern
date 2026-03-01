// controllers/adminOwnerController.js
import User from '../models/User.js';

// @desc    Get all pending owner approvals
// @route   GET /api/admin/owners/pending
// @access  Private (admin)
export const getPendingOwners = async (req, res) => {
  try {
    const pendingOwners = await User.find({
      role: 'owner',
      ownerApprovalStatus: 'pending',
    }).select('name email phone createdAt');
    
    res.json({ success: true, data: pendingOwners });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Approve an owner
// @route   POST /api/admin/owners/:ownerId/approve
// @access  Private (admin)
export const approveOwner = async (req, res) => {
  try {
    const owner = await User.findOne({ 
      _id: req.params.ownerId, 
      role: 'owner' 
    });

    if (!owner) {
      return res.status(404).json({ 
        success: false, 
        message: 'Owner not found' 
      });
    }

    // Update approval status
    owner.ownerApprovalStatus = 'approved';
    await owner.save();

    // Return updated owner without sensitive data
    const ownerResponse = owner.toObject();
    delete ownerResponse.password;
    delete ownerResponse.refreshToken;

    res.json({ 
      success: true, 
      message: 'Owner approved successfully', 
      data: ownerResponse 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Reject an owner
// @route   POST /api/admin/owners/:ownerId/reject
// @access  Private (admin)
export const rejectOwner = async (req, res) => {
  try {
    const { reason } = req.body;
    const owner = await User.findOne({ 
      _id: req.params.ownerId, 
      role: 'owner' 
    });

    if (!owner) {
      return res.status(404).json({ 
        success: false, 
        message: 'Owner not found' 
      });
    }

    // Update approval status
    owner.ownerApprovalStatus = 'rejected';
    
    // Optionally store rejection reason in a separate field or just update
    // You could add a field `rejectionReason` to the User model if needed
    await owner.save();

    const ownerResponse = owner.toObject();
    delete ownerResponse.password;
    delete ownerResponse.refreshToken;

    res.json({ 
      success: true, 
      message: 'Owner rejected', 
      data: ownerResponse 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};