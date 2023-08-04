import { modelOptions, prop } from "@typegoose/typegoose";
import { nanoid } from "nanoid";

export class Photo {
  @prop({ required: true })
  url: string;

  @prop({ required: true })
  idx: number;

  @prop({ default: "" })
  caption?: string;
}

@modelOptions({
  schemaOptions: {
    timestamps: true,
  },
  options: { allowMixed: 0 },
})

export class Timeline {
  @prop({ default: () => nanoid(9) })
  _id: string;

  @prop()
  mainText: string;

  @prop({ required: true })
  length: number;

  @prop({ _id: false, type: () => [Photo] })
  photo?: Photo[];

  @prop({ default: () => new Date() })
  createdAt: Date;

  @prop({ default: () => [] })
  tags: string[];

  @prop({ default: () => [] })
  links: string[];

  @prop()
  authorName: string;

  @prop()
  authorId: string;
}
