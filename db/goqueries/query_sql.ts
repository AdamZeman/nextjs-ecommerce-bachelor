import { QueryArrayConfig, QueryArrayResult } from "pg";

interface Client {
    query: (config: QueryArrayConfig) => Promise<QueryArrayResult>;
}

export const getProductsQuery = `-- name: GetProducts :many
SELECT id, name, description, price, created_at, special, option_1_name, option_2_name from products
ORDER BY id`;

export interface GetProductsRow {
    id: number;
    name: string;
    description: string;
    price: number;
    createdAt: Date | null;
    special: number | null;
    option_1Name: string;
    option_2Name: string;
}

export async function getProducts(client: Client): Promise<GetProductsRow[]> {
    const result = await client.query({
        text: getProductsQuery,
        values: [],
        rowMode: "array"
    });
    return result.rows.map(row => {
        return {
            id: row[0],
            name: row[1],
            description: row[2],
            price: row[3],
            createdAt: row[4],
            special: row[5],
            option_1Name: row[6],
            option_2Name: row[7]
        };
    });
}

export const getProductsByCategoryIdQuery = `-- name: GetProductsByCategoryId :many
SELECT p.id, p.name, p.description, p.price, p.created_at, p.special, p.option_1_name, p.option_2_name
FROM products p
         JOIN product_categories pc ON p.id = pc.product_id
WHERE pc.category_id = $1`;

export interface GetProductsByCategoryIdArgs {
    categoryId: number;
}

export interface GetProductsByCategoryIdRow {
    id: number;
    name: string;
    description: string;
    price: number;
    createdAt: Date | null;
    special: number | null;
    option_1Name: string;
    option_2Name: string;
}

export async function getProductsByCategoryId(client: Client, args: GetProductsByCategoryIdArgs): Promise<GetProductsByCategoryIdRow[]> {
    const result = await client.query({
        text: getProductsByCategoryIdQuery,
        values: [args.categoryId],
        rowMode: "array"
    });
    return result.rows.map(row => {
        return {
            id: row[0],
            name: row[1],
            description: row[2],
            price: row[3],
            createdAt: row[4],
            special: row[5],
            option_1Name: row[6],
            option_2Name: row[7]
        };
    });
}

export const getCategoriesFilteredProductIDQuery = `-- name: GetCategoriesFilteredProductID :many
SELECT
    c.id, c.name, c.description,
    CASE
        WHEN pc.product_id IS NOT NULL THEN TRUE
        ELSE FALSE
        END AS has_product
FROM categories c
         LEFT JOIN product_categories pc
                   ON c.id = pc.category_id
                       AND pc.product_id = $1`;

export interface GetCategoriesFilteredProductIDArgs {
    productId: number;
}

export interface GetCategoriesFilteredProductIDRow {
    id: number;
    name: string;
    description: string | null;
    hasProduct: boolean;
}

export async function getCategoriesFilteredProductID(client: Client, args: GetCategoriesFilteredProductIDArgs): Promise<GetCategoriesFilteredProductIDRow[]> {
    const result = await client.query({
        text: getCategoriesFilteredProductIDQuery,
        values: [args.productId],
        rowMode: "array"
    });
    return result.rows.map(row => {
        return {
            id: row[0],
            name: row[1],
            description: row[2],
            hasProduct: row[3]
        };
    });
}

export const getCategoryByIDQuery = `-- name: GetCategoryByID :one
SELECT id, name, description from categories
WHERE id = $1`;

export interface GetCategoryByIDArgs {
    id: number;
}

export interface GetCategoryByIDRow {
    id: number;
    name: string;
    description: string | null;
}

export async function getCategoryByID(client: Client, args: GetCategoryByIDArgs): Promise<GetCategoryByIDRow | null> {
    const result = await client.query({
        text: getCategoryByIDQuery,
        values: [args.id],
        rowMode: "array"
    });
    if (result.rows.length !== 1) {
        return null;
    }
    const row = result.rows[0];
    return {
        id: row[0],
        name: row[1],
        description: row[2]
    };
}

export const getCategoriesQuery = `-- name: GetCategories :many
SELECT id, name, description from categories
order by id asc`;

export interface GetCategoriesRow {
    id: number;
    name: string;
    description: string | null;
}

export async function getCategories(client: Client): Promise<GetCategoriesRow[]> {
    const result = await client.query({
        text: getCategoriesQuery,
        values: [],
        rowMode: "array"
    });
    return result.rows.map(row => {
        return {
            id: row[0],
            name: row[1],
            description: row[2]
        };
    });
}

export const getProductByIdQuery = `-- name: GetProductById :one
SELECT id, name, description, price, created_at, special, option_1_name, option_2_name from products where id = $1`;

export interface GetProductByIdArgs {
    id: number;
}

export interface GetProductByIdRow {
    id: number;
    name: string;
    description: string;
    price: number;
    createdAt: Date | null;
    special: number | null;
    option_1Name: string;
    option_2Name: string;
}

export async function getProductById(client: Client, args: GetProductByIdArgs): Promise<GetProductByIdRow | null> {
    const result = await client.query({
        text: getProductByIdQuery,
        values: [args.id],
        rowMode: "array"
    });
    if (result.rows.length !== 1) {
        return null;
    }
    const row = result.rows[0];
    return {
        id: row[0],
        name: row[1],
        description: row[2],
        price: row[3],
        createdAt: row[4],
        special: row[5],
        option_1Name: row[6],
        option_2Name: row[7]
    };
}

export const getProductVariantsByProductIdQuery = `-- name: GetProductVariantsByProductId :many
SELECT pv.id, pv.product_id, pv.sku, pv.price, pv.stock_quantity, pv.option_1_value, pv.option_2_value, pv.created_at
FROM product_variants pv
         JOIN products p ON pv.product_id = p.id
WHERE p.id = $1`;

export interface GetProductVariantsByProductIdArgs {
    id: number;
}

export interface GetProductVariantsByProductIdRow {
    id: number;
    productId: number;
    sku: string;
    price: number;
    stockQuantity: number;
    option_1Value: string;
    option_2Value: string;
    createdAt: Date | null;
}

export async function getProductVariantsByProductId(client: Client, args: GetProductVariantsByProductIdArgs): Promise<GetProductVariantsByProductIdRow[]> {
    const result = await client.query({
        text: getProductVariantsByProductIdQuery,
        values: [args.id],
        rowMode: "array"
    });
    return result.rows.map(row => {
        return {
            id: row[0],
            productId: row[1],
            sku: row[2],
            price: row[3],
            stockQuantity: row[4],
            option_1Value: row[5],
            option_2Value: row[6],
            createdAt: row[7]
        };
    });
}

export const getBasketItemsByUserIdQuery = `-- name: GetBasketItemsByUserId :many
SELECT bi.id, user_id, product_variant_id, quantity, bi.created_at, updated_at, pv.id, product_id, sku, pv.price, stock_quantity, option_1_value, option_2_value, pv.created_at, p.id, name, description, p.price, p.created_at, special, option_1_name, option_2_name
FROM basket_items bi
         JOIN product_variants pv on pv.id = bi.product_variant_id
         JOIN products p on p.id = pv.product_id
WHERE bi.user_id = $1`;

export interface GetBasketItemsByUserIdArgs {
    userId: number;
}

export interface GetBasketItemsByUserIdRow {
    id: number;
    userId: number;
    productVariantId: number;
    quantity: number;
    createdAt: Date | null;
    updatedAt: Date | null;
    id_2: number;
    productId: number;
    sku: string;
    price: number;
    stockQuantity: number;
    option_1Value: string;
    option_2Value: string;
    createdAt_2: Date | null;
    id_3: number;
    name: string;
    description: string;
    price_2: number;
    createdAt_3: Date | null;
    special: number | null;
    option_1Name: string;
    option_2Name: string;
}

export async function getBasketItemsByUserId(client: Client, args: GetBasketItemsByUserIdArgs): Promise<GetBasketItemsByUserIdRow[]> {
    const result = await client.query({
        text: getBasketItemsByUserIdQuery,
        values: [args.userId],
        rowMode: "array"
    });
    return result.rows.map(row => {
        return {
            id: row[0],
            userId: row[1],
            productVariantId: row[2],
            quantity: row[3],
            createdAt: row[4],
            updatedAt: row[5],
            id_2: row[6],
            productId: row[7],
            sku: row[8],
            price: row[9],
            stockQuantity: row[10],
            option_1Value: row[11],
            option_2Value: row[12],
            createdAt_2: row[13],
            id_3: row[14],
            name: row[15],
            description: row[16],
            price_2: row[17],
            createdAt_3: row[18],
            special: row[19],
            option_1Name: row[20],
            option_2Name: row[21]
        };
    });
}

