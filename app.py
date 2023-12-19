import ssl
import wave

# import azure.cognitiveservices.speech as speechsdk
import openai
import requests
import yaml
from flask import Flask, jsonify, render_template, request
from flask_cors import CORS
from opencc import OpenCC
from pydub import AudioSegment

#text2voice
import synthesize
from chat_inference_package import (get_observation_based_on_user_reply,
                                    get_personaility_trait,
                                    get_reply_based_on_observation,
                                    initialize_model)

cc = OpenCC('s2twp')


ssl._create_default_https_context = ssl._create_unverified_context

app = Flask(__name__, static_folder='static')
CORS(app)

# app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
with open('key.yaml', 'r') as file:
    # Load the YAML data
    creds = yaml.safe_load(file)

ALLOWED_EXTENSIONS = {'wav'}
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def ensure_wav_format(filename):
    audio = AudioSegment.from_wav(filename)
    audio = audio.set_channels(1).set_frame_rate(16000)
    audio.export(filename, format="wav")

def identify_mbti_type(text):
    mbti_dict = {
        "建築師": "INTJ",
        "邏輯學家": "INTP",
        "指揮官": "ENTJ",
        "辯論家": "ENTP",
        "提倡者": "INFJ",
        "調停者": "INFP",
        "主人公": "ENFJ",
        "競選者": "ENFP",
        "物流師": "ISTJ",
        "守衛者": "ISFJ",
        "總經理": "ESTJ",
        "執政官": "ESFJ",
        "鑒賞家": "ISTP",
        "探險家": "ISFP",
        "企業家": "ESTP",
        "表演者": "ESFP"
    }
    for profession in mbti_dict:
        if profession in text:
            return mbti_dict[profession]
    return "ISTP"  # 如果沒有匹配的職業，返回 ISTP


def inspect_wav(filename):
    try:
        with wave.open(filename, 'rb') as w:
            print(f"Channels: {w.getnchannels()}")
            print(f"Sample width: {w.getsampwidth()}")
            print(f"Frame rate (sampling rate): {w.getframerate()}")
            print(f"Number of frames: {w.getnframes()}")
            print(f"Compression type: {w.getcomptype()}")
            print(f"Compression name: {w.getcompname()}")
            return True  # return True if file is valid

    except wave.Error as e:
        print(f"Error inspecting WAV file: {e}")
        return False  # return False if file is not valid

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/getTextReply', methods=['POST'])
def upload_file():
    AZURE_OPENAI_ENDPOINT = creds["AZURE_OPENAI_WHISPER_ENDPOINT"]
    AZURE_OPENAI_KEY = creds["AZURE_OPENAI_WHISPER_KEY"]

    if 'audio' not in request.files:
        return jsonify(success=False, error='No audio part'), 400
    file = request.files['audio']
    if file.filename == '':
        return jsonify(success=False, error='No selected file'), 400
    if file and allowed_file(file.filename):
        filename = "static/uploads/audio.wav"
        file.save(filename)

    try:
        myfiles = {'file': open(filename ,'rb')}

        headers = {
            "api-key": AZURE_OPENAI_KEY,
            # "Content-Type": "multipart/form-data"
        }
        url = f"{AZURE_OPENAI_ENDPOINT}/openai/deployments/whisper/audio/transcriptions?api-version=2023-09-01-preview"

        response = requests.post(
            url,
            headers=headers,
            files = myfiles
        )
        print(response.text)
        # soup = BeautifulSoup(response.content, 'html.parser')
        # print(soup.text)

        transcript = response.json().get('text', 'Text not found')
        print("transcript", transcript)

        # Assuming cc.convert() is a function you have to convert content
        transcript = cc.convert(transcript)
        print("cc.convert speechToText", transcript)

        return jsonify(success=True, transcribed_text=transcript)

    except Exception as e:
        return jsonify(success=False, error=f"whisper does not work{str(e)}"), 500

@app.route('/getGptObservation', methods=['POST'])
def get_gpt_observation():
    azure_api_key = creds["AZURE_OPENAI_KEY"]
    azure_api_base = creds["AZURE_OPENAI_BASE"]
    openai.api_type = "azure"
    openai.api_base = azure_api_base
    openai.api_version = "2023-03-15-preview"
    openai.api_key = azure_api_key

    model = initialize_model(azure_api_key) 

    # 從前端提取資料
    data = request.json
    ftd5_question = data.get('ftd5_question')
    user_reply = data.get('user_reply')
    plot = data.get('plot')
    
    if not (ftd5_question and user_reply and plot):
        return jsonify(success=False, error="Some required parameters are missing."), 400
    
    try:
        chatgpt_observation = get_observation_based_on_user_reply(ftd5_question, user_reply, model, plot)
        if chatgpt_observation == "GPT4回覆失敗":
            return jsonify(success=False, error=f"GPT4 does not work{str(e)}"), 500  
        
         # 簡轉繁(包含慣用詞)
        chatgpt_observation = cc.convert(chatgpt_observation)

    except Exception as e:
        return jsonify(success=False, error=f"GPT4 does not work{str(e)}"), 500
    
    return jsonify(success=True, chatgpt_observation=chatgpt_observation)


