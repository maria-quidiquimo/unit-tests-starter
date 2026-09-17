const request = require("supertest");
const createApp = require('../app');
const expectCookies = require("supertest/lib/cookies");

describe('API/produtos - teste de integração', () => {
    let app;

    beforeEach(() => {
        app = createApp();
    })

    describe('GET/produtos', () => {
        test("Retorna 200 e um array com produtos iniciais", async () => {
            const res = await request(app).get("/produtos");

            expect(res.status).toBe(200);
            expect(Array.isArray(res.body)).toBe(true);
            expect(res.body.length).toBe(3);
        })
    })

    describe('POST /produtos', () => {
        test("Deve retornar 201 e o produto criado com id gerado", async () => {
            const novoProduto = { nome: "Fogazza", preco: 7}

            const res = await request(app)
                .post('/produtos')
                .send(novoProduto)

            expect(res.status).toBe(201);
            expect(res.body).toHaveProperty('id');
            expect(res.body.nome).toBe('Kibe')
            expect(res.body.preco).toBe(7);
        })

        test("Deve retornar 400 com { erro: ... } quando o nome estiver faltando", async () => {
            const res = await request(app)
                .post("/produtos")
                .send({ preco: 7 });

            expect(res.status).toBe(400);
            expect(res.body).toHaveProperty("erro");
        });

        test("Deve retornar 400 com { erro: ... } quando o preco estiver faltando", async () => {
            const res = await request(app)
                .post("/produtos")
                .send({ nome: "Kibe" });

            expect(res.status).toBe(400);
            expect(res.body).toHaveProperty("erro");
        });

        test("O produto criado deve aparecer em uma chamada seguinte a GET /produtos", async () => {
            const novoProduto = { nome: "Esfiha", preco: 8 };

            await request(app)
                .post("/produtos")
                .send(novoProduto);

            const resGet = await request(app).get("/produtos");

            expect(resGet.status).toBe(200);
            const nomes = resGet.body.map(p => p.nome);
            expect(nomes).toContain("Esfiha");
        });
    });

    describe('DELETE /produtos/:id', () => {
        test("Deve retornar 204 quando o produto e removido com sucesso e nao aparecer mais em GET /produtos/:id", async () => {
            const resDelete = await request(app).delete("/produtos/1");

            expect(resDelete.status).toBe(204);

            const resGet = await request(app).get("/produtos/1");
            expect(resGet.status).toBe(404);
        });

        test("Deve retornar 404 com { erro: ... } quando o produto nao existir", async () => {
            const res = await request(app).delete("/produtos/9999");

            expect(res.status).toBe(404);
            expect(res.body).toHaveProperty("erro");
        });
    });
})