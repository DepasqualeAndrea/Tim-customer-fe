export class PreventivatoreDynamicSharedFunctions {

  public static setContainerClass(products) {
    return products[0].product_code;
  }

  public static replaceInformationPackageLink(text: string, informationPackage: string) {
    return text.replace(/http:\/\/\{\{\s*information_package\s*\}\}/gi, informationPackage);
  }

  public static replaceInfoCondPackageLink(text: string, informationPackage: string, conditionPackage: string) {
    return text.replace(/http:\/\/\{\{\s*information_package\s*\}\}/gi, informationPackage)
               .replace(/http:\/\/\{\{\s*condition_package\s*\}\}/gi, conditionPackage);
  }

  public static isEmptyText(text: string) {
    return (text === '' || text === '<p><br></p>')? true : false
  }

}