@app.route('/getGptReply', methods=['POST'])
def get_gpt_reply():
    azure_api_key = creds["AZURE_OPENAI_KEY"]
    azure_api_base = creds["AZURE_OPENAI_BASE"]
    openai.api_type = "azure"
    openai.api_base = azure_api_base
    openai.api_version = "2023-03-15-preview"
    openai.api_key = azure_api_key

    model = initialize_model(azure_api_key) 

    data = request.json
    ftd5_question = data.get('ftd5_question')
    user_reply = data.get('user_reply')
    plot = data.get('plot')
    chatgpt_observation = data.get('chatgpt_observation')
    
    if not (ftd5_question and user_reply and plot and chatgpt_observation):
        return jsonify(success=False, error="Some required parameters are missing."), 400
    
    try:
        # chatgpt_observation = get_observation_based_on_user_reply(ftd5_question, user_reply, model, plot)
        # if chatgpt_observation == "GPT4回覆失敗":
        #     return jsonify(success=False, error=f"GPT4 does not work{str(e)}"), 500

        reply = get_reply_based_on_observation(ftd5_question, user_reply, chatgpt_observation, model, plot)
        if reply == "GPT4回覆失敗":
            return jsonify(success=False, error=f"GPT4 does not work{str(e)}"), 500

        # 簡轉繁(包含慣用詞)
        reply = cc.convert(reply)
        print("cc.convert gpt4 reply", reply)
    except Exception as e:
        return jsonify(success=False, error=f"GPT4 does not work{str(e)}"), 500
    
    try:
        # save Gpt reply to wav file
        speech_key = creds["AZURE_SPEECH_KEY"]
        service_region = creds["AZURE_SERVICE_REGION"]

        tts = synthesize.TextToSpeech(reply, speech_key, service_region)
        tts.get_token()
        audio_response = tts.save_audio()

        filename = "static/speech/output.wav"
        with open(filename, 'wb') as f:
            f.write(audio_response)
    except Exception as e:
        return jsonify(success=False, error=f"TextToSpeech does not work{str(e)}"), 500
    
    return jsonify(success=True, reply=reply)


@app.route('/getGptConclusion', methods=['POST'])
def get_gpt_conclusion():
    azure_api_key = creds["AZURE_OPENAI_KEY"]
    azure_api_base = creds["AZURE_OPENAI_BASE"]
    openai.api_type = "azure"
    openai.api_base = azure_api_base
    openai.api_version = "2023-03-15-preview"
    openai.api_key = azure_api_key

    model = initialize_model(azure_api_key) 

    # 從前端提取資料
    data = request.json
    all_collected_observations = data.get('allCollectedObservations')
    user_replyList = data.get('userReplyList')
    plot = data.get('plot')

    if not (all_collected_observations and user_replyList and plot):
        return jsonify(success=False, error="Some required parameters are missing."), 400

    try:
        trait_response = get_personaility_trait(all_collected_observations, user_replyList, model, plot)
        if trait_response == "GPT4回覆失敗":
            return jsonify(success=False, error=f"GPT4回覆失敗"), 500
        print(trait_response)
    except Exception as e:
        return jsonify(success=False, error=f"GPT4回覆失敗"), 500
    

    # 簡轉繁(包含慣用詞)
    trait_response = cc.convert(trait_response)

    print("cc.convert gpt4 conclustion", trait_response)

    
    personality = identify_mbti_type(trait_response)
    print(personality)


    try:
        # save Gpt conclusion to wav file
        speech_key = creds["AZURE_SPEECH_KEY"]
        service_region = creds["AZURE_SERVICE_REGION"]

        tts = synthesize.TextToSpeech(trait_response, speech_key, service_region)
        tts.get_token()
        audio_response = tts.save_audio()

        filename = "static/speech/output.wav"
        with open(filename, 'wb') as f:
            f.write(audio_response)
    except Exception as e:
        return jsonify(success=False, error=f"TextToSpeech does not work{str(e)}"), 500
    
    # 將 reply 和 collected_observation 打包成 JSON 格式回傳給前端
    return jsonify(success=True, trait_response=trait_response, personality=personality)


@app.route('/get_speech', methods=['POST'])
def handle_get_speech():

    data = request.json
    user_text = data.get('userText')
    if not user_text:
        return jsonify(success=False, error="userText parameter is missing."), 400
    
    speech_key = creds["AZURE_SPEECH_KEY"]
    service_region = creds["AZURE_SERVICE_REGION"]

    print(user_text)

    try:
        tts = synthesize.TextToSpeech(user_text, speech_key, service_region)
        tts.get_token()
        audio_response = tts.save_audio()

        filename = "static/speech/output.wav"
        with open(filename, 'wb') as f:
            f.write(audio_response)
    except Exception as e:
        return jsonify(success=False, error=f"TextToSpeech does not work{str(e)}"), 500

    return jsonify(success=True)


if __name__ == '__main__':
    app.run(debug=True, port=5500)






