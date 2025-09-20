// pages/api/creator.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { connectDB, Creator } from "../../../lib/mongodb";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectDB();

  if (req.method === "GET") {
    const { address } = req.query;
    const addr = Array.isArray(address) ? address[0] : address;

    if (!addr) {
      return res.status(400).json({ error: "address is required" });
    }

    try {
      const doc = await Creator.findOne({ address: addr }).lean();
      return res.status(200).json({
        exists: !!doc,
        managerId: doc?.manager ?? null,
      });
    } catch (err) {
      console.error("GET /creator error:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  if (req.method === "POST") {
    const { address, managerId } = req.body ?? {};

    if (!address || !managerId) {
      return res.status(400).json({ error: "address and managerId are required" });
    }

    try {
      // 주소가 이미 있는지 확인
      const existing = await Creator.findOne({ address }).lean();

      if (existing) {
        // 이미 존재하면 새로 안 넣음
        return res.status(200).json({
          success: false,
          message: "Creator already exists",
        });
      }

      // 없으면 새로 삽입
      await Creator.create({ address, manager: managerId });

      return res.status(201).json({
        success: true,
        message: "Creator added",
      });
    } catch (err) {
      console.error("POST /creator error:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
