import os
import time
from xml.etree import ElementTree

import requests


class TextToSpeech(object):
    def __init__(self, input_text, speech_key, service_region):
	#You need to create a config.py file and add your Azure keys in that file
        self.subscription_key = speech_key
        self.input_text = input_text
        self.timestr = time.strftime('%Y%m%d-%H%M')
        self.subscription_region = service_region
        self.access_token = None

    # This function performs the token exchange.
    def get_token(self):
        fetch_token_url = 'https://' + self.subscription_region + '.api.cognitive.microsoft.com/sts/v1.0/issueToken'
        headers = {
            'Ocp-Apim-Subscription-Key': self.subscription_key
        }
        response = requests.post(fetch_token_url, headers=headers)
        self.access_token = str(response.text)
        
    # This function calls the TTS endpoint with the access token.
    def save_audio(self):
        base_url = 'https://' + self.subscription_region + '.tts.speech.microsoft.com/'
        path = 'cognitiveservices/v1'
        constructed_url = base_url + path
        headers = {
            'Authorization': 'Bearer ' + self.access_token,
            'Content-Type': 'application/ssml+xml',
            'X-Microsoft-OutputFormat': 'riff-24khz-16bit-mono-pcm',
            'User-Agent': 'transferendum-development',
        }
        # Build the SSML request with ElementTree
        xml_body = ElementTree.Element('speak', version='1.0')
        xml_body.set('{http://www.w3.org/XML/1998/namespace}lang', 'zzh-TW')  # Simplified Chinese
        voice = ElementTree.SubElement(xml_body, 'voice')
        voice.set('{http://www.w3.org/XML/1998/namespace}lang', 'zh-TW')  # Simplified Chinese
        voice.set('name', 'Microsoft Server Speech Text to Speech Voice (zh-TW, HsiaoChenNeural)')  # Example of a Chinese voice font
        voice.text = self.input_text
        # The body must be encoded as UTF-8 to handle non-ascii characters.
        body = ElementTree.tostring(xml_body, encoding="utf-8")


        #Send the request
        response = requests.post(constructed_url, headers=headers, data=body)


        # Write the response as a wav file for playback. The file is located
        # in the same directory where this sample is run.
        return response.content