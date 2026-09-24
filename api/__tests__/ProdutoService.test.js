const ProdutoService = require('../services/ProdutoService')

describe("ProdutoService - teste Unitário", () => {
    let service;
    let mockRepository;

    beforeEach(() => {
        mockRepository = {
            findAll: jest.fn(), // função vazia, que não faz nada
            findById: jest.fn(),
            create: jest.fn(),
            delete: jest.fn(),
        };

        service = new ProdutoService(mockRepository);
    })

    describe("listar", () => {
        test("chama repository.findAll uma vez e retorna o resultado", () => {
            const produtos = [{id: 1, nome: "Coxinha", preco: 5}];

            mockRepository.findAll.mockReturnValue(produtos);

            const resultado = service.listar();

            expect(mockRepository.findAll).toHaveBeenCalledTimes(1);
            expect(resultado).toEqual(produtos);
        })
    })

    describe('criar', () => {
        test('deve passar dados para mockRepository.create e retornar o produto criado', () => {
            const dadosProduto = {nome: 'Pastel', preco: 6}
            const produtoCriado = {id: 1, ...dadosProduto}

            mockRepository.create.mockReturnValue(produtoCriado)

            const resultado = service.criar(dadosProduto);

            expect(mockRepository.create).toHaveBeenCalledWith(dadosProduto);
            expect(resultado).toEqual(produtoCriado);
        });

        test('Deve programar o erro lancado pelo repository quando os dados forem invalidos', () => {
            const dadosInvalidos = {nome: 'Empada'}
            const mensagemErro = 'Nome e preco sao obrigatorios'

            mockRepository.create.mockImplementation(() =>{
                throw new Error(mensagemErro);
            })

            expect(() => service.criar(dadosInvalidos)).toThrow(mensagemErro)
        })
    })

    describe("remover", () => {
        test('Deve chzmer mockRepository.delete com o id correto quando o produto existe', () => {
            const id = 1;
            mockRepository.delete.mockReturnValue(true)

            expect(() => service.remover(id)).not,toThrow();
            expect(mockRepository.delete).toHaveBeenCalledWith(id)
        })

        test("Deve lancar erro 'Produto não encontrado' quando o repositorio retorna false", () => {
            const idInexistente = 999;
            mockRepository.delete.mockReturnValue(false)

            expect(() => service.remover(idInexistente)).toThrow("Produto nao encontrado")
            expect(mockRepository.delete).toHaveBeenCalledWith(idInexistente)
        });
    });
})