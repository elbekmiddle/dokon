export const formatPrice = 
(amount: number) =>{
    return new Intl.NumberFormat
    ("en-US", {
        style: "currency",
        currency: "USD",
        // minimumFractionDigits: 3,
    }).format(amount);
};