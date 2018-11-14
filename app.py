from flask import Flask, render_template
from database import *
from transaction import *

app = Flask(__name__)


@app.route('/')
def index():
    return render_template('index.html')

@app.route('/test')
def test():
    try:
        test_database()
    except Exception as e:
        print(e)
        return str(e)
    return 'test success'

@app.route('/process')
def process():
    try:
        wish_table = read_table("wish")
        process_transaction(wish_table)
    except Exception as e:
        print(e)
        return str(e)
    return 'process success'

@app.route('/read-transaction')
def read_transaction():
    try:
        transaction_table = read_table("transaction")
        print(transaction_table)
        return str(transaction_table)
    except Exception as e:
        print(e)
        return str(e)
    return 'read failed'

@app.route('/read-wish/<mode>')
def read_wish(mode):
    try:
        wish_table = read_table("wish")
        buy_table, sell_table = split_buy_and_sell_tables(wish_table)
        print(mode)
        if mode is "buy":
            print(buy_table)
            return str(buy_table)
        if mode is "sell":
            print(sell_table)
            return str(sell_table)
    except Exception as e:
        print(e)
        return str(e)
    return 'read failed'

@app.route('/add-wish/<user>/<mode>/<quantity>/<price>')
def add_wish(user, mode, quantity, price):
    try:
        add_wish_to_db(user, int(mode), int(quantity), float(price))
    except Exception as e:
        print(e)
        return str(e)
    return 'add success'


if __name__ == '__main__':
    app.run(host="0.0.0.0", port="5000")
