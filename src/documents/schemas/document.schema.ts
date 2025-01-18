import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';

@Schema()
export class GeoDocument extends Document {
    @Prop({ type: mongoose.Schema.Types.String, required: true})
    name: string;

    @Prop({ type: mongoose.Schema.Types.String, required: true})
    type: string; // landmark, bussiness, residence

    @Prop({ type: mongoose.Schema.Types.String, required: true})
    location: any; //geojson point

    @Prop({ type: Date, default: Date.now})
    createdAt: Date;

    @Prop({ type: Date, default: Date.now})
    updatedAt: Date;

    @Prop({ type: Date, default: Date.now})
    deletedAt: Date;
}

export const GeoDocumentSchema = SchemaFactory.createForClass(GeoDocument);
GeoDocumentSchema.index({ location: '2dsphere' });