import { SimpleDate } from "../../../packages/YipStackLib/packages/YipAddress/util/date";

export function mockAddressItemFromYipCode(yipCode: string, lastUpdated: SimpleDate) {
    return {
      address: {
        addressLines: ["123 Fake Street", "Imaginary Road", "Nowhereville", "Nonexistentland", "FUNPOSTCODE123"],
        aliasMap: {
          postCode: 4
        }
      },
      addressMetadata: { lastUpdated },
      yipCode
    }
  }