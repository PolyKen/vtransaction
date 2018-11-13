import time
from database import *


def test_database():
    transaction_table = read_table("transaction")
    wish_table = read_table("wish")
    add_transaction("Tom", "Jerry", 10, 200)
    add_wish("Kenny", 0, 20, 1000)


def process_transaction(wish_table):
    mode = wish_table[-1][3]
    buy_table, sell_table = split_buy_and_sell_tables(wish_table)
    while True:
        if len(buy_table) == 0 or len(sell_table) == 0:
            return

        sort_by_key(buy_table, "price", "decrease")
        sort_by_key(sell_table, "price", "rise")
        highest_buy_price = buy_table[0]["price"]
        lowest_sell_price = sell_table[0]["price"]

        if highest_buy_price < lowest_sell_price:
            return
        else:
            if mode == 0: # buy
                buy_quantity = buy_table[0]["quantity"]
                for i in range(len(sell_table)):
                    sell_user = sell_table[i]["user"]
                    sell_quantity = sell_table[i]["quantity"]
                    sell_price = sell_table[i]["price"]
                    if buy_quantity < sell_quantity:
                        sell_table[i]["quantity"] -= buy_quantity
                        buy_table.pop(0)
                        return
                    else:
                        buy_quantity -= sell_quantity
                        sell_table.pop(0)
                        if buy_quantity > 0:
                            buy_table[0]["quantity"] = buy_quantity
                        else:
                            buy_table.pop(0)
                            return
            if mode == 1:
                sell_quantity = sell_table[0]["quantity"]
                for i in range(len(buy_table)):
                    buy_user = buy_table[i]["user"]
                    buy_quantity = buy_table[i]["quantity"]
                    buy_price = buy_table[i]["price"]
                    if sell_quantity < buy_quantity:
                        buy_table[i]["quantity"] -= sell_quantity
                        sell_table.pop(0)
                        return
                    else:
                        sell_quantity -= buy_quantity
                        buy_table.pop(0)
                        if sell_quantity > 0:
                            sell_table[0]["quantity"] = sell_quantity
                        else:
                            sell_table.pop(0)
                            return


def add_transaction(buy_user, sell_user, quantity, price):
    id = "null"
    dt = int(time.time())
    values = [id, dt, buy_user, sell_user, quantity, price]
    insert("transaction", values)


def add_wish(user, mode, quantity, price):
    id = "null"
    dt = int(time.time())
    values = [id, dt, user, mode, quantity, price]
    insert("wish", values)
    

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