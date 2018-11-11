import MySQLdb as mysql


conn = mysql.connect(host="localhost", user="", passwd="", db="vtransaction")                                     
cursor = conn.cursor()
cursor.execute("select * from users;")                
results = cursor.fetchall()                                                             
for row in results:                                                                     
    id = row[0]                                                                    
    username = row[1]
    password = row[2]
    print(id, username, password)
                                                                                         
cursor.close()                                                                           
conn.close()