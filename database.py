import pymysql 
import time


db_user = ""
db_password = ""


def read_table(table_name):
    conn = pymysql.connect(host="localhost", user=db_user, passwd=db_password, db="vtransaction")
    table = []
    try:
        with conn.cursor() as cursor:
            cursor.execute("select * from " + table_name + ";")
            results = cursor.fetchall()
            for row in results:
                table.append(row)
    except Exception as e:
        print(e)
        conn.close()
        return -1
    finally:
        conn.close()
        return table

def insert(table_name, values):
    conn = pymysql.connect(host="localhost", user=db_user, passwd=db_password, db="vtransaction")
    table = []
    try:
        with conn.cursor() as cursor:
            values_str = "("
            for val in values:
                values_str += str(val) + ","
            values_str = values_str[:-1] + ")"
            cursor.execute("insert into " + table_name + " values " + values_str)
            conn.commit()
    except Exception as e:
        print(e)
        conn.close()
        return -1
    finally:
        conn.close()
        return table