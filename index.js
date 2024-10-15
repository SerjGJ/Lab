const BASE64_ALPHABET =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'

function serialize(numbers) {
  let bitString = ''

  numbers.forEach((num) => {
    let binary = num.toString(2).padStart(9, '0')
    bitString += binary
  })

  let serialized = ''
  for (let i = 0; i < bitString.length; i += 6) {
    let chunk = bitString.slice(i, i + 6)
    let index = parseInt(chunk.padEnd(6, '0'), 2)
    serialized += BASE64_ALPHABET[index]
  }

  return serialized
}

function deserialize(serialized) {
  let bitString = ''

  for (let char of serialized) {
    let index = BASE64_ALPHABET.indexOf(char)
    bitString += index.toString(2).padStart(6, '0')
  }

  let numbers = []
  for (let i = 0; i < bitString.length; i += 9) {
    let chunk = bitString.slice(i, i + 9)
    if (chunk.length === 9) {
      let number = parseInt(chunk, 2)
      numbers.push(number)
    }
  }

  return numbers
}

function compressionRatio(original, compressed) {
  return original.length / compressed.length
}

function runTests() {
  const tests = [
    [[1, 2, 3], 'Простой короткий массив'],
    [[300, 299, 1], 'Максимальные и минимальные значения'],

    [
      Array.from({ length: 50 }, () => Math.floor(Math.random() * 300) + 1),
      '50 случайных чисел',
    ],
    [
      Array.from({ length: 100 }, () => Math.floor(Math.random() * 300) + 1),
      '100 случайных чисел',
    ],
    [
      Array.from({ length: 500 }, () => Math.floor(Math.random() * 300) + 1),
      '500 случайных чисел',
    ],
    [
      Array.from({ length: 1000 }, () => Math.floor(Math.random() * 300) + 1),
      '1000 случайных чисел',
    ],

    [Array(900).fill(1), 'Все числа 1'],
    [Array(900).fill(99), 'Все числа 99'],
    [Array(900).fill(300), 'Все числа 300'],
  ]

  tests.forEach(([numbers, description], index) => {
    const serialized = serialize(numbers)
    const deserialized = deserialize(serialized)
    const ratio = compressionRatio(JSON.stringify(numbers), serialized)

    console.log(`Тест ${index + 1}: ${description}`)
    console.log(
      `Оригинальный массив: ${JSON.stringify(numbers).length} символов`
    )
    console.log(`Сериализованная строка: ${serialized.length} символов`)
    console.log(`Коэффициент сжатия: ${ratio.toFixed(2)}`)
    console.log(
      `Проверка десериализации: ${
        JSON.stringify(numbers) === JSON.stringify(deserialized)
      }\n`
    )
  })
}

runTests()
