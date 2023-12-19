import os

import azure.cognitiveservices.speech as speechsdk
import yaml

# Load credentials from the YAML file
with open('key.yaml', 'r') as file:
    creds = yaml.safe_load(file)

speech_key = creds["AZURE_SPEECH_KEY"]
service_region = creds["AZURE_SERVICE_REGION"]

# Configure the speech API
speech_config = speechsdk.SpeechConfig(subscription=speech_key, region=service_region)
speech_config.speech_synthesis_voice_name='zh-TW-HsiaoChenNeural'


print(speech_config)

speech_synthesizer = speechsdk.SpeechSynthesizer(speech_config=speech_config, audio_config=None)
print(speech_synthesizer)

result = speech_synthesizer.speak_text_async("I'm excited to try text to speech").get()
print(result)
stream = speechsdk.AudioDataStream(result)
audio_buffer = bytes(16000)
filled_size = stream.read_data(audio_buffer)
while filled_size > 0:
    print("{} bytes received.".format(filled_size))
    filled_size = stream.read_data(audio_buffer)
    print(audio_buffer)


# # Synthesize the text to the output file
speech_synthesis_result = speech_synthesizer.speak_text_async("I'm excited to try text to speech").get()

# if speech_synthesis_result.reason == speechsdk.ResultReason.SynthesizingAudioCompleted:
#     print("Speech synthesized and saved to [{}]".format(output_file_name))
# elif speech_synthesis_result.reason == speechsdk.ResultReason.Canceled:
#     cancellation_details = speech_synthesis_result.cancellation_details
#     print("Speech synthesis canceled: {}".format(cancellation_details.reason))
#     if cancellation_details.reason == speechsdk.CancellationReason.Error:
#         if cancellation_details.error_details:
#             print("Error details: {}".format(cancellation_details.error_details))
#             print("Did you set the speech resource key and region values?")

