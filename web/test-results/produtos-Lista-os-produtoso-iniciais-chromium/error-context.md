# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: produtos.spec.js >> Lista os produtoso iniciais
- Location: e2e\produtos.spec.js:9:1

# Error details

```
TypeError: resposta.status(...).toBe is not a function
```

# Test source

```ts
  1  | import {test, expect} from "@playwright/test"
  2  | 
  3  | test.beforeEach(async ({page, request}) => {
  4  |     const resposta = await request.post("http://localhost:3000/__reset")
> 5  |     expect(resposta.status().toBe(204));
     |                              ^ TypeError: resposta.status(...).toBe is not a function
  6  |     await page.goto("/"); //abrindo o navegador padrão
  7  | })
  8  | 
  9  | test("Lista os produtoso iniciais", async ({page}) => {
  10 |     await expect(page.getByRole("heading", {name: "Produto"})).toBeVisible(); // getByRole pega o papel do elemento
  11 |     await expect(page.getByRole("row")).toHaveCount(4);
  12 |     await expect(page.getByRole("cell", {name: "Coxinha"})).toBeVisible();
  13 | })
  14 | 
  15 | test("Cadastra um produto novo", async ({page}) => {
  16 |     await page.getByLabel("Nome").fill("Kibe");
  17 |     await page.getByLabel("Preco").fill("7");
  18 |     await page.getByRole("button", {name: "Cadastrar"}).click();
  19 | 
  20 |     const linha = page.getByRole("row", {name: /Kibe/})
  21 |     await expect(linha).toBeVisible()
  22 |     await expect(linha).toContainText("R$7,00")
  23 | })
  24 | 
  25 | test("Mostra erro ao cadastrar sem preenchimento", async ({page}) => {
  26 |     await page.getByRole("button", {name: "Cadastrar"}).click()
  27 |     await expect(page.getByText("Nome e preco sao obrigatorios")).toBeVisible()
  28 | })
  29 | 
  30 | test("Remove um produto", async ({page}) => {
  31 |     const linha = page.getByRole("row", {name: /Pastel/ })
  32 |     await linha.getByRole("button", {name: "Remover"}).click()
  33 |     await expect(linha).toHaveCount(0)
  34 | })
```