export const getBasketItemsByUserEmailQuery = `-- name: GetBasketItemsByUserEmail :many
SELECT bi.id, user_id, product_variant_id, quantity, bi.created_at, updated_at, pv.id, product_id, sku, pv.price, stock_quantity, option_1_value, option_2_value, pv.created_at, p.id, p.name, description, p.price, p.created_at, special, option_1_name, option_2_name, u.id, google_id, email, u.name, avatar_url, u.created_at, role
FROM basket_items bi
         JOIN product_variants pv on pv.id = bi.product_variant_id
         JOIN products p on p.id = pv.product_id
         JOIN users u on u.id = bi.user_id
WHERE u.email = $1`;

export interface GetBasketItemsByUserEmailArgs {
    email: string;
}

export interface GetBasketItemsByUserEmailRow {
    id: number;
    userId: number;
    productVariantId: number;
    quantity: number;
    createdAt: Date | null;
    updatedAt: Date | null;
    id_2: number;
    productId: number;
    sku: string;
    price: number;
    stockQuantity: number;
    option_1Value: string;
    option_2Value: string;
    createdAt_2: Date | null;
    id_3: number;
    name: string;
    description: string;
    price_2: number;
    createdAt_3: Date | null;
    special: number | null;
    option_1Name: string;
    option_2Name: string;
    id_4: number;
    googleId: string;
    email: string;
    name_2: string;
    avatarUrl: string | null;
    createdAt_4: Date | null;
    role: number;
}

export async function getBasketItemsByUserEmail(client: Client, args: GetBasketItemsByUserEmailArgs): Promise<GetBasketItemsByUserEmailRow[]> {
    const result = await client.query({
        text: getBasketItemsByUserEmailQuery,
        values: [args.email],
        rowMode: "array"
    });
    return result.rows.map(row => {
        return {
            id: row[0],
            userId: row[1],
            productVariantId: row[2],
            quantity: row[3],
            createdAt: row[4],
            updatedAt: row[5],
            id_2: row[6],
            productId: row[7],
            sku: row[8],
            price: row[9],
            stockQuantity: row[10],
            option_1Value: row[11],
            option_2Value: row[12],
            createdAt_2: row[13],
            id_3: row[14],
            name: row[15],
            description: row[16],
            price_2: row[17],
            createdAt_3: row[18],
            special: row[19],
            option_1Name: row[20],
            option_2Name: row[21],
            id_4: row[22],
            googleId: row[23],
            email: row[24],
            name_2: row[25],
            avatarUrl: row[26],
            createdAt_4: row[27],
            role: row[28]
        };
    });
}

export const insertBasketItemQuery = `-- name: InsertBasketItem :one
INSERT INTO basket_items (user_id, product_variant_id, quantity)
VALUES ($1, $2, $3)
RETURNING id, user_id, product_variant_id, quantity, created_at, updated_at`;

export interface InsertBasketItemArgs {
    userId: number;
    productVariantId: number;
    quantity: number;
}

export interface InsertBasketItemRow {
    id: number;
    userId: number;
    productVariantId: number;
    quantity: number;
    createdAt: Date | null;
    updatedAt: Date | null;
}

export async function insertBasketItem(client: Client, args: InsertBasketItemArgs): Promise<InsertBasketItemRow | null> {
    const result = await client.query({
        text: insertBasketItemQuery,
        values: [args.userId, args.productVariantId, args.quantity],
        rowMode: "array"
    });
    if (result.rows.length !== 1) {
        return null;
    }
    const row = result.rows[0];
    return {
        id: row[0],
        userId: row[1],
        productVariantId: row[2],
        quantity: row[3],
        createdAt: row[4],
        updatedAt: row[5]
    };
}

export const removeFromBasketQuery = `-- name: RemoveFromBasket :one
DELETE FROM basket_items
WHERE id = $1
RETURNING id, user_id, product_variant_id, quantity, created_at, updated_at`;

export interface RemoveFromBasketArgs {
    id: number;
}

export interface RemoveFromBasketRow {
    id: number;
    userId: number;
    productVariantId: number;
    quantity: number;
    createdAt: Date | null;
    updatedAt: Date | null;
}

export async function removeFromBasket(client: Client, args: RemoveFromBasketArgs): Promise<RemoveFromBasketRow | null> {
    const result = await client.query({
        text: removeFromBasketQuery,
        values: [args.id],
        rowMode: "array"
    });
    if (result.rows.length !== 1) {
        return null;
    }
    const row = result.rows[0];
    return {
        id: row[0],
        userId: row[1],
        productVariantId: row[2],
        quantity: row[3],
        createdAt: row[4],
        updatedAt: row[5]
    };
}

export const upsertUserQuery = `-- name: UpsertUser :one
INSERT INTO users (google_id, email, name, avatar_url)
VALUES ($1, $2, $3, $4)
ON CONFLICT (google_id)
    DO UPDATE SET
                  email = EXCLUDED.email,
                  name = EXCLUDED.name,
                  avatar_url = EXCLUDED.avatar_url
RETURNING id, google_id, email, name, avatar_url, created_at, role`;

export interface UpsertUserArgs {
    googleId: string;
    email: string;
    name: string;
    avatarUrl: string | null;
}

export interface UpsertUserRow {
    id: number;
    googleId: string;
    email: string;
    name: string;
    avatarUrl: string | null;
    createdAt: Date | null;
    role: number;
}

export async function upsertUser(client: Client, args: UpsertUserArgs): Promise<UpsertUserRow | null> {
    const result = await client.query({
        text: upsertUserQuery,
        values: [args.googleId, args.email, args.name, args.avatarUrl],
        rowMode: "array"
    });
    if (result.rows.length !== 1) {
        return null;
    }
    const row = result.rows[0];
    return {
        id: row[0],
        googleId: row[1],
        email: row[2],
        name: row[3],
        avatarUrl: row[4],
        createdAt: row[5],
        role: row[6]
    };
}

export const insertMessageQuery = `-- name: InsertMessage :one
INSERT INTO conversation_messages (conversation_id, sender_id, content)
VALUES ($1, (SELECT id FROM users WHERE email = $2), $3)
RETURNING id, conversation_id, sender_id, content, created_at, read_at, status`;

export interface InsertMessageArgs {
    conversationId: number;
    email: string;
    content: string;
}

export interface InsertMessageRow {
    id: number;
    conversationId: number;
    senderId: number;
    content: string;
    createdAt: Date;
    readAt: Date | null;
    status: string | null;
}

export async function insertMessage(client: Client, args: InsertMessageArgs): Promise<InsertMessageRow | null> {
    const result = await client.query({
        text: insertMessageQuery,
        values: [args.conversationId, args.email, args.content],
        rowMode: "array"
    });
    if (result.rows.length !== 1) {
        return null;
    }
    const row = result.rows[0];
    return {
        id: row[0],
        conversationId: row[1],
        senderId: row[2],
        content: row[3],
        createdAt: row[4],
        readAt: row[5],
        status: row[6]
    };
}

export const getMessagesQuery = `-- name: GetMessages :many
SELECT cm.id, cm.conversation_id, cm.sender_id, cm.content, cm.created_at, cm.read_at, cm.status, u.email
FROM conversation_messages cm
         JOIN users u on cm.sender_id = u.id
         ORDER BY cm.created_at ASC`;

export interface GetMessagesRow {
    id: number;
    conversationId: number;
    senderId: number;
    content: string;
    createdAt: Date;
    readAt: Date | null;
    status: string | null;
    email: string;
}

export async function getMessages(client: Client): Promise<GetMessagesRow[]> {
    const result = await client.query({
        text: getMessagesQuery,
        values: [],
        rowMode: "array"
    });
    return result.rows.map(row => {
        return {
            id: row[0],
            conversationId: row[1],
            senderId: row[2],
            content: row[3],
            createdAt: row[4],
            readAt: row[5],
            status: row[6],
            email: row[7]
        };
    });
}

