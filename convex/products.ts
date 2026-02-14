import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

const normalizeList = (values?: string[]) => {
    if (!values) return undefined;
    return Array.from(
        new Set(
            values
                .map((value) => value.trim())
                .filter(Boolean)
        )
    );
};

const normalizeSalePercentage = (value?: number) => {
    if (value === undefined) return undefined;
    if (!Number.isFinite(value)) return undefined;
    return Math.max(0, Math.min(100, value));
};

const normalizeStock = (value?: number) => {
    if (value === undefined) return undefined;
    if (!Number.isFinite(value)) return undefined;
    return Math.max(0, Math.floor(value));
};

export const get = query({
    args: {},
    handler: async (ctx) => {
        const products = await ctx.db.query("products").order("desc").collect();
        const productsWithCategories = await Promise.all(
            products.map(async (product) => {
                let categoryName = "Uncategorized";
                if (product.category_id) {
                    const category = await ctx.db.get(product.category_id);
                    if (category) {
                        categoryName = category.name_fr;
                    }
                }

                const images = await Promise.all(
                    (product.images || []).map(async (storageId) => {
                        if (storageId.startsWith("http")) return { url: storageId };
                        const url = await ctx.storage.getUrl(storageId);
                        return { id: storageId, url: url || "" };
                    })
                );

                return {
                    ...product,
                    sale_percentage: product.sale_percentage ?? 0,
                    stock: product.stock ?? 0,
                    category_name: categoryName,
                    images: images.map(i => i.url).filter(Boolean),
                    image_data: images,
                };
            })
        );
        return productsWithCategories;
    },
});

export const create = mutation({
    args: {
        category_id: v.optional(v.id("categories")),
        name_ar: v.string(),
        name_fr: v.string(),
        description_ar: v.optional(v.string()),
        description_fr: v.optional(v.string()),
        rent_price: v.number(),
        sale_price: v.optional(v.number()),
        sale_percentage: v.optional(v.number()),
        stock: v.optional(v.number()),
        images: v.optional(v.array(v.string())),
        sizes: v.optional(v.array(v.string())),
        colors: v.optional(v.array(v.string())),
        is_active: v.optional(v.boolean()),
        is_featured: v.optional(v.boolean()),
    },
    handler: async (ctx, args) => {
        const salePercentage = normalizeSalePercentage(args.sale_percentage);
        const normalizedStock = normalizeStock(args.stock);
        const computedSalePrice =
            salePercentage && salePercentage > 0
                ? Number((args.rent_price * (1 - salePercentage / 100)).toFixed(2))
                : args.sale_price;

        const productId = await ctx.db.insert("products", {
            ...args,
            sale_price: computedSalePrice,
            sale_percentage: salePercentage,
            stock: normalizedStock,
            sizes: normalizeList(args.sizes),
            colors: normalizeList(args.colors),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        });
        return productId;
    },
});

export const update = mutation({
    args: {
        id: v.id("products"),
        updates: v.object({
            category_id: v.optional(v.id("categories")),
            name_ar: v.optional(v.string()),
            name_fr: v.optional(v.string()),
            description_ar: v.optional(v.string()),
            description_fr: v.optional(v.string()),
            rent_price: v.optional(v.number()),
            sale_price: v.optional(v.number()),
            sale_percentage: v.optional(v.number()),
            stock: v.optional(v.number()),
            images: v.optional(v.array(v.string())),
            sizes: v.optional(v.array(v.string())),
            colors: v.optional(v.array(v.string())),
            is_active: v.optional(v.boolean()),
            is_featured: v.optional(v.boolean()),
        }),
    },
    handler: async (ctx, args) => {
        const current = await ctx.db.get(args.id);
        if (!current) {
            throw new Error("Product not found");
        }

        const salePercentage = normalizeSalePercentage(args.updates.sale_percentage);
        const normalizedStock = normalizeStock(args.updates.stock);
        const rentPrice = args.updates.rent_price ?? current.rent_price;

        let computedSalePrice = args.updates.sale_price;
        if (salePercentage !== undefined) {
            computedSalePrice =
                salePercentage > 0
                    ? Number((rentPrice * (1 - salePercentage / 100)).toFixed(2))
                    : undefined;
        }

        const normalizedUpdates = {
            ...args.updates,
            sale_percentage: salePercentage,
            stock: normalizedStock,
            sale_price: computedSalePrice,
            sizes: normalizeList(args.updates.sizes),
            colors: normalizeList(args.updates.colors),
        };

        await ctx.db.patch(args.id, {
            ...normalizedUpdates,
            updated_at: new Date().toISOString(),
        });
    },
});

export const remove = mutation({
    args: { id: v.id("products") },
    handler: async (ctx, args) => {
        await ctx.db.delete(args.id);
    },
});

export const backfillMissingFields = mutation({
    args: {},
    handler: async (ctx) => {
        const products = await ctx.db.query("products").collect();
        let updated = 0;

        for (const product of products) {
            const updates: Record<string, number | string> = {};

            if (product.sale_percentage === undefined) {
                updates.sale_percentage = 0;
            }
            if (product.stock === undefined) {
                updates.stock = 0;
            }
            if (product.sale_price === undefined) {
                updates.sale_price = product.rent_price;
            }

            if (Object.keys(updates).length > 0) {
                updates.updated_at = new Date().toISOString();
                await ctx.db.patch(product._id, updates);
                updated += 1;
            }
        }

        return { total: products.length, updated };
    },
});
