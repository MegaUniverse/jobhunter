from flask import Flask, request, jsonify, send_from_directory
import os
import requests

app = Flask(__name__, static_folder="static")

@app.route("/")
def serve_index():
    return send_from_directory(app.static_folder, "index.html")

@app.route("/<path:path>")
def serve_static(path):
    return send_from_directory(app.static_folder, path)

# exemplo da sua API
@app.route("/api/jobs")
def get_jobs():
    query = request.args.get("query", "")
    page = request.args.get("page", "1")
    url = f"https://api.adzuna.com/v1/api/jobs/br/search/{page}?app_id=9448da63&app_key=7d4c3218999d914e87781ea7529bb1b3&results_per_page=20&what={query}&content-type=application/json"
    try:
        response = requests.get(url)
        data = response.json()
        results = []
        for job in data.get("results", []):
            results.append({
                "title": job["title"],
                "company": job["company"]["display_name"],
                "location": job["location"]["display_name"],
                "link": job["redirect_url"]
            })
        return jsonify({"results": results, "total": data.get("count", 200)})
    except Exception as e:
        return jsonify({"error": str(e)})

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 10000))
    app.run(host="0.0.0.0", port=port)