export const getMessagesByConversationIdQuery = `-- name: GetMessagesByConversationId :many
SELECT cm.id, cm.conversation_id, cm.sender_id, cm.content, cm.created_at, cm.read_at, cm.status, u.email
FROM conversation_messages cm
         JOIN conversations c ON cm.conversation_id = c.id
         JOIN users u ON cm.sender_id = u.id
WHERE c.id = $1
ORDER BY cm.created_at ASC`;

export interface GetMessagesByConversationIdArgs {
    id: number;
}

export interface GetMessagesByConversationIdRow {
    id: number;
    conversationId: number;
    senderId: number;
    content: string;
    createdAt: Date;
    readAt: Date | null;
    status: string | null;
    email: string;
}

export async function getMessagesByConversationId(client: Client, args: GetMessagesByConversationIdArgs): Promise<GetMessagesByConversationIdRow[]> {
    const result = await client.query({
        text: getMessagesByConversationIdQuery,
        values: [args.id],
        rowMode: "array"
    });
    return result.rows.map(row => {
        return {
            id: row[0],
            conversationId: row[1],
            senderId: row[2],
            content: row[3],
            createdAt: row[4],
            readAt: row[5],
            status: row[6],
            email: row[7]
        };
    });
}

export const getConversationsQuery = `-- name: GetConversations :many
SELECT c.id, c.name, c.order_id, c.created_at
FROM conversations c`;

export interface GetConversationsRow {
    id: number;
    name: string;
    orderId: number;
    createdAt: Date | null;
}

export async function getConversations(client: Client): Promise<GetConversationsRow[]> {
    const result = await client.query({
        text: getConversationsQuery,
        values: [],
        rowMode: "array"
    });
    return result.rows.map(row => {
        return {
            id: row[0],
            name: row[1],
            orderId: row[2],
            createdAt: row[3]
        };
    });
}

export const getConversationsByUserIdQuery = `-- name: GetConversationsByUserId :many
SELECT DISTINCT c.id, c.name, c.order_id, c.created_at
FROM conversations c
         LEFT JOIN conversations_users cu ON cu.conversation_id = c.id
         LEFT JOIN users u ON u.id = cu.user_id
WHERE u.email = $1`;

export interface GetConversationsByUserIdArgs {
    email: string;
}

export interface GetConversationsByUserIdRow {
    id: number;
    name: string;
    orderId: number;
    createdAt: Date | null;
}

export async function getConversationsByUserId(client: Client, args: GetConversationsByUserIdArgs): Promise<GetConversationsByUserIdRow[]> {
    const result = await client.query({
        text: getConversationsByUserIdQuery,
        values: [args.email],
        rowMode: "array"
    });
    return result.rows.map(row => {
        return {
            id: row[0],
            name: row[1],
            orderId: row[2],
            createdAt: row[3]
        };
    });
}

export const insertConversationQuery = `-- name: InsertConversation :one
INSERT INTO conversations (name, order_id)
VALUES ($1, $2)
RETURNING id, name, order_id, created_at`;

export interface InsertConversationArgs {
    name: string;
    orderId: number;
}

export interface InsertConversationRow {
    id: number;
    name: string;
    orderId: number;
    createdAt: Date | null;
}

export async function insertConversation(client: Client, args: InsertConversationArgs): Promise<InsertConversationRow | null> {
    const result = await client.query({
        text: insertConversationQuery,
        values: [args.name, args.orderId],
        rowMode: "array"
    });
    if (result.rows.length !== 1) {
        return null;
    }
    const row = result.rows[0];
    return {
        id: row[0],
        name: row[1],
        orderId: row[2],
        createdAt: row[3]
    };
}

export const insertConversationUserQuery = `-- name: InsertConversationUser :one
INSERT INTO conversations_users (conversation_id, user_id)
VALUES ($1, $2)
RETURNING id, conversation_id, user_id`;

export interface InsertConversationUserArgs {
    conversationId: number;
    userId: number;
}

export interface InsertConversationUserRow {
    id: number;
    conversationId: number;
    userId: number;
}

export async function insertConversationUser(client: Client, args: InsertConversationUserArgs): Promise<InsertConversationUserRow | null> {
    const result = await client.query({
        text: insertConversationUserQuery,
        values: [args.conversationId, args.userId],
        rowMode: "array"
    });
    if (result.rows.length !== 1) {
        return null;
    }
    const row = result.rows[0];
    return {
        id: row[0],
        conversationId: row[1],
        userId: row[2]
    };
}

export const getUsersQuery = `-- name: GetUsers :many
SELECT id, google_id, email, name, avatar_url, created_at, role
FROM users`;

export interface GetUsersRow {
    id: number;
    googleId: string;
    email: string;
    name: string;
    avatarUrl: string | null;
    createdAt: Date | null;
    role: number;
}

export async function getUsers(client: Client): Promise<GetUsersRow[]> {
    const result = await client.query({
        text: getUsersQuery,
        values: [],
        rowMode: "array"
    });
    return result.rows.map(row => {
        return {
            id: row[0],
            googleId: row[1],
            email: row[2],
            name: row[3],
            avatarUrl: row[4],
            createdAt: row[5],
            role: row[6]
        };
    });
}

export const getOrderItemsByUserIdQuery = `-- name: GetOrderItemsByUserId :many
SELECT o.id, user_id, status, total_price, shipping_id, o.created_at, updated_at, oi.id, order_id, product_variant_id, quantity, oi.created_at, pv.id, product_id, sku, pv.price, stock_quantity, option_1_value, option_2_value, pv.created_at, p.id, name, description, p.price, p.created_at, special, option_1_name, option_2_name
FROM orders o
         JOIN order_items oi on oi.order_id = o.id
         JOIN product_variants pv on pv.id = oi.product_variant_id
         JOIN products p on p.id = pv.product_id
WHERE o.user_id = $1`;

export interface GetOrderItemsByUserIdArgs {
    userId: number;
}

export interface GetOrderItemsByUserIdRow {
    id: number;
    userId: number;
    status: string;
    totalPrice: number;
    shippingId: number;
    createdAt: Date | null;
    updatedAt: Date | null;
    id_2: number;
    orderId: number;
    productVariantId: number;
    quantity: number;
    createdAt_2: Date | null;
    id_3: number;
    productId: number;
    sku: string;
    price: number;
    stockQuantity: number;
    option_1Value: string;
    option_2Value: string;
    createdAt_3: Date | null;
    id_4: number;
    name: string;
    description: string;
    price_2: number;
    createdAt_4: Date | null;
    special: number | null;
    option_1Name: string;
    option_2Name: string;
}

export async function getOrderItemsByUserId(client: Client, args: GetOrderItemsByUserIdArgs): Promise<GetOrderItemsByUserIdRow[]> {
    const result = await client.query({
        text: getOrderItemsByUserIdQuery,
        values: [args.userId],
        rowMode: "array"
    });
    return result.rows.map(row => {
        return {
            id: row[0],
            userId: row[1],
            status: row[2],
            totalPrice: row[3],
            shippingId: row[4],
            createdAt: row[5],
            updatedAt: row[6],
            id_2: row[7],
            orderId: row[8],
            productVariantId: row[9],
            quantity: row[10],
            createdAt_2: row[11],
            id_3: row[12],
            productId: row[13],
            sku: row[14],
            price: row[15],
            stockQuantity: row[16],
            option_1Value: row[17],
            option_2Value: row[18],
            createdAt_3: row[19],
            id_4: row[20],
            name: row[21],
            description: row[22],
            price_2: row[23],
            createdAt_4: row[24],
            special: row[25],
            option_1Name: row[26],
            option_2Name: row[27]
        };
    });
}

export const getOrdersByUserIdQuery = `-- name: GetOrdersByUserId :many
SELECT id, user_id, status, total_price, shipping_id, created_at, updated_at
FROM orders o
WHERE o.user_id = $1
ORDER BY o.created_at desc`;

export interface GetOrdersByUserIdArgs {
    userId: number;
}

export interface GetOrdersByUserIdRow {
    id: number;
    userId: number;
    status: string;
    totalPrice: number;
    shippingId: number;
    createdAt: Date | null;
    updatedAt: Date | null;
}

export async function getOrdersByUserId(client: Client, args: GetOrdersByUserIdArgs): Promise<GetOrdersByUserIdRow[]> {
    const result = await client.query({
        text: getOrdersByUserIdQuery,
        values: [args.userId],
        rowMode: "array"
    });
    return result.rows.map(row => {
        return {
            id: row[0],
            userId: row[1],
            status: row[2],
            totalPrice: row[3],
            shippingId: row[4],
            createdAt: row[5],
            updatedAt: row[6]
        };
    });
}

