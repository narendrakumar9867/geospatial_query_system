import { Test, TestingModule } from '@nestjs/testing';
import { CitiesService } from './cities.service';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { City } from './schemas/city.schema';
import { NotFoundException } from '@nestjs/common';

describe('CitiesService', () => {
  let service: CitiesService;
  let model: Model<City>;

  const mockCity = {
    _id: '678a4f694e4f58f038571f1d',
    name: 'Test City',
    boundary: {
      type: 'Polygon',
      coordinates: [[[0, 0], [0, 10], [10, 10], [10, 0], [0, 0]]],
    },
  };

  const mockCityModel = {
    create: jest.fn().mockResolvedValue(mockCity),
    findById: jest.fn().mockResolvedValue(mockCity),
    findByIdAndUpdate: jest.fn().mockResolvedValue(mockCity),
    findByIdAndDelete: jest.fn().mockResolvedValue(mockCity),
  };  

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CitiesService,
        {
          provide: getModelToken(City.name),
          useValue: mockCityModel,
        },
      ],
    }).compile();

    service = module.get<CitiesService>(CitiesService);
    model = module.get<Model<City>>(getModelToken(City.name));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create a city', async () => {
    const result = await service.createCity(mockCity.name, mockCity.boundary);
  
    expect(result).toEqual(mockCity);
    expect(mockCityModel.create).toHaveBeenCalledWith({
      name: mockCity.name,
      boundary: mockCity.boundary,
    });
    expect(mockCityModel.create).toHaveBeenCalledTimes(1);
  });
  

  it('should find a city by ID', async () => {
    const result = await service.findCitiesInLocation(mockCity._id);

    expect(result);
    expect(mockCityModel.findById).toHaveBeenCalledWith(mockCity._id);
    expect(mockCityModel.findById).toHaveBeenCalledTimes(1);
  });

  it('should throw NotFoundException for invalid ObjectId format', async () => {
    await expect(service.findCitiesInLocation('invalid-id')).rejects.toThrow(
      new NotFoundException('Invalid ObjectId format'),
    );
  });

  it('should throw NotFoundException if city not found (findCitiesInLocation)', async () => {
    mockCityModel.findById.mockResolvedValueOnce(null);

    await expect(service.findCitiesInLocation('invalid-id')).rejects.toThrow(
      NotFoundException,
    );
  });

  it('should update a city boundary', async () => {
    const updatedBoundary = {
      type: 'Polygon',
      coordinates: [[[1, 1], [1, 11], [11, 11], [11, 1], [1, 1]]],
    };

    const result = await service.updateCityBoundary(mockCity._id, updatedBoundary);

    expect(result).toEqual(mockCity);
    expect(mockCityModel.findByIdAndUpdate).toHaveBeenCalledWith(
      mockCity._id,
      { boundary: updatedBoundary },
      { new: true },
    );
  });

  it('should throw NotFoundException if city not found (updateCityBoundary)', async () => {
    mockCityModel.findByIdAndUpdate.mockResolvedValueOnce(null);

    await expect(
      service.updateCityBoundary('invalid-id', mockCity.boundary),
    ).rejects.toThrow(NotFoundException);
  });

  it('should delete a city', async () => {
    await service.deleteCity(mockCity._id);

    expect(mockCityModel.findByIdAndDelete).toHaveBeenCalledWith(mockCity._id);
    expect(mockCityModel.findByIdAndDelete).toHaveBeenCalledTimes(1);
  });

  it('should throw NotFoundException if city not found (deleteCity)', async () => {
    mockCityModel.findByIdAndDelete.mockResolvedValueOnce(null);

    await expect(service.deleteCity('invalid-id')).rejects.toThrow(NotFoundException);
  });
});
