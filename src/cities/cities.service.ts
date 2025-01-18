import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { City } from './schemas/city.schema';

@Injectable()
export class CitiesService {
    constructor(@InjectModel(City.name) private cityModel: Model<City>) {}

    async createCity(name: string, boundary: any): Promise<City> {
        return this.cityModel.create({ name, boundary });
    }
      
    async findCitiesInLocation(id: string) {
        if (!Types.ObjectId.isValid(id)) {
            throw new NotFoundException('Invalid ObjectId format');
        }
        return this.cityModel.findById(id);
    }

    async updateCityBoundary(id: string, boundary: any): Promise<City> {
        const city = await this.cityModel.findByIdAndUpdate(id, { boundary }, { new: true });
        if (!city) throw new NotFoundException('City not found');
        return city;
    }

    async deleteCity(id: string): Promise<void>{
        const result = await this.cityModel.findByIdAndDelete(id);
        if (!result) throw new NotFoundException('City not found');
    }

    public getCityModel() { // you need to public cityModel for accessing
        return this.cityModel;
    }
}
