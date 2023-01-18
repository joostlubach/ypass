export abstract class EnumUtil {

  public static names(enumType: Record<any, any>) {
    return Object.keys(enumType)
  }

}