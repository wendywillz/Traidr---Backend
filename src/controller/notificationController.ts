import { Request, Response } from 'express';
import notification from '../model/notification';
import User from '../model/user';

export const createNewNotification = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, message, userId } = req.body;

    // Validate input
    if (!title || !message || !userId) {
       res.status(400).json({ error: 'Title, message, and user ID are required' });
    }
    // Check if user exists
    // const user = await User.findById(userId);
    const user = await User.findOne({ where: { userId } });
    if (!user) {
       res.status(404).json({ error: 'User not found' });
    }
    //Create new notification
    const newNotification = await notification.create({
      title,
      message,
      userId,
      createdAt: new Date()
    });
    res.status(201).json(newNotification);
  } catch (error) {
    console.log('Error creating notification:', error);
    res.status(500).json({ error: 'Error creating Notification' });
  }
};