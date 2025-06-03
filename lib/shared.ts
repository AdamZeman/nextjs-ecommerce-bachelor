export function formatDate(objDate: Date | null | undefined) {
    if (!objDate){
        return
    }
    const date = new Date(objDate.toString());
    return date.toLocaleString();
}

export function formatPrice(
    objPrice: number | null | undefined,
    quantifier: number | null | undefined = 1
): string {
    if (typeof objPrice !== "number" || typeof quantifier !== "number") {
        return "0.00";
    }
    const result = (objPrice * quantifier) / 100;
    return "$"+result.toFixed(2);
}