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
    return 'success'

@app.route('/process')
def process():
    try:
        wish_table = read_table("wish")
    except Exception as e:
        print(e)
        return str(e)
    return 'success'

@app.route('/read')
def read():
    try:
        transaction_table = read_table("transaction")
        wish_table = read_table("wish")
        print('transaction:')
        print(transaction_table)
        print('wish')
        print(wish_table)
    except Exception as e:
        print(e)
        return str(e)
    return 'success'

@app.route('/write/')
def write():
    return 'nothing'


if __name__ == '__main__':
    app.run(host="0.0.0.0", port="5000")
