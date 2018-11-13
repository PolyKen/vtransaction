import pymysql 


db_user = ""
db_password = ""


def test_database():
    conn = pymysql.connect(host="localhost", user=db_user, passwd=db_password, db="vtransaction")
    try:
        with conn.cursor() as cursor:
            cursor.execute("select * from users;")
            results = cursor.fetchall()
            for row in results:
                id = row[0]
                username = row[1]
                password = row[2]
                print(id, username, password)
    finally:
        conn.close()


def read_transaction():
    conn = pymysql.connect(host="localhost", user=db_user, passwd=db_password, db="vtransaction")
    table = []
    try:
        with conn.cursor() as cursor:
            cursor.execute("select * from transaction;")
            results = cursor.fetchall()
            for row in results:
                id = row[0]
                time = row[1]
                buy_user = row[2]
                sell_user = row[3]
                quantity = row[4]
                price = row[5]
                print(id, time, buy_user, sell_user, quantity, price)
                table.append(row)
    finally:
        conn.close()
        return table


def read_wish():
    conn = pymysql.connect(host="localhost", user=db_user, passwd=db_password, db="vtransaction")
    table = []
    try:
        with conn.cursor() as cursor:
            cursor.execute("select * from wish;")
            results = cursor.fetchall()
            for row in results:
                id = row[0]
                time = row[1]
                user = row[2]
                mode = row[3]
                quantity = row[4]
                price = row[5]
                print(id, time, user, mode, quantity, price)
                table.append(row)
    finally:
        conn.close()
        return table