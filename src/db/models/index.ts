import { DeletedTimeline } from "./deletedTimelineModel";
import { Timeline } from "./timelineModel";
import { getModelForClass } from "@typegoose/typegoose";

export const TimeLineModel = getModelForClass(Timeline);

export const DeletedTimelineModel = getModelForClass(DeletedTimeline);

// add other models here