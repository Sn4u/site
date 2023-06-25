from flask import Flask, render_template, request
from newsgetter import get_news

app = Flask(__name__)

@app.route("/")
def home():
    return render_template("base.html", newsitems=get_news(), ip=request.remote_addr)

@app.route("/nft")
def nft():
    return render_template("nft.html")

@app.route("/guestbook")
def guestbook():
    return render_template("guestbook .html")

if __name__ == "__main__":
    app.run(host='192.168.178.65', debug=True)