export const getProductsByCategoriesAndNameQuery = `-- name: GetProductsByCategoriesAndName :many
SELECT p.id, p.name, p.description, p.price, p.created_at, p.special, p.option_1_name, p.option_2_name, s.id, s.name, (fi.product_id IS NOT NULL)::boolean AS "isFavourite"
FROM products p
         LEFT JOIN special s ON p.special = s.id
         LEFT JOIN favourite_items fi
                   ON fi.product_id = p.id AND fi.user_id = $1

WHERE p.name ILIKE '%' || $2 || '%'
  AND (
    array_length($3::int[], 1) IS NULL
        OR EXISTS (
        SELECT 1 FROM product_categories pc
        WHERE pc.product_id = p.id AND pc.category_id = ANY($3::int[])
    )
    )
  AND (
    array_length($4::int[], 1) IS NULL
        OR p.special = ANY($4::int[])
    )
  AND (
    (p.price >= $5::int)
        AND
    (p.price <= $6::int)
    )
ORDER BY p.id
LIMIT $8::int OFFSET $7::int`;

export interface GetProductsByCategoriesAndNameArgs {
    userId: number;
    nameFilter: string | null;
    categoryIds: number[];
    specialIds: number[];
    priceFrom: number;
    priceTo: number;
    offsetvar: number;
    limitvar: number;
}

export interface GetProductsByCategoriesAndNameRow {
    id: number;
    name: string;
    description: string;
    price: number;
    createdAt: Date | null;
    special: number | null;
    option_1Name: string;
    option_2Name: string;
    id_2: number | null;
    name_2: string | null;
    isfavourite: boolean;
}

export async function getProductsByCategoriesAndName(client: Client, args: GetProductsByCategoriesAndNameArgs): Promise<GetProductsByCategoriesAndNameRow[]> {
    const result = await client.query({
        text: getProductsByCategoriesAndNameQuery,
        values: [args.userId, args.nameFilter, args.categoryIds, args.specialIds, args.priceFrom, args.priceTo, args.offsetvar, args.limitvar],
        rowMode: "array"
    });
    return result.rows.map(row => {
        return {
            id: row[0],
            name: row[1],
            description: row[2],
            price: row[3],
            createdAt: row[4],
            special: row[5],
            option_1Name: row[6],
            option_2Name: row[7],
            id_2: row[8],
            name_2: row[9],
            isfavourite: row[10]
        };
    });
}

export const getFavouritesByIdQuery = `-- name: GetFavouritesById :many
SELECT fi.id, user_id, product_id, fi.created_at, updated_at, u.id, google_id, email, u.name, avatar_url, u.created_at, role, p.id, p.name, description, price, p.created_at, special, option_1_name, option_2_name
FROM favourite_items fi
         JOIN users u ON fi.user_id = u.id
         JOIN products p on p.id = fi.product_id
WHERE u.email = $1`;

export interface GetFavouritesByIdArgs {
    email: string;
}

export interface GetFavouritesByIdRow {
    id: number;
    userId: number;
    productId: number;
    createdAt: Date | null;
    updatedAt: Date | null;
    id_2: number;
    googleId: string;
    email: string;
    name: string;
    avatarUrl: string | null;
    createdAt_2: Date | null;
    role: number;
    id_3: number;
    name_2: string;
    description: string;
    price: number;
    createdAt_3: Date | null;
    special: number | null;
    option_1Name: string;
    option_2Name: string;
}

export async function getFavouritesById(client: Client, args: GetFavouritesByIdArgs): Promise<GetFavouritesByIdRow[]> {
    const result = await client.query({
        text: getFavouritesByIdQuery,
        values: [args.email],
        rowMode: "array"
    });
    return result.rows.map(row => {
        return {
            id: row[0],
            userId: row[1],
            productId: row[2],
            createdAt: row[3],
            updatedAt: row[4],
            id_2: row[5],
            googleId: row[6],
            email: row[7],
            name: row[8],
            avatarUrl: row[9],
            createdAt_2: row[10],
            role: row[11],
            id_3: row[12],
            name_2: row[13],
            description: row[14],
            price: row[15],
            createdAt_3: row[16],
            special: row[17],
            option_1Name: row[18],
            option_2Name: row[19]
        };
    });
}

export const productVariantsByProductIdQuery = `-- name: ProductVariantsByProductId :many
SELECT pv.id, pv.product_id, pv.sku, pv.price, pv.stock_quantity, pv.option_1_value, pv.option_2_value, pv.created_at
FROM product_variants pv
WHERE pv.product_id = $1`;

export interface ProductVariantsByProductIdArgs {
    productId: number;
}

export interface ProductVariantsByProductIdRow {
    id: number;
    productId: number;
    sku: string;
    price: number;
    stockQuantity: number;
    option_1Value: string;
    option_2Value: string;
    createdAt: Date | null;
}

export async function productVariantsByProductId(client: Client, args: ProductVariantsByProductIdArgs): Promise<ProductVariantsByProductIdRow[]> {
    const result = await client.query({
        text: productVariantsByProductIdQuery,
        values: [args.productId],
        rowMode: "array"
    });
    return result.rows.map(row => {
        return {
            id: row[0],
            productId: row[1],
            sku: row[2],
            price: row[3],
            stockQuantity: row[4],
            option_1Value: row[5],
            option_2Value: row[6],
            createdAt: row[7]
        };
    });
}

export const getVariantsFilledProductsQuery = `-- name: GetVariantsFilledProducts :many
SELECT pv.id, product_id, sku, pv.price, stock_quantity, option_1_value, option_2_value, pv.created_at, p.id, name, description, p.price, p.created_at, special, option_1_name, option_2_name
FROM product_variants pv
         JOin products p on pv.product_id = p.id
order by pv.id asc`;

export interface GetVariantsFilledProductsRow {
    id: number;
    productId: number;
    sku: string;
    price: number;
    stockQuantity: number;
    option_1Value: string;
    option_2Value: string;
    createdAt: Date | null;
    id_2: number;
    name: string;
    description: string;
    price_2: number;
    createdAt_2: Date | null;
    special: number | null;
    option_1Name: string;
    option_2Name: string;
}

export async function getVariantsFilledProducts(client: Client): Promise<GetVariantsFilledProductsRow[]> {
    const result = await client.query({
        text: getVariantsFilledProductsQuery,
        values: [],
        rowMode: "array"
    });
    return result.rows.map(row => {
        return {
            id: row[0],
            productId: row[1],
            sku: row[2],
            price: row[3],
            stockQuantity: row[4],
            option_1Value: row[5],
            option_2Value: row[6],
            createdAt: row[7],
            id_2: row[8],
            name: row[9],
            description: row[10],
            price_2: row[11],
            createdAt_2: row[12],
            special: row[13],
            option_1Name: row[14],
            option_2Name: row[15]
        };
    });
}

export const getVariantByOptionsQuery = `-- name: GetVariantByOptions :one
SELECT pv.id, pv.product_id, pv.sku, pv.price, pv.stock_quantity, pv.option_1_value, pv.option_2_value, pv.created_at
FROM product_variants pv
WHERE product_id = $1
  AND option_1_value = $2
  AND option_2_value = $3`;

export interface GetVariantByOptionsArgs {
    productId: number;
    option_1Value: string;
    option_2Value: string;
}

export interface GetVariantByOptionsRow {
    id: number;
    productId: number;
    sku: string;
    price: number;
    stockQuantity: number;
    option_1Value: string;
    option_2Value: string;
    createdAt: Date | null;
}

export async function getVariantByOptions(client: Client, args: GetVariantByOptionsArgs): Promise<GetVariantByOptionsRow | null> {
    const result = await client.query({
        text: getVariantByOptionsQuery,
        values: [args.productId, args.option_1Value, args.option_2Value],
        rowMode: "array"
    });
    if (result.rows.length !== 1) {
        return null;
    }
    const row = result.rows[0];
    return {
        id: row[0],
        productId: row[1],
        sku: row[2],
        price: row[3],
        stockQuantity: row[4],
        option_1Value: row[5],
        option_2Value: row[6],
        createdAt: row[7]
    };
}

