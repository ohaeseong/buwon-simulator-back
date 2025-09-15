import { Category } from 'src/modules/category/category.entity';
import { Option } from 'src/modules/option/option.entity';
import { Product } from 'src/modules/product/product.entity';

export async function getOptionByProductId(id: string) {
  try {
    const response = await fetch(
      `${process.env.CAFE_API_URL}/products/${id}/options`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // 'X-Cafe24-Api-Version': '{version}',
          'X-Cafe24-Client-Id': `${process.env.CAFE_CLIENT_ID}`,
        },
      },
    );

    const data = await response.json();

    return data?.options ?? [];
  } catch (error) {
    console.log(error);
  }
}

export async function getCategoriesByParentCategory(id: number) {
  try {
    const response = await fetch(
      `${process.env.CAFE_API_URL}/categories?parent_category_no=${id}&offset=0&limit=100&selling=T&display=T`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // 'X-Cafe24-Api-Version': '{version}',
          'X-Cafe24-Client-Id': `${process.env.CAFE_CLIENT_ID}`,
        },
      },
    );

    const data = await response.json();

    return data?.categories ?? [];
  } catch (error) {
    console.log(error);
  }
}

export async function getProductsByCategory(
  categoryId: number,
  offset: number,
  limit: number,
) {
  try {
    const response = await fetch(
      `${process.env.CAFE_API_URL}/products?category=${categoryId}&offset=${offset}&limit=${limit}&selling=T&display=T`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // 'X-Cafe24-Api-Version': '{version}',
          'X-Cafe24-Client-Id': `${process.env.CAFE_CLIENT_ID}`,
        },
      },
    );

    const data = await response.json();

    return data?.products ?? [];
  } catch (error) {
    console.log(error);
  }
}

export async function getProductCountByCategory(categoryId: number) {
  try {
    const response = await fetch(
      `${process.env.CAFE_API_URL}/products/count?category=${categoryId}&selling=T&display=T`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // 'X-Cafe24-Api-Version': '{version}',
          'X-Cafe24-Client-Id': `${process.env.CAFE_CLIENT_ID}`,
        },
      },
    );

    const data = await response.json();

    return data?.count ?? [];
  } catch (error) {
    console.log(error);
  }
}

export function makeArrayToSaveOptionToDB(resource, product: Product) {
  const options: Option[] = [];

  resource.options.forEach((option) => {
    option.option_value.forEach((value) => {
      options.push({
        name: convertKoreanToEnglish(option.option_name),
        value: value.option_text,
        required: option.required_option,
        productId: product.id,
      });
    });
  });

  return options;
}

export function makeArrayToSaveProductToDB(resource) {
  const products: Product[] = [];
  resource.forEach((product) => {
    const prodcutId = products.find(
      (refinedProduct) => refinedProduct.id === product.product_no,
    );
    if (prodcutId === undefined) {
      products.push({
        id: product.product_no,
        productName: product.product_name,
        engProductName: product.eng_product_name,
        customProductCode: product.custom_product_code,
        modelName: product.model_name,
        price: product.price,
        retailPrice: product.retail_price,
        display: product.display,
        selling: product.selling,
        productUsedMonth: product.product_used_month,
        summaryDescription: product.summary_description,
        listImage: product.list_image,
        category: product.category,
        parentCategory: product.parentCategory,
      });
    }
  });

  return products;
}

export function makeArrayToSaveCategoryToDB(resource): Array<Category> {
  const categories = resource.map((category: any) => {
    return {
      id: category.category_no,
      name: category.category_name,
      parentCategoryId: category.parent_category_no,
      categoryDepth: category.category_depth || 1,
      rootCategoryId: category.root_category_no,
      displayOrder: category.display_order,
      useDisplay: category.use_display || 'F',
      productCount: resource.productCount,
    };
  });

  return categories.filter((category) => !!category);
}

export function convertKoreanToEnglish(name: string) {
  switch (name) {
    case '높이':
      return 'height';
    case '깊이':
      return 'depth';
    case '가로':
      return 'width';
    case '단수':
      return 'deskCount';
    case '독립/연결':
      return 'connectType';
    default:
      return name;
  }
}
