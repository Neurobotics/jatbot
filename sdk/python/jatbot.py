from http.server import HTTPServer, BaseHTTPRequestHandler
import urllib.parse as ul

#Для подмены функционала JatBot, измените функции preprocessRequest, processAnswer и postprocessRequest

# Функция предобработки
def preprocessRequest(request):
   return request.replace("?", "")


# Функция, выводящая 'ответ' на 'запрос'
def processAnswer(request):
    answer = 'Ничего не знаю о ' + request
    return answer

# Функция постобработки
def postprocessRequest(answer):
    return answer + '!'

# Класс сервера на порту 1807, принимающий запросы вида:
# http://127.0.0.1:1807/preprocess=Сколько будет два плюс два?
# http://127.0.0.1:1807/answer=Сколько будет два плюс два
# http://127.0.0.1:1807/postprocess=Четыре
class SimpleHTTPRequestHandler(BaseHTTPRequestHandler):

    def do_GET(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('"Access-Control-Allow-Headers', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Content-Type', 'text/plain; charset=utf-8')
        self.end_headers()
        parts = self.path.split("answer=")
        worked = False
        if len(parts) > 1:
            request = ul.unquote_plus(parts[1])
            self.wfile.write(str.encode(processAnswer(request)))
            worked = True
        else:
          parts = self.path.split("postprocess=")
          if len(parts) > 1:
            answer = ul.unquote_plus(parts[1])
            self.wfile.write(str.encode(postprocessRequest(answer)))
            worked = True
          else:
            parts = self.path.split("preprocess=")
            if len(parts) > 1:
              request = ul.unquote_plus(parts[1])
              self.wfile.write(str.encode(preprocessRequest(request)))
              worked = True
        if worked == False:
          self.wfile.write("")


httpd = HTTPServer(('localhost', 1807), SimpleHTTPRequestHandler)
httpd.serve_forever()
