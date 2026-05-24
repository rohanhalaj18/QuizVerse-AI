const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { MultiplayerRoom, RoomPlayer, User } = require('../models');
const { success, error } = require('../utils/response');

router.use(protect);

// Get room by code
router.get('/:code', async (req, res) => {
  try {
    const room = await MultiplayerRoom.findOne({
      where: { roomCode: req.params.code },
      include: [
        { association: 'players', include: [{ association: 'user', attributes: ['id', 'fullname', 'profileImage'] }] },
        { association: 'host', attributes: ['fullname', 'profileImage'] },
      ],
    });
    if (!room) return error(res, 'Room not found', 404);
    return success(res, { data: room });
  } catch (err) {
    return error(res, 'Failed to fetch room', 500);
  }
});

// Get recent rooms
router.get('/', async (req, res) => {
  try {
    const rooms = await MultiplayerRoom.findAll({
      where: { status: 'waiting' },
      include: [{ association: 'host', attributes: ['fullname'] }],
      order: [['createdAt', 'DESC']],
      limit: 10,
    });
    return success(res, { data: rooms });
  } catch (err) {
    return error(res, 'Failed to fetch rooms', 500);
  }
});

module.exports = router;
