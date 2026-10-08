import { test, expect } from "@playwright/test"

test.describe('Teste E2E - Pedidos', () => {
    test.beforeEach(async ({page, request}) => {
        const resposta = await request.post('http://localhost:3000/__reset')
        expect(resposta.status()).toBe(204);

        await page.goto('/')
        await page.getByRole('button', {name: "Pedidos"}).click();
    })
    test("P1: Listar pedidos iniciais", async ({page}) => {
        await expect(page.getByRole('heading', {name: "Pedidos"})).toBeVisible()

        await expect(page.getByRole('cell', {name: "#1"})).toBeVisible()
        await expect(page.getByRole('cell', {name: "Ana Souza"})).toBeVisible()
        await expect(page.getByRole('cell', {name: "2x Coxinha"})).toBeVisible()
        await expect(page.getByRole('cell', {name: "R$ 10,00"})).toBeVisible()

        const selectStatus = page.getByLabel("Status do pedido 1")
        await expect(selectStatus).toHaveValue("pendente")
    })

    test("P2: Montar um pedido com um item", async ({page}) => {
        await page.getByLabel("Cliente").selectOption({label: "Bruno Lima"})
        await page.getByLabel("Produto").selectOption({label: "Pastel"})
        await page.getByRole('button', {name: "Adicionar Item"}).click()

        await expect(page.getByText("1x Pastel")).toBeVisible()

        await page.getByRole('button', {name:"Criar pedido"}).click()

        const novaLinha = page.getByRole('row', {name: /Bruno Lima/})
        await expect(novaLinha).toBeVisible()
        await expect(novaLinha.getByText("1x Pastel")).toBeVisible()
        await expect(novaLinha.getByText("R$ 8,00")).toBeVisible()

        await expect(page.getByLabel("Cliente")).toHaveValue("")
        await expect(page.getByText("1x Pastel")).not.toBeVisible();
    })

    test("P3: Montar um pedido com vários itens e quantidades", async ({page}) => {
        await page.getByLabel("Cliente").selectOption({label: "Ana Souza"})

        await page.getByLabel("Produto").selectOption({label: "Coxinha"})
        await page.getByLabel("Quantidade").fill("3")
        await page.getByRole("button", {name:"Adicionar item"}).click()

        await page.getByLabel("Produto").selectOption({label: "Empada"})
        await page.getByLabel("Quantidade").fill("1")
        await page.getByRole("button", {name:"Adicionar item"}).click()

        await page.getByRole('button', {name:"Criar pedido"}).click()

        const novaLinha = page.getByRole('row', {name: /3x Coxinha, 1x Empada/})
        await expect(novaLinha).toBeVisible()
        await expect(novaLinha.getByText("R$ 21,00")).toBeVisible()
    })

    test("P4: Quantidade volta a 1 após adicionar item", async ({page}) => {
        await page.getByLabel("Quantidade").fill("5")
        await page.getByRole("button", {name:"Adicionar item"}).click()

        await expect(page.getByLabel("Quantidade")).toHaveValue('1')
    })

    test('P5: Não criar pedido sem cliente', async ({ page }) => {
        await page.getByLabel("Produto").selectOption({ label: "Coxinha" });
        await page.getByRole("button", { name: "Adicionar item" }).click();
        await page.getByRole("button", { name: "Criar pedido" }).click();

        await expect(page.locator("p.erro")).toHaveText("Cliente e obrigatorio");
        await expect(page.getByRole("row")).toHaveCount(2);
    });

    test('P6: Não criar pedido sem itens', async  ({ page }) => {
        await page.getByLabel("Cliente").selectOption({ label: "Ana Souza" });
        await page.getByRole("button", { name: "Criar pedido" }).click();

        await expect(page.locator("p.erro")).toHaveText("Pedido deve ter ao menos um item");
    });

    test('P7: Alterar o status de um pedido', async ({ page }) => {
        const selectStatus = page.getByLabel("Status do pedido 1");
        await selectStatus.selectOption("pago");

        await expect(selectStatus).toHaveValue("pago");
    });

    test('P8: Pedido cancelado não pode ser alterado', async ({ page }) => {
        const selectStatus = page.getByLabel("Status do pedido 1");

        await selectStatus.selectOption("cancelado");
        await expect(selectStatus).toHaveValue("cancelado");

        await selectStatus.selectOption("pago");

        await expect(page.locator("p.erro")).toHaveText("Pedido cancelado nao pode ser alterado");
        await expect(selectStatus).toHaveValue("cancelado");
    });
    test('P9: Remover um pedido', async ({ page }) => {
        const linhaPedido1 = page.getByRole("row", { name: /#1/ });
        await linhaPedido1.getByRole("button", { name: "Remover" }).click();

        await expect(linhaPedido1).toHaveCount(0);
        await expect(page.getByRole("row")).toHaveCount(1);
    });
})