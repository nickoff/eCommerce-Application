import { Attribute } from '@commercetools/platform-sdk';
import { IProductAttributes } from '@shared/interfaces/product-attributes';

function createProductAttributesObject(attributeRespData?: Attribute[]): IProductAttributes {
  if (!attributeRespData) {
    return {} as IProductAttributes;
  }

  return attributeRespData.reduce((acc, { name, value }) => {
    Object.assign(acc, { [name]: value.label });
    return acc;
  }, {} as IProductAttributes);
}

export default createProductAttributesObject;
