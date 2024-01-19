class Discount_rule:
    def __init__(self,product_qnty_details):
        self.product_qnty_details=product_qnty_details
        self.flat_10_dis_val=200
        self.bulk_5_dis_val=10
        self.bulk_10_dis_req=20
        self.tiered_50_dis_req=30
        self.tiered_50_dis_req_2=15
        self.shipping_lot=10
        self.shipping_cost_per_unir=5
        
    def to_get_wrap_cost(self):
        total_gify_wrap_cost=0
        for s_product in self.product_qnty_details:
            if self.product_qnty_details[s_product]["gift_wrap"]=="y":
                total_gify_wrap_cost=total_gify_wrap_cost+self.product_qnty_details[s_product]["quantity"]*1
        return total_gify_wrap_cost
                 
    def to_get_total_sum(self):
        total_sum=0
        for s_product in self.product_qnty_details:
            total_sum=total_sum+(self.product_qnty_details[s_product]["price"]*self.product_qnty_details[s_product]["quantity"])
        return total_sum

    def to_get_total_qty(self):
        total_qnty=0
        for s_product in self.product_qnty_details:
            total_qnty=total_qnty+self.product_qnty_details[s_product]["quantity"]
        return total_qnty
    
    def to_get_shipping_cost(self):
        total_all_quantity=self.to_get_total_qty()
        total_shipment_lot=total_all_quantity//self.shipping_lot
        if total_all_quantity%self.shipping_lot!=0:
            total_shipment_lot=total_shipment_lot+1
        return total_shipment_lot*self.shipping_cost_per_unir
        
    def flat_10_discount(self):
        discount_price=10
        if self.to_get_total_sum() > self.flat_10_dis_val:
            after_discount_total=self.to_get_total_sum()-discount_price
            return ["flat_10_discount","Yes",after_discount_total,self.to_get_total_sum()-after_discount_total]
        
    def bulk_5_discount(self):
        total_sum=0
        discount_per=5
        discount_status="No"
        for s_product in self.product_qnty_details:
            if self.product_qnty_details[s_product]["quantity"]>self.bulk_5_dis_val:
                total_sum=total_sum+(self.product_qnty_details[s_product]["price"]*self.product_qnty_details[s_product]["quantity"]
                                    *((100-discount_per)/100))
                discount_status="Yes"
            else:
                total_sum=total_sum+(self.product_qnty_details[s_product]["price"]*self.product_qnty_details[s_product]["quantity"])
        return ["bulk_5_discount",discount_status,total_sum,self.to_get_total_sum()-total_sum]
    
    def bulk_10_discount(self):
        total_sum=self.to_get_total_sum()
        discount_per=10
        if self.to_get_total_qty()> self.bulk_10_dis_req:
            total_sum=total_sum*((100-discount_per)/100)
            return ["bulk_10_discount","Yes",total_sum,self.to_get_total_sum()-total_sum]
        else:
            return ["bulk_10_discount","No",total_sum,self.to_get_total_sum()-total_sum]
        
    def tiered_50_discount(self):
        total_count=self.to_get_total_qty()
        total_sum=0
        discount_per=50
        discount_status="No"
        for s_product in self.product_qnty_details:
            if total_count>self.tiered_50_dis_req and self.product_qnty_details[s_product]["quantity"]>self.tiered_50_dis_req_2:
                total_sum=total_sum+(self.tiered_50_dis_req_2*self.product_qnty_details[s_product]["price"])
                total_sum=total_sum+((self.product_qnty_details[s_product]["quantity"]-self.tiered_50_dis_req_2)*
                          self.product_qnty_details[s_product]["price"]*((100-discount_per)/100))
                discount_status="Yes"
            else:
                total_sum=total_sum+(self.product_qnty_details[s_product]["price"]*self.product_qnty_details[s_product]["quantity"])
        
        return ["tiered_50_discount",discount_status,total_sum,self.to_get_total_sum()-total_sum]
    
            
def take_user_input(product_cat):
    final_product_order=product_cat.copy()
    for s_product in product_cat:
        product_quantity=eval(input(f"Please Enter {s_product} quantity You Want?"))
        gift_wrap=input(f"Want to wrap Product as Gift? 'Enter y or n'")
        final_product_order[s_product]["quantity"]=product_quantity
        final_product_order[s_product]["gift_wrap"]=gift_wrap
    return final_product_order

product_catalogue=take_user_input({
    "Product_A" :{"price":20,
                 "quantity":0},
    "Product_B" :{"price":40,
                 "quantity":0},
    "Product_C" :{"price":50,
                 "quantity":0}
})

get_discount_rule=Discount_rule(product_catalogue)
all_discount_details=[]
all_discount_details.append(get_discount_rule.flat_10_discount())
all_discount_details.append(get_discount_rule.bulk_5_discount())
all_discount_details.append(get_discount_rule.bulk_10_discount())
all_discount_details.append(get_discount_rule.tiered_50_discount())

total_amount_before_dic=get_discount_rule.to_get_total_sum()        
best_discount=max(all_discount_details, key=lambda x: x[3])
final_amount_after_discount = best_discount[2]
final_discount_amount = best_discount[3]
final_discount_name = best_discount[0]
gift_wrapping_cost=get_discount_rule.to_get_wrap_cost()
total_shipping_cost=get_discount_rule.to_get_shipping_cost()
Final_total_bill_amount=final_amount_after_discount+gift_wrapping_cost+total_shipping_cost

print(f"{'#'*25} FINAL OUTPUT {'#'*25}")
for s_product_det in product_catalogue:
    print(f"{s_product_det}, Quantity: {product_catalogue[s_product_det]['quantity']}, Total Amount: {product_catalogue[s_product_det]['quantity']*product_catalogue[s_product_det]['price']}")
print(f"Total Amount Before Discount : {total_amount_before_dic}")
print(f"Discount_Name : {final_discount_name}, Discount_Amount : {final_discount_amount}")
print(f"Gift Wrap Fee : {gift_wrapping_cost}, Shipping Fee : {total_shipping_cost}")
print(f"Total : {Final_total_bill_amount}")

