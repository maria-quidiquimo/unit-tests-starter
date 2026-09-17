const { soma, subtrai, multiplica, divide, ehPar, raiz, media } = require('./calculadora')

describe("soma", () => {
    test("soma 2 números positivos", () => {
        expect(soma(2, 3)).toBe(5);
    })

    // soma com número negativo
    test("soma com 2 números negativos", () => {
        expect(soma(-2, -3)).toBe(-5);
    })
})

describe("raiz", () => {
    test("calcula a raiz de um número não exato com precisao", () => {
        expect(raiz(2)).toBeCloseTo(1.414)
    })

    test("lança erro para número negativo", () => {
        expect(() => raiz(-4)).toThrow("Nao e possivel calcular raiz de numero negativo")
    })

    // teste para calcular a raiz quadrada de 9
})

describe("subtrai", () => {
    test("subtração com 2 números", () => {
        expect(subtrai(12, 6)).toBe(6)
    })
    test("Subtração onde o resultado deve ser negativo", () => {
        expect(subtrai(6, 12)).toBe(-6)
    })
})

describe("multiplica", () => {
    test("Multiplica 2 numeros positivos e maior que 0", () => {
        expect(multiplica(2, 4)).toBe(8)
    })
    test("Multiplica 2 números onde um deles é 0", () => {
        expect(multiplica(2, 0)).toBe(0)
    })
    test("Multiplica dois numeros onde o resultado tem que ser maior que os dois numeros", () => {
        const resultado = multiplica(3, 4)

        expect(resultado).toBeGreaterThan(3)
        expect(resultado).toBeGreaterThan(4)
    })
})

describe("divide", () => {
    test("Retorna o número correto da divisão de dois numeros", () => {
        expect(divide(4, 2)).toBe(2)
    })
    test("Lançar um erro quando um dos valores for 0", () => {
        expect(() => divide(4, 0)).toThrow('Nao e possivel dividir por zero')
    })
})

describe("ehPar", () => {
    test("Retornar Verdadeiro para número par", () => {
        expect(ehPar(4)).toBeTruthy()
    })
    test("Retornar Falso para número ímpar", () => {
        expect(ehPar(3)).toBeFalsy()
    })
})

describe("media", () => {
    test("Calcular a média de uma lista de números inteiros", () => {
        const notas = [7, 8, 5, 9, 10]
        expect(media(notas)).toBe(7.8)
    })

    test("Deve calcular corretamente a media quando o resultado for decimal", () => {
        expect(media([1, 2])).toBe(1.5)
    })

    test("Deve lancar erro quando a lista estiver vazia", () => {
        expect(() => media([])).toThrow()
    })

    test("Deve lancar erro quando o argumento nao for um array", () => {
        expect(() => media("nao e array")).toThrow()
    })
})