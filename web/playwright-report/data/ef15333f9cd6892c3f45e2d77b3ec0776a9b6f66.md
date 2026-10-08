# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: pedidos.spec.js >> Teste E2E - Pedidos >> P9: Remover um pedido
- Location: e2e\pedidos.spec.js:100:5

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: locator.click: Test timeout of 30000ms exceeded.
Call log:
  - waiting for getByRole('row', { name: /#1/ }).getByRole('button', { name: 'Remover' })

```

# Page snapshot

```yaml
- main [ref=e3]:
  - heading "Lanchonete" [level=1] [ref=e4]
  - navigation [ref=e5]:
    - button "Produtos" [ref=e6]
    - button "Clientes" [ref=e7]
    - button "Pedidos" [disabled] [ref=e8]
  - generic [ref=e9]:
    - heading "Pedidos" [level=2] [ref=e10]
    - generic [ref=e11]:
      - combobox "Cliente" [ref=e12]:
        - option "Selecione o cliente" [selected]
        - option "Ana Souza"
        - option "Bruno Lima"
      - combobox "Produto" [ref=e13]:
        - option "Selecione o produto" [selected]
        - option "Coxinha"
        - option "Pastel"
        - option "Empada"
      - spinbutton "Quantidade" [ref=e14]: "1"
      - button "Adicionar item" [ref=e15]
      - button "Criar pedido" [ref=e16]
    - table [ref=e17]:
      - rowgroup [ref=e18]:
        - row [ref=e19]:
          - columnheader "#" [ref=e20]
          - columnheader "Cliente" [ref=e21]
          - columnheader "Itens" [ref=e22]
          - columnheader "Total" [ref=e23]
          - columnheader "Status" [ref=e24]
          - columnheader [ref=e25]
      - rowgroup [ref=e26]:
        - row [ref=e27]:
          - cell "1" [ref=e28]
          - cell "Ana Souza" [ref=e29]
          - cell "2x Coxinha" [ref=e30]
          - cell "R$ 10,00" [ref=e31]
          - cell "pendente" [ref=e32]:
            - combobox "Status do pedido 1" [ref=e33]:
              - option "pendente" [selected]
              - option "pago"
              - option "cancelado"
          - cell [ref=e34]:
            - button "Remover" [ref=e35]
```

# Test source

```ts
  2   | 
  3   | test.describe('Teste E2E - Pedidos', () => {
  4   |     test.beforeEach(async ({page, request}) => {
  5   |         const resposta = await request.post('http://localhost:3000/__reset')
  6   |         expect(resposta.status()).toBe(204);
  7   | 
  8   |         await page.goto('/')
  9   |         await page.getByRole('button', {name: "Pedidos"}).click();
  10  |     })
  11  |     test("P1: Listar pedidos iniciais", async ({page}) => {
  12  |         await expect(page.getByRole('heading', {name: "Pedidos"})).toBeVisible()
  13  | 
  14  |         await expect(page.getByRole('cell', {name: "#1"})).toBeVisible()
  15  |         await expect(page.getByRole('cell', {name: "Ana Souza"})).toBeVisible()
  16  |         await expect(page.getByRole('cell', {name: "2x Coxinha"})).toBeVisible()
  17  |         await expect(page.getByRole('cell', {name: "R$ 10,00"})).toBeVisible()
  18  | 
  19  |         const selectStatus = page.getByLabel("Status do pedido 1")
  20  |         await expect(selectStatus).toHaveValue("pendente")
  21  |     })
  22  | 
  23  |     test("P2: Montar um pedido com um item", async ({page}) => {
  24  |         await page.getByLabel("Cliente").selectOption({label: "Bruno Lima"})
  25  |         await page.getByLabel("Produto").selectOption({label: "Pastel"})
  26  |         await page.getByRole('button', {name: "Adicionar Item"}).click()
  27  | 
  28  |         await expect(page.getByText("1x Pastel")).toBeVisible()
  29  | 
  30  |         await page.getByRole('button', {name:"Criar pedido"}).click()
  31  | 
  32  |         const novaLinha = page.getByRole('row', {name: /Bruno Lima/})
  33  |         await expect(novaLinha).toBeVisible()
  34  |         await expect(novaLinha.getByText("1x Pastel")).toBeVisible()
  35  |         await expect(novaLinha.getByText("R$ 8,00")).toBeVisible()
  36  | 
  37  |         await expect(page.getByLabel("Cliente")).toHaveValue("")
  38  |         await expect(page.getByText("1x Pastel")).not.toBeVisible();
  39  |     })
  40  | 
  41  |     test("P3: Montar um pedido com vários itens e quantidades", async ({page}) => {
  42  |         await page.getByLabel("Cliente").selectOption({label: "Ana Souza"})
  43  | 
  44  |         await page.getByLabel("Produto").selectOption({label: "Coxinha"})
  45  |         await page.getByLabel("Quantidade").fill("3")
  46  |         await page.getByRole("button", {name:"Adicionar item"}).click()
  47  | 
  48  |         await page.getByLabel("Produto").selectOption({label: "Empada"})
  49  |         await page.getByLabel("Quantidade").fill("1")
  50  |         await page.getByRole("button", {name:"Adicionar item"}).click()
  51  | 
  52  |         await page.getByRole('button', {name:"Criar pedido"}).click()
  53  | 
  54  |         const novaLinha = page.getByRole('row', {name: /3x Coxinha, 1x Empada/})
  55  |         await expect(novaLinha).toBeVisible()
  56  |         await expect(novaLinha.getByText("R$ 21,00")).toBeVisible()
  57  |     })
  58  | 
  59  |     test("P4: Quantidade volta a 1 após adicionar item", async ({page}) => {
  60  |         await page.getByLabel("Quantidade").fill("5")
  61  |         await page.getByRole("button", {name:"Adicionar item"}).click()
  62  | 
  63  |         await expect(page.getByLabel("Quantidade")).toHaveValue('1')
  64  |     })
  65  | 
  66  |     test('P5: Não criar pedido sem cliente', async ({ page }) => {
  67  |         await page.getByLabel("Produto").selectOption({ label: "Coxinha" });
  68  |         await page.getByRole("button", { name: "Adicionar item" }).click();
  69  |         await page.getByRole("button", { name: "Criar pedido" }).click();
  70  | 
  71  |         await expect(page.locator("p.erro")).toHaveText("Cliente e obrigatorio");
  72  |         await expect(page.getByRole("row")).toHaveCount(2);
  73  |     });
  74  | 
  75  |     test('P6: Não criar pedido sem itens', async  ({ page }) => {
  76  |         await page.getByLabel("Cliente").selectOption({ label: "Ana Souza" });
  77  |         await page.getByRole("button", { name: "Criar pedido" }).click();
  78  | 
  79  |         await expect(page.locator("p.erro")).toHaveText("Pedido deve ter ao menos um item");
  80  |     });
  81  | 
  82  |     test('P7: Alterar o status de um pedido', async ({ page }) => {
  83  |         const selectStatus = page.getByLabel("Status do pedido 1");
  84  |         await selectStatus.selectOption("pago");
  85  | 
  86  |         await expect(selectStatus).toHaveValue("pago");
  87  |     });
  88  | 
  89  |     test('P8: Pedido cancelado não pode ser alterado', async ({ page }) => {
  90  |         const selectStatus = page.getByLabel("Status do pedido 1");
  91  | 
  92  |         await selectStatus.selectOption("cancelado");
  93  |         await expect(selectStatus).toHaveValue("cancelado");
  94  | 
  95  |         await selectStatus.selectOption("pago");
  96  | 
  97  |         await expect(page.locator("p.erro")).toHaveText("Pedido cancelado nao pode ser alterado");
  98  |         await expect(selectStatus).toHaveValue("cancelado");
  99  |     });
  100 |     test('P9: Remover um pedido', async ({ page }) => {
  101 |         const linhaPedido1 = page.getByRole("row", { name: /#1/ });
> 102 |         await linhaPedido1.getByRole("button", { name: "Remover" }).click();
      |                                                                     ^ Error: locator.click: Test timeout of 30000ms exceeded.
  103 | 
  104 |         await expect(linhaPedido1).toHaveCount(0);
  105 |         await expect(page.getByRole("row")).toHaveCount(1); // Somente o cabeçalho[cite: 11]
  106 |     });
  107 | })
```