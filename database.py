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

def clear_table(table_name):
    conn = pymysql.connect(host="localhost", user=db_user, passwd=db_password, db="vtransaction")
    result = "clear failed"
    try:
        with conn.cursor() as cursor:
            cursor.execute("trancate table " + table_name)
            conn.commit()
            result = "clear success"
    except Exception as e:
        print(e)
        conn.close()
        return -1
    finally:
        conn.close()
        return result

def delete_wish(id):
    conn = pymysql.connect(host="localhost", user=db_user, passwd=db_password, db="vtransaction")
    result = "delete failed"
    try:
        with conn.cursor() as cursor:
            cursor.execute("delete from wish where id=" + str(id))
            conn.commit()
            result = "delete success"
    except Exception as e:
        print(e)
        conn.close()
        return -1
    finally:
        conn.close()
        return result

def delete_first_wish(mode):
    conn = pymysql.connect(host="localhost", user=db_user, passwd=db_password, db="vtransaction")
    result = "delete failed"
    try:
        with conn.cursor() as cursor:
            if mode == 0:
                cursor.execute("delete from wish where mode=0 limit 1")
            else:
                cursor.execute("delete from wish where mode=1 limit 1")
            conn.commit()
            result = "delete success"
    except Exception as e:
        print(e)
        conn.close()
        return -1
    finally:
        conn.close()
        return result

def update_quantity(id, new_value):
    conn = pymysql.connect(host="localhost", user=db_user, passwd=db_password, db="vtransaction")
    result = "update failed"
    try:
        with conn.cursor() as cursor:
            cursor.execute("update wish set quantity=" + new_value + " where id=" + id)
            conn.commit()
            result = "update success"
    except Exception as e:
        print(e)
        conn.close()
        return -1
    finally:
        conn.close()
        return result

def insert(table_name, values):
    conn = pymysql.connect(host="localhost", user=db_user, passwd=db_password, db="vtransaction")
    result = "insert failed"
    try:
        with conn.cursor() as cursor:
            values_str = "("
            for val in values:
                values_str += str(val) + ","
            values_str = values_str[:-1] + ")"
            print(values_str)
            cursor.execute("insert into " + table_name + " values " + values_str)
            conn.commit()
            result = "insert success"
    except Exception as e:
        print(e)
        conn.close()
        return -1
    finally:
        conn.close()
        return result