export const insertOrderQuery = `-- name: InsertOrder :one
INSERT INTO orders (user_id, total_price, shipping_id)
Values ($1, $2, $3)
RETURNING id, user_id, status, total_price, shipping_id, created_at, updated_at`;

export interface InsertOrderArgs {
    userId: number;
    totalPrice: number;
    shippingId: number;
}

export interface InsertOrderRow {
    id: number;
    userId: number;
    status: string;
    totalPrice: number;
    shippingId: number;
    createdAt: Date | null;
    updatedAt: Date | null;
}

export async function insertOrder(client: Client, args: InsertOrderArgs): Promise<InsertOrderRow | null> {
    const result = await client.query({
        text: insertOrderQuery,
        values: [args.userId, args.totalPrice, args.shippingId],
        rowMode: "array"
    });
    if (result.rows.length !== 1) {
        return null;
    }
    const row = result.rows[0];
    return {
        id: row[0],
        userId: row[1],
        status: row[2],
        totalPrice: row[3],
        shippingId: row[4],
        createdAt: row[5],
        updatedAt: row[6]
    };
}

export const insertOrderItemQuery = `-- name: InsertOrderItem :one
INSERT INTO order_items (order_id, product_variant_id, quantity)
Values ($1, $2, $3)
RETURNING id, order_id, product_variant_id, quantity, created_at`;

export interface InsertOrderItemArgs {
    orderId: number;
    productVariantId: number;
    quantity: number;
}

export interface InsertOrderItemRow {
    id: number;
    orderId: number;
    productVariantId: number;
    quantity: number;
    createdAt: Date | null;
}

export async function insertOrderItem(client: Client, args: InsertOrderItemArgs): Promise<InsertOrderItemRow | null> {
    const result = await client.query({
        text: insertOrderItemQuery,
        values: [args.orderId, args.productVariantId, args.quantity],
        rowMode: "array"
    });
    if (result.rows.length !== 1) {
        return null;
    }
    const row = result.rows[0];
    return {
        id: row[0],
        orderId: row[1],
        productVariantId: row[2],
        quantity: row[3],
        createdAt: row[4]
    };
}

export const deleteItemsFromBasketQuery = `-- name: DeleteItemsFromBasket :exec
DELETE FROM basket_items bi
WHERE bi.id = $1`;

export interface DeleteItemsFromBasketArgs {
    id: number;
}

export async function deleteItemsFromBasket(client: Client, args: DeleteItemsFromBasketArgs): Promise<void> {
    await client.query({
        text: deleteItemsFromBasketQuery,
        values: [args.id],
        rowMode: "array"
    });
}

export const insertItemToFavouritesQuery = `-- name: InsertItemToFavourites :one
INSERT INTO favourite_items (user_id, product_id)
VALUES ($1, $2)
RETURNING id, user_id, product_id, created_at, updated_at`;

export interface InsertItemToFavouritesArgs {
    userId: number;
    productId: number;
}

export interface InsertItemToFavouritesRow {
    id: number;
    userId: number;
    productId: number;
    createdAt: Date | null;
    updatedAt: Date | null;
}

export async function insertItemToFavourites(client: Client, args: InsertItemToFavouritesArgs): Promise<InsertItemToFavouritesRow | null> {
    const result = await client.query({
        text: insertItemToFavouritesQuery,
        values: [args.userId, args.productId],
        rowMode: "array"
    });
    if (result.rows.length !== 1) {
        return null;
    }
    const row = result.rows[0];
    return {
        id: row[0],
        userId: row[1],
        productId: row[2],
        createdAt: row[3],
        updatedAt: row[4]
    };
}

export const removeItemFromFavouritesQuery = `-- name: RemoveItemFromFavourites :exec
DELETE FROM favourite_items fi
WHERE fi.product_id = $1 and fi.user_id = $2`;

export interface RemoveItemFromFavouritesArgs {
    productId: number;
    userId: number;
}

export async function removeItemFromFavourites(client: Client, args: RemoveItemFromFavouritesArgs): Promise<void> {
    await client.query({
        text: removeItemFromFavouritesQuery,
        values: [args.productId, args.userId],
        rowMode: "array"
    });
}

export const getFavouriteByProductIdQuery = `-- name: GetFavouriteByProductId :many
SELECT id, user_id, product_id, created_at, updated_at
FROM favourite_items fi
WHERE fi.product_id = $1 and fi.user_id = $2`;

export interface GetFavouriteByProductIdArgs {
    productId: number;
    userId: number;
}

export interface GetFavouriteByProductIdRow {
    id: number;
    userId: number;
    productId: number;
    createdAt: Date | null;
    updatedAt: Date | null;
}

export async function getFavouriteByProductId(client: Client, args: GetFavouriteByProductIdArgs): Promise<GetFavouriteByProductIdRow[]> {
    const result = await client.query({
        text: getFavouriteByProductIdQuery,
        values: [args.productId, args.userId],
        rowMode: "array"
    });
    return result.rows.map(row => {
        return {
            id: row[0],
            userId: row[1],
            productId: row[2],
            createdAt: row[3],
            updatedAt: row[4]
        };
    });
}

export const getOpenConversationByIdQuery = `-- name: GetOpenConversationById :many
SELECT c.id, name, order_id, c.created_at, o.id, user_id, status, total_price, shipping_id, o.created_at, updated_at
FROM conversations c
         JOIN orders o on c.order_id = o.id
WHERE c.order_id = $1 AND o.status != $2`;

export interface GetOpenConversationByIdArgs {
    orderId: number;
    status: string;
}

export interface GetOpenConversationByIdRow {
    id: number;
    name: string;
    orderId: number;
    createdAt: Date | null;
    id_2: number;
    userId: number;
    status: string;
    totalPrice: number;
    shippingId: number;
    createdAt_2: Date | null;
    updatedAt: Date | null;
}

export async function getOpenConversationById(client: Client, args: GetOpenConversationByIdArgs): Promise<GetOpenConversationByIdRow[]> {
    const result = await client.query({
        text: getOpenConversationByIdQuery,
        values: [args.orderId, args.status],
        rowMode: "array"
    });
    return result.rows.map(row => {
        return {
            id: row[0],
            name: row[1],
            orderId: row[2],
            createdAt: row[3],
            id_2: row[4],
            userId: row[5],
            status: row[6],
            totalPrice: row[7],
            shippingId: row[8],
            createdAt_2: row[9],
            updatedAt: row[10]
        };
    });
}

export const insertProductQuery = `-- name: InsertProduct :exec
INSERT INTO products (name, description, price, option_1_name, option_2_name, special)
VALUES ($1, $2, $3, $4, $5, $6)`;

export interface InsertProductArgs {
    name: string;
    description: string;
    price: number;
    option_1Name: string;
    option_2Name: string;
    special: number | null;
}

export async function insertProduct(client: Client, args: InsertProductArgs): Promise<void> {
    await client.query({
        text: insertProductQuery,
        values: [args.name, args.description, args.price, args.option_1Name, args.option_2Name, args.special],
        rowMode: "array"
    });
}

export const updateProductQuery = `-- name: UpdateProduct :exec
UPDATE products
SET
    name = $2,
    description = $3,
    price = $4,
    option_1_name = $5,
    option_2_name = $6,
    special = $7
WHERE id = $1`;

export interface UpdateProductArgs {
    id: number;
    name: string;
    description: string;
    price: number;
    option_1Name: string;
    option_2Name: string;
    special: number | null;
}

export async function updateProduct(client: Client, args: UpdateProductArgs): Promise<void> {
    await client.query({
        text: updateProductQuery,
        values: [args.id, args.name, args.description, args.price, args.option_1Name, args.option_2Name, args.special],
        rowMode: "array"
    });
}

export const deleteProductByIDQuery = `-- name: DeleteProductByID :exec
DELETE FROM products
WHERE id = $1`;

export interface DeleteProductByIDArgs {
    id: number;
}

export async function deleteProductByID(client: Client, args: DeleteProductByIDArgs): Promise<void> {
    await client.query({
        text: deleteProductByIDQuery,
        values: [args.id],
        rowMode: "array"
    });
}

export const addProductCategoryByIDsQuery = `-- name: AddProductCategoryByIDs :exec
INSERT INTO product_categories (product_id, category_id)
SELECT $1, $2
WHERE NOT EXISTS (
    SELECT 1 FROM product_categories
    WHERE product_id = $1 AND category_id = $2
)`;

export interface AddProductCategoryByIDsArgs {
    productId: number;
    categoryId: number;
}

