// Convert numbers to an alphabetic representation that preserves order (and suffix the number for good measure)
export function numberToAlpha(i: number, padZeroes: number){
    const strNumber = String(i)
      .padStart(padZeroes, '0')
      .replaceAll("0", "A")
      .replaceAll("1", "B")
      .replaceAll("2", "C")
      .replaceAll("3", "D")
      .replaceAll("4", "E")
      .replaceAll("5", "F")
      .replaceAll("6", "G")
      .replaceAll("7", "H")
      .replaceAll("8", "I")
      .replaceAll("9", "J")
    return strNumber
  }