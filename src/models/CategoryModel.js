import KnexConnection from "../utils/KnexConnection.js";

export default class CategoryModel {
    static getAllChildCatWithProductCount(superId) {
        return new Promise(async function (resolve, reject) {
            try {
                const dataSet = await KnexConnection.raw(`
                        select tmp.cat_id, tmp.cat_name, tmp.created_date, COUNT(product_id) as product_count
                        from ( select * from category cat where cat.super_cat_id = ${superId} ) as tmp
                        left join product p on tmp.cat_id = p.cat_id
                        group by tmp.cat_id, tmp.cat_name, tmp.created_date;
                    `);
                resolve(dataSet);
            } catch (err) {
                reject(err);
            }
        });
    }

    static getAllRootCatWithCount() {
        return new Promise(async function (resolve, reject) {
            try {
                const dataSet = await KnexConnection.raw(`
                        select root.cat_id, root.cat_name, root.created_date, COUNT(child.cat_id) as child_count, SUM(child.product_count) as product_count
                        from (
                            select cat_id, cat_name, created_date from category where super_cat_id is null
                        ) as root
                        left join (
                            select tmp.cat_id, tmp.super_cat_id, COUNT(product_id) as product_count
                            from ( select * from category cat where cat.super_cat_id is not null ) as tmp
                            left join product p on tmp.cat_id = p.cat_id
                            group by tmp.cat_id, tmp.super_cat_id
                        ) as child on root.cat_id = child.super_cat_id
                        group by root.cat_id, root.cat_name, root.created_date;
                    `);
                resolve(dataSet);
            } catch (err) {
                reject(err);
            }
        });
    }

    static getRootById(root) {
        return new Promise(async function (resolve, reject) {
            try {
                const dataSet = await KnexConnection("category").where({ cat_id: root }).select();
                resolve(dataSet);
            } catch (err) {
                reject(err);
            }
        });
    }

    static getAll() {
        return new Promise(async function (resolve, reject) {
            try {
                const dataSet = await KnexConnection("category")
                    .whereNull("super_cat_id")
                    .select("cat_id", "cat_name");
                resolve(dataSet);
            } catch (err) {
                reject(err);
            }
        });
    }

    static getAllChild() {
        return new Promise(async function (resolve, reject) {
            try {
                const dataSet = await KnexConnection("category")
                    .whereNotNull("super_cat_id")
                    .select("cat_id", "cat_name", "super_cat_id");
                resolve(dataSet);
            } catch (err) {
                reject(err);
            }
        });
    }

    static insert(entity) {
        return new Promise(async function (resolve, reject) {
            try {
                const dataSet = await KnexConnection("category").insert(entity);
                resolve(dataSet);
            } catch (err) {
                reject(err);
            }
        });
    }

    static updateById(id, entity) {
        return new Promise(async function (resolve, reject) {
            try {
                const dataSet = await KnexConnection("category")
                    .where({ cat_id: id })
                    .update(entity);
                resolve(dataSet);
            } catch (err) {
                reject(err);
            }
        });
    }

    static deleteBySuperCatId(id) {
        return new Promise(async function (resolve, reject) {
            try {
                const dataSet = await KnexConnection("category").where({ super_cat_id: id }).del();
                resolve(dataSet);
            } catch (err) {
                reject(err);
            }
        });
    }

    static deleteByCatId(id) {
        return new Promise(async function (resolve, reject) {
            try {
                const dataSet = await KnexConnection("category").where({ cat_id: id }).del();
                resolve(dataSet);
            } catch (err) {
                reject(err);
            }
        });
    }
}