export async function addProductCategoryByIDs(client: Client, args: AddProductCategoryByIDsArgs): Promise<void> {
    await client.query({
        text: addProductCategoryByIDsQuery,
        values: [args.productId, args.categoryId],
        rowMode: "array"
    });
}

export const deleteProductCategoryByIDsQuery = `-- name: DeleteProductCategoryByIDs :exec
DELETE FROM product_categories
WHERE product_id=$1 and category_id=$2`;

export interface DeleteProductCategoryByIDsArgs {
    productId: number;
    categoryId: number;
}

export async function deleteProductCategoryByIDs(client: Client, args: DeleteProductCategoryByIDsArgs): Promise<void> {
    await client.query({
        text: deleteProductCategoryByIDsQuery,
        values: [args.productId, args.categoryId],
        rowMode: "array"
    });
}

export const getVariantByIdQuery = `-- name: GetVariantById :one
Select id, product_id, sku, price, stock_quantity, option_1_value, option_2_value, created_at
From product_variants
WHERE id = $1`;

export interface GetVariantByIdArgs {
    id: number;
}

export interface GetVariantByIdRow {
    id: number;
    productId: number;
    sku: string;
    price: number;
    stockQuantity: number;
    option_1Value: string;
    option_2Value: string;
    createdAt: Date | null;
}

export async function getVariantById(client: Client, args: GetVariantByIdArgs): Promise<GetVariantByIdRow | null> {
    const result = await client.query({
        text: getVariantByIdQuery,
        values: [args.id],
        rowMode: "array"
    });
    if (result.rows.length !== 1) {
        return null;
    }
    const row = result.rows[0];
    return {
        id: row[0],
        productId: row[1],
        sku: row[2],
        price: row[3],
        stockQuantity: row[4],
        option_1Value: row[5],
        option_2Value: row[6],
        createdAt: row[7]
    };
}

export const updateVariantQuery = `-- name: UpdateVariant :exec
UPDATE product_variants
SET
    sku = $2,
    stock_quantity = $3,
    price = $4,
    option_1_value = $5,
    option_2_value = $6
WHERE id = $1`;

export interface UpdateVariantArgs {
    id: number;
    sku: string;
    stockQuantity: number;
    price: number;
    option_1Value: string;
    option_2Value: string;
}

export async function updateVariant(client: Client, args: UpdateVariantArgs): Promise<void> {
    await client.query({
        text: updateVariantQuery,
        values: [args.id, args.sku, args.stockQuantity, args.price, args.option_1Value, args.option_2Value],
        rowMode: "array"
    });
}

export const insertVariantQuery = `-- name: InsertVariant :exec
INSERT INTO product_variants (product_id, sku, price, stock_quantity, option_1_value, option_2_value)
VALUES ($1, $2, $3, $4, $5, $6)`;

export interface InsertVariantArgs {
    productId: number;
    sku: string;
    price: number;
    stockQuantity: number;
    option_1Value: string;
    option_2Value: string;
}

export async function insertVariant(client: Client, args: InsertVariantArgs): Promise<void> {
    await client.query({
        text: insertVariantQuery,
        values: [args.productId, args.sku, args.price, args.stockQuantity, args.option_1Value, args.option_2Value],
        rowMode: "array"
    });
}

export const deleteVariantByIDQuery = `-- name: DeleteVariantByID :exec
DELETE FROM product_variants
WHERE id = $1`;

export interface DeleteVariantByIDArgs {
    id: number;
}

export async function deleteVariantByID(client: Client, args: DeleteVariantByIDArgs): Promise<void> {
    await client.query({
        text: deleteVariantByIDQuery,
        values: [args.id],
        rowMode: "array"
    });
}

export const updateCategoryQuery = `-- name: UpdateCategory :exec
UPDATE categories
SET
    name = $2
WHERE id = $1`;

export interface UpdateCategoryArgs {
    id: number;
    name: string;
}

export async function updateCategory(client: Client, args: UpdateCategoryArgs): Promise<void> {
    await client.query({
        text: updateCategoryQuery,
        values: [args.id, args.name],
        rowMode: "array"
    });
}

export const insertCategoryQuery = `-- name: InsertCategory :exec
INSERT INTO categories (name)
VALUES ($1)`;

export interface InsertCategoryArgs {
    name: string;
}

export async function insertCategory(client: Client, args: InsertCategoryArgs): Promise<void> {
    await client.query({
        text: insertCategoryQuery,
        values: [args.name],
        rowMode: "array"
    });
}

export const deleteCategoryByIDQuery = `-- name: DeleteCategoryByID :exec
DELETE FROM categories
WHERE id = $1`;

export interface DeleteCategoryByIDArgs {
    id: number;
}

export async function deleteCategoryByID(client: Client, args: DeleteCategoryByIDArgs): Promise<void> {
    await client.query({
        text: deleteCategoryByIDQuery,
        values: [args.id],
        rowMode: "array"
    });
}

export const getOrdersFillUserQuery = `-- name: GetOrdersFillUser :many
SELECT o.id, user_id, status, total_price, shipping_id, o.created_at, updated_at, users.id, google_id, email, name, avatar_url, users.created_at, role
From orders o
         JOIN users on o.user_id = users.id
order by o.id asc`;

export interface GetOrdersFillUserRow {
    id: number;
    userId: number;
    status: string;
    totalPrice: number;
    shippingId: number;
    createdAt: Date | null;
    updatedAt: Date | null;
    id_2: number;
    googleId: string;
    email: string;
    name: string;
    avatarUrl: string | null;
    createdAt_2: Date | null;
    role: number;
}

export async function getOrdersFillUser(client: Client): Promise<GetOrdersFillUserRow[]> {
    const result = await client.query({
        text: getOrdersFillUserQuery,
        values: [],
        rowMode: "array"
    });
    return result.rows.map(row => {
        return {
            id: row[0],
            userId: row[1],
            status: row[2],
            totalPrice: row[3],
            shippingId: row[4],
            createdAt: row[5],
            updatedAt: row[6],
            id_2: row[7],
            googleId: row[8],
            email: row[9],
            name: row[10],
            avatarUrl: row[11],
            createdAt_2: row[12],
            role: row[13]
        };
    });
}

export const getOrdersFillUserByStatusQuery = `-- name: GetOrdersFillUserByStatus :many
SELECT o.id, user_id, status, total_price, shipping_id, o.created_at, updated_at, users.id, google_id, email, name, avatar_url, users.created_at, role
From orders o
         JOIN users on o.user_id = users.id
WHERE status = $1
order by o.id asc`;

export interface GetOrdersFillUserByStatusArgs {
    status: string;
}

export interface GetOrdersFillUserByStatusRow {
    id: number;
    userId: number;
    status: string;
    totalPrice: number;
    shippingId: number;
    createdAt: Date | null;
    updatedAt: Date | null;
    id_2: number;
    googleId: string;
    email: string;
    name: string;
    avatarUrl: string | null;
    createdAt_2: Date | null;
    role: number;
}

export async function getOrdersFillUserByStatus(client: Client, args: GetOrdersFillUserByStatusArgs): Promise<GetOrdersFillUserByStatusRow[]> {
    const result = await client.query({
        text: getOrdersFillUserByStatusQuery,
        values: [args.status],
        rowMode: "array"
    });
    return result.rows.map(row => {
        return {
            id: row[0],
            userId: row[1],
            status: row[2],
            totalPrice: row[3],
            shippingId: row[4],
            createdAt: row[5],
            updatedAt: row[6],
            id_2: row[7],
            googleId: row[8],
            email: row[9],
            name: row[10],
            avatarUrl: row[11],
            createdAt_2: row[12],
            role: row[13]
        };
    });
}

export const getOrdersFillUserConvByStatusQuery = `-- name: GetOrdersFillUserConvByStatus :many
SELECT o.id, o.user_id, o.status, o.total_price, o.shipping_id, o.created_at, o.updated_at, u.email, c.id as convId
From orders o
         JOIN users u on o.user_id = u.id
         JOIN conversations c on o.id = c.order_id
WHERE status = $1
order by o.id asc`;

export interface GetOrdersFillUserConvByStatusArgs {
    status: string;
}

export interface GetOrdersFillUserConvByStatusRow {
    id: number;
    userId: number;
    status: string;
    totalPrice: number;
    shippingId: number;
    createdAt: Date | null;
    updatedAt: Date | null;
    email: string;
    convid: number;
}

