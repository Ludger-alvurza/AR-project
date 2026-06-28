export interface ARPoint {
  id: string;
  title: string;
  qrUrl: string;
  gps: { lat: number; lng: number };
  shortInfo: string;
  image: string;
  edukasiId: string;
  icon: string;
}

export interface EdukasiQuestion {
  question: string;
  answer: string;
}

export interface EdukasiData {
  pointId: string;
  title: string;
  questions: EdukasiQuestion[];
}

export interface TimelineEntry {
  id: string;
  title: string;
  year: string;
  description: string;
  icon: string;
}

export async function getARPoints(): Promise<ARPoint[]> {
  const res = await fetch("/data/ar-points.json");
  return res.json();
}

export async function getEdukasi(): Promise<EdukasiData[]> {
  const res = await fetch("/data/edukasi.json");
  return res.json();
}

export async function getEdukasiByPointId(
  pointId: string
): Promise<EdukasiData | undefined> {
  const data = await getEdukasi();
  return data.find((d) => d.pointId === pointId);
}

export async function getTimeline(): Promise<TimelineEntry[]> {
  const res = await fetch("/data/timeline.json");
  return res.json();
}

export async function getARPointById(
  id: string
): Promise<ARPoint | undefined> {
  const data = await getARPoints();
  return data.find((p) => p.id === id);
}

// Server-side versions (for use in Server Components)
import { promises as fs } from "fs";
import path from "path";

export async function getARPointsServer(): Promise<ARPoint[]> {
  const filePath = path.join(process.cwd(), "public", "data", "ar-points.json");
  const raw = await fs.readFile(filePath, "utf-8");
  return JSON.parse(raw);
}

export async function getEdukasiServer(): Promise<EdukasiData[]> {
  const filePath = path.join(process.cwd(), "public", "data", "edukasi.json");
  const raw = await fs.readFile(filePath, "utf-8");
  return JSON.parse(raw);
}

export async function getEdukasiByPointIdServer(
  pointId: string
): Promise<EdukasiData | undefined> {
  const data = await getEdukasiServer();
  return data.find((d) => d.pointId === pointId);
}

export async function getTimelineServer(): Promise<TimelineEntry[]> {
  const filePath = path.join(process.cwd(), "public", "data", "timeline.json");
  const raw = await fs.readFile(filePath, "utf-8");
  return JSON.parse(raw);
}

export async function getARPointByIdServer(
  id: string
): Promise<ARPoint | undefined> {
  const data = await getARPointsServer();
  return data.find((p) => p.id === id);
}
