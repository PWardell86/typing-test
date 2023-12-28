from http.server import BaseHTTPRequestHandler, HTTPServer
from random import randint

page_locaiton = "./page"
data_location = "./data"
name = "localhost"
port = 8080
test_texts = 3
class TypingTestHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        if self.path == '/test.txt':
            self.send_response(200)
            self.send_header('Content-type', 'text/plain')
            self.end_headers()
            test_line = randint(0, test_texts - 1)

            with open(f'{data_location}/test.txt', 'rb') as fp:
                for i, line in enumerate(fp):
                    print(1, line)
                    if i == test_line:
                        self.wfile.write(line)
                        break
        elif self.path == '/':
            self.send_response(200)
            self.send_header('Content-type', 'text/html')
            self.end_headers()
            with open(f'{page_locaiton}/index.html', 'rb') as fp:
                for line in fp:
                    self.wfile.write(line)

        elif self.path == '/style.css':
            self.send_response(200)
            self.send_header('Content-type', 'text/css')
            self.end_headers()
            with open(f'{page_locaiton}/style.css', 'rb') as fp:
                for line in fp:
                    self.wfile.write(line)

        elif self.path == '/script.js':
            self.send_response(200)
            self.send_header('Content-type', 'text/javascript')
            self.end_headers()
            with open(f'{page_locaiton}/script.js', 'rb') as fp:
                for line in fp:
                    self.wfile.write(line)

if __name__ == '__main__':
    server_address = (name, port)
    httpd = HTTPServer(server_address, TypingTestHandler)
    # print('Server running on port %s' % port)
    httpd.serve_forever()