export async function getOrdersFillUserConvByStatus(client: Client, args: GetOrdersFillUserConvByStatusArgs): Promise<GetOrdersFillUserConvByStatusRow[]> {
    const result = await client.query({
        text: getOrdersFillUserConvByStatusQuery,
        values: [args.status],
        rowMode: "array"
    });
    return result.rows.map(row => {
        return {
            id: row[0],
            userId: row[1],
            status: row[2],
            totalPrice: row[3],
            shippingId: row[4],
            createdAt: row[5],
            updatedAt: row[6],
            email: row[7],
            convid: row[8]
        };
    });
}

export const getOrderItemsByOrderIDQuery = `-- name: GetOrderItemsByOrderID :many
SELECT o.id, user_id, status, total_price, shipping_id, o.created_at, updated_at, oi.id, order_id, product_variant_id, quantity, oi.created_at, pv.id, product_id, sku, pv.price, stock_quantity, option_1_value, option_2_value, pv.created_at, p.id, name, description, p.price, p.created_at, special, option_1_name, option_2_name
FROM orders o
         JOIN order_items oi on oi.order_id = o.id
         JOIN product_variants pv on pv.id = oi.product_variant_id
         JOIN products p on p.id = pv.product_id
WHERE o.id = $1`;

export interface GetOrderItemsByOrderIDArgs {
    id: number;
}

export interface GetOrderItemsByOrderIDRow {
    id: number;
    userId: number;
    status: string;
    totalPrice: number;
    shippingId: number;
    createdAt: Date | null;
    updatedAt: Date | null;
    id_2: number;
    orderId: number;
    productVariantId: number;
    quantity: number;
    createdAt_2: Date | null;
    id_3: number;
    productId: number;
    sku: string;
    price: number;
    stockQuantity: number;
    option_1Value: string;
    option_2Value: string;
    createdAt_3: Date | null;
    id_4: number;
    name: string;
    description: string;
    price_2: number;
    createdAt_4: Date | null;
    special: number | null;
    option_1Name: string;
    option_2Name: string;
}

export async function getOrderItemsByOrderID(client: Client, args: GetOrderItemsByOrderIDArgs): Promise<GetOrderItemsByOrderIDRow[]> {
    const result = await client.query({
        text: getOrderItemsByOrderIDQuery,
        values: [args.id],
        rowMode: "array"
    });
    return result.rows.map(row => {
        return {
            id: row[0],
            userId: row[1],
            status: row[2],
            totalPrice: row[3],
            shippingId: row[4],
            createdAt: row[5],
            updatedAt: row[6],
            id_2: row[7],
            orderId: row[8],
            productVariantId: row[9],
            quantity: row[10],
            createdAt_2: row[11],
            id_3: row[12],
            productId: row[13],
            sku: row[14],
            price: row[15],
            stockQuantity: row[16],
            option_1Value: row[17],
            option_2Value: row[18],
            createdAt_3: row[19],
            id_4: row[20],
            name: row[21],
            description: row[22],
            price_2: row[23],
            createdAt_4: row[24],
            special: row[25],
            option_1Name: row[26],
            option_2Name: row[27]
        };
    });
}

export const getOrderByIDQuery = `-- name: GetOrderByID :one
Select id, user_id, status, total_price, shipping_id, created_at, updated_at
From orders
WHERE id = $1`;

export interface GetOrderByIDArgs {
    id: number;
}

export interface GetOrderByIDRow {
    id: number;
    userId: number;
    status: string;
    totalPrice: number;
    shippingId: number;
    createdAt: Date | null;
    updatedAt: Date | null;
}

export async function getOrderByID(client: Client, args: GetOrderByIDArgs): Promise<GetOrderByIDRow | null> {
    const result = await client.query({
        text: getOrderByIDQuery,
        values: [args.id],
        rowMode: "array"
    });
    if (result.rows.length !== 1) {
        return null;
    }
    const row = result.rows[0];
    return {
        id: row[0],
        userId: row[1],
        status: row[2],
        totalPrice: row[3],
        shippingId: row[4],
        createdAt: row[5],
        updatedAt: row[6]
    };
}

export const updateOrderStatusQuery = `-- name: UpdateOrderStatus :one
UPDATE orders
SET status = $2
WHERE id = $1
RETURNING id, user_id, status, total_price, shipping_id, created_at, updated_at`;

export interface UpdateOrderStatusArgs {
    id: number;
    status: string;
}

export interface UpdateOrderStatusRow {
    id: number;
    userId: number;
    status: string;
    totalPrice: number;
    shippingId: number;
    createdAt: Date | null;
    updatedAt: Date | null;
}

export async function updateOrderStatus(client: Client, args: UpdateOrderStatusArgs): Promise<UpdateOrderStatusRow | null> {
    const result = await client.query({
        text: updateOrderStatusQuery,
        values: [args.id, args.status],
        rowMode: "array"
    });
    if (result.rows.length !== 1) {
        return null;
    }
    const row = result.rows[0];
    return {
        id: row[0],
        userId: row[1],
        status: row[2],
        totalPrice: row[3],
        shippingId: row[4],
        createdAt: row[5],
        updatedAt: row[6]
    };
}

export const countConvByUserConvQuery = `-- name: CountConvByUserConv :one
SELECT count(*)
FROM conversations_users
WHERE user_id = $1 AND conversation_id = $2`;

export interface CountConvByUserConvArgs {
    userId: number;
    conversationId: number;
}

export interface CountConvByUserConvRow {
    count: string;
}

export async function countConvByUserConv(client: Client, args: CountConvByUserConvArgs): Promise<CountConvByUserConvRow | null> {
    const result = await client.query({
        text: countConvByUserConvQuery,
        values: [args.userId, args.conversationId],
        rowMode: "array"
    });
    if (result.rows.length !== 1) {
        return null;
    }
    const row = result.rows[0];
    return {
        count: row[0]
    };
}

export const getReviewsFillUserByProductIDQuery = `-- name: GetReviewsFillUserByProductID :many
SELECT r.id, sender_id, product_id, rating, content, r.created_at, u.id, google_id, email, name, avatar_url, u.created_at, role
FROM reviews r
         JOIN users u on r.sender_id = u.id
WHERE r.product_id = $1`;

export interface GetReviewsFillUserByProductIDArgs {
    productId: number;
}

export interface GetReviewsFillUserByProductIDRow {
    id: string;
    senderId: number;
    productId: number;
    rating: number;
    content: string;
    createdAt: Date;
    id_2: number;
    googleId: string;
    email: string;
    name: string;
    avatarUrl: string | null;
    createdAt_2: Date | null;
    role: number;
}

export async function getReviewsFillUserByProductID(client: Client, args: GetReviewsFillUserByProductIDArgs): Promise<GetReviewsFillUserByProductIDRow[]> {
    const result = await client.query({
        text: getReviewsFillUserByProductIDQuery,
        values: [args.productId],
        rowMode: "array"
    });
    return result.rows.map(row => {
        return {
            id: row[0],
            senderId: row[1],
            productId: row[2],
            rating: row[3],
            content: row[4],
            createdAt: row[5],
            id_2: row[6],
            googleId: row[7],
            email: row[8],
            name: row[9],
            avatarUrl: row[10],
            createdAt_2: row[11],
            role: row[12]
        };
    });
}

export const getCategoriesByProductIDQuery = `-- name: GetCategoriesByProductID :many
SELECT c.id, c.name, c.description
From categories c
         JOIN product_categories pc on c.id = pc.category_id
WHERE pc.product_id = $1`;

export interface GetCategoriesByProductIDArgs {
    productId: number;
}

export interface GetCategoriesByProductIDRow {
    id: number;
    name: string;
    description: string | null;
}

export async function getCategoriesByProductID(client: Client, args: GetCategoriesByProductIDArgs): Promise<GetCategoriesByProductIDRow[]> {
    const result = await client.query({
        text: getCategoriesByProductIDQuery,
        values: [args.productId],
        rowMode: "array"
    });
    return result.rows.map(row => {
        return {
            id: row[0],
            name: row[1],
            description: row[2]
        };
    });
}

export const getSpecialQuery = `-- name: GetSpecial :many
Select id, name
FROM special`;

export interface GetSpecialRow {
    id: number;
    name: string;
}

