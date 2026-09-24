const ClienteService = require("../services/ClienteService");

//Comentários
// Teste unitario: o service e testado em isolamento total.
// O repository e substituido por um mock (jest.fn()), assim testamos so a logica do service, sem depender de dados reais.

// Abaixo ha 1 teste pronto (listar) como referencia de estilo.
// Os demais estao como test.todo — implemente cada um seguindo o ENUNCIADO-02-CLIENTES.md.

describe("ClienteService (unitario com mocks)", () => {
  let service;
  let mockRepository;

  beforeEach(() => {
    mockRepository = {
      findAll: jest.fn(),
      findById: jest.fn(),
      findByEmail: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    service = new ClienteService(mockRepository);
  });

  describe("listar", () => {
    test("chama repository.findAll uma vez e retorna o resultado", () => {
      const clientes = [{ id: 1, nome: "Ana Souza", email: "ana@email.com" }];
      mockRepository.findAll.mockReturnValue(clientes);

      const resultado = service.listar();

      expect(mockRepository.findAll).toHaveBeenCalledTimes(1);
      expect(resultado).toEqual(clientes);
    });
  });

  describe("buscarPorId", () => {
    test("repassa o id ao repository e retorna o cliente encontrado", () => {
      const clienteMock = { id: 1, nome: "Ana Souza", email: "ana@email.com"}
      mockRepository.findById.mockReturnValue(clienteMock)

      const resultado = service.buscarPorId(1);

      expect(mockRepository.findById).toHaveBeenCalledWith(1)
      expect(resultado).toEqual(clienteMock)
    });

    test("lanca erro 'Cliente nao encontrado' quando o repository retorna null", () => {
      mockRepository.findById.mockReturnValue(null)

      expect(() => service.buscarPorId(999)).toThrow("Cliente nao encontrado")
      expect(mockRepository.findById).toHaveBeenCalledWith(999)
    });
  });

  describe("criar", () => {
    test("repassa os dados ao repository e retorna o cliente criado", () => {
      const dadosNovoCliente = {nome: "Carlos Lima", email: 'carlos@email.com'}
      const clienteCriadoMock = {id: 3, ...dadosNovoCliente}

      mockRepository.findByEmail.mockReturnValue(null)
      mockRepository.create.mockReturnValue(clienteCriadoMock)

      const resultado = service.criar(dadosNovoCliente)

      expect(mockRepository.create).toHaveBeenCalledWith(dadosNovoCliente)
      expect(resultado).toEqual(clienteCriadoMock)
    });

    test("propaga o erro quando nome ou email estiverem faltando", () => {
      const dadosIncompletos = {email: 'semnome@email.com'}

      expect(() => service.criar(dadosIncompletos)).toThrow()
    });

    test("propaga o erro quando o email ja estiver cadastrado", () => {
      const clienteExistente = { id: 1, nome: 'Ana Souza', email: 'ana@email.com'}
      mockRepository.findByEmail.mockReturnValue(clienteExistente)

      const dadosNovoCliente = {nome: 'Ana Clona', email: 'ana@email.com'}

      expect(() => service.criar(dadosNovoCliente)).toThrow("Email ja cadastrado")
    });
  });

  describe("atualizar", () => {
    test("chama repository.findById e repository.update quando o cliente existe", () => {
      const clienteExistente = {id: 1, nome: 'Ana Souza', email: 'ana@email.com'}
      const dadosAtualizacao = {nome: 'Ana Souza Silva', email: 'ana.silva@email.com'}
      const clienteAtualizadoMock = {id: 1, ...dadosAtualizacao}

      mockRepository.findById.mockReturnValue(clienteExistente)
      mockRepository.findByEmail.mockReturnValue(null)
      mockRepository.update.mockReturnValue(clienteAtualizadoMock)

      const resultado = service.atualizar(1, dadosAtualizacao)

      expect(mockRepository.findById).toHaveBeenCalledWith(1)
      expect(mockRepository.update).toHaveBeenCalledWith(1, dadosAtualizacao)
      expect(resultado).toEqual(clienteAtualizadoMock)
    });

    test("lanca erro 'Cliente nao encontrado' sem chamar repository.update quando o cliente nao existe", () => {
      mockRepository.findById.mockReturnValue(null);

      const dadosAtualizacao = {nomd: 'Inexistente', email: 'inexistente@email.com'}

      expect(() => service.atualizar(999, dadosAtualizacao)).toThrow("Cliente nao encontrado")
      expect(mockRepository.findById).toHaveBeenCalledWith(999)
      expect(mockRepository.update).not.toHaveBeenCalledWith()
    });

    test("propaga o erro quando o novo email ja pertence a outro cliente", () => {
      const clienteExistente = {id: 1, nome: "Ana Souza", email: "ana@email.com"}
      const outroCliente = { id: 2, nome: "Bruno Ramos", email: "bruno@email.com"}

      mockRepository.findById.mockReturnValue(clienteExistente)
      mockRepository.findByEmail.mockReturnValue(outroCliente)

      const dadosAtualizacao = { nome: "Ana Souza", email: "bruno@email.com"}

      expect(() => service.atualizar(1, dadosAtualizacao)).toThrow()
    });
  });

  describe("remover", () => {
    test("chama repository.delete com o id correto quando o cliente existe", () => {
      mockRepository.delete.mockReturnValue(true)

      expect(() => service.remover(1)).not.toThrow()
      expect(mockRepository.delete).toHaveBeenCalledWith(1)
    });

    test("lanca erro 'Cliente nao encontrado' quando o repository retorna false", () => {
      mockRepository.delete.mockReturnValue(false)

      expect(() => service.remover(999)).toThrow("Cliente nao encontrado")
      expect(mockRepository.delete).toHaveBeenCalledWith(999)
    });
  });
});
