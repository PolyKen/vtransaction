import pymysql 


def test_database():
    conn = pymysql.connect(host="localhost", user="", passwd="", db="vtransaction")
    try:
        with conn.cursor() as cursor:
            cursor = conn.cursor()
            cursor.execute("select * from users;")
            results = cursor.fetchall()
            for row in results:
                id = row[0]
                username = row[1]
                password = row[2]
                print(id, username, password)
    finally:
        conn.close()