export async function getSpecial(client: Client): Promise<GetSpecialRow[]> {
    const result = await client.query({
        text: getSpecialQuery,
        values: [],
        rowMode: "array"
    });
    return result.rows.map(row => {
        return {
            id: row[0],
            name: row[1]
        };
    });
}

export const updateSpecialQuery = `-- name: UpdateSpecial :exec
UPDATE special
SET
    name = $2
WHERE id = $1`;

export interface UpdateSpecialArgs {
    id: number;
    name: string;
}

export async function updateSpecial(client: Client, args: UpdateSpecialArgs): Promise<void> {
    await client.query({
        text: updateSpecialQuery,
        values: [args.id, args.name],
        rowMode: "array"
    });
}

export const insertSpecialQuery = `-- name: InsertSpecial :exec
INSERT INTO special (name)
VALUES ($1)`;

export interface InsertSpecialArgs {
    name: string;
}

export async function insertSpecial(client: Client, args: InsertSpecialArgs): Promise<void> {
    await client.query({
        text: insertSpecialQuery,
        values: [args.name],
        rowMode: "array"
    });
}

export const deleteSpecialByIDQuery = `-- name: DeleteSpecialByID :exec
DELETE FROM special
WHERE id = $1`;

export interface DeleteSpecialByIDArgs {
    id: number;
}

export async function deleteSpecialByID(client: Client, args: DeleteSpecialByIDArgs): Promise<void> {
    await client.query({
        text: deleteSpecialByIDQuery,
        values: [args.id],
        rowMode: "array"
    });
}

export const getSpecialByIDQuery = `-- name: GetSpecialByID :one
SELECT id, name from special
WHERE id = $1`;

export interface GetSpecialByIDArgs {
    id: number;
}

export interface GetSpecialByIDRow {
    id: number;
    name: string;
}

export async function getSpecialByID(client: Client, args: GetSpecialByIDArgs): Promise<GetSpecialByIDRow | null> {
    const result = await client.query({
        text: getSpecialByIDQuery,
        values: [args.id],
        rowMode: "array"
    });
    if (result.rows.length !== 1) {
        return null;
    }
    const row = result.rows[0];
    return {
        id: row[0],
        name: row[1]
    };
}

export const getProductCategoriesManyToManyQuery = `-- name: GetProductCategoriesManyToMany :many
SELECT product_id, category_id from product_categories`;

export interface GetProductCategoriesManyToManyRow {
    productId: number;
    categoryId: number;
}

export async function getProductCategoriesManyToMany(client: Client): Promise<GetProductCategoriesManyToManyRow[]> {
    const result = await client.query({
        text: getProductCategoriesManyToManyQuery,
        values: [],
        rowMode: "array"
    });
    return result.rows.map(row => {
        return {
            productId: row[0],
            categoryId: row[1]
        };
    });
}

export const getBasketItemByBasketItemIdQuery = `-- name: GetBasketItemByBasketItemId :one
SELECT bi.id, user_id, product_variant_id, quantity, bi.created_at, updated_at, pv.id, product_id, sku, pv.price, stock_quantity, option_1_value, option_2_value, pv.created_at, p.id, name, description, p.price, p.created_at, special, option_1_name, option_2_name
FROM basket_items bi
         JOIN product_variants pv on pv.id = bi.product_variant_id
         JOIN products p on p.id = pv.product_id
WHERE bi.id = $1`;

export interface GetBasketItemByBasketItemIdArgs {
    id: number;
}

export interface GetBasketItemByBasketItemIdRow {
    id: number;
    userId: number;
    productVariantId: number;
    quantity: number;
    createdAt: Date | null;
    updatedAt: Date | null;
    id_2: number;
    productId: number;
    sku: string;
    price: number;
    stockQuantity: number;
    option_1Value: string;
    option_2Value: string;
    createdAt_2: Date | null;
    id_3: number;
    name: string;
    description: string;
    price_2: number;
    createdAt_3: Date | null;
    special: number | null;
    option_1Name: string;
    option_2Name: string;
}

export async function getBasketItemByBasketItemId(client: Client, args: GetBasketItemByBasketItemIdArgs): Promise<GetBasketItemByBasketItemIdRow | null> {
    const result = await client.query({
        text: getBasketItemByBasketItemIdQuery,
        values: [args.id],
        rowMode: "array"
    });
    if (result.rows.length !== 1) {
        return null;
    }
    const row = result.rows[0];
    return {
        id: row[0],
        userId: row[1],
        productVariantId: row[2],
        quantity: row[3],
        createdAt: row[4],
        updatedAt: row[5],
        id_2: row[6],
        productId: row[7],
        sku: row[8],
        price: row[9],
        stockQuantity: row[10],
        option_1Value: row[11],
        option_2Value: row[12],
        createdAt_2: row[13],
        id_3: row[14],
        name: row[15],
        description: row[16],
        price_2: row[17],
        createdAt_3: row[18],
        special: row[19],
        option_1Name: row[20],
        option_2Name: row[21]
    };
}

export const insertReviewQuery = `-- name: InsertReview :one
INSERT INTO reviews
(sender_id, product_id, rating, content)
VALUES ($1, $2, $3, $4)
returning id, sender_id, product_id, rating, content, created_at`;

export interface InsertReviewArgs {
    senderId: number;
    productId: number;
    rating: number;
    content: string;
}

export interface InsertReviewRow {
    id: string;
    senderId: number;
    productId: number;
    rating: number;
    content: string;
    createdAt: Date;
}

export async function insertReview(client: Client, args: InsertReviewArgs): Promise<InsertReviewRow | null> {
    const result = await client.query({
        text: insertReviewQuery,
        values: [args.senderId, args.productId, args.rating, args.content],
        rowMode: "array"
    });
    if (result.rows.length !== 1) {
        return null;
    }
    const row = result.rows[0];
    return {
        id: row[0],
        senderId: row[1],
        productId: row[2],
        rating: row[3],
        content: row[4],
        createdAt: row[5]
    };
}

export const insertShippingQuery = `-- name: InsertShipping :one
INSERT INTO shippings
(user_id, phone_number, address, house_number, postal_code, city, notes)
VALUES ($1, $2, $3, $4, $5, $6, $7)
returning id, user_id, phone_number, address, house_number, postal_code, city, notes`;

export interface InsertShippingArgs {
    userId: number;
    phoneNumber: string;
    address: string;
    houseNumber: string;
    postalCode: string;
    city: string;
    notes: string;
}

export interface InsertShippingRow {
    id: number;
    userId: number;
    phoneNumber: string;
    address: string;
    houseNumber: string;
    postalCode: string;
    city: string;
    notes: string;
}

export async function insertShipping(client: Client, args: InsertShippingArgs): Promise<InsertShippingRow | null> {
    const result = await client.query({
        text: insertShippingQuery,
        values: [args.userId, args.phoneNumber, args.address, args.houseNumber, args.postalCode, args.city, args.notes],
        rowMode: "array"
    });
    if (result.rows.length !== 1) {
        return null;
    }
    const row = result.rows[0];
    return {
        id: row[0],
        userId: row[1],
        phoneNumber: row[2],
        address: row[3],
        houseNumber: row[4],
        postalCode: row[5],
        city: row[6],
        notes: row[7]
    };
}

export const getLatestShippingByUserIdQuery = `-- name: GetLatestShippingByUserId :one
SELECT sh.id, sh.user_id, sh.phone_number, sh.address, sh.house_number, sh.postal_code, sh.city, sh.notes
FROM shippings sh
         JOIN users u on sh.user_id = u.id
WHERE u.email = $1
ORDER BY sh.id desc
LIMIT 1`;

export interface GetLatestShippingByUserIdArgs {
    email: string;
}

export interface GetLatestShippingByUserIdRow {
    id: number;
    userId: number;
    phoneNumber: string;
    address: string;
    houseNumber: string;
    postalCode: string;
    city: string;
    notes: string;
}

export async function getLatestShippingByUserId(client: Client, args: GetLatestShippingByUserIdArgs): Promise<GetLatestShippingByUserIdRow | null> {
    const result = await client.query({
        text: getLatestShippingByUserIdQuery,
        values: [args.email],
        rowMode: "array"
    });
    if (result.rows.length !== 1) {
        return null;
    }
    const row = result.rows[0];
    return {
        id: row[0],
        userId: row[1],
        phoneNumber: row[2],
        address: row[3],
        houseNumber: row[4],
        postalCode: row[5],
        city: row[6],
        notes: row[7]
    };
}

