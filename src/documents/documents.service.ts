import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { GeoDocument } from './schemas/document.schema';
import { CitiesService } from '../cities/cities.service';

@Injectable()
export class DocumentsService {
    constructor(
        @InjectModel(GeoDocument.name) private documentModel: Model<GeoDocument>,
        private citiesService: CitiesService,
    ) {}

    async createDocument(name: string, location: any): Promise<GeoDocument> {
        const cities = await this.citiesService.findCitiesInLocation(name);
        if (!cities) throw new NotFoundException('Location is outside any city boundary');
        const document = new this.documentModel({ name, location });
        return document.save();
    }

    async findDocumentsByCity(cityId: string): Promise<GeoDocument[]> {
    const city = await this.citiesService.getCityModel().findById(cityId);
    if (!city) throw new NotFoundException('City not found');
    return this.documentModel.find({
      location: {
        $geoWithin: {
          $geometry: city.boundary,
        },
      },
    });
  }

  async updateDocument(id: string, boundary: any): Promise<void> {
    const result = await this.citiesService.findCitiesInLocation(id);
    if (!result) throw new NotFoundException('Document not found');
  }

  async deleteDocument(id: string): Promise<void> {
    const result = await this.documentModel.findByIdAndDelete(id);
    if (!result) throw new NotFoundException('Document not found');
  }
}