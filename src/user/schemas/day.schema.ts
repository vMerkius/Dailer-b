import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type DayDocument = HydratedDocument<Day>;

@Schema()
export class Day {
  @Prop()
  date: Date;

  @Prop()
  rating: number;
}
export const DaySchema = SchemaFactory.createForClass(Day);
