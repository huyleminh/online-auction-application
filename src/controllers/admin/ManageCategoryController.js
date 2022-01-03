import AuthMiddlewares from "../../middlewares/AuthMiddlewares.js";
import CategoryModel from "../../models/CategoryModel.js";
import AppController from "../AppController.js";

export default class ManagCategoryController extends AppController {
    constructor() {
        super();

        this.init();
    }

    init() {
        this._router.get(
            "/api/admin/categories/datalist",
            AuthMiddlewares.authorizeAdmin,
            this.getDataList
        );
        this._router.get(
            "/admin/categories/:id",
            AuthMiddlewares.authorizeAdmin,
            this.childrenCategoryPage
        );
        this._router.get("/admin/categories", AuthMiddlewares.authorizeAdmin, this.categoryPage);
        this._router.post(
            "/admin/categories/create",
            AuthMiddlewares.authorizeAdmin,
            this.postCreateCat
        );
        this._router.post(
            "/admin/categories/delete",
            AuthMiddlewares.authorizeAdmin,
            this.postDeleteCat
        );
        this._router.post(
            "/admin/categories/update",
            AuthMiddlewares.authorizeAdmin,
            this.postUpdateCat
        );
    }

    async categoryPage(req, res) {
        try {
            let [rootCatList] = await CategoryModel.getAllRootCatWithCount();
            if (rootCatList === undefined) {
                rootCatList = [];
            }

            rootCatList = rootCatList.map((cat, index) => {
                return {
                    ...cat,
                    product_count:
                        cat.product_count === null ? 0 : Number.parseInt(cat.product_count),
                    index: index + 1,
                };
            });

            res.render("pages/admin/category-list", {
                layout: "admin",
                data: {
                    catList: rootCatList,
                },
            });
        } catch (error) {
            console.log(error);
            res.render("pages/admin/category-list", {
                layout: "admin",
                data: {
                    catList: [],
                },
            });
        }
    }

    async postCreateCat(req, res) {
        const { body } = req;

        try {
            if (body.superCat.trim() === "") {
                await CategoryModel.insert({
                    super_cat_id: null,
                    cat_name: body.catName,
                });
            } else {
                await CategoryModel.insert({
                    super_cat_id: Number.parseInt(body.superCat),
                    cat_name: body.catName,
                });
            }
            res.redirect("/admin/categories");
        } catch (error) {
            console.log(error);
            throw new Error(error);
        }
    }

    async postDeleteCat(req, res) {
        const { body } = req;

        try {
            await CategoryModel.deleteBySuperCatId(parseInt(body.catId));
            await CategoryModel.deleteByCatId(parseInt(body.catId));
            return res.redirect("/admin/categories");
        } catch (error) {
            console.log(error);
            throw new Error(error);
        }
    }

    async postUpdateCat(req, res) {
        const { body } = req;

        try {
            const entity = { cat_name: body.catName };
            if (body.superCat) {
                entity.super_cat_id = parseInt(body.superCat);
            }
            await CategoryModel.updateById(parseInt(body.catId), entity);
            return res.redirect("/admin/categories");
        } catch (error) {
            console.log(error);
            throw new Error(error);
        }
    }

    async childrenCategoryPage(req, res) {
        const { id } = req.params;
        try {
            const [root] = await CategoryModel.getRootById(Number.parseInt(id));

            let [childCatList] = await CategoryModel.getAllChildCatWithProductCount(
                Number.parseInt(id)
            );
            if (childCatList === undefined) {
                childCatList = [];
            }

            childCatList = childCatList.map((cat, index) => {
                return {
                    ...cat,
                    product_count: Number.parseInt(cat.product_count),
                    index: index + 1,
                };
            });

            res.render("pages/admin/child-category-list", {
                layout: "admin",
                data: {
                    catList: childCatList,
                    root: root ? root : {},
                },
            });
        } catch (error) {
            console.log(error);
            res.render("pages/admin/child-category-list", {
                layout: "admin",
                data: {
                    catList: [],
                },
            });
        }
    }

    async getDataList(req, res) {
        try {
            const catList = await CategoryModel.getAll();
            return res.json({ status: 200, data: catList });
        } catch (error) {
            console.log(error);
            return res.json({ status: 500 });
        }
    }
}
