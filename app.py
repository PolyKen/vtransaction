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
        print("donothing")
    except Exception as e:
        print(e)
        return str(e)
    return 'test success'


@app.route('/process')
def process():
    try:
        buy_table, _ = read_ordered_table(0)
        sell_table, _ = read_ordered_table(1)
        latest_wish = read_latest_wish()
        mode = latest_wish[3]
        print(mode, buy_table, sell_table)
        process_transaction(mode, process_table(buy_table), process_table(sell_table))
    except Exception as e:
        print(e)
        return str(e)
    return 'process success'


@app.route('/read-wish/<mode>')
def read_wish(mode):
    assert (mode == "buy" or mode == "sell")
    try:
        if mode == "buy":
            _, buy_table = read_ordered_table(0)
            print("buy:", buy_table)
            return str(buy_table)
        if mode == "sell":
            _, sell_table = read_ordered_table(1)
            print("sell:", sell_table)
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


@app.route('/history/wish')
def history_wish():
    try:
        latest_wish = read_latest_history("wish_history")
        return str(latest_wish)
    except Exception as e:
        print(e)
        return str(e)


@app.route('/history/transaction')
def transaction_history():
    try:
        latest_transaction = read_latest_history("transaction")
        return str(latest_transaction)
    except Exception as e:
        print(e)
        return str(e)


if __name__ == '__main__':
    app.run(host="0.0.0.0", port="5000")
