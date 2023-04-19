from flask import Flask, render_template, request, jsonify, send_from_directory
from py_vapid import Vapid
from pywebpush import webpush, WebPushException
import json
import os

app = Flask(__name__, static_folder="static")

vapid = Vapid.from_file("private_key.pem")
app.config["VAPID_PUBLIC_KEY"] = vapid.public_key
app.config["VAPID_PRIVATE_KEY"] = vapid.private_key

subscriptions = []

@app.route('/')
def index():
    return render_template('index.html', vapid_public_key=app.config["VAPID_PUBLIC_KEY"])

# Add a new route to save subscription data
@app.route("/subscriptions")
def list_subscriptions():
    return jsonify(subscriptions)

@app.route("/subscribe", methods=["POST"])
def subscribe():
    subscription = request.get_json()
    print("New subscription:", subscription)
    subscriptions.append(subscription)
    return jsonify({"status": "ok"})

@app.route("/send-notification", methods=["POST"])
def send_notification():
    data = request.get_json()
    title = data["title"]
    message = data["message"]

    with open("subscriptions.txt", "r") as f:
        subscriptions = json.load(f)

    vapid_private_key = VAPID_PRIVATE_KEY
    vapid_claims = {
        "sub": "mailto:cattlehound@yahoo.com"  # Replace with your email
    }

    for subscription in subscriptions:
        try:
            webpush(
                subscription,
                json.dumps({"title": title, "message": message}),
                vapid_private_key=vapid_private_key,
                vapid_claims=vapid_claims
            )
        except Exception as e:
            print("Failed to send notification:", e)

    return "Notification sent", 200


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, ssl_context=("cert.pem", "key.pem"), debug=False)
