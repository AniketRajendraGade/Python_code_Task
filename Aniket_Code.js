class DiscountRule {
    constructor(productQuantityDetails) {
        this.productQuantityDetails = productQuantityDetails;
        this.flat10DisVal = 200;
        this.bulk5DisVal = 10;
        this.bulk10DisReq = 20;
        this.tiered50DisReq = 30;
        this.tiered50DisReq2 = 15;
        this.shippingLot = 10;
        this.shippingCostPerUnit = 5;
    }

    getWrapCost() {
        let totalGiftWrapCost = 0;
        for (let sProduct in this.productQuantityDetails) {
            if (this.productQuantityDetails[sProduct]["gift_wrap"] === "y") {
                totalGiftWrapCost += this.productQuantityDetails[sProduct]["quantity"] * 1;
            }
        }
        return totalGiftWrapCost;
    }

    getTotalSum() {
        let totalSum = 0;
        for (let sProduct in this.productQuantityDetails) {
            totalSum += this.productQuantityDetails[sProduct]["price"] * this.productQuantityDetails[sProduct]["quantity"];
        }
        return totalSum;
    }

    getTotalQty() {
        let totalQty = 0;
        for (let sProduct in this.productQuantityDetails) {
            totalQty += this.productQuantityDetails[sProduct]["quantity"];
        }
        return totalQty;
    }

    getShippingCost() {
        const totalAllQuantity = this.getTotalQty();
        let totalShipmentLot = Math.floor(totalAllQuantity / this.shippingLot);
        if (totalAllQuantity % this.shippingLot !== 0) {
            totalShipmentLot++;
        }
        return totalShipmentLot * this.shippingCostPerUnit;
    }

    flat10Discount() {
        const discountPrice = 10;
        if (this.getTotalSum() > this.flat10DisVal) {
            const afterDiscountTotal = this.getTotalSum() - discountPrice;
            return ["flat_10_discount", "Yes", afterDiscountTotal, this.getTotalSum() - afterDiscountTotal];
        }
    }

    bulk5Discount() {
        let totalSum = 0;
        const discountPer = 5;
        let discountStatus = "No";
        for (let sProduct in this.productQuantityDetails) {
            if (this.productQuantityDetails[sProduct]["quantity"] > this.bulk5DisVal) {
                totalSum += this.productQuantityDetails[sProduct]["price"] *
                    this.productQuantityDetails[sProduct]["quantity"] * ((100 - discountPer) / 100);
                discountStatus = "Yes";
            } else {
                totalSum += this.productQuantityDetails[sProduct]["price"] * this.productQuantityDetails[sProduct]["quantity"];
            }
        }
        return ["bulk_5_discount", discountStatus, totalSum, this.getTotalSum() - totalSum];
    }

    bulk10Discount() {
        let totalSum = this.getTotalSum();
        const discountPer = 10;
        if (this.getTotalQty() > this.bulk10DisReq) {
            totalSum *= (100 - discountPer) / 100;
            return ["bulk_10_discount", "Yes", totalSum, this.getTotalSum() - totalSum];
        } else {
            return ["bulk_10_discount", "No", totalSum, this.getTotalSum() - totalSum];
        }
    }

    tiered50Discount() {
        const totalCount = this.getTotalQty();
        let totalSum = 0;
        const discountPer = 50;
        let discountStatus = "No";
        for (let sProduct in this.productQuantityDetails) {
            if (totalCount > this.tiered50DisReq && this.productQuantityDetails[sProduct]["quantity"] > this.tiered50DisReq2) {
                totalSum += this.tiered50DisReq2 * this.productQuantityDetails[sProduct]["price"];
                totalSum += ((this.productQuantityDetails[sProduct]["quantity"] - this.tiered50DisReq2) *
                    this.productQuantityDetails[sProduct]["price"] * ((100 - discountPer) / 100));
                discountStatus = "Yes";
            } else {
                totalSum += this.productQuantityDetails[sProduct]["price"] * this.productQuantityDetails[sProduct]["quantity"];
            }
        }
        return ["tiered_50_discount", discountStatus, totalSum, this.getTotalSum() - totalSum];
    }
}

function takeUserInput(productCat) {
    const finalProductOrder = { ...productCat };
    for (let sProduct in productCat) {
        const productQuantity = parseInt(prompt(`Please Enter ${sProduct} quantity You Want?`));
        const giftWrap = prompt("Want to wrap Product as Gift? Enter 'y' or 'n'");
        finalProductOrder[sProduct]["quantity"] = productQuantity;
        finalProductOrder[sProduct]["gift_wrap"] = giftWrap;
    }
    return finalProductOrder;
}

const productCatalogue = takeUserInput({
    "Product_A": { "price": 20, "quantity": 0 },
    "Product_B": { "price": 40, "quantity": 0 },
    "Product_C": { "price": 50, "quantity": 0 }
});

const getDiscountRule = new DiscountRule(productCatalogue);
const allDiscountDetails = [];
allDiscountDetails.push(getDiscountRule.flat10Discount());
allDiscountDetails.push(getDiscountRule.bulk5Discount());
allDiscountDetails.push(getDiscountRule.bulk10Discount());
allDiscountDetails.push(getDiscountRule.tiered50Discount());

const totalAmountBeforeDiscount = getDiscountRule.getTotalSum();
const bestDiscount = allDiscountDetails.reduce((maxDiscount, discount) => (discount && discount[3] > maxDiscount[3] ? discount : maxDiscount), [0, "", 0, 0]);
const finalAmountAfterDiscount = bestDiscount[2];
const finalDiscountAmount = bestDiscount[3];
const finalDiscountName = bestDiscount[0];
const giftWrappingCost = getDiscountRule.getWrapCost();
const totalShippingCost = getDiscountRule.getShippingCost();
const finalTotalBillAmount = finalAmountAfterDiscount + giftWrappingCost + totalShippingCost;

console.log(`######### FINAL OUTPUT #########`);
for (let sProductDet in productCatalogue) {
    console.log(`${sProductDet}, Quantity: ${productCatalogue[sProductDet]['quantity']}, Total Amount: ${productCatalogue[sProductDet]['quantity'] * productCatalogue[sProductDet]['price']}`);
}
console.log(`Total Amount Before Discount: ${totalAmountBeforeDiscount}`);
console.log(`Discount Name: ${finalDiscountName}, Discount Amount: ${finalDiscountAmount}`);
console.log(`Gift Wrap Fee: ${giftWrappingCost}, Shipping Fee: ${totalShippingCost}`);
console.log(`Total: ${finalTotalBillAmount}`);