import { Injectable } from '@nestjs/common';
import { ProductsService } from '../products/products.service';
import { initialData } from './data/seed-data';

@Injectable()
export class SeedService {

    constructor(
        private readonly productsService: ProductsService
    ) {}


    async runSeed() {

        this.insertNewProducts();

        return 'Execute Seed'
    }

    private async insertNewProducts() {
        this.productsService.deleteAllProduct();

        const products = initialData.products;

        const insertPromises: Promise<any>[] = [];

        products.forEach( product => {
            insertPromises.push( this.productsService.create(product) )
        });

        await Promise.all( insertPromises );

        return true;
    }
}
