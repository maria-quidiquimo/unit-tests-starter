const request = require('supertest');
const createApp = require('../app');
const expectCookies = require('supertest/lib/cookies');

//Comentários
// Teste de integracao: testa a API de ponta a ponta via HTTP real.
// Cada teste recebe uma app nova (factory), garantindo estado isolado.

// Abaixo ha 1 teste pronto (GET /clientes) como referencia de estilo.
// Os demais estao como test.todo — implemente cada um seguindo o ENUNCIADO-02-CLIENTES.md.

describe('API /clientes (integracao com supertest)', () => {
  let app;

  beforeEach(() => {
    app = createApp();
  });

  describe('GET /clientes', () => {
    test('retorna 200 e um array com os clientes iniciais', async () => {
      const res = await request(app).get('/clientes');

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBe(2);
    });
  });

  describe('GET /clientes/:id', () => {
    test('retorna 200 e o cliente quando o id existe', async () => {
      const res = await request(app).get('/clientes/1');

      expect(res.status).toBe(200)
      expect(res.body).toHaveProperty('id', 1)
      expect(res.body).toHaveProperty('nome')
      expect(res.body).toHaveProperty('email')
    });

    test('retorna 404 com mensagem de erro quando o cliente nao existe', async () => {
      const res = await request(app).get('/clientes/999');

      expect(res.status).toBe(404)
      expect(res.body).toHaveProperty('erro')
    });
  });

  describe('POST /clientes', () => {
    test('retorna 201 e o cliente criado com id gerado', async () => {
      const novoCliente = {
        nome: 'Novo Cliente',
        email: 'novo@email.com'
      };

      const res = await request(app)
        .post('/clientes')
        .send(novoCliente);

      expect(res.status).toBe(201)
      expect(res.body).toHaveProperty('id')
      expect(res.body).toBe(novoCliente.nome)
      expect(res.body).toBe(novoCliente.email)
    });

    test('retorna 400 quando o nome esta faltando', async () => {
      const res = await request(app)
        .post('/clientes')
        .send({email: 'semnome@email.com'})

      expect(res.body).toBe(400)
      expect(res.body).toHaveProperty('erro')
    });

    test('retorna 400 quando o email esta faltando', async () => {
      const res = await request(app)
        .post('/clientes')
        .send({nome: 'Sem Email'})

      expect(res.status).toBe(400)
      expect(res.body).toHaveProperty('erro')
    });

    test('retorna 400 quando o email ja esta cadastrado', async () => {
      const lista = await request(app).get('/clientes')
      const emailExistente = lista.body[0].email;

      const res = await request(app)
        .post('/clientes')
        .send({
          nome: 'Duplicado',
          email: emailExistente
        });

        expect(res.status.toBe(400));
    });

    test('cliente criado aparece em GET /clientes', async () => {
      const novoCliente = {
        nome: 'Cliente Extra',
        email: 'extra@email.com'
      }

      await request(app)
        .post('/clientes')
        .send(novoCliente)

      const res = await request(app).get('/clientes')

      expect(res.status).toBe(200)
      expect(res.body.length).toBe(3)
      expect(res.body).toContainEqual(expect.objectContaining(novoCliente))
    });
  });

  describe('PUT /clientes/:id', () => {
    test('retorna 200 e o cliente atualizado quando o id existe', async () => {
      const dadosAtualizados = {
        nome: 'Nome Atualizado',
        email: 'atualizado@email.com'
      }

      const res = await request(app)
        .put('/clientes/1')
        .send(dadosAtualizados);

      expect(res.status).toBe(200)
      expect(res.body.id).toBe(1)
      expect(res.body.nome).toBe(dadosAtualizados.nome);
      expect(res.body.email).toBe(dadosAtualizados.email)
    });

    test('retorna 404 quando o cliente nao existe', async () => {
      const res = await request(app)
        .put('/clientes/999')
        .send({
          nome: 'Inexistente',
          email: 'inexistente@email.com'
        })

        expect(res.status).toBe(404)
    });

    test('retorna 400 quando o novo email ja pertence a outro cliente', async () => {
      const lista = await request(app).get('/clientes')
      const emailDoCliente2 = lista.body[1].email

      const res = await request(app)
        .put('/clientes/1')
        .send({
          nome: 'Cliente 1 Alterado',
          email: emailDoCliente2
        })

        expect(res.status).toBe(400)
    });
  });

  describe('DELETE /clientes/:id', () => {
    test('retorna 204 quando o cliente e removido com sucesso', async () => {
      const res = await request(app).delete('/cliente/1')

      expect(res.status).toBe(204)
    });

    test('cliente removido nao aparece mais na listagem', async () => {
      await request(app).get('/clientes/1')

      const res = await request(app).get('/cliente/1')

      expect(res.status).toBe(404)
    });

    test.todo('retorna 404 quando o cliente nao existe', async () => {
      const res = await request(app).delete('/cliente/999')

      expect(res.status).toBe(404)
      expect(res.body).toHaveProperty('erro')
    });
  });
});
