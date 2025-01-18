import { Controller, Post, Body, Get, Patch, Delete, Param, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { DocumentsService } from './documents.service';

@Controller('documents')
export class DocumentsController {
    constructor(private readonly documentsService: DocumentsService) {}

    @Post()
    @UsePipes(new ValidationPipe({ transform: true }))
    createDocument(@Body() body: { name: string; type: string; location: any}) {
        return this.documentsService.createDocument(body.name, body.location);
    }

    @Get('by-city/:cityId')
    findDocumentsByCity(@Param('cityId') cityId: string) {
        return this.documentsService.findDocumentsByCity(cityId);
    }

    @Patch(':id')
    updateDocument(@Param('id') id: string, @Body() body: { location: any }) {
        return this.documentsService.updateDocument(id, body.location);
    }

    @Delete(':id')
    deleteDocument(@Param('id') id: string) {
        return this.documentsService.deleteDocument(id);
    }
}
