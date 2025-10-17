import { Product } from "src/products/entities";
import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";


@Entity('users')
export class User {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text', { unique: true })
    email: string;

    @Column('text')
    password: string;

    @Column('text')
    fullName: string;

    @Column('boolean', {
        default: true
    })
    isActive: boolean;

    @Column('text', { 
        array: true,
        default: ['user'] 
    })
    roles: string[];

    @OneToMany(
        () => Product,
        product => product.user,
        { cascade: true } // Si se borra un usuario, se borran sus productos (en cascada
    )
    product: Product;


    @BeforeInsert()
    checkFieldsBeforeInsert() {
        this.email = this.email.toLowerCase().trim();
    }

    @BeforeUpdate()
    checkFieldsBeforeUpdate() {
        this.checkFieldsBeforeInsert();
    }
}
