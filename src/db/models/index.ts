import { Timeline } from "./timelineModel";
import { getModelForClass } from "@typegoose/typegoose";

export const TimeLineModel = getModelForClass(Timeline);
// add other models here