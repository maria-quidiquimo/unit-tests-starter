import { test, expect } from "@playwright/test"

test.describe('Testes E2E - Clientes', () => {
    test.beforeEach(async ({ page, request}) => {
        const resposta = await request.post('http://localhost:3000/__reset")')
        expect(resposta.status().toBe(204));

        await page.goto('/')
        await page.getByRole('button', {name: "Clientes"}).click()
    });

    test('C1: Listar os clientes iniciais', async ({page}) => {
        await expect(page.getByRole('heading', {name: "Clientes"})).toBeVisible()

        await expect(page.getByRole("row")).toHaveCount(3)
        await expect(page.getByRole('cell', {name: "Ana Souza"})).toBeVisible();
        await expect(page.getByRole('cell', {name: "Bruno Lima"})).toBeVisible();
    })

    test('C2: Cadastrar um cliente novo', async ({page}) => {
        const nomeInput = page.getByLabel("Nome");
        const emailInput = page.getByLabel("Email");

        await nomeInput.fill("Carla Dias");
        await emailInput.fill("carla@email.com")
        await page.getByRole('button', {name: "Cadastrar"}).click();

        await expect(page.getByRole('cell', {name: "Carla Dias"})).toBeVisible();
        await expect(page.getByRole('cell', {name: "carla@email.com"})).toBeVisible();
        await expect(nomeInput).toHaveValue("")
        await expect(emailInput).toHaveValue("")
    })

    test('C3: Validar campos obrigatórios', async ({page}) =>{
        await page.getByRole('button', {name: "Cadastrar"}).click()

        await expect(page.locator("p.erro")).toHaveText("Nome e email sao obrigatorios")
        await expect(page.getByRole("row").toHaveCount(3))
    });

    test('C4: Impedir email duplicado', async ({page}) => {
        await page.getByLabel("Nome").fill("Teste")
        await page.getByLabel("Email").fill("ana@email.com")
        await getByRole("button", {name: "Cadastrar"}).click()

        await expect(page.locator('p.erro')).toHaveText("Email ja cadastrado")
        await expect(page.getByRole('row')).toHaveCount(3)
    })

    test("C5: Editar um cliente", async ({page}) => {
        const linhaBruno = page.getByRole("row", {name: /Bruno Lima/})
        await linhaBruno.getByRole('button', {name: 'Editar'}).click()

        const botaoSalvar = page.getByRole('button', {name: "Salvar"})
        await expect(botaoSalvar).toBeVisible()

        await page.getByLabel("Nome").fill("Bruno Lima Silva")
        await botaoSalvar.click()

        await expect(page.getByRole("cell", {name: "Bruno Lima Silva"}))
        await expect(page.getByRole('button', {name: "Cancelar"})).not.toBeVisible()
    })

    test("C6: Cancelar edição", async ({page}) => {
        const linhaAna = page.getByRole("row", {name: /Ana Souza/})
        await linhaAna .getByRole("button", {name: "Editar"}).click()

        await page.getByLabel("Nome").fill("Nome Alterado")
        await page.getByRole("button", {name: "Cancelar"}).click()

        await expect(page.getByLabel("Nome")).toHaveValue("")
        await expect(page.getByRole('cell', {name: "Ana Souza"})).toBeVisible()
    })

    test("C7: Editar para um email já usado", async ({page}) => {
        const linhaBruno = page.getByRole('row', {name: /Bruno Lima/})
        await linhaBruno.getByRole("button", {name: "Editar"}).click()

        await page.getByLabel("Email").fill("ana@email.com")
        await page.getByRole("button", {name: "Salvar"}).click()

        await expect(page.locator('p.erro')).toHaveText('Email ja cadastrado')
        await expect(page.getByRole('cell', {name: "bruno@email.com"})).toBeVisible()
    })

    test("C8: Remover um cliente", async ({page}) => {
        const linhaBruno = page.getByRole("row", {name: /Bruno Lima/})
        await linhaBruno.getByRole('button', {name: "Remover"}).click()

        await expect(linhaBruno).toHaveCount(0)
        await expect(page.getByRole('row')).toHaveCount(2);
    })
})