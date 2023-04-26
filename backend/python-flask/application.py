from flask import Flask, request, jsonify
from flask_cors import CORS
import tiktoken

application = Flask(__name__)
CORS(application)

def num_tokens_from_string(string, encoding_name):
    """Returns the number of tokens in a text string."""
    encoding = tiktoken.get_encoding(encoding_name)
    num_tokens = len(encoding.encode(string))
    return num_tokens

@application.route('/api/count-tokens', methods=['POST'])
def count_tokens():
    data = request.json
    text = data['text']
    encoding_name = data['encoding_name']
    token_count = num_tokens_from_string(text, encoding_name)
    cost = token_count * 0.004 / 1000
    return jsonify(token_count=token_count, cost=cost)

if __name__ == '__main__':
    application.run(debug=True)
