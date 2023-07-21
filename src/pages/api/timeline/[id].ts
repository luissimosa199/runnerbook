import { TimeLineModel } from "../../../db/models";
import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "../../../db/dbConnect";
import { TimelineFormInputs } from "@/types";

type UpdateTodoBody = Partial<TimelineFormInputs>;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await dbConnect();
  const id = req.query.id as string;
  if (req.method === "GET") {
    const timeline = await TimeLineModel.findById(id);
    if (timeline) {
      res.status(200).json(timeline);
    } else {
      res.status(404);
    }
  } else if (req.method === "PUT") {
    const body = req.body as UpdateTodoBody;
    const timeline = await TimeLineModel.findById(id);
    if (timeline) {
      timeline.set({ ...body });
      await timeline.save();
      res.status(200).json(timeline.toJSON());
    } else {
      res.status(404);
    }
  } else if (req.method === "DELETE") {
    const timeline = await TimeLineModel.findByIdAndRemove(id);
    if (timeline) {
      res.status(200).json(timeline.toJSON());
    } else {
      res.status(404);
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
