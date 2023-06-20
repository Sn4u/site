from flask import Flask, render_template
from newsgetter import get_news

app = Flask(__name__)

@app.route("/")
def home():
    return render_template("base.html", newsitems=get_news())

if __name__ == "__main__":
    app.run(debug=True)