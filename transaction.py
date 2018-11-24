import time
import datetime
from database import *


def process_transaction(mode, buy_table, sell_table):
    while True:
        if len(buy_table) == 0 or len(sell_table) == 0:
            return

        highest_buy_price = buy_table[0]["price"]
        lowest_sell_price = sell_table[0]["price"]

        if highest_buy_price < lowest_sell_price:
            return
        else:
            if mode == 0: # buy
                buy_quantity = buy_table[0]["quantity"]
                buy_user = buy_table[0]["user"]
                for i in range(len(sell_table)):
                    sell_user = sell_table[i]["user"]
                    sell_quantity = sell_table[i]["quantity"]
                    sell_price = sell_table[i]["price"]
                    if buy_quantity < sell_quantity:
                        sell_table[i]["quantity"] -= buy_quantity
                        update_quantity(id=sell_table[i]["id"], new_value=sell_table[i]["quantity"])
                        
                        delete_wish(id=buy_table[0]["id"])
                        buy_table.pop(0)

                        add_transaction_to_db(buy_user, sell_user, buy_quantity, sell_price)
                        return buy_table, sell_table
                    else:
                        buy_quantity -= sell_quantity

                        delete_wish(id=sell_table[0]["id"])
                        sell_table.pop(0)
                        
                        add_transaction_to_db(buy_user, sell_user, sell_quantity, sell_price)
                        if buy_quantity > 0:
                            buy_table[0]["quantity"] = buy_quantity
                            update_quantity(id=buy_table[0]["id"], new_value=buy_table[0]["quantity"])
                        else:
                            delete_wish(id=buy_table[0]["id"])
                            buy_table.pop(0)
                            
                            return buy_table, sell_table

            if mode == 1:   # sell
                sell_quantity = sell_table[0]["quantity"]
                sell_user = sell_table[0]["user"]
                for i in range(len(buy_table)):
                    buy_user = buy_table[i]["user"]
                    buy_quantity = buy_table[i]["quantity"]
                    buy_price = buy_table[i]["price"]
                    if sell_quantity < buy_quantity:
                        buy_table[i]["quantity"] -= sell_quantity
                        update_quantity(id=buy_table[i]["id"], new_value=buy_table[i]["quantity"])
                        
                        delete_wish(id=sell_table[0]["id"])
                        sell_table.pop(0)
                        
                        add_transaction_to_db(buy_user, sell_user, sell_quantity, buy_price)
                        return buy_table, sell_table
                    else:
                        sell_quantity -= buy_quantity

                        delete_wish(id=buy_table[0]["id"])
                        buy_table.pop(0)
                        
                        add_transaction_to_db(buy_user, sell_user, buy_quantity, sell_price)
                        if sell_quantity > 0:
                            sell_table[0]["quantity"] = sell_quantity
                            update_quantity(id=buy_table[i]["id"], new_value=buy_table[i]["quantity"])
                        else:
                            delete_wish(id=sell_table[0]["id"])
                            sell_table.pop(0)
                            return buy_table, sell_table


def add_transaction_to_db(buy_user, sell_user, quantity, price):
    id = "null"
    dt = datetime.datetime.now().strftime("%Y%m%d%H%M%S")
    values = [id, "\'" + str(dt) + "\'", "\'" + str(buy_user) + "\'", "\'" + str(sell_user) + "\'", str(quantity), str(price)]
    insert("transaction", values)


# user: string, mode: int(0 or 1, buy or sell), quantity: int, price: float
def add_wish_to_db(user, mode, quantity, price):
    id = "null"
    dt = datetime.datetime.now().strftime("%Y%m%d%H%M%S")
    values = [id, "\'" + dt + "\'", "\'" + user + "\'", mode, quantity, price]
    insert("wish", values)

def process_table(raw_table):
    table = []
    for row in raw_table:
        id = row[0]
        time = row[1]
        user = row[2]
        mode = row[3]
        quantity = row[4]
        price = row[5]
        record = {"id": id, "time": time, "user": user, "quantity": quantity, "price": price}
        table.append(record)
    return table

def split_buy_and_sell_tables(wish_table):
    buy_table = []
    sell_table = []
    for row in wish_table:
        id = row[0]
        time = row[1]
        user = row[2]
        mode = row[3]
        quantity = row[4]
        price = row[5]
        record = {"id": id, "time": time, "user": user, "quantity": quantity, "price": price}
        if mode == 0:
            buy_table.append(record)
        else:
            sell_table.append(record)
    return buy_table, sell_table


def sort_by_key(table, key, order="decrease"):
    for i in range(len(table)):
        for j in range(i, len(table)):
            if order is "decrease":
                if table[i][key] < table[j][key]:
                    table[i], table[j] = table[j], table[i]
            if order is "rise":
                if table[i][key] > table[j][key]:
                    table[i], table[j] = table[j], table[i]