import { IsNotEmpty, IsNumber, IsPositive } from "class-validator"
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm"
import { NumericTransformer } from "../../util/numerictransformer"
import { Categoria } from "../../categoria/entities/categoria.entity"
import { Transform, TransformFnParams } from "class-transformer"

@Entity({ name: "tb_produtos" })
export class Produto {

    @PrimaryGeneratedColumn()
    id: number

    @Transform(({ value }: TransformFnParams) => value?.trim())
    @IsNotEmpty()
    @Column({ length: 255, nullable: false })
    nome: string

    @Transform(({ value }: TransformFnParams) => value?.trim())
    @IsNotEmpty() 
    @Column({length: 2000, nullable: false}) 
    sobre: string;

    @IsNumber({ maxDecimalPlaces: 2 })
    @IsNotEmpty()
    @IsPositive()
    @Column({ type: "decimal", precision: 10, scale: 2, transformer: new NumericTransformer() })
    preco: number

    @IsNotEmpty()
    @Column()
    dataValidade: string

    @Column({length: 2000})
    foto: string

    @ManyToOne(() => Categoria, (categoria) => categoria.produto, {
        onDelete: "CASCADE"
    })
    categoria: Categoria

}