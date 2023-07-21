import { modelOptions, prop } from "@typegoose/typegoose";
import { nanoid } from "nanoid";

@modelOptions({ options: { allowMixed: 0 } })
export class Timeline {
  @prop({ default: () => nanoid(9) })
  _id: string;

  @prop()
  mainText: string;

  @prop({ required: true})
  length: number;

  @prop()
  photo?: { url: string, idx: number, caption?: string }[];

  @prop({ default: () => new Date() })
  createdAt: Date;

  @prop({ default: () => [] })
  tags: string[];
}