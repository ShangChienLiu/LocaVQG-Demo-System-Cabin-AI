# Local imports
import json
import re

from chatgpt import Chatgpt
from message import *
from prompt_templates import *


def initialize_model(api_key):
    return Chatgpt(api_key)

def get_observation_based_on_user_reply(fdt_question, user_reply, model, plot):
    system_prompt = [{"role":"system", "content":get_observation_prompt(fdt_question, user_reply, plot)}]
    
    response = model.inference_gpt4(system_prompt)
    print("raw observation",response)

    try:
        text_response = response["content"]
        print("observation content",text_response)
        return text_response
    
    except Exception as e:
        error_message = "GPT4回覆失敗"
        return error_message




def get_reply_based_on_observation(fdt_question, user_reply, observation, model, plot):
    system_prompt = [
        { "role":"user", "content":"從現在開始，你不會產生任何問句。接下來的回覆你都不可以用'嗎, 呢,? 或？'回覆，你不可以問問題"},
        { "role":"assistant", "content":"好的，從現在開始，無論如何，我都不會產生任何問句。"},
        { "role":"user", "content":"從現在開始，你只會用繁體中文回覆喔！"},
        { "role":"assistant", "content":"好的，從現在開始，無論如何，我只會用繁體中文回覆"},
        { "role":"system", "content":get_reply_based_on_observation_prompt(fdt_question, user_reply, observation, plot)}       
        ]
    
    response = model.inference_gpt4(system_prompt)
    print("raw reply",response)

    try:
        # 從response字典中提取"content"鍵的值
        text_response = response["content"]
        print("reply content", text_response)
        return text_response
    except Exception as e:
        error_message = "GPT4回覆失敗"
        return error_message
        # if plot == '城市':
        #     return pauseStreetMessages[questionRound]["fakeAnswer"]
        # elif plot == '太空':
        #     return pauseSpaceMessages[questionRound]["fakeAnswer"]

def get_personaility_trait(observations, replys, model, plot):
    reply_infomations = "Observation historys:\n"
    count = 0
    for observation in observations:
        count +=1
        reply_infomations += f"({count}):{observation}\n"
    count = 0  
    reply_infomations += "User reply historys:\n"
    for reply in replys:
        count +=1
        reply_infomations += f"({count}):{reply}\n"

    system_prompt = [{"role":"system", "content":get_personality_prompt(reply_infomations, plot)}]
    
    response = model.inference_gpt4(system_prompt)
    print("raw conclusion",response)

    try:
        # 從response字典中提取"content"鍵的值
        text_response = response["content"]
        print("conclusion content", text_response)
        text_response = remove_response_prefix(text_response)
        return text_response
    except Exception as e:
        error_message = "GPT4回覆失敗"
        return error_message

def remove_response_prefix(text):
    prefixes = ["(Response): ", "(Response):"]
    for prefix in prefixes:
        if prefix in text:
            text = text.replace(prefix, '', 1)
    return text



