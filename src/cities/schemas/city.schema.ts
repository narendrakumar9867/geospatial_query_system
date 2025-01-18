import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';

@Schema()
export class City extends Document {
    @Prop({ type: mongoose.Schema.Types.String, required: true})
    name: string;

    @Prop({ type: mongoose.Schema.Types.Mixed, required: true})
    boundary: any;
}

export const CitySchema = SchemaFactory.createForClass(City);
CitySchema.index({ boundary: '2dsphere'});