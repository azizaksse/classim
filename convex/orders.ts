import { action, internalMutation, query, mutation, internalQuery } from "./_generated/server";
import { v } from "convex/values";
import { internal } from "./_generated/api";

const PHONE_REGEX = /^(0)(5|6|7)[0-9]{8}$/;
const MAX_ORDERS_PER_15_MIN = 3;
const MIN_FORM_FILL_MS = 150;

const orderArgs = {
    product_name: v.string(),
    size: v.optional(v.string()),
    color: v.optional(v.string()),
    quantity: v.number(),
    customer_name: v.string(),
    phone: v.string(),
    wilaya_code: v.string(),
    wilaya_name: v.optional(v.string()),
    city: v.string(),
    delivery_place: v.union(v.literal("home"), v.literal("desktop")),
    delivery_price: v.number(),
    language: v.union(v.literal("ar"), v.literal("fr")),
    source: v.string(),
};

export const createValidated = internalMutation({
    args: orderArgs,
    handler: async (ctx, args) => {
        const customerName = args.customer_name.trim();
        const city = args.city.trim();

        if (customerName.length < 3 || customerName.length > 50) {
            throw new Error("Invalid customer name.");
        }
        if (!PHONE_REGEX.test(args.phone)) {
            throw new Error("Invalid phone number.");
        }
        if (city.length < 2 || city.length > 50) {
            throw new Error("Invalid city.");
        }
        if (!Number.isFinite(args.delivery_price) || args.delivery_price < 0) {
            throw new Error("Invalid delivery price.");
        }
        if (!Number.isInteger(args.quantity) || args.quantity < 1 || args.quantity > 10) {
            throw new Error("Invalid quantity.");
        }

        const now = new Date();
        const cutoff = new Date(now.getTime() - 15 * 60 * 1000).toISOString();
        const recentByPhone = await ctx.db
            .query("orders")
            .withIndex("by_phone", (q) => q.eq("phone", args.phone))
            .collect();
        const recentCount = recentByPhone.filter((o) => o.created_at >= cutoff).length;
        if (recentCount >= MAX_ORDERS_PER_15_MIN) {
            throw new Error("Too many attempts. Try again later.");
        }

        const orderId = await ctx.db.insert("orders", {
            ...args,
            customer_name: customerName,
            city,
            status: "pending",
            created_at: now.toISOString(),
        });

        return orderId;
    },
});

export const submit = action({
    args: {
        ...orderArgs,
        bot_field: v.optional(v.string()),
        form_started_at: v.number(),
    },
    handler: async (ctx, args) => {
        if ((args.bot_field || "").trim() !== "") {
            throw new Error("Invalid request.");
        }
        if (Date.now() - args.form_started_at < MIN_FORM_FILL_MS) {
            throw new Error("Please complete the form normally.");
        }

        const { bot_field: _, form_started_at: __, ...orderData } = args;

        const orderId = await ctx.runMutation(internal.orders.createValidated, orderData);

        // Call the internal Google Sheets action
        try {
            await ctx.runAction(internal.googleSheets.appendOrder, {
                orderId: orderId,
                created_at: new Date().toISOString(),
                ...orderData,
            });
        } catch (error) {
            console.error("Failed to trigger Google Sheets action:", error);
        }

        return { orderId };
    },
});

export const getOrders = query({
    args: {
        from: v.optional(v.number()),
        to: v.optional(v.number()),
        status: v.optional(v.string()),
        limit: v.optional(v.number()),
    },
    handler: async (ctx, args) => {
        const ordersQuery = (args.from && args.to)
            ? ctx.db.query("orders").withIndex("by_created_at", (q) =>
                q.gte("created_at", new Date(args.from!).toISOString()).lte("created_at", new Date(args.to!).toISOString())
            )
            : ctx.db.query("orders").withIndex("by_created_at");

        let orders = await ordersQuery.order("desc").take(args.limit || 100);

        if (args.status) {
            orders = orders.filter((o) => o.status === args.status);
        }

        return orders;
    },
});

export const getDashboardStats = query({
    args: {
        from: v.number(),
        to: v.number(),
    },
    handler: async (ctx, args) => {
        const fromISO = new Date(args.from).toISOString();
        const toISO = new Date(args.to).toISOString();

        // 1. Fetch Orders in Range
        const orders = await ctx.db
            .query("orders")
            .withIndex("by_created_at", (q) => q.gte("created_at", fromISO).lte("created_at", toISO))
            .collect();

        // 2. Fetch Products to get current prices
        const products = await ctx.db.query("products").collect();
        const productPriceMap = new Map<string, number>();
        products.forEach((p) => {
            productPriceMap.set(p.name_fr, p.sale_price || p.rent_price);
            productPriceMap.set(p.name_ar, p.sale_price || p.rent_price);
        });

        // 3. Calculate Stats
        let totalRevenue = 0;
        const totalOrders = orders.length;
        let cancelledOrders = 0;
        let verifiedOrders = 0;

        for (const order of orders) {
            if (order.status === "cancelled") {
                cancelledOrders++;
                continue;
            }
            if (order.status === "confirmed") {
                verifiedOrders++;
            }

            // Calculate Revenue
            const price = productPriceMap.get(order.product_name) || 0;
            const orderTotal = (price * order.quantity) + order.delivery_price;
            totalRevenue += orderTotal;
        }

        // Avoid division by zero
        const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

        return {
            totalRevenue,
            totalOrders,
            averageOrderValue,
            cancelledOrders,
            verifiedOrders,
        };
    },
});

export const updateStatus = mutation({
    args: {
        orderId: v.id("orders"),
        status: v.union(
            v.literal("pending"),
            v.literal("confirmed"),
            v.literal("cancelled"),
            v.literal("approved"),
            v.literal("processing"),
            v.literal("delivered")
        ),
    },
    handler: async (ctx, args) => {
        await ctx.db.patch(args.orderId, { status: args.status });
    },
});

export const getOrderData = internalQuery({
    args: { orderId: v.id("orders") },
    handler: async (ctx, args) => {
        return await ctx.db.get(args.orderId);
    },
});

export const setSyncStatus = internalMutation({
    args: {
        orderId: v.id("orders"),
        status: v.union(v.literal("pending"), v.literal("success"), v.literal("failed")),
    },
    handler: async (ctx, args) => {
        await ctx.db.patch(args.orderId, { syncStatus: args.status });
    },
});

export const resyncOrder = action({
    args: { orderId: v.id("orders") },
    handler: async (ctx, args) => {
        const order = await ctx.runQuery(internal.orders.getOrderData, { orderId: args.orderId });
        if (!order) throw new Error("Order not found");

        await ctx.runAction(internal.googleSheets.appendOrder, {
            orderId: order._id,
            created_at: order.created_at,
            customer_name: order.customer_name,
            phone: order.phone,
            wilaya_code: order.wilaya_code,
            wilaya_name: order.wilaya_name,
            city: order.city,
            product_name: order.product_name,
            size: order.size,
            color: order.color,
            quantity: order.quantity,
            delivery_place: order.delivery_place,
            delivery_price: order.delivery_price,
            language: order.language,
            source: order.source,
        });
    },
});

export const deleteOrder = mutation({
    args: {
        orderId: v.id("orders"),
    },
    handler: async (ctx, args) => {
        await ctx.db.delete(args.orderId);
    },
});
