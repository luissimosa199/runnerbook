// api/timeline
import { TimeLineModel } from "../../../db/models";
import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "../../../db/dbConnect";
import { TimelineFormInputs } from "@/types";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await dbConnect();

  if (req.method === "GET") {
    const { tags, page } = req.query;

    // Calculate the skip value based on the page number and the number of items per page (e.g., 10)
    const perPage = 10;
    const skip = page ? parseInt(page as string) * perPage : 0;

    if (tags) {
      const tagsArray = Array.isArray(tags) ? tags : [tags];
      const regexPatterns = tagsArray.map((tag) => new RegExp(`^${tag}`, "i"));
      const response = await TimeLineModel.find({
        tags: { $in: regexPatterns },
      })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(perPage)
        .lean();
      res.status(200).json(response);
    } else {
      const response = await TimeLineModel.find({})
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(perPage)
        .lean();
      res.status(200).json(response);
    }
  } else if (req.method === "POST") {
    const { mainText, photo, length, tags } = JSON.parse(req.body) as TimelineFormInputs;

    const timeline = new TimeLineModel({
      mainText: mainText || "",
      photo: photo,
      length: length,
      tags: tags,
    });

    await timeline.save();

    res.status(200).json(timeline.toJSON());
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
