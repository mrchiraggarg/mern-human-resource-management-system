import Notification from "../models/Notification.js";

export const sendNotification = async (userId, message) => {
    try {
        if (!userId || !message) {
            throw new Error("UserId and message are required");
        }

        const notification = new Notification({
            user: userId,
            message,
            read: false,
            createdAt: new Date()
        });

        await notification.save();
        return true;
    } catch (error) {
        console.error("Error sending notification:", error);
        return false;
    }
};

export default sendNotification;