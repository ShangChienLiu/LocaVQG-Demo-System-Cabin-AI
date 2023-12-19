import openai
import requests
import yaml

import message
import synthesize

# app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
with open('key.yaml', 'r') as file:
    # Load the YAML data
    creds = yaml.safe_load(file)    

    speech_key = creds["AZURE_SPEECH_KEY"]
    service_region = creds["AZURE_SERVICE_REGION"]

    finalRespond = ["嘿! 這趟旅程跟您相處非常愉快! 我發現您像是一位邏輯學家，對小細節都非常有耐心，同時講話也充滿了魅力，很喜歡與您聊天! 祝您開車愉快!", "嘿! 這趟旅程跟您相處非常愉快! 我發現您跟我很像，是一位探險家，喜愛探索未知，同時充滿魅力的藝術家。期待我們下次再一起出發! 希望您在太空之旅玩得開心!"]


    count = 27
    while count < 28:
        context = message.pauseStreetMessages[count].get('message')

        if context:
            tts = synthesize.TextToSpeech(context, speech_key, service_region)
            tts.get_token()
            audio_response = tts.save_audio()
    
            filename = f'static/speech/backupAudio/StreetMessages{count}.wav'
            with open(filename, 'wb') as f:
                f.write(audio_response)

            count = count + 1

        else:
            count = count + 1

    # count = 15
    # while count < 16:
    #     context = message.pauseStreetMessages[count].get('fakeAnswer')

    #     if context:
    #         tts = synthesize.TextToSpeech(context, speech_key, service_region)
    #         tts.get_token()
    #         audio_response = tts.save_audio()

    #         filename = f'static/speech/backupAudio/StreetFakeAnswer{count}.wav'
    #         with open(filename, 'wb') as f:
    #             f.write(audio_response)
    #         count = count + 1

    #     else:
    #         count = count + 1

    # count = 0
    # while count < len(finalRespond):
    #     context = finalRespond[count]

    #     if context:
    #         tts = synthesize.TextToSpeech(context, speech_key, service_region)
    #         tts.get_token()
    #         audio_response = tts.save_audio()

    #         filename = f'static/speech/backupAudio/Respond{count}.wav'
    #         with open(filename, 'wb') as f:
    #             f.write(audio_response)
    #         count = count + 1
    #     else:
    #         count = count + 1

