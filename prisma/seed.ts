import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create cameras
  const cameras = await prisma.camera.createMany({
    data: [
      { name: 'Shop Floor Camera A', location: 'Main Hall' },
      { name: 'Vault Camera', location: 'Vault Room' },
      { name: 'Entrance Camera', location: 'Main Entrance' },
      { name: 'Back Alley Camera', location: 'Back Alley' },
      { name: 'Parking Lot Camera', location: 'Parking Lot' },
      { name: 'Office Camera', location: 'Office' },
      { name: 'Lobby Camera', location: 'Lobby' },
      { name: 'Server Room Camera', location: 'Server Room' },
    ],
  });

  // Get camera IDs
  const cameraList = await prisma.camera.findMany();

  // Helper to get cameraId by name
  const getCameraId = (name: string) => cameraList.find((c: { id: number; name: string }) => c.name === name)?.id ?? cameraList[0].id;

  // Create incidents
  await prisma.incident.createMany({
    data: [
      // Unauthorised Access
      {
        cameraId: getCameraId('Shop Floor Camera A'),
        type: 'Unauthorized Access',
        tsStart: new Date('2025-07-21T08:05:00Z'),
        tsEnd: new Date('2025-07-21T08:07:00Z'),
        thumbnailUrl: '/globe.svg',
        resolved: false,
      },
      {
        cameraId: getCameraId('Vault Camera'),
        type: 'Unauthorized Access',
        tsStart: new Date('2025-07-21T09:15:00Z'),
        tsEnd: new Date('2025-07-21T09:17:00Z'),
        thumbnailUrl: '/vercel.svg',
        resolved: false,
      },
      {
        cameraId: getCameraId('Entrance Camera'),
        type: 'Unauthorized Access',
        tsStart: new Date('2025-07-21T10:30:00Z'),
        tsEnd: new Date('2025-07-21T10:32:00Z'),
        thumbnailUrl: '/next.svg',
        resolved: true,
      },
      {
        cameraId: getCameraId('Parking Lot Camera'),
        type: 'Unauthorized Access',
        tsStart: new Date('2025-07-21T11:00:00Z'),
        tsEnd: new Date('2025-07-21T11:02:00Z'),
        thumbnailUrl: '/file.svg',
        resolved: false,
      },
      {
        cameraId: getCameraId('Office Camera'),
        type: 'Unauthorized Access',
        tsStart: new Date('2025-07-21T12:10:00Z'),
        tsEnd: new Date('2025-07-21T12:12:00Z'),
        thumbnailUrl: '/window.svg',
        resolved: true,
      },
      // Gun Threat
      {
        cameraId: getCameraId('Shop Floor Camera A'),
        type: 'Gun Threat',
        tsStart: new Date('2025-07-21T11:45:00Z'),
        tsEnd: new Date('2025-07-21T11:47:00Z'),
        thumbnailUrl: '/window.svg',
        resolved: false,
      },
      {
        cameraId: getCameraId('Vault Camera'),
        type: 'Gun Threat',
        tsStart: new Date('2025-07-21T12:10:00Z'),
        tsEnd: new Date('2025-07-21T12:12:00Z'),
        thumbnailUrl: '/file.svg',
        resolved: true,
      },
      {
        cameraId: getCameraId('Back Alley Camera'),
        type: 'Gun Threat',
        tsStart: new Date('2025-07-21T13:20:00Z'),
        tsEnd: new Date('2025-07-21T13:22:00Z'),
        thumbnailUrl: '/globe.svg',
        resolved: false,
      },
      {
        cameraId: getCameraId('Parking Lot Camera'),
        type: 'Gun Threat',
        tsStart: new Date('2025-07-21T14:00:00Z'),
        tsEnd: new Date('2025-07-21T14:02:00Z'),
        thumbnailUrl: '/vercel.svg',
        resolved: true,
      },
      {
        cameraId: getCameraId('Office Camera'),
        type: 'Gun Threat',
        tsStart: new Date('2025-07-21T15:10:00Z'),
        tsEnd: new Date('2025-07-21T15:12:00Z'),
        thumbnailUrl: '/next.svg',
        resolved: false,
      },
      // Face Recognised
      {
        cameraId: getCameraId('Entrance Camera'),
        type: 'Face Recognised',
        tsStart: new Date('2025-07-21T14:00:00Z'),
        tsEnd: new Date('2025-07-21T14:01:00Z'),
        thumbnailUrl: '/vercel.svg',
        resolved: false,
      },
      {
        cameraId: getCameraId('Shop Floor Camera A'),
        type: 'Face Recognised',
        tsStart: new Date('2025-07-21T15:10:00Z'),
        tsEnd: new Date('2025-07-21T15:12:00Z'),
        thumbnailUrl: '/next.svg',
        resolved: true,
      },
      {
        cameraId: getCameraId('Vault Camera'),
        type: 'Face Recognised',
        tsStart: new Date('2025-07-21T16:30:00Z'),
        tsEnd: new Date('2025-07-21T16:32:00Z'),
        thumbnailUrl: '/window.svg',
        resolved: false,
      },
      {
        cameraId: getCameraId('Lobby Camera'),
        type: 'Face Recognised',
        tsStart: new Date('2025-07-21T17:00:00Z'),
        tsEnd: new Date('2025-07-21T17:01:00Z'),
        thumbnailUrl: '/file.svg',
        resolved: true,
      },
      {
        cameraId: getCameraId('Server Room Camera'),
        type: 'Face Recognised',
        tsStart: new Date('2025-07-21T18:10:00Z'),
        tsEnd: new Date('2025-07-21T18:12:00Z'),
        thumbnailUrl: '/globe.svg',
        resolved: false,
      },
      // More incidents for variety
      {
        cameraId: getCameraId('Back Alley Camera'),
        type: 'Unauthorized Access',
        tsStart: new Date('2025-07-21T17:45:00Z'),
        tsEnd: new Date('2025-07-21T17:47:00Z'),
        thumbnailUrl: '/file.svg',
        resolved: false,
      },
      {
        cameraId: getCameraId('Entrance Camera'),
        type: 'Gun Threat',
        tsStart: new Date('2025-07-21T18:55:00Z'),
        tsEnd: new Date('2025-07-21T18:57:00Z'),
        thumbnailUrl: '/globe.svg',
        resolved: true,
      },
      {
        cameraId: getCameraId('Shop Floor Camera A'),
        type: 'Face Recognised',
        tsStart: new Date('2025-07-21T19:05:00Z'),
        tsEnd: new Date('2025-07-21T19:07:00Z'),
        thumbnailUrl: '/vercel.svg',
        resolved: false,
      },
      {
        cameraId: getCameraId('Vault Camera'),
        type: 'Unauthorized Access',
        tsStart: new Date('2025-07-21T20:15:00Z'),
        tsEnd: new Date('2025-07-21T20:17:00Z'),
        thumbnailUrl: '/next.svg',
        resolved: false,
      },
      // Even more incidents for demo
      {
        cameraId: getCameraId('Lobby Camera'),
        type: 'Unauthorized Access',
        tsStart: new Date('2025-07-21T21:05:00Z'),
        tsEnd: new Date('2025-07-21T21:07:00Z'),
        thumbnailUrl: '/window.svg',
        resolved: true,
      },
      {
        cameraId: getCameraId('Server Room Camera'),
        type: 'Gun Threat',
        tsStart: new Date('2025-07-21T22:15:00Z'),
        tsEnd: new Date('2025-07-21T22:17:00Z'),
        thumbnailUrl: '/file.svg',
        resolved: false,
      },
      {
        cameraId: getCameraId('Parking Lot Camera'),
        type: 'Face Recognised',
        tsStart: new Date('2025-07-21T23:25:00Z'),
        tsEnd: new Date('2025-07-21T23:27:00Z'),
        thumbnailUrl: '/globe.svg',
        resolved: true,
      },
      {
        cameraId: getCameraId('Office Camera'),
        type: 'Gun Threat',
        tsStart: new Date('2025-07-22T00:35:00Z'),
        tsEnd: new Date('2025-07-22T00:37:00Z'),
        thumbnailUrl: '/vercel.svg',
        resolved: false,
      },
      {
        cameraId: getCameraId('Lobby Camera'),
        type: 'Face Recognised',
        tsStart: new Date('2025-07-22T01:45:00Z'),
        tsEnd: new Date('2025-07-22T01:47:00Z'),
        thumbnailUrl: '/next.svg',
        resolved: true,
      },
      {
        cameraId: getCameraId('Server Room Camera'),
        type: 'Unauthorized Access',
        tsStart: new Date('2025-07-22T02:55:00Z'),
        tsEnd: new Date('2025-07-22T02:57:00Z'),
        thumbnailUrl: '/window.svg',
        resolved: false,
      },
    ],
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 