from flask import Flask, render_template
from database import test_database

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


if __name__ == '__main__':
    app.run(host="0.0.0.0", port="5000")
