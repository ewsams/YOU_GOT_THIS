import json
import os
from flask_cors import CORS
import numpy as np
from flask import Flask, request, jsonify
import openai
from dotenv import load_dotenv
import pdfplumber
from langchain.embeddings.openai import OpenAIEmbeddings
from langchain.text_splitter import CharacterTextSplitter
from langchain.vectorstores import FAISS
from langchain.chains.question_answering import load_qa_chain
from langchain.llms import OpenAI
import tiktoken
from werkzeug.utils import secure_filename
import tempfile
import requests

load_dotenv()

OPENAI_API_KEY = os.getenv('OPEN_API_KEY')
openai.api_key = OPENAI_API_KEY

# Global variables
docsearch = None
chain = None
audio_transcript = None
embedded_audio_summary = None
downloaded_embeddings = None


application = Flask(__name__)

CORS(application, resources={r"*": {"origins": ["http://localhost:4200",
     "http://you-got-this-front-end.s3-website-us-east-1.amazonaws.com"]}})

application.config['MAX_CONTENT_LENGTH'] = 100 * 1024 * 1024  # 100 MB limit


def num_tokens_from_string(string, encoding_name):
    """Returns the number of tokens in a text string."""
    encoding = tiktoken.get_encoding(encoding_name)
    num_tokens = len(encoding.encode(string))
    return num_tokens


def audio_summarizer(audio_file_path, system_prompt):
    audio_file = open(audio_file_path, "rb")
    transcript = openai.Audio.transcribe("whisper-1", audio_file)
    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user",
                "content": f"Summarize the following transcript into key bullet points:\n{transcript['text']}"}
        ]
    )
    return response['choices'][0]['message']['content']


@application.route('/api/count-tokens', methods=['POST'])
def count_tokens():
    data = request.json
    text = data['text']
    encoding_name = data['encoding_name']
    token_count = num_tokens_from_string(text, encoding_name)
    cost = token_count * 0.004 / 1000
    return jsonify(token_count=token_count, cost=cost)


@application.route('/api/embed-and-upload-pdf', methods=['POST'])
def embed_and_upload_pdf():
    global docsearch, chain

    # Check if a file was uploaded
    if 'pdf_file' not in request.files:
        return jsonify({"error": "No PDF file provided."})

    pdf_file = request.files['pdf_file']
    pdf_file_path = os.path.join(
        tempfile.mkdtemp(), secure_filename(pdf_file.filename))
    pdf_file.save(pdf_file_path)

    raw_text = ''
    with pdfplumber.open(pdf_file_path) as pdf:
        for page in pdf.pages:
            text = page.extract_text()
            if text:
                raw_text += text

    text_splitter = CharacterTextSplitter(
        separator="\n",
        chunk_size=1000,
        chunk_overlap=200,
        length_function=len,
    )
    texts = text_splitter.split_text(raw_text)

    embeddings = OpenAIEmbeddings(
        openai_api_key=OPENAI_API_KEY, model="text-embedding-ada-002", chunk_size=1000)
    docsearch = FAISS.from_texts(texts, embeddings)
    chain = load_qa_chain(
        OpenAI(openai_api_key=OPENAI_API_KEY))
    docsearch_json = json.dumps(docsearch.index.reconstruct(0).tolist())
    return jsonify({"message": "PDF embedded and uploaded successfully.",
                    "docsearch": docsearch_json})


@application.route('/api/query-embedded-pdf', methods=['POST'])
def query_embedded_pdf():
    global docsearch, chain
    if docsearch is None or chain is None:
        return jsonify({"error": "Please embed and upload a PDF before querying."})

    query = request.form.get('query')
    docs = docsearch.similarity_search(query)
    answer = chain.run(input_documents=docs, question=query)

    return jsonify({"answer": answer})


@application.route('/api/upload-audio', methods=['POST'])
def upload_audio():
    global audio_transcript, embedded_audio_summary, chain

    # Check if an audio file was uploaded
    if 'audio_file' not in request.files:
        return jsonify({"error": "No audio file provided."})

    audio_file = request.files['audio_file']
    audio_file_path = os.path.join(
        tempfile.mkdtemp(), secure_filename(audio_file.filename))
    audio_file.save(audio_file_path)

    # Call the audio_summarizer function with a generic system prompt
    audio_transcript = audio_summarizer(
        audio_file_path, "You are a language model good at creating summaries.")

    # Embed the audio transcript summary
    embeddings = OpenAIEmbeddings(
        openai_api_key=OPENAI_API_KEY, model="text-embedding-ada-002", chunk_size=1000)
    embedded_audio_summary = FAISS.from_texts([audio_transcript], embeddings)
    chain = load_qa_chain(
        OpenAI(openai_api_key=OPENAI_API_KEY))

    return jsonify({"message": "Audio file uploaded, summarized, and embedded successfully.",
                    "embedded_audio_summary": audio_transcript})


@application.route('/api/query-uploaded-audio', methods=['POST'])
def query_uploaded_audio():
    global embedded_audio_summary, chain
    if embedded_audio_summary is None or chain is None:
        return jsonify({"error": "Please upload an audio file before querying."})

    query = request.form.get('query')
    docs = embedded_audio_summary.similarity_search(query)
    answer = chain.run(input_documents=docs, question=query)

    return jsonify({"answer": answer})


@application.route('/api/query-uploaded-embeddings-audio', methods=['POST'])
def query_uploaded_embeddings_audio():
    chain = load_qa_chain(
        OpenAI(openai_api_key=OPENAI_API_KEY))

    data = request.get_json()
    transcript_url = data["embeddings_url"]
    query = data["query"]

    # Download the transcript from the S3 bucket
    transcript_response = requests.get(transcript_url)
    if transcript_response.status_code != 200:
        return jsonify({"error": "Failed to download transcript from S3."})
    transcript = transcript_response.text

    # Embed the downloaded transcript
    embeddings = OpenAIEmbeddings(
        openai_api_key=OPENAI_API_KEY, model="text-embedding-ada-002", chunk_size=1000)
    embedded_transcript = FAISS.from_texts([transcript], embeddings)

    docs = embedded_transcript.similarity_search(query)
    answer = chain.run(input_documents=docs, question=query)

    return jsonify({"answer": answer})


@application.route('/api/query-uploaded-embeddings-pdf', methods=['POST'])
def query_uploaded_embeddings_pdf():
    global chain

    embeddings_json = request.get_json()
    uploaded_pdf_embeddings = np.array([embeddings_json["embeddings"]])

    query = request.form.get('query')
    docs = FAISS.similarity_search(uploaded_pdf_embeddings, query)
    answer = chain.run(input_documents=docs, question=query)

    return jsonify({"answer": answer})


@application.route('/api/reset-embeddings', methods=['POST'])
def reset_embeddings():
    global docsearch, chain, audio_transcript, embedded_audio_summary, downloaded_embeddings
    docsearch = None
    chain = None
    audio_transcript = None
    embedded_audio_summary = None
    downloaded_embeddings = None
    return jsonify({"message": "Embeddings reset successfully."})


if __name__ == '__main__':
    application.run(debug=True)
