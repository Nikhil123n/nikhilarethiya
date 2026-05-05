from __future__ import annotations

import argparse
import json
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import urlparse


PROJECT_ROOT = Path(__file__).resolve().parents[1]
WORKSPACE_UUID = "d64af7b3-6fbb-4eaf-9f21-bf39f564c5dd"
DEVTOOLS_PATH = "/.well-known/appspecific/com.chrome.devtools.json"


class PortfolioRequestHandler(SimpleHTTPRequestHandler):
    def do_GET(self) -> None:
        path = urlparse(self.path).path

        if path == DEVTOOLS_PATH:
            payload = {
                "workspace": {
                    "root": str(PROJECT_ROOT),
                    "uuid": WORKSPACE_UUID,
                }
            }
            body = json.dumps(payload, indent=2).encode("utf-8")
            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.send_header("Content-Length", str(len(body)))
            self.end_headers()
            self.wfile.write(body)
            return

        if path == "/favicon.ico":
            self.send_response(204)
            self.end_headers()
            return

        super().do_GET()

    def handle(self) -> None:
        try:
            super().handle()
        except (BrokenPipeError, ConnectionAbortedError, ConnectionResetError):
            pass

    def finish(self) -> None:
        try:
            super().finish()
        except (BrokenPipeError, ConnectionAbortedError, ConnectionResetError):
            pass


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Serve the static portfolio locally.")
    parser.add_argument("--port", type=int, default=5173)
    parser.add_argument("--bind", default="", help="Address to bind. Defaults to all interfaces.")
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    handler = partial(PortfolioRequestHandler, directory=str(PROJECT_ROOT))

    with ThreadingHTTPServer((args.bind, args.port), handler) as server:
        host = args.bind or "localhost"
        print(f"Serving portfolio on http://{host}:{args.port}/")
        server.serve_forever()


if __name__ == "__main__":
    main()
