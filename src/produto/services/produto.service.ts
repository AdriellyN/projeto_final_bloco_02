import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { DeleteResult, LessThan, Like, MoreThan, Repository } from "typeorm";
import { Produto } from "../entities/produto.entity";
import { CategoriaService } from "../../categoria/services/categoria.service";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class ProdutoService {
    constructor(
        @InjectRepository(Produto)
        private produtoRepository: Repository<Produto>,
        private categoriaService: CategoriaService
    ) { }

    async findAll(): Promise<Produto[]> {
        return await this.produtoRepository.find(
            {
                relations: {
                    categoria: true
                }
            }
        );
    }

    async findById(id: number): Promise<Produto> {

        let produto = await this.produtoRepository.findOne({
            where: {
                id
            },
            relations: {
                categoria: true
            }
        });

        if (!produto)
            throw new HttpException('Produto não encontrado!', HttpStatus.NOT_FOUND);

        return produto;

    }

    async findByNome(nome: string): Promise<Produto[]> {
        return await this.produtoRepository.find({
            where: {
                nome: Like(`%${nome}%`)
            },
            relations: {
                categoria: true
            }
        })
    }

    async create(produto: Produto): Promise<Produto> {

        await this.categoriaService.findById(produto.categoria.id)

        return await this.produtoRepository.save(produto);

    }

    async update(produto: Produto): Promise<Produto> {

        await this.findById(produto.id);

        await this.categoriaService.findById(produto.categoria.id)

        return await this.produtoRepository.save(produto);

    }

    async delete(id: number): Promise<DeleteResult> {

        await this.findById(id);

        return await this.produtoRepository.delete(id);

    }

}