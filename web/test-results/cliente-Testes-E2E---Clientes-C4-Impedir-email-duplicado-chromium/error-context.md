# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: cliente.spec.js >> Testes E2E - Clientes >> C4: Impedir email duplicado
- Location: e2e\cliente.spec.js:41:5

# Error details

```
ReferenceError: getByRole is not defined
```

# Page snapshot

```yaml
- main [ref=e3]:
  - heading "Lanchonete" [level=1] [ref=e4]
  - navigation [ref=e5]:
    - button "Produtos" [ref=e6]
    - button "Clientes" [disabled] [ref=e7]
    - button "Pedidos" [ref=e8]
  - generic [ref=e9]:
    - heading "Clientes" [level=2] [ref=e10]
    - generic [ref=e11]:
      - textbox "Nome" [ref=e12]: Teste
      - textbox "Email" [active] [ref=e13]: ana@email.com
      - button "Cadastrar" [ref=e14]
    - table [ref=e15]:
      - rowgroup [ref=e16]:
        - row [ref=e17]:
          - columnheader "Nome" [ref=e18]
          - columnheader "Email" [ref=e19]
          - columnheader [ref=e20]
      - rowgroup [ref=e21]:
        - row [ref=e22]:
          - cell "Ana Souza" [ref=e23]
          - cell "ana@email.com" [ref=e24]
          - cell [ref=e25]:
            - button "Editar" [ref=e26]
            - button "Remover" [ref=e27]
        - row [ref=e28]:
          - cell "Bruno Lima" [ref=e29]
          - cell "bruno@email.com" [ref=e30]
          - cell [ref=e31]:
            - button "Editar" [ref=e32]
            - button "Remover" [ref=e33]
```

# Test source

```ts
  1  | import { test, expect } from "@playwright/test"
  2  | 
  3  | test.describe('Testes E2E - Clientes', () => {
  4  |     test.beforeEach(async ({ page, request}) => {
  5  |         const resposta = await request.post('http://localhost:3000/__reset')
  6  |         expect(resposta.status()).toBe(204);
  7  | 
  8  |         await page.goto('/')
  9  |         await page.getByRole('button', {name: "Clientes"}).click()
  10 |     });
  11 | 
  12 |     test('C1: Listar os clientes iniciais', async ({page}) => {
  13 |         await expect(page.getByRole('heading', {name: "Clientes"})).toBeVisible()
  14 | 
  15 |         await expect(page.getByRole("row")).toHaveCount(3)
  16 |         await expect(page.getByRole('cell', {name: "Ana Souza"})).toBeVisible();
  17 |         await expect(page.getByRole('cell', {name: "Bruno Lima"})).toBeVisible();
  18 |     })
  19 | 
  20 |     test('C2: Cadastrar um cliente novo', async ({page}) => {
  21 |         const nomeInput = page.getByLabel("Nome");
  22 |         const emailInput = page.getByLabel("Email");
  23 | 
  24 |         await nomeInput.fill("Carla Dias");
  25 |         await emailInput.fill("carla@email.com")
  26 |         await page.getByRole('button', {name: "Cadastrar"}).click();
  27 | 
  28 |         await expect(page.getByRole('cell', {name: "Carla Dias"})).toBeVisible();
  29 |         await expect(page.getByRole('cell', {name: "carla@email.com"})).toBeVisible();
  30 |         await expect(nomeInput).toHaveValue("")
  31 |         await expect(emailInput).toHaveValue("")
  32 |     })
  33 | 
  34 |     test('C3: Validar campos obrigatórios', async ({page}) =>{
  35 |         await page.getByRole('button', {name: "Cadastrar"}).click()
  36 | 
  37 |         await expect(page.locator("p.erro")).toHaveText("Nome e email sao obrigatorios")
  38 |         await expect(page.getByRole("row").toHaveCount(3))
  39 |     });
  40 | 
  41 |     test('C4: Impedir email duplicado', async ({page}) => {
  42 |         await page.getByLabel("Nome").fill("Teste")
  43 |         await page.getByLabel("Email").fill("ana@email.com")
> 44 |         await getByRole("button", {name: "Cadastrar"}).click()
     |         ^ ReferenceError: getByRole is not defined
  45 | 
  46 |         await expect(page.locator('p.erro')).toHaveText("Email ja cadastrado")
  47 |         await expect(page.getByRole('row')).toHaveCount(3)
  48 |     })
  49 | 
  50 |     test("C5: Editar um cliente", async ({page}) => {
  51 |         const linhaBruno = page.getByRole("row", {name: /Bruno Lima/})
  52 |         await linhaBruno.getByRole('button', {name: 'Editar'}).click()
  53 | 
  54 |         const botaoSalvar = page.getByRole('button', {name: "Salvar"})
  55 |         await expect(botaoSalvar).toBeVisible()
  56 | 
  57 |         await page.getByLabel("Nome").fill("Bruno Lima Silva")
  58 |         await botaoSalvar.click()
  59 | 
  60 |         await expect(page.getByRole("cell", {name: "Bruno Lima Silva"}))
  61 |         await expect(page.getByRole('button', {name: "Cancelar"})).not.toBeVisible()
  62 |     })
  63 | 
  64 |     test("C6: Cancelar edição", async ({page}) => {
  65 |         const linhaAna = page.getByRole("row", {name: /Ana Souza/})
  66 |         await linhaAna .getByRole("button", {name: "Editar"}).click()
  67 | 
  68 |         await page.getByLabel("Nome").fill("Nome Alterado")
  69 |         await page.getByRole("button", {name: "Cancelar"}).click()
  70 | 
  71 |         await expect(page.getByLabel("Nome")).toHaveValue("")
  72 |         await expect(page.getByRole('cell', {name: "Ana Souza"})).toBeVisible()
  73 |     })
  74 | 
  75 |     test("C7: Editar para um email já usado", async ({page}) => {
  76 |         const linhaBruno = page.getByRole('row', {name: /Bruno Lima/})
  77 |         await linhaBruno.getByRole("button", {name: "Editar"}).click()
  78 | 
  79 |         await page.getByLabel("Email").fill("ana@email.com")
  80 |         await page.getByRole("button", {name: "Salvar"}).click()
  81 | 
  82 |         await expect(page.locator('p.erro')).toHaveText('Email ja cadastrado')
  83 |         await expect(page.getByRole('cell', {name: "bruno@email.com"})).toBeVisible()
  84 |     })
  85 | 
  86 |     test("C8: Remover um cliente", async ({page}) => {
  87 |         const linhaBruno = page.getByRole("row", {name: /Bruno Lima/})
  88 |         await linhaBruno.getByRole('button', {name: "Remover"}).click()
  89 | 
  90 |         await expect(linhaBruno).toHaveCount(0)
  91 |         await expect(page.getByRole('row')).toHaveCount(2);
  92 |     })
  93 | })
```