import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const notificationsPath = path.join(process.cwd(), 'data', 'notifications.json');

// Initialize notifications file if it doesn't exist
if (!fs.existsSync(notificationsPath)) {
  const initialNotifications = {
    notifications: [],
    stats: {
      total: 0,
      unread: 0
    }
  };
  fs.writeFileSync(notificationsPath, JSON.stringify(initialNotifications, null, 2));
}

export async function GET() {
  try {
    const notificationsData = JSON.parse(fs.readFileSync(notificationsPath, 'utf8'));
    
    return NextResponse.json(notificationsData);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return NextResponse.json(
      { error: 'Failed to fetch notifications' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const { title, message, targetRole, targetUsers } = await request.json();
    
    const notificationsData = JSON.parse(fs.readFileSync(notificationsPath, 'utf8'));
    
    const newNotification = {
      id: `NOTIF_${Date.now()}`,
      title,
      message,
      targetRole: targetRole || 'all',
      targetUsers: targetUsers || [],
      createdAt: new Date().toISOString(),
      readBy: [],
      status: 'sent'
    };
    
    notificationsData.notifications.unshift(newNotification);
    notificationsData.stats.total += 1;
    notificationsData.stats.unread += 1;
    
    fs.writeFileSync(notificationsPath, JSON.stringify(notificationsData, null, 2));
    
    return NextResponse.json({
      notification: newNotification,
      message: 'Notification sent successfully'
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating notification:', error);
    return NextResponse.json(
      { error: 'Failed to create notification' },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    const { id, readStatus } = await request.json();
    
    const notificationsData = JSON.parse(fs.readFileSync(notificationsPath, 'utf8'));
    
    const notificationIndex = notificationsData.notifications.findIndex(n => n.id === id);
    if (notificationIndex === -1) {
      return NextResponse.json(
        { error: 'Notification not found' },
        { status: 404 }
      );
    }
    
    if (readStatus !== undefined) {
      notificationsData.notifications[notificationIndex].readStatus = readStatus;
      if (readStatus) {
        notificationsData.stats.unread = Math.max(0, notificationsData.stats.unread - 1);
      } else {
        notificationsData.stats.unread += 1;
      }
    }
    
    fs.writeFileSync(notificationsPath, JSON.stringify(notificationsData, null, 2));
    
    return NextResponse.json({
      notification: notificationsData.notifications[notificationIndex],
      message: 'Notification updated successfully'
    });
  } catch (error) {
    console.error('Error updating notification:', error);
    return NextResponse.json(
      { error: 'Failed to update notification' },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    const notificationsData = JSON.parse(fs.readFileSync(notificationsPath, 'utf8'));
    
    const notificationIndex = notificationsData.notifications.findIndex(n => n.id === id);
    if (notificationIndex === -1) {
      return NextResponse.json(
        { error: 'Notification not found' },
        { status: 404 }
      );
    }
    
    const notification = notificationsData.notifications[notificationIndex];
    notificationsData.notifications.splice(notificationIndex, 1);
    notificationsData.stats.total -= 1;
    if (!notification.readStatus) {
      notificationsData.stats.unread = Math.max(0, notificationsData.stats.unread - 1);
    }
    
    fs.writeFileSync(notificationsPath, JSON.stringify(notificationsData, null, 2));
    
    return NextResponse.json({
      message: 'Notification deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting notification:', error);
    return NextResponse.json(
      { error: 'Failed to delete notification' },
      { status: 500 }
    );
  }
}