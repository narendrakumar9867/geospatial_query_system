import { Controller, Post, Body, Patch, Delete, Param, Get, UsePipes, ValidationPipe, BadRequestException } from '@nestjs/common';
import { CitiesService } from './cities.service';

@Controller('cities')
export class CitiesController {
    constructor(private readonly citiesService: CitiesService) {}

    @Post()
    @UsePipes(new ValidationPipe({ transform: true }))
    createCity(@Body() body: { name: string; boundary: any}) {
        return this.citiesService.createCity(body.name, body.boundary);
    }

    @Get(':id')
    getAllCities(@Param('id') id: string) {
        if (!id) {
            throw new BadRequestException('Body parameter "id" is required');
        }
        return this.citiesService.findCitiesInLocation(id);
    }
    

    @Patch(':id')
    updateCityBoundary(@Param('id') id: string, @Body() body: { boundary: any }) {
        return this.citiesService.updateCityBoundary(id, body.boundary);
    }

    @Delete(':id')
    deleteCity(@Param('id') id: string) {
        return this.citiesService.deleteCity(id);
    }

}
