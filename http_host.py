from http.server import BaseHTTPRequestHandler, HTTPServer
from random import randint
from sys import argv
from urllib.parse import urlparse
from urllib.parse import parse_qs
from database.reader_writer import Reader

page_locaiton = "./page"
data_location = "./data"

name = "localhost"
port = 8080
args = iter(argv)
for arg in args:
    if arg == "-p":
        port = int(next(args))
    elif arg == "--visible":
        name = "0.0.0.0"
    elif arg == "--hidden":
        name = "localhost"


test_texts = 3
class TypingTestHandler(BaseHTTPRequestHandler):
    def text_response(self):
        self.send_response(200)
        self.send_header('Content-type', 'text/plain')
        self.end_headers()
        test_line = randint(0, test_texts - 1)

        with open(f'{data_location}/test.txt', 'rb') as fp:
            for i, line in enumerate(fp):
                if i == test_line:
                    self.wfile.write(line)
                    break
    def html_response(self):
        self.send_response(200)
        self.send_header('Content-type', 'text/html')
        self.end_headers()
        with open(f'{page_locaiton}/index.html', 'rb') as fp:
            for line in fp:
                self.wfile.write(line)

    def css_response(self):
        self.send_response(200)
        self.send_header('Content-type', 'text/css')
        self.end_headers()
        with open(f'{page_locaiton}/style.css', 'rb') as fp:
            for line in fp:
                self.wfile.write(line)
    def js_response(self):
        self.send_response(200)
        self.send_header('Content-type', 'text/javascript')
        self.end_headers()
        with open(f'{page_locaiton}/script.js', 'rb') as fp:
            for line in fp:
                self.wfile.write(line)
    def favicon_response(self):
        self.send_response(200)
        self.send_header('Content-type', 'image/x-icon')
        self.end_headers()
        with open(f'{page_locaiton}/favicon.ico', 'rb') as fp:
            for line in fp:
                self.wfile.write(line)

    def is_valid_user(self):
        qs = parse_qs(urlparse(self.path).query)
        username = qs["username"][0]
        password = qs["password"][0]
        expected_user = Reader().get_user_password(username)
        if password == expected_user:
            return True

    
    def do_POST(self):
        return
        content_length = int(self.headers['Content-Length'])  # Get the size of data
        post_data = self.rfile.read(content_length)  # Get the data itself
        #TODO: JS stuff
        if self.path == "/login":
            # expected_user = Reader().get_user_password(username)
            

    def do_GET(self):
        match (self.path):
            case '/test.txt':
                self.text_response()
            case '/':
                self.html_response()
            case '/style.css':
                self.css_response()
            case '/script.js':
                self.js_response()
            case '/favicon.ico':
                self.favicon_response()

if __name__ == '__main__':
    server_address = (name, port)
    httpd = HTTPServer(server_address, TypingTestHandler)
    print(f"Server available at: {name}:{port}")
    httpd.serve_forever()
