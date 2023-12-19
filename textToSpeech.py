import yaml
import azure.cognitiveservices.speech as speechsdk


# app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
with open('key.yaml', 'r') as file:
    # Load the YAML data
    creds = yaml.safe_load(file)

user_text = "CabinAI, 服務您的心"
speech_key = creds["AZURE_SPEECH_KEY"]
service_region = creds["AZURE_SERVICE_REGION"]

print(user_text)

speech_config = speechsdk.SpeechConfig(subscription=speech_key, region=service_region)
speech_config.speech_synthesis_voice_name = 'zh-TW-HsiaoChenNeural'

speech_synthesizer = speechsdk.SpeechSynthesizer(speech_config=speech_config, audio_config=None)
result = speech_synthesizer.speak_text_async(user_text).get()

stream = speechsdk.AudioDataStream(result)

print(stream)

filename = "static/speech/end.wav"
stream.save_to_wav_file(filename)